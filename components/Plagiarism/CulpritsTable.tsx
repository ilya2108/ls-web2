import React, { useState } from 'react';

import DynamicTable from '@atlaskit/dynamic-table'
import Textfield from '@atlaskit/textfield'
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search'
import Link from 'next/link'
import debounce from 'lodash/debounce'

import { createCulpritsSet, countPlagiatsOfCulprit } from '../../utils/plagiarism-utils'

export default function PlagiaristTable({ plagiats }) {
    // Search input
    const [inputVal, setInputVal] = useState("");
    const setInputValDebounced = debounce(setInputVal, 300)
    const handleSearchEvent = (event) => {
        const { value } = event.target;
        setInputValDebounced(value)
    };

    const filterCulprits = (culprits) => {
        return culprits.filter(culprit => {
            return culprit.toLowerCase().includes(inputVal.toLowerCase())
        })
    }

    // Set of all culprits
    const culprits = createCulpritsSet(plagiats)

    // Table rows with all plagiarists (email + count of plagiats)
    const tableRows = filterCulprits(culprits).map(culprit => {
        const count = countPlagiatsOfCulprit(plagiats, culprit)
        return { cells: [
            { key: culprit, content: (
                <Link href={`/plagiarism/user/${encodeURIComponent(culprit)}`}>
                    <a>{culprit}</a>
                </Link>)},
            { key: count, content: count}
        ], key: culprit}
    })

    const tableHeadMapped = ["Email", "Number of plagiats"].map(name => ({
        key: name,
        content: name,
        isSortable: true
    }))
    const tableHead = { cells: tableHeadMapped }

    return (
        <div>
            <Textfield
                name="basic"
                isCompact
                placeholder="Search username"
                elemAfterInput={<EditorSearchIcon label="" />}
                onChange={(event) => handleSearchEvent(event)}
            />
            <DynamicTable
                head={tableHead}
                rows={plagiats ? tableRows : null}
                rowsPerPage={10}
                defaultPage={1}
                isFixedSize
                defaultSortKey="Number of plagiats"
                defaultSortOrder="DESC"
            />
        </div>
    );
};
