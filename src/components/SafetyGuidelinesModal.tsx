import React from 'react';
import { X, ShieldCheck, Heart, AlertTriangle, Check, Clock, Utensils } from 'lucide-react';

interface SafetyGuidelinesModalProps {
  onClose: () => void;
}

export const SafetyGuidelinesModal: React.FC<SafetyGuidelinesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Community Food Sharing & Hygiene Guidelines
              </h3>
              <p className="text-xs text-slate-500">
                Safe, clean, and respectful food sharing for Indian neighborhoods
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
        <div className="p-6 space-y-5 text-xs text-slate-600 max-h-[70vh] overflow-y-auto">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-600" />
              1. Accepted Fresh Food & Groceries
            </h4>
            <p className="leading-relaxed">
              We welcome hygienic surplus food: freshly cooked home meals, extra roti/phulka batches, excess restaurant thalis and darshini tiffin, mandi produce, sealed dairy packets (milk/curd/paneer), and fresh mithai.
            </p>
            <ul className="space-y-1.5 pl-2">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Freshly prepared meals packed in clean, food-grade containers or banana leaves.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Unopened grocery packets (Atta, Dal, Rice, Milk pouches) within best-before dates.</span>
              </li>
              <li className="flex items-start gap-2 text-rose-700">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                <span>Never post stale, spoiled, fermented, or unhygienic leftovers.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              2. Freshness & Pickup Etiquette
            </h4>
            <p className="leading-relaxed">
              Hot cooked food (rotis, dal, sabzi, tiffin) should ideally be collected within 1.5 to 2 hours of posting. If you reserve a portion, please honor your arrival window so that food doesn't go cold or get wasted.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emerald-600" />
              3. The "Bring Your Own Dabba" & Dietary Transparency
            </h4>
            <p className="leading-relaxed">
              In the spirit of traditional Indian hospitality and zero-waste sustainability, neighbors are encouraged to carry their own clean stainless steel tiffins/dabbas or cloth bags. Always accurately declare Pure Veg, Jain (no onion/garlic), or Halal preferences.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
