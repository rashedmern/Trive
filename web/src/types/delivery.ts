export type DeliveryStatus =
  | "looking_for_courier"
  | "in_delivery"
  | "in_transit"
  | "received"
  | "pending";

export type CardColor = "green" | "coral" | "lavender" | "peach";

export interface DeliveryItem {
  id: string;
  status: DeliveryStatus;
  arrivalTime: string;
  cardColor: CardColor;
  origin?: string;
  destination?: string;
  weight?: string;
  serviceType?: string;
  receiverName?: string;
  receiverPhone?: string;
}

export interface OrderSpec {
  service: string;
  receiver: string;
  address: string;
  origin?: string;
  packageType: string;
  paymentMethod: string;
  handlingNote: string;
}

export interface Order {
  trackingId: string;
  status: DeliveryStatus;
  cardColor: CardColor;
  spec: OrderSpec;
}

export interface ServiceItem {
  id: "create" | "calculate" | "receipts" | "support";
  label: string;
  iconName: string;
}

export interface NearbyCourier {
  id: string;
  name: string;
  zoneName: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  etaMinutes: number;
  rating: number;
  vehicleType: "scooter" | "van";
}

export interface LatLng {
  latitude: number;
  longitude: number;
}
