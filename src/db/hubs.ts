import { supabase } from "@/db/supabase";

export interface DBHub {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

const FALLBACK_HUBS: DBHub[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Dhanmondi Hub",
    address: "Road 27, Dhanmondi, Dhaka",
    latitude: 23.7509,
    longitude: 90.3754,
    capacity: 8000,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Gulshan Hub",
    address: "Road 103, Gulshan 2, Dhaka",
    latitude: 23.7925,
    longitude: 90.4078,
    capacity: 12000,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Tejgaon Industrial Hub",
    address: "Tejgaon I/A, Dhaka",
    latitude: 23.7640,
    longitude: 90.3950,
    capacity: 15000,
  },
];

interface SupabaseHubRow {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

export async function fetchHubsFromDB(): Promise<DBHub[]> {
  try {
    const { data, error } = await supabase
      .from("hubs")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_HUBS;
    }

    return (data as unknown as SupabaseHubRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      capacity: Number(row.capacity || 5000),
    }));
  } catch {
    return FALLBACK_HUBS;
  }
}
