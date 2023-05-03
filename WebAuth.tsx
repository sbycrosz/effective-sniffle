import React from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'

import {
    useAuth0,
    Auth0Provider,
    LocalAuthenticationStrategy,
} from 'react-native-auth0'
import config from './auth0-configuration'

const Home = () => {
    const {
        authorize,
        clearSession,
        user,
        getCredentials,
        requireLocalAuthentication,
    } = useAuth0()
    console.log('user', user)

    const onLogin = async () => {
        try {
            await requireLocalAuthentication(
                'Unlock with biometric',
                'Unlock your screen with PIN, pattern, or biometric to start accessing your data',
                'Cancel',
                'Use PIN',
                LocalAuthenticationStrategy.deviceOwner
            )
            await authorize(
                { scope: 'openid profile email offline_access' },
                { customScheme: 'auth0.com.auth0samples' }
            )
            // let credentials = await getCredentials(
            //     'openid profile email offline_access'
            // )
            // console.log('credentials', credentials)
            // Alert.alert('AccessToken: ' + credentials.accessToken)
        } catch (e) {
            console.log(e)
        }
    }

    const onGetCredentials = async () => {
        try {
            await requireLocalAuthentication(
                'Unlock with biometric',
                'Unlock your screen with PIN, pattern, or biometric to start accessing your data',
                'Cancel',
                'Use PIN',
                LocalAuthenticationStrategy.deviceOwnerWithBiometrics
            )
            let credentials = await getCredentials(
                'openid profile email offline_access'
            )
            console.log('credentials', credentials)
            Alert.alert('AccessToken: ' + credentials.accessToken)
        } catch (error) {
            console.log(error)
        }
    }

    const loggedIn = user !== undefined && user !== null

    const onLogout = async () => {
        try {
            await clearSession({ customScheme: 'auth0.com.auth0samples' })
        } catch (e) {
            console.log('Log out cancelled')
        }
    }

    return (
        <View style={styles.container}>
            {user && (
                <View>
                    <Text style={{ marginBottom: 20 }}>
                        You are logged in as {user.name}
                    </Text>

                    <Button
                        onPress={onGetCredentials}
                        title={'Get Credentials'}
                    />
                    <View style={{ marginBottom: 20 }} />

                    <Button onPress={onLogout} title={'Log out'} />
                </View>
            )}

            {!user && (
                <View>
                    <Text style={{ marginBottom: 20 }}>Welcome!</Text>
                    <Button onPress={onLogin} title={'Log in'} />
                </View>
            )}
        </View>
    )
}

const App = () => {
    return (
        <Auth0Provider domain={config.domain} clientId={config.clientId}>
            <Home />
        </Auth0Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
})

export default App
