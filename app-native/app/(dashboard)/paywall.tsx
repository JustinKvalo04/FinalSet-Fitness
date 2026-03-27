import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { WEB_BASE_URL } from '../../lib/config';
import { HapticButton } from '../../components/HapticButton';
import {
    initConnection,
    endConnection,
    fetchProducts,
    requestPurchase,
    purchaseUpdatedListener,
    purchaseErrorListener,
    finishTransaction,
    type Purchase
} from 'react-native-iap';

const itemSkus = ['com.app.premium.monthly', 'com.app.premium.yearly'];

export default function Paywall() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let updateListener: any;
        let errorListener: any;

        const setupIAP = async () => {
            try {
                await initConnection();
                const availableSubscriptions = await fetchProducts({ skus: itemSkus, type: 'subs' });
                setProducts(availableSubscriptions || []);
            } catch (err) {
                console.warn('IAP Init error:', err);
            }

            updateListener = purchaseUpdatedListener(async (purchase: Purchase) => {
                const receipt = (purchase as any).transactionReceipt;
                if (receipt) {
                    try {
                        await verifyReceiptWithBackend(receipt);
                        await finishTransaction({ purchase, isConsumable: false });
                        Alert.alert("Success", "Welcome to Premium!");
                        router.back();
                    } catch (error) {
                        Alert.alert("Verification Failed", "There was an error verifying your purchase.");
                    }
                }
                setPurchasing(false);
            });

            errorListener = purchaseErrorListener((error: any) => {
                console.warn('purchaseErrorListener', error);
                Alert.alert("Purchase Error", error.message);
                setPurchasing(false);
            });

            setLoading(false);
        };

        setupIAP();

        return () => {
            if (updateListener && updateListener.remove) updateListener.remove();
            if (errorListener && errorListener.remove) errorListener.remove();
            endConnection();
        };
    }, []);

    const verifyReceiptWithBackend = async (receiptData: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/apple/verify-receipt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                receiptData,
                userId: user.id,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to verify receipt on the server.");
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || "Invalid receipt");
        }
    };

    const handlePurchase = async (sku: string) => {
        try {
            setPurchasing(true);
            await requestPurchase({ request: { apple: { sku } }, type: 'subs' });
        } catch (err: any) {
            console.warn(err.code, err.message);
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
            <View className="mb-8 items-center mt-8">
                <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-6">
                    <FontAwesome5 name="star" size={32} color="#0ea5e9" solid />
                </View>
                <Text className="text-3xl font-bold text-white mb-2 text-center">Upgrade to Premium</Text>
                <Text className="text-zinc-400 text-center leading-6">
                    Unlock our auto-adjusting macro algorithm and advanced analytics to reach your fitness goals faster.
                </Text>
            </View>

            <View className="space-y-4 mb-8">
                {products.length === 0 ? (
                    <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 items-center">
                        <Text className="text-zinc-400 text-center mb-2">No IAP products available.</Text>
                        <Text className="text-zinc-500 text-xs text-center border-t border-zinc-800 pt-2">Note: IAP fetching requires a real device or configured simulator. Showing mock UI below.</Text>
                    </View>
                ) : (
                    products.map((product) => (
                        <HapticButton
                            hapticType="success"
                            key={product.productId}
                            onPress={() => handlePurchase(product.productId)}
                            disabled={purchasing}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex-row justify-between items-center"
                        >
                            <View>
                                <Text className="text-white font-bold text-lg mb-1">{product.title}</Text>
                                <Text className="text-zinc-400 text-sm">{product.description}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-primary font-bold text-xl">{product.localizedPrice}</Text>
                            </View>
                        </HapticButton>
                    ))
                )}
            </View>

            {/* Mock buttons for Simulator preview */}
            {products.length === 0 && (
                <View className="space-y-4 mb-8">
                    <HapticButton
                        hapticType="success"
                        onPress={() => Alert.alert("Test Mode", "Trigger real Monthly subscription purchase.")}
                        className="bg-zinc-900 border border-[#0ea5e9]/50 rounded-3xl p-6 flex-row justify-between items-center"
                    >
                        <View>
                            <Text className="text-white font-bold text-lg mb-1">Premium Monthly</Text>
                            <Text className="text-zinc-400 text-sm">Valid for 30 days</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-primary font-bold text-xl">$9.99/mo</Text>
                        </View>
                    </HapticButton>

                    <HapticButton
                        hapticType="success"
                        onPress={() => Alert.alert("Test Mode", "Trigger real Yearly subscription purchase.")}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex-row justify-between items-center"
                    >
                        <View>
                            <Text className="text-white font-bold text-lg mb-1">Premium Yearly</Text>
                            <Text className="text-zinc-400 text-sm">Save 20%</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-primary font-bold text-xl">$89.99/yr</Text>
                        </View>
                    </HapticButton>
                </View>
            )}

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

            <TouchableOpacity
                onPress={() => router.back()}
                className="mt-2 mb-12 py-4 items-center"
            >
                <Text className="text-zinc-500 font-medium">Maybe later</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
