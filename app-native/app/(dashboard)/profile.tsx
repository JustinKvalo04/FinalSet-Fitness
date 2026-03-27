import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, ActivityIndicator, Alert, TextInput, Platform, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardFormWrapper } from '../../components/KeyboardFormWrapper';
import { KeyboardAwareInput } from '../../components/KeyboardDoneView';
import { HapticButton } from '../../components/HapticButton';

const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
};

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [totalInches, setTotalInches] = useState<number>(70); // Default 5'10"
    const [sex, setSex] = useState<'Male' | 'Female'>('Male');
    const [dobMonth, setDobMonth] = useState('');
    const [dobDay, setDobDay] = useState('');
    const [dobYear, setDobYear] = useState('');

    // Height State
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');



    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profileData) {
                setProfile(profileData);
                setFullName(profileData.full_name || '');
                if (profileData.height) {
                    setTotalInches(profileData.height);
                    setHeightFt(Math.floor(profileData.height / 12).toString());
                    setHeightIn(Math.round(profileData.height % 12).toString());
                }
                setSex(profileData.sex as any || 'Male');
                if (profileData.dob) {
                    const parts = profileData.dob.split('-');
                    if (parts.length === 3) {
                        setDobYear(parts[0]);
                        setDobMonth(parts[1]);
                        setDobDay(parts[2].split('T')[0]);
                    }
                }
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            let formattedDob = null;
            if (dobYear && dobMonth && dobDay) {
                formattedDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
            }

            let calculatedInches = totalInches;
            const ft = parseInt(heightFt) || 0;
            const ins = parseInt(heightIn) || 0;
            if (ft > 0) {
                calculatedInches = (ft * 12) + ins;
            }

            const updates = {
                full_name: fullName,
                height: calculatedInches,
                sex: sex,
                dob: formattedDob,
            };

            const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
            if (error) {
                Alert.alert("Error updating profile", error.message);
            } else {
                setProfile({ ...profile, ...updates });
                setEditMode(false);
            }
        }
        setSaving(false);
    };

    const handleChangeAvatar = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                return Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to change your profile picture.');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setUploading(true);
                const asset = result.assets[0];

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Authentication error. Please log in again.");

                // Convert file URI to Blob reliably
                const res = await fetch(asset.uri);
                if (!res.ok) throw new Error("Failed to process selected image.");
                const blob = await res.blob();

                const ext = asset.uri.substring(asset.uri.lastIndexOf('.') + 1) || 'jpeg';
                const fileName = `${Date.now()}.${ext === 'jpg' ? 'jpeg' : ext}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, blob, {
                        contentType: asset.mimeType || 'image/jpeg',
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                const publicUrl = publicUrlData.publicUrl;

                const { error: updateError } = await supabase.from('profiles')
                    .update({ avatar_url: publicUrl })
                    .eq('id', user.id);

                if (updateError) throw updateError;

                setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
            }
        } catch (error: any) {
            Alert.alert("Error saving photo", error.message || "An unexpected error occurred.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-zinc-950 justify-center items-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-950">
            <KeyboardFormWrapper
                className="flex-1 bg-zinc-950 px-6 pt-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >

                {/* Header / Avatar */}
                <View className="items-center mb-8">
                    <TouchableOpacity activeOpacity={0.8} onPress={handleChangeAvatar} className="relative mb-4">
                        <View className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-primary items-center justify-center overflow-hidden shadow-xl">
                            {uploading ? (
                                <ActivityIndicator color="#0ea5e9" />
                            ) : profile?.avatar_url ? (
                                <Image source={{ uri: profile.avatar_url }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <Text className="text-3xl text-zinc-400 font-bold">
                                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'A'}
                                </Text>
                            )}
                        </View>
                        <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-zinc-950 shadow-sm">
                            <FontAwesome5 name="camera" size={12} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-white">{profile?.full_name || 'Athlete'}</Text>
                    <Text className="text-zinc-400">{profile?.email}</Text>
                </View>

                {/* Profile Details */}
                <View className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
                    <View className="p-6 border-b border-zinc-800 flex-row justify-between items-center">
                        <Text className="text-xl font-bold text-white">Personal Info</Text>
                        <HapticButton hapticType="light" onPress={() => setEditMode(!editMode)}>
                            <Text className="text-primary font-bold">{editMode ? 'Cancel' : 'Edit'}</Text>
                        </HapticButton>
                    </View>

                    <View className="p-6 space-y-4">
                        <View>
                            <Text className="text-zinc-500 text-sm mb-1">Full Name</Text>
                            {editMode ? (
                                <KeyboardAwareInput
                                    value={fullName}
                                    onChangeText={setFullName}
                                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white"
                                />
                            ) : (
                                <Text className="text-white font-medium text-lg">{profile?.full_name || '--'}</Text>
                            )}
                        </View>

                        <View>
                            <Text className="text-zinc-500 text-sm mb-1">Date of Birth</Text>
                            {editMode ? (
                                <View className="flex-row gap-2">
                                    <KeyboardAwareInput
                                        value={dobMonth}
                                        onChangeText={setDobMonth}
                                        placeholder="MM"
                                        placeholderTextColor="#52525b"
                                        keyboardType="number-pad"
                                        maxLength={2}
                                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-center"
                                    />
                                    <KeyboardAwareInput
                                        value={dobDay}
                                        onChangeText={setDobDay}
                                        placeholder="DD"
                                        placeholderTextColor="#52525b"
                                        keyboardType="number-pad"
                                        maxLength={2}
                                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-center"
                                    />
                                    <KeyboardAwareInput
                                        value={dobYear}
                                        onChangeText={setDobYear}
                                        placeholder="YYYY"
                                        placeholderTextColor="#52525b"
                                        keyboardType="number-pad"
                                        maxLength={4}
                                        className="flex-[1.5] bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-center"
                                    />
                                </View>
                            ) : (
                                <Text className="text-white font-medium text-lg">
                                    {dobYear && dobMonth && dobDay ? formatDisplayDate(`${dobYear}-${dobMonth}-${dobDay}`) : '--'}
                                </Text>
                            )}
                        </View>

                        <View className="flex-row">
                            <View className="flex-[1.5] pr-3">
                                <Text className="text-zinc-500 text-sm mb-1">Height</Text>
                                {editMode ? (
                                    <View className="flex-row gap-2">
                                        <View className="flex-[1] relative">
                                            <KeyboardAwareInput
                                                value={heightFt}
                                                onChangeText={setHeightFt}
                                                placeholder="Ft"
                                                placeholderTextColor="#52525b"
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                className="bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-8 py-3 text-white text-center font-bold"
                                            />
                                            <Text className="absolute right-3 top-3 text-zinc-500 font-bold">ft</Text>
                                        </View>
                                        <View className="flex-[1] relative">
                                            <KeyboardAwareInput
                                                value={heightIn}
                                                onChangeText={setHeightIn}
                                                placeholder="In"
                                                placeholderTextColor="#52525b"
                                                keyboardType="number-pad"
                                                maxLength={2}
                                                className="bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-8 py-3 text-white text-center font-bold"
                                            />
                                            <Text className="absolute right-3 top-3 text-zinc-500 font-bold">in</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <Text className="text-white font-medium text-lg">{profile?.height ? `${Math.floor(profile.height / 12)}' ${profile.height % 12}"` : '--'}</Text>
                                )}
                            </View>
                            <View className="flex-1 pl-1">
                                <Text className="text-zinc-500 text-sm mb-1">Sex</Text>
                                {editMode ? (
                                    <View className="flex-row bg-zinc-950 border border-zinc-800 rounded-xl p-1 h-14 relative">
                                        {/* Animated Sliding Background */}
                                        <View
                                            className="absolute top-1 bottom-1 w-1/2 bg-zinc-800 rounded-lg"
                                            style={{ left: sex === 'Male' ? 4 : '50%' }}
                                        />
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => setSex('Male')}
                                            className="flex-1 items-center justify-center z-10"
                                        >
                                            <Text className={`font-bold text-sm ${sex === 'Male' ? 'text-white' : 'text-zinc-500'}`}>Male</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => setSex('Female')}
                                            className="flex-1 items-center justify-center z-10"
                                        >
                                            <Text className={`font-bold text-sm ${sex === 'Female' ? 'text-white' : 'text-zinc-500'}`}>Female</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text className="text-white font-medium text-lg capitalize">{profile?.sex || '--'}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {editMode && (
                        <HapticButton hapticType="success" onPress={handleSave} disabled={saving} className="w-full bg-primary py-4 rounded-xl items-center mt-2">
                            {saving ? <ActivityIndicator color="#000" /> : <Text className="text-black font-bold text-lg">Save Changes</Text>}
                        </HapticButton>
                    )}
                </View>
            </KeyboardFormWrapper>
        </View>
    );
}
