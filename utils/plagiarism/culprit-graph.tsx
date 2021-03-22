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

// Culprit graph utils
export default class CulpritGraph {
    private _nodes: Array<Node>
    private _links: Array<Link>

    public readonly nodes: ReadonlyArray<Node>
    public readonly links: ReadonlyArray<Link>

    constructor(plagiats: ReadonlyArray<ScriptDescriptor>, mainCulprit?: Email, depth: number = 0) {
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

    private findLinkSymmetric(link: BasicLink) {
        return this._links.findIndex(l => {
            return ((l.source.email === link.source.email ||
             l.source.email === link.target.email) &&
            (l.target.email === link.target.email ||
             l.target.email === link.source.email))
        })
    }

    private addNode(link: BasicLink) {
        const sourceIndex = this._nodes.findIndex(n => n.email === link.source.email)
        const targetIndex = this._nodes.findIndex(n => n.email === link.target.email)

        // If source node is new than add him otherwise just increase the source count
        if(sourceIndex < 0) {
            ++link.source.countAsSource
            this._nodes.push(link.source)
        } else {
            ++this._nodes[sourceIndex].countAsSource
        }
        // If target node is new than add him otherwise just increase the target count
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
        // If link already exists than only increase count otherwise create it
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

    private addPlagiats(plagiats: ReadonlyArray<ScriptDescriptor>) {
        plagiats.forEach(plagiat => this.addPlagiat(plagiat))
    }

    private addCoworkers(coworkers: ReadonlyArray<Email>, mainCulprit: Email, depth: number) {
        // Generate all combinations from mainculprit to coworkers
        const combinations = coworkers.map(coworker => {
            const source: Node = this.createNode(mainCulprit, depth)
            const target: Node = this.createNode(coworker, depth + 1)
            return { source, target }
        })
        // Add combinations as links and nodes
        combinations.forEach(c => this.addLink(c))
    }

    // Creates array of links and nodes from mainCulprit with certain depth
    private addPlagiatsMainCulprit(plagiats: ReadonlyArray<ScriptDescriptor>, mainCulprit: Email, depth = 0) {
        // Get all plagiats of the main culprit
        getPlagiatsOfCulprit(plagiats, mainCulprit).forEach(plagiat => {
            // Get all of his coworkers
            const coworkers = createCoworkerSet([plagiat], mainCulprit)
            // Add links from main culprit to his coworkers with depth 0
            this.addCoworkers(coworkers, mainCulprit, 0)
        })

        //For every depth > 0
        for(let i = 1; i < depth; ++i) {
            // Find all culprits that were added in the last iteration (have potential to add new links)
            const culprits = this._nodes.filter(n => n.depth == i)
            culprits.forEach(culprit => {
                // Foreach culprit find his plagiats
                getPlagiatsOfCulprit(plagiats, culprit.email).forEach(plagiat => {
                    // Foreach plagiat find all coworkers
                    const coworkers = createCoworkerSet([plagiat], culprit.email)
                    // Add links and nodes from culprit to all his coworkers
                    this.addCoworkers(coworkers, culprit.email, i)
                })
            })
        }

        this._links.sort((a, b) => b.source.depth - a.source.depth)
    }
}

export const tooltip = node => {
    return (
        <div>
            <strong style={{ color: node.color }}>Email: {node.id}</strong>
            <br />
            Number of plagiats: {node.count}
            <br />
            Depth: {node.depth}
        </div>
    )
}

// Settings utils
import type { Settings } from '../../components/Plagiarism/CulpritsGraph/CulpritsNetworkGraph'

const dynamicRepulsivityFunc = (n: number) => {
    if(n > 500) return 1
    if(n > 300) return 4
    if(n > 200) return 12
    if(n > 150) return 25
    if(n > 100) return 50
    if(n > 70) return 200
    if(n > 50) return 400
    if(n > 10) return 650
    if(n >= 1) return 1000
    else return 0
}
export const calculateRepulsivity = (manualRepulsivity: boolean, manualValue: number) => {
    if(manualRepulsivity) return () => manualValue
    else return (n: number) => dynamicRepulsivityFunc(n)
}

const dynamicRadiusFunc = (node: Node) => {
    return Math.min(Math.max(node.countAsSource + node.countAsTarget, 1), 8)
}
export const calculateRadius = (dynamicRadius: boolean) => {
    if(dynamicRadius) {
        return (node: Node) => dynamicRadiusFunc(node)
    } else {
        return () => 5
    }
}

const dynamicWidthFunc = (link: Link) => link.count

export const calculateLinkWidth = (dynamicWidth: boolean) => {
    if(dynamicWidth) {
        return (link: Link) => dynamicWidthFunc(link)
    } else {
        return () => 1
    }
}


export const defaultSettings: Settings = {
    repulsivity: {
        manualRepulsivity: false,
        manualValue: 10,
        function: dynamicRepulsivityFunc
    },
    radius: {
        dynamicRadius: true,
        function: dynamicRadiusFunc
    },
    linkWidth: {
        dynamicWidth: true,
        function: dynamicWidthFunc
    },
    depth: 1,
    animationsEnabled: false
}
