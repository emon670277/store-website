import React, { useState, useEffect } from 'react';
import { 
  Product, 
  Order, 
  PaymentConfig, 
  CustomerReview, 
  ProductCategory 
} from './types';
import { 
  getStoredProducts, 
  getStoredOrders, 
  getPaymentConfig, 
  getStoredReviews 
} from './utils/storage';
import { formatPrice } from './utils/format';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { FloatingSupport } from './components/FloatingSupport';
import { ReviewSection } from './components/ReviewSection';
import { TrackOrderModal } from './components/TrackOrderModal';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './admin/AdminLoginModal';
import { AdminDashboard } from './admin/AdminDashboard';
import { 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  RefreshCw,
  Search
} from 'lucide-react';

export default function App() {
  // Global states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  // Navigation & Filter states
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);

  // Sync data from local storage
  const refreshAllData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setPaymentConfig(getPaymentConfig());
    setReviews(getStoredReviews());
  };

  useEffect(() => {
    refreshAllData();

    const handleStorageUpdate = () => refreshAllData();
    window.addEventListener('isaiyaa_products_updated', handleStorageUpdate);
    window.addEventListener('isaiyaa_orders_updated', handleStorageUpdate);
    window.addEventListener('isaiyaa_config_updated', handleStorageUpdate);
    window.addEventListener('isaiyaa_reviews_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('isaiyaa_products_updated', handleStorageUpdate);
      window.removeEventListener('isaiyaa_orders_updated', handleStorageUpdate);
      window.removeEventListener('isaiyaa_config_updated', handleStorageUpdate);
      window.removeEventListener('isaiyaa_reviews_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    // Category match
    const categoryMatches =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'cards'
        ? product.category === 'cards' || product.isCard === true
        : product.category === selectedCategory;

    // Search query match (English title, description, features)
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryMatches;

    const titleMatch = product.title.toLowerCase().includes(query);
    const descMatch = (product.description || '').toLowerCase().includes(query);
    const shortDescMatch = (product.shortDescription || '').toLowerCase().includes(query);
    const badgeMatch = (product.badge || '').toLowerCase().includes(query);
    const featMatch = product.features.some((f) => f.toLowerCase().includes(query));

    return categoryMatches && (titleMatch || descMatch || shortDescMatch || badgeMatch || featMatch);
  });

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  // Handle when Admin opens
  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setShowAdminView(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // If Admin View is active, render the dedicated Admin Dashboard
  if (showAdminView && isAdminLoggedIn) {
    return (
      <AdminDashboard
        orders={orders}
        products={products}
        paymentConfig={paymentConfig}
        reviews={reviews}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setShowAdminView(false);
        }}
        onCloseToStore={() => setShowAdminView(false)}
        onRefreshData={refreshAllData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-900 font-['Outfit',sans-serif]">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          // Scroll smoothly to products section if cards or category clicked
          const prodSection = document.getElementById('products-section');
          if (prodSection) {
            prodSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={handleOpenAdmin}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        pendingOrdersCount={pendingOrdersCount}
      />

      {/* Hero Promotional Banner */}
      <HeroBanner
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const prodSection = document.getElementById('products-section');
          if (prodSection) {
            prodSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Catalog Area */}
      <main id="products-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Section Header & Active Filter Description */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              {selectedCategory === 'cards' ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase">
                  <CreditCard className="w-3.5 h-3.5" />
                  Visa & MasterCard Category
                </span>
              ) : selectedCategory !== 'all' ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">
                  {selectedCategory} Category
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  All Premium Products
                </span>
              )}
              
              <span className="text-xs text-slate-500">
                ({filteredProducts.length} available)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {selectedCategory === 'cards'
                ? 'International Virtual Visa & MasterCard'
                : selectedCategory === 'vpn'
                ? 'High-Speed Premium VPN Collection'
                : selectedCategory === 'accounts'
                ? 'Official Premium Accounts'
                : selectedCategory === 'facebook'
                ? 'Facebook Old Accounts & Business Manager'
                : selectedCategory === 'courses'
                ? 'Special Premium Video Courses'
                : selectedCategory === 'apps'
                ? 'VIP Premium Apps'
                : 'Popular Digital Products & Services'}
            </h2>

            {selectedCategory === 'cards' && (
              <p className="text-xs sm:text-sm text-amber-600 mt-1">
                Instant activated 3D secure virtual cards for Facebook Boosting, Google Ads & international payments.
              </p>
            )}
          </div>

          {/* Reset Filters if searching or filtered */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              id="reset-filter-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-200 shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              <span>View All Products</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                No products found matching "{searchQuery}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Try searching with another name or change category. You can also message admin for direct requests.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors"
            >
              Back to All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(prod) => setActiveDetailProduct(prod)}
                onInstantBuy={(prod) => setCheckoutProduct(prod)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Customer Reviews Section */}
      <ReviewSection reviews={reviews} />

      {/* Footer */}
      <Footer
        paymentConfig={paymentConfig}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdmin}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Floating Customer Care Support Button */}
      <FloatingSupport paymentConfig={paymentConfig} />

      {/* Product Detail Modal (Full Page View) */}
      {activeDetailProduct && (
        <ProductDetailModal
          product={activeDetailProduct}
          onClose={() => setActiveDetailProduct(null)}
          onBuyNow={(prod) => {
            setActiveDetailProduct(null);
            setCheckoutProduct(prod);
          }}
        />
      )}

      {/* Checkout & Payment Modal */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          paymentConfig={paymentConfig}
          onClose={() => setCheckoutProduct(null)}
          onOrderSuccess={() => {
            refreshAllData();
          }}
        />
      )}

      {/* Track Order Modal */}
      {isTrackOrderOpen && (
        <TrackOrderModal
          orders={orders}
          onClose={() => setIsTrackOrderOpen(false)}
          adminWhatsapp={paymentConfig.adminWhatsapp}
        />
      )}

      {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsAdminLoggedIn(true);
            setShowAdminView(true);
          }}
          onClose={() => setIsAdminLoginOpen(false)}
        />
      )}

    </div>
  );
}
