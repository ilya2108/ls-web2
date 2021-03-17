import plagiats from './__fixtures__/plagiats1.json'

import { countPlagiatsOfCulprit, createCoworkerSet, createCulpritsSet, getPlagiatsOfCulprit, removeDuplicates } from './plagiarism-utils'

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
        expect(removeDuplicates([1,1,1,1,1,1,1,1,1,1])).toStrictEqual([1])
    })
    test("should return empty array", () => {
        expect(removeDuplicates([])).toStrictEqual([])
    })
})

describe("getPlagiatsOfCulprit function", () => {
    test("should return only the first plagiat", () => {
        const culprit = user1
        const res = getPlagiatsOfCulprit(plagiats, culprit)
        expect(res.includes(plagiats[0])).toBe(true)
        expect(res.length).toBe(1)
    })

    test("should return 3 plagiats", () => {
        const culprit = user2
        const res = getPlagiatsOfCulprit(plagiats, culprit)
        expect(res.length).toBe(3)
    })

    test("should not find any plagiats for a non-existent user", () => {
        const culprit = user3
        const res = getPlagiatsOfCulprit(plagiats, culprit)
        expect(res).toStrictEqual([])
    })
})

describe("createCulpritsSet function", () => {
    test("should find only the plagiats of the culprit", () => {
        const res = createCulpritsSet(plagiats)
        plagiats.forEach(plagiat => {
            plagiat.culprits.forEach(culprit => {
                expect(res.includes(culprit)).toBe(true)
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
        expect(res.includes("8495b25@fit.cvut.cz")).toBe(true)
        expect(res.includes("81830c2@fit.cvut.cz")).toBe(true)
        expect(res.includes(culprit)).toBe(false)
        expect(res.length).toBe(2)
    })

    test("should return an array of one user only", () => {
        const culprit = "f8ea00a@fit.cvut.cz"
        const filteredPlagiats = getPlagiatsOfCulprit(plagiats, culprit)
        const res = createCoworkerSet(filteredPlagiats, culprit)
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
