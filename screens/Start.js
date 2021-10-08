import React, {useState, useEffect} from 'react'
import {
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    Image,
    Dimensions,
    TouchableHighlight,
} from 'react-native'

import auth from '@react-native-firebase/auth'
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin'

import {GOOGLE_OAUTH_CLIENT_ID} from '@env'

import {Colors} from 'react-native/Libraries/NewAppScreen'

import styled from 'styled-components/native'

console.log(GOOGLE_OAUTH_CLIENT_ID)

GoogleSignin.configure({
    offlineAccess: true,
    webClientId: '237326521941-dlbp1emlmhs2s55g4k8hd7fl11ggtnv2.apps.googleusercontent.com',
    scopes: ['email', 'profile'],
})

async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices()
    console.log('has play services')

    // Get the users ID token
    const {accessToken, idToken} = await GoogleSignin.signIn()
    console.log({accessToken, idToken})

    // Create a Google credential with then token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken /* , accessToken */)
    console.log({googleCredential})

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential)
}

const LoginButtons = props => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <GoogleSigninButton
                title="Google Sign-In"
                size={GoogleSigninButton.Size.Wide}
                style={{height: 80}}
                onPress={() =>
                    onGoogleButtonPress()
                        .then(() => console.log('Signed in with Google'))
                        .catch(error => {
                            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                                // user cancelled the login flow
                                console.log('Cancel')
                            } else if (error.code === statusCodes.IN_PROGRESS) {
                                console.log('Signin in progress')
                                // operation (f.e. sign in) is in progress already
                            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                                console.log('PLAY_SERVICES_NOT_AVAILABLE')
                                // play services not available or outdated
                            } else {
                                // some other error happened
                                console.error(error, 'code:', error.code)
                            }
                        })
                }
            />
        </View>
    )
}

const SignOut = ({setUser}) => {
    const signOut = async () => {
        try {
            console.log('signing out')
            await GoogleSignin.signOut()
            await auth().signOut()
            console.log('signed out')
            setUser(null)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <TouchableHighlight onPress={signOut}>
            <SignOutButtonView>
                <StartButtonText>Sign Out</StartButtonText>
            </SignOutButtonView>
        </TouchableHighlight>
    )
}

const StartButtonView = styled.View`
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 2px;
    background-color: dodgerblue;
    align-items: center;
`

const SignOutButtonView = styled(StartButtonView)`
    background-color: red;
`

const StartButtonText = styled.Text`
    color: white;
    font-size: 18px;
`

const Start = ({navigation}) => {
    const isDarkMode = useColorScheme() === 'dark'
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }
    const [user, setUser] = useState(null)

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(authUser => {
            setUser(authUser)
        })
        return subscriber
    })

    useEffect(() => {
        console.log('user updated:', user)
    }, [user])

    console.log({user})

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
                <View
                    style={{width: Dimensions.get('window').width - 20, height: 150, justifyContent: 'space-between'}}>
                    <TouchableHighlight onPress={() => navigation.navigate('Game')}>
                        <StartButtonView>
                            <StartButtonText>Start</StartButtonText>
                        </StartButtonView>
                    </TouchableHighlight>
                    {user ? <SignOut setUser={setUser} /> : <LoginButtons />}
                </View>
            </View>
        </>
    )
}

export default Start
