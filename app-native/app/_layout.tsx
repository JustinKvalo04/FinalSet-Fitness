import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

// Global error handler for unhandled promise rejections
if (typeof ErrorUtils !== 'undefined') {
  if (__DEV__) {
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('Global Error:', error);
      if (originalHandler) originalHandler(error, isFatal);
    });
  } else {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('Unhandled Promise Rejection or Fatal Error:', error);
    });
  }
}

export default function RootLayout() {
  console.log("BOOT: root layout loaded");

  useEffect(() => {
    console.log("BOOT: stack mounted");
  }, []);

  // Binary Isolation Step 1:
  // Render a bare Stack with the dummy index screen.
  // No auth stack, no dashboard stack, no Supabase session logic.
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
    </Stack>
  );
}
