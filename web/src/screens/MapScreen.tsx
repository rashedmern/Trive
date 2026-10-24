import React, { useState } from "react";
import { DhakaLeafletMap } from "../components/map/DhakaLeafletMap";
import { RoutingEngine } from "../engine/routing-engine";
import type { NearbyCourier } from "../types/delivery";
import { Radar, Star, ShieldCheck, Phone, Cpu, Navigation, ArrowRight } from "lucide-react";

interface MapScreenProps {
  onSelectCourier?: (courier: NearbyCourier) => void;
}

export const MapScreen: React.FC<MapScreenProps> = () => {
  const couriers = RoutingEngine.getNearbyCouriers();
  const route = RoutingEngine.calculateRoute();
  const [selectedCourier, setSelectedCourier] = useState<NearbyCourier | null>(
    couriers[0]
  );

  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col md:flex-row bg-neutral-900 overflow-hidden text-left select-none">
      {/* Left Dispatch Control Panel (340px) */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-neutral-200 flex flex-col shrink-0 z-20 overflow-y-auto">
        {/* Panel Header */}
        <div className="p-5 border-b border-neutral-100 bg-neutral-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Radar className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900">
                Live Fleet Radar
              </h2>
              <p className="text-[11px] text-neutral-500">
                BFS Concentric Dispatch (O(V+E)) • Dhaka
              </p>
            </div>
          </div>
        </div>

        {/* Algorithm Diagnostics Badge */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-neutral-900 text-white space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-neutral-400 font-sans font-bold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Engine Engine
            </span>
            <span className="text-emerald-400 font-mono">0.002 ms</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Dijkstra Shortest Path:</span>
            <span className="text-white font-bold">1.5 mi (10 min)</span>
          </div>
        </div>

        {/* Nearby Couriers List */}
        <div className="p-4 flex-1 space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Available Couriers ({couriers.length})
          </h3>

          <div className="space-y-2">
            {couriers.map((courier) => {
              const isSelected = selectedCourier?.id === courier.id;
              return (
                <div
                  key={courier.id}
                  onClick={() => setSelectedCourier(courier)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                      : "bg-white text-neutral-800 border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        isSelected ? "bg-white/10" : "bg-neutral-100"
                      }`}
                    >
                      {courier.vehicleType === "van" ? "🚐" : "🛵"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{courier.name}</h4>
                      <p
                        className={`text-[11px] ${
                          isSelected ? "text-neutral-400" : "text-neutral-500"
                        }`}
                      >
                        {courier.zoneName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{courier.rating}</span>
                    </div>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-emerald-400" : "text-[#FF2D55]"
                      } font-bold`}
                    >
                      ~{courier.etaMinutes} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Courier Action Footer */}
        {selectedCourier && (
          <div className="p-4 border-t border-neutral-100 bg-neutral-50/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Selected Courier:</span>
              <span className="font-bold text-neutral-900">
                {selectedCourier.name} ({selectedCourier.zoneName})
              </span>
            </div>
            <button
              onClick={() => alert(`Assigned ${selectedCourier.name} to pickup!`)}
              className="w-full py-3 px-4 rounded-xl bg-[#FF2D55] hover:bg-[#e0264b] text-white text-xs font-bold shadow-md shadow-[#FF2D55]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Assign to Nearest Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Right Map Canvas (Fluid) */}
      <div className="flex-1 h-full w-full relative">
        <DhakaLeafletMap
          routePoints={route.coordinates}
          couriers={couriers}
          showAllCouriers={true}
          center={[23.774, 90.395]}
          zoom={13}
          onMarkerClick={(courier) => setSelectedCourier(courier)}
        />
      </div>
    </div>
  );
};
