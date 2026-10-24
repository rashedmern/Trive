import { supabase } from "./supabase";
import type { DeliveryItem, Order } from "../types/delivery";

export const FALLBACK_DELIVERIES: DeliveryItem[] = [
  {
    id: "#F165G258",
    status: "looking_for_courier",
    arrivalTime: "1:30 PM",
    cardColor: "green",
    origin: "Road 27, Dhanmondi, Dhaka",
    destination: "2210 Coral Way, Apt 3C (Dhaka Hub)",
    weight: "1.8 kg",
    serviceType: "Express Parcel",
  },
  {
    id: "#CB1AD25",
    status: "in_delivery",
    arrivalTime: "12:05 PM",
    cardColor: "coral",
    origin: "Tejgaon Industrial Hub",
    destination: "1024 Ocean Dr, Suite 500",
    weight: "1.2 kg",
    serviceType: "Retail Merchandise",
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
];

export const FALLBACK_HISTORY: DeliveryItem[] = [
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

interface SupabaseParcelRow {
  id: string;
  sender_id?: string;
  courier_id?: string;
  origin_hub_id?: string;
  dest_hub_id?: string;
  receiver_name?: string;
  receiver_phone?: string;
  pickup_address?: string;
  delivery_address?: string;
  status?: string;
  package_type?: string;
  weight_kg?: number;
  is_fragile?: boolean;
  handling_notes?: string;
  card_color?: string;
  arrival_time?: string;
  created_at?: string;
}

export async function fetchParcelsFromDB(): Promise<{
  active: DeliveryItem[];
  history: DeliveryItem[];
}> {
  try {
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        active: FALLBACK_DELIVERIES,
        history: FALLBACK_HISTORY,
      };
    }

    const allParcels: DeliveryItem[] = (
      data as unknown as SupabaseParcelRow[]
    ).map((row) => ({
      id: row.id,
      status: (row.status || "looking_for_courier") as DeliveryItem["status"],
      arrivalTime: row.arrival_time || "Within 45 min",
      cardColor: (row.card_color || "green") as DeliveryItem["cardColor"],
      origin: row.pickup_address,
      destination: row.delivery_address,
      weight: row.weight_kg ? `${row.weight_kg} kg` : "1.5 kg",
      serviceType: row.package_type || "Express Parcel",
      receiverName: row.receiver_name,
      receiverPhone: row.receiver_phone,
    }));

    const active = allParcels.filter((p) => p.status !== "received");
    const history = allParcels.filter((p) => p.status === "received");

    return {
      active: active.length > 0 ? active : FALLBACK_DELIVERIES,
      history: history.length > 0 ? history : FALLBACK_HISTORY,
    };
  } catch {
    return {
      active: FALLBACK_DELIVERIES,
      history: FALLBACK_HISTORY,
    };
  }
}

export async function insertParcelToDB(
  parcel: DeliveryItem,
  receiverName = "Emily Carter",
  receiverPhone = "+880 1700-000000"
): Promise<boolean> {
  try {
    const row = {
      id: parcel.id,
      receiver_name: receiverName || "Emily Carter",
      receiver_phone: receiverPhone || "+880 1700-000000",
      pickup_address: parcel.origin || "Road 27, Dhanmondi, Dhaka",
      delivery_address: parcel.destination || "Road 103, Gulshan 2, Dhaka",
      status: parcel.status || "looking_for_courier",
      arrival_time: parcel.arrivalTime || "Within 45 min",
      card_color: parcel.cardColor || "green",
      package_type: parcel.serviceType || "Express Parcel",
      weight_kg: 1.5,
      is_fragile: true,
      handling_notes:
        "Please ensure the package is handled with care - fragile items inside.",
    };

    const { error } = await supabase.from("parcels").insert([row]);
    if (error) {
      console.warn("Supabase insert error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Supabase insert exception:", err);
    return false;
  }
}

export async function updateParcelStatusInDB(
  id: string,
  newStatus: DeliveryItem["status"]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("parcels")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.warn("Supabase update error:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchOrderDetailsFromDB(
  id: string
): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const fallback = [...FALLBACK_DELIVERIES, ...FALLBACK_HISTORY].find(
        (p) => p.id === id
      );
      if (fallback) {
        return {
          trackingId: fallback.id,
          status: fallback.status,
          cardColor: fallback.cardColor,
          spec: {
            service: fallback.serviceType || "Express Parcel",
            receiver: "Emily Carter",
            address: fallback.destination || "2210 Coral Way, Apt 3C (Dhaka Hub)",
            packageType: `${fallback.serviceType || "Merchandise"} (${fallback.weight || "1.8 kg"})`,
            paymentMethod: "Cash on Delivery (৳250)",
            handlingNote:
              "Please ensure the package is handled with care - fragile items inside.",
          },
        };
      }
      return null;
    }

    const row = data as unknown as SupabaseParcelRow;
    return {
      trackingId: row.id,
      status: (row.status || "looking_for_courier") as DeliveryItem["status"],
      cardColor: (row.card_color || "green") as DeliveryItem["cardColor"],
      spec: {
        service: row.package_type || "Express Parcel",
        receiver: row.receiver_name || "Emily Carter",
        address: row.delivery_address || "2210 Coral Way, Apt 3C (Dhaka Hub)",
        packageType: `${row.package_type || "Merchandise"} (${row.weight_kg ? `${row.weight_kg} kg` : "1.8 kg"})`,
        paymentMethod: "Cash on Delivery (৳250)",
        handlingNote:
          row.handling_notes ||
          "Please ensure the package is handled with care - fragile items inside.",
      },
    };
  } catch {
    return null;
  }
}
