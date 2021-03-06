import React, { useState } from 'react'

import Toggle from '@atlaskit/toggle'
import Range from '@atlaskit/range'
import Button from '@atlaskit/button'

import type { Settings, Link } from './CulpritsNetworkGraph'
import type { Node } from '../../../utils/plagiarism/culprit-graph'

const dynamicRepulsivityFunc = (n) => {
    if(n > 500) return 1
    if(n > 300) return 5
    if(n > 200) return 15
    if(n > 150) return 50
    if(n > 100) return 100
    if(n > 70) return 250
    if(n > 50) return 500
    if(n > 10) return 750
    if(n >= 1) return 1000
    else return 0
}
const dynamicRadiusFunc = (node: Node) => {
    return Math.min(Math.max(node.countAsSource + node.countAsTarget, 1), 8)
}
const dynamicWidthFunc = (link: Link) => link.count

export const defaultSettings: Settings = {
    repulsivity: dynamicRepulsivityFunc,
    radius: dynamicRadiusFunc,
    linkWidth: dynamicWidthFunc,
    depth: 1
}

export default function CulpritGraphSettings({ updateSettings, displayDepth = false }) {
    const [manualRepulsivity, setManualRepulsivity] = useState(false)
    const [repulsivity, setRepulsivity] = useState(10)
    const [dynamicRadius, setDynamicRadius] = useState(true)
    const [dynamicWidth, setDynamicWidth] = useState(true)
    const [depth, setDepth] = useState(1)

    const calculateRepulsivity = (n: number) => {
        if(manualRepulsivity) return repulsivity
        else return dynamicRepulsivityFunc(n)
    }

    const calculateLinkWidth = () => {
        if(dynamicWidth) {
            return (link) => dynamicWidthFunc(link)
        } else {
            return () => 1
        }
    }

    const calculateRadius = () => {
        if(dynamicRadius) {
            return (node) => dynamicRadiusFunc(node)
        } else {
            return () => 9
        }
    }

    const settings: Settings = {
        repulsivity: calculateRepulsivity,
        radius: calculateRadius(),
        linkWidth: calculateLinkWidth(),
        depth: depth
    }

    const applySettings = () => {
        updateSettings(settings)
    }

    return (
        <>
            <h3 className="mb-2">Settings</h3>
            {displayDepth && <div>
                <h4>Depth</h4>
                <p className="mt-0">Current: {depth}</p>
                <Range
                    isDisabled={!displayDepth}
                    value={depth}
                    min={1}
                    max={10}
                    onChange={value => {
                        setDepth(value)
                    }}
                />
            </div>}
            <div>
                <h4>Repulsivity</h4>
                <div className="align-center">
                    <span>Manual: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={manualRepulsivity}
                        onChange={() => {
                            setManualRepulsivity(prev => !prev)
                        }}
                    />
                </div>
                {manualRepulsivity && (
                    <>
                        <span>{repulsivity}</span>
                        <Range
                            isDisabled={!manualRepulsivity}
                            value={repulsivity}
                            min={1}
                            max={1000}
                            onChange={value => {
                                setRepulsivity(value)
                            }}
                        />
                    </>)
                }
            </div>
            <div>
                <h4>Nodes</h4>
                <div className="align-center">
                    <span className="mt-0">Dynamic radius: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={dynamicRadius}
                        onChange={() => {
                            setDynamicRadius(prev => !prev)
                        }}
                    />
                </div>
            </div>
            <div>
                <h4>Links</h4>
                <div className="align-center">
                    <span className="mt-0">Dynamic width: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={dynamicWidth}
                        onChange={() => {
                            setDynamicWidth(prev => !prev)
                        }}
                    />
                </div>
            </div>
            <Button className="mt-3" appearance="primary" onClick={applySettings}>
                Apply
            </Button>
        </>
    )
}
