import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import {
  MapView,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "@/components/map/CrossPlatformMap";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
  Shadows,
} from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";
import { RoutingEngine, type NearbyCourier } from "@/engine/routing-engine";
import { fetchParcelsFromDB } from "@/db/parcels";
import type { DeliveryItem } from "@/types/delivery";

// Centered on Dhaka Central Corridor (Dhanmondi, Tejgaon, Mohakhali, Gulshan)
const DHAKA_REGION = {
  latitude: 23.7740,
  longitude: 90.3950,
  latitudeDelta: 0.085,
  longitudeDelta: 0.085,
};

const DHAKA_HUBS_COORDS: Record<string, { latitude: number; longitude: number }> = {
  dhanmondi: { latitude: 23.7509, longitude: 90.3754 },
  gulshan:   { latitude: 23.7925, longitude: 90.4078 },
  banani:    { latitude: 23.7937, longitude: 90.4043 },
  tejgaon:   { latitude: 23.7598, longitude: 90.3920 },
  uttara:    { latitude: 23.8759, longitude: 90.3795 },
  mirpur:    { latitude: 23.8071, longitude: 90.3686 },
  motijheel: { latitude: 23.7330, longitude: 90.4172 },
  mohakhali: { latitude: 23.7776, longitude: 90.4054 },
  badda:     { latitude: 23.7805, longitude: 90.4267 },
  baridhara: { latitude: 23.7997, longitude: 90.4208 },
};

function getParcelCoordinates(
  address: string,
  id: string,
  isDropoff = false
): { latitude: number; longitude: number } {
  const lower = (address || "").toLowerCase();
  let base = isDropoff
    ? { latitude: 23.7925, longitude: 90.4078 }
    : { latitude: 23.7509, longitude: 90.3754 };

  for (const [key, coords] of Object.entries(DHAKA_HUBS_COORDS)) {
    if (lower.includes(key)) {
      base = coords;
      break;
    }
  }

  // Deterministic subtle offset based on parcel ID hash so pins in same zone do not directly overlap
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 20) - 10) * 0.0008;
  const lngOffset = (((Math.abs(hash) >> 4) % 20) - 10) * 0.0008;

  return {
    latitude: base.latitude + latOffset,
    longitude: base.longitude + lngOffset,
  };
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [couriers, setCouriers] = useState<NearbyCourier[]>(() =>
    RoutingEngine.getNearbyCouriers()
  );
  const [selectedCourier, setSelectedCourier] = useState<NearbyCourier | null>(
    null
  );
  const [activeParcels, setActiveParcels] = useState<DeliveryItem[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<DeliveryItem | null>(null);
  const [searchDestination, setSearchDestination] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      void fetchParcelsFromDB().then((res) => {
        if (isMounted) {
          // EXCLUDE ALL DELIVERED (received) PARCELS FROM MAP!
          const activeOnly = res.active.filter((p) => p.status !== "received");
          setActiveParcels(activeOnly);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const routeData = RoutingEngine.calculateRoute();
  const routePoints = routeData.coordinates.map((c) => ({
    latitude: c.latitude,
    longitude: c.longitude,
  }));

  const handleRefreshRadar = () => {
    void triggerHaptic.light();
    setCouriers(RoutingEngine.getNearbyCouriers());
    void fetchParcelsFromDB().then((res) => {
      const activeOnly = res.active.filter((p) => p.status !== "received");
      setActiveParcels(activeOnly);
    });
  };

  const handleSelectCourier = (courier: NearbyCourier) => {
    void triggerHaptic.selection();
    setSelectedParcel(null);
    setSelectedCourier(courier);
  };

  const handleStartLiveNavigation = () => {
    void triggerHaptic.medium();
    router.push("/driver/navigation" as never);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ── Real Interactive MapView (Dhaka, Bangladesh) ── */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          initialRegion={DHAKA_REGION}
          showsCompass={false}
          showsBuildings
        >
          {/* C++ Dijkstra Shortest Path Polyline (Dhanmondi -> Gulshan) */}
          <Polyline
            coordinates={routePoints}
            strokeColor={Colors.accentPink}
            strokeWidth={4.5}
            lineDashPattern={[0]}
          />

          {/* ── Dynamic Active Parcels (Only active, non-delivered orders) ── */}
          {activeParcels.map((parcel) => {
            const pickupCoords = getParcelCoordinates(
              parcel.origin || "Dhanmondi Hub",
              parcel.id,
              false
            );
            const dropCoords = getParcelCoordinates(
              parcel.destination || "Gulshan Hub",
              parcel.id,
              true
            );
            const isParcelSelected = selectedParcel?.id === parcel.id;

            return (
              <React.Fragment key={parcel.id}>
                {/* Parcel Pickup Origin Pin */}
                <Marker
                  coordinate={pickupCoords}
                  onPress={() => {
                    void triggerHaptic.selection();
                    setSelectedCourier(null);
                    setSelectedParcel(parcel);
                  }}
                  title={`Pickup (${parcel.id})`}
                  description={parcel.origin}
                >
                  <View
                    style={[
                      styles.parcelMarker,
                      isParcelSelected && styles.parcelMarkerSelected,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="package-variant-closed"
                      size={15}
                      color={isParcelSelected ? Colors.surface : "#16A34A"}
                    />
                  </View>
                </Marker>

                {/* Parcel Dropoff Destination Pin */}
                <Marker
                  coordinate={dropCoords}
                  onPress={() => {
                    void triggerHaptic.selection();
                    setSelectedCourier(null);
                    setSelectedParcel(parcel);
                  }}
                  title={`Destination (${parcel.id})`}
                  description={parcel.destination}
                >
                  <View
                    style={[
                      styles.destMarker,
                      isParcelSelected && styles.destMarkerSelected,
                    ]}
                  >
                    <Ionicons
                      name="flag"
                      size={13}
                      color={isParcelSelected ? Colors.accentPink : Colors.surface}
                    />
                  </View>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Nearby Active Couriers in Dhaka */}
          {couriers.map((courier) => {
            const isSelected = selectedCourier?.id === courier.id;
            return (
              <Marker
                key={courier.id}
                coordinate={{
                  latitude: courier.latitude,
                  longitude: courier.longitude,
                }}
                onPress={() => handleSelectCourier(courier)}
                title={`${courier.name} (${courier.zoneName})`}
                description={`${courier.vehicleType === "scooter" ? "Express Moped" : "Cargo Van"} • ${courier.etaMinutes} min away`}
              >
                <View
                  style={[
                    styles.courierBubble,
                    isSelected && styles.courierBubbleSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      courier.vehicleType === "scooter"
                        ? "moped-electric"
                        : "truck-delivery"
                    }
                    size={18}
                    color={isSelected ? Colors.surface : Colors.neutral900}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
      </View>

      {/* ── Floating Header & Search Bar ── */}
      <View style={[styles.floatingHeaderContainer, { top: insets.top + 8 }]}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.neutral400}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search Dhaka (Gulshan, Banani, Dhanmondi)..."
            placeholderTextColor={Colors.neutral400}
            value={searchDestination}
            onChangeText={setSearchDestination}
            style={styles.searchInput}
          />
          {searchDestination ? (
            <TouchableOpacity
              onPress={() => setSearchDestination("")}
              style={{ padding: 4 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.neutral400}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.radarRefreshButton}
              onPress={handleRefreshRadar}
              activeOpacity={0.7}
            >
              <Ionicons name="sync" size={16} color={Colors.neutral900} />
            </TouchableOpacity>
          )}
        </View>

        {/* DSA Radial Status Badge */}
        <View style={styles.dsaRadarBadge}>
          <View style={styles.pulsingGreenDot} />
          <Text style={styles.dsaRadarText}>
            Dhaka BFS Radar: {couriers.length} Couriers Online
          </Text>
        </View>
      </View>

      {/* ── Floating Action Trigger (Launch GPS Turn HUD) ── */}
      <TouchableOpacity
        style={[styles.floatingNavButton, { top: insets.top + 76 }]}
        onPress={handleStartLiveNavigation}
        activeOpacity={0.88}
      >
        <Ionicons name="navigate" size={16} color={Colors.surface} style={{ marginRight: 6 }} />
        <Text style={styles.floatingNavButtonText}>Launch Live GPS HUD</Text>
      </TouchableOpacity>

      {/* ── Bottom Courier & Parcel Dispatch Sheet ── */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 115 }]}>
        {selectedParcel ? (
          <View style={styles.courierDetailCard}>
            <View style={styles.courierHeaderRow}>
              <View style={[styles.courierAvatarBox, { backgroundColor: "#DCFCE7" }]}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={24}
                  color="#16A34A"
                />
              </View>

              <View style={styles.courierInfoTextWrapper}>
                <View style={styles.courierNameRow}>
                  <Text style={styles.courierName}>{selectedParcel.id}</Text>
                  <View
                    style={[
                      styles.ratingBadge,
                      { backgroundColor: "#DCFCE7" },
                    ]}
                  >
                    <Ionicons name="flash" size={11} color="#16A34A" />
                    <Text style={[styles.ratingText, { color: "#16A34A" }]}>
                      {selectedParcel.status === "in_delivery"
                        ? "In Delivery"
                        : "Looking for Courier"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.courierVehicle} numberOfLines={1}>
                  {selectedParcel.origin} ➔ {selectedParcel.destination}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedParcel(null)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={Colors.neutral500} />
              </TouchableOpacity>
            </View>

            <View style={styles.courierActionRow}>
              <View style={styles.etaBox}>
                <Text style={styles.etaLabel}>ARRIVAL</Text>
                <Text style={styles.etaValue}>
                  {selectedParcel.arrivalTime}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                activeOpacity={0.88}
                onPress={() => {
                  void triggerHaptic.selection();
                  router.push(`/order/${encodeURIComponent(selectedParcel.id)}` as never);
                }}
              >
                <Text style={styles.bookButtonText}>View Order Details</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.surface}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedCourier ? (
          <View style={styles.courierDetailCard}>
            <View style={styles.courierHeaderRow}>
              <View style={styles.courierAvatarBox}>
                <MaterialCommunityIcons
                  name={
                    selectedCourier.vehicleType === "scooter"
                      ? "moped-electric"
                      : "truck-delivery"
                  }
                  size={24}
                  color={Colors.accentPink}
                />
              </View>

              <View style={styles.courierInfoTextWrapper}>
                <View style={styles.courierNameRow}>
                  <Text style={styles.courierName}>{selectedCourier.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{selectedCourier.rating}</Text>
                  </View>
                </View>
                <Text style={styles.courierVehicle}>
                  {selectedCourier.zoneName} • {selectedCourier.distanceMiles} mi away
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedCourier(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={18} color={Colors.neutral500} />
              </TouchableOpacity>
            </View>

            <View style={styles.courierActionRow}>
              <View style={styles.etaBox}>
                <Text style={styles.etaLabel}>ARRIVAL ETA</Text>
                <Text style={styles.etaValue}>
                  {selectedCourier.etaMinutes} mins
                </Text>
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                activeOpacity={0.88}
                onPress={() => {
                  void triggerHaptic.medium();
                  router.push("/driver/navigation" as never);
                }}
              >
                <Text style={styles.bookButtonText}>Dispatch This Courier</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={Colors.surface}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.idleRadarCard}>
            <View style={styles.idleRadarHeader}>
              <View style={styles.radarIconWrapper}>
                <MaterialCommunityIcons name="radar" size={22} color={Colors.accentPink} />
              </View>
              <View style={styles.idleRadarTextCol}>
                <Text style={styles.idleRadarTitle}>Dhaka BFS Radar: {couriers.length} Couriers • {activeParcels.length} Active Orders</Text>
                <Text style={styles.idleRadarSub}>
                  Concentric BFS engine auto-locates closest verified riders in Dhaka.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFill,
  },
  userDot: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(34, 197, 94, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  userInnerDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentGreen,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  destMarker: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral900,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
    ...Shadows.card,
  },
  destMarkerSelected: {
    backgroundColor: Colors.accentPink,
    borderColor: Colors.surface,
    transform: [{ scale: 1.2 }],
  },
  parcelMarker: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: "#DCFCE7",
    borderWidth: 2,
    borderColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  parcelMarkerSelected: {
    backgroundColor: "#16A34A",
    borderColor: Colors.surface,
    transform: [{ scale: 1.2 }],
  },
  courierBubble: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  courierBubbleSelected: {
    backgroundColor: Colors.neutral900,
    borderColor: Colors.accentPink,
    transform: [{ scale: 1.15 }],
  },
  floatingHeaderContainer: {
    position: "absolute",
    left: Spacing.pageH,
    right: Spacing.pageH,
    zIndex: 100,
    gap: Spacing.xs,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    height: 48,
    ...Shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.neutral900,
    height: "100%",
  },
  radarRefreshButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  dsaRadarBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(17, 17, 17, 0.85)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    marginLeft: Spacing.xs,
  },
  pulsingGreenDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.pill,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  dsaRadarText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.surface,
  },
  floatingNavButton: {
    position: "absolute",
    right: Spacing.pageH,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral900,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    zIndex: 100,
    ...Shadows.card,
  },
  floatingNavButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.pageH,
    paddingTop: Spacing.sm,
  },
  courierDetailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadows.dock,
  },
  courierHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  courierAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  courierInfoTextWrapper: {
    flex: 1,
    minWidth: 0,
  },
  courierNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  courierName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    gap: 3,
  },
  ratingText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: "#B45309",
  },
  courierVehicle: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 2,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.xs,
  },
  courierActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  etaBox: {
    backgroundColor: Colors.neutral100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  etaLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.neutral500,
    letterSpacing: 0.8,
  },
  etaValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  bookButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.pill,
    height: 44,
    ...Shadows.sm,
  },
  bookButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  idleRadarCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadows.card,
  },
  idleRadarHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  radarIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  idleRadarTextCol: {
    flex: 1,
    minWidth: 0,
  },
  idleRadarTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  idleRadarSub: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 2,
  },
});
