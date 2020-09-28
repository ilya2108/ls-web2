
type Props = {
  exam: {
    id: number,
    template: {
      name: string,
    },
    startTime: string,
    hasStarted: boolean
  }
}

export default function ExamsPageExamItem(props: Props) {
  const { exam } = props

  return (
    <a className='exam' href={`/exams/${exam.id}`}>
      {exam.template.name} {(exam.hasStarted ? `(started)` : '')}
    </a>
  )
}
