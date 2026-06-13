import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { getSupabaseClient } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { WEB_BASE_URL } from '../../lib/config';
import { HapticButton } from '../../components/HapticButton';

const itemSkus = ['com.finalset.fitness.premium.monthly', 'com.finalset.fitness.premium.yearly'];

export default function Paywall() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                const Purchases = require('react-native-purchases').default;
                const offerings = await Purchases.getOfferings();
                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    setProducts(offerings.current.availablePackages);
                }
            } catch (e) {
                console.warn('Error fetching RevenueCat offerings:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchOfferings();
    }, []);

    const verifyReceiptWithBackend = async () => {
        // Now handled by RevenueCat directly
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Optimistically update the user's profile locally
            await supabase.from('profiles').update({ subscription_status: 'active' }).eq('id', user.id);
        }
    };

    const handlePurchase = async (pkg: any) => {
        try {
            setPurchasing(true);
            const Purchases = require('react-native-purchases').default;
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
                await verifyReceiptWithBackend();
                Alert.alert("Success", "Welcome to Premium!");
                router.back();
            }
        } catch (err: any) {
            if (!err.userCancelled) {
                Alert.alert("Purchase Error", err.message);
            }
        } finally {
            setPurchasing(false);
        }
    };

    const handleRestore = async () => {
        try {
            setPurchasing(true);
            const Purchases = require('react-native-purchases').default;
            const customerInfo = await Purchases.restorePurchases();
            if (typeof customerInfo.entitlements.active['Premium'] !== "undefined") {
                await verifyReceiptWithBackend();
                Alert.alert("Success", "Purchases successfully restored.");
                router.back();
            } else {
                Alert.alert("Restore", "No active subscriptions found.");
            }
        } catch (err: any) {
            Alert.alert("Restore Error", err.message);
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator color="#0ea5e9" size="large" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-zinc-950 px-6 pt-12">
            <View className="mb-6 items-center mt-4">
                <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-4">
                    <FontAwesome5 name="star" size={24} color="#0ea5e9" solid />
                </View>
                <Text className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Train Smarter. Progress Faster.</Text>
                <Text className="text-zinc-400 text-center leading-6 text-lg">
                    Unlock the full FinalSet experience
                </Text>
            </View>

            {/* SECTION 1: TRAINING */}
            <View className="mb-4">
                <Text className="text-white font-bold text-lg mb-3 ml-2">Training</Text>
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Custom workouts</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Edit exercises</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Build your own split</Text>
                    </View>
                </View>
            </View>

            {/* SECTION 2: PROGRESS */}
            <View className="mb-4">
                <Text className="text-white font-bold text-lg mb-3 ml-2">Progress</Text>
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Strength progression tracking</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">PR analytics</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Weight trends</Text>
                    </View>
                </View>
            </View>

            {/* SECTION 3: NUTRITION */}
            <View className="mb-8">
                <Text className="text-white font-bold text-lg mb-3 ml-2">Nutrition</Text>
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Adaptive macros</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Weekly insights</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={16} color="#0ea5e9" className="mr-3" />
                        <Text className="text-zinc-300 text-base">Smart calorie adjustments</Text>
                    </View>
                </View>
            </View>

            <View className="space-y-4 mb-8">
                {products.length === 0 ? (
                    <>
                        <HapticButton
                            hapticType="success"
                            onPress={() => Alert.alert("Test Mode", "Trigger real Yearly subscription purchase.")}
                            className="bg-[#0A84FF] border border-[#0A84FF]/50 shadow-lg shadow-[#0A84FF]/20 rounded-3xl p-6 flex-row justify-between items-center"
                        >
                            <View>
                                <Text className="text-white font-bold text-lg mb-1">Yearly Plan</Text>
                                <View className="bg-white/20 self-start px-2 py-1 rounded-md mb-1">
                                    <Text className="text-white text-xs font-bold uppercase">Best Value</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-2xl">$89.99<Text className="text-base font-normal">/yr</Text></Text>
                            </View>
                        </HapticButton>

                        <HapticButton
                            hapticType="light"
                            onPress={() => Alert.alert("Test Mode", "Trigger real Monthly subscription purchase.")}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex-row justify-between items-center"
                        >
                            <View>
                                <Text className="text-white font-bold text-lg mb-1">Monthly Plan</Text>
                                <Text className="text-zinc-400 text-sm">Flexible billing</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-zinc-300 font-bold text-xl">$9.99<Text className="text-base font-normal">/mo</Text></Text>
                            </View>
                        </HapticButton>
                    </>
                ) : (
                    products.map((pkg: any) => {
                        const isYearly = pkg.packageType === 'ANNUAL';
                        return (
                            <HapticButton
                                hapticType={isYearly ? "success" : "light"}
                                key={pkg.identifier}
                                onPress={() => handlePurchase(pkg)}
                                disabled={purchasing}
                                className={isYearly ? "bg-[#0A84FF] border border-[#0A84FF]/50 shadow-lg shadow-[#0A84FF]/20 rounded-3xl p-6 flex-row justify-between items-center" : "bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex-row justify-between items-center"}
                            >
                                <View>
                                    <Text className={isYearly ? "text-white font-bold text-lg mb-1" : "text-white font-bold text-lg mb-1"}>{pkg.product.title}</Text>
                                    {isYearly && (
                                        <View className="bg-white/20 self-start px-2 py-1 rounded-md mb-1">
                                            <Text className="text-white text-xs font-bold uppercase">Best Value</Text>
                                        </View>
                                    )}
                                    <Text className={isYearly ? "text-white/80 text-sm" : "text-zinc-400 text-sm"}>{pkg.product.description}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className={isYearly ? "text-white font-bold text-2xl" : "text-zinc-300 font-bold text-xl"}>{pkg.product.priceString}</Text>
                                </View>
                            </HapticButton>
                        );
                    })
                )}
            </View>

            {purchasing && (
                <View className="items-center mt-4">
                    <ActivityIndicator color="#0ea5e9" />
                    <Text className="text-zinc-400 mt-2">Processing purchase...</Text>
                </View>
            )}

            <View className="mt-8 mb-4 px-2">
                <Text className="text-zinc-500 text-[10px] text-center mb-4 leading-4">
                    A premium subscription is required to unlock the auto-adjusting macro algorithm and advanced analytics. Depending on your selection, you will be billed either monthly or annually. Payment will be charged to your Apple ID account at confirmation of purchase. Your subscription will automatically renew unless canceled at least 24 hours before the end of the current billing period. You can manage and cancel your subscriptions by going to your Apple ID account settings on the App Store after purchase.
                </Text>

                <View className="flex-row justify-center items-center">
                    <TouchableOpacity onPress={() => Linking.openURL(`${WEB_BASE_URL}/terms`)}>
                        <Text className="text-zinc-400 text-xs underline">Terms of Service</Text>
                    </TouchableOpacity>
                    <Text className="text-zinc-600 text-xs mx-3">•</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`${WEB_BASE_URL}/privacy`)}>
                        <Text className="text-zinc-400 text-xs underline">Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={handleRestore} className="mt-4 mb-2 py-4">
                <Text className="text-zinc-500 font-bold text-center underline">Restore Purchases</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.back()}
                className="mt-2 mb-12 py-4 items-center bg-zinc-900 border border-zinc-800 rounded-2xl mx-6"
            >
                <Text className="text-zinc-400 font-bold text-lg">Not now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
