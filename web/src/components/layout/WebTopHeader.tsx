import React from "react";
import {
  Search,
  Bell,
  Cpu,
  Database,
  Plus,
  Compass,
  Menu,
} from "lucide-react";

interface WebTopHeaderProps {
  title: string;
  subtitle?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreate: () => void;
  onToggleMobileMenu?: () => void;
}

export const WebTopHeader: React.FC<WebTopHeaderProps> = ({
  title,
  subtitle = "Autonomous Turn-by-Turn Courier Logistics",
  searchQuery,
  onSearchChange,
  onOpenCreate,
  onToggleMobileMenu,
}) => {
  return (
    <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Online
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by tracking # (e.g. #F165G258), address, or courier..."
          className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] transition-all"
        />
      </div>

      {/* Right Stats & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* System Diagnostics Badges */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dijkstra:</span>
            <span className="font-bold text-neutral-900">0.002ms</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-neutral-900">PostgreSQL</span>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">New Shipment</span>
        </button>

        <button
          onClick={() => alert("All 6 distribution hubs operating normally.")}
          className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all shadow-2xs cursor-pointer relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2D55]" />
        </button>
      </div>
    </header>
  );
};
