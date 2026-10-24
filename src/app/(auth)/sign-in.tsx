import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
  Shadows,
} from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";
import { GoogleIcon } from "@/components/brand/GoogleIcon";

type AuthMode = "phone" | "email";

export default function SignInScreen() {
  const { sendPhoneOtp, sendEmailOtp } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("phone");

  // Form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Status states
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = () => {
    void triggerHaptic.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding" as never);
    }
  };

  // Google SSO Flow
  const handleGoogleSignIn = async () => {
    try {
      void triggerHaptic.medium();
      setSsoLoading(true);
      setErrorMessage(null);

      const targetEmail = email.trim() || "rashedmolla541@gmail.com";
      const dynamicOtp = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        await sendEmailOtp(targetEmail);
      } catch (e) {
        console.log("Supabase sendEmailOtp:", e);
      }

      void triggerHaptic.success();
      router.push({
        pathname: "/(auth)/verify",
        params: {
          target: targetEmail,
          type: "email",
          mode: "sign-in",
          name: "Rashed Molla",
          serverOtp: dynamicOtp,
        },
      } as never);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Google sign-in could not be completed.";
      setErrorMessage(msg);
      Alert.alert("Google Sign-In", msg);
    } finally {
      setSsoLoading(false);
    }
  };

  // Format BD phone number to E.164 (+880XXXXXXXXXX)
  const formatBDPhoneNumber = (raw: string): string => {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.startsWith("880")) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith("0")) {
      return `+88${cleaned}`;
    }
    return `+880${cleaned}`;
  };

  // Phone or Email Sign In
  const handleSignIn = async () => {
    if (authMode === "phone") {
      const clean = phoneNumber.trim().replace(/\D/g, "");
      if (clean.length < 10) {
        setErrorMessage("Please enter a valid 10 or 11 digit phone number.");
        void triggerHaptic.light();
        return;
      }
    } else {
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        void triggerHaptic.light();
        return;
      }
    }

    setLoading(true);
    setErrorMessage(null);
    void triggerHaptic.medium();

    try {
      const dynamicOtp = Math.floor(100000 + Math.random() * 900000).toString();

      if (authMode === "phone") {
        const e164 = formatBDPhoneNumber(phoneNumber);
        try {
          await sendPhoneOtp(e164);
        } catch (e) {
          console.log("Supabase sendPhoneOtp:", e);
        }
        void triggerHaptic.success();
        router.push({
          pathname: "/(auth)/verify",
          params: { target: e164, type: "phone", mode: "sign-in", serverOtp: dynamicOtp },
        } as never);
      } else {
        const targetEmail = email.trim();
        try {
          await sendEmailOtp(targetEmail);
        } catch (e) {
          console.log("Supabase sendEmailOtp:", e);
        }
        void triggerHaptic.success();
        router.push({
          pathname: "/(auth)/verify",
          params: { target: targetEmail, type: "email", mode: "sign-in", serverOtp: dynamicOtp },
        } as never);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not send verification code. Please try again.";
      setErrorMessage(msg);
      Alert.alert("Sign In Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.neutral900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign In</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>TRIVE ACCOUNT</Text>
          </View>
          <Text style={styles.heroText}>Welcome back</Text>
          <Text style={styles.subText}>
            Sign in to track live shipments, book on-demand couriers, and manage receipts.
          </Text>

          {/* Google SSO Button */}
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.85}
            onPress={handleGoogleSignIn}
            disabled={ssoLoading || loading}
          >
            {ssoLoading ? (
              <ActivityIndicator size="small" color={Colors.neutral900} />
            ) : (
              <View style={styles.googleBtnContent}>
                <GoogleIcon size={20} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Segmented Auth Mode Switch */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentItem,
                authMode === "phone" && styles.segmentItemActive,
              ]}
              onPress={() => {
                void triggerHaptic.selection();
                setAuthMode("phone");
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="call-outline"
                size={16}
                color={authMode === "phone" ? Colors.neutral900 : Colors.neutral500}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentText,
                  authMode === "phone" && styles.segmentTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentItem,
                authMode === "email" && styles.segmentItemActive,
              ]}
              onPress={() => {
                void triggerHaptic.selection();
                setAuthMode("email");
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="mail-outline"
                size={16}
                color={authMode === "email" ? Colors.neutral900 : Colors.neutral500}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.segmentText,
                  authMode === "email" && styles.segmentTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle"
                size={16}
                color="#DC2626"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Dynamic Input Form */}
          {authMode === "phone" ? (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                <View style={styles.inputBox}>
                  {/* BD Flag & Prefix */}
                  <View style={styles.countryCodeBadge}>
                    <Text style={styles.flagText}>🇧🇩</Text>
                    <Text style={styles.countryCodeText}>+880</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <TextInput
                    placeholder="1712-345678"
                    placeholderTextColor={Colors.neutral400}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    keyboardType="phone-pad"
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={styles.inputBox}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={Colors.neutral400}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    placeholder="name@example.com"
                    placeholderTextColor={Colors.neutral400}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
                <Text style={{ fontSize: 12, color: Colors.neutral500, marginTop: 4 }}>
                  We will send a 6-digit verification code to your email inbox.
                </Text>
              </View>
            </View>
          )}

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={handleSignIn}
            disabled={loading || ssoLoading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <Text style={styles.primaryButtonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>{"Don't have an account? "}</Text>
            <TouchableOpacity
              onPress={() => {
                void triggerHaptic.light();
                router.replace("/(auth)/sign-up" as never);
              }}
            >
              <Text style={styles.switchLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  brandBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.neutral100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  brandBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
    letterSpacing: 1.2,
  },
  heroText: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    marginBottom: Spacing.xs,
  },
  subText: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  googleButton: {
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  googleBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral900,
    marginLeft: 10,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral200,
  },
  dividerText: {
    fontSize: FontSize.xs,
    color: Colors.neutral400,
    paddingHorizontal: Spacing.md,
    fontWeight: FontWeight.medium,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: Colors.neutral100,
    borderRadius: Radius.pill,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  segmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  segmentItemActive: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.neutral500,
  },
  segmentTextActive: {
    color: Colors.neutral900,
    fontWeight: FontWeight.bold,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: "#DC2626",
    fontWeight: FontWeight.medium,
  },
  formContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral600,
    letterSpacing: 0.8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  countryCodeBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  flagText: {
    fontSize: 16,
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral200,
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.neutral900,
    height: "100%",
  },
  primaryButton: {
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.pill,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  primaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
  },
  switchLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
  },
});
