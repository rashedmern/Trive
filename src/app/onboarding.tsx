import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import {
  Colors,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
  Shadows,
} from "@/constants/theme";
import type { OnboardingSlide } from "@/types/onboarding";
import { OnboardingSlideItem } from "@/components/onboarding/OnboardingSlideItem";
import { PaginationPills } from "@/components/onboarding/PaginationPills";
import { TriveIcon } from "@/components/brand/TriveIcon";
import { triggerHaptic } from "@/utils/haptics";
import { setHasSeenOnboarding } from "@/utils/storage";

const SLIDES: OnboardingSlide[] = [
  {
    id: "slide_1",
    tag: "Instant Dispatch",
    title: "Fast On-Demand Deliveries",
    description:
      "Send packages across town in minutes with verified, background-checked couriers at your doorstep.",
    badgeText: "INSTANT COURIER",
    badgeBg: "#DCFCE7",
    badgeTextColor: "#15803D",
    iconName: "moped-electric",
    gradientKey: "green",
  },
  {
    id: "slide_2",
    tag: "Live GPS",
    title: "Live Turn-by-Turn Tracking",
    description:
      "Watch your parcel moving in real-time right on the map with live ETA metrics and rider proximity.",
    badgeText: "REAL-TIME RADAR",
    badgeBg: "#FFE4E6",
    badgeTextColor: "#BE123C",
    iconName: "navigate-circle",
    gradientKey: "coral",
  },
  {
    id: "slide_3",
    tag: "Secure Delivery",
    title: "Safe & Reliable Handover",
    description:
      "Secure package handling, instant digital receipts, fragile item care, and hassle-free cash on delivery.",
    badgeText: "VERIFIED HANDOVER",
    badgeBg: "#E0E7FF",
    badgeTextColor: "#4338CA",
    iconName: "shield-check",
    gradientKey: "lavender",
  },
];

const VIEWABILITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 50,
};

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  // ── Logo Reveal Animation Shared Values ─────────────────────────
  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(-20);
  const textOpacity = useSharedValue(0);

  const fireHapticSettled = useCallback(() => {
    void triggerHaptic.light();
  }, []);

  useEffect(() => {
    // 1. Logo fades in with gentle spring scale (0.85 -> 1.05 -> 1.0)
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withSpring(
      1.0,
      {
        damping: 12,
        stiffness: 140,
        mass: 0.8,
      },
      (finished) => {
        if (finished) {
          runOnJS(fireHapticSettled)();
        }
      }
    );

    // 2. Immediately after, brand text slides out horizontally
    textOpacity.value = withDelay(250, withTiming(1, { duration: 350 }));
    textTranslateX.value = withDelay(
      250,
      withSpring(0, { damping: 14, stiffness: 120 })
    );
  }, [fireHapticSettled, logoOpacity, logoScale, textOpacity, textTranslateX]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateX: textTranslateX.value }],
  }));

  const isFinalStep = currentIndex === SLIDES.length - 1;

  const completeOnboardingAndNavigate = useCallback(async (route: string) => {
    await setHasSeenOnboarding(true);
    router.replace(route as never);
  }, []);

  const handleNext = () => {
    void triggerHaptic.medium();
    if (currentIndex < SLIDES.length - 1) {
      const nextIdx = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIdx, animated: true });
      setCurrentIndex(nextIdx);
    }
  };

  const handleSkip = () => {
    void triggerHaptic.medium();
    void completeOnboardingAndNavigate("/(auth)/sign-in");
  };

  const handleGetStarted = () => {
    void triggerHaptic.medium();
    // Navigates strictly to Sign Up, NOT dashboard directly
    void completeOnboardingAndNavigate("/(auth)/sign-up");
  };

  const handleSignIn = () => {
    void triggerHaptic.light();
    void completeOnboardingAndNavigate("/(auth)/sign-in");
  };

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex((prev) => {
          if (newIndex !== prev) {
            void triggerHaptic.light();
            return newIndex;
          }
          return prev;
        });
      }
    },
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── Top Header Bar with Pathao-Style Animated Logo Reveal ── */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          {/* Animated Standalone SVG Pin Logo */}
          <Animated.View style={[styles.logoBox, animatedLogoStyle]}>
            <TriveIcon size={34} />
          </Animated.View>

          {/* Animated Horizontal Slide Brand Text */}
          <Animated.View style={[styles.brandTextContainer, animatedTextStyle]}>
            <Text style={styles.brandTitle}>TRIVE</Text>
            <Text style={styles.brandTag}>Moving parcels faster</Text>
          </Animated.View>
        </View>

        {!isFinalStep ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* ── Carousel Slider ── */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          renderItem={({ item }) => (
            <OnboardingSlideItem slide={item} width={width} />
          )}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={VIEWABILITY_CONFIG}
          onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            if (index !== currentIndex) {
              setCurrentIndex(index);
            }
          }}
        />
      </View>

      {/* ── Bottom Controls ── */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {/* Pagination Pills */}
        <PaginationPills total={SLIDES.length} activeIndex={currentIndex} />

        {isFinalStep ? (
          /* Final Step: Get Started -> Sign Up + Sign in Link */
          <View style={styles.finalActions}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleGetStarted}
              style={styles.getStartedButton}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.surface}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            <View style={styles.signInRow}>
              <Text style={styles.signInPrompt}>{"Already have an account? "}</Text>
              <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Steps 1 & 2: Next Button */
          <View style={styles.stepActions}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleNext}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.surface}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    letterSpacing: 0.5,
  },
  brandTag: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: Colors.neutral200,
    paddingLeft: 8,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  skipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral600,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 8,
  },
  stepActions: {
    marginTop: 14,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.pill,
    paddingVertical: 14,
    ...Shadows.card,
  },
  nextButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  finalActions: {
    marginTop: 14,
    alignItems: "center",
  },
  getStartedButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.pill,
    paddingVertical: 14,
    ...Shadows.card,
  },
  getStartedText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  signInPrompt: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
  },
  signInLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
  },
});
