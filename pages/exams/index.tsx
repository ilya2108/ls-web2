import useSWR from "swr";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
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
import ExamAssignment from "../../components/exams/ExamAssignment";
import Pagination from '@atlaskit/pagination';

const POLL_CORRECTION_TIMEOUT = 5000

const detectDefaultAssignmentId = () => {
  if (!process.browser || !window || !window.location || !window.location.hash || window.location.hash.indexOf('_') === -1) {
    return 0
  }

  const parts = window.location.hash.split('_')
  try {
    const possibleId = parseInt(parts[parts.length - 1])
    if (Number.isNaN(possibleId)) {
      return 0
    }

    return possibleId
  } catch (e) {
    return 0
  }
}

export default function Exam() {
  const defaultAssId = detectDefaultAssignmentId()
  const [assignmentId, updateAssignmentId] = useState(defaultAssId)
  const [queryId, updateQueryId] = useState(queryIdGenerator())

  useEffect(() => {
    const defaultId = detectDefaultAssignmentId()
    if (defaultId !== assignmentId) {
      updateAssignmentId(defaultId)
    }
  }, []);

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
    // updateToggledAttempt(null)
    // updateToggledHint(null)
    updateQueryId(queryIdGenerator())
  }

  const exam = data?.UserMyself?.activeExam
  const multiAss = exam?.assigmnentsOfStudentInExam?.results?.length > 1
  const assignment = exam?.assigmnentsOfStudentInExam?.results[assignmentId]
  const assignments = exam?.assigmnentsOfStudentInExam?.results
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



  // const queryInProgress = corrections.some((correction) => !correction)
  // if (queryInProgress) {
  //   setTimeout(() => {
  //     updateQueryId(queryIdGenerator())
  //   }, POLL_RELOAD_TIMEOUT)
  // }

  return (
    <Layout>
      {multiAss &&
        <Pagination
          selectedIndex={assignmentId}
          onChange={(event, nextId) => {
            updateAssignmentId(nextId)
            window.location.hash = `assignment_${nextId}`
          }}
          pages={assignments.map((a, i) => i)}
        />
      }
      <h1>Exam: {assignment.name} <TimeLeft timeLeft={exam.timeLeft} endTime={exam.endTime} /></h1>
      {multiAss &&
        <div>
          <br />
          <br />
          <b>This exam has multiple assignments:</b>
          <ol>
          {assignments.map((ass, i) => {
            const link = (
              <a
                key={`ass-${i}`}
                href={`#assignment_${i}`}
                onClick={() => updateAssignmentId(i)}
              >
                {ass.name}
              </a>
            )

            if (i === assignmentId) {
              return <li><b>{link}</b></li>
            }

            return <li>{link}</li>
          })}
          </ol>
        </div>
      }
      <br />
      <hr />
      <br />
      <ExamAssignment
        assignment={assignment}
        onReload={handleReload}
      />
    </Layout>
  )
}
