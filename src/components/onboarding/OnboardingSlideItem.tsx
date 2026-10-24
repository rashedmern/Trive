import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Colors,
  CardGradients,
  Shadows,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
} from "@/constants/theme";
import type { OnboardingSlide } from "@/types/onboarding";

interface OnboardingSlideItemProps {
  slide: OnboardingSlide;
  width: number;
}

export function OnboardingSlideItem({ slide, width }: OnboardingSlideItemProps) {
  const gradient = CardGradients[slide.gradientKey];

  return (
    <View style={[styles.container, { width }]}>
      {/* ── 3D Hero Visual Card ── */}
      <View style={[styles.heroCard, { backgroundColor: gradient[0] }]}>
        {/* Soft background glow halo */}
        <View style={[styles.cardGlow, { backgroundColor: gradient[1] }]} />

        {/* Floating Feature Badge */}
        <View style={[styles.badge, { backgroundColor: slide.badgeBg }]}>
          <Text style={[styles.badgeText, { color: slide.badgeTextColor }]}>
            {slide.badgeText}
          </Text>
        </View>

        {/* 3D Visual Icon Centerpiece */}
        <View style={styles.iconCenterpiece}>
          {slide.id === "slide_1" && (
            <MaterialCommunityIcons
              name="moped-electric"
              size={64}
              color={Colors.surfaceDark}
            />
          )}
          {slide.id === "slide_2" && (
            <Ionicons
              name="navigate-circle"
              size={64}
              color={Colors.accentPink}
            />
          )}
          {slide.id === "slide_3" && (
            <MaterialCommunityIcons
              name="shield-check"
              size={64}
              color="#15803D"
            />
          )}
        </View>

        {/* Decorative parcel mini-accent */}
        <View style={styles.miniParcelPill}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={15}
            color={Colors.neutral700}
          />
          <Text style={styles.miniParcelText}>Trive Express</Text>
        </View>
      </View>

      {/* ── Humanized Text Content ── */}
      <View style={styles.textContainer}>
        <View style={styles.tagRow}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>{slide.tag.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {slide.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  heroCard: {
    width: "100%",
    height: 220,
    borderRadius: Radius.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.neutral100,
    ...Shadows.card,
  },
  cardGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.6,
  },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    ...Shadows.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  iconCenterpiece: {
    alignItems: "center",
    justifyContent: "center",
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    ...Shadows.card,
  },
  miniParcelPill: {
    position: "absolute",
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    ...Shadows.sm,
  },
  miniParcelText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral800,
    marginLeft: 5,
  },
  textContainer: {
    width: "100%",
    marginTop: 18,
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentPink,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
    letterSpacing: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.neutral600,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
});
