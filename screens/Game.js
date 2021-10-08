import React, {useState, useEffect} from 'react'
import {StatusBar, StyleSheet, Text, Button, useColorScheme, View, Dimensions} from 'react-native'

// import auth from '@react-native-firebase/auth'
import {TestIds, BannerAd, BannerAdSize} from '@react-native-firebase/admob'

import {Colors} from 'react-native/Libraries/NewAppScreen'

import styled from 'styled-components/native'

// GAME ENGINE
import {GameEngine, GameLoop} from 'react-native-game-engine'
// ENTITIES
import Head, {SIZE as headSize} from '../entities/Head'
import Tail, {SIZE as tailSize, tailSpacer} from '../entities/Tail'
import PatternDisplay from '../entities/PatternDisplay'
// SYSTEMS
import GameLoopSystem from '../systems/GameLoopSystem'
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

const LargeText = styled.Text`
    color: #eee;
    font-size: 45px;
    text-align: center;
    margin-bottom: 15px;
`

const MediumText = styled.Text`
    color: #eee;
    font-size: 30px;
    text-align: center;
    margin-bottom: 15px;
`

const GameOver = ({engine, entities, setRunning, setGameOver, score, loseReason}) => {
    return (
        <BlackBackdrop>
            <View>
                <LargeText>Score: {score}</LargeText>
            </View>
            <View>
                <MediumText>{loseReason}</MediumText>
            </View>
            <View>
                <Button
                    title="Restart"
                    onPress={() => {
                        engine.current.swap(entities)
                        engine.current.start()
                        setRunning(true)
                        setGameOver(false)
                    }}
                />
            </View>
        </BlackBackdrop>
    )
}

const GameLoopTimer = styled(GameLoop)`
    justify-content: center;
`

const Pause = ({setRunning, setPaused}) => {
    const [timerView, setTimerView] = useState(false)
    const [counter, setCounter] = useState(3)
    let ticker = 60

    const updateCounter = () => {
        ticker--
        if (ticker === 0) {
            if (counter === 1) {
                setCounter(3)
                setRunning(true)
                setPaused(false)
            } else {
                setCounter(counter - 1)
                ticker = 60
            }
        }
    }

    return (
        <BlackBackdrop>
            {timerView ? (
                <GameLoopTimer onUpdate={updateCounter}>
                    <View>
                        <LargeText>{counter}</LargeText>
                    </View>
                </GameLoopTimer>
            ) : (
                <>
                    <View>
                        <LargeText>Paused</LargeText>
                    </View>
                    <View>
                        <Button
                            title="Start"
                            onPress={() => {
                                setTimerView(true)
                            }}
                        />
                    </View>
                </>
            )}
        </BlackBackdrop>
    )
}

const GameInfoArea = styled.View`
    height: 50px;
    background-color: black;
`

const GameEngineArea = styled(GameEngine)`
    border: 1px solid #333;
`

const PatternSceen = () => {
    return (
        <View>
            <Text>New Pattern</Text>
        </View>
    )
}

const Game = props => {
    const isDarkMode = useColorScheme() === 'dark',
        backgroundStyle = {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
        windowWidth = Dimensions.get('window').width,
        windowHeight = Dimensions.get('window').height - 50,
        widthCenter = windowWidth / 2,
        heightCenter = windowHeight / 2,
        velocity = 1,
        update = 15,
        startX = 15,
        startY = 20,
        entities = {
            patternDisplay: {
                position: [widthCenter, 0],
                pattern: [],
                eaten: [],
                score: 0,
                renderer: <PatternDisplay />,
            },
            head: {
                position: [startX, startY],
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
                position: [startX - 1, startY],
                color: '#0f8018',
                renderer: <Tail />,
            },
            tail1: {
                name: 'tail',
                position: [startX - 2, startY],
                color: '#0f8018',
                renderer: <Tail />,
            },
            tail2: {
                name: 'tail',
                position: [startX - 3, startY],
                color: '#0f8018',
                direction: 'right',
                renderer: <Tail />,
            },
        }

    const [patternSceen, setPatternSceen] = useState(false)
    const [score, setScore] = useState(3)
    const [loseReason, setLoseReason] = useState('')
    const [running, setRunning] = useState(true)
    const [gameOver, setGameOver] = useState(false)
    const [paused, setPaused] = useState(false)
    const engine = useRef(null)

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={{flex: 1}}>
                <BannerAd
                    unitId={TestIds.BANNER}
                    size={BannerAdSize.SMART_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                        tagForChildDirectedTreatment: true,
                        tagForUnderAgeOfConsent: true,
                    }}
                    onAdLoad={() => {
                        console.log('ad loaded')
                    }}
                    onAdFailedToLoad={error => {
                        console.error('ad failed: ', error)
                    }}
                />
                <GameInfoArea />
                <GameEngineArea
                    ref={engine}
                    running={running}
                    systems={[GameLoopSystem]}
                    entities={entities}
                    onEvent={e => {
                        if (e.type === 'game-over') {
                            setScore(e.score)
                            setLoseReason(e.reason)
                            setRunning(false)
                            setGameOver(true)
                        } else if (e.type === 'pause') {
                            setRunning(false)
                            setPaused(true)
                        }
                    }}
                />
                {patternSceen ? <PatternSceen /> : null}
                {paused ? <Pause setRunning={setRunning} setPaused={setPaused} /> : null}
                {gameOver ? (
                    <GameOver
                        engine={engine}
                        entities={entities}
                        setRunning={setRunning}
                        setGameOver={setGameOver}
                        score={score}
                        loseReason={loseReason}
                    />
                ) : null}
            </View>
        </>
    )
}

export default Game
