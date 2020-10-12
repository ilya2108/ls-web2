import React from 'react'

type Props = {
  data: any
}

export default function CorrectionHints(props: Props) {
  const { data } = props

  try {
    const testcases = JSON.parse(data).testcases

    return (
      <ol>
        {testcases.map((testcase) => {
          return <li>Test {testcase.name} — {testcase.verdict}</li>
        })}
      </ol>
    )
  } catch (e) {
    return <>no hints</>
  }
}
