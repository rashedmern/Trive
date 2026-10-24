import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Colors,
  CardGradients,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
  Shadows,
} from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";
import { SlideToConfirm } from "@/components/feedback/SlideToConfirm";
import {
  fetchOrderDetailsFromDB,
  updateParcelStatusInDB,
} from "@/db/parcels";
import type { Order } from "@/types/delivery";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const rawId = params.id ? decodeURIComponent(params.id) : "#F165G258";
  const trackingId = rawId || "#F165G258";

  const [orderData, setOrderData] = React.useState<Order | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    void fetchOrderDetailsFromDB(trackingId).then((res) => {
      if (isMounted && res) {
        setOrderData(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [trackingId]);

  const handleBack = () => {
    void triggerHaptic.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as never);
    }
  };

  const handlePickupConfirmed = () => {
    void triggerHaptic.heavy();
    void updateParcelStatusInDB(trackingId, "in_delivery");
    router.push({
      pathname: "/driver/navigation",
      params: { parcelId: trackingId },
    } as never);
  };

  const handleCall = () => {
    void triggerHaptic.medium();
    void Linking.openURL("tel:+8801700000000");
  };

  const handleChat = () => {
    void triggerHaptic.selection();
    Alert.alert(
      "Live Chat",
      "Connecting with customer Emily Carter. Send quick arrival update?"
    );
  };

  const [fromColor, toColor] = CardGradients.green;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.neutral900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity
          style={styles.shareButton}
          activeOpacity={0.7}
          onPress={() => {
            void triggerHaptic.light();
            Alert.alert("Share Order", `Tracking URL for ${trackingId} copied.`);
          }}
        >
          <Ionicons name="share-social-outline" size={20} color={Colors.neutral900} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Green Gradient Card (#F165G258) ── */}
        <View
          style={[
            styles.gradientCard,
            { backgroundColor: fromColor, ...Shadows.card },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.trackingNumber}>{trackingId}</Text>
              <Text style={styles.cardSubText}>Domestic Express Corridor</Text>
            </View>
            <View style={[styles.parcelGraphic, { backgroundColor: toColor }]}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={38}
                color={Colors.neutral900}
              />
            </View>
          </View>

          <View style={styles.statusBadgeRow}>
            <View style={styles.vanStatusBadge}>
              <Ionicons name="car" size={13} color={Colors.neutral900} />
              <Text style={styles.vanStatusText}>Looking for Courier</Text>
            </View>
            <View style={styles.dsaPulseBadge}>
              <View style={styles.greenPulseDot} />
              <Text style={styles.dsaPulseText}>BFS Radar Active</Text>
            </View>
          </View>
        </View>

        {/* ── Specifications Table ── */}
        <View style={styles.specsCard}>
          <Text style={styles.sectionHeader}>SPECIFICATIONS</Text>

          <View style={styles.specRow}>
            <Text style={styles.specKey}>Service</Text>
            <Text style={styles.specVal}>
              {orderData?.spec.service || "Express Parcel"}
            </Text>
          </View>
          <View style={styles.tableDivider} />

          <View style={styles.specRow}>
            <Text style={styles.specKey}>Receiver</Text>
            <Text style={styles.specVal}>
              {orderData?.spec.receiver || "Emily Carter"}
            </Text>
          </View>
          <View style={styles.tableDivider} />

          <View style={styles.specRow}>
            <Text style={styles.specKey}>Address</Text>
            <Text style={[styles.specVal, { maxWidth: "60%" }]} numberOfLines={2}>
              {orderData?.spec.address || "2210 Coral Way, Apt 3C (Dhaka Hub)"}
            </Text>
          </View>
          <View style={styles.tableDivider} />

          <View style={styles.specRow}>
            <Text style={styles.specKey}>Package Type</Text>
            <Text style={styles.specVal}>
              {orderData?.spec.packageType || "Fragile Merchandise (1.8 kg)"}
            </Text>
          </View>
          <View style={styles.tableDivider} />

          <View style={styles.specRow}>
            <Text style={styles.specKey}>Payment Method</Text>
            <Text style={[styles.specVal, { color: "#059669" }]}>
              {orderData?.spec.paymentMethod || "Cash on Delivery (৳250)"}
            </Text>
          </View>
        </View>

        {/* ── Handling Notes Box ── */}
        <View style={styles.handlingBox}>
          <View style={styles.handlingHeader}>
            <Ionicons name="warning" size={16} color="#D97706" />
            <Text style={styles.handlingTitle}>Handling Notes</Text>
          </View>
          <Text style={styles.handlingBody}>
            {orderData?.spec.handlingNote ||
              "Please ensure the package is handled with care - fragile items inside."}
          </Text>
        </View>

        {/* ── Reanimated SlideToConfirm Slider ── */}
        <View style={styles.sliderContainer}>
          <SlideToConfirm
            onConfirm={handlePickupConfirmed}
            label="Slide to pick up the order"
          />
        </View>

        {/* ── Action Footer ── */}
        <View style={styles.actionFooter}>
          <TouchableOpacity
            style={styles.contactSupportPill}
            activeOpacity={0.8}
            onPress={() => {
              void triggerHaptic.selection();
              Alert.alert(
                "Support Hotline",
                "Calling 24/7 Trive Courier Dispatch Coordinator."
              );
            }}
          >
            <Ionicons
              name="help-buoy-outline"
              size={18}
              color={Colors.neutral900}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.supportPillText}>Contact support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            activeOpacity={0.75}
            onPress={handleChat}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={Colors.neutral900}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            activeOpacity={0.75}
            onPress={handleCall}
          >
            <Ionicons name="call-outline" size={20} color={Colors.neutral900} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  gradientCard: {
    borderRadius: Radius.card,
    padding: Spacing.xl,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  trackingNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.neutral900,
    letterSpacing: 0.5,
  },
  cardSubText: {
    fontSize: FontSize.xs,
    color: Colors.neutral600,
    marginTop: 2,
  },
  parcelGraphic: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vanStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  vanStatusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  dsaPulseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16A34A",
  },
  dsaPulseText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.neutral800,
  },
  specsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.neutral100,
    ...Shadows.sm,
  },
  sectionHeader: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral400,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  specKey: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
  },
  specVal: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    textAlign: "right",
  },
  tableDivider: {
    height: 1,
    backgroundColor: Colors.neutral100,
    marginVertical: Spacing.xs,
  },
  handlingBox: {
    backgroundColor: "#FFFBEB",
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 4,
  },
  handlingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  handlingTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: "#B45309",
  },
  handlingBody: {
    fontSize: FontSize.xs,
    color: "#92400E",
    fontStyle: "italic",
    lineHeight: 18,
  },
  sliderContainer: {
    marginTop: Spacing.xs,
  },
  actionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: Spacing.xs,
  },
  contactSupportPill: {
    flex: 1,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  supportPillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  iconCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
});
