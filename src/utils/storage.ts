import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ONBOARDING_KEY = "trive_has_seen_onboarding_v1";

// In-memory fallback for environments without SecureStore (e.g. SSR/Node)
let memoryFallbackValue: string | null = null;

/**
 * Check if the user has already completed the first-launch onboarding walkthrough.
 */
export async function getHasSeenOnboarding(): Promise<boolean> {
  if (Platform.OS === "web") {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(ONBOARDING_KEY) === "true";
      }
    } catch {
      return memoryFallbackValue === "true";
    }
    return memoryFallbackValue === "true";
  }

  try {
    const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return value === "true";
  } catch {
    return false;
  }
}

/**
 * Persist that the user has completed or skipped the onboarding flow.
 */
export async function setHasSeenOnboarding(seen: boolean): Promise<void> {
  const strVal = seen ? "true" : "false";
  memoryFallbackValue = strVal;

  if (Platform.OS === "web") {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(ONBOARDING_KEY, strVal);
      }
    } catch {
      // Ignore web storage error
    }
    return;
  }

  try {
    await SecureStore.setItemAsync(ONBOARDING_KEY, strVal);
  } catch {
    // Graceful fallback
  }
}
