import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Shadows, Radius } from "@/constants/theme";

interface PaginationPillsProps {
  total: number;
  activeIndex: number;
}

export function PaginationPills({ total, activeIndex }: PaginationPillsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={`pill_${index}`}
            style={[
              styles.pillBase,
              isActive ? styles.pillActive : styles.pillInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pillBase: {
    height: 8,
    borderRadius: Radius.pill,
  },
  pillActive: {
    width: 28,
    backgroundColor: Colors.accentPink,
    ...Shadows.pinkGlow,
  },
  pillInactive: {
    width: 8,
    backgroundColor: Colors.neutral300,
  },
});
