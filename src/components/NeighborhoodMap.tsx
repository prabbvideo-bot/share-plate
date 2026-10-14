import React, { useState } from 'react';
import { FoodListing, NeighborhoodLocation } from '../types';
import { calculateDistanceKm, formatDistance, formatWalkingTime } from '../utils/geo';

interface NeighborhoodMapProps {
  currentLocation: NeighborhoodLocation;
  listings: FoodListing[];
  radiusKm: number;
  onClaim: (listing: FoodListing) => void;
  onOpenChat: (listing: FoodListing) => void;
}

export const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({
  currentLocation,
  listings,
  radiusKm,
  onClaim,
  onOpenChat,
}) => {
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(listings[0] || null);

  const centerLat = currentLocation.coordinates.lat;
  const centerLng = currentLocation.coordinates.lng;

  const mapExtentKm = Math.max(radiusKm * 2.2, 1.2);
  const kmPerLat = 111.0;
  const kmPerLng = 85.0;

  const latSpan = mapExtentKm / kmPerLat;
  const lngSpan = mapExtentKm / kmPerLng;

  const width = 800;
  const height = 550;

  const project = (lat: number, lng: number) => {
    const x = width / 2 + ((lng - centerLng) / (lngSpan / 2)) * (width / 2);
    const y = height / 2 - ((lat - centerLat) / (latSpan / 2)) * (height / 2);
    return { x, y };
  };

  const centerPos = { x: width / 2, y: height / 2 };
  const radiusPx = (radiusKm / mapExtentKm) * (width / 2);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Map Header */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {currentLocation.name} · 1-km Community Radar
          </h2>
          <p className="text-xs text-slate-500">
            Dashed green ring represents your active {radiusKm >= 1 ? `${radiusKm} km` : `${Math.round(radiusKm * 1000)} m`} radius. Click pins to see details and claim.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Free Surplus (₹0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Discounted Tiffin / Meal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            <span>Neighbor Request</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-16/10 sm:aspect-16/9 bg-slate-900 overflow-hidden select-none">
        {/* SVG Map Canvas */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair"
        >
          <defs>
            <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.08" />
              <stop offset="90%" stopColor="#059669" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
            </radialGradient>
            <pattern id="streetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#334155" strokeWidth="0.8" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Dark map canvas background */}
          <rect width={width} height={height} fill="#0f172a" />
          <rect width={width} height={height} fill="url(#streetGrid)" />

          {/* Street lines (Indiranagar / Indian arterial roads pattern) */}
          <g stroke="#1e293b" strokeWidth="2.5" strokeOpacity="0.7">
            <line x1="0" y1="180" x2={width} y2="180" />
            <line x1="0" y1="290" x2={width} y2="290" />
            <line x1="0" y1="410" x2={width} y2="410" />
            <line x1="200" y1="0" x2="200" y2={height} />
            <line x1="400" y1="0" x2="400" y2={height} />
            <line x1="600" y1="0" x2="600" y2={height} />
          </g>

          {/* Authentic Local Street Labels */}
          <g fill="#64748b" fontSize="9" fontFamily="sans-serif">
            <text x="210" y="30">100ft Road</text>
            <text x="410" y="30">12th Main Road</text>
            <text x="610" y="30">80ft Road</text>
            <text x="15" y="172">CMH Metro Road</text>
            <text x="15" y="282">6th Cross Road</text>
            <text x="15" y="402">Old Airport Road</text>
          </g>

          {/* Radius Perimeter Circle */}
          <circle
            cx={centerPos.x}
            cy={centerPos.y}
            r={radiusPx}
            fill="url(#radiusGradient)"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Radius label */}
          <text
            x={centerPos.x}
            y={centerPos.y - radiusPx - 8}
            fill="#34d399"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            className="tracking-wider"
          >
            {radiusKm >= 1 ? `${radiusKm} KM RADIUS` : `${Math.round(radiusKm * 1000)} METER RADIUS`}
          </text>

          {/* Center (Current User Location) */}
          <g>
            <circle cx={centerPos.x} cy={centerPos.y} r="18" fill="#10b981" fillOpacity="0.2" className="animate-pulse" />
            <circle cx={centerPos.x} cy={centerPos.y} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text
              x={centerPos.x}
              y={centerPos.y + 19}
              fill="#f8fafc"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              Your Location
            </text>
          </g>

          {/* Listing Pins */}
          {listings.map((item) => {
            const pos = project(item.coordinates.lat, item.coordinates.lng);
            const dist = calculateDistanceKm(
              centerLat,
              centerLng,
              item.coordinates.lat,
              item.coordinates.lng
            );
            const isInside = dist <= radiusKm;
            const isSelected = selectedListing?.id === item.id;

            let pinColor = '#10b981'; // free surplus
            if (item.type === 'request') {
              pinColor = '#6366f1'; // request
            } else if (item.price > 0) {
              pinColor = '#f59e0b'; // discounted
            }

            return (
              <g
                key={item.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedListing(item)}
                className="cursor-pointer group"
                opacity={isInside ? 1 : 0.45}
              >
                {isSelected && (
                  <circle
                    cx="0"
                    cy="-14"
                    r="20"
                    fill={pinColor}
                    fillOpacity="0.25"
                    stroke={pinColor}
                    strokeWidth="1.5"
                  />
                )}

                <path
                  d="M 0 0 C -4 -5 -10 -12 -10 -20 C -10 -26 -5 -30 0 -30 C 5 -30 10 -26 10 -20 C 10 -12 4 -5 0 0 Z"
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-110"
                />
                
                <circle cx="0" cy="-20" r="4" fill="#ffffff" />

                <rect
                  x="-35"
                  y="-46"
                  width="70"
                  height="14"
                  rx="3"
                  fill="#0f172a"
                  fillOpacity="0.85"
                />
                <text
                  x="0"
                  y="-36"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {item.price === 0 ? 'FREE' : `₹${item.price}`} · {formatDistance(dist)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Listing Floating Pop-Out Card */}
        {selectedListing && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {selectedListing.type === 'surplus' ? selectedListing.category : 'Neighbor Request'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-bold tabular-nums">
                    {formatDistance(
                      calculateDistanceKm(
                        centerLat,
                        centerLng,
                        selectedListing.coordinates.lat,
                        selectedListing.coordinates.lng
                      )
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatWalkingTime(
                    calculateDistanceKm(
                      centerLat,
                      centerLng,
                      selectedListing.coordinates.lat,
                      selectedListing.coordinates.lng
                    )
                  )}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                  {selectedListing.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-1">
                  {selectedListing.posterName} · {selectedListing.locationName}
                </p>
              </div>

              {selectedListing.imageUrl && (
                <img
                  src={selectedListing.imageUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                />
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900">
                {selectedListing.type === 'surplus' ? (
                  selectedListing.price === 0 ? 'Free (₹0)' : `₹${selectedListing.price} (${selectedListing.quantityRemaining} left)`
                ) : (
                  `Needed: ${selectedListing.quantity}`
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenChat(selectedListing)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Chat
                </button>
                <button
                  onClick={() => onClaim(selectedListing)}
                  className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors cursor-pointer"
                >
                  {selectedListing.type === 'surplus' ? 'Claim' : 'I Have This'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
