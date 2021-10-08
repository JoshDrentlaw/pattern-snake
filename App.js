/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react'
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native'

import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import auth from '@react-native-firebase/auth'

// SCREENS
import Start from './screens/Start'
import Game from './screens/Game'

const Stack = createNativeStackNavigator()

const App = () => {
    /* if (initializing) {
        return null
    } */

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Pattern Snake" component={Start} />
                <Stack.Screen name="Game" component={Game} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App
