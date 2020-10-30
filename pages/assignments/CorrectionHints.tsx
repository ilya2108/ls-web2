import React from 'react'
import { v4 } from 'uuid'

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
          return (
            <li key={`correction-${v4()}`}>
              <div>
              Test: {testcase.name} — {testcase.verdict.replace(/ANSWER/, 'SOLUTION')}
              </div>
              {testcase.erorrs &&
                <>
                  <br />
                  <pre>
                    {testcase.erorrs}
                  </pre>
                </>
              }
            </li>
          )
        })}
      </ol>
    )
  } catch (e) {
    return <>no hints</>
  }
}
