import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line,
  G,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// Standalone Mini Red Map Pin
function MiniPinLogo({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="authPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF4D4D" />
          <Stop offset="45%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#991B1B" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 256 470 C 220 398 116 268 116 182 A 140 140 0 1 1 396 182 C 396 268 292 398 256 470 Z"
        fill="url(#authPinGrad)"
      />
      <Circle cx="256" cy="182" r="68" fill="#FFFFFF" />
      <G transform="rotate(45, 256, 182)">
        <Path d="M 256 134 L 224 216 L 256 196 Z" fill="#F43F5E" />
        <Path d="M 256 134 L 256 196 L 288 216 Z" fill="#991B1B" />
      </G>
    </Svg>
  );
}

export default function AuthScreen({ onContinue }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleContinue = () => {
    const cleanNumber = phoneNumber.trim() || '1712345678';
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (onContinue) {
      onContinue({ phoneNumber: cleanNumber, code: generatedCode });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Bar */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <MiniPinLogo size={28} />
              <Text style={styles.brandName}>Trive</Text>
            </View>
          </View>

          {/* Heading & Subtitle */}
          <View style={styles.headingSection}>
            <Text style={styles.headline}>
              {isSignUp ? 'Create your account' : 'Enter your mobile number'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Sign up to access intelligent route finding and fleet dispatch.'
                : 'Log in or sign up to track and manage fleet deliveries.'}
            </Text>
          </View>

          {/* Pathao-Style Phone Input Box */}
          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
            ]}
          >
            {/* Country Code Pill */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.countryPicker}
            >
              <Text style={styles.flagEmoji}>🇧🇩</Text>
              <Text style={styles.countryCode}>+880</Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color="#64748B"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>

            {/* Vertical Divider */}
            <View style={styles.inputDivider} />

            {/* Phone Text Input */}
            <TextInput
              style={styles.textInput}
              placeholder="1XXXXXXXXX"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={11}
            />
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.88}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          {/* Divider: "or continue with" */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Logins */}
          <View style={styles.socialRow}>
            {/* Google */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleContinue}
              activeOpacity={0.75}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleContinue}
              activeOpacity={0.75}
            >
              <Ionicons name="logo-apple" size={21} color="#0F172A" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* State Switcher (Login / Signup) */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? ' : 'New to Trive? '}
            </Text>
            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              activeOpacity={0.7}
            >
              <Text style={styles.switchLink}>
                {isSignUp ? 'Log in' : 'Create an account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Legal Terms */}
          <View style={styles.footerSection}>
            <Text style={styles.legalText}>
              By continuing, you agree to Trive's{' '}
              <Text style={styles.legalLink}>Terms of Service</Text> &amp;{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headingSection: {
    marginBottom: 28,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#F43F5E',
    backgroundColor: '#FFFFFF',
    shadowColor: '#F43F5E',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 4,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 2,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: 0.8,
    height: '100%',
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#F43F5E', // Trive Coral-Red
    height: 54,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 32,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  switchText: {
    fontSize: 14,
    color: '#64748B',
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F43F5E',
  },
  footerSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  legalText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: '#64748B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
