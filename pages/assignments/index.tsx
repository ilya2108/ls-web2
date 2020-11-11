import React from "react";
import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import Layout from "../../layout/Layout";
import TasksPageTaskItem from "../../components/TasksPageTaskItem";
import { fetcher } from '../../modules/api';
import AssignmentTemplatesList from "./AssignmentTemplatesList"


export default function TasksPage() {
  const { data, error } = useSWR(
    gql`{
      UserMyself {
        id
        isStaff
        isSuperuser
        assignments {
          totalCount
          results {
            id
            name
            descriptionHtml
            exam {
              id
            }
          }
        }
      }
    }`,
    fetcher
  );

  // TODO: Loading.
  const admin = data?.UserMyself?.isSuperuser
  const tasks = data?.UserMyself?.assignments?.results || []

  return (
    <Layout>
      <h1>Assignments</h1>
      <div className='exams-container'>
        {
          tasks.map((task) => {
            return (
              <div key={v4()} className="exams-task">
                <TasksPageTaskItem task={task} />
              </div>
            )
          })
        }
      </div>
      {admin && <AssignmentTemplatesList />}
    </Layout>
  )
}
