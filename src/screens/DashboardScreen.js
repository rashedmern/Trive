import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
  Ellipse,
} from 'react-native-svg';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// 3D Coral-Red Isometric Parcel Box
function CoralParcelGraphic({ size = 72 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDA4AF" />
          <Stop offset="100%" stopColor="#FB7185" />
        </LinearGradient>
        <LinearGradient id="leftFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FB7185" />
          <Stop offset="100%" stopColor="#F43F5E" />
        </LinearGradient>
        <LinearGradient id="rightFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F43F5E" />
          <Stop offset="100%" stopColor="#BE123C" />
        </LinearGradient>
      </Defs>

      {/* Shadow Under Box */}
      <Ellipse cx="50" cy="85" rx="36" ry="10" fill="#FDA4AF" opacity="0.45" />

      {/* Isometric 3D Cube */}
      {/* Top Face */}
      <Path d="M 50 20 L 82 38 L 50 56 L 18 38 Z" fill="url(#topFace)" />

      {/* White Tape on Top Face */}
      <Path d="M 45 23 L 55 29 L 55 53 L 45 47 Z" fill="#FFFFFF" opacity="0.85" />
      <Path d="M 34 29 L 66 47 L 61 50 L 29 32 Z" fill="#FFFFFF" opacity="0.85" />

      {/* Left Face */}
      <Path d="M 18 38 L 50 56 L 50 82 L 18 64 Z" fill="url(#leftFace)" />

      {/* White Tape on Left Face */}
      <Path d="M 45 53 L 50 56 L 50 82 L 45 79 Z" fill="#FFFFFF" opacity="0.85" />

      {/* Right Face */}
      <Path d="M 50 56 L 82 38 L 82 64 L 50 82 Z" fill="url(#rightFace)" />

      {/* White Tape on Right Face */}
      <Path d="M 50 56 L 55 53 L 55 79 L 50 82 Z" fill="#FFFFFF" opacity="0.85" />

      {/* Barcode / Shipping Label on Right Face */}
      <Rect
        x="60"
        y="50"
        width="14"
        height="9"
        rx="2"
        fill="#FFFFFF"
        transform="skewY(-28)"
      />
    </Svg>
  );
}

// 3D Warm Amber/Cardboard Isometric Box
function AmberParcelGraphic({ size = 56 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="amberTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE68A" />
          <Stop offset="100%" stopColor="#FCD34D" />
        </LinearGradient>
        <LinearGradient id="amberLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F59E0B" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
        <LinearGradient id="amberRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#D97706" />
          <Stop offset="100%" stopColor="#B45309" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="50" cy="85" rx="34" ry="9" fill="#FDE68A" opacity="0.5" />
      <Path d="M 50 22 L 80 39 L 50 56 L 20 39 Z" fill="url(#amberTop)" />
      <Path d="M 20 39 L 50 56 L 50 80 L 20 63 Z" fill="url(#amberLeft)" />
      <Path d="M 50 56 L 80 39 L 80 63 L 50 80 Z" fill="url(#amberRight)" />

      {/* Seal Ribbon */}
      <Path d="M 46 24 L 54 29 L 54 77 L 46 72 Z" fill="#78350F" opacity="0.75" />
    </Svg>
  );
}

// 3D Blue-Gray Delivered Parcel Box
function SteelParcelGraphic({ size = 56 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="steelTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#E2E8F0" />
          <Stop offset="100%" stopColor="#CBD5E1" />
        </LinearGradient>
        <LinearGradient id="steelLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#94A3B8" />
          <Stop offset="100%" stopColor="#64748B" />
        </LinearGradient>
        <LinearGradient id="steelRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#64748B" />
          <Stop offset="100%" stopColor="#475569" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="50" cy="85" rx="34" ry="9" fill="#CBD5E1" opacity="0.4" />
      <Path d="M 50 22 L 80 39 L 50 56 L 20 39 Z" fill="url(#steelTop)" />
      <Path d="M 20 39 L 50 56 L 50 80 L 20 63 Z" fill="url(#steelLeft)" />
      <Path d="M 50 56 L 80 39 L 80 63 L 50 80 Z" fill="url(#steelRight)" />

      {/* Green Check Seal */}
      <Circle cx="64" cy="50" r="10" fill="#10B981" />
      <Path d="M 60 50 L 63 53 L 69 47" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export default function DashboardScreen({ onSelectOrder }) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenOrder = () => {
    if (onSelectOrder) {
      onSelectOrder('#CB1AD25');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOP PROFILE HEADER */}
        <View style={styles.header}>
          {/* Left Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
              <Text style={styles.avatarInitials}>EC</Text>
            </View>
          </View>

          {/* Middle Column: Name & Address */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Emily Carter</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-sharp" size={13} color="#F43F5E" />
              <Text style={styles.addressText} numberOfLines={1}>
                2210 Coral Way, Apt 3C
              </Text>
            </View>
          </View>

          {/* Right: Circular Bell Button with Red Badge */}
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.75}>
            <Feather name="bell" size={19} color="#0F172A" />
            <View style={styles.unreadBadge} />
          </TouchableOpacity>
        </View>

        {/* 2. SHIPMENT SEARCH BAR */}
        <View style={styles.searchBarContainer}>
          <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Track your shipment..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.scanButton} activeOpacity={0.7}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* 3. "CURRENT DELIVERIES" SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Deliveries</Text>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>1 Active</Text>
          </View>
        </View>

        {/* Active Parcel Card (Soft pastel pink) */}
        <TouchableOpacity
          style={styles.activeCard}
          onPress={handleOpenOrder}
          activeOpacity={0.92}
        >
          {/* Top Row: Tracking Code + White Circular Arrow Button */}
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.trackingLabel}>SHIPMENT ID</Text>
              <Text style={styles.trackingCode}>#CB1AD25</Text>
            </View>
            <View style={styles.arrowCircle}>
              <Ionicons name="chevron-forward" size={18} color="#0F172A" />
            </View>
          </View>

          {/* Middle Row: Status Badge with Red Dot + Arrival Time */}
          <View style={styles.cardMiddleRow}>
            <View style={styles.statusBadgeWhite}>
              <View style={styles.redDot} />
              <Text style={styles.statusBadgeText}>In Delivery</Text>
            </View>
            <Text style={styles.arrivalTimeText}>Arriving 12:05 PM</Text>
          </View>

          {/* Bottom Row: Courier En Route Pill + 3D Parcel Illustration */}
          <View style={styles.cardBottomRow}>
            <View style={styles.courierCapsule}>
              <Text style={styles.courierEmoji}>🚚</Text>
              <Text style={styles.courierCapsuleText}>Courier en route</Text>
            </View>
            <View style={styles.parcelGraphicBox}>
              <CoralParcelGraphic size={82} />
            </View>
          </View>
        </TouchableOpacity>

        {/* 4. "SERVICES" ROW */}
        <View style={styles.servicesRow}>
          {/* 1. Create */}
          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.75}>
            <View style={[styles.serviceIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="box" size={20} color="#2563EB" />
            </View>
            <Text style={styles.serviceName}>Create</Text>
          </TouchableOpacity>

          {/* 2. Calculate */}
          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.75}>
            <View style={[styles.serviceIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="calculator-outline" size={20} color="#16A34A" />
            </View>
            <Text style={styles.serviceName}>Calculate</Text>
          </TouchableOpacity>

          {/* 3. Receipts */}
          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.75}>
            <View style={[styles.serviceIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="file-text" size={20} color="#D97706" />
            </View>
            <Text style={styles.serviceName}>Receipts</Text>
          </TouchableOpacity>

          {/* 4. Support */}
          <TouchableOpacity style={styles.serviceCard} activeOpacity={0.75}>
            <View style={[styles.serviceIconCircle, { backgroundColor: '#FFE4E6' }]}>
              <Feather name="headphones" size={20} color="#F43F5E" />
            </View>
            <Text style={styles.serviceName}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* 5. "DELIVERY HISTORY" SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery History</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* History Card #1: Soft warm yellow */}
        <View style={styles.historyCardYellow}>
          <View style={styles.historyCardLeft}>
            <Text style={styles.historyTracking}>#A856K005</Text>
            <View style={styles.historyStatusRow}>
              <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              <Text style={styles.historyStatusText}>Received • 08:22 AM</Text>
            </View>
          </View>
          <AmberParcelGraphic size={54} />
        </View>

        {/* History Card #2: Soft blue-gray */}
        <View style={styles.historyCardBlue}>
          <View style={styles.historyCardLeft}>
            <Text style={styles.historyTracking}>#C418WS8</Text>
            <View style={styles.historyStatusRow}>
              <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              <Text style={styles.historyStatusText}>Received • Yesterday</Text>
            </View>
          </View>
          <SteelParcelGraphic size={54} />
        </View>

        {/* Padding for bottom dock */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 6. FLOATING BOTTOM NAVIGATION DOCK */}
      <View style={styles.dockWrapper}>
        <View style={styles.floatingDock}>
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={activeTab === 'home' ? '#FFFFFF' : '#94A3B8'}
            />
            {activeTab === 'home' && <View style={styles.activeDockDot} />}
          </TouchableOpacity>

          {/* Package Tab */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => {
              setActiveTab('packages');
              handleOpenOrder();
            }}
            activeOpacity={0.8}
          >
            <Feather
              name="box"
              size={22}
              color={activeTab === 'packages' ? '#FFFFFF' : '#94A3B8'}
            />
            {activeTab === 'packages' && <View style={styles.activeDockDot} />}
          </TouchableOpacity>

          {/* Map/Location Tab */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => {
              setActiveTab('map');
              handleOpenOrder();
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'map' ? 'navigate' : 'navigate-outline'}
              size={22}
              color={activeTab === 'map' ? '#FFFFFF' : '#94A3B8'}
            />
            {activeTab === 'map' && <View style={styles.activeDockDot} />}
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
          >
            <Feather
              name="user"
              size={22}
              color={activeTab === 'profile' ? '#FFFFFF' : '#94A3B8'}
            />
            {activeTab === 'profile' && <View style={styles.activeDockDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  // 1. Profile Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarGradient: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 3,
  },
  addressText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadBadge: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F43F5E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // 2. Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 9999,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 26,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  scanButton: {
    padding: 6,
  },

  // 3. Current Deliveries
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  activePill: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F43F5E',
  },
  activeCard: {
    backgroundColor: '#FFE4E6', // Soft pastel pink
    borderRadius: 26,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  trackingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F43F5E',
    letterSpacing: 1,
    marginBottom: 2,
  },
  trackingCode: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  statusBadgeWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 6,
  },
  redDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F43F5E',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  arrivalTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  courierCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  courierEmoji: {
    fontSize: 14,
  },
  courierCapsuleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  parcelGraphicBox: {
    marginBottom: -8,
    marginRight: -4,
  },

  // 4. Services Row
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 28,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  // 5. Delivery History
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F43F5E',
  },
  historyCardYellow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // Soft warm yellow
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  historyCardBlue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Soft blue-gray
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyCardLeft: {
    flex: 1,
  },
  historyTracking: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  historyStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  // 6. Floating Bottom Navigation Dock
  dockWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingDock: {
    width: 280,
    height: 58,
    borderRadius: 9999,
    backgroundColor: '#0F172A', // Dark charcoal
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  dockItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDockDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F43F5E',
  },
});
