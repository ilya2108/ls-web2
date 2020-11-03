import React from 'react'

type Props = {
  assignmentHtml: any
}

export default function AssignmentDescription({ assignmentHtml }: Props) {
  return (
    <div
      className="assignment"
      dangerouslySetInnerHTML={{
        __html: assignmentHtml
      }}
    />
  )
}
