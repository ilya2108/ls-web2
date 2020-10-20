import React from "react"
import { calculateSemesterScore } from '../../utils/score-utils'

type Props = {
  userData: any,
}

export default function UserPointsInfoSection(props: Props) {
  const { assignments } = props.userData
  if (!assignments || !assignments.results) {
    return null
  }

  const scoreSum = calculateSemesterScore(assignments)

  return (
    <div>Semester Score: <b>{scoreSum}</b></div>
  )
}
