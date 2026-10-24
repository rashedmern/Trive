import React from "react";
import { X, Receipt, CheckCircle2, Download, Printer } from "lucide-react";

interface ReceiptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptsModal: React.FC<ReceiptsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Delivery Receipt</h3>
              <p className="text-xs text-neutral-300">
                Official itemized tax invoice
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

        {/* Invoice Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-left flex-1 font-mono text-xs">
          <div className="text-center pb-4 border-b border-dashed border-neutral-300">
            <h4 className="text-base font-bold font-sans text-neutral-900">
              TRIVE LOGISTICS INC.
            </h4>
            <p className="text-[11px] text-neutral-500 font-sans">
              Autonomous Turn-by-Turn Courier Network
            </p>
            <p className="text-[11px] text-neutral-500 font-sans">
              BIN / VAT Reg: 002948194-0101
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-sans">
              <CheckCircle2 className="w-3 h-3" />
              <span>PAID & VERIFIED</span>
            </div>
          </div>

          <div className="space-y-1 text-neutral-700">
            <div className="flex justify-between">
              <span className="text-neutral-500">Invoice No:</span>
              <span className="font-bold text-neutral-900">INV-2026-9481</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tracking Code:</span>
              <span className="font-bold text-neutral-900">#F165G258</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Sender:</span>
              <span>Dhanmondi Hub Central</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Receiver:</span>
              <span>Emily Carter</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Destination:</span>
              <span>2210 Coral Way, Apt 3C</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="pt-3 border-t border-dashed border-neutral-300 space-y-2">
            <div className="flex justify-between text-neutral-500 font-bold">
              <span>DESCRIPTION</span>
              <span>AMOUNT</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Express Parcel Base Fee</span>
              <span>৳120.00</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Dijkstra Shortest Transit (1.5 mi)</span>
              <span>৳80.00</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Fragile Goods Protection</span>
              <span>৳35.00</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Govt VAT (5%)</span>
              <span>৳15.00</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t-2 border-neutral-900 flex justify-between items-baseline font-bold text-neutral-900 text-sm">
            <span>TOTAL CHARGED:</span>
            <span className="text-lg">৳250.00</span>
          </div>

          {/* Barcode visual */}
          <div className="pt-4 flex flex-col items-center justify-center">
            <div className="tracking-widest font-mono text-xl select-none text-neutral-800">
              ||| | |||| | || |||| | ||| | ||
            </div>
            <span className="text-[10px] text-neutral-400 mt-1">
              #F165G258-TRV-VERIFIED
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2 font-sans">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
