/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { NeighborhoodControl } from './components/NeighborhoodControl';
import { FilterBar } from './components/FilterBar';
import { FoodCard } from './components/FoodCard';
import { NeighborhoodMap } from './components/NeighborhoodMap';
import { NewListingModal } from './components/NewListingModal';
import { ClaimModal } from './components/ClaimModal';
import { ChatModal } from './components/ChatModal';
import { MyClaimsModal } from './components/MyClaimsModal';
import { SafetyGuidelinesModal } from './components/SafetyGuidelinesModal';
import { AuthModal } from './components/AuthModal';
import { DEFAULT_NEIGHBORHOODS, INITIAL_FOOD_LISTINGS } from './data/mockData';
import { Category, Claim, FoodListing, NeighborhoodLocation, PostType } from './types';
import { calculateDistanceKm } from './utils/geo';
import { Utensils, HeartHandshake, UserCheck, ShieldCheck } from 'lucide-react';

function SharePlateApp() {
  const { userProfile, user } = useAuth();

  // Persistent listings in localStorage
  const [listings, setListings] = useState<FoodListing[]>(() => {
    const saved = localStorage.getItem('neighborhood_listings_in_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_FOOD_LISTINGS;
  });

  // Persistent claims in localStorage
  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem('neighborhood_claims_in_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // Active neighborhood center and radius
  const [currentLocation, setCurrentLocation] = useState<NeighborhoodLocation>(
    DEFAULT_NEIGHBORHOODS[0]
  );
  const [radiusKm, setRadiusKm] = useState<number>(1.0); // 1-km default radius
  const [isLocating, setIsLocating] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | PostType>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'discount'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'browse' | 'requests' | 'map' | 'claims' | 'guidelines'>('browse');

  // Modals state
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [claimingListing, setClaimingListing] = useState<FoodListing | null>(null);
  const [activeChatListing, setActiveChatListing] = useState<FoodListing | null>(null);
  const [isClaimsModalOpen, setIsClaimsModalOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('neighborhood_listings_in_v1', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('neighborhood_claims_in_v1', JSON.stringify(claims));
  }, [claims]);

  // Sync tab navigation
  const handleTabChange = (tab: 'browse' | 'requests' | 'map' | 'claims' | 'guidelines') => {
    setActiveTab(tab);
    if (tab === 'browse') {
      setTypeFilter('surplus');
      setViewMode('grid');
    } else if (tab === 'requests') {
      setTypeFilter('request');
      setViewMode('grid');
    } else if (tab === 'map') {
      setViewMode('map');
    } else if (tab === 'claims') {
      setIsClaimsModalOpen(true);
    } else if (tab === 'guidelines') {
      setIsGuidelinesOpen(true);
    }
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const customLoc: NeighborhoodLocation = {
          id: 'gps-custom',
          name: 'My Current Location',
          subdistrict: 'Detected GPS',
          city: 'Local Area',
          coordinates: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        };
        setCurrentLocation(customLoc);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        alert('Could not retrieve current location. Defaulting to locality hub.');
      },
      { timeout: 7000 }
    );
  };

  const toggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setPriceFilter('all');
    setSelectedCategory('all');
    setSelectedDietary([]);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (typeFilter !== 'all' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedDietary.length;

  const { filteredListings, itemsInRadiusCount } = useMemo(() => {
    let inRadiusCount = 0;

    const filtered = listings.filter((item) => {
      const dist = calculateDistanceKm(
        currentLocation.coordinates.lat,
        currentLocation.coordinates.lng,
        item.coordinates.lat,
        item.coordinates.lng
      );

      const isInsideRadius = dist <= radiusKm;
      if (isInsideRadius) {
        inRadiusCount++;
      }

      if (!isInsideRadius) return false;

      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      if (priceFilter === 'free' && item.price > 0) return false;
      if (priceFilter === 'discount' && item.price === 0) return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      if (
        selectedDietary.length > 0 &&
        !selectedDietary.some((tag) => item.dietaryTags.includes(tag))
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesPoster = item.posterName.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesLoc = item.locationName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesPoster && !matchesCategory && !matchesLoc) {
          return false;
        }
      }

      return true;
    });

    filtered.sort((a, b) => {
      const distA = calculateDistanceKm(
        currentLocation.coordinates.lat,
        currentLocation.coordinates.lng,
        a.coordinates.lat,
        a.coordinates.lng
      );
      const distB = calculateDistanceKm(
        currentLocation.coordinates.lat,
        currentLocation.coordinates.lng,
        b.coordinates.lat,
        b.coordinates.lng
      );
      return distA - distB;
    });

    return { filteredListings: filtered, itemsInRadiusCount: inRadiusCount };
  }, [
    listings,
    currentLocation,
    radiusKm,
    typeFilter,
    priceFilter,
    selectedCategory,
    selectedDietary,
    searchQuery,
  ]);

  const handleAddNewListing = (newListing: FoodListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleConfirmClaim = (claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === claim.listingId) {
          const newQty = Math.max(0, item.quantityRemaining - claim.quantity);
          return {
            ...item,
            quantityRemaining: newQty,
            claimedCount: item.claimedCount + claim.quantity,
          };
        }
        return item;
      })
    );
  };

  const handleMarkCollected = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'collected' } : c))
    );
  };

  const handleCancelClaim = (claimId: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;
    setClaims((prev) => prev.filter((c) => c.id !== claimId));

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === claim.listingId) {
          return {
            ...item,
            quantityRemaining: item.quantityRemaining + claim.quantity,
            claimedCount: Math.max(0, item.claimedCount - claim.quantity),
          };
        }
        return item;
      })
    );
  };

  const handleOpenChatById = (listingId: string) => {
    const item = listings.find((l) => l.id === listingId);
    if (item) {
      setIsClaimsModalOpen(false);
      setActiveChatListing(item);
    }
  };

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const activeClaimsCount = claims.filter((c) => c.status === 'active').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100">
      {/* 3-Zone Header with User Authentication */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenNewPost={() => setIsNewPostOpen(true)}
        onOpenAuth={handleOpenAuthModal}
        claimsCount={activeClaimsCount}
      />

      {/* User Login Notification Banner if logged in */}
      {userProfile && (
        <div className="bg-emerald-50 border-b border-emerald-100 py-1.5 px-4 text-xs text-emerald-900 text-center font-medium">
          <span>Signed in as <strong>{userProfile.name}</strong> ({userProfile.locality}) · {userProfile.accountType.toUpperCase()} 🍱</span>
        </div>
      )}

      {/* Hyper-Local Radius & Locality Control */}
      <NeighborhoodControl
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
        availableLocations={DEFAULT_NEIGHBORHOODS}
        radiusKm={radiusKm}
        onChangeRadius={setRadiusKm}
        itemsInRadiusCount={itemsInRadiusCount}
        totalItemsCount={listings.length}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      {/* Filter and View Mode Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDietary={selectedDietary}
        toggleDietary={toggleDietary}
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'map' ? (
          <div className="space-y-6">
            <NeighborhoodMap
              currentLocation={currentLocation}
              listings={filteredListings}
              radiusKm={radiusKm}
              onClaim={(listing) => setClaimingListing(listing)}
              onOpenChat={(listing) => setActiveChatListing(listing)}
            />

            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  All Active Spots in {radiusKm >= 1 ? `${radiusKm} km` : `${Math.round(radiusKm * 1000)} m`} Radius
                </h3>
                <span className="text-xs text-slate-500 tabular-nums">
                  {filteredListings.length} spots nearby
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <FoodCard
                    key={listing.id}
                    listing={listing}
                    distanceKm={calculateDistanceKm(
                      currentLocation.coordinates.lat,
                      currentLocation.coordinates.lng,
                      listing.coordinates.lat,
                      listing.coordinates.lng
                    )}
                    onClaim={(item) => setClaimingListing(item)}
                    onOpenChat={(item) => setActiveChatListing(item)}
                    onSelectOnMap={() => window.scrollTo({ top: 120, behavior: 'smooth' })}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {filteredListings.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    No surplus food found within {radiusKm >= 1 ? `${radiusKm} km` : `${Math.round(radiusKm * 1000)} m`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try expanding to 2 km, switching localities, or be the first neighbor or eatery to post!
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setRadiusKm(2.0)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Expand to 2.0 km
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => {
                  const dist = calculateDistanceKm(
                    currentLocation.coordinates.lat,
                    currentLocation.coordinates.lng,
                    listing.coordinates.lat,
                    listing.coordinates.lng
                  );

                  return (
                    <FoodCard
                      key={listing.id}
                      listing={listing}
                      distanceKm={dist}
                      onClaim={(item) => setClaimingListing(item)}
                      onOpenChat={(item) => setActiveChatListing(item)}
                      onSelectOnMap={() => setViewMode('map')}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Indian Community Story Section */}
        <section className="mt-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Community Annadanam & Zero Waste
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                How SharePlate Works in Your 1-km Neighborhood
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Local bhojanalayas, darshinis, dhabas, sweet shops, mandi vendors, and home cooks post surplus freshly made rotis, evening tiffins, dal, and produce. Everything is visible strictly within a walkable 1-km perimeter so neighbors can easily collect fresh food within minutes without delivery charges or waste.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">1. Walk & Discover</span>
                  <span className="text-slate-500">Live neighborhood postings updated daily after lunch and dinner preparation.</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">2. Reserve Digital Pass</span>
                  <span className="text-slate-500">Lock in your portion with a free or discounted pickup code before it runs out.</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">3. Bring Your Dabba 🍱</span>
                  <span className="text-slate-500">Eco-friendly pickup with your own stainless steel tiffin or cloth bag.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3">
              <HeartHandshake className="w-8 h-8 text-emerald-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">
                {userProfile ? `Welcome, ${userProfile.name}!` : 'Join Your Neighborhood Network'}
              </h4>
              <p className="text-xs text-slate-500">
                {userProfile
                  ? 'Ready to post surplus thalis, rotis, or request pantry items?'
                  : 'Create an account to post food, save claims, and coordinate with neighbors.'}
              </p>
              {userProfile ? (
                <button
                  onClick={() => setIsNewPostOpen(true)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                >
                  Post Food on 1-km Board
                </button>
              ) : (
                <button
                  onClick={() => handleOpenAuthModal('register')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                >
                  Create Free Account
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">SharePlate India</span>
            <span aria-hidden="true">·</span>
            <span>Hyper-Local Neighborhood Food & Tiffin Sharing</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsGuidelinesOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Food Safety & Hygiene Guidelines
            </button>
            <button
              onClick={() => setIsClaimsModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              My Claims ({activeClaimsCount})
            </button>
            <span className="text-slate-400">© 2026 SharePlate Community</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      )}

      {isNewPostOpen && (
        <NewListingModal
          currentLocation={currentLocation}
          currentUserProfile={userProfile}
          onClose={() => setIsNewPostOpen(false)}
          onSubmit={handleAddNewListing}
        />
      )}

      {claimingListing && (
        <ClaimModal
          listing={claimingListing}
          onClose={() => setClaimingListing(null)}
          onConfirmClaim={handleConfirmClaim}
          onOpenChat={(listing) => setActiveChatListing(listing)}
        />
      )}

      {activeChatListing && (
        <ChatModal
          listing={activeChatListing}
          onClose={() => setActiveChatListing(null)}
        />
      )}

      {isClaimsModalOpen && (
        <MyClaimsModal
          claims={claims}
          onClose={() => setIsClaimsModalOpen(false)}
          onMarkCollected={handleMarkCollected}
          onCancelClaim={handleCancelClaim}
          onOpenChatById={handleOpenChatById}
        />
      )}

      {isGuidelinesOpen && (
        <SafetyGuidelinesModal onClose={() => setIsGuidelinesOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SharePlateApp />
    </AuthProvider>
  );
}
