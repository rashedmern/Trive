import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, CardGradients, Shadows, Radius, Spacing, FontSize, FontWeight } from "@/constants/theme";
import type { DeliveryItem, ServiceItem } from "@/types/delivery";
import { triggerHaptic } from "@/utils/haptics";
import { useNotificationBellSound } from "@/utils/audio";
import { useAuth } from "@/context/AuthContext";
import { setHasSeenOnboarding } from "@/utils/storage";
import { setModalActive } from "@/utils/modalState";
import { CreateParcelModal } from "@/components/modals/CreateParcelModal";
import { ShippingCalculatorModal } from "@/components/modals/ShippingCalculatorModal";
import { ReceiptsModal } from "@/components/modals/ReceiptsModal";
import { SupportModal } from "@/components/modals/SupportModal";
import { BarcodeScannerModal } from "@/components/modals/BarcodeScannerModal";

import {
  fetchParcelsFromDB,
  insertParcelToDB,
  FALLBACK_DELIVERIES,
  FALLBACK_HISTORY,
} from "@/db/parcels";

const SERVICES: ServiceItem[] = [
  { id: "create",    label: "Create",    iconName: "cube-outline"        },
  { id: "calculate", label: "Calculate", iconName: "calculator-outline"  },
  { id: "receipts",  label: "Receipts",  iconName: "receipt-outline"     },
  { id: "support",   label: "Support",   iconName: "headset-outline"     },
];

const STATUS_LABELS: Record<string, string> = {
  looking_for_courier: "Looking for Courier",
  in_delivery:         "In Delivery",
  received:            "Received",
  in_transit:          "In Transit",
  pending:             "Pending",
};

// ── Delivery Card ────────────────────────────────────────────────
function DeliveryCard({
  item,
  onPress,
}: {
  item: DeliveryItem;
  onPress: (id: string) => void;
}) {
  const [fromColor, toColor] = CardGradients[item.cardColor];
  const isReceived = item.status === "received";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(item.id)}
      style={[
        styles.deliveryCard,
        { backgroundColor: fromColor, ...Shadows.card },
      ]}
    >
      <View style={styles.deliveryCardContent}>
        <Text style={styles.trackingId}>{item.id}</Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Ionicons
              name={isReceived ? "checkmark-outline" : "car-outline"}
              size={11}
              color={Colors.neutral900}
            />
            <Text style={styles.statusText}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.arrivalRow}>
          <Text style={styles.arrivalLabel}>Arrival</Text>
          <Text style={styles.arrivalTime}>{item.arrivalTime}</Text>
        </View>
      </View>

      {/* 3D Package Illustration */}
      <View style={[styles.packageIcon, { backgroundColor: toColor }]}>
        <MaterialCommunityIcons
          name="package-variant-closed"
          size={34}
          color={Colors.neutral900}
        />
      </View>
    </TouchableOpacity>
  );
}

// ── Service Grid Item ─────────────────────────────────────────────
function ServiceGridItem({
  item,
  onPress,
}: {
  item: ServiceItem;
  onPress: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.serviceItem}
      onPress={() => onPress(item.id)}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <View style={styles.serviceIconBox}>
        <Ionicons
          name={item.iconName as keyof typeof Ionicons.glyphMap}
          size={22}
          color={Colors.neutral900}
        />
      </View>
      <Text style={styles.serviceLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
}

// ── History Row ───────────────────────────────────────────────────
function HistoryRow({
  item,
  onPress,
}: {
  item: DeliveryItem;
  onPress: (id: string) => void;
}) {
  const [fromColor] = CardGradients[item.cardColor];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item.id)}
      style={[styles.historyRow, { backgroundColor: fromColor, ...Shadows.card }]}
    >
      <View style={styles.historyLeft}>
        <Text style={styles.historyId}>{item.id}</Text>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-outline" size={11} color={Colors.neutral900} />
          <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
        </View>
        <View style={styles.arrivalRow}>
          <Text style={styles.arrivalLabel}>Arrival</Text>
          <Text style={styles.arrivalTime}>{item.arrivalTime}</Text>
        </View>
      </View>
      <View style={styles.historyPackageIcon}>
        <MaterialCommunityIcons name="package-variant-closed" size={28} color={Colors.neutral900} />
      </View>
    </TouchableOpacity>
  );
}

// ── Main Dashboard Screen ─────────────────────────────────────────
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(FALLBACK_DELIVERIES);
  const [history, setHistory] = useState<DeliveryItem[]>(FALLBACK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, _setActiveModal] = useState<
    "create" | "calculate" | "receipts" | "support" | "scanner" | null
  >(null);

  const setActiveModal = (
    modal: "create" | "calculate" | "receipts" | "support" | "scanner" | null
  ) => {
    _setActiveModal(modal);
    setModalActive(modal !== null);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      void fetchParcelsFromDB().then((res) => {
        if (isMounted) {
          setDeliveries(res.active);
          setHistory(res.history);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const { play: playBellSound } = useNotificationBellSound();
  const { user, signOut } = useAuth();

  const handleToggleNotification = async () => {
    const nextState = !isNotificationOn;
    setIsNotificationOn(nextState);
    if (nextState) {
      void playBellSound();
      void triggerHaptic.success();
    } else {
      void triggerHaptic.light();
    }
  };

  const handleSignOut = async () => {
    void triggerHaptic.heavy();
    await signOut();
    await setHasSeenOnboarding(false);
    router.replace("/onboarding" as never);
  };

  const handleOpenOrder = (id: string) => {
    void triggerHaptic.light();
    router.push(`/order/${encodeURIComponent(id)}` as never);
  };

  const handleServiceClick = (serviceId: string) => {
    void triggerHaptic.selection();
    if (serviceId === "create") {
      router.push("/order/create" as never);
    } else if (serviceId === "calculate") {
      setActiveModal("calculate");
    } else if (serviceId === "receipts") {
      setActiveModal("receipts");
    } else if (serviceId === "support") {
      setActiveModal("support");
    }
  };

  const handleParcelCreated = async (
    newParcel: DeliveryItem,
    receiverName?: string,
    receiverPhone?: string
  ) => {
    setDeliveries((prev) => [newParcel, ...prev]);
    await insertParcelToDB(newParcel, receiverName, receiverPhone);
  };

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.display_name as string) ||
    "Emily Carter";

  const filteredDeliveries = deliveries.filter((d) =>
    searchQuery
      ? d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        STATUS_LABELS[d.status]?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const filteredHistory = history.filter((d) =>
    searchQuery
      ? d.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 115 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/account" as never)}
            style={styles.headerLeft}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={Colors.surface} />
            </View>
            <View>
              <Text style={styles.userName}>{displayName}</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={11} color={Colors.neutral500} />
                <Text style={styles.userAddress}>2210 Coral Way, Apt 3C</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.bellButton}
              onPress={handleSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign Out"
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.bellButton}
              onPress={handleToggleNotification}
              accessibilityRole="button"
              accessibilityLabel={isNotificationOn ? "Disable notifications" : "Enable notifications"}
            >
              <Ionicons
                name={isNotificationOn ? "notifications" : "notifications-outline"}
                size={22}
                color={isNotificationOn ? Colors.accentPink : Colors.neutral900}
              />
              {isNotificationOn && (
                <View
                  style={{
                    position: "absolute",
                    top: 9,
                    right: 9,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: Colors.accentPink,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color={Colors.neutral400} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Track your shipment..."
            placeholderTextColor={Colors.neutral400}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              void triggerHaptic.light();
              setActiveModal("scanner");
            }}
          >
            <Ionicons name="scan-outline" size={20} color={Colors.neutral700} />
          </TouchableOpacity>
        </View>

        {/* ── Current Deliveries ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Deliveries</Text>
        </View>
        <FlatList
          data={filteredDeliveries}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.pageH, gap: Spacing.gap }}
          renderItem={({ item }) => (
            <DeliveryCard item={item} onPress={handleOpenOrder} />
          )}
        />

        {/* ── Services Grid ── */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.section }]}>
          <Text style={styles.sectionTitle}>Services</Text>
        </View>
        <View style={styles.servicesGrid}>
          {SERVICES.map((s) => (
            <ServiceGridItem
              key={s.id}
              item={s}
              onPress={handleServiceClick}
            />
          ))}
        </View>

        {/* ── Delivery History ── */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.section }]}>
          <Text style={styles.sectionTitle}>Delivery History</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/parcels" as never)}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: Spacing.pageH, gap: Spacing.gap }}>
          {filteredHistory.map((item) => (
            <HistoryRow
              key={item.id}
              item={item}
              onPress={handleOpenOrder}
            />
          ))}
        </View>

      </ScrollView>

      {/* ── Modals for Microservices ── */}
      {activeModal === "create" && (
        <CreateParcelModal
          visible={true}
          onClose={() => setActiveModal(null)}
          onParcelCreated={handleParcelCreated}
        />
      )}

      {activeModal === "calculate" && (
        <ShippingCalculatorModal
          visible={true}
          onClose={() => setActiveModal(null)}
          onSelectRate={() => {
            setActiveModal(null);
            router.push("/order/create" as never);
          }}
        />
      )}

      {activeModal === "receipts" && (
        <ReceiptsModal
          visible={true}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "support" && (
        <SupportModal
          visible={true}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "scanner" && (
        <BarcodeScannerModal
          visible={true}
          onClose={() => setActiveModal(null)}
          onScanSuccess={handleOpenOrder}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.pageH,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 1 },
  userAddress: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    fontWeight: FontWeight.medium,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.pageH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    ...Shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.neutral900,
  },

  // Sections
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.pageH,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
    fontWeight: FontWeight.medium,
  },

  // Delivery Card
  deliveryCard: {
    width: 236,
    borderRadius: Radius.card,
    padding: Spacing.cardP,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  deliveryCardContent: { flex: 1, gap: 6 },
  trackingId: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Colors.neutral900,
    letterSpacing: -0.4,
  },
  statusRow: { gap: 2 },
  statusLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.neutral500,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral900,
  },
  arrivalRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  arrivalLabel: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    fontWeight: FontWeight.medium,
  },
  arrivalTime: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  // Services Grid
  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.pageH,
  },
  serviceItem: { alignItems: "center", gap: 6 },
  serviceIconBox: {
    width: 60,
    height: 60,
    borderRadius: Radius.service,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  serviceLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.neutral700,
  },

  // History Row
  historyRow: {
    borderRadius: Radius.card,
    padding: Spacing.cardP,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  historyLeft: { flex: 1, gap: 6 },
  historyId: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.neutral900,
    letterSpacing: -0.5,
  },
  historyPackageIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
