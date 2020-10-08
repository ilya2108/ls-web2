import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs'
import pluralize from 'pluralize'
import debounce from 'lodash/debounce'

import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";

const MAX_CORRECTIONS_SHOWN = 5

const calculateScore = (results: any) => {
  try {
    const submissionResults = results?.UserMyself?.assignments?.results[0]?.submissions?.results
    const success = submissionResults.some((submissionResult) => {
      return submissionResult?.correction.score === 1
    })

    return success ? 1 : 0
  } catch (e) {
    return 0
  }
}

export default function Assignment() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [solution, updateSolution] = useState('')
  const [extraAttemptsHidden, updateExtraAttemptsHidden] = useState(true)
  const { data, error } = useSWR(
    gql`
      query {
        UserMyself {
          assignments {
            totalCount
            results {
              id
              name
              descriptionHtml
              submissions {
                results {
                  correction {
                    id
                    score
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    `,
    fetcher
  )

  const assignment = data?.UserMyself?.assignments?.results?.find((a) => {
      return `${a.id}` === assignmentId
    })

  if (!assignment) {
    return <div className="loading">loading</div>
  }

  const resultScore = calculateScore(data)
  const handleSubmit = () => {
    if (!solution) {
      return
    }

    fetcher(gql`mutation submit {
      SubmissionCreate(data: {
        generatedAssignmentId: "${assignmentId}",
        submissionData: "{ \\"script\\": \\"${solution}\\" }",
      }) {
        job {
          id
        }
      }
    }`).catch((e) => console.log(e));
  }

  const updateSolutionDebounced = debounce(updateSolution, 500)
  const handleSolutionChange = (event) => {
    updateSolutionDebounced(event.target.value)
  }

  const handleExtraAttemptsShow = () => {
    updateExtraAttemptsHidden(false)
  }

  const corrections = assignment?.submissions?.results.map(({ correction }) => correction).reverse()

  return (
    <Layout>
      <h1>Assignment: {assignment.name}</h1>
      <br />
      <div
        dangerouslySetInnerHTML={{
          __html: assignment.descriptionHtml
        }}
      />
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
        <button onClick={handleSubmit} disabled={!solution}>Submit</button>
      </div>
      <br />
      <br />
      <h2>Results</h2>
      <div>
        Score: {resultScore}
        <br />
        Remaining attempts: unlimited
        <br />
      </div>
      {Boolean(corrections.length) &&
        <div>
          <br />
          <h2>Attempts</h2>
          <div className='attempts-container'>
            <ul>
              {corrections.map((correction, i) => {
                if (i > MAX_CORRECTIONS_SHOWN && extraAttemptsHidden) {
                  return
                }

                if (!correction || correction.score == null) {
                  return (
                    <li>
                      {dayjs(correction?.createdAt).format('D.MM. HH:mm')} — in progress
                    </li>
                  )
                }

                return (
                  <li>
                    {dayjs(correction?.createdAt).format('D.MM. HH:mm')} — {correction?.score} {pluralize('point', correction?.score)}
                  </li>
                )
              })}
              {extraAttemptsHidden && corrections.length > MAX_CORRECTIONS_SHOWN && <a href='#' onClick={handleExtraAttemptsShow}>show more</a>}
            </ul>
          </div>
        </div>
      }
    </Layout>
  )
}
