import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import Layout from "../../layout/Layout";
import TasksPageTaskItem from "../../components/TasksPageTaskItem";
import { fetcher } from '../../modules/api';


export default function TasksPage() {
  const { data, error } = useSWR(
    gql`{
      AssignmentList {
        results {
          id
          name
          description
          published
          forExam
        }
      }
    }`,
    fetcher
  );

  // TODO: Loading.
  const tasks = data?.AssignmentList?.results || []

  return (
    <Layout>
      <h1>Tasks</h1>
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
