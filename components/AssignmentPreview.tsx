import React, { useState } from 'react'
import Markdown from 'markdown-it';
import Button from "@atlaskit/button";

import AssignmentDescription from './AssignmentDescription';
import Layout from '../layout/Layout';
import CorrectionHints from '../pages/assignments/CorrectionHints';

const md = new Markdown()

type Props = {
  description: string
  testcases: any[]
  onPreviewClose: Function
}

export default function AssignmentPreview(props: Props) {
  const descriptionHtml = md.render(props.description)

  return (
    <Layout>
      <h1>Assignment preview: {name}</h1>
      <br />
      <AssignmentDescription assignmentHtml={descriptionHtml} />
      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          name="txt2"
          rows={10}
          spellCheck="false"
          placeholder="Solution"
          disabled
          value=""
        />
      </div>
      <br />
      <br />
      <CorrectionHints data={JSON.stringify({ testcases: props.testcases })} />
      <br />
      <Button
        appearance="subtle"
        onClick={() => props.onPreviewClose()}
      >
        Exit preview
      </Button>

    </Layout>
  )
}
