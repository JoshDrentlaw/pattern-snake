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

export const SIZE = 5

const Grid = props => {

    return (
        <GridContainer />
    )
}

const GridContainer = styled.View`
    position: absolute;
    left: 0px;
    top: 0px;
    flex: 1;
    background: linear-gradient(0deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px), linear-gradient(#eee .05em, transparent .05em);
`

export default Grid