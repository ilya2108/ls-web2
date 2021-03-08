import plagiats from '../../pages/plagiarism/__fixtures__/res_final_exam_anonymized_pretty.json'

import { countPlagiatsOfCulprit, createCoworkerSet, createCulpritsSet, getPlagiatsOfCulprit, removeDuplicates } from './plagiarism-utils'

describe("removeDuplicates function", () => {
    test("Basic tests", () => {
        expect(removeDuplicates([1, 2, 3])).toStrictEqual([1, 2, 3])
        expect(removeDuplicates([1, 1, 2, 2, 3, 3])).toStrictEqual([1, 2, 3])
        expect(removeDuplicates([4, 7, 4, 4, 7, 3])).toStrictEqual([4, 7, 3])
    })

    test("Edge cases", () => {
        expect(removeDuplicates([])).toStrictEqual([])
        expect(removeDuplicates([1,1,1,1,1,1,1,1,1,1])).toStrictEqual([1])
    })
})

describe("getPlagiatsOfCulprit function", () => {
    test("Basic test - 1", () => {
        const culprit = "e7a2297@fit.cvut.cz"
        const res = getPlagiatsOfCulprit(plagiats, culprit)
        expect(res.includes(plagiats[0])).toBe(true)
        expect(res.length).toBe(1)
    })

    test("Basic test - 2", () => {
        const culprit = "f8ea00a@fit.cvut.cz"
        const res = getPlagiatsOfCulprit(plagiats, culprit)
        expect(res.length).toBe(3)
    })

    test("Edge case - non-existent user", () => {
        const culprit = "nonexistent@fit.cvut.cz"
        const res = getPlagiatsOfCulprit(plagiats, culprit)
        expect(res).toStrictEqual([])
    })
})

describe("createCulpritsSet function", () => {
    test("Basic test", () => {
        const res = createCulpritsSet(plagiats)
        plagiats.forEach(plagiat => {
            plagiat.culprits.forEach(culprit => {
                expect(res.includes(culprit)).toBe(true)
            })
        })
    })

    test("Edge case", () => {
        const res = createCulpritsSet([])
        expect(res).toStrictEqual([])
    })
})

describe("createCoworkerSet function", () => {
    test("Basic test - 1", () => {
        const culprit = "e7a2297@fit.cvut.cz"
        const filteredPlagiats = getPlagiatsOfCulprit(plagiats, culprit)
        const res = createCoworkerSet(filteredPlagiats, culprit)
        expect(res.includes("8495b25@fit.cvut.cz")).toBe(true)
        expect(res.includes("81830c2@fit.cvut.cz")).toBe(true)
        expect(res.includes("e7a2297@fit.cvut.cz")).toBe(false)
        expect(res.length).toBe(2)
    })

    test("Basic test - 2", () => {
        const culprit = "f8ea00a@fit.cvut.cz"
        const filteredPlagiats = getPlagiatsOfCulprit(plagiats, culprit)
        const res = createCoworkerSet(filteredPlagiats, culprit)
        expect(res.includes("f1179bd@fit.cvut.cz")).toBe(true)
        expect(res.length).toBe(1)
    })

    test("Edge case", () => {
        const res = createCulpritsSet([])
        expect(res).toStrictEqual([])
    })
})

describe("countPlagiatsOfCulprit function", () => {
    test("Basic test - 1", () => {
        const culprit = "e7a2297@fit.cvut.cz"
        expect(countPlagiatsOfCulprit(plagiats, culprit)).toBe(1)
    })

    test("Basic test - 2", () => {
        const culprit = "f8ea00a@fit.cvut.cz"
        expect(countPlagiatsOfCulprit(plagiats, culprit)).toBe(3)
    })

    test("Edge case - non-existent user", () => {
        const culprit = "nonexistent@fit.cvut.cz"
        expect(countPlagiatsOfCulprit(plagiats, culprit)).toBe(0)
    })
})
