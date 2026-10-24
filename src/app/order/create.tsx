import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
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
import type { DeliveryItem } from "@/types/delivery";
import { insertParcelToDB } from "@/db/parcels";

export default function CreateParcelScreen() {
  const insets = useSafeAreaInsets();
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("Road 27, Dhanmondi, Dhaka");
  const [dropAddress, setDropAddress] = useState("Road 103, Gulshan 2, Dhaka");
  const [packageType, setPackageType] = useState("Express Parcel");
  const [isFragile, setIsFragile] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    void triggerHaptic.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as never);
    }
  };

  const handleCreate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    void triggerHaptic.success();

    const finalReceiver = receiverName.trim() || "Emily Carter";
    const finalPhone = receiverPhone.trim() || "+880 1700-000000";
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newId = `#F${randomHex}`;

    const newParcel: DeliveryItem = {
      id: newId,
      status: "looking_for_courier",
      arrivalTime: "Within 45 min",
      cardColor: "green",
      origin: pickupAddress,
      destination: dropAddress,
      weight: "1.5 kg",
      serviceType: packageType,
    };

    try {
      await insertParcelToDB(newParcel, finalReceiver, finalPhone);
    } catch (err) {
      console.warn("Error persisting parcel to DB:", err);
    }

    // Direct user straight to their newly created order details screen
    router.replace(`/order/${encodeURIComponent(newId)}` as never);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.neutral900} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Create Parcel Booking</Text>
          <Text style={styles.headerSubtitle}>Trive Instant Courier Dispatch</Text>
        </View>
        <View style={styles.iconBox}>
          <Ionicons name="cube" size={20} color={Colors.accentPink} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Receiver Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>RECEIVER FULL NAME</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.neutral400}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Emily Carter"
                placeholderTextColor={Colors.neutral400}
                value={receiverName}
                onChangeText={setReceiverName}
              />
            </View>
          </View>

          {/* Receiver Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>RECEIVER PHONE</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="call-outline"
                size={18}
                color={Colors.neutral400}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="+880 1700-000000"
                placeholderTextColor={Colors.neutral400}
                value={receiverPhone}
                onChangeText={setReceiverPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Pickup Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PICKUP ORIGIN</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#22C55E"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.textInput}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="Pickup address"
                placeholderTextColor={Colors.neutral400}
              />
            </View>
          </View>

          {/* Dropoff Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DELIVERY DESTINATION</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="flag-outline"
                size={18}
                color={Colors.accentPink}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.textInput}
                value={dropAddress}
                onChangeText={setDropAddress}
                placeholder="Dropoff address"
                placeholderTextColor={Colors.neutral400}
              />
            </View>
          </View>

          {/* Package Type Pills */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PACKAGE TYPE</Text>
            <View style={styles.pillsRow}>
              {["Express Parcel", "Documents", "Electronics", "Food"].map(
                (type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.pillItem,
                      packageType === type && styles.pillItemActive,
                    ]}
                    onPress={() => {
                      void triggerHaptic.selection();
                      setPackageType(type);
                    }}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        packageType === type && styles.pillTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* Fragile Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Fragile Item</Text>
              <Text style={styles.toggleSubtitle}>
                Special caution & cushioned transit container
              </Text>
            </View>
            <Switch
              value={isFragile}
              onValueChange={(val) => {
                void triggerHaptic.selection();
                setIsFragile(val);
              }}
              trackColor={{ false: Colors.neutral200, true: Colors.accentPink }}
              thumbColor={Colors.surface}
            />
          </View>

          {/* Payment Method */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PAYMENT METHOD</Text>
            <View style={styles.paymentMethodRow}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "cod" && styles.paymentOptionActive,
                ]}
                onPress={() => {
                  void triggerHaptic.selection();
                  setPaymentMethod("cod");
                }}
              >
                <MaterialCommunityIcons
                  name="cash"
                  size={20}
                  color={
                    paymentMethod === "cod"
                      ? Colors.accentPink
                      : Colors.neutral600
                  }
                />
                <Text
                  style={[
                    styles.paymentText,
                    paymentMethod === "cod" && styles.paymentTextActive,
                  ]}
                >
                  Cash on Delivery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "bkash" && styles.paymentOptionActive,
                ]}
                onPress={() => {
                  void triggerHaptic.selection();
                  setPaymentMethod("bkash");
                }}
              >
                <MaterialCommunityIcons
                  name="cellphone-check"
                  size={20}
                  color={
                    paymentMethod === "bkash"
                      ? Colors.accentPink
                      : Colors.neutral600
                  }
                />
                <Text
                  style={[
                    styles.paymentText,
                    paymentMethod === "bkash" && styles.paymentTextActive,
                  ]}
                >
                  bKash / Digital
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Action Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
            activeOpacity={0.88}
            onPress={handleCreate}
            disabled={isSubmitting}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? "Booking Parcel..." : "Confirm & Book Delivery"}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={Colors.surface}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: Spacing.pageH,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentPinkLight,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: Spacing.pageH,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral600,
    letterSpacing: 0.8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.md,
    height: 48,
    ...Shadows.card,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.neutral900,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  pillItemActive: {
    backgroundColor: Colors.neutral900,
    borderColor: Colors.neutral900,
  },
  pillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral600,
  },
  pillTextActive: {
    color: Colors.surface,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    ...Shadows.card,
  },
  toggleTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  toggleSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 2,
  },
  paymentMethodRow: {
    flexDirection: "row",
    gap: 10,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    ...Shadows.card,
  },
  paymentOptionActive: {
    borderColor: Colors.accentPink,
    backgroundColor: "#FFF1F2",
  },
  paymentText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral700,
  },
  paymentTextActive: {
    color: Colors.accentPink,
    fontWeight: FontWeight.bold,
  },
  submitBtn: {
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.pill,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
    ...Shadows.card,
  },
  submitBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});
