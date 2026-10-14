import React, { useState } from 'react';
import { Plus, ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'browse' | 'requests' | 'map' | 'claims' | 'guidelines';
  setActiveTab: (tab: 'browse' | 'requests' | 'map' | 'claims' | 'guidelines') => void;
  onOpenNewPost: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  claimsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPost,
  onOpenAuth,
  claimsCount,
}) => {
  const { userProfile, user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isLoggedIn = Boolean(user || userProfile);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveTab('browse')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
            SharePlate
          </span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'browse'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Surplus Food
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'requests'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Neighbor Requests
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'map'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            1-km Map
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'claims'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>My Claims</span>
            {claimsCount > 0 && (
              <span className="text-xs font-semibold tabular-nums text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {claimsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'guidelines'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Safety Guidelines
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + User Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* User Account Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {(userProfile?.name || user?.displayName || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">
                  {userProfile?.name || user?.displayName || 'Neighbor'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <span className="font-bold text-slate-900 block truncate">
                      {userProfile?.name || user?.displayName}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {userProfile?.email || user?.email}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold block mt-1 uppercase tracking-wider">
                      {userProfile?.accountType || 'Resident Neighbor'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveTab('claims');
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                  >
                    View My Claims ({claimsCount})
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={onOpenNewPost}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 active:scale-98 transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Food</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-white py-2 px-2 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'browse' ? 'text-emerald-700 font-semibold bg-emerald-50' : ''
          }`}
        >
          Surplus
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'requests' ? 'text-emerald-700 font-semibold bg-emerald-50' : ''
          }`}
        >
          Requests
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'map' ? 'text-emerald-700 font-semibold bg-emerald-50' : ''
          }`}
        >
          1-km Map
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'claims' ? 'text-emerald-700 font-semibold bg-emerald-50' : ''
          }`}
        >
          Claims ({claimsCount})
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'guidelines' ? 'text-emerald-700 font-semibold bg-emerald-50' : ''
          }`}
        >
          Safety
        </button>
      </div>
    </header>
  );
};
