import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
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

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (trackingId: string) => void;
}

const DEMO_BARCODES = [
  { id: "#F165G258", label: "Express Parcel (Dhanmondi -> Gulshan)" },
  { id: "#CB1AD25", label: "Retail Merchandise (In Delivery)" },
  { id: "#A856K005", label: "Signed Documents (Delivered)" },
];

export function BarcodeScannerModal({
  visible,
  onClose,
  onScanSuccess,
}: BarcodeScannerModalProps) {
  const scanLinePos = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scanLinePos.value = withRepeat(
        withTiming(180, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    }
  }, [visible, scanLinePos]);

  const animatedLaserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePos.value }],
  }));

  const handleSelectBarcode = (id: string) => {
    void triggerHaptic.success();
    onScanSuccess(id);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Scan Package Barcode</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={Colors.surface} />
          </TouchableOpacity>
        </View>

          <Text style={styles.subTitle}>
            Align the 1D / 2D shipping barcode within the frame
          </Text>

          {/* Viewfinder Frame */}
          <View style={styles.viewfinder}>
            {/* 4 Corner Markers */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Laser Line */}
            <Animated.View style={[styles.laserLine, animatedLaserStyle]} />

            <MaterialCommunityIcons
              name="barcode-scan"
              size={64}
              color="rgba(255, 255, 255, 0.2)"
            />
          </View>

          {/* Tap to simulate immediate scan */}
          <Text style={styles.quickScanHeading}>OR SIMULATE PACKAGE SCAN</Text>
          <View style={styles.barcodesList}>
            {DEMO_BARCODES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.barcodeItem}
                activeOpacity={0.8}
                onPress={() => handleSelectBarcode(item.id)}
              >
                <View style={styles.barcodeIconBox}>
                  <Ionicons name="barcode-outline" size={18} color={Colors.accentPink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.barcodeId}>{item.id}</Text>
                  <Text style={styles.barcodeLabel}>{item.label}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={Colors.neutral400} />
              </TouchableOpacity>
            ))}
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  container: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: "center",
    zIndex: 10000,
    ...Shadows.dock,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    fontSize: FontSize.xs,
    color: Colors.neutral400,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  viewfinder: {
    width: 220,
    height: 190,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: Colors.accentPink,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: Colors.accentPink,
    shadowColor: Colors.accentPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  quickScanHeading: {
    alignSelf: "flex-start",
    fontSize: 10,
    fontWeight: "700",
    color: Colors.neutral400,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  barcodesList: {
    width: "100%",
    gap: 8,
  },
  barcodeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral800,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    gap: 10,
  },
  barcodeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 45, 85, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  barcodeId: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
  barcodeLabel: {
    fontSize: 10,
    color: Colors.neutral400,
    marginTop: 1,
  },
});
