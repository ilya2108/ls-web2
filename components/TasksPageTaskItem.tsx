import React from "react";
import { gql } from "graphql-request";
import { useDispatch } from "react-redux";

import { fetcher } from "../modules/api";
import { assignmentCreatedFlag } from "../modules/core/redux/flag/flag.actions";
type Props = {
  task: {
    id: number,
    name: string,
    description: string,
    published: boolean,
    forExam: boolean
  }
  admin?: boolean
}

export default function TasksPageTaskItem(props: Props) {
  const dispatch = useDispatch()
  const { admin, task } = props

  const handlePublish = () => {
    console.log("Publishing assignment", task.id)
    fetcher(gql`mutation publish {
      AssignmentPublish(data: {id: ${task.id} }) {
        job {
          id
        }
      }
    }`)
    .then((response) => {
      const jobId = response.AssignmentPublish?.job?.id
      if (!jobId) {
        dispatch(assignmentCreatedFlag('error', 'Failed to publish assignment'))
        return
      }

      console.log("Published assignment", {jobId})
      dispatch(assignmentCreatedFlag('success', 'Published assignment', 'Please wait a few minutes...'))
    })
    .catch((error) => {
      dispatch(assignmentCreatedFlag('error', 'Failed to create assignment'))
      console.error(error)
    })
  }

  return (
    <div>
      <a className='exam' href={admin ? '/assignments/' : `/assignments/${task.id}`}>
        {task.name} {}
        {(task.forExam ? `(exam)` : '(homework)')} {(task.published && admin) ? '[PUBLISHED]' : ''}
      </a>
      {admin && <span> — <i className="hints-toggle-handle" onClick={handlePublish}>publish</i></span>}
    </div>
  )
}