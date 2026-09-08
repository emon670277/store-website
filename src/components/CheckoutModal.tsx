import React, { useState } from 'react';
import { Product, PaymentMethod, PaymentConfig, Order } from '../types';
import { calculateCryptoEquivalent, formatPrice, PAYMENT_LOGOS } from '../utils/format';
import { addOrder } from '../utils/storage';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { 
  X, 
  Check, 
  Copy, 
  Upload, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Lock,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  product: Product | null;
  paymentConfig: PaymentConfig;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  paymentConfig,
  onClose,
  onOrderSuccess,
}) => {
  if (!product) return null;

  // Selected payment method - default to bKash
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form fields
  const [trxId, setTrxId] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Success state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const isBdtMethod = method === 'bkash' || method === 'nagad';
  const cryptoInfo = calculateCryptoEquivalent(product.price, method as 'binance' | 'btc' | 'ltc', {
    bdtToUsdRate: paymentConfig.bdtToUsdRate,
    btcUsdPrice: paymentConfig.btcUsdPrice,
    ltcUsdPrice: paymentConfig.ltcUsdPrice,
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle file upload for screenshot
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload image files only (JPG, PNG, WebP).');
      return;
    }

    setScreenshotFileName(file.name);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setScreenshotData(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit payment proof
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const cleanPhone = customerWhatsapp.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please provide a valid WhatsApp number so we can deliver your product.');
      return;
    }

    if (isBdtMethod && !trxId.trim()) {
      setErrorMessage('Please provide the Trx ID for bKash/Nagad payment.');
      return;
    }

    if (!screenshotData) {
      setErrorMessage('Payment proof screenshot is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = `IS-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        productId: product.id,
        productTitle: product.title,
        productPriceBDT: product.price,
        paymentMethod: method,
        customerWhatsapp: cleanPhone,
        customerName: customerName.trim() || undefined,
        trxId: isBdtMethod ? trxId.trim().toUpperCase() : undefined,
        screenshotUrl: screenshotData,
        cryptoDetails: !isBdtMethod
          ? {
              coin: cryptoInfo.coinSymbol,
              cryptoAmount: cryptoInfo.cryptoAmount,
              fiatUsd: cryptoInfo.fiatUsd,
              walletAddress:
                method === 'binance'
                  ? paymentConfig.binancePayId
                  : method === 'btc'
                  ? paymentConfig.btcAddress
                  : paymentConfig.ltcAddress,
            }
          : undefined,
        customerNotes: notes.trim() || undefined,
        status: 'pending',
      };

      // Save to localStorage & notify admin
      addOrder(newOrder);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe confetti fallback
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Admin WhatsApp pre-filled message URL
  const getAdminWhatsappUrl = (order: Order) => {
    const adminPhone = paymentConfig.adminWhatsapp.replace(/[^0-9]/g, '');
    const fullPhone = adminPhone.startsWith('88') ? adminPhone : `88${adminPhone}`;
    
    let msg = `*New Order Payment Proof (isaiyaa.bd)*%0A`;
    msg += `----------------------------%0A`;
    msg += `*Order ID:* #${order.id}%0A`;
    msg += `*Product:* ${encodeURIComponent(order.productTitle)}%0A`;
    msg += `*Price:* ৳${order.productPriceBDT}%0A`;
    msg += `*Method:* ${order.paymentMethod.toUpperCase()}%0A`;
    if (order.trxId) {
      msg += `*Trx ID:* ${order.trxId}%0A`;
    }
    if (order.cryptoDetails) {
      msg += `*Crypto Pay:* ${order.cryptoDetails.cryptoAmount} ${order.cryptoDetails.coin}%0A`;
    }
    msg += `*WhatsApp:* ${order.customerWhatsapp}%0A`;
    msg += `----------------------------%0A`;
    msg += `Please verify payment and deliver product. Thanks!`;

    return `https://wa.me/${fullPhone}?text=${msg}`;
  };

  // Generate Admin Telegram pre-filled message URL
  const getAdminTelegramUrl = (order: Order) => {
    const username = paymentConfig.adminTelegram.replace('@', '');
    let msg = `New Order (isaiyaa.bd): ID #${order.id}, Product: ${order.productTitle}, Method: ${order.paymentMethod.toUpperCase()}, WhatsApp: ${order.customerWhatsapp}`;
    return `https://t.me/${username}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm font-['Outfit',sans-serif]">
      <div 
        id="checkout-modal-card"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {completedOrder ? 'Order Successful!' : 'Payment & Order Confirmation'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {completedOrder ? 'Your order is being reviewed' : 'Secure Digital Payment'}
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!completedOrder ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            
            {/* Selected Product Banner */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500 font-medium">Delivery: {product.deliveryTime}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-emerald-600 font-bold">{product.warranty}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider">Price</span>
                <span className="text-lg font-black text-emerald-600">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Step 1: Select Payment Method */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-3">
                1. Select Payment Method:
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                
                {/* bKash */}
                <button
                  type="button"
                  id="pay-method-bkash"
                  onClick={() => setMethod('bkash')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-2 ${
                    method === 'bkash'
                      ? 'bg-pink-50 border-pink-200 ring-2 ring-pink-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-pink-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={PAYMENT_LOGOS.bkash} alt="bKash" className="h-6 object-contain" referrerPolicy="no-referrer" />
                  <span className={`text-[10px] font-bold ${method === 'bkash' ? 'text-pink-600' : 'text-slate-500'}`}>bKash</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  id="pay-method-nagad"
                  onClick={() => setMethod('nagad')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-2 ${
                    method === 'nagad'
                      ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={PAYMENT_LOGOS.nagad} alt="Nagad" className="h-6 object-contain" referrerPolicy="no-referrer" />
                  <span className={`text-[10px] font-bold ${method === 'nagad' ? 'text-orange-600' : 'text-slate-500'}`}>Nagad</span>
                </button>

                {/* Binance */}
                <button
                  type="button"
                  id="pay-method-binance"
                  onClick={() => setMethod('binance')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-2 ${
                    method === 'binance'
                      ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-yellow-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={PAYMENT_LOGOS.binance} alt="Binance" className="h-6 object-contain" referrerPolicy="no-referrer" />
                  <span className={`text-[10px] font-bold ${method === 'binance' ? 'text-yellow-700' : 'text-slate-500'}`}>Binance</span>
                </button>

                {/* BTC */}
                <button
                  type="button"
                  id="pay-method-btc"
                  onClick={() => setMethod('btc')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-2 ${
                    method === 'btc'
                      ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-amber-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={PAYMENT_LOGOS.btc} alt="BTC" className="h-6 object-contain" referrerPolicy="no-referrer" />
                  <span className={`text-[10px] font-bold ${method === 'btc' ? 'text-amber-700' : 'text-slate-500'}`}>Bitcoin</span>
                </button>

                {/* LTC */}
                <button
                  type="button"
                  id="pay-method-ltc"
                  onClick={() => setMethod('ltc')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center gap-2 ${
                    method === 'ltc'
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <img src={PAYMENT_LOGOS.ltc} alt="LTC" className="h-6 object-contain" referrerPolicy="no-referrer" />
                  <span className={`text-[10px] font-bold ${method === 'ltc' ? 'text-blue-700' : 'text-slate-500'}`}>Litecoin</span>
                </button>

              </div>
            </div>

            {/* Step 2: Dynamic Payment Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              
              {/* If bKash or Nagad */}
              {isBdtMethod && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Payable Amount:</span>
                    <span className="text-xl font-black text-emerald-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${method === 'bkash' ? 'bg-pink-100' : 'bg-orange-100'}`}>
                         <img src={method === 'bkash' ? PAYMENT_LOGOS.bkash : PAYMENT_LOGOS.nagad} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block font-bold uppercase tracking-tighter">
                          {method === 'bkash' ? 'bKash Number' : 'Nagad Number'} (Personal):
                        </span>
                        <span className="text-lg font-mono font-black text-slate-900 tracking-wider">
                          {method === 'bkash' ? paymentConfig.bkashNumber : paymentConfig.nagadNumber}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="copy-phone-btn"
                      onClick={() => handleCopy(
                        method === 'bkash' ? paymentConfig.bkashNumber : paymentConfig.nagadNumber,
                        'phone'
                      )}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors w-fit shadow-sm"
                    >
                      {copiedField === 'phone' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-black">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 font-medium leading-relaxed bg-white/50 p-2.5 rounded-xl border border-slate-200/50 italic">
                    <span className="font-black text-slate-900">Note:</span> Please use the <span className="font-bold text-emerald-600">"Send Money"</span> option from your {method === 'bkash' ? 'bKash' : 'Nagad'} app to the number above. After payment, provide the Trx ID and screenshot below.
                  </p>
                </div>
              )}

              {/* If Binance, BTC, or LTC */}
              {!isBdtMethod && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium uppercase tracking-wider">Payable Crypto:</span>
                      <span className="text-[10px] text-slate-400 font-medium italic">(Converted from {formatPrice(product.price)})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-600 block">
                        {cryptoInfo.formattedDisplay}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center shadow-sm">
                         <img src={PAYMENT_LOGOS[method as keyof typeof PAYMENT_LOGOS]} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-slate-500 block font-bold uppercase tracking-tighter">
                          {method === 'binance' ? 'Binance Pay ID' : method === 'btc' ? 'BTC Wallet Address' : 'LTC Wallet Address'}:
                        </span>
                        <span className="text-sm sm:text-base font-mono font-black text-slate-900 break-all leading-tight">
                          {method === 'binance' 
                            ? paymentConfig.binancePayId 
                            : method === 'btc' 
                            ? paymentConfig.btcAddress 
                            : paymentConfig.ltcAddress}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="copy-wallet-btn"
                      onClick={() => handleCopy(
                        method === 'binance' 
                          ? paymentConfig.binancePayId 
                          : method === 'btc' 
                          ? paymentConfig.btcAddress 
                          : paymentConfig.ltcAddress,
                        'wallet'
                      )}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors w-fit shadow-sm"
                    >
                      {copiedField === 'wallet' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-black">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Step 3: Proof Inputs */}
            <div className="space-y-4">
              <label className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                2. Provide Payment Verification:
              </label>

              {/* Customer WhatsApp */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Your WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="customer-whatsapp-input"
                    type="tel"
                    required
                    placeholder="e.g. +8801824554565"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-sm"
                  />
                  <Smartphone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-tight">
                  ⚠️ Your product login details and receipt will be sent to this WhatsApp number.
                </p>
              </div>

              {/* Trx ID - Required for bKash / Nagad */}
              {isBdtMethod && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Transaction ID (Trx ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="trx-id-input"
                    type="text"
                    required
                    placeholder="e.g. BLA892X01Z"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-sm"
                  />
                </div>
              )}

              {/* Screenshot Upload */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Payment Proof Screenshot <span className="text-red-500">*</span>
                </label>

                <div className="mt-1 flex flex-col gap-2">
                  <label 
                    htmlFor="payment-screenshot-input"
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      screenshotData 
                        ? 'border-emerald-500/50 bg-emerald-50/50' 
                        : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50'
                    }`}
                  >
                    {screenshotData ? (
                      <div className="flex items-center gap-4 w-full">
                        <img
                          src={screenshotData}
                          alt="Screenshot preview"
                          className="w-20 h-20 object-cover rounded-xl border border-emerald-200 shrink-0 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-emerald-700 flex items-center gap-1.5 uppercase tracking-tighter">
                            <CheckCircle2 className="w-4 h-4" />
                            Screenshot Selected
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 font-bold uppercase tracking-widest opacity-60">
                            {screenshotFileName || 'proof.png'}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-black underline mt-1.5 inline-block cursor-pointer">
                            Click to change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-slate-700 font-black uppercase tracking-tight">
                          Upload Payment Proof
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 font-bold">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      id="payment-screenshot-input"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Optional Name or Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-bold uppercase tracking-tighter">
                    Your Name (Optional)
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-bold uppercase tracking-tighter">
                    Special Request (Optional)
                  </label>
                  <input
                    id="customer-notes-input"
                    type="text"
                    placeholder="e.g. Urgent delivery"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-black shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Confirm & Submit Order</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure Payment • Instant Processing</span>
              </div>
            </div>

          </form>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 sm:p-10 space-y-8 text-center bg-white">
            
            <div className="relative">
               <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 right-1/2 translate-x-12 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
            </div>

            <div className="space-y-3">
              <div className="inline-block px-4 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
                Order ID: #{completedOrder.id}
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                Thank You! Order Received
              </h3>
              <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                We are verifying your payment proof. Your product will be delivered to <span className="text-emerald-700 font-black">{completedOrder.customerWhatsapp}</span> within <span className="text-slate-900 font-black">5-15 minutes</span>.
              </p>
            </div>

            {/* Instant Admin Notification Buttons */}
            <div className="p-6 rounded-[2.5rem] bg-slate-900 text-left space-y-4 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full" />
               <div className="relative z-10">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4" />
                  Speed Up Delivery
                </h5>
                <p className="text-slate-400 text-sm font-medium mb-5">
                  Message our admin directly on WhatsApp or Telegram to receive your product instantly.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    id="notify-admin-whatsapp-btn"
                    href={getAdminWhatsappUrl(completedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm shadow-xl shadow-green-500/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Send on WhatsApp</span>
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </a>

                  <a
                    id="notify-admin-telegram-btn"
                    href={getAdminTelegramUrl(completedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-black text-sm shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send on Telegram</span>
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                id="done-order-btn"
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-black text-sm transition-all uppercase tracking-widest shadow-sm"
              >
                Back to Store
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
