import React, { useState } from 'react'

import Toggle from '@atlaskit/toggle'
import Range from '@atlaskit/range'
import Button from '@atlaskit/button'

import { Node, Link } from '../../../utils/plagiarism/culprit-graph'

export interface Settings {
    repulsivity: {
        manualRepulsivity: boolean,
        manualValue: number,
        function: (nodesLength: number) => number,
    },
    radius: {
        dynamicRadius: boolean,
        function: (node: Node) => number,
    }
    linkWidth: {
        dynamicWidth: boolean,
        function: (link: Link) => number,
    },
    depth: number,
    animationsEnabled: boolean
}

import { SettingGroup, SettingRow, RangeWrapper } from '../../../pages-styles/Plagiarism/Plagiarism.styles'
import { calculateRepulsivity, calculateRadius, calculateLinkWidth, defaultSettings } from '../../../utils/plagiarism/culprit-graph'

export default function CulpritGraphSettings({ updateSettings, displayDepth = false }) {
    const [manualRepulsivity, setManualRepulsivity] = useState(false)
    const [repulsivity, setRepulsivity] = useState(10)
    const [dynamicRadius, setDynamicRadius] = useState(true)
    const [dynamicWidth, setDynamicWidth] = useState(true)
    const [depth, setDepth] = useState(defaultSettings.depth)
    const [animationsEnabled, setAnimationsEnabled] = useState(defaultSettings.animationsEnabled)

    const settings: Settings = {
        repulsivity: {
            manualRepulsivity,
            manualValue: repulsivity,
            function: calculateRepulsivity(manualRepulsivity, repulsivity)
        },
        radius: {
            dynamicRadius,
            function: calculateRadius(dynamicRadius),
        },
        linkWidth: {
            dynamicWidth,
            function: calculateLinkWidth(dynamicWidth),
        },
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
