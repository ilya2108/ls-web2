import React, { useState } from 'react'

import Link from 'next/link'

import Badge from '@atlaskit/badge'
import Lozenge from '@atlaskit/lozenge'
import Button from '@atlaskit/button'
import CheckIcon from '@atlaskit/icon/glyph/check';

import { resolvePlagiat } from '../../utils/plagiarism/plagiarism-utils'

export default function PlagiatsList({ plagiats:plagiatsProp, highlightUser = null }) {
    const [plagiats, setPlagiats] = useState(plagiatsProp)

    const resolveButtonClicked = (id: number) => {
        setPlagiats([...resolvePlagiat(plagiats, id)])
    }

    return (
        <div>
            {plagiats.map((plagiat, index) => {
                if(plagiat.resolved === true) {
                    return (
                        <div key={index} className="plagiat-wrapper">
                            <div className="plagiat-header">
                                <Link href={`/plagiarism/assignment/${encodeURIComponent(plagiat.culprit_assignment_name)}`}>
                                    <h1><a>{plagiat.culprit_assignment_name}</a></h1>
                                </Link>
                                <span className="resolved-text"><Lozenge appearance="success">Resolved</Lozenge></span>
                                <Badge>{"Count: " + plagiat.culprit_count}</Badge>
                            </div>
                        </div>
                    )
                }

                return (
                    <div key={index} className="plagiat-wrapper">
                        <div className="plagiat-header">
                            <Link href={`/plagiarism/assignment/${encodeURIComponent(plagiat.culprit_assignment_name)}`}>
                                <h1><a>{plagiat.culprit_assignment_name}</a></h1>
                            </Link>
                            <Badge>{"Count: " + plagiat.culprit_count}</Badge>
                        </div>
                        <code>{plagiat.script}</code>
                        <h2>Culprits:</h2><br />
                        <div className="culprits">
                            {plagiat.culprits.map((culprit, index) => {
                                return (
                                    <span key={index}>
                                        <Lozenge
                                            appearance={culprit === highlightUser ? "new" : "default"}>
                                            {/* TODO - Later change from culprit's email to ID */}
                                            <Link href={`/plagiarism/user/${encodeURIComponent(culprit)}`}>
                                                <a>{culprit}</a>
                                            </Link>
                                        </Lozenge>
                                    </span>
                                )
                            })}
                        </div>
                        <div className="plagiat-action">
                            <Button
                                iconAfter={<CheckIcon label="Star icon" size="small" />}
                                onClick={() => {resolveButtonClicked(index)}}
                            >Resolve</Button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};
