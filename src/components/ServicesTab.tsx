import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  UploadCloud, 
  Sparkles, 
  Wrench, 
  Layers, 
  Palette, 
  Printer, 
  FileText, 
  Stamp,
  BookOpen,
  ArrowRight,
  Maximize,
  Copy,
  Scan,
  CreditCard,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { formatPKR } from '../utils/priceCalculator';
import { ServiceConfigModal } from './ServiceConfigModal';

export const ServicesTab: React.FC = () => {
  const { services } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeService, setActiveService] = useState<Service | null>(null);

  // Expanded categories matching user request: Printing, Designing, Cards, Flex & Banner, Photocopy, Stamp Making, Lamination, Scanning, Composing, Binding
  const categories = [
    { id: 'all', label: 'All 25 Services' },
    { id: 'flex', label: 'Flex & Banner', filterFn: (s: Service) => s.id.includes('srv-02') || s.id.includes('srv-03') },
    { id: 'photocopy', label: 'Photocopy & Print', filterFn: (s: Service) => s.id.includes('srv-12') || s.id.includes('srv-13') || s.id.includes('srv-14') },
    { id: 'cards', label: 'Cards & Wedding', filterFn: (s: Service) => s.id.includes('srv-06') || s.id.includes('srv-07') || s.id.includes('srv-08') || s.id.includes('srv-09') || s.id.includes('srv-10') || s.id.includes('srv-18') || s.id.includes('srv-19') },
    { id: 'design', label: 'Graphic Design', filterFn: (s: Service) => s.categoryId === 'services-design' },
    { id: 'stamp', label: 'Stamp Making', filterFn: (s: Service) => s.id.includes('srv-17') },
    { id: 'composing', label: 'Urdu & InPage Typing', filterFn: (s: Service) => s.id.includes('srv-11') },
    { id: 'binding', label: 'Thesis & Lamination', filterFn: (s: Service) => s.id.includes('srv-16') || s.id.includes('srv-24') },
  ];

  const filteredServices = services.filter(service => {
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      const activeCat = categories.find(c => c.id === selectedCategory);
      if (activeCat && activeCat.filterFn) {
        matchesCategory = activeCat.filterFn(service);
      }
    }
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.urduName.includes(searchQuery) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24 font-body">
      {/* Header Banner */}
      <div className="bg-[#1B3A6B] text-white rounded-[20px] p-5 shadow-card">
        <div className="flex items-center space-x-1.5 text-[#FF7A00] text-[10px] font-heading font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional Print Shop &amp; Design Studio</span>
        </div>
        <h1 className="font-heading text-xl sm:text-2xl font-black mt-0.5">
          Printing &amp; Custom Services
        </h1>
        <p className="text-xs text-slate-200 mt-1 urdu-font">
          فلیکس، بینرز، شادی کارڈز، فوٹو کاپی، مہر سازی، اور تھیسس ہارڈ بائنڈنگ
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#6B7280] absolute left-4 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search banner, flex, photocopy, thesis, stamp, CV..."
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

      {/* Category Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#1B3A6B] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid (All 25 Services) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Image & Badges */}
              <div className="relative aspect-video rounded-[16px] overflow-hidden bg-slate-100 border border-slate-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  <span className="bg-[#122748]/90 text-white text-[10px] font-heading font-bold px-2 py-0.5 rounded-[6px] uppercase tracking-wider backdrop-blur-xs">
                    {service.priceUnit.replace(/_/g, ' ')}
                  </span>
                  {service.requiresFileUpload && (
                    <span className="bg-[#FF7A00] text-[#111827] text-[10px] font-heading font-bold px-2 py-0.5 rounded-[6px] flex items-center space-x-1 shadow-xs">
                      <UploadCloud className="w-3 h-3" />
                      <span>Uploads Allowed</span>
                    </span>
                  )}
                </div>
                <span className="absolute bottom-2 right-2 bg-white/95 text-[#111827] text-[10px] font-bold px-2 py-0.5 rounded-[6px] flex items-center space-x-1 backdrop-blur-xs shadow-xs">
                  <Clock className="w-3 h-3 text-[#1B3A6B]" />
                  <span>{service.estimatedTime}</span>
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-heading text-sm sm:text-base font-bold text-[#111827] leading-snug group-hover:text-[#1B3A6B] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-[#1B3A6B] font-semibold urdu-font mt-0.5">
                  {service.urduName}
                </p>
                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6B7280] font-semibold uppercase block">
                  Starting Price
                </span>
                <span className="font-heading text-sm sm:text-base font-extrabold text-[#1B3A6B]">
                  {formatPKR(service.basePrice)}
                </span>
              </div>

              <button
                onClick={() => setActiveService(service)}
                className="bg-[#1B3A6B] hover:bg-[#264E8C] text-white text-xs font-heading font-bold px-4 py-2.5 rounded-[14px] shadow-xs transition-transform active:scale-95 flex items-center space-x-1 min-h-[48px]"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[20px] border border-[#E5E7EB] p-6 shadow-soft">
          <p className="font-heading text-sm font-bold text-[#111827]">No services found</p>
          <p className="text-xs text-[#6B7280] mt-1">Try another keyword or category filter.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3 text-xs text-[#1B3A6B] font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Service Configurator Modal */}
      {activeService && (
        <ServiceConfigModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </div>
  );
};
