import { View } from 'react-native';

export default function ActionDummyScreen() {
    // This screen is never actually rendered because the custom tabBarButton
    // in _layout.tsx intercepts the press and opens a Modal instead.
    return <View className="flex-1 bg-zinc-950" />;
}
