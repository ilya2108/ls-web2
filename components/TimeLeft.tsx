import React, { useEffect, useState } from "react"
import { unix } from 'dayjs'

type Props = {
  timeLeft: number
}

export default function TimeLeft(props: Props) {
  const [timeLeft, setTimeLeft] = useState(props.timeLeft)

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(timeLeft-1)
    }, 1000)
  })

  return (
    <span>[{unix(timeLeft).format("mm:ss")}]</span>
  )
}
