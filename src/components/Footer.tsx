import React from 'react';
import { 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  MessageCircle, 
  Send, 
  Lock, 
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PaymentConfig, ProductCategory } from '../types';

interface FooterProps {
  paymentConfig: PaymentConfig;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  paymentConfig,
  onSelectCategory,
  onOpenAdmin,
  onOpenTrackOrder,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs sm:text-sm font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-slate-900">
                isaiyaa<span className="text-emerald-600">.bd</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Trusted digital solutions provider for premium virtual cards, 
              VPN services, official software subscriptions, and verified 
              digital accounts with instant delivery and full warranty support.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-bold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Delivery: 5-15 Minutes (Via WhatsApp)</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Categories
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              <li>
                <button
                  onClick={() => onSelectCategory('cards')}
                  className="hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                  <span>Virtual Visa & Mastercard</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('vpn')}
                  className="hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>VPN Collection</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accounts')}
                  className="hover:text-emerald-600 transition-colors flex items-center gap-2 group text-left"
                >
                  <span>Premium Subscriptions</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('facebook')}
                  className="hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                >
                  <span>Social Assets & BM</span>
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3.5 text-xs font-bold">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">WhatsApp</span>
                  <span className="text-slate-700 font-mono">{paymentConfig.adminWhatsapp}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">Telegram</span>
                  <span className="text-slate-700 font-mono">{paymentConfig.adminTelegram}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Service
            </h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={onOpenTrackOrder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
              >
                <span>Track Your Order</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-100 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bold">
          <p>© {currentYear} isaiyaa.bd. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
             <span className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               Premium Service
             </span>
             <span className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               Verified Provider
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
