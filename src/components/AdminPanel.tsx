import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Wrench, 
  Clock, 
  Users, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Save, 
  FileText, 
  Eye, 
  Filter, 
  Phone, 
  MessageCircle, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  FileCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus, Product, Service } from '../types';
import { formatPKR } from '../utils/priceCalculator';

export const AdminPanel: React.FC = () => {
  const { 
    orders, 
    products, 
    services, 
    shopSettings, 
    updateOrderStatus, 
    updateAdminNotes, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    updateService, 
    updateShopSettings,
    switchUserRole 
  } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'orders' | 'products' | 'services' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrderForNotes, setSelectedOrderForNotes] = useState<Order | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Product Editor Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('Generic');
  const [newProductCategory, setNewProductCategory] = useState('toner-ink');
  const [newProductPrice, setNewProductPrice] = useState<number>(1000);
  const [newProductDiscount, setNewProductDiscount] = useState<number>(0);
  const [newProductStock, setNewProductStock] = useState<number>(10);
  const [newProductUnit, setNewProductUnit] = useState('piece');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Service Rate Quick Edit
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newServicePrice, setNewServicePrice] = useState<number>(0);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(shopSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Exact metrics required by specification:
  // Today's orders, Pending orders, Printing orders, Completed orders, Total revenue, Low-stock products
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const printingOrders = orders.filter(o => o.status === 'Printing' || o.status === 'Designing').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSaveNotes = () => {
    if (selectedOrderForNotes) {
      updateAdminNotes(selectedOrderForNotes.id, tempNotes);
      setSelectedOrderForNotes(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProductName,
      brand: newProductBrand,
      categoryId: newProductCategory,
      price: newProductPrice,
      discountPrice: newProductDiscount > 0 ? newProductDiscount : undefined,
      stock: newProductStock,
      unit: newProductUnit,
      description: newProductDesc,
      images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80'],
      tags: [newProductBrand.toLowerCase(), newProductCategory],
      isAvailable: true,
    });
    setIsAddingProduct(false);
    setNewProductName('');
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        price: editingProduct.price,
        discountPrice: editingProduct.discountPrice,
        stock: editingProduct.stock,
        isAvailable: editingProduct.stock > 0,
      });
      setEditingProduct(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="space-y-5 pb-24 font-body">
      {/* Admin Top Header Banner */}
      <div className="bg-[#1B3A6B] text-white p-5 rounded-[20px] shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-heading font-black uppercase tracking-wider bg-[#FF7A00] text-[#111827] px-2.5 py-0.5 rounded-full">
              Shop Owner Mode
            </span>
            <span className="text-xs text-amber-200">Main Bazar Umarzai</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-black mt-1">
            Mukhtar Ahmed Admin Hub
          </h1>
          <p className="text-xs text-slate-200">
            Real-time orders queue, live rate editor, and store management
          </p>
        </div>

        <button
          onClick={() => switchUserRole('customer')}
          className="self-start sm:self-auto bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-xs px-4 py-2.5 rounded-[12px] border border-white/20 transition-colors"
        >
          Exit to Customer App
        </button>
      </div>

      {/* DASHBOARD STATS: 6 Cards as specified */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 shadow-soft">
          <span className="text-[11px] text-[#6B7280] block">Total Revenue</span>
          <span className="font-heading text-sm sm:text-base font-black text-[#1B3A6B] font-mono">
            {formatPKR(totalRevenue)}
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 shadow-soft">
          <span className="text-[11px] text-[#6B7280] block">Total Orders</span>
          <span className="font-heading text-base font-black text-[#111827]">
            {orders.length}
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 shadow-soft">
          <span className="text-[11px] text-[#F59E0B] font-semibold block">Pending Orders</span>
          <span className="font-heading text-base font-black text-[#F59E0B]">
            {pendingOrders}
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 shadow-soft">
          <span className="text-[11px] text-purple-700 font-semibold block">Printing / Design</span>
          <span className="font-heading text-base font-black text-purple-700">
            {printingOrders}
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 shadow-soft">
          <span className="text-[11px] text-[#16A34A] font-semibold block">Completed</span>
          <span className="font-heading text-base font-black text-[#16A34A]">
            {completedOrders}
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 shadow-soft">
          <span className="text-[11px] text-[#DC2626] font-semibold block">Low Stock Alerts</span>
          <span className="font-heading text-base font-black text-[#DC2626]">
            {lowStockProducts.length} items
          </span>
        </div>
      </div>

      {/* ADMIN SUB-TABS NAVIGATION */}
      <div className="flex border-b border-[#E5E7EB] space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveAdminSubTab('orders')}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-heading font-bold rounded-[12px] whitespace-nowrap transition-all ${
            activeAdminSubTab === 'orders'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'bg-white text-[#6B7280] hover:bg-slate-100 border border-[#E5E7EB]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Orders Queue ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('products')}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-heading font-bold rounded-[12px] whitespace-nowrap transition-all ${
            activeAdminSubTab === 'products'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'bg-white text-[#6B7280] hover:bg-slate-100 border border-[#E5E7EB]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products &amp; Stock</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('services')}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-heading font-bold rounded-[12px] whitespace-nowrap transition-all ${
            activeAdminSubTab === 'services'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'bg-white text-[#6B7280] hover:bg-slate-100 border border-[#E5E7EB]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Services &amp; Rates</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('settings')}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-heading font-bold rounded-[12px] whitespace-nowrap transition-all ${
            activeAdminSubTab === 'settings'
              ? 'bg-[#1B3A6B] text-white shadow-xs'
              : 'bg-white text-[#6B7280] hover:bg-slate-100 border border-[#E5E7EB]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Shop &amp; Accounts</span>
        </button>
      </div>

      {/* 1. ORDERS QUEUE */}
      {activeAdminSubTab === 'orders' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-[#111827]">
              Customer Orders Queue
            </h3>

            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="text-xs px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-[10px] font-medium"
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Designing">Designing</option>
              <option value="Printing">Printing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-soft space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3F4F6] pb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-black text-[#1B3A6B]">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-heading font-bold bg-blue-50 text-[#1B3A6B] px-2 py-0.5 rounded-[6px]">
                        {order.deliveryMethod}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#111827] mt-0.5">
                      {order.customerName} • <span className="font-mono">{order.phone}</span>
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-[11px] text-[#6B7280] truncate">
                        Address: {order.deliveryAddress}
                      </p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-[#6B7280]">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs font-heading font-bold px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-[10px] text-[#1B3A6B] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Designing">Designing</option>
                      <option value="Printing">Printing</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[#111827]">
                      <span>• {it.name} x {it.quantity}</span>
                      <span className="font-bold text-[#1B3A6B] font-mono">{formatPKR(it.calculatedPrice)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-heading font-bold pt-1 text-[#111827] border-t border-[#F3F4F6]">
                    <span>Total ({order.paymentMethod}):</span>
                    <span className="text-[#1B3A6B] font-black font-mono">{formatPKR(order.totalAmount)}</span>
                  </div>
                </div>

                {/* Customer Uploads with Download button */}
                {order.uploadedFiles && order.uploadedFiles.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-[14px] p-2.5 space-y-1 text-xs">
                    <span className="font-heading font-bold text-emerald-950 flex items-center space-x-1">
                      <FileCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Customer Artwork Uploads ({order.uploadedFiles.length})</span>
                    </span>
                    {order.uploadedFiles.map(f => (
                      <div key={f.id} className="flex items-center justify-between text-[11px] text-emerald-900">
                        <span className="font-mono truncate">{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert(`Simulated Download of customer file: ${f.name}`); }}
                          className="font-bold underline text-emerald-950 hover:text-emerald-800 ml-2"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin notes & direct customer actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F3F4F6]">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => { setSelectedOrderForNotes(order); setTempNotes(order.adminNotes || ''); }}
                      className="text-xs text-[#1B3A6B] hover:underline font-semibold flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{order.adminNotes ? 'Edit Shop Note' : '+ Add Shop Note'}</span>
                    </button>
                    {order.adminNotes && (
                      <span className="text-[11px] text-[#6B7280] italic max-w-xs truncate">
                        "{order.adminNotes}"
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${order.phone}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#111827] rounded-[10px] text-xs font-heading font-semibold flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3 text-[#16A34A]" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/92${order.phone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-950 rounded-[10px] text-xs font-heading font-bold flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PRODUCTS & STOCK */}
      {activeAdminSubTab === 'products' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-[#111827]">
              Product Inventory &amp; Prices
            </h3>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="bg-[#1B3A6B] hover:bg-[#264E8C] text-white font-heading font-bold text-xs px-3 py-1.5 rounded-[12px] flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F7FB] text-[#6B7280] font-heading font-bold border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price (PKR)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-heading font-bold text-[#111827]">{prod.name}</div>
                      <div className="text-[10px] text-[#6B7280] uppercase">{prod.brand} • {prod.unit}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#1B3A6B]">
                      {formatPKR(prod.discountPrice || prod.price)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.stock > 5 ? 'bg-emerald-50 text-[#16A34A]' : 'bg-red-50 text-[#DC2626]'
                      }`}>
                        {prod.stock} {prod.unit}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="p-1.5 text-[#1B3A6B] hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-[#DC2626] hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SERVICES & RATES */}
      {activeAdminSubTab === 'services' && (
        <div className="space-y-3.5">
          <h3 className="font-heading text-sm font-bold text-[#111827]">
            Base Service Rates in App
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map(srv => (
              <div
                key={srv.id}
                className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 flex items-center justify-between shadow-soft"
              >
                <div>
                  <h4 className="font-heading text-xs font-bold text-[#111827]">{srv.name}</h4>
                  <p className="text-[10px] text-[#6B7280] uppercase">{srv.priceUnit.replace(/_/g, ' ')}</p>
                  <p className="text-xs font-bold text-[#1B3A6B] mt-1 font-mono">
                    Current Rate: {formatPKR(srv.basePrice)}
                  </p>
                </div>

                <button
                  onClick={() => { setEditingService(srv); setNewServicePrice(srv.basePrice); }}
                  className="bg-blue-50 hover:bg-blue-100 text-[#1B3A6B] font-heading font-bold px-3 py-1.5 rounded-[10px] text-xs border border-blue-200"
                >
                  Edit Rate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SHOP SETTINGS */}
      {activeAdminSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
            <div>
              <h3 className="font-heading text-sm font-bold text-[#111827]">Shop &amp; Accounts Info</h3>
              <p className="text-xs text-[#6B7280]">Configured for Main Bazar Umarzai</p>
            </div>
            {settingsSaved && (
              <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-[10px] flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Shop Name</label>
              <input
                type="text"
                value={settingsForm.shopName}
                onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[10px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">Owner Name</label>
              <input
                type="text"
                value={settingsForm.ownerName}
                onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[10px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[10px] font-mono focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                value={settingsForm.deliveryCharge}
                onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharge: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[10px] font-mono focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#111827] mb-1">Address</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-[10px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#1B3A6B] hover:bg-[#264E8C] text-white font-heading font-bold py-2.5 px-6 rounded-[12px] text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* QUICK NOTE MODAL */}
      {selectedOrderForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[20px] p-5 max-w-sm w-full space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#111827]">
              Add Shop Note: #{selectedOrderForNotes.orderNumber}
            </h3>
            <textarea
              rows={3}
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="e.g. Sent for urgent lamination..."
              className="w-full p-2.5 text-xs border border-[#E5E7EB] rounded-[12px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedOrderForNotes(null)}
                className="px-3 py-1.5 text-xs text-[#6B7280] hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 text-xs font-bold bg-[#1B3A6B] text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleUpdateProductSubmit} className="bg-white rounded-[20px] p-5 max-w-sm w-full space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#111827]">
              Edit: {editingProduct.name}
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#6B7280] mb-1">Standard Price (PKR)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-[#E5E7EB] rounded-[10px] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] mb-1">Stock ({editingProduct.unit})</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-[#E5E7EB] rounded-[10px] font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-3 py-1.5 text-xs text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-[#1B3A6B] text-white rounded-[10px]"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK SERVICE EDIT MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[20px] p-5 max-w-sm w-full space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#111827]">
              Edit Base Rate: {editingService.name}
            </h3>
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">Rate in PKR / {editingService.priceUnit.replace(/_/g, ' ')}</label>
              <input
                type="number"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-xs border border-[#E5E7EB] rounded-[10px] font-mono"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingService(null)}
                className="px-3 py-1.5 text-xs text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateService(editingService.id, { basePrice: newServicePrice });
                  setEditingService(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-[#1B3A6B] text-white rounded-[10px]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleSaveNewProduct} className="bg-white rounded-[20px] p-5 max-w-md w-full space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#111827]">Add New Product</h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#6B7280] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. HP 85A Toner Cartridge"
                  className="w-full p-2 border border-[#E5E7EB] rounded-[10px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#6B7280] mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-[#E5E7EB] rounded-[10px] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#6B7280] mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-[#E5E7EB] rounded-[10px] font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="px-3 py-1.5 text-xs text-[#6B7280]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-[#1B3A6B] text-white rounded-[10px]"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
