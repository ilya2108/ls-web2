import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs'
import pluralize from 'pluralize'

import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";
import DefaultErrorPage from 'next/error'


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

  console.log(data)

  const assignment = data?.UserMyself?.assignments?.results?.find((a) => {
      return `${a.id}` === assignmentId
    })

  if (!assignment) {
    return <div className="loading">loading</div>
  }

  const resultScore = calculateScore(data)
  const handleSubmit = () => {
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

  const handleSolutionChange = (event) => {
    updateSolution(event.target.value)
  }

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
        />
        <button onClick={handleSubmit}>Submit</button>
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
      <h2>Attempts</h2>
      <div>
        <ul>
          {assignment?.submissions?.results.reverse().map(({ correction }) => {
            if (!correction || !correction.score) {
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
        </ul>
      </div>
    </Layout>
  )
}
