import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Mail, Lock, Building2, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const DEMO_ACCOUNTS: UserProfile[] = [
  {
    id: 'demo-meenakshi',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.neighbor@example.in',
    accountType: 'resident',
    locality: '4th Cross, Indiranagar',
    city: 'Bengaluru',
    phone: '+91 98450 12345',
    bringDabbaDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-rajeshwar',
    name: 'Shri Krishna Bhojanalaya',
    email: 'krishna.bhojanalaya@example.in',
    accountType: 'mess',
    locality: '100ft Road, Indiranagar',
    city: 'Bengaluru',
    phone: '+91 98860 54321',
    bringDabbaDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-ramesh',
    name: 'Sri Udupi Grand Tiffin',
    email: 'udupi.grand@example.in',
    accountType: 'darshini',
    locality: 'CMH Road, Indiranagar',
    city: 'Bengaluru',
    phone: '+91 99001 88776',
    bringDabbaDefault: true,
    createdAt: new Date().toISOString(),
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'login' }) => {
  const { loginWithGoogle, registerWithEmail, loginWithEmail, setDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<UserProfile['accountType']>('resident');
  const [locality, setLocality] = useState('12th Main, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [phone, setPhone] = useState('');
  const [bringDabba, setBringDabba] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name or establishment name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await registerWithEmail(email, password, {
          name: name.trim(),
          accountType,
          locality: locality.trim(),
          city: city.trim(),
          phone: phone.trim(),
          bringDabbaDefault: bringDabba,
        });
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demo: UserProfile) => {
    setDemoUser(demo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {mode === 'register' ? 'Create Neighborhood Account' : 'Sign in to SharePlate'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'register'
                ? 'Join your 1-km community food sharing network'
                : 'Access your claims, postings, and chat with neighbors'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer text-center ${
              mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google (Recommended)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider relative shrink-0">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name / Establishment Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar or Annapoorna Bhojanalaya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Category
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="resident">Local Neighbor / Resident</option>
                    <option value="mess">Bhojanalaya / Mess / Kitchen</option>
                    <option value="darshini">Darshini / Udupi Cafe</option>
                    <option value="restaurant">Restaurant / Dhaba</option>
                    <option value="sweetstall">Mithai & Sweet House</option>
                    <option value="mandi">Sabzi Mandi / Farmer Stall</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Locality / Street
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12th Main, Indiranagar"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (Optional for pickup coordination)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    checked={bringDabba}
                    onChange={(e) => setBringDabba(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>I bring my own Dabba / Steel Tiffin 🍱 by default</span>
                </label>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="neighbor@example.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
            >
              {loading
                ? 'Processing...'
                : mode === 'register'
                ? 'Complete Account Creation'
                : 'Sign In to Account'}
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Instant 1-Click Demo Testing
            </span>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleSelectDemo(demo)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800 block">
                      {demo.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {demo.locality} · {demo.accountType === 'resident' ? 'Neighbor' : 'Local Kitchen'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    Login <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
