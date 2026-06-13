import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getSupabaseClient } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { HapticButton } from '../../components/HapticButton';
import { WEB_BASE_URL } from '../../lib/config';

export default function MoreScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete My Account",
                    style: "destructive",
                    onPress: async () => {
                        const supabase = getSupabaseClient();
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                            // Call RPC to delete user completely
                            await supabase.rpc('delete_user_account', { user_id_param: user.id });
                            await supabase.auth.signOut();
                            try {
                                const keys = await AsyncStorage.getAllKeys();
                                const sbKeys = keys.filter(k => k.startsWith('supabase') || k.startsWith('sb-') || k.includes('auth-token') || k.includes('session'));
                                if (sbKeys.length > 0) {
                                    await AsyncStorage.multiRemove(sbKeys);
                                }
                                const Purchases = require('react-native-purchases').default;
                                await Purchases.logOut();
                            } catch (e) {
                                console.warn("RC Logout Warning", e);
                            }
                            router.dismissAll();
                            router.replace('/');
                        }
                    }
                }
            ]
        );
    };

    const openWebLink = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Error", "Could not open the link.");
            }
        } catch (err: any) {
            Alert.alert("Error", err?.message || "An unexpected error occurred while trying to open the link.");
        }
    };

    const LinkItem = ({ icon, text, onPress, danger = false }: { icon: string, text: string, onPress: () => void, danger?: boolean }) => (
        <HapticButton
            hapticType="light"
            onPress={onPress}
            className={`flex-row items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800`}
        >
            <View className="flex-row items-center">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${danger ? 'bg-red-500/10' : 'bg-zinc-800'}`}>
                    <FontAwesome5 name={icon} size={14} color={danger ? '#ef4444' : '#a1a1aa'} />
                </View>
                <Text className={`font-medium text-lg ${danger ? 'text-red-500' : 'text-white'}`}>{text}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={12} color="#52525b" />
        </HapticButton>
    );

    return (
        <View className="flex-1">
        <ScrollView className="flex-1 bg-zinc-950 pt-6" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}>

            <View className="px-6 mb-4">
                <Text className="text-3xl font-bold text-white mb-1">More</Text>
                <Text className="text-zinc-400">Settings and Support.</Text>
            </View>

            <View className="px-6 mb-2 mt-4">
                <Text className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Account & Activity</Text>
            </View>

            <View className="bg-zinc-900 border-y border-zinc-800 mb-8">
                <LinkItem icon="user" text="Profile & Settings" onPress={() => router.push('/(dashboard)/profile')} />
                <LinkItem icon="weight" text="Weight Log" onPress={() => router.push('/(dashboard)/weight')} />
                <LinkItem icon="star" text="Upgrade to Premium" onPress={() => router.push('/(dashboard)/paywall')} />
            </View>

            <View className="px-6 mb-2">
                <Text className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Support & Legal</Text>
            </View>

            <View className="bg-zinc-900 border-y border-zinc-800 mb-8">
                <LinkItem icon="envelope" text="Contact Support" onPress={() => openWebLink('mailto:finalset.help@gmail.com')} />
                <LinkItem icon="shield-alt" text="Privacy Policy" onPress={() => openWebLink('https://finalset-fit.app/privacy')} />
                <LinkItem icon="file-contract" text="Terms of Service" onPress={() => openWebLink('https://finalset-fit.app/terms')} />
            </View>

            <View className="px-6 mb-2">
                <Text className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Danger Zone</Text>
            </View>

            <View className="bg-zinc-900 border-y border-zinc-800">
                <LinkItem icon="trash-alt" text="Delete Account" onPress={handleDeleteAccount} danger />
            </View>

            <View className="items-center mt-12 mb-6">
                <Text className="text-zinc-600 font-medium">FinalSet Fitness v1.0.0</Text>
            </View>

        </ScrollView>
        </View>
    );
}
