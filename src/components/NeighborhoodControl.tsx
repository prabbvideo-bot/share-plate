import React from 'react';
import { MapPin, Navigation, ShoppingBag } from 'lucide-react';
import { NeighborhoodLocation } from '../types';

interface NeighborhoodControlProps {
  currentLocation: NeighborhoodLocation;
  onSelectLocation: (loc: NeighborhoodLocation) => void;
  availableLocations: NeighborhoodLocation[];
  radiusKm: number;
  onChangeRadius: (radius: number) => void;
  itemsInRadiusCount: number;
  totalItemsCount: number;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const NeighborhoodControl: React.FC<NeighborhoodControlProps> = ({
  currentLocation,
  onSelectLocation,
  availableLocations,
  radiusKm,
  onChangeRadius,
  itemsInRadiusCount,
  totalItemsCount,
  onUseCurrentLocation,
  isLocating,
}) => {
  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Indian Locality & Radius context */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hyper-Local Radius Filter</span>
              <span aria-hidden="true">·</span>
              <span className="font-normal text-slate-500 lowercase">within walking distance</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Surplus Food & Tiffin in {currentLocation.name}
            </h1>

            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900 tabular-nums">{itemsInRadiusCount}</span> surplus meals, tiffins, and neighbor requests within <span className="font-semibold text-slate-900 tabular-nums">{radiusKm >= 1 ? `${radiusKm} km` : `${Math.round(radiusKm * 1000)} m`}</span> of your locality ({totalItemsCount - itemsInRadiusCount} further out).
            </p>
          </div>

          {/* Right: Locality selector and Radius Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {/* Locality Dropdown */}
            <div className="w-full sm:w-auto">
              <label htmlFor="locality-select" className="sr-only">
                Choose Locality
              </label>
              <select
                id="locality-select"
                value={currentLocation.id}
                onChange={(e) => {
                  const found = availableLocations.find((l) => l.id === e.target.value);
                  if (found) onSelectLocation(found);
                }}
                className="w-full sm:w-auto text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {availableLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Locate Button */}
            <button
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              title="Use current GPS location"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>{isLocating ? 'Locating...' : 'My GPS'}</span>
            </button>

            {/* Radius Segmented Controls */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg w-full sm:w-auto">
              {[0.5, 1.0, 2.0, 5.0].map((r) => {
                const label = r < 1 ? '500 m' : `${r} km`;
                const isSelected = radiusKm === r;
                return (
                  <button
                    key={r}
                    onClick={() => onChangeRadius(r)}
                    className={`flex-1 sm:flex-initial px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap tabular-nums ${
                      isSelected
                        ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Community Impact Statistics Strip (tabular-nums, clean unboxed text) */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Food Rescued This Week</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">185 kg</span>
            <span className="text-[11px] text-emerald-700 ml-1">saved from wastage</span>
          </div>
          <div>
            <span className="text-slate-500 block">Meals & Tiffins Shared</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">420 portions</span>
            <span className="text-[11px] text-slate-500 ml-1">within 1 km</span>
          </div>
          <div>
            <span className="text-slate-500 block">Community Savings</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">₹38,500</span>
            <span className="text-[11px] text-emerald-700 ml-1">saved by neighbors</span>
          </div>
          <div>
            <span className="text-slate-500 block">Average Walking Distance</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">360 meters</span>
            <span className="text-[11px] text-slate-500 ml-1">~4 min walking</span>
          </div>
        </div>
      </div>
    </section>
  );
};
