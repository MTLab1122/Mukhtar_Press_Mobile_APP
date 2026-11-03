import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactTab: React.FC = () => {
  const { shopSettings } = useApp();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Main Bazar Umarzai Charsadda Pakistan'
  )}`;

  return (
    <div className="space-y-4 pb-24 font-body">
      {/* Banner */}
      <div className="bg-[#1B3A6B] text-white rounded-[20px] p-5 shadow-card">
        <span className="text-[#FF7A00] text-[10px] font-heading font-black uppercase tracking-wider">
          Visit or Contact Us
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-black mt-0.5">
          Mukhtar Ahmed Store
        </h1>
        <p className="text-xs text-slate-200 mt-1 urdu-font">
          مین بازار عمرزئی، چارسدہ، خیبر پختونخوا
        </p>
      </div>

      {/* Instant Action CTA Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3.5">
        <h2 className="font-heading text-sm font-bold text-[#111827]">
          Direct Contact &amp; Fast Response
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`tel:${shopSettings.phone}`}
            className="flex items-center space-x-3 p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-[16px] transition-colors group"
          >
            <div className="w-11 h-11 rounded-[14px] bg-[#16A34A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#16A34A] font-bold uppercase block">Call Shop Directly</span>
              <p className="font-mono text-sm font-black text-[#111827]">{shopSettings.phone}</p>
            </div>
          </a>

          <a
            href={`https://wa.me/92${shopSettings.whatsapp.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-[16px] transition-colors group"
          >
            <div className="w-11 h-11 rounded-[14px] bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#128C7E] font-bold uppercase block">WhatsApp Chat &amp; Files</span>
              <p className="font-mono text-sm font-black text-[#111827]">{shopSettings.whatsapp}</p>
            </div>
          </a>
        </div>
      </div>

      {/* Location & Map Preview */}
      <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#FF7A00]" />
              <span>Shop Address &amp; Location</span>
            </h2>
            <p className="text-xs text-[#111827] font-semibold">
              {shopSettings.address}
            </p>
            <p className="text-xs text-[#6B7280]">
              Landmark: {shopSettings.landmark}
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs font-heading font-bold bg-[#1B3A6B] hover:bg-[#264E8C] text-white px-3 py-2 rounded-[12px] shrink-0 shadow-xs"
          >
            <span>Open Maps</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        {/* Map Preview card */}
        <div className="relative aspect-video rounded-[16px] overflow-hidden border border-[#E5E7EB] bg-slate-100 flex items-center justify-center text-center p-4">
          <div className="space-y-2 z-10 bg-white/95 backdrop-blur-md p-4 rounded-[16px] border border-[#E5E7EB] shadow-card max-w-xs">
            <MapPin className="w-7 h-7 text-[#FF7A00] mx-auto animate-bounce" />
            <h4 className="font-heading font-bold text-xs text-[#111827]">Main Bazar Umarzai</h4>
            <p className="text-[11px] text-[#6B7280]">
              Coordinates: {shopSettings.coordinates.lat}° N, {shopSettings.coordinates.lng}° E
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] font-heading font-bold text-[#1B3A6B] hover:underline"
            >
              Get Directions on Google Maps →
            </a>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1B3A6B_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      </div>

      {/* Shop Timings */}
      <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3">
        <h2 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-[#1B3A6B]" />
          <span>Shop Working Hours</span>
        </h2>
        <div className="space-y-2 text-xs text-[#111827]">
          <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
            <span className="text-[#6B7280]">Saturday to Thursday:</span>
            <span className="font-bold">8:00 AM – 9:00 PM</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
            <span className="text-[#6B7280]">Friday:</span>
            <span className="font-bold">2:00 PM – 9:00 PM (After Juma)</span>
          </div>
        </div>
      </div>

      {/* Payment Accounts */}
      <div className="bg-[#122748] text-white rounded-[20px] p-5 shadow-card space-y-3">
        <h2 className="font-heading text-sm font-black uppercase tracking-wider text-[#FF7A00] flex items-center space-x-2">
          <CreditCard className="w-4 h-4" />
          <span>Shop Payment Accounts</span>
        </h2>
        <div className="space-y-2 text-xs font-mono bg-[#1B3A6B]/80 p-3.5 rounded-[14px] border border-[#264E8C]">
          <p><strong className="text-amber-300 font-heading">JazzCash:</strong> {shopSettings.jazzCashNumber} ({shopSettings.jazzCashTitle})</p>
          <p><strong className="text-amber-300 font-heading">EasyPaisa:</strong> {shopSettings.easyPaisaNumber} ({shopSettings.easyPaisaTitle})</p>
          <p><strong className="text-amber-300 font-heading">Bank:</strong> {shopSettings.bankName}</p>
          <p><strong className="text-amber-300 font-heading">IBAN:</strong> {shopSettings.bankIban}</p>
        </div>
      </div>
    </div>
  );
};
