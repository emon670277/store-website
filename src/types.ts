export type ProductCategory = 
  | 'all'
  | 'cards'
  | 'vpn'
  | 'accounts'
  | 'apps'
  | 'courses'
  | 'facebook'
  | 'other';

export type ProductStock = 'in_stock' | 'limited' | 'out_of_stock';

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number; // in BDT
  originalPrice?: number; // in BDT for discount display
  image: string;
  badge?: string; // e.g. "জনপ্রিয়", "অফার", "১ মাস রিপ্লেসমেন্ট"
  shortDescription: string;
  description: string;
  features: string[];
  stock: ProductStock;
  deliveryTime: string; // e.g. "৫-১৫ মিনিট"
  warranty: string; // e.g. "১ মাস ফুল রিপ্লেসমেন্ট"
  isCard?: boolean; // Visa / Master Card specific flag
  createdAt: string;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'binance' | 'btc' | 'ltc';

export type OrderStatus = 'pending' | 'reviewed' | 'delivered' | 'cancelled';

export interface Order {
  id: string; // e.g. "IS-78492"
  createdAt: string;
  productId: string;
  productTitle: string;
  productPriceBDT: number;
  paymentMethod: PaymentMethod;
  customerWhatsapp: string;
  customerName?: string;
  trxId?: string; // required for bKash, Nagad
  screenshotUrl: string; // Base64 data URL or image URL
  cryptoDetails?: {
    coin: string;
    cryptoAmount: string;
    fiatUsd: string;
    walletAddress: string;
  };
  customerNotes?: string;
  status: OrderStatus;
  adminDeliveryNotes?: string;
  deliveredAt?: string;
}

export interface PaymentConfig {
  bkashNumber: string;
  bkashType: string; // Personal / Merchant / Send Money
  nagadNumber: string;
  nagadType: string; // Personal / Send Money
  binancePayId: string;
  btcAddress: string;
  ltcAddress: string;
  bdtToUsdRate: number; // e.g. 122 BDT = 1 USD
  btcUsdPrice: number; // e.g. 92,000 USD
  ltcUsdPrice: number; // e.g. 95 USD
  adminWhatsapp: string;
  adminTelegram: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  productPurchased: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean;
  avatarUrl?: string;
}
