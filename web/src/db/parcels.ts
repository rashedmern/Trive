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
    receiverName: "Emily Carter",
    receiverPhone: "+880 1712-345678",
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
    receiverName: "Alex Morgan",
    receiverPhone: "+880 1823-456789",
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
    receiverName: "David Miller",
    receiverPhone: "+880 1934-567890",
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
    receiverName: "Emily Carter",
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
    receiverName: "Sarah Connor",
  },
];

const LOCAL_STORAGE_KEY = "trive_local_parcels";

function getLocalStoredParcels(): DeliveryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalStoredParcels(parcels: DeliveryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parcels));
  } catch {
    // quota exceeded fallback
  }
}

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
  const localList = getLocalStoredParcels();

  try {
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .order("created_at", { ascending: false });

    let dbParcels: DeliveryItem[] = [];

    if (!error && data && data.length > 0) {
      dbParcels = (data as unknown as SupabaseParcelRow[]).map((row) => ({
        id: row.id,
        status: (row.status || "looking_for_courier") as DeliveryItem["status"],
        arrivalTime: row.arrival_time || "Within 35 min",
        cardColor: (row.card_color || "green") as DeliveryItem["cardColor"],
        origin: row.pickup_address,
        destination: row.delivery_address,
        weight: row.weight_kg ? `${row.weight_kg} kg` : "1.5 kg",
        serviceType: row.package_type || "Express Parcel",
        receiverName: row.receiver_name,
        receiverPhone: row.receiver_phone,
      }));
    }

    // Merge: local custom parcels take top priority, followed by DB, followed by Fallback
    const combinedMap = new Map<string, DeliveryItem>();

    // 1. First add local user-created parcels
    localList.forEach((p) => combinedMap.set(p.id, p));

    // 2. Add DB parcels
    dbParcels.forEach((p) => {
      if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
    });

    // 3. Add default fallbacks if not present
    [...FALLBACK_DELIVERIES, ...FALLBACK_HISTORY].forEach((p) => {
      if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
    });

    const all = Array.from(combinedMap.values());
    const active = all.filter((p) => p.status !== "received");
    const history = all.filter((p) => p.status === "received");

    return {
      active: active.length > 0 ? active : FALLBACK_DELIVERIES,
      history: history.length > 0 ? history : FALLBACK_HISTORY,
    };
  } catch {
    const combinedMap = new Map<string, DeliveryItem>();
    localList.forEach((p) => combinedMap.set(p.id, p));
    [...FALLBACK_DELIVERIES, ...FALLBACK_HISTORY].forEach((p) => {
      if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
    });

    const all = Array.from(combinedMap.values());
    return {
      active: all.filter((p) => p.status !== "received"),
      history: all.filter((p) => p.status === "received"),
    };
  }
}

export async function insertParcelToDB(
  parcel: DeliveryItem,
  receiverName = "Emily Carter",
  receiverPhone = "+880 1700-000000"
): Promise<boolean> {
  // 1. Immediately store in local store so it NEVER vanishes
  const current = getLocalStoredParcels();
  const updated = [parcel, ...current.filter((p) => p.id !== parcel.id)];
  saveLocalStoredParcels(updated);

  // 2. Also push to Supabase PostgreSQL database
  try {
    const row = {
      id: parcel.id,
      receiver_name: receiverName || "Emily Carter",
      receiver_phone: receiverPhone || "+880 1700-000000",
      pickup_address: parcel.origin || "Road 27, Dhanmondi, Dhaka",
      delivery_address: parcel.destination || "Road 103, Gulshan 2, Dhaka",
      status: parcel.status || "looking_for_courier",
      arrival_time: parcel.arrivalTime || "Within 35 min",
      card_color: parcel.cardColor || "green",
      package_type: parcel.serviceType || "Express Parcel",
      weight_kg: 1.5,
      is_fragile: true,
      handling_notes:
        "Please ensure the package is handled with care - fragile items inside.",
    };

    const { error } = await supabase.from("parcels").insert([row]);
    if (error) {
      console.warn("Supabase insert error (fallback preserved):", error.message);
    }
    return true;
  } catch (err) {
    console.warn("Supabase insert exception (fallback preserved):", err);
    return true;
  }
}

export async function updateParcelStatusInDB(
  id: string,
  newStatus: DeliveryItem["status"]
): Promise<boolean> {
  // Update local store
  const current = getLocalStoredParcels();
  const found = current.find((p) => p.id === id);
  if (found) {
    found.status = newStatus;
    saveLocalStoredParcels(current);
  }

  try {
    const { error } = await supabase
      .from("parcels")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.warn("Supabase update error:", error.message);
    }
    return true;
  } catch {
    return true;
  }
}

export async function fetchOrderDetailsFromDB(
  id: string
): Promise<Order | null> {
  // Check local store first
  const localList = getLocalStoredParcels();
  const localMatch = localList.find((p) => p.id === id);
  if (localMatch) {
    return {
      trackingId: localMatch.id,
      status: localMatch.status,
      cardColor: localMatch.cardColor,
      spec: {
        service: localMatch.serviceType || "Express Parcel",
        receiver: localMatch.receiverName || "Emily Carter",
        address: localMatch.destination || "2210 Coral Way, Apt 3C (Dhaka Hub)",
        packageType: `${localMatch.serviceType || "Express Parcel"} (${localMatch.weight || "1.5 kg"})`,
        paymentMethod: "Cash on Delivery (৳250)",
        handlingNote:
          "Please ensure the package is handled with care - fragile items inside.",
      },
    };
  }

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
            receiver: fallback.receiverName || "Emily Carter",
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
