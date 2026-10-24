import { supabase } from "@/db/supabase";

export interface DBCourier {
  id: string;
  name?: string;
  vehicleType: "motorcycle" | "bicycle" | "van";
  vehiclePlate?: string;
  isOnline: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  totalDeliveries: number;
}

const FALLBACK_COURIERS: DBCourier[] = [
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Carlos Ramirez",
    vehicleType: "motorcycle",
    vehiclePlate: "DHAKA METRO HA-5821",
    isOnline: true,
    latitude: 23.7750,
    longitude: 90.3950,
    rating: 4.95,
    totalDeliveries: 342,
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    name: "Tanvir Ahmed",
    vehicleType: "bicycle",
    vehiclePlate: "DHAKA METRO KHA-1102",
    isOnline: true,
    latitude: 23.7620,
    longitude: 90.3880,
    rating: 4.88,
    totalDeliveries: 198,
  },
];

interface SupabaseCourierRow {
  id: string;
  vehicle_type?: "motorcycle" | "bicycle" | "van";
  vehicle_plate?: string;
  is_online?: boolean;
  current_lat?: number;
  current_lng?: number;
  rating?: number;
  total_deliveries?: number;
  users?: { full_name?: string };
}

export async function fetchOnlineCouriersFromDB(): Promise<DBCourier[]> {
  try {
    const { data, error } = await supabase
      .from("couriers")
      .select("*, users(full_name)")
      .eq("is_online", true);

    if (error || !data || data.length === 0) {
      return FALLBACK_COURIERS;
    }

    return (data as unknown as SupabaseCourierRow[]).map((row) => ({
      id: row.id,
      name: row.users?.full_name || "Verified Courier",
      vehicleType: row.vehicle_type || "motorcycle",
      vehiclePlate: row.vehicle_plate,
      isOnline: Boolean(row.is_online),
      latitude: row.current_lat || 23.7750,
      longitude: row.current_lng || 90.3950,
      rating: Number(row.rating || 5.0),
      totalDeliveries: Number(row.total_deliveries || 0),
    }));
  } catch {
    return FALLBACK_COURIERS;
  }
}
