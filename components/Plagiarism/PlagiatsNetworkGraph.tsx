import React from 'react';

import { ResponsiveNetwork } from '@nivo/network'
import { createCoworkerSet, createCulpritsSet, getPlagiatsOfCulprit } from '../../utils/plagiarism/plagiarism-utils'
import CulpritGraph from '../../utils/plagiarism/culprit-graph';
import { hexToRGBA } from '@atlaskit/atlassian-navigation/dist/cjs/theme';

export default function PlagiatsNetworkGraph({ plagiats, mainCulprit = null }) {

    const culpritGraph = new CulpritGraph
    culpritGraph.addPlagiats(plagiats)

    return (
        <div className="nivo-wrapper">
            <ResponsiveNetwork
                nodes={culpritGraph.nodes.map(n => {
                    return {
                        id: n.email,
                        color: "rgb(97, 205, 187)",
                        radius: 4,
                    }
                })}
                links={culpritGraph.links.map(l => {
                    return {
                        data: l,
                        source: l.source.email,
                        target: l.target.email
                    }
                })}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                repulsivity={5}
                iterations={100}
                nodeColor={function(e){return e.color}}
                nodeBorderWidth={1}
                nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.8 ] ] }}
                linkThickness={function(e){return 1}}
                distanceMin={2}
                animate={false}
                motionStiffness={160}
                motionDamping={12}
                // tooltip={node => {
                //     return (
                //         <div>
                //             <div>
                //                 <strong style={{ color: node.color }}>ID: {node.id}</strong>
                //                 <br />
                //                 Depth: {node.depth}
                //                 <br />
                //                 Radius: {node.radius}
                //             </div>
                //         </div>
                //     )
                // }}
            />
        </div>
    );
};
