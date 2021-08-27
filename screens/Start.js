import React from 'react'
import {
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button
} from 'react-native'

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen'

const Start = props => {
    const isDarkMode = useColorScheme() === 'dark'

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Text style={{fontSize: 90, textAlign: 'center', marginBottom: 5}}>Pattern Snake</Text>
                    <Button title="Start" onPress={() => props.navigation.navigate('Game')} />
                </View>
            </View>
        </>
    )
}

export default Start