import React, { useState } from 'react'

import Toggle from '@atlaskit/toggle'
import Range from '@atlaskit/range'
import Button from '@atlaskit/button'

import type { Settings, Link } from './CulpritsNetworkGraph'
import type { Node } from '../../../utils/plagiarism/culprit-graph'

import { SettingGroup, SettingRow, RangeWrapper } from '../../../pages-styles/Plagiarism/Plagiarism.styles'

const dynamicRepulsivityFunc = (n) => {
    if(n > 500) return 1
    if(n > 300) return 4
    if(n > 200) return 12
    if(n > 150) return 25
    if(n > 100) return 50
    if(n > 70) return 200
    if(n > 50) return 400
    if(n > 10) return 650
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
    depth: 1,
    animationsEnabled: false
}

export default function CulpritGraphSettings({ updateSettings, displayDepth = false }) {
    const [manualRepulsivity, setManualRepulsivity] = useState(false)
    const [repulsivity, setRepulsivity] = useState(10)
    const [dynamicRadius, setDynamicRadius] = useState(true)
    const [dynamicWidth, setDynamicWidth] = useState(true)
    const [depth, setDepth] = useState(defaultSettings.depth)
    const [animationsEnabled, setAnimationsEnabled] = useState(defaultSettings.animationsEnabled)

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
            return () => 5
        }
    }

    const settings: Settings = {
        repulsivity: calculateRepulsivity,
        radius: calculateRadius(),
        linkWidth: calculateLinkWidth(),
        depth: depth,
        animationsEnabled: animationsEnabled
    }

    const applySettings = () => {
        updateSettings(settings)
    }

    return (
        <>
            <h3 className="mb-2">Settings</h3>
            {displayDepth &&
            <SettingGroup>
                <h4>Depth</h4>
                <RangeWrapper>
                    <span className="mt-0">{depth}</span>
                    <Range
                        isDisabled={!displayDepth}
                        value={depth}
                        min={1}
                        max={10}
                        onChange={value => {
                            setDepth(value)
                        }}
                    />
                </RangeWrapper>
            </SettingGroup>}
            <SettingGroup>
                <h4>Repulsivity</h4>
                <SettingRow className="align-center">
                    <span>Manual: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={manualRepulsivity}
                        onChange={() => {
                            setManualRepulsivity(prev => !prev)
                        }}
                    />
                </SettingRow>
                {manualRepulsivity && (
                    <RangeWrapper>
                        <span className="mr-2">{repulsivity}</span>
                        <Range
                            isDisabled={!manualRepulsivity}
                            value={repulsivity}
                            min={1}
                            max={1000}
                            onChange={value => {
                                setRepulsivity(value)
                            }}
                        />
                    </RangeWrapper>)
                }
            </SettingGroup>
            <SettingGroup>
                <h4>Nodes</h4>
                <SettingRow className="align-center">
                    <span className="mt-0">Dynamic radius: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={dynamicRadius}
                        onChange={() => {
                            setDynamicRadius(prev => !prev)
                        }}
                    />
                </SettingRow>
            </SettingGroup>
            <SettingGroup>
                <h4>Links</h4>
                <SettingRow className="align-center">
                    <span className="mt-0">Dynamic width: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={dynamicWidth}
                        onChange={() => {
                            setDynamicWidth(prev => !prev)
                        }}
                    />
                </SettingRow>
            </SettingGroup>
            <SettingGroup>
                <h4>Animations</h4>
                <SettingRow className="align-center">
                    <span className="mt-0">Enabled: </span>
                    <Toggle
                        id="toggle-default"
                        isChecked={animationsEnabled}
                        onChange={() => {
                            setAnimationsEnabled(prev => !prev)
                        }}
                    />
                </SettingRow>
            </SettingGroup>
            <Button className="mt-2" appearance="primary" onClick={applySettings}>
                Apply
            </Button>
        </>
    )
}
