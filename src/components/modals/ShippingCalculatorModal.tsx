import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
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

interface ShippingCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRate?: (rateDetails: {
    origin: string;
    destination: string;
    weight: string;
    fare: string;
  }) => void;
}

const HUBS = [
  "Dhanmondi Hub",
  "Gulshan Hub",
  "Uttara Hub",
  "Mirpur Hub",
  "Motijheel Hub",
];

const WEIGHTS = [
  { label: "0.5 kg", multiplier: 1 },
  { label: "1.0 kg", multiplier: 1.2 },
  { label: "2.0 kg", multiplier: 1.5 },
  { label: "5.0 kg", multiplier: 2.2 },
  { label: "10.0 kg", multiplier: 3.5 },
];

const SPEEDS = [
  { id: "standard", label: "Standard", time: "Next Day", baseCost: 60 },
  { id: "express", label: "Express", time: "Within 4 hrs", baseCost: 120 },
  { id: "rush", label: "Rush Dispatch", time: "Within 1 hr", baseCost: 220 },
];

export function ShippingCalculatorModal({
  visible,
  onClose,
  onSelectRate,
}: ShippingCalculatorModalProps) {
  const [origin, setOrigin] = useState("Dhanmondi Hub");
  const [destination, setDestination] = useState("Gulshan Hub");
  const [selectedWeight, setSelectedWeight] = useState(WEIGHTS[1]);
  const [selectedSpeed, setSelectedSpeed] = useState(SPEEDS[1]);

  const calculatedFare = Math.round(
    selectedSpeed.baseCost * selectedWeight.multiplier
  );

  const handleBookRate = () => {
    void triggerHaptic.success();
    if (onSelectRate) {
      onSelectRate({
        origin,
        destination,
        weight: selectedWeight.label,
        fare: `৳${calculatedFare}`,
      });
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <Ionicons name="calculator" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.sheetTitle}>Fare & Route Calculator</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.neutral600} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Origin Hub */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ORIGIN HUB</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                {HUBS.map((h) => (
                  <TouchableOpacity
                    key={`orig-${h}`}
                    style={[
                      styles.chipItem,
                      origin === h && styles.chipItemActive,
                    ]}
                    onPress={() => {
                      void triggerHaptic.selection();
                      setOrigin(h);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        origin === h && styles.chipTextActive,
                      ]}
                    >
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Destination Hub */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>DESTINATION HUB</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                {HUBS.map((h) => (
                  <TouchableOpacity
                    key={`dest-${h}`}
                    style={[
                      styles.chipItem,
                      destination === h && styles.chipItemActive,
                    ]}
                    onPress={() => {
                      void triggerHaptic.selection();
                      setDestination(h);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        destination === h && styles.chipTextActive,
                      ]}
                    >
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Weight Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PARCEL WEIGHT</Text>
              <View style={styles.gridRow}>
                {WEIGHTS.map((w) => (
                  <TouchableOpacity
                    key={w.label}
                    style={[
                      styles.weightCard,
                      selectedWeight.label === w.label && styles.weightCardActive,
                    ]}
                    onPress={() => {
                      void triggerHaptic.selection();
                      setSelectedWeight(w);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="scale"
                      size={18}
                      color={
                        selectedWeight.label === w.label
                          ? Colors.accentPink
                          : Colors.neutral500
                      }
                    />
                    <Text
                      style={[
                        styles.weightText,
                        selectedWeight.label === w.label && styles.weightTextActive,
                      ]}
                    >
                      {w.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Delivery Speed Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>DELIVERY SPEED</Text>
              <View style={{ gap: 8 }}>
                {SPEEDS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.speedOption,
                      selectedSpeed.id === s.id && styles.speedOptionActive,
                    ]}
                    onPress={() => {
                      void triggerHaptic.selection();
                      setSelectedSpeed(s);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.speedName}>{s.label}</Text>
                      <Text style={styles.speedTime}>{s.time}</Text>
                    </View>
                    <Text style={styles.speedPrice}>Base ৳{s.baseCost}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Estimated Fare Display Card */}
            <View style={styles.fareResultCard}>
              <View style={styles.fareHeaderRow}>
                <Text style={styles.fareCardLabel}>ESTIMATED TOTAL FARE</Text>
                <View style={styles.dsaTag}>
                  <Text style={styles.dsaTagText}>DIJKSTRA OPTIMIZED</Text>
                </View>
              </View>
              <Text style={styles.fareAmount}>৳{calculatedFare}</Text>
              <Text style={styles.fareSubText}>
                Includes distance surcharge & live corridor routing fee.
              </Text>
            </View>

            {/* Action */}
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.88}
              onPress={handleBookRate}
            >
              <Text style={styles.actionBtnText}>Select & Book Delivery</Text>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={Colors.surface}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    height: "85%",
    maxHeight: "90%",
    paddingBottom: Spacing.xl,
    zIndex: 10000,
    ...Shadows.dock,
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral300,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollBody: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl + 40,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral600,
    letterSpacing: 0.8,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  chipItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  chipItemActive: {
    backgroundColor: Colors.neutral900,
    borderColor: Colors.neutral900,
  },
  chipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral600,
  },
  chipTextActive: {
    color: Colors.surface,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  weightCard: {
    flex: 1,
    minWidth: "28%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral50,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    gap: 4,
  },
  weightCardActive: {
    borderColor: Colors.accentPink,
    backgroundColor: "#FFF1F2",
  },
  weightText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral700,
  },
  weightTextActive: {
    color: Colors.accentPink,
    fontWeight: FontWeight.bold,
  },
  speedOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral50,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
  },
  speedOptionActive: {
    borderColor: Colors.neutral900,
    backgroundColor: Colors.surface,
  },
  speedName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  speedTime: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 2,
  },
  speedPrice: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
  },
  fareResultCard: {
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  fareHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  fareCardLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral400,
    letterSpacing: 0.8,
  },
  dsaTag: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  dsaTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#34D399",
    letterSpacing: 0.5,
  },
  fareAmount: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.surface,
    marginVertical: 4,
  },
  fareSubText: {
    fontSize: FontSize.xs,
    color: Colors.neutral400,
  },
  actionBtn: {
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.pill,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  actionBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});
