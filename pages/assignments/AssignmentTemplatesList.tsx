import React from 'react'
import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import TasksPageTaskItem from "../../components/TasksPageTaskItem";
import { fetcher } from '../../modules/api';
import assignmentTemplateList from '../../queries/assignmentTemplateList.gql';


export default function AssignmentTemplateList() {
  const { data, error } = useSWR(
    gql`${assignmentTemplateList.loc.source.body}`,
    fetcher
  );

  const assignments = data?.AssignmentList?.results || []


  return (
    <>
      <h2>Available Assignments</h2>
      <div className='exams-container'>
        {
          assignments.map((task) => {
            return (
              <div key={v4()}>
                <TasksPageTaskItem task={task} admin />
                <br />
              </div>
            )
          })
        }
      </div>
    </>
  )
}
