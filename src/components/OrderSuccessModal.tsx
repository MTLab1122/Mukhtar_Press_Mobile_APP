import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Copy, 
  Check, 
  X 
} from 'lucide-react';
import { Order } from '../types';
import { formatPKR, generateWhatsAppOrderUrl } from '../utils/priceCalculator';
import { useApp } from '../context/AppContext';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { shopSettings, setActiveTab, setTrackedOrderId } = useApp();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const whatsAppUrl = generateWhatsAppOrderUrl(shopSettings.whatsapp, order);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackOrder = () => {
    setTrackedOrderId(order.id);
    setActiveTab('orders');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Order Placed!</h2>
          <p className="text-xs text-emerald-100 mt-1 urdu-font">
            آپ کا آرڈر موصول ہو چکا ہے۔ شکریہ!
          </p>
          <p className="text-xs text-emerald-200 mt-0.5">
            Mukhtar Ahmed will review your order immediately.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-5 space-y-4 text-slate-800">
          {/* Order Number Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Order Reference Number
              </span>
              <span className="text-lg font-black text-blue-950 font-mono">
                {order.orderNumber}
              </span>
            </div>
            <button
              onClick={copyOrderNumber}
              className="flex items-center space-x-1 text-xs font-bold text-blue-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Summary Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-semibold text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Delivery Method:</span>
              <span className="font-semibold text-slate-900">{order.deliveryMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment:</span>
              <span className="font-semibold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Items:</span>
              <span className="font-semibold text-slate-900">{order.items.length} item(s)</span>
            </div>
            <div className="flex justify-between py-1 pt-2 font-bold text-sm">
              <span className="text-slate-900">Total Payable:</span>
              <span className="text-blue-950 font-black">{formatPKR(order.totalAmount)}</span>
            </div>
          </div>

          {/* WHATSAPP CONFIRMATION CTA - CRITICAL FEATURE */}
          <div className="space-y-2 pt-1">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm &amp; Send to WhatsApp</span>
            </a>
            <p className="text-[11px] text-center text-slate-500">
              Opens WhatsApp with your pre-filled order summary for Mukhtar Ahmed.
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleTrackOrder}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1"
            >
              <Clock className="w-4 h-4" />
              <span>Track Order</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
