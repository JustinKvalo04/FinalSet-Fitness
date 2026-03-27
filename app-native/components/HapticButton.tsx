import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'none';

interface HapticButtonProps extends TouchableOpacityProps {
    hapticType?: HapticType;
}

export const triggerHaptic = (type: HapticType) => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

    switch (type) {
        case 'light':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
        case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        case 'warning':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
        case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        case 'none':
        default:
            break;
    }
};

export const HapticButton: React.FC<HapticButtonProps> = ({
    hapticType = 'light',
    onPress,
    activeOpacity = 0.7,
    ...props
}) => {
    const handlePress = (e: any) => {
        triggerHaptic(hapticType);
        if (onPress) {
            onPress(e);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={handlePress}
            {...props}
        />
    );
};
