import PlagiatsList from "../../components/Plagiarism/PlagiatsList"
import { createCoworkerSet, getPlagiatsOfCulprit } from "./plagiarism-utils"

import { cloneDeep } from 'lodash'

import type { Email } from '../../components/Plagiarism/CulpritsGraph/CulpritsNetworkGraph'
export interface Node {
    email: Email,
    countAsSource: number,
    countAsTarget: number,
    depth: number
}
export type BasicLink = { source: Node, target: Node }
export interface Link extends BasicLink { count: number }

type ScriptDescriptor = {
    script: string,
    culprit_assignment_name: string,
    culprit_count: number,
    culprits: Email[],
 }

export default class CulpritGraph {

    private readonly _nodes: Array<Node>
    private readonly _links: Array<Link>

    public nodes: ReadonlyArray<Node>
    public links: ReadonlyArray<Link>

    constructor(plagiats: Array<ScriptDescriptor>, mainCulprit?: Email, depth: number = 0) {
        this._nodes = []
        this._links = []
        if(mainCulprit) {
            this.addPlagiatsMainCulprit(plagiats, mainCulprit, depth)
        } else {
            this.addPlagiats(plagiats)
        }

        this.nodes = cloneDeep(this._nodes)
        this.links = cloneDeep(this._links)
    }

    private createNode(email: Email, depth: number = 0) {
        return {
            email,
            countAsSource: 0,
            countAsTarget: 0,
            depth
        }
    }

    private findIndexLink(link: BasicLink) {
        return this._links.findIndex(l => {
            return (l.source.email === link.source.email &&
            l.target.email === link.target.email)
        })
    }
    private findLinkSymmetric(link: BasicLink) {
        return this._links.findIndex(l => {
            return ((l.source.email === link.source.email ||
             l.source.email === link.target.email) &&
            (l.target.email === link.target.email ||
             l.target.email === link.source.email))
        })
    }
    private findLinkSource(link: BasicLink) {
        return this._links.findIndex(l => {
            return l.source.email === link.source.email
        })
    }
    private findLinkTarget(link: BasicLink) {
        return this._links.findIndex(l => {
            return l.target.email === link.target.email
        })
    }

    private addNode(link: BasicLink) {
        const sourceIndex = this._nodes.findIndex(n => n.email === link.source.email)
        const targetIndex = this._nodes.findIndex(n => n.email === link.target.email)

        if(sourceIndex < 0) {
            ++link.source.countAsSource
            this._nodes.push(link.source)
        } else {
            ++this._nodes[sourceIndex].countAsSource
        }

        if(targetIndex < 0) {
            ++link.target.countAsTarget
            this._nodes.push(link.target)
        } else {
            ++this._nodes[targetIndex].countAsTarget
        }
    }

    private addLink(link: BasicLink) {
        this.addNode(link)

        const linkIndex = this.findLinkSymmetric(link)
        if(linkIndex >= 0) {
            ++this._links[linkIndex].count
        } else {
            const linkToAdd: Link = {...link, count: 1 }
            this._links.push(linkToAdd)
        }
    }

    private createAllCombinations(array: Array<Email>): Array<BasicLink> {
        return array.flatMap((v, i) => {
            return array.slice(i+1).map(w => {
                const source: Node = this.createNode(v)
                const target: Node = this.createNode(w)
                return { source, target }
            })
        })
    }

    private addPlagiat(plagiat: ScriptDescriptor) {
        const combinations = this.createAllCombinations(plagiat.culprits)
        combinations.forEach(c => this.addLink(c))
    }

    private addPlagiats(plagiats: Array<ScriptDescriptor>) {
        plagiats.forEach(plagiat => this.addPlagiat(plagiat))
    }

    private addCoworkers(coworkers: Array<Email>, mainCulprit: Email, depth: number) {
        const combinations = coworkers.map(coworker => {
            const source: Node = this.createNode(mainCulprit, depth)
            const target: Node = this.createNode(coworker, depth + 1)
            return { source, target }
        }).filter(c => {
            return !this._nodes.includes(c.target)
        })
        combinations.forEach(c => this.addLink(c))
    }

    private addPlagiatsMainCulprit(plagiats: Array<ScriptDescriptor>, mainCulprit: Email, depth = 0) {
        getPlagiatsOfCulprit(plagiats, mainCulprit).forEach(plagiat => {
            const coworkers = createCoworkerSet([plagiat], mainCulprit)
            this.addCoworkers(coworkers, mainCulprit, 0)
        })
        for(let i = 1; i < depth; ++i) {
            const culprits = this._nodes.filter(n => n.depth == i)
            culprits.forEach(culprit => {
                getPlagiatsOfCulprit(plagiats, culprit.email).forEach(plagiat => {
                    const coworkers = createCoworkerSet([plagiat], culprit.email)
                    this.addCoworkers(coworkers, culprit.email, i)
                })
            })
        }

        this._links.sort((a, b) => b.source.depth - a.source.depth)
    }
}
