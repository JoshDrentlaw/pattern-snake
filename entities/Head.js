import React from 'react'
import {StatusBar, StyleSheet, Text, useColorScheme, View, Dimensions} from 'react-native'

import styled from 'styled-components/native'

export const SIZE = 10

const Head = ({position}) => {
    const x = position[0] * SIZE,
        y = position[1] * SIZE

    return <HeadView x={x} y={y} />
}

const HeadView = styled.View`
    position: absolute;
    width: ${SIZE}px;
    height: ${SIZE}px;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    background: #333;
    border-radius: 2px;
`

export default Head
