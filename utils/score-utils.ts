import { decode } from "js-base64"


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

type Assignments = {
  results: any[]
}

export const calculateSemesterScore = (assignments: Assignments) => {
  return assignments?.results?.reduce((sum, assignment) => {
    if (!assignment) {
      return 0
    }

    const { score } = assignment
    return sum + (score || 0)
  }, 0) || 0
}

export const decodeAttemptScript = (submissionDataRaw: any) => {
  try {
    const submissionData = JSON.parse(submissionDataRaw)
    return decode(submissionData.script)
  } catch (error) {
    console.error(error)

    return 'not available'
  }
}
