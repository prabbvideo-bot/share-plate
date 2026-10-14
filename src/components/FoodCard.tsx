import React from 'react';
import { Clock, MapPin, MessageSquare, ShieldCheck, UserCheck, Utensils, HeartHandshake, ShoppingBag } from 'lucide-react';
import { FoodListing } from '../types';
import { formatDistance, formatWalkingTime } from '../utils/geo';

interface FoodCardProps {
  listing: FoodListing;
  distanceKm: number;
  onClaim: (listing: FoodListing) => void;
  onOpenChat: (listing: FoodListing) => void;
  onSelectOnMap: (listing: FoodListing) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  listing,
  distanceKm,
  onClaim,
  onOpenChat,
  onSelectOnMap,
}) => {
  const isSurplus = listing.type === 'surplus';
  const isFree = listing.price === 0;
  const isAvailable = listing.quantityRemaining > 0;

  // Calculate human remaining time
  const getRemainingTimeText = (expiresAt: string) => {
    const diffMs = new Date(expiresAt).getTime() - new Date().getTime();
    if (diffMs <= 0) return 'Expired';
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const isPureVeg = listing.dietaryTags.includes('Pure Veg') || listing.dietaryTags.includes('Jain');

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group">
      <div>
        {/* Card Image Area (with Zero-Broken-Image fallback) */}
        <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 p-6 text-center">
              {isSurplus ? (
                <Utensils className="w-10 h-10 text-emerald-600 mb-2 stroke-1" />
              ) : (
                <HeartHandshake className="w-10 h-10 text-amber-600 mb-2 stroke-1" />
              )}
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {listing.category}
              </span>
            </div>
          )}

          {/* Price or Request overlay (in INR ₹) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {isSurplus ? (
              <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs text-xs font-bold text-slate-900 tabular-nums">
                {isFree ? (
                  <span className="text-emerald-700 font-extrabold uppercase tracking-wide">Free (₹0)</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-800 font-extrabold">₹{listing.price}</span>
                    {listing.originalPrice && (
                      <span className="text-slate-400 line-through font-normal text-[11px]">
                        ₹{listing.originalPrice}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-900/90 text-amber-50 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs text-xs font-semibold tracking-wide">
                Neighbor Request · {listing.urgency || 'Needed'}
              </div>
            )}
          </div>

          {/* Distance Indicator Overlay */}
          <button
            onClick={() => onSelectOnMap(listing)}
            className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 tabular-nums transition-colors cursor-pointer"
            title="View on Map"
          >
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{formatDistance(distanceKm)}</span>
            <span className="hidden sm:inline text-slate-300">({formatWalkingTime(distanceKm)})</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Unboxed Metadata Line (Category · Host · Time) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            {/* Indian Veg indicator */}
            {isPureVeg && (
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-emerald-600 p-0.5 rounded-xs" title="Pure Vegetarian">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
              </span>
            )}
            <span className="font-medium text-slate-700">{listing.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              {['restaurant', 'mess', 'darshini', 'sweetstall'].includes(listing.posterType) ? (
                <span title="Verified food establishment">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                </span>
              ) : (
                <span title="Neighbor resident">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500 inline shrink-0" />
                </span>
              )}
              <span className="truncate max-w-[130px]">{listing.posterName}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {getRemainingTimeText(listing.expiresAt)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {listing.title}
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Dietary tags & Dabba note: clean unboxed text */}
          <div className="flex items-center justify-between text-[11px] gap-2 flex-wrap">
            {listing.dietaryTags.length > 0 && (
              <div className="text-emerald-800 font-medium flex items-center gap-1 flex-wrap">
                {listing.dietaryTags.map((tag, i) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {i < listing.dietaryTags.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
            {listing.bringDabbaRecommended && (
              <span className="text-slate-500 text-[10px] font-medium">
                🍱 Bring your own dabba
              </span>
            )}
          </div>

          {/* Location & Pickup info */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span className="truncate">{listing.locationName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{listing.pickupWindow}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer / Action Buttons */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="text-xs">
            {isSurplus ? (
              <span className="tabular-nums text-slate-600">
                <strong className="text-slate-900 font-semibold">{listing.quantityRemaining}</strong> of{' '}
                {listing.initialQuantity} {listing.unit} left
              </span>
            ) : (
              <span className="text-slate-600">
                Needed: <strong className="text-slate-900 font-semibold">{listing.quantity}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChat(listing)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Chat with neighbor"
              aria-label="Message poster"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {isSurplus ? (
              <button
                onClick={() => onClaim(listing)}
                disabled={!isAvailable}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isAvailable
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Claim Portion' : 'Claimed'}
              </button>
            ) : (
              <button
                onClick={() => onClaim(listing)}
                className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                I Have This
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
