import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'
import { DeviceMotion } from 'expo-sensors'
import Slider from '@react-native-community/slider'

export default function App() {
    const [hasPermission, setHasPermission] = useState(null)
    const type = Camera.Constants.Type.back

    useEffect(() => {
        ;(async () => {
            const { status } = await Camera.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    const [beta, setBeta] = useState(0)
    const [showInfo, setShowInfo] = useState(false)
    const [height, setHeight] = useState(4.5)

    const _subscribe = () => {
        DeviceMotion.addListener(deviceMotionData => {
            if (deviceMotionData && deviceMotionData.rotation) {
                setBeta(deviceMotionData.rotation.beta)
            } else {
                setBeta(0)
            }
        })
        DeviceMotion.setUpdateInterval(2000)
    }

    const _unsubscribe = () => {
        DeviceMotion.removeAllListeners()
    }

    useEffect(() => {
        _subscribe()
        return () => _unsubscribe()
    }, [])

    if (hasPermission === null) {
        return <View />
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} autoFocus={Camera.Constants.AutoFocus}>
                <Image style={styles.focus} source={require('../assets/images/focus.png')} />

                {estimatedDistance(height, beta) < 6 ? (
                    <Text style={styles.danger}>Stay calm & step back</Text>
                ) : (
                    <Text style={styles.safe}>You're safe</Text>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setShowInfo(!showInfo)
                    }}
                >
                    <Text>Toggle info</Text>
                </TouchableOpacity>

                {showInfo ? (
                    <View style={styles.footer}>
                        <Text style={styles.text}>distance|h*tan(deg): {estimatedDistance(height, beta)} ft</Text>
                        <Text style={styles.text}>h: {height} ft</Text>
                        <Text style={styles.text}>deg: {degree(beta)}</Text>
                    </View>
                ) : (
                    <View />
                )}

                <View style={styles.slider}>
                    <Text style={{ ...styles.text, alignSelf: 'center' }}>Camera height: {height}</Text>
                    <Slider
                        minimumValue={3}
                        maximumValue={6}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        value={height}
                        onValueChange={camHeight => {
                            setHeight(Math.floor(camHeight * 10) / 10)
                        }}
                    />
                </View>
            </Camera>
        </View>
    )
}

function round(n) {
    if (!n) {
        return 0
    }
    return Math.floor(n * 100) / 100
}

function degree(radian) {
    return round((radian * 180) / Math.PI)
}

function estimatedDistance(height, radian) {
    return round(height * Math.tan(radian))
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    focus: {
        tintColor: 'white'
    },
    button: {
        position: 'absolute',
        bottom: 2,
        left: 4,
        backgroundColor: '#eee',
        padding: 5,
        borderRadius: 10
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 4
    },
    text: {
        fontSize: 18,
        color: 'white'
    },
    slider: {
        position: 'absolute',
        bottom: 2,
        right: 10,
        width: 200,
        height: 45
    },
    danger: {
        fontSize: 40,
        color: 'red'
    },
    safe: {
        fontSize: 40,
        color: 'green'
    }
})
