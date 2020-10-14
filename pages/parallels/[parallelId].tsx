import React from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";

import { fetcher } from "../../modules/api";

import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import Error, { hasQueryError } from "../../components/Error";



export default function Parallel() {
  const router = useRouter();
  const { parallelId } = router.query;
  if (!parallelId) {
    return <Loading />
  }

  const { data, error } = useSWR(
    gql`
      query getParallelDetails {
        ParallelDetail(id: ${parallelId}) {
          id
          course {
            id
          }
          students {
            totalCount
            results {
              username
              id
            }
          }
        }
      }
    `,
    fetcher
  )

  if (!data && !error) {
    return <Loading />
  }

  if (error) {
    return <Layout><Error errors={error} /></Layout>
  }

  const students = data?.ParallelDetail?.students?.results.map((student) => {
    return student.username
  })

  console.log(students)

  return (
    <Layout>
      <h1>Parallel: {parallelId}</h1>
      <br />
      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          rows={10}
          spellCheck="false"
          placeholder="student usernames"
          defaultValue={students.join(" ")}
        />
      </div>
    </Layout>
  )
}
