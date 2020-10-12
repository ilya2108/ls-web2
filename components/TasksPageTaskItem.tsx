import React from "react";
import { gql } from "graphql-request";
import { useDispatch } from "react-redux";

import { fetcher } from "../modules/api";
import { assignmentCreatedBanner } from '../modules/core/redux/banner/banner.actions';

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
        dispatch(assignmentCreatedBanner('Failed to publish assignment', 'error'))
        return
      }

      console.log("Published assignment", {jobId})
      dispatch(assignmentCreatedBanner('Published assignment — please wait few minutes', 'success'))
    })
    .catch((error) => {
      dispatch(assignmentCreatedBanner('Failed to create assignment', 'error'))
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
