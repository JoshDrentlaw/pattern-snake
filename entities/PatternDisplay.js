import React from 'react'
import {StatusBar, StyleSheet, Text, useColorScheme, View, Dimensions} from 'react-native'

import styled from 'styled-components/native'

export const SIZE = 50

const PatternDisplay = ({pattern, score}) => {
    return (
        <DisplayContainer>
            <PatternView>
                {pattern.length > 0 ? (
                    <>
                        <SequenceItemView color={pattern[0]} />
                        <SequenceItemView color={pattern[1]} />
                        <SequenceItemView color={pattern[2]} />
                        <SequenceItemView color={pattern[3]} />
                    </>
                ) : null}
            </PatternView>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 30, color: 'white'}}>Score: {score}</Text>
            </View>
        </DisplayContainer>
    )
}

const DisplayContainer = styled.View`
    position: absolute;
    left: 0px;
    top: -50px;
    flex-direction: row;
    height: 50px;
    width: 100%;
`

const PatternView = styled.View`
    flex: 1;
    flex-direction: row;
    margin-top: 4px;
    margin-left: 2px;
`

const SequenceItemView = styled.View`
    background-color: ${props => props.color};
    width: 40px;
    height: 40px;
    margin-right: 5px;
    border-radius: 3px;
    border: 2px solid #ccc;
`

export default PatternDisplay
