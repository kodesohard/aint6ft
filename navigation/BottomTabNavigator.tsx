import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CameraScreen from '../screens/CameraScreen'
import HeartRateScreen from '../screens/HeartRateScreen'
import { BottomTabParamList, CameraParamList, HeartRateParamList } from '../types'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme()

    return (
        <BottomTab.Navigator initialRouteName="Camera" tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
            <BottomTab.Screen
                name="Camera"
                component={CameraNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />
                }}
            />
            <BottomTab.Screen
                name="HeartRate"
                component={HeartRateNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />
                }}
            />
        </BottomTab.Navigator>
    )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const CameraStack = createStackNavigator<CameraParamList>()

function CameraNavigator() {
    return (
        <CameraStack.Navigator>
            <CameraStack.Screen name="CameraScreen" component={CameraScreen} options={{ headerTitle: 'Camera' }} />
        </CameraStack.Navigator>
    )
}

const HeartRateStack = createStackNavigator<HeartRateParamList>()

function HeartRateNavigator() {
    return (
        <HeartRateStack.Navigator>
            <HeartRateStack.Screen
                name="HeartRateScreen"
                component={HeartRateScreen}
                options={{ headerTitle: 'Heart Rate' }}
            />
        </HeartRateStack.Navigator>
    )
}
