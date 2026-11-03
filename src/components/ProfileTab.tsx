import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Bell, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Save, 
  MessageCircle, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPKR } from '../utils/priceCalculator';

export const ProfileTab: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    notifications, 
    markNotificationAsRead, 
    orders, 
    switchUserRole, 
    setActiveTab, 
    setTrackedOrderId,
    shopSettings 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, address });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleNotificationClick = (orderId?: string) => {
    if (orderId) {
      setTrackedOrderId(orderId);
      setActiveTab('orders');
    }
  };

  return (
    <div className="space-y-4 pb-24 font-body">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#16A34A] text-white px-4 py-2 rounded-[14px] text-xs font-heading font-bold shadow-float flex items-center space-x-2 border border-emerald-600">
          <Check className="w-4 h-4 text-white" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="bg-[#1B3A6B] text-white rounded-[20px] p-5 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-[16px] bg-[#FF7A00] text-[#111827] font-heading font-black text-xl flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading text-lg font-bold text-white">{currentUser.name}</h1>
              <span className={`text-[10px] font-heading font-black px-2 py-0.5 rounded-full uppercase ${
                currentUser.role === 'admin' ? 'bg-[#FF7A00] text-[#111827]' : 'bg-[#122748] text-slate-200'
              }`}>
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-mono mt-0.5">{currentUser.phone}</p>
            <p className="text-[11px] text-slate-300 truncate max-w-[190px] sm:max-w-none">
              {currentUser.address}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-[12px] text-white transition-colors"
          title="Edit Profile"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* EDIT PROFILE FORM */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3">
          <h3 className="font-heading text-sm font-bold text-[#111827]">Edit Customer Profile</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#111827] font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-[12px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#111827] font-semibold mb-1">Mobile Phone (Pakistani)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-[12px] font-mono focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#111827] font-semibold mb-1">Saved Address (Umarzai)</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-[12px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-[#6B7280] hover:bg-slate-100 rounded-[10px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-heading font-bold bg-[#1B3A6B] hover:bg-[#264E8C] text-white rounded-[12px] flex items-center space-x-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('orders')}
          className="p-4 bg-white border border-[#E5E7EB] rounded-[18px] text-left hover:border-[#1B3A6B] shadow-soft transition-transform active:scale-95"
        >
          <Clock className="w-5 h-5 text-[#1B3A6B] mb-2" />
          <h4 className="font-heading text-xs font-bold text-[#111827]">Order Tracking</h4>
          <p className="text-[11px] text-[#6B7280] mt-0.5">
            {orders.length} order{orders.length !== 1 ? 's' : ''} in record
          </p>
        </button>

        <button
          onClick={() => switchUserRole(currentUser.role === 'admin' ? 'customer' : 'admin')}
          className="p-4 bg-white border border-[#E5E7EB] rounded-[18px] text-left hover:border-[#FF7A00] shadow-soft transition-transform active:scale-95"
        >
          <ShieldCheck className="w-5 h-5 text-[#FF7A00] mb-2" />
          <h4 className="font-heading text-xs font-bold text-[#111827]">
            {currentUser.role === 'admin' ? 'Customer View' : 'Shop Owner Panel'}
          </h4>
          <p className="text-[11px] text-[#6B7280] mt-0.5">
            Mode: {currentUser.role}
          </p>
        </button>
      </div>

      {/* NOTIFICATIONS CENTER */}
      <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-1.5">
            <Bell className="w-4 h-4 text-[#1B3A6B]" />
            <span>Order Notifications</span>
          </h3>
          <span className="text-xs text-[#6B7280]">
            {notifications.length} alerts
          </span>
        </div>

        <div className="space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                handleNotificationClick(notif.orderId);
              }}
              className={`p-3 rounded-[14px] border cursor-pointer transition-all ${
                notif.isRead 
                  ? 'bg-slate-50/70 border-[#E5E7EB] text-[#6B7280]' 
                  : 'bg-blue-50/70 border-blue-200 text-[#111827] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-heading text-xs font-bold text-[#111827]">{notif.title}</h4>
                <span className="text-[10px] text-[#6B7280] font-mono">
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">{notif.body}</p>
              {notif.orderId && (
                <span className="inline-block mt-1 text-[11px] font-heading font-bold text-[#1B3A6B] hover:underline">
                  Track this Order →
                </span>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <p className="text-xs text-[#6B7280] text-center py-4">
              No notifications yet.
            </p>
          )}
        </div>
      </div>

      {/* WHATSAPP CONTACT CARD */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-[18px] p-4 flex items-center justify-between">
        <div>
          <h4 className="font-heading text-xs font-bold text-emerald-950">Direct WhatsApp Inquiry</h4>
          <p className="text-[11px] text-emerald-700">Mukhtar Ahmed • Main Bazar Umarzai</p>
        </div>
        <a
          href={`https://wa.me/92${shopSettings.whatsapp.replace(/^0/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-[12px] text-xs font-heading font-bold flex items-center space-x-1 shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat</span>
        </a>
      </div>

      {/* PRIVACY POLICY & STORE COMPLIANCE BUTTON */}
      <div className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 flex items-center justify-between shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[12px] bg-blue-50 text-[#1B3A6B] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#1B3A6B]" />
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold text-[#111827]">Privacy Policy &amp; Data Safety</h4>
            <p className="text-[11px] text-[#6B7280]">Google Play &amp; Apple App Store Compliant</p>
          </div>
        </div>
        <button
          onClick={() => setShowPrivacy(true)}
          className="px-3 py-1.5 bg-[#1B3A6B] hover:bg-[#264E8C] text-white text-xs font-heading font-bold rounded-[10px] transition-colors"
        >
          View Policy
        </button>
      </div>

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1B3A6B] text-white p-4.5 flex items-center justify-between border-b border-[#264E8C]">
              <div>
                <h3 className="font-heading text-base font-bold">Privacy Policy &amp; Data Safety</h3>
                <p className="text-[11px] text-slate-300">Mukhtar Ahmed Printing Store • Main Bazar Umarzai</p>
              </div>
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#111827] leading-relaxed">
              <div>
                <h4 className="font-heading font-bold text-[#1B3A6B] text-sm">1. Introduction</h4>
                <p className="text-[#6B7280] mt-1">
                  Mukhtar Ahmed Printing &amp; Computer Store, located at Main Bazar Umarzai, Charsadda, KPK, operates this mobile application to offer printing services, office supplies, stamps, and flex banners.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-[#1B3A6B] text-sm">2. Information Collected</h4>
                <p className="text-[#6B7280] mt-1">
                  We collect your Name, Pakistani Phone Number, and Delivery Address solely for order dispatch and customer support. Uploaded design files (up to 25 MB) are used exclusively for physical printing production.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-[#1B3A6B] text-sm">3. File Security &amp; Storage</h4>
                <p className="text-[#6B7280] mt-1">
                  Uploaded files are encrypted in transit via TLS and stored securely in Firebase Cloud Storage. Only authorized store personnel (Mukhtar Ahmed) have access to print your job. Your files are never shared with third parties or used for advertisements.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-bold text-[#1B3A6B] text-sm">4. Account &amp; File Deletion</h4>
                <p className="text-[#6B7280] mt-1">
                  You may request permanent deletion of your account profile and uploaded printing files at any time by calling or messaging shop owner Mukhtar Ahmed at <strong>03149958963</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-[14px] border border-slate-200">
                <p className="font-heading font-bold text-[#1B3A6B]">Store Contact</p>
                <p className="text-[11px] text-[#6B7280]">Owner: Mukhtar Ahmed</p>
                <p className="text-[11px] text-[#6B7280]">Location: Main Bazar Umarzai, Charsadda, Pakistan</p>
                <p className="text-[11px] text-[#6B7280]">Phone / WhatsApp: 03149958963</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowPrivacy(false)}
                className="px-5 py-2 bg-[#1B3A6B] text-white font-heading font-bold text-xs rounded-[12px] hover:bg-[#264E8C]"
              >
                Close Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
