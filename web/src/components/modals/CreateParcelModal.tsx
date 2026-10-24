import React, { useState } from "react";
import { X, Package, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import { insertParcelToDB } from "../../db/parcels";
import type { DeliveryItem } from "../../types/delivery";

interface CreateParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParcelCreated: (parcel: DeliveryItem) => void;
}

export const CreateParcelModal: React.FC<CreateParcelModalProps> = ({
  isOpen,
  onClose,
  onParcelCreated,
}) => {
  const [receiverName, setReceiverName] = useState("Emily Carter");
  const [receiverPhone, setReceiverPhone] = useState("+880 1712-345678");
  const [pickupAddress, setPickupAddress] = useState("Road 27, Dhanmondi, Dhaka");
  const [deliveryAddress, setDeliveryAddress] = useState("Road 103, Gulshan 2, Dhaka");
  const [packageType, setPackageType] = useState("Express Parcel");
  const [isFragile, setIsFragile] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery (৳250)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `#TRV-${randomSuffix}`;

    const newParcel: DeliveryItem = {
      id: trackingId,
      status: "looking_for_courier",
      arrivalTime: "Within 35 min",
      cardColor: "green",
      origin: pickupAddress,
      destination: deliveryAddress,
      weight: "1.5 kg",
      serviceType: packageType,
      receiverName: receiverName,
      receiverPhone: receiverPhone,
    };

    // Save to Supabase PostgreSQL database
    await insertParcelToDB(newParcel, receiverName, receiverPhone);

    setIsSubmitting(false);
    setSuccess(true);
    onParcelCreated(newParcel);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#FF2D55]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Book Delivery</h3>
              <p className="text-xs text-neutral-300">
                Instant dispatch powered by Dijkstra Engine
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
        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600 animate-bounce" />
            </div>
            <h4 className="text-xl font-bold text-neutral-900">
              Parcel Booked Successfully!
            </h4>
            <p className="text-sm text-neutral-500 mt-1">
              Synced with Supabase database. Courier dispatch started.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto space-y-4 text-left flex-1"
          >
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Receiver Name
              </label>
              <input
                type="text"
                required
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-sm text-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Receiver Phone (SMS OTP / Live Tracking)
              </label>
              <input
                type="tel"
                required
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-sm text-neutral-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                  Pickup Address
                </label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-sm text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-sm text-neutral-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                  Package Service Type
                </label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-sm text-neutral-800 bg-white"
                >
                  <option value="Express Parcel">Express Parcel (Under 2kg)</option>
                  <option value="Retail Merchandise">Retail Merchandise</option>
                  <option value="Documents & Legal">Documents & Legal</option>
                  <option value="Standard Freight">Standard Freight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-sm text-neutral-800 bg-white"
                >
                  <option value="Cash on Delivery (৳250)">Cash on Delivery (৳250)</option>
                  <option value="bKash / Nagad Instant">bKash / Nagad Instant</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>
            </div>

            {/* Fragile Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Fragile Goods Care
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Requires special vehicle handling cushion
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isFragile}
                onChange={(e) => setIsFragile(e.target.checked)}
                className="w-5 h-5 accent-[#FF2D55] cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white font-semibold flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <span>{isSubmitting ? "Creating Order..." : "Confirm & Dispatch Courier"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
