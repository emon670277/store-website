import { Product, Order, PaymentConfig, CustomerReview } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'isaiyaa_products_v1',
  ORDERS: 'isaiyaa_orders_v1',
  PAYMENT_CONFIG: 'isaiyaa_payment_config_v1',
  REVIEWS: 'isaiyaa_reviews_v1',
};

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  bkashNumber: '01824554565',
  bkashType: 'Personal (Send Money)',
  nagadNumber: '01824554565',
  nagadType: 'Personal (Send Money)',
  binancePayId: '78291045',
  btcAddress: 'bc1q9v0z4f7c3r8w2l9x7d5e4s3a2m1k0j9h8g7f6',
  ltcAddress: 'ltc1q7z8x9c0v1b2n3m4k5j6h7g8f9d0s1a2',
  bdtToUsdRate: 122,
  btcUsdPrice: 92000,
  ltcUsdPrice: 95,
  adminWhatsapp: '01824554565',
  adminTelegram: '@Devoloper_Emon',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-card-01',
    title: 'Virtual Visa Card ($5 Initial Balance)',
    category: 'cards',
    price: 850,
    originalPrice: 1100,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Seller',
    shortDescription: 'Suitable for Facebook Boosting, Google Ads, OTT and international subscriptions.',
    description: 'The best solution for international payments! 3D Secure Verified Virtual Visa Card. It comes with a $5 initial balance. You can pay with one click for Facebook Ads, Google Ads, ChatGPT Plus, Netflix and international sites. Complete card number, CVV and expiry date will be provided on WhatsApp.',
    features: [
      'Instant $5 balance included',
      '100% working for Facebook & Google Ads',
      '3D Secure OTP support',
      'Reloadable balance facility',
      '24/7 Customer support & replacement'
    ],
    stock: 'in_stock',
    deliveryTime: '5-15 Minutes',
    warranty: '1 Month Full Guarantee',
    isCard: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-card-02',
    title: 'Virtual MasterCard (Reloadable)',
    category: 'cards',
    price: 950,
    originalPrice: 1250,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    badge: 'Hot Product',
    shortDescription: 'MasterCard for dollar payments on global platforms and e-commerce sites.',
    description: 'Reliable prepaid MasterCard for international shopping and subscriptions. Being reloadable, you can top-up dollars later as per your requirement. Funds can be easily loaded via Binance Pay or Crypto.',
    features: [
      'Accepted by all global merchants',
      'Reloadable system',
      'Link to view balance and transaction history',
      'Verified & high limit card'
    ],
    stock: 'in_stock',
    deliveryTime: '5-15 Minutes',
    warranty: 'Full Replacement Support',
    isCard: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-vpn-01',
    title: 'NordVPN Premium (1 Year Private Account)',
    category: 'vpn',
    price: 490,
    originalPrice: 850,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Offer',
    shortDescription: 'Ultra fast speed, 60+ country servers and fully secure privacy.',
    description: 'NordVPN Premium 1 year official subscription. There is no alternative to ensure high speed browsing, streaming and security. Can be used on 6 devices simultaneously.',
    features: [
      '5000+ ultra fast servers in 60+ countries',
      'Double VPN & No-log policy',
      'Support on all devices: PC, Mobile, TV',
      'Full 1 year warranty & support'
    ],
    stock: 'in_stock',
    deliveryTime: '5-10 Minutes',
    warranty: '1 Year Replacement Warranty',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-vpn-02',
    title: 'ExpressVPN Premium (High Speed Dedicated)',
    category: 'vpn',
    price: 550,
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    badge: 'Ultra Fast',
    shortDescription: 'World number one VPN for gaming and super fast browsing.',
    description: 'Get unlimited bandwidth and low-ping gaming experience with ExpressVPN. Most reliable for unlocking OTT streaming and restricted sites.',
    features: [
      'Super speed with Lightway protocol',
      'Gaming & Live Streaming Optimized',
      'Powerful cloud servers in 105 countries',
      '24/7 Customer Support'
    ],
    stock: 'in_stock',
    deliveryTime: '5-15 Minutes',
    warranty: '1 Month Replacement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-acc-01',
    title: 'ChatGPT Plus (GPT-4o Premium Access)',
    category: 'accounts',
    price: 650,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    badge: 'Most Demanding',
    shortDescription: 'Latest GPT-4o, DALL-E 3 image generation and unlimited advanced features.',
    description: 'ChatGPT Plus subscription, OpenAI\'s most powerful artificial intelligence model. Enjoy unlimited benefits of coding, research, writing, image generation and voice mode.',
    features: [
      'Access to GPT-4o and o1 preview',
      'DALL-E 3 high quality image maker',
      'Custom GPTs & Code Interpreter',
      'Private profile & full history saved'
    ],
    stock: 'in_stock',
    deliveryTime: '5-10 Minutes',
    warranty: '1 Month Full Warranty',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-acc-02',
    title: 'Netflix 4K UHD (1 Screen Private Pin Profile)',
    category: 'accounts',
    price: 280,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular',
    shortDescription: 'Ultra HD 4K resolution, 1 screen guarantee with private pin.',
    description: 'Netflix 4K UHD 1 screen account for watching original movies and series. Your profile will have its own pin code, so no one else can enter. Comfortable entertainment without buffering.',
    features: [
      '4K Ultra HD and HDR quality',
      'Own pin code protected profile',
      'Support on TV, Mobile and Laptop',
      '1 Month full non-drop guarantee'
    ],
    stock: 'in_stock',
    deliveryTime: '5-15 Minutes',
    warranty: '1 Month Full Replacement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-acc-03',
    title: 'Canva Pro Lifetime (Education Verified)',
    category: 'accounts',
    price: 190,
    originalPrice: 400,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    badge: 'Lifetime',
    shortDescription: 'Unlock all Canva premium templates, Magic AI and background remover.',
    description: 'Make graphic design easy with Canva Pro. Access background removal with 1 click, premium fonts, 100 million+ stock photos and premium vectors on your own email.',
    features: [
      'Activation on your own Gmail',
      'Over 100 million stock photos and videos',
      'One-click background remover & Magic Switch',
      'Lifetime access guarantee'
    ],
    stock: 'in_stock',
    deliveryTime: '5-10 Minutes',
    warranty: 'Lifetime Support',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-fb-01',
    title: 'Facebook Old ID (2012-2016 Session + 2FA On)',
    category: 'facebook',
    price: 350,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    badge: 'Highly Trusted',
    shortDescription: 'Old ID perfect for real friends, long history and running ads.',
    description: 'Highly trusted old Facebook account for marketing and Facebook campaigns. These were opened between 2012 to 2016, which will include 2-step verification code (2FA Key) and mail access. Does not disable easily.',
    features: [
      '2012-2016 Trusted Old Profile',
      '2FA Google Authenticator Key included',
      'Marketplace & Ads Access enabled',
      'Full guidelines for logging in'
    ],
    stock: 'in_stock',
    deliveryTime: '5-15 Minutes',
    warranty: 'Login Replacement Warranty',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-fb-02',
    title: 'Facebook Business Manager (BM) Unlimited Limit',
    category: 'facebook',
    price: 1200,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    badge: 'Agency Level',
    shortDescription: 'Verified Facebook Business Manager with unlimited daily spend limit.',
    description: 'Ready-made verified Facebook Business Manager (BM) for high budget campaigns and e-commerce dropshipping. No spending limit, possible to run ads by adding card quickly.',
    features: [
      'High spending limit (No Limit)',
      'Instant invitation link delivery',
      'Pixel and domain verification support',
      'First choice for professional advertisers'
    ],
    stock: 'limited',
    deliveryTime: '10-20 Minutes',
    warranty: 'Full Setup Guarantee',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-course-01',
    title: 'Full Stack Web Development VIP Course',
    category: 'courses',
    price: 590,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Course',
    shortDescription: '50+ live projects including HTML, CSS, JavaScript, React and full Backend.',
    description: 'Zero to Hero level Full Stack Web Development Masterclass. You will get lifetime access to video lectures and source code on drive link including frontend, backend database and cloud deployment with real life projects.',
    features: [
      '50+ Real World Practical Projects',
      'Lifetime Google Drive download access',
      'Coding resources & premium project templates',
      'Doubt solving support on WhatsApp'
    ],
    stock: 'in_stock',
    deliveryTime: 'Instant (5 Min)',
    warranty: 'Lifetime Access',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-course-02',
    title: 'Professional Ethical Hacking & Cyber Security Course',
    category: 'courses',
    price: 650,
    originalPrice: 4000,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    badge: 'VIP Course',
    shortDescription: 'Complete Bengali course on Network Penetration Testing, Bug Bounty and Website Security.',
    description: 'Practical course on Kali Linux, preventing WiFi hacking, website security testing and working on international bug bounty platforms. Full HD video and hacking tools pack included.',
    features: [
      'Kali Linux & practical lab setup',
      'Complete guide to earning dollars with Bug Bounty',
      'Premium security tools pack gift',
      'Private student group access'
    ],
    stock: 'in_stock',
    deliveryTime: 'Instant (5 Min)',
    warranty: 'Lifetime Access',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-app-01',
    title: 'CapCut Pro PC & Mobile (1 Year Activation)',
    category: 'apps',
    price: 350,
    originalPrice: 750,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
    badge: 'Video Editing',
    shortDescription: 'Unlock all premium transitions, AI effects and 4K export in CapCut.',
    description: 'CapCut Pro account for social media content creators. Use 4K ultra smooth export, AI video upscaling and premium sound effects on both PC and Smartphone without hesitation.',
    features: [
      'Works on both PC and Mobile devices',
      'All premium AI transitions and filters',
      'No watermark, full 4K 60FPS export',
      '1 Year non-stop service'
    ],
    stock: 'in_stock',
    deliveryTime: '5-15 Minutes',
    warranty: '1 Year Warranty',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    customerName: 'Tanveer Ahmed',
    productPurchased: 'Virtual Visa Card ($5 Balance)',
    rating: 5,
    comment: 'Excellent service! Got all card details on WhatsApp within 10 minutes of paying via bKash. Added smoothly to Facebook Ads. Trusted site!',
    date: '2 days ago',
    verified: true,
  },
  {
    id: 'rev-02',
    customerName: 'Rakibul Hasan',
    productPurchased: 'NordVPN Premium (1 Year)',
    rating: 5,
    comment: 'Paid through Binance, got confirmation immediately. VPN speed is fantastic. Recommended shop!',
    date: '4 days ago',
    verified: true,
  },
  {
    id: 'rev-03',
    customerName: 'Sadia Islam',
    productPurchased: 'Canva Pro Lifetime',
    rating: 5,
    comment: 'Received Canva Pro on Gmail instantly. All premium features unlocked. Price is much lower than other sites.',
    date: '1 week ago',
    verified: true,
  },
  {
    id: 'rev-04',
    customerName: 'Mehedi Hasan Shuvo',
    productPurchased: 'ChatGPT Plus (GPT-4o)',
    rating: 5,
    comment: 'Very happy with ChatGPT Plus. Live support was very good. Response is available immediately for any problem.',
    date: '2 weeks ago',
    verified: true,
  },
];

export function getStoredProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load products', err);
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('isaiyaa_products_updated'));
  } catch (err) {
    console.error('Failed to save products', err);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load orders', err);
    return [];
  }
}

export function addOrder(order: Order): void {
  try {
    const current = getStoredOrders();
    const updated = [order, ...current];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('isaiyaa_orders_updated'));
  } catch (err) {
    console.error('Failed to add order', err);
  }
}

export function updateOrderStatus(orderId: string, status: Order['status'], adminDeliveryNotes?: string): void {
  try {
    const orders = getStoredOrders().map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          adminDeliveryNotes: adminDeliveryNotes ?? ord.adminDeliveryNotes,
          deliveredAt: status === 'delivered' ? new Date().toISOString() : ord.deliveredAt,
        };
      }
      return ord;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('isaiyaa_orders_updated'));
  } catch (err) {
    console.error('Failed to update order status', err);
  }
}

export function deleteOrder(orderId: string): void {
  try {
    const orders = getStoredOrders().filter((ord) => ord.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('isaiyaa_orders_updated'));
  } catch (err) {
    console.error('Failed to delete order', err);
  }
}

export function getPaymentConfig(): PaymentConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_CONFIG);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(DEFAULT_PAYMENT_CONFIG));
      return DEFAULT_PAYMENT_CONFIG;
    }
    return { ...DEFAULT_PAYMENT_CONFIG, ...JSON.parse(data) };
  } catch (err) {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function savePaymentConfig(config: PaymentConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new Event('isaiyaa_config_updated'));
  } catch (err) {
    console.error('Failed to save payment config', err);
  }
}

export function getStoredReviews(): CustomerReview[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_REVIEWS;
  }
}

export function addReview(review: CustomerReview): void {
  try {
    const current = getStoredReviews();
    const updated = [review, ...current];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    window.dispatchEvent(new Event('isaiyaa_reviews_updated'));
  } catch (err) {
    console.error('Failed to add review', err);
  }
}

export function deleteReview(reviewId: string): void {
  try {
    const reviews = getStoredReviews().filter((r) => r.id !== reviewId);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('isaiyaa_reviews_updated'));
  } catch (err) {
    console.error('Failed to delete review', err);
  }
}
