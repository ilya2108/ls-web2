import React, { useState } from "react";
import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import Layout from "../../layout/Layout";
import TasksPageTaskItem from "../../components/TasksPageTaskItem";
import { fetcher } from '../../modules/api';
import AssignmentTemplatesList from "./AssignmentTemplatesList"

import Textfield from '@atlaskit/textfield';

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
  const assignments = data?.UserMyself?.assignments?.results || []
  const [assignmentsFiltered, setAssignmentsFiltered] = useState(data?.AssignmentList?.results || [])
  const handleSearch = (e) => {
    setAssignmentsFiltered(assignments.filter(assignment => {
      return assignment.name.toUpperCase().indexOf(e.target.value.toUpperCase()) !== -1
    }))
  }

  return (
    <Layout>
      <div className="exams-header-div">
        <h1 className="exams-header">Assignments</h1>
        <Textfield width="300" onChange={ handleSearch } placeholder="Search assignment..." />
      </div>
      <div className='exams-container'>
        {
          assignmentsFiltered.map((task) => {
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
