type Email = string
interface Node {
    email: Email,
    countAsSource: number,
    countAsTarget: number
}
type BasicLink = { source: Node, target: Node }
interface Link extends BasicLink { count: number }

type ScriptDescriptor = {
    script: string,
    culprit_assignment_name: string,
    culprit_count: number,
    culprits: Email[],
 }

export default class CulpritGraph {
    nodes: Array<Node>
    links: Array<Link>

    constructor() {
        this.nodes = []
        this.links = []
    }

    findIndexLink(link: BasicLink) {
        return this.links.findIndex(l => {
            return (l.source.email === link.source.email &&
            l.target.email === link.target.email)
        })
    }
    findLinkSymmetric(link: BasicLink) {
        return this.links.findIndex(l => {
            return ((l.source.email === link.source.email ||
             l.source.email === link.target.email) &&
            (l.target.email === link.target.email ||
             l.target.email === link.source.email))
        })
    }
    findLinkSource(link: BasicLink) {
        return this.links.findIndex(l => {
            return l.source.email === link.source.email
        })
    }
    findLinkTarget(link: BasicLink) {
        return this.links.findIndex(l => {
            return l.target.email === link.target.email
        })
    }

    private addNode(link: BasicLink) {
        const sourceIndex = this.nodes.findIndex(n => n.email === link.source.email)
        const targetIndex = this.nodes.findIndex(n => n.email === link.target.email)

        if(sourceIndex < 0) {
            ++link.source.countAsSource
            this.nodes.push(link.source)
        } else {
            ++this.nodes[sourceIndex].countAsSource
        }

        if(targetIndex < 0) {
            ++link.target.countAsTarget
            this.nodes.push(link.target)
        } else {
            ++this.nodes[targetIndex].countAsTarget
        }
    }

    addLink(link: BasicLink) {
        this.addNode(link)

        const linkIndex = this.findLinkSymmetric(link)
        //console.log(linkIndex)
        if(linkIndex >= 0) {
            ++this.links[linkIndex].count
        } else {
            const linkToAdd: Link = {...link, count: 1 }
            this.links.push(linkToAdd)
        }
    }

    private createAllCombinations(array: Array<Email>): Array<BasicLink> {
        return array.flatMap((v, i) => {
            return array.slice(i+1).map(w => {
                const source: Node = { email: v, countAsSource: 0, countAsTarget: 0 }
                const target: Node = { email: w, countAsSource: 0, countAsTarget: 0 }
                return { source, target }
            })
        })
    }

    addPlagiat(plagiat: ScriptDescriptor) {
        const combinations = this.createAllCombinations(plagiat.culprits)
        combinations.forEach(c => this.addLink(c))
    }

    addPlagiats(plagiats: Array<ScriptDescriptor>) {
        plagiats.forEach(plagiat => this.addPlagiat(plagiat))
    }
}
