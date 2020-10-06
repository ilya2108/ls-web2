import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import Layout from "../../layout/Layout";
import ExamsPageExamItem from "../../components/ExamsPageExamItem";
import { fetcher } from '../../modules/api';


export default function ExamsPage() {
  const { data, error } = useSWR(
    gql`{
      ExamList {
        results {
          id
          template {
            name
          }
          startTime
          hasStarted
        }
      }
    }`,
    fetcher
  );

  // TODO: Loading.
  const exams = data?.ExamList?.results || []

  return (
    <Layout>
      <h1>Exams</h1>
      <div className='exams-container'>
        {
          exams.map((exam) => {
            return (
              <>
                <ExamsPageExamItem key={v4()} exam={exam} />
                <br />
              </>
            )
          })
        }
      </div>
    </Layout>
  )
}
