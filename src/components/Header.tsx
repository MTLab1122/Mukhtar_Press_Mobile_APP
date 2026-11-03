import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShoppingCart, 
  Bell, 
  ShieldCheck, 
  User, 
  Smartphone, 
  Monitor,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppColors } from '../theme/designSystem';

export const Header: React.FC = () => {
  const { 
    shopSettings, 
    cart, 
    unreadNotificationsCount, 
    currentUser, 
    switchUserRole, 
    activeTab, 
    setActiveTab,
    deviceFrame,
    setDeviceFrame
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#1B3A6B] text-white shadow-soft">
      {/* Top micro bar with Umarzai Location and quick contact buttons */}
      <div className="bg-[#122748] px-3.5 py-1.5 text-xs flex items-center justify-between border-b border-[#1B3A6B]/60">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
          <span className="truncate max-w-[190px] sm:max-w-none font-medium text-[11px] sm:text-xs">
            Main Bazar Umarzai, Charsadda
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <a 
            href={`tel:${shopSettings.phone}`}
            className="flex items-center space-x-1 text-slate-200 hover:text-white transition-colors"
            title="Call Shop: 03149958963"
            aria-label="Call Shop 03149958963"
          >
            <Phone className="w-3 h-3 text-[#16A34A]" />
            <span className="font-mono text-[11px] sm:text-xs font-semibold">{shopSettings.phone}</span>
          </a>

          <a 
            href={`https://wa.me/92${shopSettings.whatsapp.replace(/^0/, '')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-[#25D366] hover:text-[#20ba59] font-bold text-[11px] sm:text-xs transition-colors"
            title="WhatsApp Shop"
            aria-label="WhatsApp Shop"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={() => setDeviceFrame(deviceFrame === 'mobile' ? 'full' : 'mobile')}
            className="hidden md:flex items-center space-x-1 bg-[#1B3A6B] hover:bg-[#264E8C] text-[#FF7A00] px-2 py-0.5 rounded-md text-[11px] font-semibold border border-[#264E8C] transition-colors"
            title={deviceFrame === 'mobile' ? 'Switch to Full Screen View' : 'Switch to Mobile App Preview'}
          >
            {deviceFrame === 'mobile' ? (
              <>
                <Monitor className="w-3 h-3" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span>Mobile Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="px-3.5 sm:px-5 py-3 flex items-center justify-between">
        {/* Brand identity & Customer Welcome */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('home')}
            className="w-11 h-11 rounded-[14px] bg-gradient-to-tr from-[#FF7A00] to-[#FFA726] text-[#122748] flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
            aria-label="Mukhtar Ahmed Printing Store Home"
          >
            <Printer className="w-6 h-6 text-[#122748]" />
          </button>

          <div className="text-left">
            <p className="text-[11px] text-amber-200/90 font-medium leading-none">
              Assalam-o-Alaikum, <strong className="text-white font-semibold">{currentUser.name.split(' ')[0]}</strong>
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="text-left block mt-0.5 group focus:outline-none"
            >
              <h1 className="font-heading font-extrabold text-base sm:text-lg tracking-tight leading-tight text-white group-hover:text-amber-300 transition-colors">
                Mukhtar Printing &amp; Store
              </h1>
            </button>
            <p className="text-[10px] text-slate-300 leading-tight">
              Main Bazar Umarzai • Computer Accessories
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Admin Switcher */}
          <button
            onClick={() => switchUserRole(currentUser.role === 'admin' ? 'customer' : 'admin')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-[12px] text-xs font-semibold border transition-all ${
              currentUser.role === 'admin'
                ? 'bg-[#FF7A00] text-[#111827] border-[#FFA726] shadow-sm font-bold'
                : 'bg-[#122748]/70 hover:bg-[#122748] text-slate-200 border-[#264E8C] hover:text-white'
            }`}
            title="Switch between Customer & Admin Panel"
            aria-label="Switch User Role"
          >
            <ShieldCheck className="w-4 h-4 text-inherit" />
            <span className="hidden sm:inline">
              {currentUser.role === 'admin' ? 'Owner Panel' : 'Owner'}
            </span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="relative p-2 rounded-[12px] text-slate-200 hover:text-white hover:bg-[#264E8C]/60 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setActiveTab('cart')}
            className="relative flex items-center space-x-1.5 bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-bold px-3 py-2 rounded-[14px] shadow-sm transition-transform active:scale-95 min-h-[40px]"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 text-[#111827]" />
            <span className="text-xs hidden sm:inline font-heading">Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-[#1B3A6B] text-white text-[11px] px-1.5 py-0.2 rounded-full font-black">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full bg-[#264E8C] border-2 border-[#FF7A00] text-white font-bold flex items-center justify-center text-xs hover:opacity-90 transition-opacity"
            title={currentUser.name}
            aria-label="Profile Details"
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};
