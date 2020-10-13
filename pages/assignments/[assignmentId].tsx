import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import pluralize from 'pluralize'
import debounce from 'lodash/debounce'
import { encode } from "js-base64"
import { v4 } from 'uuid'

import { calculateScore } from '../../utils/score-utils'
import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import { formatSubmissionCreateTime } from '../../utils/date-utils'
import mySubmissions from '../../queries/mySubmissions.gql';
import CorrectionHints from "./CorrectionHints";


const MAX_CORRECTIONS_SHOWN = 5
const POLL_CORRECTION_TIMEOUT = 3000
const POLL_RELOAD_TIMEOUT = 20000

const queryIdGenerator = () => {
  return v4().substr(0, 3).replace(/\d/g, 'x')
}

export default function Assignment() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [solution, updateSolution] = useState('')
  const [loadingCorrection, updateLoadingCorrection] = useState(null)
  const [toggledHint, updateToggledHint] = useState(null)
  const [extraAttemptsHidden, updateExtraAttemptsHidden] = useState(true)
  const [queryId, updateQueryId] = useState(queryIdGenerator())

  const { data, error } = useSWR(
    gql`query ${queryId} {
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
                  data
                }
              }
            }
          }
        }
      }
    }`,
    fetcher
  )

  const assignment = data?.UserMyself?.assignments?.results?.find((a) => {
    return `${a.id}` === assignmentId
  })

  if (!assignment) {
    return <Loading />
  }

  const resultScore = calculateScore(assignmentId, data)
  const handleSubmit = () => {
    if (!solution) {
      return
    }

    const encodedSolution = encode(solution)
    fetcher(gql`mutation submit {
      SubmissionCreate(data: {
        generatedAssignmentId: "${assignmentId}",
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

  const handleExtraAttemptsShow = () => {
    updateExtraAttemptsHidden(false)
  }

  const handleHintsToggle = (hintId: number) => {
    if (toggledHint === hintId) {
      updateToggledHint(null)
      return
    }

    updateToggledHint(hintId)
  }

  const corrections = assignment?.submissions?.results.map(({ correction }) => correction).reverse()
  const queryInProgress = corrections.some((correction) => !correction)

  if (queryInProgress) {
    setTimeout(() => {
      updateQueryId(queryIdGenerator())
    }, POLL_RELOAD_TIMEOUT)
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
          onChange={handleSolutionChange}
        />
        <button onClick={handleSubmit} disabled={!solution || loadingCorrection}>Submit</button>
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
      {(corrections.length || loadingCorrection) &&
        <div>
          <br />
          <h2>Attempts</h2>
          <div className='attempts-container'>
            <ul>
              {loadingCorrection && <li>{formatSubmissionCreateTime(loadingCorrection.createTime)} — submitted</li>}
              {corrections.map((correction, i) => {
                if (i > MAX_CORRECTIONS_SHOWN && extraAttemptsHidden) {
                  return
                }

                if (!correction || correction?.score == null) {
                  return (
                    <li>
                      {formatSubmissionCreateTime(correction?.createdAt)} — in progress
                    </li>
                  )
                }

                return (
                  <li>
                    {formatSubmissionCreateTime(correction?.createdAt)} — <b>{correction?.score} {pluralize('point', correction?.score)}</b>
                    { } — <i className='hints-toggle-handle' onClick={() => handleHintsToggle(i)}>(show hints)</i>
                    {toggledHint === i && <CorrectionHints data={correction?.data} />}
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
