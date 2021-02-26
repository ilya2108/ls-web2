import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table'
import Link from 'next/link'

import { createCulpritsSet, countPlagiatsOfCulprit } from '../../utils/plagiarism-utils'

export default function PlagiaristTable({ plagiats }) {
    // Set of all culprits
    const culprits = createCulpritsSet(plagiats)

    // Table rows with all plagiarists (email + count of plagiats)
    const tableRows = culprits.map(culprit => {
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
