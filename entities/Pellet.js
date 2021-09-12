import React from 'react'
import {StatusBar, StyleSheet, Text, useColorScheme, View, Dimensions} from 'react-native'

import styled from 'styled-components/native'

import {SIZE} from './Head'

const Pellet = ({position, color}) => {
    const x = position[0] * SIZE - 1,
        y = position[1] * SIZE - 1

    return <PelletView x={x} y={y} color={color} />
}

const PelletView = styled.View`
    position: absolute;
    width: ${SIZE + 2}px;
    height: ${SIZE + 2}px;
    left: ${props => props.x}px;
    top: ${props => props.y}px;
    background-color: ${props => props.color};
    border-radius: 2.5px;
    border: 2px solid #20232a;
`

export default Pellet
