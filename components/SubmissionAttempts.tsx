import React, { useState } from "react";
import pluralize from 'pluralize'
import { v4 } from 'uuid'

import CorrectionHints from "../pages/assignments/CorrectionHints";
import { formatSubmissionCreateTime } from '../utils/date-utils'
import { decodeAttemptScript } from '../utils/score-utils'

const MAX_CORRECTIONS_SHOWN = 30

type Props = {
  corrections: any[]
  loadingCorrection: any
  toggledHint: number
  toggledAttempt: number
  onHintToggle: Function
  onAttemptToggle: Function
}

export default function SubmissionAttempts(props: Props) {
  const [extraAttemptsHidden, updateExtraAttemptsHidden] = useState(true)

  const handleExtraAttemptsShow = () => {
    updateExtraAttemptsHidden(false)
  }

  return (
    <div>
      <br />
      <h2>Attempts</h2>
      <div className='attempts-container'>
        <ul>
          {props.loadingCorrection && <li>{formatSubmissionCreateTime(props.loadingCorrection.createTime)} — submitted (correcting)</li>}
          {props.corrections.map((correction, i) => {
            if (i > MAX_CORRECTIONS_SHOWN && extraAttemptsHidden) {
              return null
            }

            if (!correction || correction?.score == null) {
              return (
                <li key={`correction-${v4()}`}>
                  in progress
                </li>
              )
            }

            return (
              <li key={`correction-${v4()}`}>
                {formatSubmissionCreateTime(correction?.createdAt)} — <b>{correction?.score} {pluralize('point', correction?.score)}</b>
                { } — <i className='hints-toggle-handle' onClick={() => props.onHintToggle(i)}>{props.toggledHint === i ? '(hide hints)' : '(show hints)'}</i>
                { } | <i className='hints-toggle-handle' onClick={() => props.onAttemptToggle(i)}>{props.toggledAttempt === i ? '(hide attempt)' : '(show attempt)'}</i>
                {props.toggledHint === i && <CorrectionHints data={correction?.data} />}
                <br />
                {props.toggledAttempt === i &&
                  <pre>
                    {decodeAttemptScript(correction?.submissionData)}
                  </pre>
                }
              </li>
            )
          })}
          {extraAttemptsHidden && props.corrections.length > MAX_CORRECTIONS_SHOWN && <a href='#' onClick={handleExtraAttemptsShow}>show more</a>}
        </ul>
      </div>
    </div>
  )
}
