import React, { useState } from 'react'

import { ResponsiveNetwork } from '@nivo/network'
import { countPlagiatsOfCulprit, createCoworkerSet, createCulpritsSet, getPlagiatsOfCulprit } from '../../utils/plagiarism/plagiarism-utils'
import CulpritGraph from '../../utils/plagiarism/culprit-graph'

import Button from '@atlaskit/button'

export default function PlagiatsNetworkGraph({ plagiats, mainCulprit = null }) {
    const primaryColor = "rgb(7, 71, 166)"
    const secondaryColor = "rgb(166, 7, 71)"

    const [depth, setDepth] = useState(0)

    const culpritGraph = new CulpritGraph
    if(!mainCulprit) culpritGraph.addPlagiats(plagiats)
    else             culpritGraph.addPlagiatsMainCulprit(plagiats, mainCulprit, depth)

    return (
        <div className="nivo-wrapper">
            {mainCulprit &&
                <div className="settings">
                    <Button appearance="primary" onClick={() => setDepth(depth + 1)}>Depth + 1</Button>
                    <Button appearance="primary" onClick={() => setDepth(depth - 1)}>Depth - 1</Button>
                    <p>Current depth: {depth}</p>
                </div>
            }
            <ResponsiveNetwork
                nodes={culpritGraph.nodes.map(n => {
                    let res = {
                        id: n.email,
                        color: primaryColor,
                        radius: Math.min(Math.max(n.countAsSource + n.countAsTarget, 1), 5),
                        count: countPlagiatsOfCulprit(plagiats, n.email),
                        depth: n.depth
                    }
                    if(mainCulprit === n.email) res.color = secondaryColor
                    return res
                })}
                links={culpritGraph.links.map(l => {
                    return {
                        data: l,
                        source: l.source.email,
                        target: l.target.email
                    }
                })}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                repulsivity={culpritGraph.repulsivity()}
                iterations={100}
                nodeColor={function(e){return e.color}}
                nodeBorderWidth={2}
                nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
                linkThickness={(e) => e.data.count}
                linkColor={(e) => e.source.color}
                animate={false}
                tooltip={node => {
                    return (
                        <div>
                            <strong style={{ color: node.color }}>Email: {node.id}</strong>
                            <br />
                            Number of plagiats: {node.count}
                            <br />
                            Depth: {node.depth}
                        </div>
                    )
                }}
            />
        </div>
    );
};
