import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Check, 
  Tag, 
  X, 
  MessageCircle, 
  ArrowUpDown, 
  CheckCircle, 
  Clock, 
  Layers, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { formatPKR } from '../utils/priceCalculator';

export const ProductsTab: React.FC = () => {
  const { products, categories, addToCartProduct, shopSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Filter & sort
  let filtered = products.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.categoryId === selectedCategory;
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.urduName && prod.urduName.includes(searchQuery)) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.stock - a.stock; // popular
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCartProduct(product, 1);
    setAddedToast(`Added 1x ${product.name} to cart!`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const handleModalAdd = () => {
    if (inspectingProduct) {
      addToCartProduct(inspectingProduct, modalQuantity);
      setAddedToast(`Added ${modalQuantity}x ${inspectingProduct.name} to cart!`);
      setTimeout(() => setAddedToast(null), 2500);
      setInspectingProduct(null);
      setModalQuantity(1);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return { label: 'Out of Stock', color: 'bg-red-50 text-[#DC2626] border-red-200' };
    }
    if (stock <= 6) {
      return { label: `Low Stock (${stock})`, color: 'bg-amber-50 text-[#F59E0B] border-amber-200' };
    }
    return { label: 'In Stock', color: 'bg-emerald-50 text-[#16A34A] border-emerald-200' };
  };

  return (
    <div className="space-y-4 pb-24 font-body">
      {/* Toast */}
      {addedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#122748] text-white px-4 py-2 rounded-[14px] text-xs font-heading font-bold shadow-float flex items-center space-x-2 border border-[#264E8C] animate-bounce">
          <Check className="w-4 h-4 text-[#16A34A]" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#1B3A6B] text-white rounded-[20px] p-5 shadow-card">
        <span className="text-[#FF7A00] text-[10px] font-heading font-black uppercase tracking-wider">
          Store Supplies &amp; Hardware
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-black mt-0.5">
          Products &amp; Printing Supplies
        </h1>
        <p className="text-xs text-slate-200 mt-1 urdu-font">
          ٹونر، انک، اے فور پیپرز، اسٹیکرز اور کمپیوٹر کی معیاری مصنوعات
        </p>
      </div>

      {/* Sticky Search & Sort Controls */}
      <div className="space-y-2 sticky top-[68px] z-30 bg-[#F6F7FB]/95 backdrop-blur-md pt-1 pb-2">
        <div className="relative">
          <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand (HP, Canon, Epson), or tag..."
            className="w-full pl-12 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-[30px] text-xs sm:text-sm text-[#111827] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B] shadow-soft"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-xs text-[#6B7280] font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter chips & Sort row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1B3A6B] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-slate-100'
              }`}
            >
              All Items ({products.length})
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-[12px] text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1B3A6B] text-white shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="shrink-0 flex items-center bg-white border border-[#E5E7EB] rounded-[12px] px-2 py-1 text-xs text-[#111827]">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-[#6B7280]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium focus:outline-none text-xs text-[#111827]"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid: 2 Columns on Mobile, 3-4 on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(product => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div
              key={product.id}
              onClick={() => { setInspectingProduct(product); setModalQuantity(1); }}
              className="bg-white border border-[#E5E7EB] rounded-[18px] p-3 flex flex-col justify-between shadow-soft hover:shadow-card transition-all cursor-pointer group"
            >
              <div>
                {/* 16px Rounded Image */}
                <div className="relative aspect-square rounded-[16px] overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPrice && (
                    <span className="absolute top-2 left-2 bg-[#DC2626] text-white text-[10px] font-heading font-black px-1.5 py-0.5 rounded-[6px] shadow-xs">
                      SALE
                    </span>
                  )}
                  <span className={`absolute bottom-2 right-2 border px-2 py-0.5 rounded-[6px] text-[10px] font-heading font-bold backdrop-blur-xs ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block truncate">
                  {product.brand}
                </span>
                <h3 className="font-heading text-xs sm:text-sm font-bold text-[#111827] line-clamp-2 leading-tight group-hover:text-[#1B3A6B] transition-colors mt-0.5">
                  {product.name}
                </h3>
                {product.urduName && (
                  <p className="text-[11px] text-[#1B3A6B] urdu-font truncate mt-0.5">
                    {product.urduName}
                  </p>
                )}
              </div>

              {/* Price & Add to Cart button */}
              <div className="mt-3 pt-2 border-t border-[#F3F4F6]">
                <div className="flex items-baseline space-x-1.5 mb-2">
                  <span className="font-heading text-sm sm:text-base font-extrabold text-[#1B3A6B]">
                    {formatPKR(product.discountPrice || product.price)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-[10px] text-[#6B7280] line-through">
                      {formatPKR(product.price)}
                    </span>
                  )}
                  <span className="text-[10px] text-[#6B7280]">/{product.unit}</span>
                </div>

                <button
                  onClick={(e) => handleQuickAdd(product, e)}
                  disabled={product.stock <= 0}
                  className="w-full bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-heading font-bold py-2 rounded-[14px] text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[20px] border border-[#E5E7EB] p-6 shadow-soft">
          <p className="font-heading text-sm font-bold text-[#111827]">No products found</p>
          <p className="text-xs text-[#6B7280] mt-1">Try searching for "Toner", "Paper", "Canon", or "Ink".</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3 text-xs text-[#1B3A6B] font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* IMMERSIVE PRODUCT DETAILS MODAL */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-float border border-[#E5E7EB] overflow-hidden my-auto flex flex-col max-h-[92vh]">
            {/* Header Image */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              <img
                src={inspectingProduct.images[0]}
                alt={inspectingProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setInspectingProduct(null)}
                className="absolute top-3 right-3 bg-[#111827]/70 text-white p-2 rounded-full hover:bg-[#111827] transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
              {inspectingProduct.discountPrice && (
                <span className="absolute top-3 left-3 bg-[#DC2626] text-white text-xs font-heading font-black px-2.5 py-0.5 rounded-[8px]">
                  SPECIAL DISCOUNT
                </span>
              )}
            </div>

            {/* Details Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-[#1B3A6B] uppercase tracking-wider">
                  {inspectingProduct.brand} • {inspectingProduct.unit}
                </span>
                <h2 className="font-heading text-lg font-bold text-[#111827] leading-tight mt-0.5">
                  {inspectingProduct.name}
                </h2>
                {inspectingProduct.urduName && (
                  <p className="text-xs text-[#1B3A6B] urdu-font mt-1">
                    {inspectingProduct.urduName}
                  </p>
                )}
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-heading text-2xl font-black text-[#1B3A6B]">
                  {formatPKR(inspectingProduct.discountPrice || inspectingProduct.price)}
                </span>
                {inspectingProduct.discountPrice && (
                  <span className="text-sm text-[#6B7280] line-through">
                    {formatPKR(inspectingProduct.price)}
                  </span>
                )}
                <span className="text-xs text-[#6B7280]">
                  per {inspectingProduct.unit}
                </span>
              </div>

              <p className="text-xs text-[#6B7280] leading-relaxed">
                {inspectingProduct.description}
              </p>

              {/* Specifications Box */}
              <div className="bg-[#F6F7FB] border border-[#E5E7EB] rounded-[16px] p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Availability:</span>
                  <span className="font-bold text-[#16A34A]">In Stock ({inspectingProduct.stock} units)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Packaging:</span>
                  <span className="font-bold text-[#111827]">{inspectingProduct.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Delivery:</span>
                  <span className="font-bold text-[#111827]">Shop Pickup or Home Delivery (Umarzai)</span>
                </div>
              </div>

              {/* WhatsApp Inquiry Link */}
              <a
                href={`https://wa.me/92${shopSettings.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum, I am inquiring about product: ${inspectingProduct.name} (${formatPKR(inspectingProduct.discountPrice || inspectingProduct.price)})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded-[12px] bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-heading text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Ask Mukhtar Ahmed on WhatsApp</span>
              </a>

              {/* Quantity Picker & Add to Cart */}
              <div className="flex items-center space-x-3 pt-2 border-t border-[#F3F4F6]">
                <div className="flex items-center border border-[#E5E7EB] rounded-[14px] overflow-hidden bg-slate-50 min-h-[48px]">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="px-3.5 py-2 text-[#111827] font-bold hover:bg-slate-200"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 font-bold text-sm text-[#111827] min-w-8 text-center font-mono">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity(modalQuantity + 1)}
                    className="px-3.5 py-2 text-[#111827] font-bold hover:bg-slate-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleModalAdd}
                  className="flex-1 bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-heading font-bold py-3 px-4 rounded-[14px] text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95 min-h-[48px]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {modalQuantity} to Cart ({formatPKR((inspectingProduct.discountPrice || inspectingProduct.price) * modalQuantity)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
