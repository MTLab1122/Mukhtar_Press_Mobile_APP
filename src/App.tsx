import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ServicesTab } from './components/ServicesTab';
import { ProductsTab } from './components/ProductsTab';
import { CartTab } from './components/CartTab';
import { OrderTrackingTab } from './components/OrderTrackingTab';
import { ContactTab } from './components/ContactTab';
import { ProfileTab } from './components/ProfileTab';
import { AdminPanel } from './components/AdminPanel';
import { FlutterCodeTab } from './components/FlutterCodeTab';
import { Smartphone, Monitor } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, deviceFrame, setDeviceFrame } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'services':
        return <ServicesTab />;
      case 'products':
        return <ProductsTab />;
      case 'cart':
        return <CartTab />;
      case 'orders':
        return <OrderTrackingTab />;
      case 'contact':
        return <ContactTab />;
      case 'profile':
        return <ProfileTab />;
      case 'admin':
        return <AdminPanel />;
      case 'flutter-code':
        return <FlutterCodeTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start antialiased text-slate-800">
      {/* Top Banner on Desktop to Switch between Responsive Breakpoints */}
      <div className="w-full bg-[#122748] text-blue-200 py-1.5 px-4 text-xs flex flex-wrap items-center justify-between border-b border-[#1B3A6B] hidden sm:flex">
        <span className="font-heading font-bold text-[#FF7A00] flex items-center space-x-1.5">
          <span>Mukhtar Ahmed Printing Store</span>
          <span className="text-slate-400 font-normal">| Main Bazar Umarzai</span>
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-300 font-medium">Responsive View:</span>
          <button
            onClick={() => setDeviceFrame('small')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-[8px] text-[11px] font-heading font-bold transition-colors ${
              deviceFrame === 'small'
                ? 'bg-[#FF7A00] text-[#111827] shadow-xs'
                : 'bg-[#1B3A6B] text-slate-200 hover:text-white'
            }`}
            title="Small Android phone (320dp)"
          >
            <Smartphone className="w-3 h-3" />
            <span>Small (320dp)</span>
          </button>
          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-[8px] text-[11px] font-heading font-bold transition-colors ${
              deviceFrame === 'mobile'
                ? 'bg-[#FF7A00] text-[#111827] shadow-xs'
                : 'bg-[#1B3A6B] text-slate-200 hover:text-white'
            }`}
            title="Normal mobile phone (390dp)"
          >
            <Smartphone className="w-3 h-3" />
            <span>Normal (390dp)</span>
          </button>
          <button
            onClick={() => setDeviceFrame('tablet')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-[8px] text-[11px] font-heading font-bold transition-colors ${
              deviceFrame === 'tablet'
                ? 'bg-[#FF7A00] text-[#111827] shadow-xs'
                : 'bg-[#1B3A6B] text-slate-200 hover:text-white'
            }`}
            title="Large phone / Small tablet (700dp)"
          >
            <Monitor className="w-3 h-3" />
            <span>Tablet (700dp)</span>
          </button>
          <button
            onClick={() => setDeviceFrame('full')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-[8px] text-[11px] font-heading font-bold transition-colors ${
              deviceFrame === 'full'
                ? 'bg-[#FF7A00] text-[#111827] shadow-xs'
                : 'bg-[#1B3A6B] text-slate-200 hover:text-white'
            }`}
            title="Full fluid responsive view"
          >
            <Monitor className="w-3 h-3" />
            <span>Fluid Full</span>
          </button>
        </div>
      </div>

      {/* Main Container: dynamically styled based on responsive mode */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceFrame === 'small'
            ? 'max-w-[324px] my-0 sm:my-3 sm:rounded-[32px] overflow-hidden shadow-2xl border-0 sm:border-8 sm:border-slate-800 bg-[#F6F7FB] flex flex-col min-h-screen sm:min-h-[720px] relative'
            : deviceFrame === 'mobile'
            ? 'max-w-md my-0 sm:my-3 sm:rounded-[36px] overflow-hidden shadow-2xl border-0 sm:border-8 sm:border-slate-800 bg-[#F6F7FB] flex flex-col min-h-screen sm:min-h-[844px] relative'
            : deviceFrame === 'tablet'
            ? 'max-w-2xl my-0 sm:my-3 sm:rounded-[24px] overflow-hidden shadow-xl border border-slate-300 bg-[#F6F7FB] flex flex-col min-h-screen sm:min-h-[800px] relative'
            : 'max-w-5xl my-0 sm:my-3 sm:rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-[#F6F7FB] flex flex-col min-h-screen relative'
        }`}
      >
        {/* Global App Header */}
        <Header />

        {/* Active Screen Content */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {renderActiveScreen()}
        </main>

        {/* Global Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
