import React, { useEffect, useState } from "react"
import dayjs, { unix } from 'dayjs'

type Props = {
  timeLeft: number
  endTime: string
}

export default function TimeLeft(props: Props) {
  const endTime = props.endTime.replace(/\+00\:00/, '')
  const [timeLeft, setTimeLeft] = useState(
    Math.round((dayjs(endTime).unix()+120*60 - (Date.now()/1000)))
  )

  useEffect(() => {
    const timeout = setInterval(() => {
      setTimeLeft((tl) => {
        const nextTl = tl - 1
        // NOTE: The timeouts here are shifted compared to server time.
        if (nextTl <= 3600) {
          window.location.reload()
          clearInterval(timeout)
          return
        }

        return nextTl
      })
    }, 1000)

    return () => {
      clearInterval(timeout)
    }
  }, [endTime])

  return (
    <span>[{unix(timeLeft).format("mm:ss")}]</span>
  )
}
