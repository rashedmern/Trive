import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Box,
  ChevronRight,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Truck,
} from "lucide-react";
import type { DeliveryItem } from "../types/delivery";
import { fetchParcelsFromDB } from "../db/parcels";

interface ParcelsScreenProps {
  onSelectParcel: (parcelId: string) => void;
  onOpenCreate: () => void;
}

export const ParcelsScreen: React.FC<ParcelsScreenProps> = ({
  onSelectParcel,
  onOpenCreate,
}) => {
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");
  const [search, setSearch] = useState("");
  const [activeParcels, setActiveParcels] = useState<DeliveryItem[]>([]);
  const [historyParcels, setHistoryParcels] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchParcelsFromDB();
    setActiveParcels(res.active);
    setHistoryParcels(res.history);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const allParcels = [...activeParcels, ...historyParcels];

  const displayedParcels = allParcels
    .filter((p) => {
      if (filter === "active") return p.status !== "received";
      if (filter === "delivered") return p.status === "received";
      return true;
    })
    .filter(
      (p) =>
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        (p.destination && p.destination.toLowerCase().includes(search.toLowerCase())) ||
        (p.serviceType && p.serviceType.toLowerCase().includes(search.toLowerCase())) ||
        (p.origin && p.origin.toLowerCase().includes(search.toLowerCase()))
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

  return (
    <div className="w-full px-6 py-6 space-y-6 text-left">
      {/* Top Header Card */}
      <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Shipments & Courier Dispatch Queue
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Complete database of parcels stored in PostgreSQL Supabase
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh database"
            className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#FF2D55]" : ""}`} />
          </button>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Booking</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking #, hub, address..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 w-full sm:w-auto p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            All Shipments ({allParcels.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === "active"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Active ({activeParcels.length})
          </button>
          <button
            onClick={() => setFilter("delivered")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === "delivered"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Delivered ({historyParcels.length})
          </button>
        </div>
      </div>

      {/* Web Data Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Tracking ID</th>
                <th className="py-3.5 px-4">Service Type</th>
                <th className="py-3.5 px-4">Pickup Origin</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">ETA</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayedParcels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Box className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs">No matching shipments found</p>
                  </td>
                </tr>
              ) : (
                displayedParcels.map((parcel) => {
                  const badge = getStatusBadge(parcel.status);
                  return (
                    <tr
                      key={parcel.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-neutral-900">
                        {parcel.id}
                      </td>
                      <td className="py-4 px-4 text-neutral-700 font-medium">
                        {parcel.serviceType || "Express Parcel"}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 truncate max-w-[160px]">
                        {parcel.origin || "Road 27, Dhanmondi"}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 truncate max-w-[180px]">
                        {parcel.destination || "2210 Coral Way, Apt 3C"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-neutral-900">
                        {parcel.arrivalTime}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onSelectParcel(parcel.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer transition-all inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
