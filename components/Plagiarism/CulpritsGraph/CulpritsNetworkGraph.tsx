import React, { useState } from 'react'

import { ResponsiveNetwork } from '@nivo/network'
import { countPlagiatsOfCulprit } from '../../../utils/plagiarism/plagiarism-utils'
import CulpritGraph from '../../../utils/plagiarism/culprit-graph'
import NodeList from './NodeList'

import CulpritGraphSettings, { defaultSettings } from './CulpritGraphSettings'
import { NivoWrapper, NivoSettings, NivoGraph, NivoNodes } from '../../../pages-styles/Plagiarism/Plagiarism.styles'

export type Email = string
export type Link = {
    count: number,
    source: Email,
    target: Email
}

export interface Settings {
    repulsivity: (nodesLength: number) => number,
    radius: (node) => number,
    linkWidth: (link) => number,
    depth: number,
    animationsEnabled: boolean
}

export default function PlagiatsNetworkGraph({ plagiats, mainCulprit = null }) {
    const primaryColor = "rgb(7, 71, 166)"
    const secondaryColor = "rgb(166, 7, 71)"

    const [settings, setSettings] = useState<Settings>(defaultSettings)

    const updateSettings = (newSettings) => {
        setSettings(newSettings)
    }

    const culpritGraph = new CulpritGraph
    if(!mainCulprit) culpritGraph.addPlagiats(plagiats)
    else             culpritGraph.addPlagiatsMainCulprit(plagiats, mainCulprit, settings.depth)

    const nodesLength = culpritGraph.nodes.length

    return (
        <NivoWrapper>
            <NivoSettings>
                <CulpritGraphSettings updateSettings={updateSettings} displayDepth={mainCulprit} />
            </NivoSettings>
            <NivoGraph>
                <ResponsiveNetwork
                    nodes={culpritGraph.nodes.map(n => {
                        return {
                            id: n.email,
                            color: mainCulprit === n.email ? secondaryColor : primaryColor,
                            radius: settings.radius(n),
                            count: countPlagiatsOfCulprit(plagiats, n.email),
                            depth: n.depth
                        }
                    })}
                    links={culpritGraph.links.map(l => {
                        return {
                            count: l.count,
                            source: l.source.email,
                            target: l.target.email
                        }
                    })}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    repulsivity={settings.repulsivity(nodesLength)}
                    iterations={100}
                    nodeColor={function(e){return e.color}}
                    nodeBorderWidth={2}
                    nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
                    linkThickness={e => settings.linkWidth(e)}
                    linkColor={(e) => e.source.color}
                    animate={settings.animationsEnabled}
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
            </NivoGraph>
            <NivoNodes>
                <NodeList nodes={culpritGraph.nodes.map(node => node.email)} highlightNode={mainCulprit} />
            </NivoNodes>
        </NivoWrapper>
    );
};
