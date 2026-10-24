import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
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

interface ReceiptsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ReceiptItem {
  id: string;
  date: string;
  sender: string;
  receiver: string;
  baseFare: number;
  distanceFee: number;
  fragileFee: number;
  tax: number;
  total: number;
  method: string;
  status: "Paid" | "Pending";
}

const PAST_RECEIPTS: ReceiptItem[] = [
  {
    id: "TRV-INV-9821",
    date: "Today, 11:45 AM",
    sender: "Trive Dhanmondi Hub",
    receiver: "Emily Carter (Gulshan 2)",
    baseFare: 80,
    distanceFee: 45,
    fragileFee: 20,
    tax: 7,
    total: 152,
    method: "Cash on Delivery",
    status: "Paid",
  },
  {
    id: "TRV-INV-8419",
    date: "Yesterday, 4:20 PM",
    sender: "Tejgaon Industrial Hub",
    receiver: "Mark Wood (Banani)",
    baseFare: 70,
    distanceFee: 35,
    fragileFee: 0,
    tax: 5,
    total: 110,
    method: "bKash Online",
    status: "Paid",
  },
  {
    id: "TRV-INV-7104",
    date: "Oct 21, 2026",
    sender: "Uttara Sector 7 Hub",
    receiver: "Sarah Khan (Mirpur 10)",
    baseFare: 90,
    distanceFee: 60,
    fragileFee: 25,
    tax: 9,
    total: 184,
    method: "Credit Card",
    status: "Paid",
  },
];

export function ReceiptsModal({ visible, onClose }: ReceiptsModalProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(
    PAST_RECEIPTS[0]
  );

  const handleShareReceipt = (receipt: ReceiptItem) => {
    void triggerHaptic.success();
    Alert.alert(
      "Receipt Exported",
      `Invoice #${receipt.id} has been downloaded and shared to your device successfully.`
    );
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
                <Ionicons name="receipt" size={20} color="#10B981" />
              </View>
              <Text style={styles.sheetTitle}>Invoices & Receipts</Text>
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
            {/* Quick selector of receipts */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsRow}
            >
              {PAST_RECEIPTS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.tabItem,
                    selectedReceipt?.id === r.id && styles.tabItemActive,
                  ]}
                  onPress={() => {
                    void triggerHaptic.selection();
                    setSelectedReceipt(r);
                  }}
                >
                  <Text
                    style={[
                      styles.tabItemText,
                      selectedReceipt?.id === r.id && styles.tabItemTextActive,
                    ]}
                  >
                    #{r.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedReceipt ? (
              <View style={styles.receiptCard}>
                {/* Top Badge */}
                <View style={styles.receiptHeader}>
                  <View>
                    <Text style={styles.receiptBrand}>TRIVE LOGISTICS INC.</Text>
                    <Text style={styles.receiptId}>Invoice #{selectedReceipt.id}</Text>
                    <Text style={styles.receiptDate}>{selectedReceipt.date}</Text>
                  </View>
                  <View style={styles.paidBadge}>
                    <Ionicons name="checkmark-done" size={14} color="#059669" />
                    <Text style={styles.paidBadgeText}>{selectedReceipt.status}</Text>
                  </View>
                </View>

                {/* Dashed Separator */}
                <View style={styles.dashedLine} />

                {/* Routing Addresses */}
                <View style={styles.addressSection}>
                  <View style={styles.addressRow}>
                    <Ionicons name="radio-button-on" size={14} color="#22C55E" />
                    <Text style={styles.addressText} numberOfLines={1}>
                      {selectedReceipt.sender}
                    </Text>
                  </View>
                  <View style={styles.addressRow}>
                    <Ionicons name="location" size={14} color={Colors.accentPink} />
                    <Text style={styles.addressText} numberOfLines={1}>
                      {selectedReceipt.receiver}
                    </Text>
                  </View>
                </View>

                <View style={styles.dashedLine} />

                {/* Itemized Table */}
                <View style={styles.itemTable}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Standard Pickup Base</Text>
                    <Text style={styles.itemVal}>৳{selectedReceipt.baseFare}.00</Text>
                  </View>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>Distance Surcharge (Dijkstra)</Text>
                    <Text style={styles.itemVal}>৳{selectedReceipt.distanceFee}.00</Text>
                  </View>
                  {selectedReceipt.fragileFee > 0 ? (
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>Fragile Protection Guarantee</Text>
                      <Text style={styles.itemVal}>৳{selectedReceipt.fragileFee}.00</Text>
                    </View>
                  ) : null}
                  <View style={styles.itemRow}>
                    <Text style={styles.itemLabel}>BTRC Logistics VAT (5%)</Text>
                    <Text style={styles.itemVal}>৳{selectedReceipt.tax}.00</Text>
                  </View>
                </View>

                <View style={styles.solidLine} />

                {/* Total */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL PAID</Text>
                  <Text style={styles.totalVal}>৳{selectedReceipt.total}.00</Text>
                </View>

                <View style={styles.paymentMethodBox}>
                  <MaterialCommunityIcons
                    name="credit-card-check"
                    size={18}
                    color={Colors.neutral700}
                  />
                  <Text style={styles.paymentMethodText}>
                    Paid via {selectedReceipt.method}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Action buttons */}
            {selectedReceipt ? (
              <TouchableOpacity
                style={styles.shareBtn}
                activeOpacity={0.88}
                onPress={() => handleShareReceipt(selectedReceipt)}
              >
                <Ionicons
                  name="share-outline"
                  size={18}
                  color={Colors.surface}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.shareBtnText}>Download / Share Receipt</Text>
              </TouchableOpacity>
            ) : null}
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
    backgroundColor: "#D1FAE5",
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl + 40,
    gap: Spacing.md,
  },
  tabsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.neutral100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  tabItemActive: {
    backgroundColor: Colors.neutral900,
    borderColor: Colors.neutral900,
  },
  tabItemText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral600,
  },
  tabItemTextActive: {
    color: Colors.surface,
    fontWeight: FontWeight.bold,
  },
  receiptCard: {
    backgroundColor: Colors.neutral50,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    gap: Spacing.md,
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  receiptBrand: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.accentPink,
    letterSpacing: 1.2,
  },
  receiptId: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
    marginTop: 2,
  },
  receiptDate: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
    marginTop: 2,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  paidBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#059669",
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderStyle: "dashed",
  },
  solidLine: {
    height: 1.5,
    backgroundColor: Colors.neutral300,
  },
  addressSection: {
    gap: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.neutral700,
  },
  itemTable: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLabel: {
    fontSize: FontSize.xs,
    color: Colors.neutral600,
  },
  itemVal: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral900,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  totalVal: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accentPink,
  },
  paymentMethodBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.neutral100,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  paymentMethodText: {
    fontSize: FontSize.xs,
    color: Colors.neutral700,
    fontWeight: FontWeight.medium,
  },
  shareBtn: {
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.pill,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  shareBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
  },
});
