import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import { gql } from "graphql-request";
import { v4 } from 'uuid';

import TasksPageTaskItem from "../../components/TasksPageTaskItem";
import { fetcher } from '../../modules/api';
import assignmentTemplateList from '../../queries/assignmentTemplateList.gql';

import Textfield from '@atlaskit/textfield';

export default function AssignmentTemplateList() {
  const { data, error } = useSWR(
    gql`${assignmentTemplateList.loc.source.body}`,
    fetcher
  );

  const assignments = data?.AssignmentList?.results || []
  const [assignmentsFiltered, setAssignmentsFiltered] = useState(assignments || [])

  //Fixes assignments not being displayed after refreshing page
  useEffect(() => { 
    setAssignmentsFiltered(assignments)
  },[assignments])

  const handleSearch = (e) => {
    filterAssignments(e.target.value)
  }
  const filterAssignments = (query: String) => {
    setAssignmentsFiltered(assignments.filter(assignment => {
      return assignment.name.toUpperCase().indexOf(query.toUpperCase()) !== -1
    }))
  }

  return (
    <>
      <div className="exams-header-div">
        <h2 className="exams-header">Available Assignments</h2>
        <Textfield width="300" onChange={ handleSearch } placeholder="Search assignment..." />
      </div>
      <div className='exams-container'>
        {
          assignmentsFiltered.map((task) => {
            return (
              <div key={v4()} className="exams-task">
                <TasksPageTaskItem task={task} admin />
              </div>
            )
          })
        }
      </div>
    </>
  )
}
