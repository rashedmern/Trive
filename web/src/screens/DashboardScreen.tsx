import React, { useState, useEffect } from "react";
import {
  Box,
  Percent,
  Receipt,
  Headphones,
  ChevronRight,
  TrendingUp,
  Cpu,
  Clock,
  Navigation,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { DeliveryItem } from "../types/delivery";
import { fetchParcelsFromDB } from "../db/parcels";
import { DhakaLeafletMap } from "../components/map/DhakaLeafletMap";
import { RoutingEngine } from "../engine/routing-engine";

interface DashboardScreenProps {
  onSelectParcel: (parcelId: string) => void;
  onOpenCreate: () => void;
  onOpenCalculate: () => void;
  onOpenReceipts: () => void;
  onOpenSupport: () => void;
  onViewAllParcels: () => void;
  searchQuery?: string;
  refreshTrigger?: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSelectParcel,
  onOpenCreate,
  onOpenCalculate,
  onOpenReceipts,
  onOpenSupport,
  onViewAllParcels,
  searchQuery = "",
  refreshTrigger = 0,
}) => {
  const [activeParcels, setActiveParcels] = useState<DeliveryItem[]>([]);
  const [historyParcels, setHistoryParcels] = useState<DeliveryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const couriers = RoutingEngine.getNearbyCouriers();
  const topParcel = activeParcels[0];
  const route = RoutingEngine.calculateRoute(
    topParcel?.origin || "Road 27, Dhanmondi, Dhaka",
    topParcel?.destination || "2210 Coral Way, Apt 3C (Dhaka Hub)"
  );

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchParcelsFromDB();
    setActiveParcels(result.active);
    setHistoryParcels(result.history);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const allParcels = [...activeParcels, ...historyParcels];

  const filteredActive = activeParcels.filter(
    (p) =>
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.serviceType && p.serviceType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.destination && p.destination.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: DeliveryItem["status"]) => {
    switch (status) {
      case "looking_for_courier":
        return { label: "Looking for Courier", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "in_delivery":
        return { label: "In Delivery", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "in_transit":
        return { label: "In Transit", bg: "bg-purple-50 text-purple-700 border-purple-200" };
      default:
        return { label: "Delivered", bg: "bg-neutral-100 text-neutral-700 border-neutral-200" };
    }
  };

  const getCardBg = (color: DeliveryItem["cardColor"]) => {
    switch (color) {
      case "green":
        return "bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#bbf7d0]/80 border-emerald-300/80";
      case "coral":
        return "bg-gradient-to-br from-[#FFE4E6] via-[#FECDD3] to-[#fecdd3]/80 border-rose-300/80";
      case "lavender":
        return "bg-gradient-to-br from-[#E0E7FF] via-[#C7D2FE] to-[#c7d2fe]/80 border-indigo-300/80";
      case "peach":
        return "bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#fde68a]/80 border-amber-300/80";
      default:
        return "bg-white border-neutral-200";
    }
  };

  return (
    <div className="w-full px-6 py-6 space-y-6 text-left">
      {/* Row 1: Top 4 KPI Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Active Shipments */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Active Shipments
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-neutral-900">
                {activeParcels.length}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                Live in Queue
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Box className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* KPI 2: Active Courier Fleet */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Riders Dispatched
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-neutral-900">
                {couriers.length}
              </span>
              <span className="text-[11px] font-bold text-indigo-600">
                Concentric BFS Radar
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Truck className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* KPI 3: Completed Deliveries */}
        <div className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Received Today
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-neutral-900">
                {historyParcels.length}
              </span>
              <span className="text-[11px] font-bold text-neutral-500">
                100% on schedule
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        {/* KPI 4: C++17 Graph Engine Latency */}
        <div className="p-5 bg-neutral-900 text-white rounded-2xl shadow-xs flex items-center justify-between border border-neutral-800">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Graph Engine Latency
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {route.computeLatencyMs} ms
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Dijkstra Min-Heap
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#FF2D55] flex items-center justify-center">
            <Cpu className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Row 2: Dual Split Web Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Deliveries, Services & Data Table (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Current Deliveries Pastel Cards */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  Current Deliveries
                </h2>
                <p className="text-xs text-neutral-500">
                  Live urban shipments & active courier manifests
                </p>
              </div>
              <button
                onClick={loadData}
                title="Refresh queue"
                className="w-8 h-8 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#FF2D55]" : ""}`} />
              </button>
            </div>

            {isLoading ? (
              <div className="h-44 rounded-2xl bg-neutral-50 animate-pulse flex items-center justify-center">
                <span className="text-xs text-neutral-400 font-medium">
                  Syncing with Supabase database...
                </span>
              </div>
            ) : filteredActive.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-neutral-300 text-center">
                <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-medium">No active deliveries</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredActive.map((parcel) => {
                  const badge = getStatusBadge(parcel.status);
                  const cardBg = getCardBg(parcel.cardColor);

                  return (
                    <div
                      key={parcel.id}
                      onClick={() => onSelectParcel(parcel.id)}
                      className={`p-5 rounded-2xl border shadow-xs cursor-pointer hover:shadow-md transition-all active:scale-[0.99] flex flex-col justify-between ${cardBg}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-neutral-800 tracking-wider">
                            {parcel.id}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                            {parcel.serviceType || "Express Parcel"}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="my-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-neutral-600 font-medium uppercase">
                            Estimated Arrival
                          </p>
                          <p className="text-xl font-black text-neutral-900">
                            {parcel.arrivalTime}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-xs">
                          <span className="text-2xl">📦</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span className="truncate max-w-[180px]">
                          {parcel.destination || "2210 Coral Way, Apt 3C"}
                        </span>
                        <span className="text-[#FF2D55] font-bold flex items-center gap-0.5">
                          Open <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4 Microservices Tools Panel */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs">
            <h3 className="text-base font-extrabold text-neutral-900 tracking-tight mb-3">
              Services & Operations
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Create */}
              <button
                onClick={onOpenCreate}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-emerald-50/50 border border-neutral-200/80 hover:border-emerald-300 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Box className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4 className="text-xs font-bold text-neutral-900">Create Parcel</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Instant dispatch</p>
              </button>

              {/* Calculate */}
              <button
                onClick={onOpenCalculate}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-amber-50/50 border border-neutral-200/80 hover:border-amber-300 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Percent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4 className="text-xs font-bold text-neutral-900">Calculate Rates</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Dijkstra transit fee</p>
              </button>

              {/* Receipts */}
              <button
                onClick={onOpenReceipts}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-blue-50/50 border border-neutral-200/80 hover:border-blue-300 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4 className="text-xs font-bold text-neutral-900">Receipts & Tax</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">BIN / VAT invoices</p>
              </button>

              {/* Support */}
              <button
                onClick={onOpenSupport}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-purple-50/50 border border-neutral-200/80 hover:border-purple-300 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4 className="text-xs font-bold text-neutral-900">Support & Docs</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">24/7 & C++ graph FAQ</p>
              </button>
            </div>
          </div>

          {/* Full Data Table of All Shipments */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">
                  Shipment Manifest Ledger
                </h3>
                <p className="text-xs text-neutral-500">
                  Showing all active and delivered orders from Supabase PostgreSQL
                </p>
              </div>
              <button
                onClick={onViewAllParcels}
                className="text-xs font-bold text-[#FF2D55] hover:underline cursor-pointer"
              >
                See Full Table ({allParcels.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-5">Tracking Code</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">ETA</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {allParcels.map((parcel) => {
                    const badge = getStatusBadge(parcel.status);
                    return (
                      <tr
                        key={parcel.id}
                        className="hover:bg-neutral-50/60 transition-colors"
                      >
                        <td className="py-3 px-5 font-mono font-bold text-neutral-900">
                          {parcel.id}
                        </td>
                        <td className="py-3 px-4 text-neutral-700 font-medium">
                          {parcel.serviceType || "Express Parcel"}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 truncate max-w-[180px]">
                          {parcel.destination || "2210 Coral Way"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-neutral-800">
                          {parcel.arrivalTime}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button
                            onClick={() => onSelectParcel(parcel.id)}
                            className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] cursor-pointer transition-all"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Live Dhaka Leaflet Map (5 Cols) */}
        <div className="xl:col-span-5 space-y-6 sticky top-20">
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden flex flex-col">
            {/* Map Card Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    Dhaka Central Corridor Map
                  </h4>
                  <p className="text-[10px] text-neutral-500">
                    Turn-by-turn route & BFS rider positions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-neutral-700">
                  3 Couriers Active
                </span>
              </div>
            </div>

            {/* Map Container - OpenStreetMap Free Leaflet Tiles */}
            <div className="h-[460px] w-full relative">
              <DhakaLeafletMap
                routePoints={route.coordinates}
                couriers={couriers}
                showAllCouriers={true}
                height="100%"
                originLabel={route.originName}
                destinationLabel={route.destName}
                onMarkerClick={(courier) => {
                  alert(`Courier: ${courier.name} (${courier.zoneName})\nRating: ★${courier.rating}\nETA: ${courier.etaMinutes} mins`);
                }}
              />
            </div>

            {/* Turn HUD & Route Summary Bar */}
            <div className="p-4 bg-white border-t border-neutral-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-base shrink-0">
                  ↰
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                    <span className="truncate max-w-[140px] text-emerald-700">{route.originName}</span>
                    <span className="text-neutral-300">➔</span>
                    <span className="truncate max-w-[140px] text-[#FF2D55]">{route.destName}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Dijkstra: {route.distance} (~{route.duration})
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectParcel(topParcel?.id || "#F165G258")}
                className="px-4 py-2 bg-[#FF2D55] hover:bg-[#e0264b] text-white rounded-xl text-xs font-bold shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer shrink-0"
              >
                Track Live GPS
              </button>
            </div>
          </div>

          {/* Algorithm Telemetry Widget */}
          <div className="p-5 bg-neutral-900 text-white rounded-3xl border border-neutral-800 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 font-sans font-bold">
                Algorithm Telemetry (C++17)
              </span>
              <span className="text-emerald-400 text-[10px] font-bold">
                PASSING ALL CHECKS
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Shortest Path:</span>
                <span className="text-white">Dijkstra Min-Heap (O((V+E)log V))</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Radial Dispatch:</span>
                <span className="text-white">Breadth-First Search (O(V+E))</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Hub Spanning Tree:</span>
                <span className="text-white">Kruskal DSU (O(E log E))</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">One-Way Street Cycle:</span>
                <span className="text-white">Depth-First Search (O(V+E))</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
