import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Navigation,
  Pause,
  Play,
  Cpu,
  Clock,
  Compass,
  CheckCircle,
  AlertTriangle,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { DhakaLeafletMap } from "../components/map/DhakaLeafletMap";
import { RoutingEngine, RouteResult } from "../engine/routing-engine";
import { updateParcelStatusInDB } from "../db/parcels";

interface DriverNavigationScreenProps {
  orderId?: string;
  onExitNavigation: () => void;
  onDeliveryCompleted: () => void;
}

export const DriverNavigationScreen: React.FC<DriverNavigationScreenProps> = ({
  orderId = "#F165G258",
  onExitNavigation,
  onDeliveryCompleted,
}) => {
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [isShiftPaused, setIsShiftPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Run Dijkstra Routing
    const res = RoutingEngine.calculateRoute();
    setRouteData(res);
  }, []);

  const handleCompleteOrder = async () => {
    setIsCompleting(true);
    await updateParcelStatusInDB(orderId, "received");
    setIsCompleting(false);
    setIsDone(true);
    setTimeout(() => {
      onDeliveryCompleted();
    }, 1500);
  };

  const currentCoords = routeData?.coordinates || [];
  const activePosition =
    currentCoords.length > currentStepIndex
      ? currentCoords[currentStepIndex]
      : currentCoords[0];

  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col lg:flex-row bg-neutral-900 overflow-hidden text-left select-none">
      {/* Left Navigation Command Panel (420px) */}
      <div className="w-full lg:w-[420px] bg-white border-r border-neutral-200 flex flex-col shrink-0 z-20 overflow-y-auto">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/60">
          <button
            onClick={onExitNavigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit GPS</span>
          </button>

          <button
            onClick={() => setIsShiftPaused(!isShiftPaused)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isShiftPaused
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            }`}
          >
            {isShiftPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Resume Shift</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause Shift</span>
              </>
            )}
          </button>
        </div>

        {/* Turn-by-Turn HUD Banner (Screen 2 Spec) */}
        <div className="p-5 border-b border-neutral-100 bg-neutral-900 text-white space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF2D55] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF2D55]/30">
              ↰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white">50 ft</span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-bold text-[#FF2D55] uppercase">
                  Immediate Turn
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-300 mt-0.5">
                Turn right onto Mirpur Rd (1024 Ocean Dr)
              </p>
            </div>
          </div>

          {/* Live DSA Metrics HUD (Screen 2 Spec) */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dijkstra:</span>
              <span className="text-emerald-400 font-bold">
                {routeData?.computeLatencyMs ?? 0.002}ms
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{routeData?.nodeCount || 8} Nodes</span>
            </div>
          </div>
        </div>

        {/* Trip Metrics Card */}
        <div className="p-5 space-y-5 flex-1">
          <div className="grid grid-cols-3 divide-x divide-neutral-200 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-center">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                Distance
              </span>
              <p className="text-base font-black text-neutral-900 mt-0.5">
                {routeData?.distance || "1.5 mile"}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                Remaining
              </span>
              <p className="text-base font-black text-[#FF2D55] mt-0.5">
                {routeData?.duration || "10 min"}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                ETA
              </span>
              <p className="text-base font-black text-neutral-900 mt-0.5">
                {routeData?.eta || "10:05 PM"}
              </p>
            </div>
          </div>

          {/* Timeline Route Simulator Slider */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold text-neutral-700">
              <span>Road 27 (Dhanmondi)</span>
              <span>Gulshan 2 Destination</span>
            </div>
            <input
              type="range"
              min="0"
              max={(routeData?.coordinates.length || 7) - 1}
              value={currentStepIndex}
              onChange={(e) => setCurrentStepIndex(parseInt(e.target.value))}
              className="w-full accent-[#FF2D55] cursor-pointer"
            />
            <p className="text-[10px] text-neutral-400 text-center">
              Drag slider to simulate vehicle position along the route
            </p>
          </div>

          {/* Turn Sequence List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Turn-by-Turn Route Guidance
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-700">
              {routeData?.turnInstructions.map((instruction, index) => (
                <div
                  key={index}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                    index === currentStepIndex
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-bold"
                      : "bg-neutral-50/60 border-neutral-100 text-neutral-600"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1">{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete Delivery Action Footer */}
        <div className="p-4 border-t border-neutral-100 bg-white">
          {isDone ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Status Saved to PostgreSQL! Returning...</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteOrder}
              disabled={isCompleting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleting ? "Updating database..." : "Mark Order Delivered & Finalize Shift"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Leaflet Map Canvas (Full Fluid Width) */}
      <div className="flex-1 h-full w-full relative">
        <DhakaLeafletMap
          routePoints={routeData?.coordinates || []}
          couriers={[]}
          driverPosition={activePosition}
          showAllCouriers={false}
          zoom={14}
        />
      </div>
    </div>
  );
};
