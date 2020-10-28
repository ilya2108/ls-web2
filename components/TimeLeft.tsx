import React, { useEffect, useState } from "react"
import { unix } from 'dayjs'

type Props = {
  timeLeft: number
  endTime: string
}

export default function TimeLeft(props: Props) {
  const [timeLeft, setTimeLeft] = useState(
    Math.round((new Date(props.endTime).getTime() - Date.now()) / 1000)
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timeLeft <= 0) {
        window.location.reload()
        clearTimeout(timeout)
        return
      }

      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  })

  return (
    <span>[{unix(timeLeft).format("mm:ss")}]</span>
  )
}
