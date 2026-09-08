import React from 'react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Clock
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm">
      {/* Container card */}
      <div 
        id="product-detail-container"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top bar with back and close button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <button
            id="back-to-products-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Left Large Image & Right Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8">
          
          {/* Left Side: Large Product Image */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.badge}
                </span>
              )}
            </div>

            {/* Trust Highlights below image */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Warranty: {product.warranty}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Delivery Time: {product.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>Instant delivery to WhatsApp after payment</span>
              </div>
            </div>
          </div>

          {/* Right Side: Title, Full Description, Features, Price & Buy Now */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Stock */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {product.stock === 'in_stock' ? '● In-Stock' : '● Limited Stock'}
                </span>
                <span className="text-xs text-slate-400 font-medium uppercase">
                  ID: #{product.id.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h2>

              {/* Short summary */}
              <p className="mt-2 text-sm text-emerald-600 font-bold">
                {product.shortDescription}
              </p>

              {/* Full Description Section */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
                  Full Details & Benefits:
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  What's Included:
                </h4>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Price and Buy Now Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  id="detail-buy-now-btn"
                  onClick={() => onBuyNow(product)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order Now (Buy Now)</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
