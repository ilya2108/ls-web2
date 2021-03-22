
import { countPlagiatsOfCulprit, createCoworkerSet, createCulpritsSet, getPlagiatsOfCulprit, removeDuplicates } from './plagiarism-utils'

const plagiats = [{
        "script": "awk -F':' 'BEGIN{max=0}($4==\"CZK\" && $3>max){max=$3}($4==\"EUR\" && $3*25>max){max=$3*25}END{printf\"%d\\n\",max}' \"$VYROBKY\"",
        "culprit_assignment_name": "2020-vt-xc",
        "culprit_count": 3,
        "culprits": [
            "e7a2297@fit.cvut.cz",
            "8495b25@fit.cvut.cz",
            "81830c2@fit.cvut.cz"
        ]},{
        "script": "#!/bin/bash\n\nname=\"$1\"\n\nif [ -d \"$name\" ]\nthen\nchmod -R a-w \"$name\";\nchmod o-x \"$name\";\nelse\necho \"$name neni adresar\" 2>&1\nfi",
        "culprit_assignment_name": "2020-vt-pf",
        "culprit_count": 2,
        "culprits": [
            "f161b94@fit.cvut.cz",
            "baf82e8@fit.cvut.cz"
        ]},{
        "script": "#! /bin/bash\n    if [ -d \"$1\" ]\n    then\n    chmod a-w,o-x \"$1\"\n    else\n    echo \"\"$1\" neni adresar\" >&2\n  fi",
        "culprit_assignment_name": "2020-vt-pf",
        "culprit_count": 2,
        "culprits": [
            "f8ea00a@fit.cvut.cz",
            "f1179bd@fit.cvut.cz"
        ]},{
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

const user1 = "e7a2297@fit.cvut.cz"
const user2 = "f8ea00a@fit.cvut.cz"
const user3 = "nonexistent@fit.cvut.cz"


describe("removeDuplicates function", () => {
    test("should not remove any element", () => {
        expect(removeDuplicates([1, 2, 3])).toStrictEqual([1, 2, 3])
    })
    test("should return 1,2,3 in this order", () => {
        expect(removeDuplicates([1, 1, 2, 2, 3, 3])).toStrictEqual([1, 2, 3])
    })
    test("should return 4,7,3 in this order", () => {
        expect(removeDuplicates([4, 7, 4, 4, 7, 3])).toStrictEqual([4, 7, 3])
    })
    test("should return array with 1 element", () => {
        expect(removeDuplicates([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])).toStrictEqual([1])
    })
    test("should return empty array", () => {
        expect(removeDuplicates([])).toStrictEqual([])
    })
})

describe("getPlagiatsOfCulprit function", () => {
    test("should return only the first plagiat", () => {
        const culprit = user1
        const res = getPlagiatsOfCulprit(plagiats, culprit)

        // The first culprit is only in the first plagiat
        expect(res.includes(plagiats[0])).toBe(true)
        expect(res.length).toBe(1)
    })

    test("should return 3 plagiats", () => {
        const culprit = user2
        const res = getPlagiatsOfCulprit(plagiats, culprit)

        // There are 3 plagiats that the user2 has
        expect(res.includes(plagiats[2])).toBe(true)
        expect(res.includes(plagiats[3])).toBe(true)
        expect(res.includes(plagiats[4])).toBe(true)
        expect(res.length).toBe(3)
    })

    test("should not find any plagiats for a non-existent user", () => {
        const culprit = user3
        const res = getPlagiatsOfCulprit(plagiats, culprit)

        expect(res).toStrictEqual([])
    })
})

describe("createCulpritsSet function", () => {
    test("should return array with every culprit once in it", () => {
        const res = createCulpritsSet(plagiats)

        plagiats.forEach(plagiat => {
            plagiat.culprits.forEach(culprit => {
                // Each culprit should be in the array
                expect(res.includes(culprit)).toBe(true)
                // Each culprit should be there only once
                expect(res.filter(x => x === culprit).length).toBe(1)
                // There should be only the culprits from plagiats (there are 9 of them)
                expect(res.length).toBe(9)
            })
        })
    })

    test("should not return any culprits when there are no plagiats", () => {
        const res = createCulpritsSet([])

        expect(res).toStrictEqual([])
    })
})

describe("createCoworkerSet function", () => {
    test("should return an array of 2 users", () => {
        const culprit = user1
        const filteredPlagiats = getPlagiatsOfCulprit(plagiats, culprit)
        const res = createCoworkerSet(filteredPlagiats, culprit)

        // User 1 has 2 coworkers (from plagiat index=0)
        expect(res.includes("8495b25@fit.cvut.cz")).toBe(true)
        expect(res.includes("81830c2@fit.cvut.cz")).toBe(true)
        expect(res.includes(culprit)).toBe(false)
        expect(res.length).toBe(2)
    })

    test("should return an array of one user only", () => {
        const culprit = "f8ea00a@fit.cvut.cz"
        const filteredPlagiats = getPlagiatsOfCulprit(plagiats, culprit)
        const res = createCoworkerSet(filteredPlagiats, culprit)

        // User 2 has only one coworker (from all of his plagiats)
        expect(res.includes("f1179bd@fit.cvut.cz")).toBe(true)
        expect(res.length).toBe(1)
    })

    test("should not return any coworkers (empty array) when the main culprit is non existent", () => {
        const res = createCoworkerSet([], "nonexistent@fit.cvut.cz")
        expect(res).toStrictEqual([])
    })
})

describe("countPlagiatsOfCulprit function", () => {
    test("should find 1 plagiat", () => {
        const culprit = user1
        expect(countPlagiatsOfCulprit(plagiats, culprit)).toBe(1)
    })

    test("should find 3 plagiats", () => {
        const culprit = user2
        expect(countPlagiatsOfCulprit(plagiats, culprit)).toBe(3)
    })

    test("should find 0 plagiats for a non-existent user", () => {
        const culprit = user3
        expect(countPlagiatsOfCulprit(plagiats, culprit)).toBe(0)
    })
})
