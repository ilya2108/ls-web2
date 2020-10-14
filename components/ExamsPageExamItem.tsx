
type Props = {
  exam: {
    id: number,
    exam: {
      name: string,
      id: string,
      hasStarted: boolean
      template: {
        name: string
      }
    },
    startTime: string,
    timeLeft: number,
  }
}

export default function ExamsPageExamItem(props: Props) {
  const { exam } = props

  if (!exam) {
    return <div>No exams</div>
  }

  const getStatus = () => {
    if (exam?.timeLeft === 0) {
      return '(finished)'
    }
    if (exam?.exam?.hasStarted) {
      return '(started)'
    }

    return ''
  }

  return (
    <a className='exam' href={`/exams/${exam.id}`}>
      {exam.exam.template.name} {getStatus()}
    </a>
  )
}
