import React from "react"
import { decode } from "js-base64"
import dayjs, { unix } from 'dayjs'
import pluralize from 'pluralize'
import { calculateSemesterScore } from '../../utils/score-utils'
import {BorderCell, CodeCell} from "../../pages-styles/UserPage/UserPage.styles";
import Button from "@atlaskit/button";

type Props = {
  userData: any,
}

function filterAssignments() {
    var input = document.getElementById("inputFilter");
    var ass = document.getElementsByClassName("user-assignment");

    for (var i = 0; i < ass.length; i++) {
        if (ass[i].firstChild.textContent.includes(input.value))
            ass[i].setAttribute("style", "display: block;");
        else {
            ass[i].setAttribute("style", "display: none;");
        }
    }
}

export default function UserSubmissionsSection(props: Props, filter: string) {
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

        <input type="text" name="name" id="inputFilter" />
        <Button appearance="primary" onClick={() => filterAssignments()}>Filter</Button>
      <br />
      <br />
        <div className="assignments">
        {
          assignments.results.map((ass, i) => {
          return (
            <BorderCell className="user-assignment">
              <b>{i}) <a href={`/assignments/edit/${ass.assignment.id}`}>{ass.assignment.name}</a>, score ({ass.score})</b>
              {ass.submissions.results.map((sub, i) => {
                try {
                  const submissionData = JSON.parse(sub?.correction?.submission?.submissionData)
                  const decodedSubmission = decode(submissionData.script)                
                  return (
                    <>
                      <p>
                          {dayjs(sub?.correction?.submission.createdAt).format("DD.MM. HH:mm:ss")}
                          <b>
                              { } ({sub?.correction.score} {pluralize('point', sub?.correction.score)})
                          </b>
                      </p>
                      <CodeCell>
                         <code>
                            {decodedSubmission}
                        </code>
                      </CodeCell>
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

            </BorderCell>

          )
        })
      }
      </div>
    </div>
  )
}
