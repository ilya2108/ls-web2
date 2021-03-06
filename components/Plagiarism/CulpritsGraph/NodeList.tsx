import React, { useState } from 'react'
import Link from 'next/link'
import debounce from 'lodash/debounce'

import Textfield from '@atlaskit/textfield'
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search'

import type { Email } from './CulpritsNetworkGraph'

type Props = {
    nodes: Array<Email>,
    highlightNode: Email
}

export default function CulpritGraphSettings({ nodes, highlightNode = null }: Props) {
    // Search input
    const [inputVal, setInputVal] = useState("");
    const setInputValDebounced = debounce(setInputVal, 300)
    const handleSearchEvent = (event) => {
        const { value } = event.target
        setInputValDebounced(value)
    }

    const filterNodes = (nodes) => {
        return nodes.filter(node => {
            return node.toLowerCase().includes(inputVal.toLowerCase())
        })
    }

    return (
        <>
            <h3>Nodes: </h3>
            <p className="mt-0 mb-3">Count: {nodes.length}</p>

            <div className="mb-3">
                <Textfield
                    className="search-field"
                    name="basic"
                    isCompact
                    placeholder="Search username"
                    elemAfterInput={<EditorSearchIcon label="" />}
                    onChange={(event) => handleSearchEvent(event)}
                />
            </div>

            {filterNodes(nodes).sort().map(node => {
                if(node === highlightNode) {
                    return (
                        <div className="node-list-row active" key={node}>
                            {node}
                        </div>
                    )
                } else {
                    return (
                        <Link key={node} href={`/plagiarism/user/${encodeURIComponent(node)}`}>
                            <div className="node-list-row">
                                <a>{node}</a>
                            </div>
                        </Link>
                    )
                }
            })}
        </>
    );
};
