import { gql } from "graphql-request";
import React, { useState } from "react";
import debounce from 'lodash/debounce'
import { encode } from "js-base64"
import Button from "@atlaskit/button";

import { calculateScore } from '../../utils/score-utils'
import { fetcher } from "../../modules/api";
import SubmissionAttempts from "../../components/SubmissionAttempts";
import { sortCorrections } from "../../utils/graphql-utils";
import AssignmentDescription from "../../components/AssignmentDescription";

const POLL_CORRECTION_TIMEOUT = 5000

type Props = {
  assignment: any
  onReload: () => void
}

export default function ExamAssignment(props: Props) {
  const { assignment, onReload } = props
  const [solution, updateSolution] = useState('')
  const [loadingCorrection, updateLoadingCorrection] = useState(null)
  const [toggledHint, updateToggledHint] = useState(null)
  const [toggledAttempt, updateToggledAttempt] = useState(null)

  const resultScore = calculateScore(assignment)

  const updateSolutionDebounced = debounce(updateSolution, 500)



  const handleSolutionChange = (event) => {
    updateSolutionDebounced(event.target.value)
  }

  const handleHintsToggle = (hintId: number) => {
    if (toggledHint === hintId) {
      updateToggledHint(null)
      return
    }

    updateToggledHint(hintId)
  }

  const handleAttemptToggle = (hintId: number) => {
    if (toggledAttempt === hintId) {
      updateToggledAttempt(null)
      return
    }

    updateToggledAttempt(hintId)
  }


  const handleSubmit = () => {
    if (!solution) {
      return
    }

    const encodedSolution = encode(solution)
    fetcher(gql`mutation submit {
      SubmissionCreate(data: {
        generatedAssignmentId: "${assignment.id}",
        submissionData: "{ \\"script\\": \\"${encodedSolution}\\" }",
      }) {
        job {
          id
          createTime
        }
      }
    }`)
    .then((response) => {
      const submissionJob = response.SubmissionCreate.job
      updateLoadingCorrection(submissionJob)

      setTimeout(() => {
        updateToggledAttempt(null)
        updateToggledHint(null)
        // updateQueryId(queryIdGenerator())
        updateLoadingCorrection(null)
      }, POLL_CORRECTION_TIMEOUT)
    })
    .catch((e) => console.error(e));
  }


  const corrections = assignment?.submissions?.results
    .map(({ correction, submissionData }) => ({ ...correction, submissionData }))
  const sortedCorrections  = corrections.sort(sortCorrections)


  return (
    <div>
      <AssignmentDescription assignmentHtml={assignment.descriptionHtml} />
      <h2>Solution</h2>
      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          rows={10}
          spellCheck="false"
          defaultValue={solution}
          onBlur={handleSolutionChange}
          onChange={handleSolutionChange}
        />
        <button onClick={handleSubmit} disabled={!solution || loadingCorrection}>Submit</button>
      </div>
      <br />
      <br />
      <h2>Results</h2>
      <div>
        Current score: {resultScore}
        <br />
        Remaining attempts: unlimited
        <br />
      </div>
      <br />
      <Button
        onClick={onReload}
        appearance="primary"
      >reload</Button>
      {(sortedCorrections.length || loadingCorrection) &&
        <SubmissionAttempts
          toggledHint={toggledHint}
          toggledAttempt={toggledAttempt}
          corrections={sortedCorrections}
          loadingCorrection={loadingCorrection}
          onHintToggle={handleHintsToggle}
          onAttemptToggle={handleAttemptToggle}
        />
      }
    </div>
  )
}
