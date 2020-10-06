import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import Layout from "../../layout/Layout";
import ExamsPageExamItem from "../../components/ExamsPageExamItem";
import { fetcher } from '../../modules/api';


export default function ExamsPage() {
  const { data, error } = useSWR(
    gql`query Me {
      UserMyself {
        id
        assignments {
          totalCount
          results {
            id
            descriptionMd
          }
        }
        studentsInExam {
          totalCount
          results {
            id
          }
        }
      }
    }`,
    fetcher
  );

  // TODO: Loading.
  const exams = data?.UserMyself?.studentsInExam.results || []
  const exam = exams[0] || null

  // const { data: exam } =

  return (
    <Layout>
      <h1>Exam</h1>
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
