import React, { useState } from 'react';
import { X, CheckCircle, ShoppingBag } from 'lucide-react';
import { Claim, FoodListing } from '../types';

interface ClaimModalProps {
  listing: FoodListing;
  onClose: () => void;
  onConfirmClaim: (claim: Claim) => void;
  onOpenChat: (listing: FoodListing) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  listing,
  onClose,
  onConfirmClaim,
  onOpenChat,
}) => {
  const isSurplus = listing.type === 'surplus';
  const [quantity, setQuantity] = useState(1);
  const [pickupSlot, setPickupSlot] = useState('Within 30 minutes');
  const [bringDabba, setBringDabba] = useState(true);
  const [offerNotes, setOfferNotes] = useState('');
  const [claimedPass, setClaimedPass] = useState<Claim | null>(null);

  const maxQty = Math.max(1, listing.quantityRemaining);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      quantity,
      claimCode: code,
      claimedAt: new Date().toISOString(),
      pickupWindow: pickupSlot,
      locationName: listing.locationName,
      posterName: listing.posterName,
      price: listing.price * quantity,
      status: 'active',
    };

    setClaimedPass(newClaim);
    onConfirmClaim(newClaim);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {claimedPass
                ? 'Digital Pickup Pass Issued'
                : isSurplus
                ? 'Claim Surplus Food / Tiffin'
                : 'Offer Item to Neighbor'}
            </h3>
            <p className="text-xs text-slate-500">
              {claimedPass
                ? 'Show this pass code to the host upon pickup'
                : isSurplus
                ? 'Reserve food from your local neighborhood sharer'
                : 'Connect with a neighbor in need'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {claimedPass ? (
            /* Digital Claim Pass Screen */
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 block mb-1">
                  Digital Pickup Pass
                </span>
                <div className="inline-block bg-slate-900 text-white font-mono text-2xl font-bold px-6 py-2 rounded-lg tracking-widest tabular-nums">
                  {claimedPass.claimCode}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Portion reserved. Please arrive within the pickup window.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Reserved Food:</span>
                  <span className="font-semibold text-slate-900">{claimedPass.listingTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Portions Reserved:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {claimedPass.quantity} portion(s)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Pickup Location:</span>
                  <span className="font-semibold text-slate-900">{claimedPass.locationName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Arrival Time Window:</span>
                  <span className="font-semibold text-emerald-800">{claimedPass.pickupWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Payable:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {claimedPass.price === 0 ? 'Free (₹0)' : `₹${claimedPass.price}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChat(listing);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Message Host
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}
                <div className="text-left overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{listing.title}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{listing.posterName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-emerald-800 tabular-nums">
                      {listing.price === 0 ? 'Free (₹0)' : `₹${listing.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {isSurplus ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Quantity to Claim (Max available: {maxQty})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-base text-slate-900 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                        className="w-9 h-9 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-xs text-slate-500">
                        {listing.unit}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Estimated Pickup Time
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="Within 20-30 minutes">Within 20-30 minutes (~4 min walk)</option>
                      <option value="Tonight before 8:30 PM dinner">Tonight before 8:30 PM dinner</option>
                      <option value="Before 9:30 PM closing">Before 9:30 PM closing</option>
                    </select>
                  </div>

                  {/* Bring Dabba / Tiffin prompt */}
                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bringDabba}
                      onChange={(e) => setBringDabba(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 block">
                        I will bring my own Dabba / Steel Tiffin / Cloth Bag 🍱
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Reduces single-use plastic waste and keeps food hot and clean.
                      </span>
                    </div>
                  </label>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What can you provide?
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. I have an unopened 500ml pouch of Nandini cow milk or 2kg Toor Dal..."
                      value={offerNotes}
                      onChange={(e) => setOfferNotes(e.target.value)}
                      className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Drop-off / Handover Preference
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2.5"
                    >
                      <option value="Can drop off at your apartment security gate">I can walk over and leave with your apartment security gate</option>
                      <option value="You can collect from my flat / gate">You are welcome to collect from my flat / gate</option>
                      <option value="Meet near local temple / metro pillar">Meet near local temple / metro pillar</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {isSurplus
                    ? `Confirm Claim (${quantity} · ${listing.price === 0 ? 'Free' : `₹${listing.price * quantity}`})`
                    : 'Send Offer to Neighbor'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
