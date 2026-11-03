import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  MessageCircle, 
  Phone, 
  Package, 
  Truck, 
  Store, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FileCheck,
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { formatPKR, generateWhatsAppOrderUrl } from '../utils/priceCalculator';

export const OrderTrackingTab: React.FC = () => {
  const { orders, shopSettings, trackedOrderId } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchOrderNumber, setSearchOrderNumber] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    trackedOrderId || (orders.length > 0 ? orders[0].id : null)
  );

  // The 6 Canonical Timeline Steps as requested in the specification:
  // 1. Order Placed -> 2. Confirmed -> 3. Designing -> 4. Printing -> 5. Ready for Pickup / Out for Delivery -> 6. Completed
  const timelineSteps = [
    { key: 'Pending', label: 'Order Placed', desc: 'Received by Mukhtar Ahmed Printing Store' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Order & specifications verified' },
    { key: 'Designing', label: 'Designing', desc: 'Urdu/English artwork & typography in progress' },
    { key: 'Printing', label: 'Printing', desc: 'On laser machine / wide-format solvent flex' },
    { key: 'Ready', label: 'Ready for Pickup / Out for Delivery', desc: 'Finished, laminated, and packed' },
    { key: 'Completed', label: 'Completed', desc: 'Handed over to customer / delivered' },
  ];

  const getStepStatus = (stepIndex: number, currentStatus: OrderStatus, deliveryMethod: string) => {
    // Map order status to index
    let activeIdx = 0;
    if (currentStatus === 'Pending') activeIdx = 0;
    else if (currentStatus === 'Confirmed') activeIdx = 1;
    else if (currentStatus === 'Designing') activeIdx = 2;
    else if (currentStatus === 'Printing') activeIdx = 3;
    else if (currentStatus === 'Ready for Pickup' || currentStatus === 'Out for Delivery') activeIdx = 4;
    else if (currentStatus === 'Completed') activeIdx = 5;
    else if (currentStatus === 'Cancelled') return 'cancelled';

    if (stepIndex < activeIdx) return 'completed';
    if (stepIndex === activeIdx) return 'current';
    return 'pending';
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchOrderNumber.trim() === '' || 
      order.orderNumber.toLowerCase().includes(searchOrderNumber.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchOrderNumber.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24 font-body">
      {/* Header Banner */}
      <div className="bg-[#1B3A6B] text-white rounded-[20px] p-5 shadow-card">
        <span className="text-[#FF7A00] text-[10px] font-heading font-black uppercase tracking-wider">
          Live Status &amp; Progress
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-black mt-0.5">
          Order Tracking &amp; History
        </h1>
        <p className="text-xs text-slate-200 mt-1 urdu-font">
          اپنے آرڈر کی تیاری اور ترسیل کا مرحلہ وار جائزہ دیکھیں
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchOrderNumber}
            onChange={(e) => setSearchOrderNumber(e.target.value)}
            placeholder="Search by Order # (e.g. MA-2026-0001)..."
            className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-[14px] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none shadow-soft"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-[14px] font-medium text-[#111827] focus:ring-2 focus:ring-[#1B3A6B] shadow-soft"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Printing">Printing</option>
          <option value="Ready for Pickup">Ready for Pickup</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {filteredOrders.map(order => {
          const isExpanded = expandedOrderId === order.id;
          const whatsAppUrl = generateWhatsAppOrderUrl(shopSettings.whatsapp, order);

          return (
            <div
              key={order.id}
              className="bg-white border border-[#E5E7EB] rounded-[20px] shadow-soft overflow-hidden transition-all"
            >
              {/* Order Card Header */}
              <div
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-[#1B3A6B]">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
                      order.status === 'Completed'
                        ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                        : order.status === 'Printing'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {order.customerName} • {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-heading text-sm font-black text-[#1B3A6B]">
                    {formatPKR(order.totalAmount)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#6B7280]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6B7280]" />
                  )}
                </div>
              </div>

              {/* EXPANDED VERTICAL TIMELINE & SPECS */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-[#F3F4F6] bg-slate-50/50 space-y-4">
                  {/* VERTICAL TIMELINE (The 6 Steps) */}
                  <div className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] space-y-3">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B3A6B]">
                      Order Progress Timeline
                    </h4>

                    {order.status !== 'Cancelled' ? (
                      <div className="space-y-4 pl-2 relative border-l-2 border-[#E5E7EB] ml-3 mt-2">
                        {timelineSteps.map((step, sIdx) => {
                          const state = getStepStatus(sIdx, order.status, order.deliveryMethod);
                          const matchingHistory = order.statusHistory.find(h => {
                            if (sIdx === 0 && h.status === 'Pending') return true;
                            if (sIdx === 1 && h.status === 'Confirmed') return true;
                            if (sIdx === 2 && h.status === 'Designing') return true;
                            if (sIdx === 3 && h.status === 'Printing') return true;
                            if (sIdx === 4 && (h.status === 'Ready for Pickup' || h.status === 'Out for Delivery')) return true;
                            if (sIdx === 5 && h.status === 'Completed') return true;
                            return false;
                          });

                          return (
                            <div key={step.key} className="relative pl-6">
                              {/* Timeline indicator node */}
                              <div className={`absolute -left-[13px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                state === 'completed'
                                  ? 'bg-[#16A34A] text-white shadow-xs'
                                  : state === 'current'
                                  ? 'bg-[#FF7A00] text-[#111827] ring-4 ring-amber-100 font-black scale-110'
                                  : 'bg-white border-2 border-[#E5E7EB] text-[#6B7280]'
                              }`}>
                                {state === 'completed' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  sIdx + 1
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between">
                                  <h5 className={`font-heading text-xs font-bold ${
                                    state === 'current' ? 'text-[#1B3A6B]' : state === 'completed' ? 'text-[#111827]' : 'text-[#6B7280]'
                                  }`}>
                                    {step.label}
                                  </h5>
                                  {matchingHistory && (
                                    <span className="text-[10px] text-[#6B7280] font-mono">
                                      {new Date(matchingHistory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#6B7280] mt-0.5">
                                  {matchingHistory?.note || step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs text-[#DC2626] flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>This order was cancelled.</span>
                      </div>
                    )}
                  </div>

                  {/* ADMIN NOTES */}
                  {order.adminNotes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-3 text-xs text-amber-900">
                      <strong className="block font-heading">Shop Note (Mukhtar Ahmed):</strong>
                      <p className="mt-0.5">{order.adminNotes}</p>
                    </div>
                  )}

                  {/* ORDER ITEMS & BREAKDOWN */}
                  <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3.5 space-y-2 text-xs">
                    <h5 className="font-heading font-bold text-[#111827]">Order Items ({order.items.length})</h5>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b last:border-0 border-[#F3F4F6]">
                        <div>
                          <span className="font-semibold text-[#111827]">{it.name}</span>
                          <span className="text-[#6B7280] ml-1">x {it.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-[#1B3A6B]">{formatPKR(it.calculatedPrice)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1 font-heading font-bold text-sm text-[#111827]">
                      <span>Total ({order.deliveryMethod}):</span>
                      <span className="text-[#1B3A6B] font-black font-mono">{formatPKR(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* UPLOADED ARTWORK FILES */}
                  {order.uploadedFiles && order.uploadedFiles.length > 0 && (
                    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-3 space-y-1.5 text-xs">
                      <span className="font-heading font-bold text-[#111827] flex items-center space-x-1.5">
                        <FileCheck className="w-4 h-4 text-[#16A34A]" />
                        <span>Uploaded Printing Files</span>
                      </span>
                      {order.uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-1.5 bg-slate-50 rounded-[8px]">
                          <span className="font-medium text-[#111827] truncate">{file.name}</span>
                          <span className="text-[10px] text-[#6B7280] font-mono">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DIRECT CONTACT BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${shopSettings.phone}`}
                      className="flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-[#111827] py-2.5 px-3 rounded-[12px] font-heading text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Call Shop</span>
                    </a>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-3 rounded-[12px] font-heading text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Shop</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-[20px] border border-[#E5E7EB] p-6 shadow-soft">
            <p className="font-heading text-sm font-bold text-[#111827]">You have not placed any order yet</p>
            <p className="text-xs text-[#6B7280] mt-1">Place a printing or store order to track it live!</p>
          </div>
        )}
      </div>
    </div>
  );
};
