import React, { useState } from 'react';
import { 
  Search, 
  CreditCard, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Lock, 
  Menu, 
  X, 
  Clock, 
  GraduationCap, 
  Smartphone,
  Facebook,
  Grid
} from 'lucide-react';
import { ProductCategory } from '../types';
import { PAYMENT_LOGOS } from '../utils/format';

interface NavbarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
  pendingOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  onOpenTrackOrder,
  pendingOrdersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { id: ProductCategory; label: string; icon: React.ReactNode; isSpecial?: boolean }[] = [
    { id: 'all', label: 'All Products', icon: <Grid className="w-4 h-4" /> },
    { id: 'cards', label: 'Cards (Visa/Master)', icon: <CreditCard className="w-4 h-4" />, isSpecial: true },
    { id: 'vpn', label: 'VPN', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'accounts', label: 'Premium Accounts', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'facebook', label: 'Facebook IDs/BM', icon: <Facebook className="w-4 h-4" /> },
    { id: 'apps', label: 'Apps', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      {/* Top micro bar with live notice */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-emerald-600">isaiyaa.bd Official Store</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">Instant 5-15 minute delivery directly to WhatsApp</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              id="nav-track-order-top"
              onClick={onOpenTrackOrder}
              className="hover:text-emerald-600 flex items-center gap-1 text-slate-600 transition-colors font-medium"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Track Order</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              id="nav-admin-login-top"
              onClick={onOpenAdmin}
              className="hover:text-amber-600 flex items-center gap-1 text-slate-500 transition-colors font-medium"
              title="Admin Panel"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { onSelectCategory('all'); }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 shadow-sm group-hover:shadow-md transition-all overflow-hidden flex items-center justify-center">
              <img 
                src={PAYMENT_LOGOS.website} 
                alt="Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                  isaiyaa<span className="text-emerald-600">.bd</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Premium Digital Store</p>
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-md mx-2 relative">
            <div className="relative">
              <input
                id="search-product-input"
                type="text"
                placeholder="Search products (e.g. Visa Card, VPN, Netflix)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Direct Card button for user emphasis */}
            <button
              id="nav-cards-btn"
              onClick={() => onSelectCategory('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                selectedCategory === 'cards'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Buy Card</span>
            </button>

            <button
              id="nav-track-order-btn"
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm bg-white"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Track Order</span>
            </button>

            <button
              id="nav-admin-dashboard-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors relative shadow-sm bg-white"
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Admin Panel</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1 animate-pulse" />
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden gap-1">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 py-2.5 overflow-x-auto border-t border-slate-100 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                id={`cat-nav-${cat.id}`}
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : cat.isSpecial
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                {cat.isSpecial && !isSelected && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-amber-100 text-amber-700 rounded font-semibold border border-amber-200">
                    VISA/Master
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-xl">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  id={`mobile-cat-${cat.id}`}
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              id="mobile-track-order-btn"
              onClick={() => {
                onOpenTrackOrder();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Check Order Status</span>
            </button>

            <button
              id="mobile-admin-btn"
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium shadow-sm"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Admin Panel ({pendingOrdersCount} Pending)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
