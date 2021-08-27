import React from 'react'
import {
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions
} from 'react-native'

import styled from 'styled-components/native'

import { SIZE } from './Head'

const Pellet = ({ position, color }) => {
    const x = position[0] - SIZE,
        y = position[1] - SIZE

    return (
        <PelletView x={x} y={y} color={color} />
    )
}

const PelletView = styled.View`
    position: absolute;
    width: ${SIZE}px;
    height: ${SIZE}px;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    background-color: ${props => props.color};
    border: 1px solid #333;
`

export default Pellet