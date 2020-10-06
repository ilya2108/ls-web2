import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";

import { fetcher } from "../../modules/api";
import Layout from "../../layout/Layout";


export default function Exam() {
  const router = useRouter();
  const { examId } = router.query;

  const { data, error } = useSWR(
    gql`
      query {
        AssignmentDetail(id: "${examId}") {
          name
          description
        }
      }
    `,
    fetcher
  );

  return (
    <Layout>
      <h1>Exam: {data?.AssignmentDetail?.name}</h1>
      <br />
      <div>{data?.AssignmentDetail?.description}</div>
      <h2>Solution</h2>
      <input />
      <button>Submit</button>
    </Layout>
  )
}