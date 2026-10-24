import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  Colors,
  Radius,
  Spacing,
  FontSize,
  FontWeight,
  Shadows,
} from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    q: "How does Trive calculate the fastest courier route?",
    a: "Trive runs a pure C++17 Dijkstra Algorithm with Min-Heap priority queue on the road graph in under 0.01 milliseconds to guarantee the shortest transit corridor.",
  },
  {
    q: "How does 'Looking for Courier' find a rider?",
    a: "Our concentric Breadth-First Search (BFS) engine expands radially outward from your parcel origin to dispatch the closest available verified rider.",
  },
  {
    q: "What if a package contains fragile or delicate items?",
    a: "Toggle the 'Fragile' switch when booking. Our riders are provided with shock-absorbent containers and strict zero-drop transit protocols.",
  },
  {
    q: "How do I claim insurance for delayed or damaged goods?",
    a: "Every verified shipment includes up to ৳10,000 automatic coverage. File an incident report through this support screen within 24 hours.",
  },
];

export function SupportModal({ visible, onClose }: SupportModalProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleCallSupport = () => {
    void triggerHaptic.medium();
    void Linking.openURL("tel:+8809612008888");
  };

  const handleLiveChat = () => {
    void triggerHaptic.selection();
    Alert.alert(
      "Trive Priority Support",
      "Connecting you with Senior Logistics Dispatcher Karim. Expected wait time: ~10 seconds."
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
                <Ionicons name="headset" size={20} color={Colors.accentPink} />
              </View>
              <Text style={styles.sheetTitle}>Trive Help & Support</Text>
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
            {/* Quick Action Cards */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={handleCallSupport}
              >
                <View style={[styles.actionIconBox, { backgroundColor: "#DCFCE7" }]}>
                  <Ionicons name="call" size={20} color="#16A34A" />
                </View>
                <Text style={styles.actionCardTitle}>Call 24/7 Hotline</Text>
                <Text style={styles.actionCardSub}>+880 9612-TRIVE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={handleLiveChat}
              >
                <View style={[styles.actionIconBox, { backgroundColor: "#FFE4E6" }]}>
                  <Ionicons name="chatbubbles" size={20} color={Colors.accentPink} />
                </View>
                <Text style={styles.actionCardTitle}>Live Agent Chat</Text>
                <Text style={styles.actionCardSub}>Average 1 min reply</Text>
              </TouchableOpacity>
            </View>

            {/* FAQ Accordion Section */}
            <View style={styles.faqSection}>
              <Text style={styles.sectionHeading}>FREQUENTLY ASKED QUESTIONS</Text>

              {FAQS.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <View key={faq.q} style={styles.faqItem}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      activeOpacity={0.7}
                      onPress={() => {
                        void triggerHaptic.selection();
                        setExpandedFaq(isExpanded ? null : idx);
                      }}
                    >
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      <Feather
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={Colors.neutral500}
                      />
                    </TouchableOpacity>
                    {isExpanded ? (
                      <View style={styles.faqBody}>
                        <Text style={styles.faqAnswer}>{faq.a}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>

            {/* Emergency Notice */}
            <View style={styles.safetyBox}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#059669"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.safetyText}>
                All shipments are tracked with 100% telemetry verification and real-time OTP chain of custody.
              </Text>
            </View>
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
    backgroundColor: Colors.accentPinkLight,
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
    gap: Spacing.lg,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.neutral50,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.neutral200,
    gap: 4,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  actionCardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral900,
  },
  actionCardSub: {
    fontSize: FontSize.xs,
    color: Colors.neutral500,
  },
  faqSection: {
    gap: Spacing.sm,
  },
  sectionHeading: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.neutral600,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  faqItem: {
    backgroundColor: Colors.neutral50,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral900,
    marginRight: 8,
  },
  faqBody: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    paddingTop: Spacing.sm,
  },
  faqAnswer: {
    fontSize: FontSize.xs,
    color: Colors.neutral600,
    lineHeight: 18,
  },
  safetyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  safetyText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: "#065F46",
    lineHeight: 16,
  },
});
