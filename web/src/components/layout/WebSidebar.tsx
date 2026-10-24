import React from "react";
import { TriveLogo } from "../brand/TriveLogo";
import {
  LayoutDashboard,
  Box,
  MapPin,
  Calculator,
  Receipt,
  Headphones,
  Settings,
  Plus,
  Package,
  Activity,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export type WebTab = "dashboard" | "parcels" | "map" | "settings";

interface WebSidebarProps {
  activeTab: WebTab;
  onTabChange: (tab: WebTab) => void;
  onOpenCreate: () => void;
  onOpenCalculate: () => void;
  onOpenReceipts: () => void;
  onOpenSupport: () => void;
  activeParcelCount: number;
}

export const WebSidebar: React.FC<WebSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreate,
  onOpenCalculate,
  onOpenReceipts,
  onOpenSupport,
  activeParcelCount,
}) => {
  const primaryNav = [
    {
      id: "dashboard" as WebTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "parcels" as WebTab,
      label: "Shipments Queue",
      icon: Box,
      badge: activeParcelCount > 0 ? `${activeParcelCount}` : null,
    },
    {
      id: "map" as WebTab,
      label: "Live Fleet Radar",
      icon: MapPin,
      badge: "BFS",
    },
    {
      id: "settings" as WebTab,
      label: "Engine & Diagnostics",
      icon: Settings,
      badge: "C++17",
    },
  ];

  return (
    <aside className="w-64 bg-neutral-900 text-white flex flex-col h-screen sticky top-0 shrink-0 border-r border-neutral-800 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-neutral-800/80">
        <TriveLogo size={42} showText={true} />
      </div>

      {/* Quick Action Button */}
      <div className="p-4 border-b border-neutral-800/80">
        <button
          onClick={onOpenCreate}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF2D55] to-[#f41e48] hover:opacity-95 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF2D55]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Book New Delivery</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            Main Fleet
          </span>
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-neutral-900 shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#FF2D55]" : "text-neutral-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#FF2D55] text-white"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Microservices Shortcuts */}
        <div>
          <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            Logistics Tools
          </span>
          <div className="space-y-1">
            <button
              onClick={onOpenCalculate}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Dijkstra Rate Calc</span>
            </button>

            <button
              onClick={onOpenReceipts}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-blue-400" />
              <span>Invoices & Receipts</span>
            </button>

            <button
              onClick={onOpenSupport}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-all cursor-pointer"
            >
              <Headphones className="w-4 h-4 text-purple-400" />
              <span>24/7 Dispatch Hotline</span>
            </button>
          </div>
        </div>

        {/* Engine Status Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Engine Health
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-400">
            <div className="flex justify-between">
              <span>Dijkstra:</span>
              <span className="text-white font-bold">0.002 ms</span>
            </div>
            <div className="flex justify-between">
              <span>DB Sync:</span>
              <span className="text-emerald-400 font-semibold">Postgres OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipper Profile Card */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Emily Carter"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF2D55]/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white">
                  Emily Carter
                </span>
                <Sparkles className="w-3 h-3 text-[#FF2D55]" />
              </div>
              <p className="text-[10px] text-neutral-400">Dhaka Central Hub</p>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </aside>
  );
};
