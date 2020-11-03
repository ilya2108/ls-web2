import useSWR from "swr";
import { gql } from "graphql-request";
import React, { useState } from "react";
import debounce from 'lodash/debounce'
import { encode } from "js-base64"
import Button from "@atlaskit/button";

import { calculateScore } from '../../utils/score-utils'
import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";
import TimeLeft from "../../components/TimeLeft";
import SubmissionAttempts from "../../components/SubmissionAttempts";
import { queryIdGenerator, sortCorrections } from "../../utils/graphql-utils";
import AssignmentDescription from "../../components/AssignmentDescription";

const POLL_CORRECTION_TIMEOUT = 5000

export default function Exam() {
  const [solution, updateSolution] = useState('')
  const [loadingCorrection, updateLoadingCorrection] = useState(null)
  const [toggledHint, updateToggledHint] = useState(null)
  const [toggledAttempt, updateToggledAttempt] = useState(null)
  const [queryId, updateQueryId] = useState(queryIdGenerator())

  const { data, error } = useSWR(
    gql`query ${queryId} {
      UserMyself {
        id
        activeExam {
          id
          timeLeft
          startTime
          endTime
          assigmnentsOfStudentInExam {
            results {
              id
              name
              descriptionHtml
              submissions {
                results {
                  submissionData
                  correction {
                    id
                    score
                    createdAt
                    data
                  }
                }
              }
            }
          }
          exam {
            id
          }
        }
      }
    }`,
    fetcher
  )

  const handleReload = () => {
    updateToggledAttempt(null)
    updateToggledHint(null)
    updateQueryId(queryIdGenerator())
  }

  const exam = data?.UserMyself?.activeExam
  const assignment = exam?.assigmnentsOfStudentInExam?.results[0]
  if (!data) {
    return <Layout>loading</Layout>
  }
  if (!exam || !assignment || !exam.timeLeft) {
    return (
      <Layout>
        no exams
        <br />
        <Button
          onClick={handleReload}
          appearance="primary"
        >reload</Button>

      </Layout>
    )
  }

  const resultScore = calculateScore(assignment)
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
        updateQueryId(queryIdGenerator())
        updateLoadingCorrection(null)
      }, POLL_CORRECTION_TIMEOUT)
    })
    .catch((e) => console.error(e));
  }

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

  const corrections = assignment?.submissions?.results
    .map(({ correction, submissionData }) => ({ ...correction, submissionData }))
  const sortedCorrections  = corrections.sort(sortCorrections)

  // const queryInProgress = corrections.some((correction) => !correction)
  // if (queryInProgress) {
  //   setTimeout(() => {
  //     updateQueryId(queryIdGenerator())
  //   }, POLL_RELOAD_TIMEOUT)
  // }

  return (
    <Layout>
      <h1>Exam: {assignment.name} <TimeLeft timeLeft={exam.timeLeft} endTime={exam.endTime} /></h1>
      <br />
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
        onClick={handleReload}
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
    </Layout>
  )
}
