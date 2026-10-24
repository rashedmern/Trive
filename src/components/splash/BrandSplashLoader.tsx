import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { TriveIcon } from "@/components/brand/TriveIcon";
import { Colors } from "@/constants/theme";

interface BrandSplashLoaderProps {
  onAnimationFinished?: () => void;
}

export function BrandSplashLoader({ onAnimationFinished }: BrandSplashLoaderProps) {
  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(-20);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Logo fades in with spring scale
    logoOpacity.value = withTiming(1, { duration: 350 });
    logoScale.value = withSpring(1.0, {
      damping: 14,
      stiffness: 120,
      mass: 0.8,
    });

    // 2. "TRIVE" brand text slides out horizontally
    const timer = setTimeout(() => {
      textOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      textTranslateX.value = withSpring(0, {
        damping: 15,
        stiffness: 110,
      });

      if (onAnimationFinished) {
        setTimeout(onAnimationFinished, 500);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [logoOpacity, logoScale, textOpacity, textTranslateX, onAnimationFinished]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: textTranslateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <Animated.View style={animatedLogoStyle}>
          <TriveIcon size={68} />
        </Animated.View>

        <Animated.View style={[styles.textWrapper, animatedTextStyle]}>
          <Text style={styles.brandTitle}>TRIVE</Text>
          <Text style={styles.brandSubtitle}>EXPRESS LOGISTICS</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    marginLeft: 16,
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 3,
    color: Colors.neutral900,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: Colors.accentPink,
    marginTop: 2,
  },
});
