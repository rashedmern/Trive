import React, { useState } from "react";
import { X, Headphones, Phone, MessageSquare, ChevronDown, ChevronUp, Cpu } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "How does Trive calculate sub-millisecond routes?",
      a: "Trive uses Dijkstra's Algorithm with a Min-Heap priority queue (O((V+E)log V)) compiled into our routing engine. It evaluates road edges and real-time congestion weights to return turn-by-turn paths in under 3 microseconds.",
    },
    {
      q: "How does 'Looking for Courier' find riders?",
      a: "Our dispatch engine runs Breadth-First Search (BFS) (O(V+E)) concentrically outward from the parcel's pickup coordinate to assign the closest active scooter or van courier.",
    },
    {
      q: "How are warehouse transit hubs connected?",
      a: "Kruskal's Algorithm using Disjoint Set Union (DSU) calculates the Minimum Spanning Tree (MST) (O(E log E)) to interconnect inter-city distribution hubs at minimal transit cost.",
    },
    {
      q: "How are one-way streets and delivery order cycles handled?",
      a: "Depth-First Search (DFS) (O(V+E)) runs cycle detection to prevent locked multi-stop pickup dependency deadlocks.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">24/7 Priority Support</h3>
              <p className="text-xs text-neutral-300">
                Courier dispatch center & engine documentation
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-left flex-1">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:+8801700000000"
              className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/70 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-neutral-800">Direct Hotline</span>
              <span className="text-[10px] text-neutral-500">+880 1700-000000</span>
            </a>

            <button
              onClick={() => alert("Connecting to live dispatch agent in Dhaka...")}
              className="p-4 rounded-2xl bg-pink-50 border border-pink-100 hover:bg-pink-100/70 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#FF2D55] text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-neutral-800">Live Rider Chat</span>
              <span className="text-[10px] text-neutral-500">Avg. reply 15s</span>
            </button>
          </div>

          {/* Engine Technical FAQs */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>C++ Graph Engine Architecture</span>
            </h4>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-neutral-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                    >
                      <span className="pr-2">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 border-t border-neutral-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
