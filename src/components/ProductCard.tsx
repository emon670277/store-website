import React from 'react';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import { ShoppingBag, Zap, Shield, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onInstantBuy,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Top Banner Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.badge ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
            <Sparkles className="w-3 h-3" />
            {product.badge}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-md">
            <Shield className="w-3 h-3 text-emerald-600" />
            {product.warranty}
          </span>
        )}

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 backdrop-blur-md shadow-sm">
          <Clock className="w-3 h-3 text-amber-500" />
          {product.deliveryTime}
        </span>
      </div>

      {/* Product Image Area - Clickable to open full details */}
      <div
        id={`product-image-${product.id}`}
        onClick={() => onViewDetails(product)}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Soft bottom gradient to blend image smoothly */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title - Clickable to open details */}
          <h3
            id={`product-title-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="text-base sm:text-lg font-bold text-slate-900 hover:text-emerald-600 line-clamp-2 cursor-pointer transition-colors duration-200"
          >
            {product.title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quick bullet points */}
          <div className="mt-3 space-y-1">
            {product.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Price on the Left, "Buy Now" on the Right */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Left: Price */}
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Right: Buy Button */}
          <button
            id={`buy-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onInstantBuy(product);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
