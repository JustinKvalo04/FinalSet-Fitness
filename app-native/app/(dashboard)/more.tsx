import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { HapticButton } from '../../components/HapticButton';
import { WEB_BASE_URL } from '../../lib/config';

export default function MoreScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        await supabase.auth.signOut();
                        router.replace('/(auth)');
                    }
                }
            ]
        );
    };

    const openWebLink = (url: string) => {
        Linking.openURL(url);
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
        <ScrollView className="flex-1 bg-zinc-950 pt-6" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}>

            <View className="px-6 mb-4">
                <Text className="text-3xl font-bold text-white mb-1">More</Text>
                <Text className="text-zinc-400">Manage your subscription, settings, and account.</Text>
            </View>

            <View className="bg-zinc-900 border-y border-zinc-800 mb-8 mt-4">
                <LinkItem icon="crown" text="Manage Premium" onPress={() => router.push('/(dashboard)/paywall')} />
                <LinkItem icon="user" text="Edit Profile" onPress={() => router.push('/(dashboard)/profile')} />
                <LinkItem icon="bullseye" text="Goals" onPress={() => router.push('/(dashboard)/goals')} />
                <LinkItem icon="cog" text="Settings" onPress={() => router.push('/(dashboard)/settings')} />
            </View>

            <View className="px-6 mb-2">
                <Text className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Support & Legal</Text>
            </View>

            <View className="bg-zinc-900 border-y border-zinc-800 mb-8">
                <LinkItem icon="envelope" text="Contact Support" onPress={() => openWebLink('mailto:finalset.help@gmail.com')} />
                <LinkItem icon="shield-alt" text="Privacy Policy" onPress={() => openWebLink(`${WEB_BASE_URL}/privacy`)} />
                <LinkItem icon="file-contract" text="Terms of Service" onPress={() => openWebLink(`${WEB_BASE_URL}/terms`)} />
            </View>

            <View className="bg-zinc-900 border-y border-zinc-800">
                <LinkItem icon="sign-out-alt" text="Log Out" onPress={handleLogout} danger />
            </View>

            <View className="items-center mt-12 mb-6">
                <Text className="text-zinc-600 font-medium">FinalSet Fitness v1.0.0</Text>
            </View>

        </ScrollView>
    );
}
