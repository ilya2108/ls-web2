import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";

import { auth, fetcher } from "../../modules/api";
import Layout, { UserMyself } from "../../layout/Layout";


export default function Assignment() {
  const router = useRouter();
  const { assignmentId } = router.query;
  const [solution, updateSolution] = useState('')
  const { data, error } = useSWR(
    gql`
      query {
        AssignmentDetail(id: "${assignmentId}") {
          name
          description
        }
      }
    `,
    fetcher
    );

  const { data: userData, error: userError } = useSWR('/api/user', auth)
  let userId = null
  if (userData?.UserMyself?.id) {
    userId = userData.UserMyself.id
  }

  const { data: results, error: resultError } = useSWR(
    gql`
      query {
        UserDetail(id: "${userId}")  {
          assignments {
            results {
              submissions {
                results {
                  correction {
                    id
                    score
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

  const resultScore = results?.UserDetail?.assignments?.results[0] && 1 || 0


  const handleSubmit = () => {
    fetcher(gql`mutation submission {
      SubmissionCreate(data: {generatedAssignmentId: "${assignmentId}", submissionData: "{ \"script\": \"${solution}\" }" }) {
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
      <h1>Assignment: {data?.AssignmentDetail?.name}</h1>
      <br />
      <div>{data?.AssignmentDetail?.description}</div>
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
      </div>
    </Layout>
  )
}
