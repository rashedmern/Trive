import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";

/**
 * Root index route.
 * Routing decisions are centrally managed by InitialLayout in `src/app/_layout.tsx`
 * based on Clerk auth state and onboarding completion.
 */
export default function Index() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
