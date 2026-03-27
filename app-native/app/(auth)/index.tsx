import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
        } else {
            router.replace('/(dashboard)'); // We'll build this route next
        }
    }

    return (
        <View className="flex-1 justify-center px-8 bg-zinc-950" >
            <View className="mb-12" >
                <Text className="text-4xl font-bold text-white mb-2" > Welcome back </Text>
                < Text className="text-zinc-400" > Log in to your Macro app.</Text>
            </View>

            < View className="space-y-4" >
                <View>
                    <Text className="text-zinc-400 font-medium mb-2 ml-1" > Email </Text>
                    < KeyboardAwareInput
                        placeholder="email@address.com"
                        placeholderTextColor="#52525b"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white font-medium"
                    />
                </View>

                < View >
                    <Text className="text-zinc-400 font-medium mb-2 ml-1 mt-4" > Password </Text>
                    < KeyboardAwareInput
                        placeholder="••••••••"
                        placeholderTextColor="#52525b"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white font-medium"
                    />
                </View>

                <HapticButton
                    hapticType="light"
                    onPress={signInWithEmail}
                    disabled={loading}
                    className="w-full py-4 mt-8 bg-white rounded-xl items-center justify-center flex-row"
                >
                    {
                        loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className="text-black font-bold text-lg">Log in</ Text >
                        )
                    }
                </HapticButton>

                <HapticButton
                    hapticType="light"
                    onPress={() => router.push('/(auth)/signup')}
                    disabled={loading}
                    className="w-full py-4 mt-2 items-center justify-center"
                >
                    <Text className="text-zinc-400 font-medium" > Don't have an account? <Text className="text-white">Sign up</Text></Text>
                </HapticButton>
            </View>
        </View>
    );
}
