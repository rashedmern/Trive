import React from "react";
import { TriveLogo } from "../brand/TriveLogo";
import {
  LayoutDashboard,
  Box,
  MapPin,
  Navigation,
  Radar,
  GitFork,
  Repeat,
  Plus,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export type WebTab =
  | "dashboard"
  | "parcels"
  | "map"
  | "dijkstra"
  | "bfs"
  | "kruskal"
  | "dfs";

interface WebSidebarProps {
  activeTab: WebTab;
  onTabChange: (tab: WebTab) => void;
  onOpenCreate: () => void;
  onOpenCalculate?: () => void;
  onOpenReceipts?: () => void;
  onOpenSupport?: () => void;
  activeParcelCount: number;
}

export const WebSidebar: React.FC<WebSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreate,
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
      badge: null,
    },
  ];

  const algorithmTools = [
    {
      id: "dijkstra" as WebTab,
      label: "Dijkstra Shortest Path",
      icon: Navigation,
      badge: "GPS",
      color: "text-amber-400",
    },
    {
      id: "bfs" as WebTab,
      label: "BFS Courier Dispatch",
      icon: Radar,
      badge: "Radial",
      color: "text-emerald-400",
    },
    {
      id: "kruskal" as WebTab,
      label: "Kruskal Hub MST",
      icon: GitFork,
      badge: "Network",
      color: "text-blue-400",
    },
    {
      id: "dfs" as WebTab,
      label: "DFS Cycle Detection",
      icon: Repeat,
      badge: "Safety",
      color: "text-purple-400",
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
                          : "bg-[#FF2D55]/20 text-[#FF2D55] border border-[#FF2D55]/30"
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

        {/* 4 Core DSA Logistics Tools */}
        <div>
          <div className="px-3 flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
              Logistics Tools (DSA)
            </span>
            <span className="text-[9px] font-mono font-bold text-neutral-500">
              C++17
            </span>
          </div>

          <div className="space-y-1">
            {algorithmTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => onTabChange(tool.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-neutral-900 shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#FF2D55]" : tool.color
                      }`}
                    />
                    <span className="truncate">{tool.label}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {tool.badge}
                  </span>
                </button>
              );
            })}
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
