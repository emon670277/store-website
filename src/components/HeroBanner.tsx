import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe,
  Lock,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  return (
    <div className="relative w-full overflow-hidden bg-slate-900 pt-8 pb-12 sm:pt-12 sm:pb-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-cyan-500/10 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left space-y-6 sm:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Reliable Digital Solutions Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Get Your <br className="hidden sm:block" />
              <span className="text-emerald-500 relative">
                Digital Products
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
              <br /> Instantly.
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              We provide 100% verified Virtual Visa Cards, Premium VPNs, 
              Subscription Accounts, and exclusive Software with instant delivery 
              and full warranty support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-buy-card-btn"
                onClick={() => onSelectCategory('cards')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              >
                <CreditCard className="w-5 h-5" />
                <span>Buy Virtual Card</span>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </button>
              
              <button
                id="hero-all-products-btn"
                onClick={() => {
                  const section = document.getElementById('products-section');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>View Products</span>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 pt-4 opacity-70">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-bold">Fast Delivery</p>
                  <p className="text-slate-500 text-[11px]">Within 5-15 Minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-bold">Trusted Store</p>
                  <p className="text-slate-500 text-[11px]">100% Genuine Service</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="hidden lg:block relative"
          >
            {/* Main Interactive Card */}
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/40">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Virtual Visa Card</h3>
                      <p className="text-emerald-500 text-xs font-bold">Instant Activation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Balance</p>
                    <p className="text-white font-black text-2xl">$5.00</p>
                  </div>
                </div>

                <div className="h-px bg-slate-700/50 w-full" />

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Merchant', value: 'Facebook Ads', icon: <TrendingUp className="w-3 h-3" /> },
                    { label: 'Coverage', value: 'Global', icon: <Globe className="w-3 h-3" /> },
                    { label: 'Security', value: '3D Secure', icon: <Lock className="w-3 h-3" /> },
                    { label: 'Type', value: 'Reloadable', icon: <RefreshCw className="w-3 h-3" /> }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <p className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1.5">
                        {item.icon} {item.label}
                      </p>
                      <p className="text-white text-sm font-bold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="w-full h-12 rounded-xl bg-slate-700/30 border border-slate-600/50 flex items-center px-4 justify-between">
                    <span className="text-slate-400 text-xs font-mono">**** **** **** 4291</span>
                    <div className="flex gap-1">
                      <div className="w-6 h-4 rounded bg-orange-500/50" />
                      <div className="w-6 h-4 rounded bg-amber-500/50" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Provider
                  </span>
                  <span>isaiyaa.bd</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
            </div>

            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left pr-2">
                <p className="text-slate-500 text-[10px] font-bold uppercase">Best Seller</p>
                <p className="text-slate-900 text-sm font-black">Visa Card</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left pr-2">
                <p className="text-slate-500 text-[10px] font-bold uppercase">100% Genuine</p>
                <p className="text-slate-900 text-sm font-black">Accounts</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
