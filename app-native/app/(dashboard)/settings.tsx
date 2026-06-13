import React, { useState } from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { getSupabaseClient } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { WEB_BASE_URL } from '../../lib/config';
import { HapticButton } from '../../components/HapticButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
    const router = useRouter();

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        // Attempt to call RPC, fallback to sign out if not implemented on backend
                        try {
                            const supabase = getSupabaseClient();
                            const { error } = await supabase.rpc('delete_user');
                            if (error) {
                                console.warn("Failed to delete user via RPC:", error.message);
                            }
                        } catch (err) {}
                        
                        const supabase = getSupabaseClient();
                        await supabase.auth.signOut();
                        try {
                            const keys = await AsyncStorage.getAllKeys();
                            const sbKeys = keys.filter(k => k.startsWith('supabase') || k.startsWith('sb-') || k.includes('auth-token') || k.includes('session'));
                            if (sbKeys.length > 0) {
                                await AsyncStorage.multiRemove(sbKeys);
                            }
                            const Purchases = require('react-native-purchases').default;
                            await Purchases.logOut();
                        } catch (e) {}
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const openLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    return (
        <View className="flex-1">
        <ScrollView className="flex-1 bg-zinc-950 px-6 pt-6">
            <View className="mb-8">
                <Text className="text-3xl font-bold text-white mb-1">Settings</Text>
                <Text className="text-zinc-400">Manage your account and app preferences.</Text>
            </View>

            <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
                <HapticButton
                    hapticType="light"
                    onPress={() => openLink('mailto:finalset.help@gmail.com')}
                    className="flex-row items-center justify-between p-6 border-b border-zinc-800"
                >
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-4">
                            <FontAwesome5 name="envelope" size={14} color="#0ea5e9" />
                        </View>
                        <Text className="text-white font-medium text-lg">Support</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={14} color="#52525b" />
                </HapticButton>

                <HapticButton
                    hapticType="light"
                    onPress={() => openLink(`${WEB_BASE_URL}/privacy`)}
                    className="flex-row items-center justify-between p-6 border-b border-zinc-800"
                >
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-4">
                            <FontAwesome5 name="shield-alt" size={14} color="#0ea5e9" />
                        </View>
                        <Text className="text-white font-medium text-lg">Privacy Policy</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={14} color="#52525b" />
                </HapticButton>

                <HapticButton
                    hapticType="light"
                    onPress={() => openLink(`${WEB_BASE_URL}/terms`)}
                    className="flex-row items-center justify-between p-6"
                >
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center mr-4">
                            <FontAwesome5 name="file-alt" size={14} color="#0ea5e9" />
                        </View>
                        <Text className="text-white font-medium text-lg">Terms of Service</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={14} color="#52525b" />
                </HapticButton>
            </View>

            <View className="bg-zinc-900 border border-red-900/30 rounded-3xl overflow-hidden mb-12">
                <HapticButton
                    hapticType="light"
                    onPress={handleDeleteAccount}
                    className="flex-row items-center justify-between p-6"
                >
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-red-900/20 items-center justify-center mr-4">
                            <FontAwesome5 name="user-times" size={14} color="#ef4444" />
                        </View>
                        <Text className="text-red-500 font-medium text-lg">Delete Account</Text>
                    </View>
                </HapticButton>
            </View>
        </ScrollView>

        </View>
    );
}
