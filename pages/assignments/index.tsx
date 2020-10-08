import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import Layout from "../../layout/Layout";
import TasksPageTaskItem from "../../components/TasksPageTaskItem";
import { fetcher } from '../../modules/api';


export default function TasksPage() {
  // const { data, error } = useSWR(
  //   gql`{
  //     AssignmentList {
  //       results {
  //         id
  //         name
  //         description
  //         published
  //         forExam
  //       }
  //     }
  //   }`,
  //   fetcher
  // );
  const { data, error } = useSWR(
    gql`{
      UserMyself {
        id
        assignments {
          totalCount
          results {
            id
            name
            descriptionHtml
          }
        }
      }
    }`,
    fetcher
  );

  // TODO: Loading.
  const tasks = data?.UserMyself?.assignments?.results || []

  return (
    <Layout>
      <h1>Assignments</h1>
      <div className='exams-container'>
        {
          tasks.map((task) => {
            return (
              <div key={v4()}>
                <TasksPageTaskItem task={task} />
                <br />
              </div>
            )
          })
        }
      </div>
    </Layout>
  )
}
