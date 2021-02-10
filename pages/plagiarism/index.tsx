import React from 'react';
import Layout from "../../layout/Layout";

import Badge from '@atlaskit/badge';
import Lozenge from '@atlaskit/lozenge';

import plagiats from './json/res_semester_anonymized_pretty.json';

export default function users() {
    return (
        <Layout>
            {/* TODO - Move to its own component */}
            {plagiats.map((plagiat, index) => {
                return (
                    <div key={index} className="plagiat-wrapper">
                        <div className="plagiat-header">
                            {/* TODO - Change to link */}
                            <h1>{plagiat.culprit_assignment_name}</h1>
                            <Badge>{"Count: " + plagiat.culprit_count}</Badge>
                        </div>
                        <code>{plagiat.script}</code>
                        <h2>Culprits:</h2><br />
                        <div className="culprits">
                            {plagiat.culprits.map((culprit, index) => {
                                return (
                                    <span key={index}>
                                        {/* TODO - Change to link */}
                                        <Lozenge>{culprit}</Lozenge>
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </Layout>
    );
}