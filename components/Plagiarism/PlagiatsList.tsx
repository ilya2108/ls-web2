import React from 'react'

import Link from 'next/link'

import Badge from '@atlaskit/badge'
import Lozenge from '@atlaskit/lozenge'

export default function PlagiatsList({ plagiats, highlightUser = null }) {
    return (
        <div>
            {plagiats.map((plagiat, index) => {
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
                    </div>
                )
            })}
        </div>
    );
};
