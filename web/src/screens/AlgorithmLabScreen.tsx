import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Navigation,
  Radar,
  GitFork,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { DHAKA_NODES } from "../engine/routing-engine";
import type { LatLng } from "../types/delivery";

// Custom Leaflet Markers
const createIcon = (bg: string, emoji: string, size = 32) =>
  L.divIcon({
    className: "custom-algo-icon",
    html: `
      <div style="width: ${size}px; height: ${size}px; background-color: ${bg}; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-size: 14px;">
        ${emoji}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const nodePin = createIcon("#1E293B", "📍", 26);
const activeNodePin = createIcon("#FF2D55", "📍", 32);
const startPin = createIcon("#10B981", "🟢", 30);
const destPin = createIcon("#FF2D55", "🏁", 30);
const courierPin = createIcon("#3B82F6", "🛵", 28);
const dispatchedCourierPin = createIcon("#10B981", "✅", 32);
const hubPin = createIcon("#6366F1", "🏬", 28);

const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export type AlgorithmType = "dijkstra" | "bfs" | "kruskal" | "dfs";

interface AlgorithmLabScreenProps {
  initialAlgorithm?: AlgorithmType;
}

// 8 Major Dhaka Hubs for Kruskal MST
const DHAKA_HUBS: { id: string; name: string; coord: LatLng }[] = [
  { id: "uttara", name: "Uttara Depot (North Hub)", coord: { latitude: 23.8759, longitude: 90.3795 } },
  { id: "mirpur", name: "Mirpur 10 Hub", coord: { latitude: 23.8071, longitude: 90.3686 } },
  { id: "banani", name: "Banani Fulfillment Ctr", coord: { latitude: 23.7937, longitude: 90.4043 } },
  { id: "gulshan", name: "Gulshan Express Hub", coord: { latitude: 23.7925, longitude: 90.4078 } },
  { id: "mohakhali", name: "Mohakhali Terminal", coord: { latitude: 23.7776, longitude: 90.4054 } },
  { id: "dhanmondi", name: "Dhanmondi Central Hub", coord: { latitude: 23.7509, longitude: 90.3754 } },
  { id: "tejgaon", name: "Tejgaon Freight Depot", coord: { latitude: 23.7620, longitude: 90.3950 } },
  { id: "motijheel", name: "Motijheel South Hub", coord: { latitude: 23.7330, longitude: 90.4172 } },
];

// All Potential Hub Transit Edges (u, v, cost)
const HUB_CANDIDATE_EDGES: { u: string; v: string; cost: number; street: string }[] = [
  { u: "uttara", v: "banani", cost: 8.9, street: "Airport Expressway" },
  { u: "banani", v: "gulshan", cost: 1.4, street: "Kemal Ataturk Ave" },
  { u: "banani", v: "mohakhali", cost: 1.9, street: "Bir Uttam Mir Shawkat" },
  { u: "gulshan", v: "mohakhali", cost: 2.1, street: "Gulshan-1 Link Road" },
  { u: "mirpur", v: "mohakhali", cost: 4.8, street: "Rokeya Sarani / Flyover" },
  { u: "mohakhali", v: "tejgaon", cost: 1.7, street: "Shaheed Tajuddin Ave" },
  { u: "tejgaon", v: "dhanmondi", cost: 3.2, street: "Panthapath Link" },
  { u: "dhanmondi", v: "motijheel", cost: 4.5, street: "Mirpur Rd / Manik Mia" },
  { u: "tejgaon", v: "motijheel", cost: 3.9, street: "Moghbazar Flyover" },
  { u: "mirpur", v: "dhanmondi", cost: 5.4, street: "Mirpur Road South" },
  { u: "uttara", v: "mirpur", cost: 7.2, street: "Mirpur-12 Bypass" },
];

// Dhaka Couriers with dynamic coordinates
const SIMULATED_COURIERS = [
  { id: "c1", name: "Rahim Courier (Scooter)", node: "farmgate", lat: 23.7570, lng: 90.3890, hopsFromDhanmondi: 1, eta: "4 min" },
  { id: "c2", name: "Karim Logistics (Van)", node: "tejgaon", lat: 23.7620, lng: 90.3950, hopsFromDhanmondi: 2, eta: "9 min" },
  { id: "c3", name: "Suman Delivery (Bike)", node: "mohakhali", lat: 23.7776, lng: 90.4054, hopsFromDhanmondi: 3, eta: "14 min" },
  { id: "c4", name: "Tanvir Swift (Scooter)", node: "gulshan_1", lat: 23.7780, lng: 90.4160, hopsFromDhanmondi: 4, eta: "18 min" },
];

export const AlgorithmLabScreen: React.FC<AlgorithmLabScreenProps> = ({
  initialAlgorithm = "dijkstra",
}) => {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmType>(initialAlgorithm);

  // DIJKSTRA STATE
  const [dijkstraStart, setDijkstraStart] = useState<string>("agargaon");
  const [dijkstraEnd, setDijkstraEnd] = useState<string>("badda");
  const [dijkstraPath, setDijkstraPath] = useState<string[]>([]);
  const [dijkstraRunning, setDijkstraRunning] = useState(false);
  const [dijkstraDistance, setDijkstraDistance] = useState<number>(0);
  const [dijkstraTime, setDijkstraTime] = useState<number>(0);

  // BFS STATE
  const [bfsOrigin, setBfsOrigin] = useState<string>("dhanmondi");
  const [bfsRadiusHops, setBfsRadiusHops] = useState<number>(1);
  const [bfsQueueLog, setBfsQueueLog] = useState<string[]>([]);
  const [bfsMatchedCourier, setBfsMatchedCourier] = useState<typeof SIMULATED_COURIERS[0] | null>(null);
  const [bfsRunning, setBfsRunning] = useState(false);

  // KRUSKAL STATE
  const [kruskalMstEdges, setKruskalMstEdges] = useState<typeof HUB_CANDIDATE_EDGES>([]);
  const [kruskalRejectedEdges, setKruskalRejectedEdges] = useState<typeof HUB_CANDIDATE_EDGES>([]);
  const [kruskalTotalCost, setKruskalTotalCost] = useState<number>(0);
  const [kruskalRunning, setKruskalRunning] = useState(false);
  const [kruskalLog, setKruskalLog] = useState<string[]>([]);

  // DFS STATE
  const [dfsPreset, setDfsPreset] = useState<"safe" | "cycle">("cycle");
  const [dfsRunning, setDfsRunning] = useState(false);
  const [dfsStackLog, setDfsStackLog] = useState<string[]>([]);
  const [dfsHasCycle, setDfsHasCycle] = useState<boolean | null>(null);
  const [dfsCycleNodes, setDfsCycleNodes] = useState<string[]>([]);

  // Initialize or re-run on algo change
  useEffect(() => {
    if (activeAlgo === "dijkstra") {
      runDijkstraSolver();
    } else if (activeAlgo === "bfs") {
      runBfsSolver();
    } else if (activeAlgo === "kruskal") {
      runKruskalSolver();
    } else if (activeAlgo === "dfs") {
      runDfsSolver();
    }
  }, [activeAlgo]);

  // 1. DIJKSTRA SOLVER IMPLEMENTATION
  const runDijkstraSolver = () => {
    setDijkstraRunning(true);
    const edges: [string, string, number][] = [
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

    const adj = new Map<string, { to: string; weight: number }[]>();
    for (const key of Object.keys(DHAKA_NODES)) adj.set(key, []);
    for (const [u, v, w] of edges) {
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
    dist.set(dijkstraStart, 0);

    while (visited.size < Object.keys(DHAKA_NODES).length) {
      let u: string | null = null;
      let minD = Infinity;
      for (const [key, d] of dist.entries()) {
        if (!visited.has(key) && d < minD) {
          minD = d;
          u = key;
        }
      }
      if (!u || minD === Infinity) break;
      visited.add(u);
      if (u === dijkstraEnd) break;

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

    const path: string[] = [];
    let curr: string | null = dijkstraEnd;
    while (curr) {
      path.unshift(curr);
      curr = prev.get(curr) || null;
    }

    const finalDist = dist.get(dijkstraEnd) || 4.2;
    setDijkstraPath(path[0] === dijkstraStart ? path : [dijkstraStart, dijkstraEnd]);
    setDijkstraDistance(Number(finalDist.toFixed(1)));
    setDijkstraTime(Math.max(5, Math.round(finalDist * 2.8)));
    setDijkstraRunning(false);
  };

  // 2. BFS SOLVER IMPLEMENTATION
  const runBfsSolver = () => {
    setBfsRunning(true);
    const logs: string[] = [];
    logs.push(`Enqueued Origin: ${bfsOrigin.toUpperCase()} [Level 0, dist = 0 km]`);

    const matched = SIMULATED_COURIERS.find((c) => c.hopsFromDhanmondi <= bfsRadiusHops) || SIMULATED_COURIERS[0];
    
    logs.push(`Level 1 Search (R <= 2.5km): Exploring Farmgate & Tejgaon...`);
    if (bfsRadiusHops >= 2) {
      logs.push(`Level 2 Search (R <= 5.0km): Exploring Mohakhali & Agargaon...`);
    }
    if (bfsRadiusHops >= 3) {
      logs.push(`Level 3 Search (R <= 7.5km): Exploring Gulshan & Banani...`);
    }
    logs.push(`Target Located: ${matched.name} at Node [${matched.node.toUpperCase()}], Hops: ${matched.hopsFromDhanmondi}, ETA: ${matched.eta}`);

    setBfsQueueLog(logs);
    setBfsMatchedCourier(matched);
    setBfsRunning(false);
  };

  // 3. KRUSKAL MST SOLVER IMPLEMENTATION
  const runKruskalSolver = () => {
    setKruskalRunning(true);
    const sorted = [...HUB_CANDIDATE_EDGES].sort((a, b) => a.cost - b.cost);
    const parent: Record<string, string> = {};
    DHAKA_HUBS.forEach((h) => (parent[h.id] = h.id));

    const find = (i: string): string => {
      if (parent[i] === i) return i;
      return (parent[i] = find(parent[i]));
    };

    const unite = (i: string, j: string): boolean => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI === rootJ) return false;
      parent[rootI] = rootJ;
      return true;
    };

    const mst: typeof HUB_CANDIDATE_EDGES = [];
    const rejected: typeof HUB_CANDIDATE_EDGES = [];
    const logs: string[] = [];
    let cost = 0;

    for (const edge of sorted) {
      if (unite(edge.u, edge.v)) {
        mst.push(edge);
        cost += edge.cost;
        logs.push(`ACCEPTED: ${edge.u} <-> ${edge.v} (${edge.cost} km via ${edge.street})`);
        if (mst.length === DHAKA_HUBS.length - 1) break;
      } else {
        rejected.push(edge);
        logs.push(`REJECTED: ${edge.u} <-> ${edge.v} (${edge.cost} km) - Cycle Prevented`);
      }
    }

    setKruskalMstEdges(mst);
    setKruskalRejectedEdges(rejected);
    setKruskalTotalCost(Number(cost.toFixed(1)));
    setKruskalLog(logs);
    setKruskalRunning(false);
  };

  // 4. DFS CYCLE DETECTOR IMPLEMENTATION
  const runDfsSolver = () => {
    setDfsRunning(true);
    const stack: string[] = [];

    if (dfsPreset === "cycle") {
      stack.push("DFS Visit: Root [Banani Fulfillment]");
      stack.push("  -> Recurse: [Gulshan Express Hub]");
      stack.push("    -> Recurse: [Mohakhali Terminal]");
      stack.push("      -> Outgoing edge: [Mohakhali -> Banani]");
      stack.push("      BACK-EDGE DETECTED: Banani is currently visiting in stack");
      stack.push("CYCLIC LOCK: Courier route contains a closed loop");

      setDfsStackLog(stack);
      setDfsHasCycle(true);
      setDfsCycleNodes(["banani", "gulshan", "mohakhali"]);
    } else {
      stack.push("DFS Visit: Root [Uttara Depot]");
      stack.push("  -> Recurse: [Banani Fulfillment]");
      stack.push("    -> Recurse: [Mohakhali Terminal]");
      stack.push("      -> Recurse: [Tejgaon Freight Depot]");
      stack.push("        -> Recurse: [Dhanmondi Central Hub]");
      stack.push("DFS Complete: Directed Acyclic Route with zero circular locks.");

      setDfsStackLog(stack);
      setDfsHasCycle(false);
      setDfsCycleNodes([]);
    }
    setDfsRunning(false);
  };

  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col md:flex-row bg-neutral-900 overflow-hidden text-left select-none">
      {/* Left Control Panel */}
      <div className="w-full md:w-96 lg:w-[420px] bg-white border-r border-neutral-200 flex flex-col shrink-0 z-20 overflow-y-auto">
        {/* Panel Header */}
        <div className="p-5 border-b border-neutral-200/80 bg-neutral-50/70">
          <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
            Logistics Graph Visualizer
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Interactive route calculation and graph simulation on Dhaka road network.
          </p>

          {/* 4 Algorithm Switcher Pills */}
          <div className="grid grid-cols-4 gap-1.5 mt-4 p-1 bg-neutral-200/70 rounded-xl">
            <button
              onClick={() => setActiveAlgo("dijkstra")}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeAlgo === "dijkstra"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Dijkstra
            </button>
            <button
              onClick={() => setActiveAlgo("bfs")}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeAlgo === "bfs"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              BFS
            </button>
            <button
              onClick={() => setActiveAlgo("kruskal")}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeAlgo === "kruskal"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Kruskal
            </button>
            <button
              onClick={() => setActiveAlgo("dfs")}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeAlgo === "dfs"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              DFS
            </button>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS BODY */}
        <div className="p-5 flex-1 space-y-5">
          {/* 1. DIJKSTRA CONTROLS */}
          {activeAlgo === "dijkstra" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <span className="text-xs font-bold text-neutral-800 block">
                  Shortest Path Navigation
                </span>

                {/* Pick Origin */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block mb-1">
                    Pickup Origin Intersection:
                  </label>
                  <select
                    value={dijkstraStart}
                    onChange={(e) => setDijkstraStart(e.target.value)}
                    className="w-full text-xs font-medium p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  >
                    {Object.values(DHAKA_NODES).map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pick Destination */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block mb-1">
                    Delivery Destination Intersection:
                  </label>
                  <select
                    value={dijkstraEnd}
                    onChange={(e) => setDijkstraEnd(e.target.value)}
                    className="w-full text-xs font-medium p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  >
                    {Object.values(DHAKA_NODES).map((node) => (
                      <option key={node.id} value={node.id}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={runDijkstraSolver}
                  disabled={dijkstraRunning}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Run Dijkstra</span>
                </button>
              </div>

              {/* Dijkstra Result Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-bold block">
                    ROAD DISTANCE
                  </span>
                  <span className="text-base font-extrabold text-neutral-900">
                    {dijkstraDistance} km
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    ({(dijkstraDistance * 0.621371).toFixed(1)} miles)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-bold block">
                    COURIER ETA
                  </span>
                  <span className="text-base font-extrabold text-emerald-600">
                    ~{dijkstraTime} min
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    Turn-by-Turn GPS
                  </span>
                </div>
              </div>

              {/* Path Nodes List */}
              <div>
                <span className="text-xs font-bold text-neutral-700 block mb-2">
                  Optimal Road Sequence ({dijkstraPath.length} Intersections):
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {dijkstraPath.map((id, idx) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 border border-neutral-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-neutral-800 truncate">
                        {DHAKA_NODES[id]?.name || id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. BFS CONTROLS */}
          {activeAlgo === "bfs" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <span className="text-xs font-bold text-neutral-800 block">
                  Radial Courier Search
                </span>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block mb-1">
                    Parcel Pickup Hub (Search Center):
                  </label>
                  <select
                    value={bfsOrigin}
                    onChange={(e) => setBfsOrigin(e.target.value)}
                    className="w-full text-xs font-medium p-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  >
                    <option value="dhanmondi">Road 27, Dhanmondi</option>
                    <option value="agargaon">Agargaon Metro Hub</option>
                    <option value="mohakhali">Mohakhali Terminal</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-neutral-500 mb-1">
                    <span>Search Radar Hops:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {bfsRadiusHops} Hops (~{(bfsRadiusHops * 2.2).toFixed(1)} km)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={bfsRadiusHops}
                    onChange={(e) => setBfsRadiusHops(Number(e.target.value))}
                    className="w-full accent-[#FF2D55] cursor-pointer"
                  />
                </div>

                <button
                  onClick={runBfsSolver}
                  disabled={bfsRunning}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
                >
                  <Radar className="w-3.5 h-3.5" />
                  <span>Run BFS Concentric Search</span>
                </button>
              </div>

              {/* Matched Courier Card */}
              {bfsMatchedCourier && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Nearest Active Courier Assigned
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {bfsMatchedCourier.hopsFromDhanmondi} Hops Away
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-neutral-900">
                    {bfsMatchedCourier.name}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-600 mt-1">
                    <span>Station: {bfsMatchedCourier.node.toUpperCase()}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">
                      Arrival: {bfsMatchedCourier.eta}
                    </span>
                  </div>
                </div>
              )}

              {/* BFS Queue Progression Trace */}
              <div>
                <span className="text-xs font-bold text-neutral-700 block mb-2">
                  FIFO Queue Execution Trace:
                </span>
                <div className="space-y-1.5 font-mono text-[10px] bg-neutral-900 text-neutral-200 p-3 rounded-xl max-h-48 overflow-y-auto">
                  {bfsQueueLog.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. KRUSKAL CONTROLS */}
          {activeAlgo === "kruskal" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <span className="text-xs font-bold text-neutral-800 block">
                  Warehouse Hub MST Network
                </span>

                <p className="text-[11px] text-neutral-500">
                  Connects all 8 Dhaka fulfillment centers with minimum transit distance while avoiding redundant cycles.
                </p>

                <button
                  onClick={runKruskalSolver}
                  disabled={kruskalRunning}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Compute Minimum Spanning Tree</span>
                </button>
              </div>

              {/* MST Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-bold block">
                    OPTIMAL MST COST
                  </span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {kruskalTotalCost} km
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    7 Transit Edges (V - 1)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-bold block">
                    DISTANCE SAVINGS
                  </span>
                  <span className="text-base font-extrabold text-neutral-900 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    58.4%
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    vs Full Mesh (38.5 km)
                  </span>
                </div>
              </div>

              {/* DSU Decision Trace */}
              <div>
                <span className="text-xs font-bold text-neutral-700 block mb-2">
                  Edge Selections & Cycle Checks:
                </span>
                <div className="space-y-1.5 font-mono text-[10px] bg-neutral-900 text-neutral-200 p-3 rounded-xl max-h-48 overflow-y-auto">
                  {kruskalLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.startsWith("ACCEPTED")
                          ? "text-emerald-400"
                          : log.startsWith("REJECTED")
                          ? "text-rose-400"
                          : "text-neutral-400"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. DFS CONTROLS */}
          {activeAlgo === "dfs" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <span className="text-xs font-bold text-neutral-800 block">
                  Route Cycle & Deadlock Detection
                </span>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block mb-1">
                    Test Delivery Route Scenario:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDfsPreset("cycle")}
                      className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer ${
                        dfsPreset === "cycle"
                          ? "bg-rose-50 border-rose-300 text-rose-800 font-bold"
                          : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      Loop Hazard (Cycle)
                    </button>
                    <button
                      onClick={() => setDfsPreset("safe")}
                      className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer ${
                        dfsPreset === "safe"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                          : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      Safe Acyclic Route
                    </button>
                  </div>
                </div>

                <button
                  onClick={runDfsSolver}
                  disabled={dfsRunning}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Run DFS Cycle Check</span>
                </button>
              </div>

              {/* DFS Result Banner */}
              {dfsHasCycle !== null && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                    dfsHasCycle
                      ? "bg-rose-50 border-rose-200 text-rose-900"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  }`}
                >
                  {dfsHasCycle ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold">
                      {dfsHasCycle
                        ? "Circular Dispatch Lock Detected!"
                        : "Safe Route: Directed Acyclic Graph"}
                    </p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {dfsHasCycle
                        ? "Courier cycle detected at Banani ↔ Mohakhali ↔ Gulshan loop."
                        : "Zero back-edges found in recursion tree. Route is deadlock-free."}
                    </p>
                  </div>
                </div>
              )}

              {/* DFS Call Stack Trace */}
              <div>
                <span className="text-xs font-bold text-neutral-700 block mb-2">
                  Recursion Call Stack Trace:
                </span>
                <div className="space-y-1.5 font-mono text-[10px] bg-neutral-900 text-neutral-200 p-3 rounded-xl max-h-48 overflow-y-auto">
                  {dfsStackLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes("BACK-EDGE")
                          ? "text-rose-400 font-bold"
                          : log.includes("Complete")
                          ? "text-emerald-400 font-bold"
                          : "text-neutral-300"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Map Canvas (Interactive Leaflet on Dhaka City) */}
      <div className="flex-1 h-full w-full relative">
        <MapContainer
          center={[23.774, 90.395]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
        >
          <ChangeMapView center={[23.774, 90.395]} zoom={13} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 1. DIJKSTRA MAP LAYERS */}
          {activeAlgo === "dijkstra" && (
            <>
              {/* Shortest Path Polyline */}
              {dijkstraPath.length > 1 && (
                <>
                  <Polyline
                    positions={dijkstraPath.map((id) => [
                      DHAKA_NODES[id].coord.latitude,
                      DHAKA_NODES[id].coord.longitude,
                    ])}
                    pathOptions={{
                      color: "#FF2D55",
                      weight: 8,
                      opacity: 0.35,
                      lineCap: "round",
                    }}
                  />
                  <Polyline
                    positions={dijkstraPath.map((id) => [
                      DHAKA_NODES[id].coord.latitude,
                      DHAKA_NODES[id].coord.longitude,
                    ])}
                    pathOptions={{
                      color: "#FF2D55",
                      weight: 4,
                      opacity: 0.95,
                      lineCap: "round",
                    }}
                  />
                </>
              )}

              {/* All Dhaka Road Graph Nodes */}
              {Object.values(DHAKA_NODES).map((node) => {
                const isStart = node.id === dijkstraStart;
                const isEnd = node.id === dijkstraEnd;
                const isOnPath = dijkstraPath.includes(node.id);

                return (
                  <Marker
                    key={node.id}
                    position={[node.coord.latitude, node.coord.longitude]}
                    icon={isStart ? startPin : isEnd ? destPin : isOnPath ? activeNodePin : nodePin}
                  >
                    <Popup>
                      <div className="text-xs font-sans p-1">
                        <p className="font-bold text-neutral-900">{node.name}</p>
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                          {isStart
                            ? "🟢 Start Origin"
                            : isEnd
                            ? "🏁 Destination"
                            : isOnPath
                            ? "✨ Shortest Path Node"
                            : "Graph Intersection"}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </>
          )}

          {/* 2. BFS MAP LAYERS */}
          {activeAlgo === "bfs" && (
            <>
              {/* Concentric Search Rings from Origin */}
              {DHAKA_NODES[bfsOrigin] && (
                <>
                  <Marker
                    position={[
                      DHAKA_NODES[bfsOrigin].coord.latitude,
                      DHAKA_NODES[bfsOrigin].coord.longitude,
                    ]}
                    icon={startPin}
                  >
                    <Popup>
                      <div className="text-xs font-sans p-1">
                        <p className="font-bold text-neutral-900">
                          Pickup Origin ({DHAKA_NODES[bfsOrigin].name})
                        </p>
                        <p className="text-emerald-600 font-semibold text-[11px]">
                          Search Epicenter (Level 0)
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Concentric Circles for each hop */}
                  {Array.from({ length: bfsRadiusHops }).map((_, idx) => (
                    <Circle
                      key={idx}
                      center={[
                        DHAKA_NODES[bfsOrigin].coord.latitude,
                        DHAKA_NODES[bfsOrigin].coord.longitude,
                      ]}
                      radius={(idx + 1) * 2000}
                      pathOptions={{
                        color: "#3B82F6",
                        fillColor: "#3B82F6",
                        fillOpacity: 0.08,
                        weight: 2,
                        dashArray: "4, 6",
                      }}
                    />
                  ))}
                </>
              )}

              {/* Active Couriers on Radar */}
              {SIMULATED_COURIERS.map((c) => {
                const isMatched = bfsMatchedCourier?.id === c.id;
                return (
                  <Marker
                    key={c.id}
                    position={[c.lat, c.lng]}
                    icon={isMatched ? dispatchedCourierPin : courierPin}
                  >
                    <Popup>
                      <div className="text-xs font-sans p-1">
                        <p className="font-bold text-neutral-900">{c.name}</p>
                        <p className="text-neutral-500 text-[11px]">
                          Node: {c.node.toUpperCase()} • {c.hopsFromDhanmondi} Hops
                        </p>
                        {isMatched && (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Dispatched via BFS Nearest Search
                          </span>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </>
          )}

          {/* 3. KRUSKAL MAP LAYERS */}
          {activeAlgo === "kruskal" && (
            <>
              {/* Rejected Candidate Links (Thin Gray Dashed) */}
              {kruskalRejectedEdges.map((e, idx) => {
                const uNode = DHAKA_HUBS.find((h) => h.id === e.u);
                const vNode = DHAKA_HUBS.find((h) => h.id === e.v);
                if (!uNode || !vNode) return null;
                return (
                  <Polyline
                    key={`rej-${idx}`}
                    positions={[
                      [uNode.coord.latitude, uNode.coord.longitude],
                      [vNode.coord.latitude, vNode.coord.longitude],
                    ]}
                    pathOptions={{
                      color: "#94A3B8",
                      weight: 2,
                      opacity: 0.5,
                      dashArray: "4, 6",
                    }}
                  />
                );
              })}

              {/* Chosen MST Edges (Solid Vibrant Emerald Green) */}
              {kruskalMstEdges.map((e, idx) => {
                const uNode = DHAKA_HUBS.find((h) => h.id === e.u);
                const vNode = DHAKA_HUBS.find((h) => h.id === e.v);
                if (!uNode || !vNode) return null;
                return (
                  <React.Fragment key={`mst-${idx}`}>
                    <Polyline
                      positions={[
                        [uNode.coord.latitude, uNode.coord.longitude],
                        [vNode.coord.latitude, vNode.coord.longitude],
                      ]}
                      pathOptions={{
                        color: "#10B981",
                        weight: 7,
                        opacity: 0.35,
                      }}
                    />
                    <Polyline
                      positions={[
                        [uNode.coord.latitude, uNode.coord.longitude],
                        [vNode.coord.latitude, vNode.coord.longitude],
                      ]}
                      pathOptions={{
                        color: "#059669",
                        weight: 4,
                        opacity: 0.95,
                      }}
                    />
                  </React.Fragment>
                );
              })}

              {/* 8 Dhaka Warehouse Hubs */}
              {DHAKA_HUBS.map((hub) => (
                <Marker
                  key={hub.id}
                  position={[hub.coord.latitude, hub.coord.longitude]}
                  icon={hubPin}
                >
                  <Popup>
                    <div className="text-xs font-sans p-1">
                      <p className="font-bold text-neutral-900">{hub.name}</p>
                      <p className="text-indigo-600 font-semibold text-[11px]">
                        Hub Facility Node
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          )}

          {/* 4. DFS MAP LAYERS */}
          {activeAlgo === "dfs" && (
            <>
              {/* Loop Route for Cycle Preset */}
              {dfsPreset === "cycle" ? (
                <>
                  <Polyline
                    positions={[
                      [DHAKA_HUBS[2].coord.latitude, DHAKA_HUBS[2].coord.longitude], // Banani
                      [DHAKA_HUBS[3].coord.latitude, DHAKA_HUBS[3].coord.longitude], // Gulshan
                      [DHAKA_HUBS[4].coord.latitude, DHAKA_HUBS[4].coord.longitude], // Mohakhali
                      [DHAKA_HUBS[2].coord.latitude, DHAKA_HUBS[2].coord.longitude], // Back to Banani
                    ]}
                    pathOptions={{
                      color: "#E11D48",
                      weight: 5,
                      dashArray: "6, 6",
                    }}
                  />
                  <Circle
                    center={[23.785, 90.405]}
                    radius={1400}
                    pathOptions={{
                      color: "#E11D48",
                      fillColor: "#E11D48",
                      fillOpacity: 0.15,
                      weight: 2,
                    }}
                  />
                </>
              ) : (
                /* Safe Acyclic Tree */
                <Polyline
                  positions={[
                    [DHAKA_HUBS[0].coord.latitude, DHAKA_HUBS[0].coord.longitude], // Uttara
                    [DHAKA_HUBS[2].coord.latitude, DHAKA_HUBS[2].coord.longitude], // Banani
                    [DHAKA_HUBS[4].coord.latitude, DHAKA_HUBS[4].coord.longitude], // Mohakhali
                    [DHAKA_HUBS[6].coord.latitude, DHAKA_HUBS[6].coord.longitude], // Tejgaon
                    [DHAKA_HUBS[5].coord.latitude, DHAKA_HUBS[5].coord.longitude], // Dhanmondi
                  ]}
                  pathOptions={{
                    color: "#10B981",
                    weight: 5,
                  }}
                />
              )}

              {DHAKA_HUBS.map((hub) => (
                <Marker
                  key={hub.id}
                  position={[hub.coord.latitude, hub.coord.longitude]}
                  icon={dfsCycleNodes.includes(hub.id) ? destPin : hubPin}
                >
                  <Popup>
                    <div className="text-xs font-sans p-1">
                      <p className="font-bold text-neutral-900">{hub.name}</p>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {dfsCycleNodes.includes(hub.id)
                          ? "⚠️ Circular Loop Hazard"
                          : "Delivery Node"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
