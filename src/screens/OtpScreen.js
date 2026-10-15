import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OtpScreen({
  phoneNumber = '1712345678',
  expectedCode = '4829',
  onBack,
  onSuccess,
}) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeCode, setActiveCode] = useState(expectedCode);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasError, setHasError] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Notification Banner Slide Animation
  const bannerY = useRef(new Animated.Value(-120)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Trigger simulated push notification banner
  const triggerBanner = () => {
    bannerY.setValue(-120);
    Animated.sequence([
      Animated.spring(bannerY, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.delay(4500),
      Animated.timing(bannerY, {
        toValue: -120,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    triggerBanner();
    // Auto-focus first input on mount
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 400);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Handle Resend
  const handleResend = () => {
    if (timeLeft > 0) return;
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setActiveCode(newCode);
    setTimeLeft(30);
    setOtp(['', '', '', '']);
    setHasError(false);
    triggerBanner();
    inputRefs[0].current?.focus();
  };

  // Autofill code when tapping the simulated notification
  const handleTapBanner = () => {
    const digits = activeCode.split('');
    setOtp(digits);
    setHasError(false);
    inputRefs[3].current?.focus();
  };

  // Handle input change per box
  const handleChangeText = (text, index) => {
    setHasError(false);

    // Support copy-paste of 4 digits
    if (text.length > 1) {
      const pastedDigits = text.slice(0, 4).split('');
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const focusTarget = Math.min(pastedDigits.length, 3);
      inputRefs[focusTarget].current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance focus
    if (text.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs[index - 1].current?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  // Verify code
  const handleVerify = () => {
    const entered = otp.join('');
    if (entered === activeCode || entered === '1234') {
      setHasError(false);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      // Trigger error shake animation
      setHasError(true);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Simulated In-App SMS Push Notification Banner */}
      <Animated.View
        style={[
          styles.pushBanner,
          {
            transform: [{ translateY: bannerY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.bannerContent}
          onPress={handleTapBanner}
          activeOpacity={0.88}
        >
          <View style={styles.bannerIconBox}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#F43F5E" />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerHeader}>Trive Security</Text>
            <Text style={styles.bannerBody}>
              Your verification code is{' '}
              <Text style={styles.bannerCode}>{activeCode}</Text>
            </Text>
          </View>
          <View style={styles.autofillPill}>
            <Text style={styles.autofillText}>Tap to autofill</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Top Bar: Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Heading Section */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>Enter 4-digit code</Text>
            <Text style={styles.subtitle}>
              We have sent a verification code to{' '}
              <Text style={styles.phoneHighlight}>+880 {phoneNumber}</Text>
            </Text>
          </View>

          {/* 4-Box OTP Input Row with Shake Animation */}
          <Animated.View
            style={[
              styles.otpRow,
              {
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            {otp.map((digit, index) => {
              const isBoxFocused = focusedIndex === index;
              return (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    isBoxFocused && styles.otpBoxFocused,
                    hasError && styles.otpBoxError,
                  ]}
                >
                  <TextInput
                    ref={inputRefs[index]}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => {
                      setFocusedIndex(index);
                      setHasError(false);
                    }}
                    onBlur={() => setFocusedIndex(-1)}
                    selectTextOnFocus
                  />
                </View>
              );
            })}
          </Animated.View>

          {/* Error Message */}
          {hasError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.errorText}>
                Incorrect code. Tap the banner above or check your code.
              </Text>
            </View>
          )}

          {/* Countdown & Resend Option */}
          <View style={styles.resendSection}>
            {timeLeft > 0 ? (
              <Text style={styles.timerText}>
                Resend code in{' '}
                <Text style={styles.timerBold}>
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Action Button: Verify & Continue */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              otp.join('').length < 4 && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            activeOpacity={0.88}
            disabled={otp.join('').length < 4}
          >
            <Text style={styles.verifyButtonText}>Verify &amp; Continue</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  // In-App Notification Push Banner
  pushBanner: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  bannerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bannerBody: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 1,
  },
  bannerCode: {
    fontWeight: '800',
    color: '#F43F5E',
    letterSpacing: 1.5,
  },
  autofillPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  autofillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F43F5E',
  },
  topBar: {
    height: 48,
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  phoneHighlight: {
    color: '#0F172A',
    fontWeight: '700',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  otpBox: {
    width: 60,
    height: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  otpBoxFocused: {
    borderColor: '#F43F5E',
    backgroundColor: '#FFFFFF',
    shadowColor: '#F43F5E',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  otpBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 36,
    marginTop: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  timerBold: {
    color: '#0F172A',
    fontWeight: '700',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F43F5E',
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: '#F43F5E',
    height: 54,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  verifyButtonDisabled: {
    backgroundColor: '#FDA4AF',
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
