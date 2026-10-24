import type { CardGradientKey } from "@/constants/theme";

// ── Delivery Status ──────────────────────────────────────────────
export type DeliveryStatus =
  | "looking_for_courier"
  | "in_delivery"
  | "received"
  | "in_transit"
  | "pending";

// ── Delivery Item (for cards/history) ───────────────────────────
export interface DeliveryItem {
  id: string;               // e.g. "#CB1AD25"
  status: DeliveryStatus;
  arrivalTime: string;      // e.g. "12:05 PM"
  cardColor: CardGradientKey;
  origin?: string;          // e.g. "Miami Fulfillment Hub"
  destination?: string;     // e.g. "2210 Coral Way, Apt 3C"
  weight?: string;          // e.g. "1.8 kg"
  serviceType?: string;     // e.g. "Express Delivery"
}

// ── Order Specifications ─────────────────────────────────────────
export interface OrderSpec {
  service: string;          // e.g. "Express Parcel"
  receiver: string;         // e.g. "Emily Carter"
  address: string;          // e.g. "2210 Coral Way, Apt 3C"
  packageType: string;      // e.g. "Retail Merchandise"
  paymentMethod: string;    // e.g. "Cash on Delivery"
  handlingNote?: string;
}

// ── Full Order (card + spec) ─────────────────────────────────────
export interface Order {
  trackingId: string;
  status: DeliveryStatus;
  spec: OrderSpec;
  cardColor: CardGradientKey;
}

// ── Trip Metrics (navigation screen) ────────────────────────────
export interface TripMetrics {
  distance: string;   // e.g. "1.5 mile"
  duration: string;   // e.g. "10 min"
  eta: string;        // e.g. "10:05 PM"
}

// ── Navigation Turn Instruction ──────────────────────────────────
export interface TurnInstruction {
  direction: "left" | "right" | "straight" | "u-turn";
  distance: string;   // e.g. "50 ft"
  streetName: string; // e.g. "1024 Ocean Dr"
}

// ── Service Item (4-column grid) ─────────────────────────────────
export type ServiceItemId = "create" | "calculate" | "receipts" | "support";

export interface ServiceItem {
  id: ServiceItemId;
  label: string;
  iconName: string;   // Ionicons name
}
