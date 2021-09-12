import React from 'react'
import {StatusBar, StyleSheet, Text, useColorScheme, View, Dimensions} from 'react-native'

import styled from 'styled-components/native'

export const SIZE = 10
export const tailSpacer = 0

const Tail = ({position, color}) => {
    const x = position[0] * SIZE,
        y = position[1] * SIZE

    return <TailView x={x} y={y} color={color} />
}

const TailView = styled.View`
    position: absolute;
    width: ${SIZE}px;
    height: ${SIZE}px;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    background-color: ${props => props.color};
    border-radius: 2.5px;
    border: 1px solid #20232a;
`

export default Tail
