
export const calculateScore = (assignment: any) => {
  try {
    if (!assignment) {
      return 0
    }

    const submissionResults = assignment.submissions?.results
    return submissionResults.reduce((max: number, result: any) => {
      const resultScore = result?.correction?.score || 0
      return resultScore <= max ? max : resultScore
    }, 0)
  } catch (e) {
    return 0
  }
}
