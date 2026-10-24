import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Colors,
  CardGradients,
  Shadows,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
} from "@/constants/theme";
import type { DeliveryItem } from "@/types/delivery";
import { triggerHaptic } from "@/utils/haptics";
import { fetchParcelsFromDB } from "@/db/parcels";

// ── Sample Parcel Shipments ───────────────────────────────────────
const PARCEL_LIST: DeliveryItem[] = [
  {
    id: "#F165G258",
    status: "looking_for_courier",
    arrivalTime: "1:30 PM",
    cardColor: "green",
    origin: "Downtown Logistics Hub",
    destination: "2210 Coral Way, Apt 3C",
    weight: "2.4 kg",
    serviceType: "Express Parcel",
  },
  {
    id: "#CB1AD25",
    status: "in_delivery",
    arrivalTime: "12:05 PM",
    cardColor: "coral",
    origin: "Miami Airport Warehouse",
    destination: "1024 Ocean Dr, Suite 500",
    weight: "1.2 kg",
    serviceType: "Priority Courier",
  },
  {
    id: "#CA19WS8",
    status: "in_transit",
    arrivalTime: "3:15 PM",
    cardColor: "lavender",
    origin: "North Terminal Depot",
    destination: "742 Evergreen Terrace",
    weight: "4.8 kg",
    serviceType: "Standard Freight",
  },
  {
    id: "#A856K005",
    status: "received",
    arrivalTime: "08:22 AM",
    cardColor: "peach",
    origin: "Biscayne Distribution Ctr",
    destination: "2210 Coral Way, Apt 3C",
    weight: "0.8 kg",
    serviceType: "Same-Day Delivery",
  },
  {
    id: "#CA18WS8",
    status: "received",
    arrivalTime: "Yesterday",
    cardColor: "lavender",
    origin: "Brickell Delivery Station",
    destination: "440 West Flagler St",
    weight: "3.1 kg",
    serviceType: "Standard Cargo",
  },
];

type FilterType = "all" | "active" | "delivered";

export default function ParcelsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [parcels, setParcels] = useState<DeliveryItem[]>(PARCEL_LIST);

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      void fetchParcelsFromDB().then((res) => {
        if (isMounted) {
          const combined = [...res.active, ...res.history];
          const uniqueMap = new Map<string, DeliveryItem>();
          combined.forEach((item) => {
            if (!uniqueMap.has(item.id)) {
              uniqueMap.set(item.id, item);
            }
          });
          const list = Array.from(uniqueMap.values());
          if (list.length > 0) {
            setParcels(list);
          }
        }
      });
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      // Status filter
      if (selectedFilter === "active") {
        if (parcel.status === "received") return false;
      } else if (selectedFilter === "delivered") {
        if (parcel.status !== "received") return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        parcel.id.toLowerCase().includes(q) ||
        (parcel.destination?.toLowerCase().includes(q) ?? false) ||
        (parcel.origin?.toLowerCase().includes(q) ?? false) ||
        (parcel.serviceType?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [parcels, searchQuery, selectedFilter]);

  const activeCount = useMemo(() => {
    return parcels.filter((p) => p.status !== "received").length;
  }, [parcels]);

  const handleFilterChange = (filter: FilterType) => {
    void triggerHaptic.selection();
    setSelectedFilter(filter);
  };

  const getStatusBadge = (status: DeliveryItem["status"]) => {
    switch (status) {
      case "looking_for_courier":
        return { label: "Looking for Courier", color: "#15803D", bg: "#DCFCE7", icon: "cube-outline" };
      case "in_delivery":
        return { label: "Out for Delivery", color: "#BE123C", bg: "#FFE4E6", icon: "bicycle-outline" };
      case "in_transit":
        return { label: "In Transit", color: "#4338CA", bg: "#E0E7FF", icon: "airplane-outline" };
      case "received":
        return { label: "Delivered", color: "#B45309", bg: "#FEF3C7", icon: "checkmark-circle-outline" };
      default:
        return { label: "Processing", color: Colors.neutral700, bg: Colors.neutral100, icon: "time-outline" };
    }
  };

  const renderParcelCard = ({ item }: { item: DeliveryItem }) => {
    const gradient = CardGradients[item.cardColor];
    const badge = getStatusBadge(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          void triggerHaptic.light();
          router.push(`/order/${encodeURIComponent(item.id)}` as never);
        }}
        style={[styles.card, { backgroundColor: Colors.surface }]}
      >
        {/* Card Header Strip with Gradient Accent */}
        <View style={[styles.cardHeader, { backgroundColor: gradient[1] }]}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.packageIconBubble}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={22}
                color={Colors.surfaceDark}
              />
            </View>
            <View>
              <Text style={styles.trackingText}>{item.id}</Text>
              <Text style={styles.serviceTypeText}>{item.serviceType}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon as never} size={13} color={badge.color} style={{ marginRight: 4 }} />
            <Text style={[styles.statusBadgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        {/* Route Details */}
        <View style={styles.routeContainer}>
          {/* Origin */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <View style={styles.originDot} />
              <View style={styles.routeDottedLine} />
            </View>
            <View style={styles.routeTextCol}>
              <Text style={styles.routeLabel}>FROM</Text>
              <Text style={styles.routeName} numberOfLines={1}>
                {item.origin}
              </Text>
            </View>
          </View>

          {/* Destination */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <Ionicons name="location-sharp" size={16} color={Colors.accentPink} />
            </View>
            <View style={styles.routeTextCol}>
              <Text style={styles.routeLabel}>TO</Text>
              <Text style={styles.routeName} numberOfLines={1}>
                {item.destination}
              </Text>
            </View>
          </View>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.footerMetric}>
            <Ionicons name="scale-outline" size={14} color={Colors.neutral400} />
            <Text style={styles.footerMetricText}>{item.weight}</Text>
          </View>
          <View style={styles.footerMetric}>
            <Ionicons name="time-outline" size={14} color={Colors.neutral400} />
            <Text style={styles.footerMetricText}>
              {item.status === "received" ? `Received ${item.arrivalTime}` : `ETA ${item.arrivalTime}`}
            </Text>
          </View>
          <View style={styles.arrowBubble}>
            <Ionicons name="chevron-forward" size={15} color={Colors.neutral700} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["top"]}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>My Parcels</Text>
          <Text style={styles.subtitle}>{activeCount} shipments in progress</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            void triggerHaptic.selection();
            router.push("/order/create" as never);
          }}
          style={styles.newShipmentButton}
        >
          <Ionicons name="add" size={20} color={Colors.surface} />
          <Text style={styles.newShipmentText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={17} color={Colors.neutral400} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by tracking number or address..."
          placeholderTextColor={Colors.neutral400}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.neutral400} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.7} onPress={() => void triggerHaptic.light()}>
            <Feather name="maximize" size={17} color={Colors.neutral500} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter Chips ── */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleFilterChange("all")}
          style={[styles.filterChip, selectedFilter === "all" ? styles.filterChipActive : styles.filterChipInactive]}
        >
          <Text
            style={[styles.filterChipText, selectedFilter === "all" ? styles.filterChipTextActive : styles.filterChipTextInactive]}
          >
            All ({parcels.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleFilterChange("active")}
          style={[styles.filterChip, selectedFilter === "active" ? styles.filterChipActive : styles.filterChipInactive]}
        >
          <View style={styles.chipContentWithDot}>
            <View
              style={[
                styles.chipDot,
                { backgroundColor: selectedFilter === "active" ? Colors.accentPink : "#22C55E" },
              ]}
            />
            <Text
              style={[styles.filterChipText, selectedFilter === "active" ? styles.filterChipTextActive : styles.filterChipTextInactive]}
            >
              Active ({activeCount})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleFilterChange("delivered")}
          style={[styles.filterChip, selectedFilter === "delivered" ? styles.filterChipActive : styles.filterChipInactive]}
        >
          <Text
            style={[styles.filterChipText, selectedFilter === "delivered" ? styles.filterChipTextActive : styles.filterChipTextInactive]}
          >
            Delivered ({Math.max(0, parcels.length - activeCount)})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Parcels List ── */}
      <FlatList
        data={filteredParcels}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderParcelCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 115 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={Colors.neutral300} />
            <Text style={styles.emptyTitle}>No parcels found</Text>
            <Text style={styles.emptySubtitle}>Try searching with a different tracking ID or filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
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
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.neutral500,
    marginTop: 2,
  },
  newShipmentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...Shadows.sm,
  },
  newShipmentText: {
    color: Colors.surface,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.neutral100,
    ...Shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.neutral900,
    padding: 0,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 8,
  },
  filterChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: Colors.surfaceDark,
    ...Shadows.sm,
  },
  filterChipInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  filterChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  filterChipTextActive: {
    color: Colors.surface,
  },
  filterChipTextInactive: {
    color: Colors.neutral600,
  },
  chipContentWithDot: {
    flexDirection: "row",
    alignItems: "center",
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  card: {
    borderRadius: Radius.xxl,
    marginBottom: Spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.neutral100,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  packageIconBubble: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  trackingText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    letterSpacing: -0.3,
  },
  serviceTypeText: {
    fontSize: FontSize.xs,
    color: Colors.neutral600,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
  },
  routeContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  routeIconCol: {
    width: 20,
    alignItems: "center",
    marginRight: 8,
  },
  originDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: Colors.neutral800,
    marginTop: 3,
  },
  routeDottedLine: {
    width: 1.5,
    height: 20,
    backgroundColor: Colors.neutral300,
    marginVertical: 2,
  },
  routeTextCol: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 9,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral400,
    letterSpacing: 0.5,
  },
  routeName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.neutral800,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    backgroundColor: "#FAFAFA",
  },
  footerMetric: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerMetricText: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginLeft: 5,
    fontWeight: FontWeight.medium,
  },
  arrowBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.neutral800,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.neutral400,
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
