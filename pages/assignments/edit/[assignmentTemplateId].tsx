import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import { decode } from "js-base64"


import { fetcher } from '../../../modules/api';
import CreateAssignment from '../create'
import Layout from "../../../layout/Layout";


export default function EditAssignment() {
  const router = useRouter();
  const { assignmentTemplateId } = router.query;
  if (!assignmentTemplateId) {
    return (
      <Layout>not found</Layout>
    )
  }

  const { data, error } = useSWR(
    gql`query {
      AssignmentDetail(id: ${assignmentTemplateId}) {
        name
        description
        generatorData
        correctionData
        id
      }
    }`,
    fetcher
  )

  const assignment = data?.AssignmentDetail || {}
  if (!assignment || error) {
    return (
      <Layout>not found</Layout>
    )
  }

  try {
    const correctionData = JSON.parse(assignment.correctionData)
    const decodedSolution = decode(correctionData.solution)
    const preprocessedAssignment = {
      ...assignment,
      solution: decodedSolution,
      testcases: correctionData.testcases.map((testcase) => {
        return {
          ...testcase,
          lidl: decode(testcase.lidl)
        }
      })
    }

    return (
      <CreateAssignment
        assignment={preprocessedAssignment}
      />
    )
  } catch {
    return (
      <Layout>loading</Layout>
    )
  }
}
