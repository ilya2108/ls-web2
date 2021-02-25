import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table'
import Link from "next/link";

export default function PlagiaristCoworkers({ plagiats, userEmail }) {
    const removeDuplicates = (arr: Array<any>) => Array.from(new Set(arr)) //Remove duplicates from array

    const plagiatsFiltered = plagiats.filter(plagiat => plagiat.culprits.includes(userEmail))

    //Set of all plagiarists that had same solution as plagiarist (without plagiarist himself)
    const coworkers = removeDuplicates(plagiatsFiltered.map(x => x.culprits).reduce((a, b) => a.concat(b))).filter(x => x !== userEmail)

    //Table rows with all coworkers (email + count of same solutions)
    const tableRows = coworkers.map((plag, i) => {
        const count = plagiatsFiltered.filter(plagiat => plagiat.culprits.includes(plag)).length
        return { cells: [
            { key: plag, content: (
                <Link href={`/plagiarism/user/${encodeURIComponent(plag)}`}>
                    <a>{plag}</a>
                </Link>)},
            { key: count, content: count},
            { key: count, content: (count * 100 / plagiats.length).toFixed(2) + "%"}
        ], key: plag}
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