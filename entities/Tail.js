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

export const SIZE = 10
export const tailSpacer = 0

const Tail = ({ position, color }) => {
    const x = position[0] - (SIZE  / 2),
        y = position[1] - (SIZE  / 2)

    return (
        <TailView x={x} y={y} color={color}></TailView>
    )
}

const TailView = styled.View`
    position: absolute;
    width: ${SIZE}px;
    height: ${SIZE}px;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    background-color: ${props => props.color};
    border: 1px solid #333;
`

export default Tail