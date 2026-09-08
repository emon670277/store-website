import React, { useState } from 'react';
import { 
  Headphones, 
  X
} from 'lucide-react';
import { PaymentConfig } from '../types';

interface FloatingSupportProps {
  paymentConfig: PaymentConfig;
}

export const FloatingSupport: React.FC<FloatingSupportProps> = ({ paymentConfig }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Clean WhatsApp number
  const adminPhone = paymentConfig.adminWhatsapp.replace(/[^0-9]/g, '');
  const fullPhone = adminPhone.startsWith('88') ? adminPhone : `88${adminPhone}`;
  const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent('Hi, I need assistance from isaiyaa.bd Digital Store.')}`;

  // Clean Telegram handle
  const telegramHandle = paymentConfig.adminTelegram.replace('@', '');
  const telegramUrl = `https://t.me/${telegramHandle}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 select-none font-['Outfit',sans-serif]">
      
      {/* Animated Pop-up Options */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 mb-1 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Support Greeting Card */}
          <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xl shadow-slate-200/50 max-w-[240px] text-right">
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-black uppercase text-emerald-600 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Support Online</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 mt-1 leading-snug">
              Got questions or need help with an order? Contact our admin directly!
            </p>
          </div>

          {/* WhatsApp Button */}
          <a
            id="floating-support-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-emerald-50 shadow-xl shadow-slate-200/50 border border-slate-200 hover:scale-110 active:scale-95 transition-all overflow-hidden p-1.5"
          >
            <img 
              src="https://i.postimg.cc/NfcXWXQp/image.png" 
              alt="WhatsApp" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Telegram Button */}
          <a
            id="floating-support-telegram"
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-sky-50 shadow-xl shadow-slate-200/50 border border-slate-200 hover:scale-110 active:scale-95 transition-all overflow-hidden p-1.5"
          >
            <img 
              src="https://i.postimg.cc/6Qy4dLh8/image.png" 
              alt="Telegram" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </a>

        </div>
      )}

      {/* Main Floating Button */}
      <button
        id="floating-customer-care-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customer Support"
        className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-white text-slate-900 rotate-90 border border-slate-200'
            : 'bg-emerald-600 text-white shadow-emerald-500/30 hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Headphones className="w-6 h-6 stroke-[2.2]" />
            {/* Online Pulse Indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </>
        )}
      </button>

    </div>
  );
};
