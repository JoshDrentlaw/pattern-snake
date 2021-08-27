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

const Head = ({ position }) => {
    const x = position[0] - (SIZE / 2),
        y = position[1] - (SIZE / 2)

    return (
        <HeadView x={x} y={y}></HeadView>
    )
}

const HeadView = styled.View`
    position: absolute;
    width: ${SIZE}px;
    height: ${SIZE}px;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    background: #333;
`

export default Head