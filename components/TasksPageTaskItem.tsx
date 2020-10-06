
type Props = {
  task: {
    id: number,
    name: string,
    description: string,
    published: boolean,
    forExam: boolean
  }
}

export default function TasksPageTaskItem(props: Props) {
  const { task } = props

  return (
    <a className='exam' href={`/assignments/${task.id}`}>
      {task.name} {(task.forExam ? `(exam)` : '(homework)')} {task.published ? '[PUBLISHED]' : ''}
    </a>
  )
}
