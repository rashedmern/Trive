import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  StatusBar,
  Easing,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line,
  G,
} from 'react-native-svg';

// Minimalist Red Map Pin (Clean Vector, Transparent Canvas)
function TrivePinLogo({ size = 52 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF4D4D" />
          <Stop offset="35%" stopColor="#EF4444" />
          <Stop offset="70%" stopColor="#DC2626" />
          <Stop offset="100%" stopColor="#881337" />
        </LinearGradient>

        <LinearGradient id="needleLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F87171" />
          <Stop offset="60%" stopColor="#EF4444" />
          <Stop offset="100%" stopColor="#DC2626" />
        </LinearGradient>

        <LinearGradient id="needleDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#DC2626" />
          <Stop offset="50%" stopColor="#B91C1C" />
          <Stop offset="100%" stopColor="#881337" />
        </LinearGradient>
      </Defs>

      {/* Outer Map Location Pin */}
      <Path
        d="M 256 470
           C 220 398 116 268 116 182
           A 140 140 0 1 1 396 182
           C 396 268 292 398 256 470
           Z"
        fill="url(#pinGrad)"
      />

      {/* Center Core: Solid White Cutout */}
      <Circle cx="256" cy="182" r="68" fill="#FFFFFF" />

      {/* Inner Compass Needle (45° angle upper-right) */}
      <G transform="rotate(45, 256, 182)">
        <Path d="M 256 134 L 224 216 L 256 196 Z" fill="url(#needleLight)" />
        <Path d="M 256 134 L 256 196 L 288 216 Z" fill="url(#needleDark)" />
        <Line
          x1="256"
          y1="134"
          x2="256"
          y2="196"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </G>
    </Svg>
  );
}

export default function SplashScreen({ onFinish }) {
  // Choreographed Animation Values
  const pinTranslateY = useRef(new Animated.Value(-45)).current;
  const pinScale = useRef(new Animated.Value(0.4)).current;
  const pinOpacity = useRef(new Animated.Value(0)).current;

  const textTranslateX = useRef(new Animated.Value(-24)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const rowScale = useRef(new Animated.Value(1)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. PIN DROP: Drops from top with elastic spring bounce + fade in
      Animated.parallel([
        Animated.timing(pinOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.spring(pinTranslateY, {
          toValue: 0,
          friction: 5.5,
          tension: 75,
          useNativeDriver: true,
        }),
        Animated.spring(pinScale, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      // 2. TEXT SLIDE-OUT: "Trive" smoothly slides out from behind the pin
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateX, {
          toValue: 0,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),

      // 3. LUXURY BREATH: Subtle breathing micro-pulse
      Animated.sequence([
        Animated.timing(rowScale, {
          toValue: 1.03,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rowScale, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      // Brief hold before exit
      Animated.delay(400),

      // 4. CINEMATIC EXPAND & DISSOLVE EXIT: Smooth zoom forward into Dashboard
      Animated.parallel([
        Animated.timing(rowScale, {
          toValue: 1.15,
          duration: 380,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onFinish) {
        onFinish();
      }
    });
  }, [onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Horizontal Brand Lockup */}
      <Animated.View
        style={[
          styles.brandRow,
          {
            transform: [{ scale: rowScale }],
          },
        ]}
      >
        {/* Animated Map Pin */}
        <Animated.View
          style={{
            opacity: pinOpacity,
            transform: [
              { translateY: pinTranslateY },
              { scale: pinScale },
            ],
          }}
        >
          <TrivePinLogo size={52} />
        </Animated.View>

        {/* Animated Brand Typography */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateX: textTranslateX }],
          }}
        >
          <Text style={styles.brandTitle}>Trive</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    includeFontPadding: false,
  },
});
