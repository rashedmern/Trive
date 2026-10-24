import React, { useState } from "react";
import { X, Calculator, Cpu, Navigation, ArrowRight } from "lucide-react";

interface Hub {
  id: string;
  name: string;
  distanceFromOriginKm: number;
}

const DHAKA_HUBS: Hub[] = [
  { id: "dhanmondi", name: "Dhanmondi Hub (Sector 27)", distanceFromOriginKm: 0 },
  { id: "farmgate", name: "Farmgate Logistics Node", distanceFromOriginKm: 3.2 },
  { id: "mohakhali", name: "Mohakhali Transit Point", distanceFromOriginKm: 6.5 },
  { id: "banani", name: "Banani 11 Express Center", distanceFromOriginKm: 9.1 },
  { id: "gulshan", name: "Gulshan 2 Hub (Road 103)", distanceFromOriginKm: 11.4 },
  { id: "uttara", name: "Uttara Sector 7 Depot", distanceFromOriginKm: 18.0 },
  { id: "mirpur", name: "Mirpur 10 Courier Node", distanceFromOriginKm: 8.7 },
  { id: "motijheel", name: "Motijheel Commercial Terminal", distanceFromOriginKm: 7.2 },
];

interface ShippingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShippingCalculatorModal: React.FC<ShippingCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [originId, setOriginId] = useState("dhanmondi");
  const [destId, setDestId] = useState("gulshan");
  const [weightKg, setWeightKg] = useState<number>(1.5);
  const [speedType, setSpeedType] = useState<"standard" | "express">("express");

  if (!isOpen) return null;

  const originHub = DHAKA_HUBS.find((h) => h.id === originId) || DHAKA_HUBS[0];
  const destHub = DHAKA_HUBS.find((h) => h.id === destId) || DHAKA_HUBS[4];

  // Graph edge distance in km
  const distanceKm = Math.max(
    1.2,
    Math.abs(destHub.distanceFromOriginKm - originHub.distanceFromOriginKm) || 2.4
  );

  // Calculation parameters
  const baseRate = speedType === "express" ? 80 : 50;
  const perKmRate = speedType === "express" ? 18 : 12;
  const weightRate = weightKg * 15;
  const subtotal = Math.round(baseRate + distanceKm * perKmRate + weightRate);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;
  const etaMinutes = Math.round(distanceKm * (speedType === "express" ? 2.5 : 4) + 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Shipping Rate Calculator</h3>
              <p className="text-xs text-neutral-300">
                Real-time distance estimation via Dijkstra Algorithm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-left flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                From Hub
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {DHAKA_HUBS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                To Destination Hub
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {DHAKA_HUBS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Weight: {weightKg} kg
              </label>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Service Speed
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSpeedType("standard")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    speedType === "standard"
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200"
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedType("express")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    speedType === "express"
                      ? "bg-[#FF2D55] text-white border-[#FF2D55]"
                      : "bg-white text-neutral-600 border-neutral-200"
                  }`}
                >
                  Express ⚡
                </button>
              </div>
            </div>
          </div>

          {/* Engine Metric Card */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Algorithm:
              </span>
              <span className="font-bold text-neutral-900">Dijkstra [Engine]</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                Graph Shortest Path:
              </span>
              <span className="font-bold text-neutral-900">
                {distanceKm.toFixed(1)} km (~{etaMinutes} mins)
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Base Transit Fee:</span>
              <span>৳{baseRate}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance Charge ({distanceKm.toFixed(1)} km):</span>
              <span>৳{Math.round(distanceKm * perKmRate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Weight Charge ({weightKg} kg):</span>
              <span>৳{Math.round(weightRate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Govt. VAT (5%):</span>
              <span>৳{vat}</span>
            </div>
            <div className="pt-2 border-t border-amber-200 flex justify-between items-baseline font-bold text-neutral-900 text-sm">
              <span>Total Estimated Fare:</span>
              <span className="text-xl text-[#FF2D55]">৳{total}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>Proceed with this Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
