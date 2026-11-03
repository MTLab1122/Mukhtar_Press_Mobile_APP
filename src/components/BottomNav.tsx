import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Wrench, 
  ShoppingCart, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, currentUser, deviceFrame } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 5 standard customer navigation items as requested in specification
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'services', label: 'Services', icon: Wrench },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: ShoppingCart, 
      badge: cartCount > 0 ? cartCount : undefined 
    },
    { 
      id: currentUser.role === 'admin' ? 'admin' : 'profile', 
      label: currentUser.role === 'admin' ? 'Admin' : 'Profile', 
      icon: currentUser.role === 'admin' ? ShieldCheck : User,
      highlight: currentUser.role === 'admin'
    },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] shadow-float px-2 py-1 mx-auto transition-all ${
        deviceFrame === 'mobile' ? 'max-w-md' : 'max-w-5xl'
      }`}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-[14px] transition-all min-w-[54px] min-h-[50px] relative ${
                isActive 
                  ? 'text-[#1B3A6B] font-bold scale-105' 
                  : 'text-[#6B7280] hover:text-[#1B3A6B] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px] text-[#1B3A6B]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FF7A00] text-[#111827] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-heading mt-1 tracking-tight ${
                isActive ? 'text-[#1B3A6B] font-bold' : item.highlight ? 'text-[#FF7A00] font-bold' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
