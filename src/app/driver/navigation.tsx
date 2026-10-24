import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
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
import { RoutingEngine, type RouteResult } from "@/engine/routing-engine";
import { updateParcelStatusInDB } from "@/db/parcels";

// Dhaka GPS Navigation Corridor (Dhanmondi -> Gulshan 2)
const DHAKA_NAV_REGION = {
  latitude: 23.7740,
  longitude: 90.3950,
  latitudeDelta: 0.055,
  longitudeDelta: 0.055,
};

export default function DriverNavigationScreen() {
  const insets = useSafeAreaInsets();
  const { parcelId } = useLocalSearchParams<{ parcelId?: string }>();
  const [routeInfo] = useState<RouteResult>(() =>
    RoutingEngine.calculateRoute()
  );
  const [isShiftPaused, setIsShiftPaused] = useState(false);

  const routePoints = routeInfo.coordinates.map((c) => ({
    latitude: c.latitude,
    longitude: c.longitude,
  }));

  const handleToggleShift = () => {
    void triggerHaptic.medium();
    setIsShiftPaused((prev) => !prev);
  };

  const handleCompleteDelivery = async () => {
    void triggerHaptic.success();
    const idToComplete = parcelId || "#F165G258";
    try {
      await updateParcelStatusInDB(idToComplete, "received");
    } catch (e) {
      console.warn("Failed to update status in DB:", e);
    }
    router.replace("/(tabs)/parcels" as never);
  };

  const handleBack = () => {
    void triggerHaptic.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/map" as never);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* ── Real Interactive MapView (Dhaka, Bangladesh) ── */}
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          initialRegion={DHAKA_NAV_REGION}
          showsCompass={false}
          showsBuildings
        >
          {/* C++ Dijkstra Live Polyline (Dhanmondi to Gulshan Corridor) */}
          <Polyline
            coordinates={routePoints}
            strokeColor={Colors.accentPink}
            strokeWidth={5}
            lineDashPattern={[0]}
          />

          {/* Origin Marker (Dhanmondi 27) */}
          <Marker
            coordinate={{ latitude: 23.7509, longitude: 90.3754 }}
            title="Pickup: Road 27, Dhanmondi"
          >
            <View style={styles.originMarker}>
              <View style={styles.originInnerDot} />
            </View>
          </Marker>

          {/* Destination Marker (Gulshan 2) */}
          <Marker
            coordinate={{ latitude: 23.7925, longitude: 90.4078 }}
            title="Dropoff: Road 103, Gulshan 2"
          >
            <View style={styles.destMarker}>
              <Ionicons name="flag" size={14} color={Colors.surface} />
            </View>
          </Marker>

          {/* Current Live Vehicle / Courier Marker (on Mohakhali Road) */}
          <Marker
            coordinate={{ latitude: 23.7750, longitude: 90.3950 }}
            title="Your Courier Vehicle"
            flat
          >
            <View style={styles.vehicleBubble}>
              <MaterialCommunityIcons
                name="moped-electric"
                size={22}
                color={Colors.surface}
              />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* ── Top Floating HUD Header (Turn-by-Turn Dhaka) ── */}
      <View style={[styles.topHudContainer, { top: insets.top + 8 }]}>
        <View style={styles.turnHudCard}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.neutral900} />
          </TouchableOpacity>

          <View style={styles.turnIconBox}>
            <Text style={styles.turnSymbol}>{routeInfo.currentTurn.symbol}</Text>
          </View>

          <View style={styles.turnInfoCol}>
            <Text style={styles.turnDistance}>
              {routeInfo.currentTurn.distance}
            </Text>
            <Text style={styles.turnStreet} numberOfLines={1}>
              {routeInfo.currentTurn.streetName}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.shiftPill,
              isShiftPaused && styles.shiftPillPaused,
            ]}
            onPress={handleToggleShift}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.shiftStatusDot,
                isShiftPaused && styles.shiftStatusDotPaused,
              ]}
            />
            <Text style={styles.shiftPillText}>
              {isShiftPaused ? "Resume" : "Pause shift"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live DSA Metrics HUD Bar */}
        <View style={styles.dsaMetricsCard}>
          <View style={styles.dsaPillBadge}>
            <Text style={styles.dsaPillText}>ALGORITHM</Text>
          </View>
          <Text style={styles.dsaAlgorithmName}>{routeInfo.algorithm}</Text>
          <View style={styles.dsaDivider} />
          <Text style={styles.dsaMetricItem}>
            Nodes:{" "}
            <Text style={styles.dsaMetricVal}>{routeInfo.nodeCount}</Text>
          </Text>
          <View style={styles.dsaDivider} />
          <Text style={styles.dsaMetricItem}>
            Latency:{" "}
            <Text style={styles.dsaMetricVal}>
              {routeInfo.computeLatencyMs} ms
            </Text>
          </Text>
        </View>
      </View>

      {/* ── Bottom Floating Trip Metrics Sheet ── */}
      <View style={[styles.bottomMetricsContainer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.bottomCard}>
          {/* Trip Summary Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricBig}>{routeInfo.distance}</Text>
              <Text style={styles.metricLabel}>DISTANCE</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.metricCol}>
              <Text style={styles.metricBig}>{routeInfo.duration}</Text>
              <Text style={styles.metricLabel}>EST. TIME</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.metricCol}>
              <Text style={[styles.metricBig, { color: Colors.accentPink }]}>
                {routeInfo.eta}
              </Text>
              <Text style={styles.metricLabel}>ARRIVAL</Text>
            </View>
          </View>

          {/* Visual Route Timeline Track */}
          <View style={styles.timelineTrackContainer}>
            <View style={styles.timelineBar}>
              <View style={styles.timelineProgress} />
            </View>
            <View style={styles.timelineThumb}>
              <View style={styles.timelineInnerDot} />
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.detailsButton}
              activeOpacity={0.8}
              onPress={() => {
                void triggerHaptic.light();
                router.push("/(tabs)/parcels" as never);
              }}
            >
              <Ionicons
                name="cube-outline"
                size={18}
                color={Colors.neutral900}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.detailsButtonText}>Parcel Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.finishButton}
              activeOpacity={0.88}
              onPress={handleCompleteDelivery}
            >
              <Text style={styles.finishButtonText}>Complete Delivery</Text>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={Colors.surface}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  mapContainer: {
    ...StyleSheet.absoluteFill,
  },
  originMarker: {
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentPinkLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  originInnerDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentPink,
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
  vehicleBubble: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral900,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: Colors.accentPink,
    ...Shadows.pinkGlow,
  },
  topHudContainer: {
    position: "absolute",
    left: Spacing.pageH,
    right: Spacing.pageH,
    zIndex: 100,
    gap: Spacing.xs,
  },
  turnHudCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    ...Shadows.card,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  turnIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral900,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  turnSymbol: {
    fontSize: 20,
    color: Colors.surface,
    fontWeight: FontWeight.bold,
  },
  turnInfoCol: {
    flex: 1,
    minWidth: 0,
    marginRight: Spacing.xs,
  },
  turnDistance: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    lineHeight: 18,
  },
  turnStreet: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    fontWeight: FontWeight.medium,
  },
  shiftPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral900,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
  },
  shiftPillPaused: {
    backgroundColor: "#DC2626",
  },
  shiftStatusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  shiftStatusDotPaused: {
    backgroundColor: Colors.surface,
  },
  shiftPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  dsaMetricsCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(17, 17, 17, 0.92)",
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    ...Shadows.sm,
  },
  dsaPillBadge: {
    backgroundColor: Colors.accentPink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    marginRight: Spacing.xs,
  },
  dsaPillText: {
    fontSize: 9,
    fontWeight: FontWeight.extrabold,
    color: Colors.surface,
    letterSpacing: 0.5,
  },
  dsaAlgorithmName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginRight: Spacing.sm,
  },
  dsaDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.neutral700,
    marginHorizontal: Spacing.xs,
  },
  dsaMetricItem: {
    fontSize: FontSize.xs,
    color: Colors.neutral400,
  },
  dsaMetricVal: {
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  bottomMetricsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.pageH,
    zIndex: 100,
  },
  bottomCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...Shadows.dock,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  metricCol: {
    alignItems: "center",
    flex: 1,
  },
  metricBig: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.neutral900,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.neutral400,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.neutral200,
  },
  timelineTrackContainer: {
    height: 16,
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  timelineBar: {
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    overflow: "hidden",
  },
  timelineProgress: {
    width: "60%",
    height: "100%",
    backgroundColor: Colors.accentPink,
  },
  timelineThumb: {
    position: "absolute",
    left: "58%",
    width: 18,
    height: 18,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accentPink,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.pinkGlow,
  },
  timelineInnerDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentPink,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral100,
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
  },
  detailsButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral900,
  },
  finishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral900,
    height: 48,
    borderRadius: Radius.pill,
    ...Shadows.sm,
  },
  finishButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});
