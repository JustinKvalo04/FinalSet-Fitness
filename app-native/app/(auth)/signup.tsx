import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: 'finalset://',
            }
        });

        if (error) {
            if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
                Alert.alert("Too Many Requests", "For security purposes, we limit the number of signup attempts. Please check your email for a previous confirmation link, or try again later.");
            } else {
                Alert.alert("Signup Failed", error.message);
            }
            setLoading(false);
        } else {
            Alert.alert("Success", "Please check your email to confirm your account before logging in.");
            router.replace('/(auth)');
        }
    }

    return (
        <View className="flex-1 bg-zinc-950">
            <KeyboardFormWrapper
                contentContainerStyle={{ justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 48 }}
            >
                <View className="mb-12">
                    <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
                    <Text className="text-zinc-400">Join the Macro app today.</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-zinc-400 font-medium mb-2 ml-1">Full Name</Text>
                        <KeyboardAwareInput
                            placeholder="John Doe"
                            placeholderTextColor="#52525b"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white font-medium"
                        />
                    </View>

                    <View>
                        <Text className="text-zinc-400 font-medium mb-2 ml-1 mt-4">Email</Text>
                        <KeyboardAwareInput
                            placeholder="email@address.com"
                            placeholderTextColor="#52525b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white font-medium"
                        />
                    </View>

                    <View>
                        <Text className="text-zinc-400 font-medium mb-2 ml-1 mt-4">Password</Text>
                        <KeyboardAwareInput
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
                        onPress={signUpWithEmail}
                        disabled={loading}
                        className="w-full py-4 mt-8 bg-white rounded-xl items-center justify-center flex-row"
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className="text-black font-bold text-lg">Sign Up</Text>
                        )}
                    </HapticButton>

                    <Text className="text-zinc-500 text-center text-xs mt-3 px-4 leading-5">
                        We send a confirmation email to secure your account. Repeated attempts to send this email may be temporarily limited for your security.
                    </Text>

                    <HapticButton
                        hapticType="light"
                        onPress={() => router.back()}
                        disabled={loading}
                        className="w-full py-4 mt-2 items-center justify-center"
                    >
                        <Text className="text-zinc-400 font-medium">Already have an account? <Text className="text-white">Log in</Text></Text>
                    </HapticButton>
                </View>
            </KeyboardFormWrapper>
        </View>
    );
}
