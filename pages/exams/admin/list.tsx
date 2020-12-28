import { useRouter } from "next/router";
import useSWR from "swr";

import { gql } from "graphql-request";
import { fetcher } from "../../../modules/api";
import Layout from "../../../layout/Layout";
import React, { useState, useEffect } from "react";
import { queryIdGenerator } from "../../../utils/graphql-utils";

import Textfield from '@atlaskit/textfield';


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

  const exams = data?.ExamList?.results || []
  const [examsFiltered, setExamsFiltered] = useState(exams || [])

  const sortExams = (e1, e2) => {
    if (e1.template.name > e2.template.name) return -1
    if (e1.template.name < e2.template.name) return 1
    return 0
  }

  //Fixes exams not being displayed after refreshing page
  useEffect(() => { 
    setExamsFiltered(exams.sort(sortExams))
  },[exams])

  const handleSearch = (e) => {
    filterExams(e.target.value)
  }

  //Filters exams (using query from the search field) and sorts them by name
  const filterExams = (query: String) => {
    setExamsFiltered(exams.filter(exam => {
      return exam.template.name.toUpperCase().indexOf(query.toUpperCase()) !== -1
    }).sort(sortExams))
  }

  if (!exams || error) {
    return (
      <Layout>
        no exams
      </Layout>
    )
  }

  return (
    <Layout>
      <Textfield width="300" onChange={ handleSearch } placeholder="Search..." />
      <ul>
        {examsFiltered.map((exam) => {
          return (
            <li>
              <a href={`/exams/edit/${exam.id}`}>{exam.template.name}</a>&nbsp;(id={exam.id})
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
