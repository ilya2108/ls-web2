type Email = string
type ScriptDescriptor = {
   script: string,
   culprit_assignment_name: string,
   culprit_count: number,
   culprits: Email[],
}

/**
 * Removes duplicates from array
 */
export const removeDuplicates = <T>(arr: Array<T>): Array<T> => Array.from(new Set(arr))

/**
 * Filters only plagiats from the culprit from all of the plagiats
 */
export const getPlagiatsOfCulprit = (plagiats: ScriptDescriptor[], culprit: Email): ScriptDescriptor[] => {
    return plagiats.filter(plagiat => plagiat.culprits.includes(culprit))
}

/**
 * Creates set of all culprits from plagiats
 */
export const createCulpritsSet = (plagiats: ScriptDescriptor[]): Array<Email> => {
    return removeDuplicates(plagiats.map(x => x.culprits).reduce((a, b) => a.concat(b)))
}
/**
 * Creates set of all culprits (without the one in parameter) that had at least one common plagiat
 * @param plagiatsFiltered Array of all plagiats with relation to culprit
 * @param culprit Culprit whose coworkers are wanted
 */
export const createCoworkerSet = (plagiatsFiltered: ScriptDescriptor[], culprit: Email): Array<Email> => {
    return createCulpritsSet(plagiatsFiltered).filter(x => x !== culprit)
}

/**
 * Counts how many plagiats has the culprit made
 */
export const countPlagiatsOfCulprit = (plagiats: ScriptDescriptor[], culprit: Email): number => {
    return getPlagiatsOfCulprit(plagiats, culprit).length
}
