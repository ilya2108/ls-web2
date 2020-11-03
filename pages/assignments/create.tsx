import { gql } from 'graphql-request'
import React, { ChangeEvent, useState } from 'react'
import { useDispatch } from "react-redux";
import { encode } from "js-base64"
import Button from "@atlaskit/button";

import Layout from '../../layout/Layout'
import { fetcher } from '../../modules/api'
import { assignmentCreatedFlag } from "../../modules/core/redux/flag/flag.actions";


type Props = {
  assignment?: any
}


export default function CreateAssignment({ assignment }: Props = {}) {
  const dispatch = useDispatch();
  const [description, updateDescription] = useState(assignment.description || '')
  const [solution, updateSolution] = useState(assignment.solution || '')
  const [name, updateName] = useState(assignment.name || '')

  const [testCases, updateTestCases] = useState(assignment.testcases || [])


  const handleSolutionChange = (e) => {
    updateSolution(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    updateDescription(e.target.value)
  }

  const handleNameChange = (e) => {
    updateName(e.target.value)
  }

  const handleTestCaseAdd = () => {
    updateTestCases(testCases.concat([{
      name: '',
      num_repetitions: 1,
      check_stdout: true,
      check_stderr: false,
      check_files: true,
      check_excessive_files: false,
      check_files_content: false,
      check_hardlinks: false,
      check_return_code: true,
      check_permissions: false,
      lidl: '{}',
      score: 1,
    }]))
  }

  const handleTestCaseRemove = (indexToRemove: number) => {
    updateTestCases(testCases.reduce((cases, testCase, i) => {
      if (indexToRemove !== i) {
        cases.push(testCase)
        return cases
      }

      return cases
    }, []))
  }

  const handleTestcaseNameChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    updateTestCases(testCases.reduce((cases, testCase, i) => {
      if (index !== i) {
        cases.push(testCase)
        return cases
      }

      cases.push({
        ...testCase,
        name: e.target.value,
      })

      return cases
    }, []))
  }

  const handleTestcaseLidlChange = (index: number, e: ChangeEvent<HTMLTextAreaElement>) => {
    updateTestCases(testCases.reduce((cases, testCase, i) => {
      if (index !== i) {
        cases.push(testCase)
        return cases
      }

      cases.push({
        ...testCase,
        lidl: e.target.value,
      })

      return cases
    }, []))
  }

  const handleTestcaseScoreChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    updateTestCases(testCases.reduce((cases, testCase, i) => {
      if (index !== i) {
        cases.push(testCase)
        return cases
      }

      cases.push({
        ...testCase,
        score: parseInt(e.target.value),
      })

      return cases
    }, []))
  }

  const handleTestcaseRepetitionsChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    updateTestCases(testCases.reduce((cases, testCase, i) => {
      if (index !== i) {
        cases.push(testCase)
        return cases
      }

      cases.push({
        ...testCase,
        num_repetitions: parseInt(e.target.value),
      })

      return cases
    }, []))
  }

  const handleTestcaseCheckboxToggle = (index: number, checkboxName: string) => {
    updateTestCases(testCases.reduce((cases, testCase, i) => {
      if (index !== i) {
        cases.push(testCase)
        return cases
      }

      cases.push({
        ...testCase,
        [checkboxName]: !testCase[checkboxName]
      })

      return cases
    }, []))
  }

  const handleSubmit = () => {
    console.log("Creating assignment", solution, testCases)

    const encodedSolution = encode(solution)
    const encodedTestCases = testCases.map((testCase) => {
      return {
        ...testCase,
        lidl: encode(testCase.lidl),
      }
    })
    const testCasesJson = JSON.stringify(encodedTestCases).replace(/"/g, '\\"')

    const mutation = assignment ? 'AssignmentUpdate': 'AssignmentCreate'
    const idpart = assignment ? `id: ${assignment.id}` : ''
    const action = assignment ? 'create' : 'edit'

    fetcher(gql`mutation submit {
      ${mutation}(data: {
        id: ${assignment.id || null}
        courseId: 1,
        templateId: 1,
        name: "${name}",
        description: "${description}"
        generatorData: "{\\"lidl\\": \\"bmFtZT0ne3sgZW52LnVzZXJuYW1lIH19Jwo=\\"}"
        correctionData: "{\\"solution\\": \\"${encodedSolution}\\", \\"testcases\\": ${testCasesJson}}"
      }) {
        object {
          id
        }
      }
    }`)
    .then((response) => {
      const assignmentTemplateId = response[mutation]?.object?.id
      if (!assignmentTemplateId) {
        dispatch(assignmentCreatedFlag('error', `Failed to ${action} assignment`))
        return
      }

      console.log("Created assignment", {assignmentTemplateId})
      dispatch(assignmentCreatedFlag('success', `Assignment ${action} successful`))
    })
    .catch((error) => {
      dispatch(assignmentCreatedFlag('error', `Failed to ${action} assignment`))
      console.error(error)
    })
  }

  return (
    <Layout>
      <h1>{assignment ? 'Edit' : 'Create'} an assignment</h1>
      <br />
      <input className="assignment-name-input" placeholder="Assignment name" name="name" onChange={handleNameChange} defaultValue={name} />

      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          rows={10}
          spellCheck="false"
          placeholder="Markdown assignment text"
          defaultValue={description}
          onBlur={handleDescriptionChange}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="textarea"
          rows={10}
          spellCheck="false"
          placeholder="Expected solution"
          defaultValue={solution}
          onBlur={handleSolutionChange}
          onChange={handleSolutionChange}
        />
      </div>

      {assignment &&
        <Button
          appearance="primary"
          spacing="compact"
          href={`${process.env.BACKEND_ROOT_URI}/admin/assignment/assignment/${assignment.id}/change/`}
          target="_blank"
        >
          Admin link
        </Button>
      }

      <h2>Test cases</h2>
      <br />
      <button onClick={handleTestCaseAdd}>Add a test case</button>
      <br />
      <br />
      <div className='testcases-container'>
        {testCases.map((testcase, i) => {
          return (
            <div key={`testcase-${i}`}>
              <div>---- Test case {i+1} ------ <i className="hints-toggle-handle" onClick={() => handleTestCaseRemove(i)}>(remove) </i></div>
              <br />
              <input placeholder="Name" className='testcase-name-input' defaultValue={testcase.name} onChange={(e) => handleTestcaseNameChange(i, e)} />
              <div className="textarea-wrapper">
                <textarea
                  className="textarea"
                  rows={4}
                  spellCheck="false"
                  placeholder="Lidl"
                  defaultValue=""
                  onChange={(e) => handleTestcaseLidlChange(i, e)}
                />
              </div>
              <input type="number" placeholder="Repetitions" defaultValue={testcase.num_repetitions} onChange={(e) => handleTestcaseRepetitionsChange(i, e)} /> Repetitions <br/>
              <input type="number" placeholder="Score" defaultValue={testcase.score} onChange={(e) => handleTestcaseScoreChange(i, e)} /> Score <br/>
              <br />
              <br />
              <input defaultChecked={testcase.check_stdout} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_stdout")} /> Check stdout <br /> 
              <input defaultChecked={testcase.check_stderr} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_stderr")} /> Check stderr <br /> 
              <input defaultChecked={testcase.check_files} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_files")} /> Check files <br /> 
              <input defaultChecked={testcase.check_excessive_files} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_excessive_files")} /> Check excessive files <br /> 
              <input defaultChecked={testcase.check_files_content} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_files_content")} /> Check file content <br /> 
              <input defaultChecked={testcase.check_hardlinks} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_hardlinks")} /> Check hardlinks <br /> 
              <input defaultChecked={testcase.check_return_code} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_return_code")} /> Check return code <br /> 
              <input defaultChecked={testcase.check_permissions} type="checkbox" onClick={(e) => handleTestcaseCheckboxToggle(i, "check_permissions")} /> Check permissions <br /> 
              <br />
              <br />
            </div>
          )
        })}
      </div>
      
      <div>----------------------------------------------------------–</div>
      <div>----------------------------------------------------------–</div>
      <br />
      <br />
      <div className="testcases-container">
        <input type="number" placeholder="Course ID" defaultValue={1} /> Course ID
        <i> (NOTE: (1) BI-PS1, (2) BIE-PS1, (5) BIK-PS1)</i> <br />
        <input type="number" placeholder="Template ID" defaultValue={1} /> Template ID
        <i> (NOTE: (1) BI-PS1, (2) BIE-PS1, (3) BIK-PS1)</i> <br />
        <br />
      </div>
      <br />      
      <button onClick={handleSubmit}>{assignment ? 'Edit assignment' : 'Submit assignment draft'}</button>
    </Layout>
  )
}
