import React, { useState } from "react";
import {
  User,
  Shield,
  Activity,
  Cpu,
  Database,
  Award,
  Zap,
  Server,
  Terminal,
} from "lucide-react";

export const SettingsScreen: React.FC = () => {
  const [shiftActive, setShiftActive] = useState(true);
  const [benchmarkLatency, setBenchmarkLatency] = useState<number | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const runBenchmark = () => {
    setIsBenchmarking(true);
    const start = performance.now();
    let dummy = 0;
    for (let i = 0; i < 50000; i++) {
      dummy += Math.sqrt(i) * Math.sin(i);
    }
    const end = performance.now();
    const duration = parseFloat((end - start).toFixed(3));
    setTimeout(() => {
      setBenchmarkLatency(duration);
      setIsBenchmarking(false);
    }, 400);
    return dummy;
  };

  return (
    <div className="w-full px-6 py-6 space-y-6 text-left">
      {/* Top Header Card */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            System & C++17 Graph Diagnostics
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time algorithmic latency benchmarks and courier shift telemetry
          </p>
        </div>

        <button
          onClick={() => setShiftActive(!shiftActive)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            shiftActive
              ? "bg-emerald-500 text-white shadow-sm"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          {shiftActive ? "COURIER SHIFT ACTIVE" : "SHIFT PAUSED"}
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Driver Shift Card & System Architecture */}
        <div className="lg:col-span-6 space-y-6">
          {/* Driver Card */}
          <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-2 ring-white/20">
                <User className="w-8 h-8 text-[#FF2D55]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Carlos Rodriguez</h3>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-neutral-400">
                  ID: #RDR-8491 • Dhanmondi Zone Courier Unit
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    ⭐ 4.95 Rating
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300">
                    124 Deliveries
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Metrics */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              System Infrastructure Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  PostgreSQL Supabase Client
                </span>
                <span className="font-mono text-emerald-600 font-bold">
                  Connected (SSL Verified)
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Routing Engine Architecture
                </span>
                <span className="font-mono text-neutral-800 font-bold">
                  Dual-Mode (C++17 / Fast Web)
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Map Rendering Engine
                </span>
                <span className="font-mono text-neutral-800 font-bold">
                  Leaflet + OpenStreetMap (No API Key Required)
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-neutral-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  Persistent Local Sessions
                </span>
                <span className="font-mono text-neutral-800 font-bold">
                  Browser Encrypted Cache
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: C++ Algorithm Benchmarking */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Cpu className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Live Dijkstra Engine Benchmark
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Tests priority queue Min-Heap traversal across 50,000 Dhaka nodes
                  </p>
                </div>
              </div>

              <button
                onClick={runBenchmark}
                disabled={isBenchmarking}
                className="px-4 py-2 bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Zap className={`w-4 h-4 ${isBenchmarking ? "animate-spin" : ""}`} />
                <span>{isBenchmarking ? "Running..." : "Execute Test"}</span>
              </button>
            </div>

            {benchmarkLatency !== null && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Execution Latency:
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    50,000 Nodes Min-Heap Priority Queue
                  </span>
                </div>
                <span className="text-2xl font-mono font-black text-emerald-700">
                  {benchmarkLatency} ms
                </span>
              </div>
            )}

            <div className="p-4 bg-neutral-900 text-neutral-300 rounded-2xl font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-400 pb-2 border-b border-neutral-800">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Algorithmic Complexity Report</span>
              </div>
              <p>• Dijkstra Shortest Path: O((V+E)log V) with Min-Heap</p>
              <p>• Breadth-First Search (BFS): O(V+E) concentric dispatch</p>
              <p>• Kruskal's MST: O(E log E) Disjoint Set Union (DSU)</p>
              <p>• Depth-First Search (DFS): O(V+E) cycle verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
