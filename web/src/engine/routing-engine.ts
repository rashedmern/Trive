import type { LatLng, NearbyCourier } from "../types/delivery";

export interface RouteResult {
  algorithm: string;
  nodeCount: number;
  computeLatencyMs: number;
  distance: string;
  distanceKm: number;
  duration: string;
  eta: string;
  originName: string;
  destName: string;
  coordinates: LatLng[];
  turnInstructions: string[];
}

export interface DhakaGraphNode {
  id: string;
  name: string;
  aliases: string[];
  coord: LatLng;
}

// 14 Major Dhaka Logistics Network Intersections
export const DHAKA_NODES: Record<string, DhakaGraphNode> = {
  dhanmondi: {
    id: "dhanmondi",
    name: "Road 27, Dhanmondi",
    aliases: ["dhanmondi", "kalabagan", "sobhahanbagh", "sukrabad", "russell square"],
    coord: { latitude: 23.7509, longitude: 90.3754 },
  },
  farmgate: {
    id: "farmgate",
    name: "Farmgate Junction",
    aliases: ["farmgate", "tejturi", "ananda", "khamarbari", "green road"],
    coord: { latitude: 23.7570, longitude: 90.3890 },
  },
  bijoy_sarani: {
    id: "bijoy_sarani",
    name: "Bijoy Sarani / PMO",
    aliases: ["bijoy sarani", "bijoysarani", "novo theatre", "military museum", "pm office"],
    coord: { latitude: 23.7660, longitude: 90.3880 },
  },
  agargaon: {
    id: "agargaon",
    name: "Agargaon Metro Hub",
    aliases: ["agargaon", "passport office", "idb", "bcs", "taltola", "election commission", "parjatan"],
    coord: { latitude: 23.7785, longitude: 90.3800 },
  },
  mirpur: {
    id: "mirpur",
    name: "Mirpur 10 Circle",
    aliases: ["mirpur", "mirpur 10", "mirpur 1", "mirpur 2", "pallabi", "kazipara", "shewrapara"],
    coord: { latitude: 23.8071, longitude: 90.3686 },
  },
  tejgaon: {
    id: "tejgaon",
    name: "Tejgaon Industrial Area",
    aliases: ["tejgaon", "nabisco", "tivoli", "satrasta", "shaheed tajuddin", "love road"],
    coord: { latitude: 23.7620, longitude: 90.3950 },
  },
  mohakhali: {
    id: "mohakhali",
    name: "Mohakhali Flyover Terminal",
    aliases: ["mohakhali", "dohs", "icddrb", "amtoli", "wireless", "raowa"],
    coord: { latitude: 23.7776, longitude: 90.4054 },
  },
  banani: {
    id: "banani",
    name: "Banani 11 Junction",
    aliases: ["banani", "road 11", "kakoli", "kemal ataturk", "banani club", "sheraton"],
    coord: { latitude: 23.7937, longitude: 90.4043 },
  },
  gulshan_2: {
    id: "gulshan_2",
    name: "Gulshan 2 (Road 103)",
    aliases: ["gulshan 2", "gulshan-2", "gulshan2", "road 103", "coral way", "diplomatic zone"],
    coord: { latitude: 23.7925, longitude: 90.4078 },
  },
  gulshan_1: {
    id: "gulshan_1",
    name: "Gulshan 1 Circle",
    aliases: ["gulshan 1", "gulshan-1", "gulshan1", "shooting club", "police plaza"],
    coord: { latitude: 23.7780, longitude: 90.4160 },
  },
  badda: {
    id: "badda",
    name: "Badda (Pragati Sarani)",
    aliases: ["badda", "middle badda", "uttar badda", "south badda", "pragati sarani", "suvastu", "notun bazar"],
    coord: { latitude: 23.7805, longitude: 90.4267 },
  },
  rampura: {
    id: "rampura",
    name: "Rampura Bridge / Hatirjheel",
    aliases: ["rampura", "hatirjheel", "banasree", "aftabnagar", "dIT road", "malibagh"],
    coord: { latitude: 23.7610, longitude: 90.4200 },
  },
  motijheel: {
    id: "motijheel",
    name: "Motijheel Commercial Area",
    aliases: ["motijheel", "dilkusha", "shapla chattar", "paltan", "baitul mukarram", "gulisthan", "kamalapur"],
    coord: { latitude: 23.7330, longitude: 90.4172 },
  },
  uttara: {
    id: "uttara",
    name: "Uttara Sector 7 Depot",
    aliases: ["uttara", "sector 7", "sector 3", "airport", "jasimuddin", "house building", "azampur"],
    coord: { latitude: 23.8759, longitude: 90.3795 },
  },
};

// Road Network Edges [nodeA, nodeB, distanceKm]
const DHAKA_EDGES: [string, string, number][] = [
  ["dhanmondi", "farmgate", 2.2],
  ["farmgate", "bijoy_sarani", 1.2],
  ["farmgate", "tejgaon", 1.5],
  ["farmgate", "motijheel", 4.1],
  ["bijoy_sarani", "agargaon", 1.8],
  ["bijoy_sarani", "mohakhali", 2.1],
  ["agargaon", "mirpur", 3.5],
  ["mohakhali", "banani", 1.9],
  ["mohakhali", "gulshan_1", 1.8],
  ["mohakhali", "tejgaon", 1.7],
  ["banani", "gulshan_2", 1.4],
  ["banani", "uttara", 8.9],
  ["gulshan_2", "gulshan_1", 1.7],
  ["gulshan_1", "badda", 1.4],
  ["badda", "rampura", 2.3],
  ["badda", "uttara", 9.5],
  ["rampura", "tejgaon", 2.6],
  ["rampura", "motijheel", 3.8],
];

// Helper to resolve any user string into a Dhaka Graph node
export function resolveDhakaLocation(query?: string): DhakaGraphNode {
  if (!query || typeof query !== "string") {
    return DHAKA_NODES.dhanmondi;
  }

  const clean = query.toLowerCase().trim();

  // 1. Direct match on ID or Name
  for (const node of Object.values(DHAKA_NODES)) {
    if (clean === node.id || clean.includes(node.id)) {
      return node;
    }
    for (const alias of node.aliases) {
      if (clean.includes(alias)) {
        return node;
      }
    }
  }

  // 2. Deterministic fallback if completely custom
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const keys = Object.keys(DHAKA_NODES);
  const selectedKey = keys[Math.abs(hash) % keys.length];
  return DHAKA_NODES[selectedKey];
}

// Pure Dijkstra Algorithm on Dhaka Road Network
function runDijkstra(startId: string, endId: string): string[] {
  if (startId === endId) return [startId];

  // Build Adjacency List
  const adj = new Map<string, { to: string; weight: number }[]>();
  for (const key of Object.keys(DHAKA_NODES)) {
    adj.set(key, []);
  }

  for (const [u, v, w] of DHAKA_EDGES) {
    adj.get(u)?.push({ to: v, weight: w });
    adj.get(v)?.push({ to: u, weight: w });
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const key of Object.keys(DHAKA_NODES)) {
    dist.set(key, Infinity);
    prev.set(key, null);
  }

  dist.set(startId, 0);

  // Min-Heap simulation
  while (visited.size < Object.keys(DHAKA_NODES).length) {
    let u: string | null = null;
    let minD = Infinity;

    for (const [key, d] of dist.entries()) {
      if (!visited.has(key) && d < minD) {
        minD = d;
        u = key;
      }
    }

    if (!u || minD === Infinity || u === endId) break;
    visited.add(u);

    for (const edge of adj.get(u) || []) {
      if (!visited.has(edge.to)) {
        const alt = minD + edge.weight;
        if (alt < (dist.get(edge.to) || Infinity)) {
          dist.set(edge.to, alt);
          prev.set(edge.to, u);
        }
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = endId;
  while (curr) {
    path.unshift(curr);
    curr = prev.get(curr) || null;
  }

  if (path[0] !== startId) {
    return [startId, endId]; // Direct fallback line
  }

  return path;
}

const NEARBY_COURIERS: NearbyCourier[] = [
  {
    id: "courier-1",
    name: "Carlos R.",
    zoneName: "Agargaon / Dhanmondi",
    latitude: 23.7740,
    longitude: 90.3810,
    distanceMiles: 0.4,
    etaMinutes: 4,
    rating: 4.9,
    vehicleType: "scooter",
  },
  {
    id: "courier-2",
    name: "Alex M.",
    zoneName: "Mohakhali / Tejgaon",
    latitude: 23.7770,
    longitude: 90.4040,
    distanceMiles: 1.1,
    etaMinutes: 8,
    rating: 4.8,
    vehicleType: "van",
  },
  {
    id: "courier-3",
    name: "Tanvir H.",
    zoneName: "Badda / Gulshan Link",
    latitude: 23.7810,
    longitude: 90.4220,
    distanceMiles: 1.6,
    etaMinutes: 12,
    rating: 5.0,
    vehicleType: "scooter",
  },
];

export const RoutingEngine = {
  calculateRoute(
    originAddress = "Road 27, Dhanmondi, Dhaka",
    destinationAddress = "2210 Coral Way, Apt 3C (Dhaka Hub)"
  ): RouteResult {
    const startTime = performance.now();

    // 1. Resolve locations dynamically
    const originNode = resolveDhakaLocation(originAddress);
    const destNode = resolveDhakaLocation(destinationAddress);

    // If both resolve to the same node, pick a sensible adjacent node
    let finalDestNode = destNode;
    if (originNode.id === destNode.id) {
      finalDestNode = originNode.id === "dhanmondi" ? DHAKA_NODES.gulshan_2 : DHAKA_NODES.badda;
    }

    // 2. Execute Dijkstra Shortest Path on Graph
    const pathNodeIds = runDijkstra(originNode.id, finalDestNode.id);

    // 3. Map to coordinates
    const coordinates: LatLng[] = pathNodeIds.map(
      (nodeId) => DHAKA_NODES[nodeId].coord
    );

    // Calculate approximate road distance (sum of edge weights)
    let totalKm = 0;
    for (let i = 0; i < pathNodeIds.length - 1; i++) {
      const u = pathNodeIds[i];
      const v = pathNodeIds[i + 1];
      const edge = DHAKA_EDGES.find(
        (e) => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u)
      );
      totalKm += edge ? edge[2] : 2.5;
    }
    if (totalKm === 0) totalKm = 3.2;

    const miles = (totalKm * 0.621371).toFixed(1);
    const durationMinutes = Math.max(5, Math.round(totalKm * 2.8));

    // Dynamic Turn Instructions based on path
    const instructions: string[] = [
      `Head from pickup: ${originNode.name}`,
    ];

    for (let i = 1; i < pathNodeIds.length - 1; i++) {
      const midNode = DHAKA_NODES[pathNodeIds[i]];
      instructions.push(`Follow main road through ${midNode.name}`);
    }

    instructions.push(`Turn into destination sector: ${finalDestNode.name}`);
    instructions.push("Arrive at delivery address on the right");

    const latency = Number((performance.now() - startTime + 0.002).toFixed(3));

    // Current time + duration
    const now = new Date();
    now.setMinutes(now.getMinutes() + durationMinutes);
    const etaFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      algorithm: "Dijkstra [Engine]",
      nodeCount: pathNodeIds.length,
      computeLatencyMs: latency,
      distance: `${miles} mile (${totalKm.toFixed(1)} km)`,
      distanceKm: totalKm,
      duration: `${durationMinutes} min`,
      eta: etaFormatted,
      originName: originAddress || originNode.name,
      destName: destinationAddress || finalDestNode.name,
      coordinates,
      turnInstructions: instructions,
    };
  },

  getNearbyCouriers(): NearbyCourier[] {
    return NEARBY_COURIERS;
  },
};
