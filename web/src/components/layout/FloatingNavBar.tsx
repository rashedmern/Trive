import React from "react";
import { Home, Package, MapPin, Settings } from "lucide-react";

export type NavTab = "home" | "parcels" | "map" | "settings";

interface FloatingNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "home" as NavTab, label: "Home", icon: Home },
    { id: "parcels" as NavTab, label: "Parcels", icon: Package },
    { id: "map" as NavTab, label: "Map", icon: MapPin },
    { id: "settings" as NavTab, label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none md:hidden">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto flex items-center gap-6 bg-neutral-900/95 backdrop-blur-md px-7 py-3 rounded-full shadow-2xl border border-neutral-800"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center p-2 text-white/70 hover:text-white transition-all group"
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? "text-white scale-110" : "text-neutral-400 group-hover:text-neutral-200"
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-white" : "text-neutral-400"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#FF2D55] shadow-[0_0_8px_#FF2D55]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
