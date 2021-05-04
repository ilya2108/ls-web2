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
