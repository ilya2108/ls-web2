import React from "react"
import pluralize from "pluralize"
import { v4 } from 'uuid'

type Props = {
  userData: any,
}

export default function UserCoursesInfoSection(props: Props) {
  const { parallelsAsTeacher, parallelsAsStudent } = props.userData
  if (!parallelsAsTeacher && !parallelsAsStudent ) {
    return <></>
  }



  if (parallelsAsTeacher.totalCount > 0) {
    return (
      <div>
        <b>Teaching parallels</b>
        <ul>
          {parallelsAsTeacher?.results.map(({ id, name, course }) => {
            return <li key={v4()}><a href={`parallels/${id}`}>no. {name} ({course.kosTag})</a></li>
          })}
        </ul>
      </div>
    )
  }

  if (parallelsAsStudent?.totalCount > 0) {
    const parallelsString = parallelsAsStudent.results.map(({ name, course }) => {
      return `${name} (${course.kosTag})`
    }).join(' ')
    return (
      <div>
        <b>Studying in {pluralize("parallel", parallelsAsStudent.totalCount)} {parallelsString}</b>
      </div>
    )
  }

  return <></>
}
