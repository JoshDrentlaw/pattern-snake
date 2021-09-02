import React, {useState} from 'react'
import {StatusBar, StyleSheet, Text, Button, useColorScheme, View, Dimensions} from 'react-native'

import {Colors} from 'react-native/Libraries/NewAppScreen'

import styled from 'styled-components/native'

// GAME ENGINE
import {GameEngine} from 'react-native-game-engine'
// ENTITIES
import Head, {SIZE as headSize} from '../entities/Head'
import Tail, {SIZE as tailSize, tailSpacer} from '../entities/Tail'
import PatternDisplay from '../entities/PatternDisplay'
// SYSTEMS
import GameLoop from '../systems/GameLoop'
import {useRef} from 'react'

const BlackBackdrop = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    padding-horizontal: 20px;
    flex: 1;
    justify-content: center;
`

const Score = styled.Text`
    color: #eee;
    font-size: 45px;
    text-align: center;
    margin-bottom: 15px;
`

const GameOver = ({engine, entities, setRunning, score}) => {
    return (
        <BlackBackdrop>
            <View>
                <Score>Score: {score}</Score>
            </View>
            <View>
                <Button
                    title="Restart"
                    onPress={() => {
                        engine.current.swap(entities)
                        engine.current.start()
                        setRunning(true)
                    }}
                />
            </View>
        </BlackBackdrop>
    )
}

const GameInfoArea = styled.View`
    height: 50px;
    background-color: black;
`

const Game = props => {
    const isDarkMode = useColorScheme() === 'dark',
        backgroundStyle = {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
        windowWidth = Dimensions.get('window').width,
        windowHeight = Dimensions.get('window').height,
        widthCenter = windowWidth / 2,
        heightCenter = windowHeight / 2,
        velocity = headSize,
        update = 3,
        entities = {
            patternDisplay: {
                position: [widthCenter, 0],
                pattern: [],
                eaten: [],
                score: 0,
                renderer: <PatternDisplay />,
            },
            head: {
                position: [widthCenter, heightCenter],
                velocity: velocity,
                direction: 'right',
                updateFreq: update,
                update: update,
                pelletDropFreq: update,
                pelletDrop: update,
                renderer: <Head />,
            },
            tail0: {
                name: 'tail',
                position: [headSize + tailSpacer - widthCenter, heightCenter],
                color: '#666',
                renderer: <Tail />,
            },
            tail1: {
                name: 'tail',
                position: [(headSize + tailSpacer) * 3 - widthCenter, heightCenter],
                color: '#666',
                renderer: <Tail />,
            },
            tail2: {
                name: 'tail',
                position: [(headSize + tailSpacer) * 5 - widthCenter, heightCenter],
                color: '#666',
                direction: 'right',
                renderer: <Tail />,
            },
        }

    const [score, setScore] = useState(3)
    const [running, setRunning] = useState(true)
    const engine = useRef(null)

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={{flex: 1}}>
                <GameInfoArea />
                <GameEngine
                    ref={engine}
                    running={running}
                    systems={[GameLoop]}
                    entities={entities}
                    onEvent={e => {
                        if (e.msg === 'game-over') {
                            setScore(e.score)
                            setRunning(false)
                        }
                    }}
                />
                {running ? null : (
                    <GameOver engine={engine} entities={entities} setRunning={setRunning} score={score} />
                )}
            </View>
        </>
    )
}

export default Game
