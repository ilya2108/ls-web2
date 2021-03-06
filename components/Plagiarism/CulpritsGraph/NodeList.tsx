import React from 'react'
import Link from 'next/link'

import type { Email } from './CulpritsNetworkGraph'

type Props = {
    nodes: Array<Email>
}

export default function CulpritGraphSettings({ nodes }: Props) {
    return (
        <>
            <h3>Nodes: </h3>
            <p className="mt-0 mb-3">Count: {nodes.length}</p>
            {nodes.sort().map(node => {
                return (
                    <div key={node}>
                        <Link href={`/plagiarism/user/${encodeURIComponent(node)}`}>
                            <a>{node}</a>
                        </Link>
                        <br />
                    </div>
                )
            })}
        </>
    );
};
