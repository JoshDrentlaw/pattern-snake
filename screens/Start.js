import React from 'react'
import {StatusBar, StyleSheet, Text, useColorScheme, View, Button, Image, Dimensions} from 'react-native'

import {Colors} from 'react-native/Libraries/NewAppScreen'

const Start = props => {
    const isDarkMode = useColorScheme() === 'dark'

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View>
                    <Image
                        source={require('./logo.jpeg')}
                        style={{
                            resizeMode: 'center',
                            width: Dimensions.get('window').width - 20,
                            height: 200,
                            marginBottom: 10,
                        }}
                    />
                </View>
                <View style={{width: Dimensions.get('window').width - 20}}>
                    <Button title="Start" onPress={() => props.navigation.navigate('Game')} />
                </View>
            </View>
        </>
    )
}

export default Start
