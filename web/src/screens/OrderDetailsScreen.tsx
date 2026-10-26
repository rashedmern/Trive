import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  AlertCircle,
  Phone,
  MessageSquare,
  HelpCircle,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import type { Order } from "../types/delivery";
import { fetchOrderDetailsFromDB } from "../db/parcels";
import { SlideToConfirmWeb } from "../components/feedback/SlideToConfirmWeb";
import { RoutingEngine } from "../engine/routing-engine";

interface OrderDetailsScreenProps {
  orderId: string;
  onBack: () => void;
  onConfirmPickup: (orderId: string) => void;
  onOpenSupport: () => void;
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  orderId,
  onBack,
  onConfirmPickup,
  onOpenSupport,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchOrderDetailsFromDB(orderId).then((res) => {
      if (mounted) {
        setOrder(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#FF2D55] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500 font-medium">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  const trackingId = order?.trackingId || orderId;
  const spec = order?.spec || {
    service: "Express Parcel",
    receiver: "Emily Carter",
    origin: "Road 27, Dhanmondi, Dhaka",
    address: "2210 Coral Way, Apt 3C (Dhaka Hub)",
    packageType: "Express Parcel (1.8 kg)",
    paymentMethod: "Cash on Delivery (৳250)",
    handlingNote:
      "Please ensure the package is handled with care - fragile items inside.",
  };

  const routeCalc = RoutingEngine.calculateRoute(spec.origin, spec.address);

  return (
    <div className="w-full px-6 py-6 space-y-6 text-left">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipments</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono">Manifest ID:</span>
          <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg">
            {trackingId}
          </span>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Trive Order ${trackingId}`,
                url: window.location.href,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Tracking link copied to clipboard!");
            }
          }}
          className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screen 1 Green Gradient Hero Card & Live Visual */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative p-7 rounded-3xl bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#86EFAC] border border-emerald-300 shadow-md overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-950/70 tracking-widest uppercase">
                  TRACKING NUMBER
                </span>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight mt-0.5">
                  {trackingId}
                </h1>
              </div>

              {/* Looking for Courier Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-emerald-200">
                <span className="text-xs">🚐</span>
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                  Looking for Courier
                </span>
              </div>
            </div>

            {/* 3D Parcel Graphic */}
            <div className="my-8 flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs text-emerald-900/70 font-semibold uppercase">
                  Assigned Service Tier
                </p>
                <p className="text-2xl font-black text-neutral-900 mt-0.5">
                  {spec.service}
                </p>
              </div>
              <div className="w-20 h-20 rounded-3xl bg-white/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/80">
                <span className="text-4xl">📦</span>
              </div>
            </div>

            {/* Route snippet */}
            <div className="pt-4 border-t border-emerald-900/10 space-y-1 text-xs font-semibold text-emerald-950 relative z-10">
              <div className="flex justify-between items-center">
                <span className="truncate max-w-[200px]">From: {spec.origin || routeCalc.originName}</span>
                <span className="text-[11px] font-mono font-bold bg-white/80 px-2.5 py-0.5 rounded-full">
                  ETA: {routeCalc.duration}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-emerald-900/80">
                <span className="truncate max-w-[200px]">To: {spec.address}</span>
                <span className="font-mono">{routeCalc.distance}</span>
              </div>
            </div>
          </div>

          {/* Quick Dispatch CTA Button for Desktop */}
          <button
            onClick={() => onConfirmPickup(trackingId)}
            className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer"
          >
            <Navigation className="w-5 h-5 text-[#FF2D55]" />
            <span>Launch Live Turn-by-Turn GPS Navigation</span>
          </button>
        </div>

        {/* Right Column: Complete Specifications Manifest */}
        <div className="lg:col-span-7 space-y-6">
          {/* Package Specifications Table */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Package Specifications & Transit Manifest
            </h3>

            <div className="divide-y divide-neutral-100 text-xs">
              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Logistics Service</span>
                <span className="text-neutral-900 font-bold">{spec.service}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Receiver Name</span>
                <span className="text-neutral-900 font-bold">{spec.receiver}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Pickup Origin</span>
                <span className="text-neutral-900 font-bold text-right max-w-sm">
                  {spec.origin || routeCalc.originName}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Delivery Destination</span>
                <span className="text-neutral-900 font-bold text-right max-w-sm">
                  {spec.address}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Dijkstra Route Distance</span>
                <span className="text-emerald-600 font-mono font-bold">
                  {routeCalc.distance} (~{routeCalc.duration})
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Package Classification</span>
                <span className="text-neutral-900 font-bold">{spec.packageType}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-500 font-medium">Billing & Payment Method</span>
                <span className="text-[#FF2D55] font-black text-sm">{spec.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Handling Notes Box */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Handling Instruction</h4>
              <p className="text-xs text-amber-800 italic mt-0.5 leading-relaxed">
                "{spec.handlingNote}"
              </p>
            </div>
          </div>

          {/* Interactive Slide to Confirm (Optional Gesture) */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Driver Touch Confirmation
            </span>
            <SlideToConfirmWeb
              title="Slide to pick up the order"
              confirmedTitle="Rider Assigned! Starting GPS..."
              onConfirm={() => {
                onConfirmPickup(trackingId);
              }}
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSupport}
              className="flex-1 py-3 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Contact Dispatch Center</span>
            </button>

            <button
              onClick={() => alert("Connecting to courier live dispatch chat...")}
              className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-neutral-800" />
            </button>

            <a
              href="tel:+8801700000000"
              className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Phone className="w-4 h-4 text-neutral-800" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
