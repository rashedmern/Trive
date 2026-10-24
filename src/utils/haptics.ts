import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Trive Haptic Touch Feedback Utility
 *
 * Rules (AGENTS.md):
 * - Always trigger physical haptic feedback (expo-haptics) on critical gestures:
 *   slider release, shift toggle, tab change.
 * - Platform-safe: graceful no-op on Web or hardware without vibration motors.
 * - Strictly zero `any`.
 */
export const triggerHaptic = {
  /**
   * Subtle tick for small pills, chips, secondary icons, and filter tags.
   */
  light: async (): Promise<void> => {
    if (Platform.OS === "web") return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Graceful fallback for devices without haptics
    }
  },

  /**
   * Standard feedback for primary action buttons (e.g., "Pause shift", "Contact support").
   */
  medium: async (): Promise<void> => {
    if (Platform.OS === "web") return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Graceful fallback
    }
  },

  /**
   * Strong feedback for confirmation gestures (e.g., SlideToConfirm completion / parcel pickup).
   */
  heavy: async (): Promise<void> => {
    if (Platform.OS === "web") return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Graceful fallback
    }
  },

  /**
   * Selection tick for bottom tab bar switching and segmented controls.
   */
  selection: async (): Promise<void> => {
    if (Platform.OS === "web") return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Graceful fallback
    }
  },

  /**
   * Celebratory / completion notification (e.g., order delivered, shift started).
   */
  success: async (): Promise<void> => {
    if (Platform.OS === "web") return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Graceful fallback
    }
  },
} as const;
