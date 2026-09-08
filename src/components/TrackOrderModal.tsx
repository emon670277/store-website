import React, { useState } from 'react';
import { Order } from '../types';
import { formatPrice } from '../utils/format';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageCircle, 
  PackageCheck
} from 'lucide-react';

interface TrackOrderModalProps {
  orders: Order[];
  onClose: () => void;
  adminWhatsapp: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  orders,
  onClose,
  adminWhatsapp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const cleanQuery = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  const matchedOrders = orders.filter((ord) => {
    if (!cleanQuery) return false;
    const cleanId = ord.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPhone = ord.customerWhatsapp.replace(/[^0-9]/g, '');
    return cleanId.includes(cleanQuery) || cleanPhone.includes(cleanQuery);
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
            <Clock className="w-3.5 h-3.5" />
            Approved (Processing)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled / Invalid Trx
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  const cleanAdminPhone = adminWhatsapp.replace(/[^0-9]/g, '');
  const adminWaLink = `https://wa.me/${cleanAdminPhone.startsWith('88') ? cleanAdminPhone : `88${cleanAdminPhone}`}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm font-['Outfit',sans-serif]">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Track Order Status</h3>
          </div>
          <button
            id="close-track-modal"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5 uppercase tracking-wide">
              Enter Order ID or WhatsApp Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="track-search-input"
                  type="text"
                  placeholder="e.g. IS-123456 or 018XXXXXXXX"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHasSearched(true);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {hasSearched && matchedOrders.length === 0 && (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold">No orders found.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Please use the correct ID or WhatsApp number.
                </p>
              </div>
            )}

            {matchedOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                    #{ord.id}
                  </span>
                  {getStatusBadge(ord.status)}
                </div>

                <div className="text-sm font-black text-slate-800">
                  {ord.productTitle}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Price:</span>
                    <span className="font-black text-emerald-600">{formatPrice(ord.productPriceBDT)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Payment Method:</span>
                    <span className="uppercase font-mono font-bold">{ord.paymentMethod}</span>
                  </div>
                </div>

                {ord.adminDeliveryNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
                    <span className="font-bold block text-emerald-700 mb-0.5 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Admin Note:
                    </span>
                    {ord.adminDeliveryNotes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WhatsApp help reminder */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-sm">
            <span className="text-slate-600 font-medium">For support or queries:</span>
            <a
              href={adminWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 font-bold hover:text-emerald-700 transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Admin Support</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
