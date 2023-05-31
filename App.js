import { useState, useMemo, useEffect } from 'react'
import Auth0 from 'react-native-auth0'
import config from './auth0-configuration'
import { View, TextInput, Text, Button, Clipboard } from 'react-native'

const App = () => {
    const auth0 = useMemo(() => {
        return new Auth0({
            domain: config.domain,
            clientId: config.clientId,
        })
    }, [])

    const [showLogin, setShowLogin] = useState(true)
    useEffect(() => {
        ;(async () => {
            const hasValidCredentials =
                await auth0.credentialsManager.hasValidCredentials()

            setShowLogin(!hasValidCredentials)
        })()
    }, [])

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            {showLogin && (
                <>
                    <View
                        style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: 'black',
                            padding: 10,
                            width: 300,
                            margin: 10,
                        }}
                    >
                        <Text>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={{ flex: 1, marginLeft: 20 }}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                        />
                    </View>
                    <Button
                        onPress={async () => {
                            try {
                                const result =
                                    await auth0.auth.passwordlessWithEmail({
                                        email,
                                        send: 'code',
                                        authParams: {
                                            scope: 'openid profile email offline_access',
                                        },
                                    })
                                console.log(result)
                            } catch (error) {
                                console.error(error)
                            }
                        }}
                        title={'Send code'}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: 'black',
                            padding: 10,
                            width: 300,
                            margin: 10,
                        }}
                    >
                        <Text>Otp</Text>
                        <TextInput
                            value={otp}
                            onChangeText={setOtp}
                            style={{ flex: 1, marginLeft: 20 }}
                            autoCapitalize="none"
                            autoCompleteType="off"
                            autoCorrect={false}
                        />
                    </View>
                    <Button
                        onPress={async () => {
                            try {
                                const credential =
                                    await auth0.auth.loginWithEmail({
                                        email,
                                        code: otp,
                                        scope: 'openid profile email offline_access',
                                    })

                                await auth0.credentialsManager.saveCredentials(
                                    credential
                                )
                                setShowLogin(false)
                                setEmail('')
                                setOtp('')
                                Clipboard.setString(JSON.stringify(credential))
                                alert(JSON.stringify(credential))
                            } catch (error) {
                                console.error(error)
                            }
                        }}
                        title={'Login with Passwordless'}
                    />
                </>
            )}

            {!showLogin && (
                <View>
                    <View style={{ marginTop: 40 }}>
                        <Button
                            onPress={async () => {
                                await auth0.credentialsManager.requireLocalAuthentication()
                                const credential =
                                    await auth0.credentialsManager.getCredentials()
                                Clipboard.setString(JSON.stringify(credential))
                                alert(JSON.stringify(credential))
                            }}
                            title={'Get stored credentials'}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Button
                            onPress={async () => {
                                await auth0.credentialsManager.clearCredentials()
                                setShowLogin(true)
                            }}
                            title={'Log out'}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

export default App
