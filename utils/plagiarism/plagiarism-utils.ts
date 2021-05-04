import { Email, ScriptDescriptor} from './plagiarism.types'

/**
 * Removes duplicates from array
 */
export const removeDuplicates = <T>(arr: Array<T>): Array<T> => Array.from(new Set(arr))

/**
 * Filters only plagiats from the culprit from all of the plagiats
 */
export const getPlagiatsOfCulprit = (plagiats: ReadonlyArray<ScriptDescriptor>, culprit: Email): ScriptDescriptor[] => {
    return plagiats.filter(plagiat => plagiat.culprits.includes(culprit))
}

/**
 * Creates set of all culprits from plagiats
 */
export const createCulpritsSet = (plagiats: ReadonlyArray<ScriptDescriptor>): Array<Email> => {
    return removeDuplicates(plagiats.map(x => x.culprits).reduce((a, b) => a.concat(b), []))
}
/**
 * Creates set of all culprits (without the one in parameter) that had at least one common plagiat
 * @param plagiatsFiltered Array of all plagiats with relation to culprit
 * @param culprit Culprit whose coworkers are wanted
 */
export const createCoworkerSet = (plagiatsFiltered: ReadonlyArray<ScriptDescriptor>, culprit: Email): Array<Email> => {
    return createCulpritsSet(plagiatsFiltered).filter(x => x !== culprit)
}

/**
 * Counts how many plagiats has the culprit made
 */
export const countPlagiatsOfCulprit = (plagiats: ReadonlyArray<ScriptDescriptor>, culprit: Email): number => {
    return getPlagiatsOfCulprit(plagiats, culprit).length
}

/**
 * Resolves plagiat based on the id provided
 */
export const resolvePlagiat = (plagiats: Array<ScriptDescriptor>, id: number) => {
    // TODO: Connect to a back-end
    plagiats[id].resolved = true
    return plagiats
}

/**
 * Utility functions for sorting plagiarism suspicions array
 */
export const sortingFunctions = {
    countDSC: (a: ScriptDescriptor, b: ScriptDescriptor): number => {
        return b.culprit_count - a.culprit_count
    },
    countASC: (a: ScriptDescriptor, b: ScriptDescriptor): number => {
        return a.culprit_count - b.culprit_count
    },
    nameDSC: (a: ScriptDescriptor, b: ScriptDescriptor): number => {
        const name1 = a.culprit_assignment_name.toLowerCase()
        const name2 = b.culprit_assignment_name.toLowerCase()
        if(name1 > name2) return -1
        if(name1 < name2) return 1
        return 0
    },
    nameASC: (a: ScriptDescriptor, b: ScriptDescriptor): number => {
        const name1 = a.culprit_assignment_name.toLowerCase()
        const name2 = b.culprit_assignment_name.toLowerCase()
        if(name1 < name2) return -1
        if(name1 > name2) return 1
        return 0
    },
}
