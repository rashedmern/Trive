import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line,
  G,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// 1. FASTEST DELIVERY ROUTES (Routing Engine)
function Slide1Graphic() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Defs>
        <LinearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0F172A" />
          <Stop offset="100%" stopColor="#1E293B" />
        </LinearGradient>
        <LinearGradient id="mapScreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F8FAFC" />
          <Stop offset="100%" stopColor="#E2E8F0" />
        </LinearGradient>
        <LinearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#FB7185" />
        </LinearGradient>
      </Defs>

      {/* Ambient Backdrop */}
      <Circle cx="120" cy="100" r="85" fill="#FFE4E6" opacity="0.65" />
      <Circle cx="120" cy="100" r="60" fill="#FECDD3" opacity="0.4" />

      {/* Phone Body */}
      <Rect
        x="65"
        y="15"
        width="110"
        height="170"
        rx="22"
        fill="url(#phoneGrad)"
        stroke="#334155"
        strokeWidth="2.5"
      />
      <Rect
        x="72"
        y="25"
        width="96"
        height="150"
        rx="14"
        fill="url(#mapScreen)"
      />

      {/* Grid Network Lines */}
      <Path d="M 72 65 Q 120 75 168 60" stroke="#CBD5E1" strokeWidth="3" fill="none" />
      <Path d="M 72 130 Q 115 110 168 135" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
      <Path d="M 115 25 L 115 175" stroke="#CBD5E1" strokeWidth="2" fill="none" />

      {/* Optimized Route Polyline */}
      <Path
        d="M 88 140 Q 100 95 125 105 T 145 55"
        stroke="url(#routeGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Origin Node */}
      <Circle cx="88" cy="140" r="5.5" fill="#0F172A" />
      <Circle cx="88" cy="140" r="2.5" fill="#FFFFFF" />

      {/* Destination Pin (Trive Style) */}
      <G transform="translate(145, 52) scale(0.065) translate(-256, -450)">
        <Path
          d="M 256 470 C 220 398 116 268 116 182 A 140 140 0 1 1 396 182 C 396 268 292 398 256 470 Z"
          fill="#F43F5E"
        />
        <Circle cx="256" cy="182" r="68" fill="#FFFFFF" />
      </G>

      {/* Notch Pill */}
      <Rect x="105" y="20" width="30" height="4" rx="2" fill="#334155" />
    </Svg>
  );
}

// 2. REAL-TIME FLEET TRACKING (Live Telemetry)
function Slide2Graphic() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Defs>
        <LinearGradient id="vanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#E11D48" />
        </LinearGradient>
        <LinearGradient id="vanCab" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#F1F5F9" />
        </LinearGradient>
      </Defs>

      {/* GPS Radar Waves */}
      <Circle cx="120" cy="95" r="82" fill="none" stroke="#FECDD3" strokeWidth="1.5" strokeDasharray="4 4" />
      <Circle cx="120" cy="95" r="56" fill="#FFE4E6" opacity="0.45" />

      {/* GPS Satellite Beam */}
      <G transform="translate(170, 25)">
        <Circle cx="0" cy="0" r="10" fill="#0F172A" />
        <Line x1="-16" y1="-4" x2="-6" y2="2" stroke="#64748B" strokeWidth="2.5" />
        <Line x1="6" y1="-2" x2="16" y2="-8" stroke="#64748B" strokeWidth="2.5" />
        <Path d="M -12 12 Q -25 35 -45 55" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      </G>

      {/* Road Platform */}
      <Line x1="28" y1="145" x2="212" y2="145" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
      <Line x1="70" y1="145" x2="120" y2="145" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

      {/* Van Body */}
      <Rect x="55" y="75" width="85" height="52" rx="8" fill="url(#vanGrad)" />
      <Rect x="55" y="100" width="85" height="8" fill="#BE123C" />
      <Circle cx="72" cy="88" r="4" fill="#FFFFFF" />

      {/* Cabin Front & Windshield */}
      <Path d="M 140 85 L 165 95 Q 172 98 172 108 L 172 127 L 140 127 Z" fill="url(#vanCab)" />
      <Path d="M 143 89 L 160 96 Q 164 98 164 104 L 143 104 Z" fill="#0F172A" />

      {/* Wheels */}
      <Circle cx="80" cy="132" r="13" fill="#0F172A" />
      <Circle cx="80" cy="132" r="6" fill="#E2E8F0" />
      <Circle cx="152" cy="132" r="13" fill="#0F172A" />
      <Circle cx="152" cy="132" r="6" fill="#E2E8F0" />

      {/* Live Beacon */}
      <Circle cx="95" cy="65" r="7" fill="#F43F5E" />
      <Circle cx="95" cy="65" r="14" fill="#F43F5E" opacity="0.25" />
    </Svg>
  );
}

// 3. INTELLIGENT SORTING HUBS (Hub Logistics)
function Slide3Graphic() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Defs>
        <LinearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#0F172A" />
          <Stop offset="100%" stopColor="#334155" />
        </LinearGradient>
        <LinearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>

      {/* Ambient Hub Backdrop */}
      <Circle cx="120" cy="100" r="78" fill="#FFE4E6" opacity="0.5" />

      {/* Inter-Hub Network Graph Links */}
      <Line x1="120" y1="52" x2="52" y2="128" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" />
      <Line x1="120" y1="52" x2="188" y2="128" stroke="#F43F5E" strokeWidth="2" strokeDasharray="3 3" />
      <Line x1="52" y1="128" x2="188" y2="128" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="2 2" />

      {/* Main Central Hub Building */}
      <Path d="M 75 145 L 75 75 L 120 45 L 165 75 L 165 145 Z" fill="url(#hubGrad)" />
      <Path d="M 70 76 L 120 42 L 170 76" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Roller Door Loading Dock */}
      <Rect x="95" y="98" width="50" height="47" rx="4" fill="#F8FAFC" />
      <Line x1="95" y1="110" x2="145" y2="110" stroke="#E2E8F0" strokeWidth="2" />
      <Line x1="95" y1="122" x2="145" y2="122" stroke="#E2E8F0" strokeWidth="2" />
      <Line x1="95" y1="134" x2="145" y2="134" stroke="#E2E8F0" strokeWidth="2" />

      {/* Stacked Parcels at Dock */}
      <Rect x="42" y="118" width="28" height="26" rx="4" fill="url(#boxGrad)" />
      <Line x1="56" y1="118" x2="56" y2="144" stroke="#B45309" strokeWidth="2" />
      <Line x1="42" y1="131" x2="70" y2="131" stroke="#B45309" strokeWidth="2" />

      <Rect x="170" y="112" width="30" height="32" rx="4" fill="#F43F5E" />
      <Circle cx="185" cy="128" r="6" fill="#FFFFFF" />

      {/* Connected Network Node Badges */}
      <Circle cx="52" cy="128" r="8" fill="#10B981" />
      <Circle cx="188" cy="128" r="8" fill="#10B981" />
    </Svg>
  );
}

// 4. INSTANT DIGITAL DISPATCH (Secure Dispatch)
function Slide4Graphic() {
  return (
    <Svg width={240} height={200} viewBox="0 0 240 200">
      <Defs>
        <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#BE123C" />
        </LinearGradient>
        <LinearGradient id="boxBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="100%" stopColor="#0284C7" />
        </LinearGradient>
      </Defs>

      {/* Ambient Security Glow */}
      <Circle cx="120" cy="100" r="80" fill="#ECFDF5" opacity="0.6" />
      <Circle cx="120" cy="100" r="55" fill="#D1FAE5" opacity="0.4" />

      {/* Verified Dispatch Shield */}
      <Path
        d="M 120 30 Q 165 35 175 65 Q 175 125 120 162 Q 65 125 65 65 Q 75 35 120 30 Z"
        fill="url(#shieldGrad)"
        stroke="#FFFFFF"
        strokeWidth="3"
      />

      {/* Inner White Shield Inset */}
      <Path
        d="M 120 42 Q 155 46 162 70 Q 162 116 120 148 Q 78 116 78 70 Q 85 46 120 42 Z"
        fill="#FFFFFF"
        opacity="0.15"
      />

      {/* Verified Parcel Icon in Center */}
      <Rect x="100" y="70" width="40" height="38" rx="6" fill="#FFFFFF" />
      <Line x1="120" y1="70" x2="120" y2="108" stroke="#F43F5E" strokeWidth="2.5" />
      <Line x1="100" y1="89" x2="140" y2="89" stroke="#F43F5E" strokeWidth="2.5" />

      {/* Floating Green Verification Badge */}
      <G transform="translate(150, 115)">
        <Circle cx="0" cy="0" r="16" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
        <Path
          d="M -6 0 L -1 5 L 7 -4"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>

      {/* Contactless Signal Waves */}
      <Path d="M 68 40 Q 55 52 55 70" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <Path d="M 60 32 Q 44 48 44 70" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" fill="none" />
    </Svg>
  );
}

// Exact 4 slides data model requested by user
const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Fastest Delivery Routes',
    subtitle:
      'Smart graph algorithm engine designed to bypass city congestion and deliver parcels in record time.',
    iconName: 'Navigation',
    tag: 'ROUTING ENGINE',
    Graphic: Slide1Graphic,
  },
  {
    id: '2',
    title: 'Real-Time Fleet Tracking',
    subtitle:
      'Monitor delivery couriers and package milestones with live GPS updates and turn-by-turn precision.',
    iconName: 'MapPin',
    tag: 'LIVE TELEMETRY',
    Graphic: Slide2Graphic,
  },
  {
    id: '3',
    title: 'Intelligent Sorting Hubs',
    subtitle:
      'Connect central warehouses to local neighborhood hubs using minimum-cost network optimization.',
    iconName: 'Boxes',
    tag: 'HUB LOGISTICS',
    Graphic: Slide3Graphic,
  },
  {
    id: '4',
    title: 'Instant Digital Dispatch',
    subtitle:
      'Automated package verification, cashless settlements, and verified contactless delivery handovers.',
    iconName: 'ShieldCheck',
    tag: 'SECURE DISPATCH',
    Graphic: Slide4Graphic,
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Sync FlatList scrolling whenever currentIndex changes
  const goToSlide = (newIndex) => {
    if (newIndex >= 0 && newIndex < ONBOARDING_DATA.length) {
      setCurrentIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleNext = () => {
    if (currentIndex < 3) {
      goToSlide(currentIndex + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar: Skip button */}
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <TouchableOpacity
          onPress={onFinish}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Carousel Area */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => {
          const GraphicComponent = item.Graphic;
          return (
            <View style={styles.slide}>
              {/* Vector Illustration */}
              <View style={styles.graphicContainer}>
                <GraphicComponent />
              </View>

              {/* Tag Badge */}
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Controls Section */}
      <View style={styles.bottomSection}>
        {/* Next / Prev Chevrons & 4 Pagination Dots */}
        <View style={styles.paginationRow}>
          {/* Left chevron (<) */}
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIndex === 0}
            activeOpacity={0.7}
            style={[
              styles.navArrow,
              currentIndex === 0 && styles.navArrowDisabled,
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={currentIndex === 0 ? '#CBD5E1' : '#0F172A'}
            />
          </TouchableOpacity>

          {/* 4 Pagination Dots with Active Coral-Red Pill */}
          <View style={styles.dotsGroup}>
            {ONBOARDING_DATA.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    isActive ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* Right chevron (>) */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex === 3}
            activeOpacity={0.7}
            style={[
              styles.navArrow,
              currentIndex === 3 && styles.navArrowDisabled,
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={currentIndex === 3 ? '#CBD5E1' : '#0F172A'}
            />
          </TouchableOpacity>
        </View>

        {/* Pathao-Style Primary Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.actionButtonText}>
            {currentIndex === 3 ? 'Get started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  topBarSpacer: {
    width: 48,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  graphicContainer: {
    width: '100%',
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F43F5E',
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 12,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.4,
  },
  dotsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#F43F5E', // Active Coral-Red pill
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#E2E8F0',
  },
  actionButton: {
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
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
