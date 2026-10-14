import React from 'react';
import { X, CheckCircle, Clock, MapPin, ShoppingBag } from 'lucide-react';
import { Claim } from '../types';

interface MyClaimsModalProps {
  claims: Claim[];
  onClose: () => void;
  onMarkCollected: (claimId: string) => void;
  onCancelClaim: (claimId: string) => void;
  onOpenChatById: (listingId: string) => void;
}

export const MyClaimsModal: React.FC<MyClaimsModalProps> = ({
  claims,
  onClose,
  onMarkCollected,
  onCancelClaim,
  onOpenChatById,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                My Neighborhood Claims ({claims.length})
              </h3>
              <p className="text-xs text-slate-500">
                Show digital pass code to host or verify upon pickup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {claims.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-medium">No active food claims yet.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Check surplus tiffins, fresh phulkas, sabzi tokris, or sweet boxes nearby to make your first claim!
              </p>
            </div>
          ) : (
            claims.map((claim) => (
              <div
                key={claim.id}
                className="border border-slate-200 rounded-xl p-4 bg-white hover:border-emerald-200 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded tracking-wider tabular-nums">
                        PASS: {claim.claimCode}
                      </span>
                      {claim.status === 'collected' ? (
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" /> Collected
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Active Reservation
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {claim.listingTitle}
                    </h4>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {claim.price === 0 ? 'Free (₹0)' : `₹${claim.price}`}
                    </span>
                    <span className="text-slate-500 block text-[11px] tabular-nums">
                      Qty: {claim.quantity}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Host: {claim.posterName} · {claim.locationName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Pickup Window: {claim.pickupWindow}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onOpenChatById(claim.listingId)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium underline cursor-pointer"
                  >
                    Message Host
                  </button>

                  <div className="flex items-center gap-2">
                    {claim.status === 'active' && (
                      <>
                        <button
                          onClick={() => onCancelClaim(claim.id)}
                          className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => onMarkCollected(claim.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors cursor-pointer"
                        >
                          Mark as Collected
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
