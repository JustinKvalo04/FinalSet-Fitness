import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { HapticButton } from '../../components/HapticButton';
import { getSupabaseClient } from '../../lib/supabase';

export default function DashboardLayout() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const initRevenueCat = async () => {
            try {
                const Purchases = require('react-native-purchases').default;
                if (Platform.OS === 'ios') {
                    // Lazy configure to prevent launch crashes
                    Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'appl_dummy_key' });
                }
            } catch (err) {
                console.warn('RevenueCat init error:', err);
            }
        };
        initRevenueCat();

        // Auth guard to prevent unauthenticated access to the dashboard
        const checkAuth = async () => {
            const { data: { session } } = await getSupabaseClient().auth.getSession();
            if (!session || !session.user || !session.user.id) {
                router.replace('/');
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();

        const { data: { subscription } } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session || !session.user || !session.user.id) {
                router.replace('/');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (isCheckingAuth) {
        return <View style={{ flex: 1, backgroundColor: '#09090b' }} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
            <Tabs
                screenListeners={({ navigation }) => ({
                    tabPress: (e) => {
                        const state = navigation.getState();
                        if (state) {
                            const currentRoute = state.routes[state.index];
                            if (e.target && e.target !== currentRoute.key) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                        }
                    }
                })}
                screenOptions={{
                    tabBarActiveTintColor: '#ffffff',
                    tabBarInactiveTintColor: '#52525b',
                    tabBarStyle: {
                        backgroundColor: '#09090b', // zinc-950
                        borderTopWidth: 1,
                        borderTopColor: '#27272a', // zinc-800
                        paddingBottom: Math.max(insets.bottom, 8),
                        paddingTop: 8,
                        height: 60 + insets.bottom,
                    },
                    headerShown: false // Remove global tab header so screens can manage their own headers/scrolling
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="workouts"
                    options={{
                        title: 'Workouts',
                        tabBarIcon: ({ color }) => <FontAwesome5 name="dumbbell" size={20} color={color} />,
                    }}
                />

                <Tabs.Screen
                    name="action"
                    options={{
                        title: '',
                        tabBarButton: () => (
                            <HapticButton
                                hapticType="medium"
                                onPress={() => setActionMenuVisible(true)}
                                className="top-1 justify-center items-center"
                            >
                                <View className="w-14 h-14 rounded-full bg-primary items-center justify-center border-4 border-[#09090b] shadow-lg shadow-primary/30">
                                    <FontAwesome5 name="plus" size={20} color="#fff" />
                                </View>
                            </HapticButton>
                        )
                    }}
                />

                <Tabs.Screen
                    name="macros"
                    options={{
                        title: 'Macros',
                        tabBarIcon: ({ color }) => <FontAwesome5 name="calculator" size={20} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="more"
                    options={{
                        title: 'More',
                        tabBarIcon: ({ color }) => <FontAwesome5 name="bars" size={20} color={color} />,
                    }}
                />

                {/* Hide extraneous screens from the tab bar */}
                <Tabs.Screen name="settings" options={{ href: null }} />
                <Tabs.Screen name="weight" options={{ href: null }} />
                <Tabs.Screen name="paywall" options={{ href: null, headerShown: false }} />
                <Tabs.Screen name="profile" options={{ href: null }} />
                <Tabs.Screen name="goals" options={{ href: null }} />
                <Tabs.Screen name="daily-macros" options={{ href: null }} />
                <Tabs.Screen name="log-meal" options={{ href: null }} />
                <Tabs.Screen name="schedule" options={{ href: null }} />
                <Tabs.Screen name="edit-workout" options={{ href: null }} />
                <Tabs.Screen name="progress" options={{ href: null }} />
            </Tabs>

            {/* Quick Action Modal */}
            <Modal
                transparent={true}
                visible={actionMenuVisible}
                animationType="fade"
                onRequestClose={() => setActionMenuVisible(false)}
            >
                <Pressable
                    onPress={() => setActionMenuVisible(false)}
                    className="flex-1 bg-black/60 justify-end"
                >
                    <Pressable className="bg-zinc-900 rounded-t-3xl pt-6 pb-12 px-6">
                        <View className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />

                        <Text className="text-white text-xl font-bold mb-6 text-center">Quick Log</Text>

                        <HapticButton
                            hapticType="light"
                            onPress={() => {
                                setActionMenuVisible(false);
                                router.push('/(dashboard)/workouts');
                            }}
                            className="bg-zinc-800 p-4 rounded-2xl flex-row items-center mb-3"
                        >
                            <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mr-4">
                                <FontAwesome5 name="play" size={18} color="#0ea5e9" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">Start Workout</Text>
                                <Text className="text-zinc-400 text-sm">Begin a new strength session</Text>
                            </View>
                        </HapticButton>

                        <HapticButton
                            hapticType="light"
                            onPress={() => {
                                setActionMenuVisible(false);
                                router.push('/(dashboard)/weight');
                            }}
                            className="bg-zinc-800 p-4 rounded-2xl flex-row items-center mb-3"
                        >
                            <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mr-4">
                                <FontAwesome5 name="balance-scale" size={18} color="#0ea5e9" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">Log Weight</Text>
                                <Text className="text-zinc-400 text-sm">Record your current body weight</Text>
                            </View>
                        </HapticButton>

                        <HapticButton
                            hapticType="light"
                            onPress={() => {
                                setActionMenuVisible(false);
                                router.push('/(dashboard)/log-meal');
                            }}
                            className="bg-zinc-800 p-4 rounded-2xl flex-row items-center"
                        >
                            <View className="w-12 h-12 bg-orange-500/20 rounded-full items-center justify-center mr-4">
                                <FontAwesome5 name="utensils" size={18} color="#f97316" />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-white font-bold text-lg">Log Meal</Text>
                                </View>
                                <Text className="text-zinc-400 text-sm">Track your macros for the day</Text>
                            </View>
                        </HapticButton>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
