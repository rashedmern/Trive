import React from "react";
import { TriveLogo } from "../brand/TriveLogo";
import {
  Package,
  Plus,
  Bell,
  Search,
  LayoutDashboard,
  Box,
  MapPin,
  Settings,
  Sparkles,
} from "lucide-react";
import type { NavTab } from "./FloatingNavBar";

interface DesktopHeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenCreate: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenCreate,
}) => {
  const navItems = [
    { id: "home" as NavTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "parcels" as NavTab, label: "Shipments", icon: Box },
    { id: "map" as NavTab, label: "Live Dhaka Map", icon: MapPin },
    { id: "settings" as NavTab, label: "System & Engine", icon: Settings },
  ];

  return (
    <header className="hidden md:block bg-white/95 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange("home")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <TriveLogo size={38} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-neutral-900 tracking-tight">
                TRIVE
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FF2D55]/10 text-[#FF2D55] uppercase">
                Web
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-medium tracking-wide">
              SMART FLEET &amp; LOGISTICS
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-neutral-100/80 p-1.5 rounded-2xl border border-neutral-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#FF2D55]" : "text-neutral-400"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#FF2D55] hover:bg-[#e0264b] active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-[#FF2D55]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Delivery</span>
          </button>

          <div className="h-6 w-px bg-neutral-200" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs font-bold text-neutral-900">
                  Emily Carter
                </span>
                <Sparkles className="w-3 h-3 text-[#FF2D55]" />
              </div>
              <p className="text-[10px] text-neutral-400">Dhaka Central Hub</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#FF2D55]/30">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Emily Carter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
