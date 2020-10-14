import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { gql } from "graphql-request";

import { fetcher } from "../../modules/api";

import Layout from "../../layout/Layout";
import Loading from "../../components/Loading";
import Error, { hasQueryError } from "../../components/Error";



export default function Parallel() {
  const router = useRouter();
  const { parallelId } = router.query;
  if (!parallelId) {
    return <Loading />
  }

  const [status, setStatus] = useState('')
  const textareaRef = useRef(null)
  const selectRef = useRef(null)

  const { data, error } = useSWR(
    gql`
      query getParallelDetails {
        ParallelDetail(id: ${parallelId}) {
          id
          course {
            id
          }
          students {
            totalCount
            results {
              username
              id
            }
          }
        }
      }
    `,
    fetcher
  )

  const { data: dataExams, error: errorExams } = useSWR(
    gql`
      query exams {
        ExamList {
          results {
            id
            template {
              name
            }
          }
        }
      }
    `,
    fetcher
  )

  if ((!data && !error) || (!dataExams && !errorExams)) {
    return <Loading />
  }

  if (error || errorExams) {
    return <Layout><Error errors={{ error, errorExams }} /></Layout>
  }

  const students = data?.ParallelDetail?.students?.results
  const studentIdsMap = students.reduce((map, { username, id }) => {
    map[username] = id
    return map
  }, {})
  const usernames = students.map(({ username }) => username)
  const availableExams = dataExams?.ExamList?.results.map(({ id, template }) => {
    return {
      id,
      name: template.name
    }
  })


  const handleExamStudentAdd = () => {
    const chosenExamId = selectRef.current.value
    const students = textareaRef.current.value.split(" ")
    const effectiveIds = students.map((username) => {
      return studentIdsMap[username]
    }).filter((x) => x)
    const jobs = effectiveIds.map((id) => {
      return fetcher(gql`mutation addStudentToExam{
        StudentWritesExamCreate(data: {examId: ${chosenExamId}, studentId: ${id}}){
          object{
            id
            student{
              username
            }
          }
        }
      }`)
    })

    Promise.all(jobs)
      .then(() => {
        setStatus('All students were added')
      })
      .catch((e) => {
        setStatus('There were some errors')
        console.error(e)
      })
    
    setStatus('Students added, wait a while and complete the enrollment')
  }
  
  const handleExamComplete = () => {
    const chosenExamId = selectRef.current.value
    return fetcher(gql`mutation completeEnrollment{
      ExamCompleteEnrollment(data: {id: ${chosenExamId}}){
        job{
          id
        }
      }
    }`)
    .then(() => {
      setStatus('Exam enrollment is done, wait a while till Learnshell generates it and you can start!')
    })
    .catch(() => {
      setStatus('We had problems with completing enrollment')
    })
  }
  
  const handleExamStart = () => {
    const chosenExamId = selectRef.current.value
    return fetcher(gql`mutation startExam{
      ExamStart(data: {id: ${chosenExamId}}){
        object{
          id
          startTime
        }
      }
    }`)
    .then(() => {
      setStatus('Exam started!')
    })
    .catch(() => {
      setStatus('We had prolems starting exam')
    })
  }


  return (
    <Layout>
      <h1>Parallel: {parallelId}</h1>
      <br />
      <h3>Usernames:</h3>
      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          className="textarea"
          rows={10}
          spellCheck="false"
          placeholder="student usernames"
          defaultValue={usernames.join(" ")}
          // onChange={handleUsernamesChange}
        />
      </div>
      <br />
      <br />
      <select ref={selectRef} defaultValue={availableExams[0].id}>
        {availableExams.map((exam) => {
          return <option value={exam.id}>{exam.name}</option>
        })}
      </select>
      <button className="butt" onClick={handleExamStudentAdd}>Add selected students to this Exam</button>
      <button className="butt" onClick={handleExamComplete}>Complete enrollment</button>
      <button className="butt" onClick={handleExamStart}>Start exam</button>
      <br />
      <br />
      <br />
      <br />
      <div className="status">
        {status}
      </div>
      <br />
    </Layout>
  )
}
