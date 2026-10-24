import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
  Shadows,
} from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";
import { useNotificationBellSound } from "@/utils/audio";
import { setHasSeenOnboarding } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { play: playBellSound } = useNotificationBellSound();
  const { signOut } = useAuth();

  // Preferences state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [fragileDefault, setFragileDefault] = useState(true);
  const [isCourierMode, setIsCourierMode] = useState(false);

  const handleToggleSound = (val: boolean) => {
    setSoundEnabled(val);
    if (val) {
      void playBellSound();
    }
    if (hapticsEnabled) {
      void triggerHaptic.light();
    }
  };

  const handleToggleHaptics = (val: boolean) => {
    setHapticsEnabled(val);
    if (val) {
      void triggerHaptic.success();
    }
  };

  const handleToggleFragile = (val: boolean) => {
    setFragileDefault(val);
    if (hapticsEnabled) {
      void triggerHaptic.selection();
    }
  };

  const handleToggleCourierMode = () => {
    const next = !isCourierMode;
    setIsCourierMode(next);
    if (hapticsEnabled) {
      void triggerHaptic.medium();
    }
  };

  const handleReplayOnboarding = async () => {
    if (hapticsEnabled) {
      void triggerHaptic.medium();
    }
    await setHasSeenOnboarding(false);
    router.replace("/onboarding" as never);
  };

  const handleLogOut = async () => {
    if (hapticsEnabled) {
      void triggerHaptic.heavy();
    }
    await signOut();
    await setHasSeenOnboarding(false);
    router.replace("/onboarding" as never);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ── Top Header ── */}
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>Settings & Account</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (hapticsEnabled) void triggerHaptic.light();
          }}
          style={styles.headerIconButton}
        >
          <Ionicons name="qr-code-outline" size={20} color={Colors.neutral900} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 115 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Hero Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarBubble}>
              <Ionicons name="person" size={28} color={Colors.surface} />
              <View style={styles.verifiedCheck}>
                <Ionicons name="checkmark" size={10} color={Colors.surface} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  Emily Carter
                </Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={styles.ratingText}>4.98</Text>
                </View>
              </View>

              <Text style={styles.userPhone} numberOfLines={1}>
                +1 (305) 555-0198
              </Text>

              <View style={styles.addressRow}>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={Colors.neutral500}
                />
                <Text style={styles.userAddress} numberOfLines={1}>
                  2210 Coral Way, Apt 3C
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileFooter}>
            <View style={styles.statsCol}>
              <Text style={styles.statsValue}>142</Text>
              <Text style={styles.statsLabel}>Deliveries</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsCol}>
              <Text style={styles.statsValue}>Level 3</Text>
              <Text style={styles.statsLabel}>Gold Member</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsCol}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (hapticsEnabled) void triggerHaptic.light();
                }}
                style={styles.editProfileBtn}
              >
                <Text style={styles.editProfileText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Courier Mode Switch Banner ── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleToggleCourierMode}
          style={[
            styles.courierBanner,
            isCourierMode && styles.courierBannerActive,
          ]}
        >
          <View style={styles.courierBannerLeft}>
            <View style={styles.courierIconBox}>
              <MaterialCommunityIcons
                name="moped-electric"
                size={22}
                color={isCourierMode ? Colors.surface : Colors.surfaceDark}
              />
            </View>
            <View style={styles.courierTextCol}>
              <Text
                style={[
                  styles.courierBannerTitle,
                  isCourierMode && { color: Colors.surface },
                ]}
                numberOfLines={1}
              >
                {isCourierMode ? "Active Courier Mode" : "Switch to Courier Mode"}
              </Text>
              <Text
                style={[
                  styles.courierBannerSub,
                  isCourierMode && { color: "rgba(255,255,255,0.7)" },
                ]}
                numberOfLines={2}
              >
                {isCourierMode
                  ? "Receiving dispatch orders • Dijkstra Engine"
                  : "Deliver packages and earn with Trive"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.courierSwitchPill,
              isCourierMode && { backgroundColor: Colors.accentPink },
            ]}
          >
            <Text style={styles.courierSwitchText}>
              {isCourierMode ? "ONLINE" : "OFFLINE"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── Section: App Preferences ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>PREFERENCES & AUDIO</Text>

          {/* Bell Sound */}
          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: "#DCFCE7" }]}>
                <Ionicons name="notifications" size={17} color="#15803D" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  Bell Chime Sound
                </Text>
                <Text style={styles.prefSub} numberOfLines={2}>
                  Play audio chime on order notifications
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: Colors.neutral200, true: Colors.accentPink }}
              thumbColor={Colors.surface}
            />
          </View>

          {/* Haptic Touch */}
          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: "#FFE4E6" }]}>
                <MaterialCommunityIcons
                  name="vibrate"
                  size={17}
                  color={Colors.accentPink}
                />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  Haptic Touch Feedback
                </Text>
                <Text style={styles.prefSub} numberOfLines={2}>
                  Physical vibrations for swipe & confirmations
                </Text>
              </View>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: Colors.neutral200, true: Colors.accentPink }}
              thumbColor={Colors.surface}
            />
          </View>

          {/* Fragile Handling */}
          <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: "#FEF3C7" }]}>
                <Feather name="shield" size={17} color="#B45309" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  Default Fragile Care
                </Text>
                <Text style={styles.prefSub} numberOfLines={2}>
                  Always prompt couriers for delicate handling
                </Text>
              </View>
            </View>
            <Switch
              value={fragileDefault}
              onValueChange={handleToggleFragile}
              trackColor={{ false: Colors.neutral200, true: Colors.accentPink }}
              thumbColor={Colors.surface}
            />
          </View>
        </View>

        {/* ── Section: Payment Methods ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>PAYMENT METHODS</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (hapticsEnabled) void triggerHaptic.light();
            }}
            style={styles.prefRow}
          >
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="card" size={17} color="#4338CA" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  Visa Card •••• 4242
                </Text>
                <Text style={styles.prefSub} numberOfLines={1}>
                  Default payment • Exp. 08/28
                </Text>
              </View>
            </View>
            <View style={styles.activeCheckPill}>
              <Text style={styles.activeCheckText}>DEFAULT</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (hapticsEnabled) void triggerHaptic.light();
            }}
            style={[styles.prefRow, { borderBottomWidth: 0 }]}
          >
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: Colors.neutral100 }]}>
                <Ionicons name="cash-outline" size={17} color={Colors.neutral700} />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  Cash on Delivery
                </Text>
                <Text style={styles.prefSub} numberOfLines={1}>
                  Pay courier directly upon handover
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.neutral400}
            />
          </TouchableOpacity>
        </View>

        {/* ── Section: App & Support ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>SYSTEM & SUPPORT</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReplayOnboarding}
            style={styles.prefRow}
          >
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: "#F3E8FF" }]}>
                <Ionicons name="compass-outline" size={17} color="#7E22CE" />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  App Walkthrough
                </Text>
                <Text style={styles.prefSub} numberOfLines={1}>
                  Replay welcome onboarding tour
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.neutral400}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (hapticsEnabled) void triggerHaptic.light();
            }}
            style={[styles.prefRow, { borderBottomWidth: 0 }]}
          >
            <View style={styles.prefLeft}>
              <View style={[styles.prefIconBubble, { backgroundColor: Colors.neutral100 }]}>
                <Ionicons name="headset-outline" size={17} color={Colors.neutral700} />
              </View>
              <View style={styles.prefTextCol}>
                <Text style={styles.prefTitle} numberOfLines={1}>
                  Support & Live Chat
                </Text>
                <Text style={styles.prefSub} numberOfLines={1}>
                  24/7 dedicated courier & parcel support
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.neutral400}
            />
          </TouchableOpacity>
        </View>

        {/* ── Log Out Button ── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLogOut}
          style={styles.logoutButton}
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#EF4444"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version info footer */}
        <Text style={styles.versionFooter}>
          Trive Logistics v1.0.0 • Expo SDK 57 • C++17 Graph Engine
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    letterSpacing: -0.5,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral100,
    ...Shadows.card,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBubble: {
    position: "relative",
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  verifiedCheck: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: "#B45309",
    marginLeft: 3,
  },
  userPhone: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  userAddress: {
    fontSize: FontSize.xs,
    color: Colors.neutral600,
    marginLeft: 3,
    flex: 1,
  },
  profileFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
  },
  statsCol: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  statsValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  statsLabel: {
    fontSize: 10,
    color: Colors.neutral400,
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral200,
  },
  editProfileBtn: {
    backgroundColor: Colors.neutral100,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editProfileText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral700,
  },
  courierBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#DCFCE7",
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    ...Shadows.sm,
  },
  courierBannerActive: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.surfaceDark,
  },
  courierBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  courierIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  courierTextCol: {
    flex: 1,
  },
  courierBannerTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: "#15803D",
  },
  courierBannerSub: {
    fontSize: 10,
    color: "#166534",
    marginTop: 2,
    lineHeight: 14,
  },
  courierSwitchPill: {
    backgroundColor: "#16A34A",
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  courierSwitchText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  sectionContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral100,
    ...Shadows.card,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.neutral400,
    letterSpacing: 0.8,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  prefLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  prefIconBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  prefTextCol: {
    flex: 1,
  },
  prefTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral900,
  },
  prefSub: {
    fontSize: 11,
    color: Colors.neutral500,
    marginTop: 1,
    lineHeight: 15,
  },
  activeCheckPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  activeCheckText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: "#15803D",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: Radius.pill,
    paddingVertical: 14,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: "#EF4444",
  },
  versionFooter: {
    fontSize: 10,
    color: Colors.neutral400,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 8,
  },
});
