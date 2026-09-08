import React, { useState } from 'react';
import { 
  Order, 
  Product, 
  PaymentConfig, 
  CustomerReview, 
  ProductCategory,
  OrderStatus 
} from '../types';
import { formatPrice } from '../utils/format';
import { 
  saveProducts, 
  updateOrderStatus, 
  deleteOrder, 
  savePaymentConfig, 
  deleteReview 
} from '../utils/storage';
import { 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Copy, 
  LogOut, 
  DollarSign, 
  Star, 
  X, 
  Check, 
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  MessageCircle
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  paymentConfig: PaymentConfig;
  reviews: CustomerReview[];
  onLogout: () => void;
  onCloseToStore: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  paymentConfig,
  reviews,
  onLogout,
  onCloseToStore,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'payment' | 'reviews'>('orders');
  
  // Orders filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);

  // Delivery credentials modal
  const [deliveringOrder, setDeliveringOrder] = useState<Order | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Product edit/add modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    category: 'cards',
    price: 500,
    originalPrice: 700,
    image: '',
    badge: '',
    warranty: '1 Month Warranty',
    deliveryTime: '5-15 Minutes',
    shortDescription: '',
    description: '',
    features: ['100% Working', '24/7 Support'],
    stock: 'in_stock',
  });
  const [featureInput, setFeatureInput] = useState('');

  // Payment settings state
  const [configForm, setConfigForm] = useState<PaymentConfig>({ ...paymentConfig });
  const [configSavedToast, setConfigSavedToast] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'reviewed')
    .reduce((sum, o) => sum + o.productPriceBDT, 0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerWhatsapp.includes(orderSearch) ||
      ord.productTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (ord.trxId && ord.trxId.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'all' ? true : ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Open delivery WhatsApp message
  const handleOpenDeliveryWhatsapp = (order: Order, customCredentials = '') => {
    const cleanPhone = order.customerWhatsapp.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;

    let msg = `*isaiyaa.bd - Your Order Delivery Info*%0A`;
    msg += `-----------------------------------%0A`;
    msg += `Dear Customer, Hello!%0A`;
    msg += `Your Order ID: *#${order.id}*%0A`;
    msg += `Product: *${encodeURIComponent(order.productTitle)}*%0A`;
    msg += `Price: ${order.productPriceBDT} BDT%0A%0A`;
    if (customCredentials) {
      msg += `*Account/Card Login Info:*%0A${encodeURIComponent(customCredentials)}%0A%0A`;
    } else {
      msg += `*Account/Card Info:*%0A[Enter Password/Card Details Here]%0A%0A`;
    }
    msg += `-----------------------------------%0A`;
    msg += `If you face any issues, please message us on this WhatsApp. Thank you for choosing isaiyaa.bd! ❤️`;

    window.open(`https://wa.me/${fullPhone}?text=${msg}`, '_blank');
    
    // Auto mark as delivered
    updateOrderStatus(order.id, 'delivered', customCredentials);
    setDeliveringOrder(null);
    onRefreshData();
  };

  // Product Form Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map((p) => 
        p.id === editingProduct.id
          ? {
              ...editingProduct,
              ...productForm,
              price: Number(productForm.price),
              originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
              features: productForm.features && productForm.features.length > 0 ? productForm.features : ['Full Warranty'],
              isCard: productForm.category === 'cards',
            } as Product
          : p
      );
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: productForm.title || 'New Product',
        category: (productForm.category || 'cards') as ProductCategory,
        price: Number(productForm.price) || 500,
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        image: productForm.image || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
        badge: productForm.badge || undefined,
        shortDescription: productForm.shortDescription || 'Premium Digital Service',
        description: productForm.description || 'Full description here...',
        features: productForm.features && productForm.features.length > 0 ? productForm.features : ['100% Working', 'Instant Delivery'],
        stock: productForm.stock || 'in_stock',
        deliveryTime: productForm.deliveryTime || '5-15 Minutes',
        warranty: productForm.warranty || '1 Month Replacement',
        isCard: productForm.category === 'cards',
        createdAt: new Date().toISOString(),
      };
      updatedProducts = [newProd, ...products];
    }

    saveProducts(updatedProducts);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    onRefreshData();
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== productId);
      saveProducts(updated);
      onRefreshData();
    }
  };

  // Save payment settings
  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentConfig(configForm);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Outfit',sans-serif]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900">
                  isaiyaa<span className="text-amber-600">.bd</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 rounded-full uppercase">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Management Dashboard & Delivery Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="admin-refresh-btn"
              onClick={onRefreshData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              id="admin-to-store-btn"
              onClick={onCloseToStore}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Visit Store</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Orders</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {totalOrders}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pending</span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {pendingOrders}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Delivered</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {deliveredOrders}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Revenue</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {formatPrice(totalRevenue)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            id="tab-orders-btn"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Management</span>
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            id="tab-products-btn"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            id="tab-payment-btn"
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
              activeTab === 'payment'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Settings</span>
          </button>

          <button
            id="tab-reviews-btn"
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  id="admin-order-search"
                  type="text"
                  placeholder="Search by ID, Phone, or Trx ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'pending', 'reviewed', 'delivered', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      orderStatusFilter === st
                        ? 'bg-white text-amber-600 border border-amber-500 shadow-sm'
                        : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-slate-500 bg-slate-50/50">
                  <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-base font-black text-slate-900">No orders found</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">New orders will appear here automatically.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-4 px-4">Order ID & Date</th>
                        <th className="py-4 px-4">Product & Price</th>
                        <th className="py-4 px-4">Payment & Trx</th>
                        <th className="py-4 px-4">WhatsApp</th>
                        <th className="py-4 px-4 text-center">Proof</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-4 px-4">
                            <span className="font-mono font-black text-slate-900 block group-hover:text-amber-600 transition-colors uppercase">
                              #{ord.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5 uppercase">
                              {new Date(ord.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-4 max-w-[200px]">
                            <span className="font-bold text-slate-800 block truncate" title={ord.productTitle}>
                              {ord.productTitle}
                            </span>
                            <span className="text-xs font-black text-emerald-600 mt-0.5">
                              {formatPrice(ord.productPriceBDT)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                              {ord.paymentMethod}
                            </span>
                            {ord.trxId ? (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="font-mono text-[11px] text-amber-700 font-black truncate max-w-[120px]">
                                  {ord.trxId}
                                </span>
                                <button
                                  onClick={() => handleCopy(ord.trxId!, `trx-${ord.id}`)}
                                  className="text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                  {copiedText === `trx-${ord.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : null}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-900 text-sm">
                                {ord.customerWhatsapp}
                              </span>
                              <button
                                onClick={() => handleCopy(ord.customerWhatsapp, `phone-${ord.id}`)}
                                className="text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                {copiedText === `phone-${ord.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {ord.screenshotUrl ? (
                              <button
                                onClick={() => setSelectedProofOrder(ord)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[10px] font-black text-slate-700 border border-slate-200 shadow-sm transition-all uppercase"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-600" />
                                <span>View</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">N/A</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                updateOrderStatus(ord.id, e.target.value as OrderStatus);
                                onRefreshData();
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all focus:outline-none shadow-sm uppercase tracking-tighter ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : ord.status === 'reviewed'
                                  ? 'bg-sky-50 border-sky-200 text-sky-700'
                                  : ord.status === 'cancelled'
                                  ? 'bg-red-50 border-red-200 text-red-700'
                                  : 'bg-amber-50 border-amber-200 text-amber-700'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Approved</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                id={`deliver-btn-${ord.id}`}
                                onClick={() => {
                                  setDeliveringOrder(ord);
                                  setDeliveryNote(ord.adminDeliveryNotes || '');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black shadow-md shadow-emerald-500/20 transition-all uppercase"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Deliver</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this order?')) {
                                    deleteOrder(ord.id);
                                    onRefreshData();
                                  }
                                }}
                                className="p-2 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Catalog Management</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Manage products, pricing, and stock status.</p>
              </div>

              <button
                id="add-new-product-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    title: '',
                    category: 'cards',
                    price: 500,
                    originalPrice: 700,
                    image: '',
                    badge: 'NEW',
                    warranty: '1 Month Replacement',
                    deliveryTime: '5-15 Minutes',
                    shortDescription: '',
                    description: '',
                    features: ['100% Working', '24/7 Support'],
                    stock: 'in_stock',
                  });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 group-hover:scale-105 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          {prod.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${prod.stock === 'in_stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {prod.stock === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 truncate tracking-tight">{prod.title}</h4>
                      <p className="text-sm font-black text-emerald-600 mt-1">{formatPrice(prod.price)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-4 leading-relaxed italic">
                    {prod.shortDescription}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{prod.deliveryTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setProductForm({ ...prod });
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs flex items-center gap-1.5 font-black border border-slate-100 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 border border-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: PAYMENT ================= */}
        {activeTab === 'payment' && (
          <div className="max-w-2xl bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Payment Settings</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Configure your wallet numbers and crypto addresses.</p>
            </div>

            {configSavedToast && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold animate-in fade-in">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSavePaymentConfig} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">bKash Number:</label>
                  <input
                    type="text"
                    required
                    value={configForm.bkashNumber}
                    onChange={(e) => setConfigForm({ ...configForm, bkashNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nagad Number:</label>
                  <input
                    type="text"
                    required
                    value={configForm.nagadNumber}
                    onChange={(e) => setConfigForm({ ...configForm, nagadNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Binance Pay ID:</label>
                <input
                  type="text"
                  required
                  value={configForm.binancePayId}
                  onChange={(e) => setConfigForm({ ...configForm, binancePayId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">BTC Address:</label>
                  <input
                    type="text"
                    required
                    value={configForm.btcAddress}
                    onChange={(e) => setConfigForm({ ...configForm, btcAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-black focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">LTC Address:</label>
                  <input
                    type="text"
                    required
                    value={configForm.ltcAddress}
                    onChange={(e) => setConfigForm({ ...configForm, ltcAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-black focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">USD Rate (BDT):</label>
                  <input
                    type="number"
                    required
                    value={configForm.bdtToUsdRate}
                    onChange={(e) => setConfigForm({ ...configForm, bdtToUsdRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Admin WhatsApp:</label>
                  <input
                    type="text"
                    required
                    value={configForm.adminWhatsapp}
                    onChange={(e) => setConfigForm({ ...configForm, adminWhatsapp: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black focus:bg-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="save-payment-config-btn"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all uppercase"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 4: REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Customer Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 font-medium italic">"{rev.comment}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{rev.customerName}</h4>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{rev.productPurchased}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this review?')) {
                          deleteReview(rev.id);
                          onRefreshData();
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODALS ================= */}

      {/* Product Edit/Add Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Product Title:</label>
                    <input
                      type="text"
                      required
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Category:</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white outline-none"
                    >
                      <option value="cards">Virtual Cards</option>
                      <option value="vpn">VPN</option>
                      <option value="accounts">Premium Accounts</option>
                      <option value="facebook">Facebook Assets</option>
                      <option value="apps">Apps</option>
                      <option value="courses">Courses</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Price (BDT):</label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-emerald-600 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Regular Price:</label>
                      <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-400 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Image URL:</label>
                    <input
                      type="text"
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Badge (Optional):</label>
                    <input
                      type="text"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      placeholder="e.g. HOT, NEW, 50% OFF"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Stock:</label>
                      <select
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value as 'in_stock' | 'out_of_stock' })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white outline-none"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Delivery Time:</label>
                      <input
                        type="text"
                        value={productForm.deliveryTime}
                        onChange={(e) => setProductForm({ ...productForm, deliveryTime: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Short Description:</label>
                <input
                  type="text"
                  required
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Full Features & Details (One per line):</label>
                <textarea
                  rows={4}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 uppercase"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof Viewer */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-black text-slate-900 uppercase">Payment Proof - #{selectedProofOrder.id}</h4>
              <button onClick={() => setSelectedProofOrder(null)} className="p-2 rounded-full hover:bg-slate-100"><X /></button>
            </div>
            <div className="p-2 bg-slate-50">
              <img src={selectedProofOrder.screenshotUrl} className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-lg" alt="Proof" />
            </div>
            <div className="p-6 flex items-center justify-between bg-white border-t border-slate-100">
               <div>
                 <p className="text-[10px] text-slate-400 font-black uppercase">Trx ID</p>
                 <p className="text-sm font-mono font-black text-amber-700">{selectedProofOrder.trxId || 'N/A'}</p>
               </div>
               <button onClick={() => setSelectedProofOrder(null)} className="px-6 py-2 rounded-xl bg-slate-900 text-white font-black text-xs uppercase">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Dialog */}
      {deliveringOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in-95">
             <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Order Delivery</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Send account credentials directly to customer's WhatsApp.</p>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Login Credentials / Keys:</label>
                   <textarea
                     rows={5}
                     placeholder="e.g. Email: john@example.com, Pass: secret123..."
                     value={deliveryNote}
                     onChange={(e) => setDeliveryNote(e.target.value)}
                     className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold focus:bg-white focus:border-emerald-500 outline-none resize-none leading-relaxed"
                   />
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                   <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                     Clicking "Send & Mark Delivered" will open WhatsApp and automatically update the order status to <b>Delivered</b>.
                   </p>
                </div>

                <div className="flex gap-4 pt-2">
                   <button onClick={() => setDeliveringOrder(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase">Cancel</button>
                   <button
                     onClick={() => handleOpenDeliveryWhatsapp(deliveringOrder, deliveryNote)}
                     className="flex-[2] py-4 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                   >
                     <MessageCircle className="w-5 h-5" />
                     <span>Send & Mark Delivered</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};
