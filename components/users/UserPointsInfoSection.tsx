import React from "react"
import pluralize from "pluralize"

type Props = {
  userData: any,
}

export default function UserPointsInfoSection(props: Props) {
  const { assignments } = props.userData
  if (!assignments || !assignments.results) {
    return null
  }

  const scoreSum = assignments.results.reduce((sum, { score }) => {
    return sum + (score || 0)
  }, 0)

  return (
    <div>Total score in current semester: {scoreSum}</div>
  )
}
