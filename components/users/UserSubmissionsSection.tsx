import React from "react"
import { decode } from "js-base64"
import dayjs, { unix } from 'dayjs'
import pluralize from 'pluralize'
import { calculateSemesterScore } from '../../utils/score-utils'

type Props = {
  userData: any,
}

export default function UserSubmissionsSection(props: Props) {
  const { assignments } = props.userData
  if (!assignments || !assignments.results) {
    return null
  }

  return (
    <div>
      <br />
      <br />
      <h3>Submissions</h3>
      <br />
      <br />
      {
        assignments.results.map((ass, i) => {
          return (
            <div>
              <b>{i}) {ass.assignment.name}, score ({ass.score})</b>
              {ass.submissions.results.map((sub, i) => {
                try {
                  const submissionData = JSON.parse(sub?.correction?.submission?.submissionData)
                  const decodedSubmission = decode(submissionData.script)                
                  return (
                    <>
                      <p>
                        <b>
                          {dayjs(sub?.correction?.submission.createdAt).format("DD.MM. HH:mm:ss")}
                          { } ({sub?.correction.score} {pluralize('point', sub?.correction.score)})
                        </b>
                      </p>
                      <pre>
                        {decodedSubmission}
                      </pre>
                      <br/>
                    </>
                  )
                } catch (e) {
                  console.error(e)
                  return (
                    <div>no corrections</div>
                  )
                }
              })}
              <br />
              <i>-----------------------------------------</i>
              <br />
              <br />
            </div>
          )
        })
      }
    </div>
  )
}
