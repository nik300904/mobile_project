import { Tabs } from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';



export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="lab4"
                options={{
                    title: 'Лабораторная работа 4',
                }}
            />
        </Tabs>
    );
}