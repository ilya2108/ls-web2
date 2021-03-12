import React, {useState} from "react"
import {decode} from "js-base64"
import dayjs from 'dayjs'
import pluralize from 'pluralize'
import {BorderCell, CodeCell} from "../../pages-styles/UserPage/UserPage.styles";
import {SearchWrapper} from "../../pages-styles/UsersPage/UsersPage.styles";
import Textfield from "@atlaskit/textfield";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";
import debounce from "lodash/debounce";

type Props = {
  userData: any,
}

export default function UserSubmissionsSection(props: Props) {
  const { assignments } = props.userData
  if (!assignments || !assignments.results) {
    return null
  }

  const [inputVal, setInputVal] = useState("");
  const setInputValDebounced = debounce(setInputVal, 300);
  const handleSearchEvent = (event) => {
    const { value } = event.target;
    setInputValDebounced(value)
  };

    const filterUsers = (submissions) => {
        return submissions.filter((submission) => {
        return (
            submission.assignment.name.toLowerCase().includes(inputVal.toLowerCase())
        )
    });
  };

  return (
    <div>
        <SearchWrapper>
            <Textfield
              name="basic"
              isCompact
              placeholder="Search submission"
              elemAfterInput={<EditorSearchIcon label="" />}
              onChange={(event) => handleSearchEvent(event)}
            />
        </SearchWrapper>
        <br />
        <div className="assignments">
        {
          filterUsers(assignments.results).map((ass, i) => {
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
