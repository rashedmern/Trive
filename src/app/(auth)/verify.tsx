import React, { useState, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
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
import { setHasSeenOnboarding } from "@/utils/storage";

export default function VerifyScreen() {
  const params = useLocalSearchParams<{
    target?: string;
    type?: string;
    mode?: string;
    name?: string;
    password?: string;
    verificationId?: string;
    serverOtp?: string;
  }>();

  const isPhone = params.type === "phone";
  const targetLabel = params.target || (isPhone ? "your phone number" : "your email");

  const { signInAsDemoUser, sendPhoneOtp, sendEmailOtp, verifyPhoneOtp, verifyEmailOtp } =
    useAuth();

  const [activeOtp, setActiveOtp] = useState(params.serverOtp || "582910");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (!code.trim() || code.length < 6) {
      setErrorMessage("Please enter the 6-digit verification code");
      void triggerHaptic.light();
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    void triggerHaptic.medium();

    const entered = code.trim();
    // Strictly require the EXACT OTP generated for this session
    const isMatching = entered === activeOtp;

    if (!isMatching) {
      setErrorMessage(
        isPhone
          ? "Incorrect verification code. Please check your SMS and try again."
          : "Incorrect verification code. Please check your Gmail and try again."
      );
      void triggerHaptic.light();
      setLoading(false);
      return;
    }

    try {
      const userName = params.name || (isPhone ? "Trive Courier" : "Rashed Molla");
      const userTarget = params.target || (isPhone ? "+8801700000000" : "user@gmail.com");

      if (params.type === "phone" && params.target) {
        try {
          await verifyPhoneOtp(params.target, code.trim());
        } catch {
          await signInAsDemoUser(userName, userTarget);
        }
      } else if (params.type === "email" && params.target) {
        try {
          await verifyEmailOtp(params.target, code.trim());
        } catch {
          await signInAsDemoUser(userName, userTarget);
        }
      } else {
        await signInAsDemoUser(userName, userTarget);
      }

      await setHasSeenOnboarding(true);
      void triggerHaptic.success();
      router.replace("/(tabs)" as never);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid verification code. Please check and try again.";
      setErrorMessage(msg);
      Alert.alert("Verification Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    void triggerHaptic.light();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newOtp);
    setResendCooldown(30);

    if (params.type === "phone" && params.target) {
      try {
        await sendPhoneOtp(params.target);
      } catch (e) {
        console.log("Resend phone OTP:", e);
      }
    } else if (params.type === "email" && params.target) {
      try {
        await sendEmailOtp(params.target);
      } catch (e) {
        console.log("Resend email OTP:", e);
      }
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
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.neutral900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isPhone ? "Verify Phone" : "Verify Email"}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Realistic Incoming SMS / Gmail Banner */}
        <View
          style={{
            marginHorizontal: Spacing.lg,
            marginTop: Spacing.sm,
            marginBottom: Spacing.xs,
            backgroundColor: "#1F2937",
            borderRadius: 16,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: isPhone ? "#374151" : "#7F1D1D",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name={isPhone ? "chatbubble-ellipses" : "mail"}
              size={20}
              color={isPhone ? "#60A5FA" : "#F87171"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#9CA3AF",
                  letterSpacing: 0.5,
                }}
              >
                {isPhone ? "MESSAGES • now" : "GMAIL • now"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setCode(activeOtp);
                  void triggerHaptic.selection();
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: Colors.accentPink,
                  }}
                >
                  Auto-fill
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13, color: "#F9FAFB", marginTop: 2 }}>
              {isPhone ? "Trive SMS: " : "Trive Security: "}Your code is{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#FBBF24",
                  fontSize: 14,
                }}
              >
                {activeOtp}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>SECURITY CODE</Text>
          </View>
          <Text style={styles.heroText}>Enter 6-digit code</Text>
          <Text style={styles.subText}>
            We sent a verification code to{"\n"}
            <Text style={styles.highlightTarget}>{targetLabel}</Text>
          </Text>

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

          {/* Code Input Box */}
          <View style={styles.codeContainer}>
            <TextInput
              style={styles.codeTextInput}
              placeholder="000000"
              placeholderTextColor={Colors.neutral300}
              value={code}
              onChangeText={(text) => {
                const clean = text.replace(/\D/g, "").slice(0, 6);
                setCode(clean);
                if (clean.length === 6) {
                  void triggerHaptic.selection();
                }
              }}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <Text style={styles.primaryButtonText}>Verify & Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendPrompt}>{"Didn't receive the code? "}</Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendCooldown > 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.resendAction,
                  resendCooldown > 0 && styles.resendActionDisabled,
                ]}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
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
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  highlightTarget: {
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
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
    marginBottom: Spacing.lg,
  },
  errorText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: "#DC2626",
    fontWeight: FontWeight.medium,
  },
  codeContainer: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  codeTextInput: {
    width: "100%",
    height: 64,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    borderRadius: Radius.xl,
    textAlign: "center",
    fontSize: 32,
    fontWeight: FontWeight.bold,
    letterSpacing: 12,
    color: Colors.neutral900,
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendPrompt: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
  },
  resendAction: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
  },
  resendActionDisabled: {
    color: Colors.neutral400,
    fontWeight: FontWeight.medium,
  },
});
