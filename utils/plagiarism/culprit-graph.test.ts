
import CulpritGraph from './culprit-graph'

const plagiats = [{
        "script": "#! /bin/bash\nif [ $# -eq 1 ] \nthen \necho \"$1\" ;\nelif [ $# -eq 2 ] \nthen \necho \"$((\"$1\" * \"$2\"))\"\nelif [ $# -eq 3 ]\nthen\necho \"$((\"$1\" + \"$2\" + \"$3\"))\"\nfi",
        "culprit_assignment_name": "2020-vt-rc1",
        "culprit_count": 2,
        "culprits": [
            "f1179bd@fit.cvut.cz",
            "f8ea00a@fit.cvut.cz"
        ]},{
        "script": "#! /bin/bash\n    if [ -d $1 ]\n    then\n    chmod a-w,o-x \"$1\"\n    else\n    echo \"\"$1\" neni adresar\" >&2\n  fi",
        "culprit_assignment_name": "2020-vt-pf",
        "culprit_count": 2,
        "culprits": [
            "f1179bd@fit.cvut.cz",
            "f8ea00a@fit.cvut.cz"
        ]},{
        "script": "#!/bin/bash\nif [ -d \"$1\" ]\nthen\nchmod u-w \"$1\";\nchmod g-w \"$1\";\nchmod o-wx \"$1\";\nelse\necho \"$1 neni adresar\" >&2;\nfi",
        "culprit_assignment_name": "2020-vt-pf",
        "culprit_count": 2,
        "culprits": [
            "a09e93a@fit.cvut.cz",
            "32c30c9@fit.cvut.cz"
        ]}]

const user1 = "f8ea00a@fit.cvut.cz"
const user2 = "nonexistent@fit.cvut.cz"

describe("Culprit Graph Class - no main culprit", () => {
    test("should create 2 clusters (2 links, 4 nodes)", () => {
        const culpritGraph = new CulpritGraph(plagiats)

        expect(culpritGraph.links.length).toBe(2)
        expect(culpritGraph.nodes.length).toBe(4)

        // There should be 4 nodes - all culprits from plagiats
        expect(culpritGraph.nodes.filter(n => n.email === "f1179bd@fit.cvut.cz").length).toBe(1)
        expect(culpritGraph.nodes.filter(n => n.email === "f8ea00a@fit.cvut.cz").length).toBe(1)
        expect(culpritGraph.nodes.filter(n => n.email === "a09e93a@fit.cvut.cz").length).toBe(1)
        expect(culpritGraph.nodes.filter(n => n.email === "32c30c9@fit.cvut.cz").length).toBe(1)

        // There should be a link from user X -> Y or Y -> X (doesnt matter)
        expect(culpritGraph.links.filter(l => {
            return (l.source.email === "f1179bd@fit.cvut.cz" && l.target.email === "f8ea00a@fit.cvut.cz") ||
                   (l.source.email === "f8ea00a@fit.cvut.cz" && l.target.email === "f1179bd@fit.cvut.cz")
        }).length).toBe(1)

        expect(culpritGraph.links.filter(l => {
            return (l.source.email === "a09e93a@fit.cvut.cz" && l.target.email === "32c30c9@fit.cvut.cz") ||
                   (l.source.email === "32c30c9@fit.cvut.cz" && l.target.email === "a09e93a@fit.cvut.cz")
        }).length).toBe(1)
    })
})

describe("Culprit Graph Class - with main culprit", () => {
    test("should create link from main culprit to his only coworker", () => {
        const culpritGraph = new CulpritGraph(plagiats, user1)
        expect(culpritGraph.links.length).toBe(1)
        expect(culpritGraph.nodes.length).toBe(2)

        // There should be 2 nodes - main culprit + his coworker
        expect(culpritGraph.nodes.filter(n => n.email === "f1179bd@fit.cvut.cz").length).toBe(1)
        expect(culpritGraph.nodes.filter(n => n.email === "f8ea00a@fit.cvut.cz").length).toBe(1)

        // !!! With main culprit the direction matters (should be mainCulprit -> coworker not the other way around)
        expect(culpritGraph.links.filter(l => {
            return (l.source.email === "f8ea00a@fit.cvut.cz" && l.target.email === "f1179bd@fit.cvut.cz")
        }).length).toBe(1)
    })

    test("should return empty links and nodes arrays when the user is non-existent", () => {
        const culpritGraph = new CulpritGraph(plagiats, user2)
        expect(culpritGraph.links.length).toBe(0)
        expect(culpritGraph.nodes.length).toBe(0)
    })
})
