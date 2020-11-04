import { useRouter } from "next/router";
import useSWR from "swr";

import { gql } from "graphql-request";
import { fetcher } from "../../../modules/api";
import Layout from "../../../layout/Layout";
import React, { useState } from "react";
import { queryIdGenerator } from "../../../utils/graphql-utils";


export default function AssignmentTestJob() {
  const router = useRouter();
  const [queryId, updateQueryId] = useState(queryIdGenerator())
  const { jobId } = router.query;

  const { data, error } = useSWR(
    gql`query ExamList {
      ExamList {
        results {
          id
          template {
            name
          }
        }
      }
    }`,
    fetcher
  )

  const exams = data?.ExamList?.results
  if (!exams || error) {
    return (
      <Layout>
        no exams
      </Layout>
    )
  }

  return (
    <Layout>
      <ul>
        {exams.map((exam) => {
          return (
            <li>
              ({exam.id})&nbsp;
              <a href={`/exams/edit/${exam.id}`}>{exam.template.name}</a>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
