import React, { useState } from 'react'

import Link from 'next/link'

import Badge from '@atlaskit/badge'
import Lozenge from '@atlaskit/lozenge'
import Button from '@atlaskit/button'
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search'
import Select from "@atlaskit/select";
import Textfield from '@atlaskit/textfield'

import debounce from 'lodash/debounce'

import { resolvePlagiat, sortingFunctions } from '../../utils/plagiarism/plagiarism-utils'
import { ScriptDescriptor } from '../../utils/plagiarism/plagiarism.types'

export default function PlagiatsList({ plagiats:plagiatsProp, highlightUser = null }) {
    const [plagiats, setPlagiats] = useState(plagiatsProp)

    // Sorting
    type SelectedSortingType = {
        label: string;
        value: string;
    };
    enum sortOptions {
        "Culprits count descending" = "countDSC",
        "Culprits count ascending" = "countASC",
        "Assignment name descending" = "nameDSC",
        "Assignment name ascending" = "nameASC",
    }
    const [selectedSorting, setSelectedSorting] = useState(() => sortingFunctions.countDSC);

    // Search input
    const [inputVal, setInputVal] = useState("");
    const setInputValDebounced = debounce(setInputVal, 300)
    const handleSearchEvent = (event) => {
        const { value } = event.target;
        setInputValDebounced(value)
    };

    const filterPlagiats = (plagiats) => {
        const sortingFunction = selectedSorting || sortingFunctions.countDSC
        return plagiats.filter((plagiat: ScriptDescriptor) => {
            const val = inputVal.toLowerCase()
            return (
                plagiat.culprit_assignment_name.toLowerCase().includes(val) ||
                plagiat.culprits.some((culprit) => {
                    return culprit.toLowerCase().includes(val)
                })
            )
        }).sort(sortingFunction)
    }

    const resolveButtonClicked = (id: number) => {
        setPlagiats([...resolvePlagiat(plagiats, id)])
    }

    return (
        <div>
            <div className="plagiat-list-actions">
                <div className="plagiat-list-action mr-3 pb-3">
                    <Textfield
                        name="basic"
                        isCompact
                        placeholder="Search assignment or username"
                        elemAfterInput={<EditorSearchIcon label="" />}
                        onChange={(event) => handleSearchEvent(event)}
                    />
                </div>
                <div className="plagiat-list-action">
                    <Select
                        className="plagiat-action-select mb-3"
                        onChange={(newValue) => {
                            const val = (newValue as SelectedSortingType).value
                            setSelectedSorting(() => sortingFunctions[val])
                        }}
                        options={Object.keys(sortOptions).map((key) => {
                            return {label: key, value: sortOptions[key] }
                        })}
                        placeholder="Choose sorting"
                    />
                </div>
            </div>

            {filterPlagiats(plagiats).map((plagiat, index) => {
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
