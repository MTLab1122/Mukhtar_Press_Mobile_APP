import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Search, 
  Copy, 
  Maximize, 
  CreditCard, 
  Heart, 
  Stamp, 
  Image as ImageIcon, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Zap,
  Percent,
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Service, Product } from '../types';
import { formatPKR } from '../utils/priceCalculator';
import { ServiceConfigModal } from './ServiceConfigModal';

export const HomeTab: React.FC = () => {
  const { 
    shopSettings, 
    categories, 
    products, 
    services, 
    offers, 
    addToCartProduct, 
    setActiveTab, 
    setSelectedProductId 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [configuringService, setConfiguringService] = useState<Service | null>(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Auto-slide carousel for hero offer banner
  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex(prev => (prev + 1) % offers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [offers.length]);

  // Quick Action 6 Presets
  const quickActions = [
    {
      id: 'srv-12',
      name: 'Photocopy',
      urdu: 'فوٹو کاپی',
      price: 'Rs. 5/page',
      icon: Copy,
      bg: 'bg-blue-50 hover:bg-blue-100',
      iconBg: 'bg-[#1B3A6B]',
      iconColor: 'text-white',
      border: 'border-blue-100',
    },
    {
      id: 'srv-03',
      name: 'Flex Printing',
      urdu: 'فلیکس پرنٹنگ',
      price: 'Rs. 35/sq ft',
      icon: Maximize,
      bg: 'bg-amber-50 hover:bg-amber-100',
      iconBg: 'bg-[#FF7A00]',
      iconColor: 'text-white',
      border: 'border-amber-200',
    },
    {
      id: 'srv-06',
      name: 'Business Cards',
      urdu: 'بزنس کارڈ',
      price: 'From Rs. 500',
      icon: CreditCard,
      bg: 'bg-teal-50 hover:bg-teal-100',
      iconBg: 'bg-[#00897B]',
      iconColor: 'text-white',
      border: 'border-teal-100',
    },
    {
      id: 'srv-08',
      name: 'Wedding Cards',
      urdu: 'شادی کارڈ',
      price: 'From Rs. 25',
      icon: Heart,
      bg: 'bg-rose-50 hover:bg-rose-100',
      iconBg: 'bg-rose-600',
      iconColor: 'text-white',
      border: 'border-rose-100',
    },
    {
      id: 'srv-17',
      name: 'Stamp Making',
      urdu: 'مہر سازی',
      price: 'From Rs. 800',
      icon: Stamp,
      bg: 'bg-indigo-50 hover:bg-indigo-100',
      iconBg: 'bg-indigo-700',
      iconColor: 'text-white',
      border: 'border-indigo-100',
    },
    {
      id: 'srv-05',
      name: 'Poster Printing',
      urdu: 'پوسٹر پرنٹنگ',
      price: 'From Rs. 50',
      icon: ImageIcon,
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      iconBg: 'bg-[#16A34A]',
      iconColor: 'text-white',
      border: 'border-emerald-100',
    },
  ];

  const handleQuickActionClick = (serviceId: string) => {
    const srv = services.find(s => s.id === serviceId);
    if (srv) {
      setConfiguringService(srv);
    }
  };

  // Filtered lists if search query is active
  const filteredProducts = searchQuery.trim() === '' ? [] : products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.urduName && p.urduName.includes(searchQuery)) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredServices = searchQuery.trim() === '' ? [] : services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.urduName && s.urduName.includes(searchQuery)) ||
    s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 font-body">
      {/* 2. SMART SEARCH BAR (Pill radius 30px) */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search toner, ink, flex, business cards..."
          className="w-full pl-12 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-[30px] text-sm text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent shadow-card"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3.5 text-xs text-[#6B7280] hover:text-[#111827] font-semibold"
            aria-label="Clear Search"
          >
            Clear
          </button>
        )}
      </div>

      {/* SEARCH RESULTS OVERLAY (IF TYPING) */}
      {searchQuery.trim() !== '' && (
        <div className="space-y-4 bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-card">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
            <h3 className="font-heading text-sm font-bold text-[#111827]">
              Results for "{searchQuery}"
            </h3>
            <span className="text-xs text-[#6B7280]">
              {filteredProducts.length + filteredServices.length} found
            </span>
          </div>

          {/* Services found */}
          {filteredServices.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#1B3A6B] uppercase tracking-wider">
                Services ({filteredServices.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredServices.map(srv => (
                  <div 
                    key={srv.id}
                    onClick={() => setConfiguringService(srv)}
                    className="p-3 border border-[#E5E7EB] hover:border-[#1B3A6B] rounded-[14px] bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#111827]">{srv.name}</p>
                      <p className="text-[11px] text-[#1B3A6B] font-semibold">{formatPKR(srv.basePrice)} / {srv.priceUnit.replace(/_/g, ' ')}</p>
                    </div>
                    <span className="text-xs text-[#1B3A6B] font-bold bg-white px-2.5 py-1 rounded-[8px] border border-[#E5E7EB]">
                      Configure
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products found */}
          {filteredProducts.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Products ({filteredProducts.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredProducts.map(prod => (
                  <div 
                    key={prod.id}
                    className="p-3 border border-[#E5E7EB] rounded-[14px] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#111827]">{prod.name}</p>
                      <p className="text-xs font-bold text-[#1B3A6B]">{formatPKR(prod.discountPrice || prod.price)}</p>
                    </div>
                    <button
                      onClick={() => addToCartProduct(prod, 1)}
                      className="text-xs bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-bold px-3 py-1.5 rounded-[10px] transition-transform active:scale-95 shadow-xs"
                    >
                      + Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length === 0 && filteredServices.length === 0 && (
            <p className="text-xs text-[#6B7280] text-center py-4">
              No products or services found matching "{searchQuery}".
            </p>
          )}
        </div>
      )}

      {/* 3. QUICK ACTION GRID: 6 Large, Colorful, Icon-Based Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-[#111827] tracking-tight flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-[#FF7A00]" />
            <span>Quick Order Services</span>
          </h2>
          <span className="text-xs font-semibold text-[#1B3A6B]">
            Tap to customize
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action.id)}
                className={`bg-white hover:bg-slate-50 border ${action.border} rounded-[18px] p-3 flex flex-col items-center text-center shadow-soft transition-all hover:scale-[1.02] active:scale-95 group min-h-[105px] justify-center`}
              >
                <div className={`w-11 h-11 rounded-[14px] ${action.iconBg} ${action.iconColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-heading text-xs font-bold text-[#111827] leading-tight">
                  {action.name}
                </span>
                <span className="text-[10px] text-[#6B7280] urdu-font mt-0.5 truncate w-full">
                  {action.urdu}
                </span>
                <span className="text-[10px] font-bold text-[#1B3A6B] mt-1">
                  {action.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. HERO OFFER BANNER CAROUSEL */}
      {offers.length > 0 && (
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#1B3A6B] via-[#264E8C] to-[#1B3A6B] text-white p-5 shadow-card border border-[#264E8C]">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5 max-w-[78%]">
              <span className="bg-[#FF7A00] text-[#111827] text-[10px] font-heading font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1">
                <Percent className="w-3 h-3 text-[#111827]" />
                <span>Special Promotion</span>
              </span>
              <h3 className="font-heading text-base sm:text-lg font-bold leading-tight">
                {offers[currentOfferIndex].title}
              </h3>
              <p className="text-xs text-slate-200 line-clamp-2">
                {offers[currentOfferIndex].description}
              </p>

              <button
                onClick={() => setActiveTab('services')}
                className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-[#1B3A6B] text-xs font-bold px-3.5 py-1.5 rounded-[12px] shadow-sm transition-transform active:scale-95 mt-1"
              >
                <span>Avail Offer Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[16px] p-3 text-center border border-white/20 shrink-0">
              <span className="block text-2xl font-heading font-black text-[#FF7A00] leading-none">
                {offers[currentOfferIndex].discountPercentage}%
              </span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">OFF</span>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-1.5 mt-4 relative z-10">
            {offers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentOfferIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentOfferIndex ? 'w-6 bg-[#FF7A00]' : 'w-1.5 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Decorative glowing gradient backdrop */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#FF7A00]/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      )}

      {/* 5. CATEGORIES: Product Categories & Service Categories Separated */}
      <div className="space-y-4">
        {/* Service Categories */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-[#111827]">
              Printing &amp; Designing Categories
            </h2>
            <button
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-[#1B3A6B] hover:text-[#FF7A00] flex items-center"
            >
              <span>View All 25</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'services-print', label: 'Flex & Large Print', urdu: 'فلیکس پرنٹنگ', icon: Maximize },
              { id: 'services-design', label: 'Graphic Design', urdu: 'گرافک ڈیزائن', icon: Sparkles },
              { id: 'services-typing', label: 'Urdu & InPage Typing', urdu: 'اردو کمپوزنگ', icon: Copy },
              { id: 'services-stamp', label: 'Stamp & Seals', urdu: 'مہر سازی', icon: Stamp },
              { id: 'services-finish', label: 'Thesis & Binding', urdu: 'تھیسس بائنڈنگ', icon: CreditCard },
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab('services')}
                  className="bg-white hover:bg-slate-50 border border-[#E5E7EB] rounded-[16px] p-2.5 text-center min-w-[125px] shrink-0 shadow-soft transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Icon className="w-4 h-4 text-[#1B3A6B] mx-auto mb-1" />
                  <span className="font-heading text-xs font-bold text-[#111827] block truncate">{cat.label}</span>
                  <span className="text-[10px] text-[#6B7280] urdu-font">{cat.urdu}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-[#111827]">
              Shop Supplies Categories
            </h2>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-[#1B3A6B] hover:text-[#FF7A00] flex items-center"
            >
              <span>Browse Shop</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setActiveTab('products')}
                className="bg-white border border-[#E5E7EB] hover:border-[#1B3A6B] rounded-[16px] p-2 text-center cursor-pointer min-w-[110px] shrink-0 shadow-soft transition-transform hover:scale-[1.02]"
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 rounded-[12px] object-cover mx-auto mb-1.5"
                  />
                )}
                <h3 className="font-heading text-xs font-bold text-[#111827] truncate">{cat.name}</h3>
                <p className="text-[10px] text-[#6B7280] urdu-font truncate">{cat.urduName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. POPULAR SERVICES: Horizontal Scroll Cards with Starting Price & Order Now */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-[#111827]">
              Popular Services
            </h2>
            <p className="text-xs text-[#6B7280]">Real-time price calculation with custom file uploads</p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs font-bold text-[#1B3A6B] hover:underline"
          >
            All Services →
          </button>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {services.slice(0, 6).map(srv => (
            <div
              key={srv.id}
              className="bg-white border border-[#E5E7EB] rounded-[18px] p-3.5 shadow-soft w-[250px] shrink-0 flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div>
                <div className="relative aspect-video rounded-[14px] overflow-hidden bg-slate-100 mb-2.5">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#122748]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-[6px] backdrop-blur-xs uppercase">
                    {srv.priceUnit.replace(/_/g, ' ')}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-white/90 text-[#111827] text-[10px] font-bold px-2 py-0.5 rounded-[6px] backdrop-blur-xs">
                    {srv.estimatedTime}
                  </span>
                </div>

                <h3 className="font-heading text-sm font-bold text-[#111827] truncate">
                  {srv.name}
                </h3>
                <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">
                  {srv.shortDescription}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7280] block">Starting at</span>
                  <span className="font-heading text-xs font-extrabold text-[#1B3A6B]">
                    {formatPKR(srv.basePrice)}
                  </span>
                </div>

                <button
                  onClick={() => setConfiguringService(srv)}
                  className="bg-[#1B3A6B] hover:bg-[#264E8C] text-white text-xs font-bold px-3 py-1.5 rounded-[12px] shadow-xs active:scale-95 transition-transform"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. FEATURED PRODUCTS: Horizontal Product Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-[#111827]">
              Featured Hardware &amp; Inks
            </h2>
            <p className="text-xs text-[#6B7280]">Laser toners, photo paper &amp; printing supplies</p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-[#1B3A6B] hover:underline"
          >
            Shop All →
          </button>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {products.slice(0, 5).map(prod => (
            <div
              key={prod.id}
              className="bg-white border border-[#E5E7EB] rounded-[18px] p-3 shadow-soft w-[185px] shrink-0 flex flex-col justify-between hover:shadow-card transition-all group"
            >
              <div>
                <div className="relative aspect-square rounded-[14px] overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.discountPrice && (
                    <span className="absolute top-1.5 left-1.5 bg-[#DC2626] text-white text-[10px] font-black px-1.5 py-0.5 rounded-[6px]">
                      SALE
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-[6px]">
                    {prod.stock} in stock
                  </span>
                </div>

                <span className="text-[10px] text-[#6B7280] font-semibold uppercase block truncate">
                  {prod.brand}
                </span>
                <h3 className="font-heading text-xs font-bold text-[#111827] line-clamp-2 leading-tight">
                  {prod.name}
                </h3>
              </div>

              <div className="mt-2 pt-2 border-t border-[#F3F4F6]">
                <div className="flex items-baseline space-x-1">
                  <span className="font-heading text-xs font-black text-[#1B3A6B]">
                    {formatPKR(prod.discountPrice || prod.price)}
                  </span>
                  {prod.discountPrice && (
                    <span className="text-[10px] text-[#6B7280] line-through">
                      {formatPKR(prod.price)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCartProduct(prod, 1)}
                  className="w-full mt-2 bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-bold py-1.5 rounded-[12px] text-xs flex items-center justify-center space-x-1 shadow-xs active:scale-95 transition-transform"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. NEW ARRIVALS: 2 Columns */}
      <div className="space-y-3">
        <h2 className="font-heading text-base font-bold text-[#111827]">
          New In Store
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(4, 8).map(prod => (
            <div
              key={prod.id}
              className="bg-white border border-[#E5E7EB] rounded-[18px] p-3 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-[14px] overflow-hidden bg-slate-100 mb-2">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                    {prod.stock} in stock
                  </span>
                </div>
                <h4 className="font-heading text-xs font-bold text-[#111827] line-clamp-1">{prod.name}</h4>
                <p className="text-[10px] text-[#6B7280] truncate">{prod.unit}</p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F3F4F6]">
                <span className="font-heading text-xs font-extrabold text-[#1B3A6B]">
                  {formatPKR(prod.discountPrice || prod.price)}
                </span>
                <button
                  onClick={() => addToCartProduct(prod, 1)}
                  className="bg-[#1B3A6B] text-white p-1.5 rounded-[10px] hover:bg-[#264E8C] transition-colors"
                  aria-label={`Add ${prod.name} to Cart`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. WHY CHOOSE US (5 Trust Pillars) */}
      <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3.5">
        <h3 className="font-heading text-sm font-bold text-[#111827]">
          Why Choose Mukhtar Ahmed Store?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#111827] font-semibold">Fast Printing</strong>
              <span className="text-[#6B7280] text-[11px]">Same-day turnaround for banners &amp; flex</span>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#111827] font-semibold">Affordable Prices</strong>
              <span className="text-[#6B7280] text-[11px]">Market-leading rates in PKR</span>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#111827] font-semibold">Quality Design</strong>
              <span className="text-[#6B7280] text-[11px]">Experienced Urdu &amp; English typists</span>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#111827] font-semibold">WhatsApp Support</strong>
              <span className="text-[#6B7280] text-[11px]">Direct updates &amp; artwork proofs</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 col-span-2 sm:col-span-1">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#111827] font-semibold">Umarzai Location</strong>
              <span className="text-[#6B7280] text-[11px]">In the heart of Main Bazar</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10. CONTACT SECTION */}
      <div className="bg-[#122748] text-white rounded-[20px] p-5 shadow-card space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[#FF7A00] text-[10px] font-heading font-black uppercase tracking-wider block">
              Direct Contact &amp; Location
            </span>
            <h4 className="font-heading text-base font-bold text-white mt-0.5">
              Mukhtar Ahmed Printing Store
            </h4>
            <p className="text-xs text-slate-300">
              {shopSettings.address}
            </p>
            <p className="text-[11px] text-amber-300 font-mono mt-1">
              {shopSettings.timings}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1B3A6B] border border-[#264E8C] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#FF7A00]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href={`tel:${shopSettings.phone}`}
            className="flex items-center justify-center space-x-2 bg-[#16A34A] hover:bg-[#15803d] text-white py-2.5 px-3 rounded-[14px] font-heading text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call: {shopSettings.phone}</span>
          </a>

          <a
            href={`https://wa.me/92${shopSettings.whatsapp.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-[14px] font-heading text-xs font-bold shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Order</span>
          </a>
        </div>
      </div>

      {/* Configurator Modal */}
      {configuringService && (
        <ServiceConfigModal
          service={configuringService}
          onClose={() => setConfiguringService(null)}
        />
      )}
    </div>
  );
};
