import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table'
import Lozenge from '@atlaskit/lozenge';

export default function PlagiaristTable({ plagiats }) {
    const removeDuplicates = (arr: Array<any>) => Array.from(new Set(arr)) //Remove duplicates from array

    //Set of all plagiarists
    const plagiarists = removeDuplicates(plagiats.map(x => x.culprits).reduce((a, b) => a.concat(b)))

    //Table rows with all plagiarists (email + count of plagiats)
    const tableRows = plagiarists.map((plag, i) => {
        const count = plagiats.filter(plagiat => plagiat.culprits.includes(plag)).length //Count plagiats of plagirist
        return { cells: [
            { key: plag, content: plag },
            { key: count, content: count}
        ], key: plag}
    })

    const tableHeadMapped = ["Email", "Count of plagiats"].map(name => ({
        key: name,
        content: name,
        isSortable: true
    }))
    const tableHead = { cells: tableHeadMapped }

    return (
        <div>
                <div>
                    <DynamicTable
                        head={tableHead}
                        rows={plagiats ? tableRows : null}
                        rowsPerPage={10}
                        defaultPage={1}
                        isFixedSize
                        defaultSortKey="Count of plagiats"
                        defaultSortOrder="DESC"
                    /> 
                </div>
        </div>
    );
};