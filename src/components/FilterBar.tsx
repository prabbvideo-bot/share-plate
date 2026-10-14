import React from 'react';
import { Search, LayoutGrid, Map as MapIcon, X } from 'lucide-react';
import { Category, PostType } from '../types';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: 'all' | PostType;
  setTypeFilter: (t: 'all' | PostType) => void;
  priceFilter: 'all' | 'free' | 'discount';
  setPriceFilter: (p: 'all' | 'free' | 'discount') => void;
  selectedCategory: 'all' | Category;
  setSelectedCategory: (c: 'all' | Category) => void;
  selectedDietary: string[];
  toggleDietary: (tag: string) => void;
  viewMode: 'grid' | 'map';
  setViewMode: (v: 'grid' | 'map') => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const CATEGORIES: Category[] = [
  'Home Cooked Meals',
  'Tiffin & Breakfast',
  'Rotis & Breads',
  'Mandi Sabzi & Fruits',
  'Dairy & Ration',
  'Mithai & Snacks',
  'Puja Prasadam',
];

const DIETARY_OPTIONS = ['Pure Veg', 'Jain', 'Eggetarian', 'Halal', 'Vegan'];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  priceFilter,
  setPriceFilter,
  selectedCategory,
  setSelectedCategory,
  selectedDietary,
  toggleDietary,
  viewMode,
  setViewMode,
  activeFiltersCount,
  onClearFilters,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-3 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Top filter row: Search, Type Segmented control, View Mode */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search phulkas, tiffin idlis, thali, mandi sabzi, milk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Filter Segmented Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Surplus vs Requests Segmented control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setTypeFilter('surplus')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  typeFilter === 'surplus'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Surplus Food
              </button>
              <button
                onClick={() => setTypeFilter('request')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  typeFilter === 'request'
                    ? 'bg-white text-amber-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Neighbor Requests
              </button>
            </div>

            {/* Price Filter: All / Free (₹0) / Discount */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  priceFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Prices
              </button>
              <button
                onClick={() => setPriceFilter('free')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  priceFilter === 'free'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free (₹0)
              </button>
              <button
                onClick={() => setPriceFilter('discount')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  priceFilter === 'discount'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Discounted (₹)
              </button>
            </div>

            {/* View Mode Toggle: Grid or Map */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 ml-auto md:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grid Bulletin View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Neighborhood Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">1-km Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category and Dietary Filter Row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dietary filters toggle */}
          <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-slate-200">
            {DIETARY_OPTIONS.map((tag) => {
              const active = selectedDietary.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleDietary(tag)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap text-xs ${
                    active
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tag}
                </button>
              );
            })}

            {activeFiltersCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 underline cursor-pointer ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
