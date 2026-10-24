import "../global.css";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { BrandSplashLoader } from "@/components/splash/BrandSplashLoader";
import { getHasSeenOnboarding } from "@/utils/storage";

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    const handleNavigation = async () => {
      if (isSignedIn) {
        // User is authenticated: ONLY redirect if on auth screens, onboarding, or root index
        if (inAuthGroup || inOnboarding || segments[0] === "index") {
          router.replace("/(tabs)" as never);
        }
      } else {
        // User is not authenticated
        const hasSeen = await getHasSeenOnboarding();
        if (hasSeen) {
          if (!inAuthGroup) {
            router.replace("/(auth)/sign-in" as never);
          }
        } else {
          if (!inOnboarding && !inAuthGroup) {
            router.replace("/onboarding" as never);
          }
        }
      }
    };

    void handleNavigation();

    // Smoothly fade out splash screen after brief presentation
    const timer = setTimeout(() => {
      splashOpacity.value = withTiming(0, { duration: 350 }, (finished) => {
        if (finished) {
          runOnJS(setShowSplash)(false);
        }
      });
    }, 700);

    // Guaranteed web fallback so splash never hangs on browser
    const webFallbackTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1100);

    return () => {
      clearTimeout(timer);
      clearTimeout(webFallbackTimer);
    };
  }, [isLoaded, isSignedIn, segments, router, splashOpacity]);

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return (
    <View style={styles.rootContainer}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="driver/navigation" />
        <Stack.Screen name="order/create" options={{ presentation: "modal" }} />
        <Stack.Screen name="order/[id]" />
      </Stack>

      {showSplash ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, animatedSplashStyle]}
          pointerEvents="none"
        >
          <BrandSplashLoader />
        </Animated.View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
