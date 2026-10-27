import React, { useState, useEffect } from "react";
import { WebSidebar, WebTab } from "./components/layout/WebSidebar";
import { WebTopHeader } from "./components/layout/WebTopHeader";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ParcelsScreen } from "./screens/ParcelsScreen";
import { MapScreen } from "./screens/MapScreen";
import { OrderDetailsScreen } from "./screens/OrderDetailsScreen";
import { DriverNavigationScreen } from "./screens/DriverNavigationScreen";
import { AlgorithmLabScreen, AlgorithmType } from "./screens/AlgorithmLabScreen";

import { CreateParcelModal } from "./components/modals/CreateParcelModal";
import { ShippingCalculatorModal } from "./components/modals/ShippingCalculatorModal";
import { ReceiptsModal } from "./components/modals/ReceiptsModal";
import { SupportModal } from "./components/modals/SupportModal";
import { fetchParcelsFromDB } from "./db/parcels";
import type { DeliveryItem } from "./types/delivery";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WebTab>("dashboard");
  const [activeView, setActiveView] = useState<"main" | "order_details" | "navigation">("main");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("#F165G258");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeParcelCount, setActiveParcelCount] = useState<number>(3);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCalculateOpen, setIsCalculateOpen] = useState(false);
  const [isReceiptsOpen, setIsReceiptsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Fetch real-time active parcel count from database / local storage
  useEffect(() => {
    let mounted = true;
    fetchParcelsFromDB().then((res) => {
      if (mounted) {
        setActiveParcelCount(res.active.length);
      }
    });
    return () => {
      mounted = false;
    };
  }, [refreshTrigger]);

  const handleSelectParcel = (id: string) => {
    setSelectedOrderId(id);
    setActiveView("order_details");
  };

  const handleConfirmPickup = (id: string) => {
    setSelectedOrderId(id);
    setActiveView("navigation");
  };

  const handleDeliveryCompleted = () => {
    setActiveView("main");
    setActiveTab("dashboard");
    setRefreshTrigger((k) => k + 1);
  };

  const handleParcelCreated = (_newParcel: DeliveryItem) => {
    setActiveTab("parcels");
    setIsCreateOpen(false);
    setRefreshTrigger((k) => k + 1);
  };

  const getPageTitle = () => {
    if (activeView === "order_details") return `Order #${selectedOrderId}`;
    if (activeView === "navigation") return "Live GPS Navigation HUD";
    switch (activeTab) {
      case "dashboard":
        return "Logistics Fleet Operations";
      case "parcels":
        return "Shipments & Booking Queue";
      case "map":
        return "Dhaka Fleet Radar";
      case "dijkstra":
        return "Dijkstra Shortest Path Engine";
      case "bfs":
        return "BFS Concentric Courier Dispatch";
      case "kruskal":
        return "Kruskal Warehouse Hub MST Network";
      case "dfs":
        return "DFS Route Safety & Cycle Detection";
      default:
        return "Trive Logistics Hub";
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8F9FA] text-neutral-900 font-sans antialiased overflow-hidden">
      {/* Left Fixed Desktop Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 md:static ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
        <WebSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setActiveView("main");
            setIsMobileMenuOpen(false);
          }}
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenCalculate={() => setIsCalculateOpen(true)}
          onOpenReceipts={() => setIsReceiptsOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
          activeParcelCount={activeParcelCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <WebTopHeader
          title={getPageTitle()}
          searchQuery={globalSearch}
          onSearchChange={(q) => setGlobalSearch(q)}
          onOpenCreate={() => setIsCreateOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
          {activeView === "navigation" ? (
            <DriverNavigationScreen
              orderId={selectedOrderId}
              onExitNavigation={() => setActiveView("main")}
              onDeliveryCompleted={handleDeliveryCompleted}
            />
          ) : activeView === "order_details" ? (
            <OrderDetailsScreen
              orderId={selectedOrderId}
              onBack={() => setActiveView("main")}
              onConfirmPickup={handleConfirmPickup}
              onOpenSupport={() => setIsSupportOpen(true)}
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardScreen
                  onSelectParcel={handleSelectParcel}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  onOpenCalculate={() => setIsCalculateOpen(true)}
                  onOpenReceipts={() => setIsReceiptsOpen(true)}
                  onOpenSupport={() => setIsSupportOpen(true)}
                  onViewAllParcels={() => setActiveTab("parcels")}
                  searchQuery={globalSearch}
                  refreshTrigger={refreshTrigger}
                />
              )}

              {activeTab === "parcels" && (
                <ParcelsScreen
                  onSelectParcel={handleSelectParcel}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  refreshTrigger={refreshTrigger}
                />
              )}

              {activeTab === "map" && <MapScreen />}

              {(activeTab === "dijkstra" ||
                activeTab === "bfs" ||
                activeTab === "kruskal" ||
                activeTab === "dfs") && (
                <AlgorithmLabScreen
                  key={activeTab}
                  initialAlgorithm={activeTab as AlgorithmType}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 4 Microservice Web Modals */}
      <CreateParcelModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onParcelCreated={handleParcelCreated}
      />

      <ShippingCalculatorModal
        isOpen={isCalculateOpen}
        onClose={() => setIsCalculateOpen(false)}
      />

      <ReceiptsModal
        isOpen={isReceiptsOpen}
        onClose={() => setIsReceiptsOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};

export default App;
