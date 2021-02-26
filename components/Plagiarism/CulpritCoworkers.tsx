import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table'
import Link from 'next/link'

import { countPlagiatsOfCulprit, createCoworkerSet, getPlagiatsOfCulprit } from '../../utils/plagiarism-utils'

export default function PlagiaristCoworkers({ plagiats, userEmail }) {
    const plagiatsFiltered = getPlagiatsOfCulprit(plagiats, userEmail)

    // Set of all plagiarists that had same solution as plagiarist (without plagiarist himself)
    const coworkers = createCoworkerSet(plagiatsFiltered, userEmail)

    // Table rows with all coworkers (email + count of same solutions)
    const tableRows = coworkers.map(coworker => {
        const count = countPlagiatsOfCulprit(plagiatsFiltered, coworker)
        return { cells: [
            { key: coworker, content: (
                <Link href={`/plagiarism/user/${encodeURIComponent(coworker)}`}>
                    <a>{coworker}</a>
                </Link>)},
            { key: count, content: count},
            { key: count, content: (count * 100 / plagiats.length).toFixed(2) + "%"}
        ], key: coworker}
    })

    const tableHeadMapped = ["Coworker", "Number of same solutions", `% of ${userEmail}'s plagiats`].map(name => ({
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
                defaultSortKey="Number of same solutions"
                defaultSortOrder="DESC"
            />
        </div>
    );
};
