import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  ArrowRight, 
  Truck, 
  Store, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  DollarSign, 
  FileCheck, 
  Phone, 
  User, 
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  Wrench,
  Package,
  Layers,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeliveryMethod, Order, PaymentMethod } from '../types';
import { formatPKR, isValidPakistaniPhone } from '../utils/priceCalculator';
import { OrderSuccessModal } from './OrderSuccessModal';

export const CartTab: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotals, 
    deliveryMethod, 
    setDeliveryMethod, 
    shopSettings, 
    currentUser, 
    placeOrder, 
    setActiveTab 
  } = useApp();

  // 3-step checkout state: 0 = Cart summary, 1 = Contact & Delivery, 2 = Payment, 3 = Review & Confirm
  const [checkoutStep, setCheckoutStep] = useState<number>(0);

  // Form State
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.address || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    deliveryMethod === 'Shop Pickup' ? 'Cash on Shop Pickup' : 'Cash on Delivery'
  );

  // Validation errors
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Filter items into Products and Printing Services
  const productItems = cart.filter(item => item.type === 'PRODUCT');
  const serviceItems = cart.filter(item => item.type === 'SERVICE');

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    if (method === 'Shop Pickup' && paymentMethod === 'Cash on Delivery') {
      setPaymentMethod('Cash on Shop Pickup');
    } else if (method === 'Home Delivery' && paymentMethod === 'Cash on Shop Pickup') {
      setPaymentMethod('Cash on Delivery');
    }
  };

  const handleNextStep = () => {
    const errors: { [key: string]: string } = {};

    if (checkoutStep === 1) {
      if (!customerName.trim() || customerName.trim().length < 3) {
        errors.customerName = 'Please enter your full name (minimum 3 characters)';
      }
      if (!phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!isValidPakistaniPhone(phone)) {
        errors.phone = 'Please enter a valid Pakistani mobile number (03xx-xxxxxxx)';
      }
      if (deliveryMethod === 'Home Delivery' && (!deliveryAddress.trim() || deliveryAddress.trim().length < 5)) {
        errors.deliveryAddress = 'Complete delivery address in Umarzai or nearby area is required';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setCheckoutStep(3);
    }
  };

  const handlePlaceOrder = () => {
    const newOrder = placeOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || phone.trim(),
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'Home Delivery' ? deliveryAddress.trim() : undefined,
      paymentMethod,
      orderNotes: orderNotes.trim(),
    });

    setPlacedOrder(newOrder);
  };

  // EMPTY CART STATE
  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-card max-w-lg mx-auto font-body space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1B3A6B] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingCart className="w-8 h-8 text-[#1B3A6B]" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-[#111827]">Your Cart is Empty</h2>
          <p className="text-xs text-[#6B7280] mt-1 max-w-xs mx-auto">
            You haven't added any products or printing services to your cart yet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => setActiveTab('products')}
            className="w-full sm:w-auto bg-[#1B3A6B] hover:bg-[#264E8C] text-white font-heading font-bold py-3 px-5 rounded-[14px] text-xs transition-colors min-h-[48px]"
          >
            Browse Products
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-heading font-bold py-3 px-5 rounded-[14px] text-xs transition-colors min-h-[48px]"
          >
            Order Printing Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 font-body">
      {/* Step Indicator Header (if in checkout mode) */}
      {checkoutStep > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCheckoutStep(checkoutStep - 1)}
              className="flex items-center text-xs font-bold text-[#1B3A6B] hover:underline"
            >
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span>Back</span>
            </button>
            <span className="text-xs font-heading font-bold text-[#111827]">
              Step {checkoutStep} of 3
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-heading font-bold">
            <div className={`p-1.5 rounded-[8px] transition-colors ${
              checkoutStep >= 1 ? 'bg-[#1B3A6B] text-white' : 'bg-slate-100 text-[#6B7280]'
            }`}>
              1. Delivery
            </div>
            <div className={`p-1.5 rounded-[8px] transition-colors ${
              checkoutStep >= 2 ? 'bg-[#1B3A6B] text-white' : 'bg-slate-100 text-[#6B7280]'
            }`}>
              2. Payment
            </div>
            <div className={`p-1.5 rounded-[8px] transition-colors ${
              checkoutStep === 3 ? 'bg-[#FF7A00] text-[#111827]' : 'bg-slate-100 text-[#6B7280]'
            }`}>
              3. Review
            </div>
          </div>
        </div>
      )}

      {/* STEP 0: CART OVERVIEW & BREAKDOWN */}
      {checkoutStep === 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-xl font-bold text-[#111827]">
                Shopping Cart ({cart.length} item{cart.length > 1 ? 's' : ''})
              </h1>
              <p className="text-xs text-[#6B7280]">
                Physical products and custom printing services
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-xs text-[#DC2626] font-semibold hover:bg-red-50 px-2 py-1 rounded-[8px] transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* 1. PRINTING & DESIGN SERVICES IN CART */}
          {serviceItems.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B3A6B] flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Printing &amp; Custom Services ({serviceItems.length})</span>
              </h2>

              <div className="space-y-2.5">
                {serviceItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E5E7EB] rounded-[18px] p-4 shadow-soft space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-[14px] object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <span className="bg-blue-50 text-[#1B3A6B] text-[10px] font-heading font-black px-1.5 py-0.2 rounded uppercase">
                            SERVICE
                          </span>
                          <h3 className="font-heading text-xs sm:text-sm font-bold text-[#111827] mt-0.5">
                            {item.name}
                          </h3>

                          {/* Options breakdown */}
                          {item.serviceConfig && (
                            <div className="text-[11px] text-[#6B7280] space-y-0.5 mt-1">
                              {item.serviceConfig.widthFeet && item.serviceConfig.heightFeet && (
                                <p>Size: <strong className="text-[#111827]">{item.serviceConfig.widthFeet}×{item.serviceConfig.heightFeet} ft</strong> ({item.serviceConfig.widthFeet * item.serviceConfig.heightFeet} sq ft)</p>
                              )}
                              {item.serviceConfig.pages && (
                                <p>Pages: <strong className="text-[#111827]">{item.serviceConfig.pages}</strong>, {item.serviceConfig.copies} copies {item.serviceConfig.isColor ? '(Color)' : '(B&W)'}</p>
                              )}
                              {item.serviceConfig.cardQuantity && (
                                <p>Quantity: <strong className="text-[#111827]">{item.serviceConfig.cardQuantity} Cards</strong></p>
                              )}
                              {item.serviceConfig.stampType && (
                                <p>Type: <strong className="text-[#111827]">{item.serviceConfig.stampType}</strong></p>
                              )}
                              {item.serviceConfig.uploadedFiles && item.serviceConfig.uploadedFiles.length > 0 && (
                                <p className="text-[#16A34A] font-medium flex items-center space-x-1">
                                  <FileCheck className="w-3 h-3" />
                                  <span>{item.serviceConfig.uploadedFiles.map(f => f.name).join(', ')}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6B7280] hover:text-[#DC2626] p-1.5 rounded-lg"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-xs">
                      <span className="text-[#6B7280]">Estimated Rate</span>
                      <span className="font-heading font-extrabold text-sm text-[#1B3A6B]">
                        {formatPKR(item.calculatedPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. STORE HARDWARE & PRODUCTS IN CART */}
          {productItems.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center space-x-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Store Products ({productItems.length})</span>
              </h2>

              <div className="space-y-2.5">
                {productItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E5E7EB] rounded-[18px] p-3.5 shadow-soft flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-[12px] object-cover border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-heading text-xs font-bold text-[#111827] truncate">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-[#6B7280]">
                          {formatPKR(item.unitPrice)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-[#E5E7EB] rounded-[10px] overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#111827] font-bold hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs text-[#111827] min-w-5 text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#111827] font-bold hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-heading text-xs font-bold text-[#1B3A6B] min-w-[70px] text-right">
                        {formatPKR(item.calculatedPrice)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6B7280] hover:text-[#DC2626] p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDER TOTAL CARD & PROCEED BUTTON */}
          <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3">
            <h3 className="font-heading text-sm font-bold text-[#111827]">Order Summary</h3>

            <div className="space-y-2 text-xs text-[#6B7280]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-[#111827]">{formatPKR(cartTotals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery:</span>
                <span className="font-mono font-bold text-[#111827]">Calculated next step</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F3F4F6] text-sm font-bold text-[#111827]">
                <span>Estimated Items Total:</span>
                <span className="font-heading text-lg font-black text-[#1B3A6B]">
                  {formatPKR(cartTotals.subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep(1)}
              className="w-full bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-heading font-bold py-3.5 px-5 rounded-[14px] text-sm shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-95 min-h-[52px]"
            >
              <span>Continue to Delivery &amp; Contact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: CONTACT & DELIVERY */}
      {checkoutStep === 1 && (
        <div className="space-y-4">
          {/* Delivery Method Picker */}
          <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3">
            <h2 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#1B3A6B]" />
              <span>Choose Delivery Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => handleDeliveryMethodChange('Shop Pickup')}
                className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'Shop Pickup'
                    ? 'border-[#1B3A6B] bg-blue-50/50 shadow-xs'
                    : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Store className="w-4 h-4 text-[#1B3A6B]" />
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#111827]">
                      Self Pickup (Counter)
                    </span>
                  </div>
                  <span className="text-[10px] font-heading font-black text-[#16A34A] bg-emerald-100 px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                  Collect from Mukhtar Ahmed Store, Main Bazar Umarzai.
                </p>
              </div>

              <div
                onClick={() => handleDeliveryMethodChange('Home Delivery')}
                className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                  deliveryMethod === 'Home Delivery'
                    ? 'border-[#1B3A6B] bg-blue-50/50 shadow-xs'
                    : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#1B3A6B]" />
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#111827]">
                      Home Delivery (Umarzai)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1B3A6B]">
                    {cartTotals.isFreeDelivery ? 'FREE' : formatPKR(shopSettings.deliveryCharge)}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                  Doorstep delivery across Umarzai &amp; surrounding areas.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details Form */}
          <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3.5">
            <h2 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-2">
              <User className="w-4 h-4 text-[#1B3A6B]" />
              <span>Contact &amp; Shipping Details</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Muhammad Salman Khan"
                  className={`w-full px-3.5 py-2.5 rounded-[12px] border ${
                    formErrors.customerName ? 'border-[#DC2626] bg-red-50' : 'border-[#E5E7EB]'
                  } focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none`}
                />
                {formErrors.customerName && (
                  <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.customerName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    Pakistani Mobile Phone <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03149958963"
                    className={`w-full px-3.5 py-2.5 rounded-[12px] border font-mono ${
                      formErrors.phone ? 'border-[#DC2626] bg-red-50' : 'border-[#E5E7EB]'
                    } focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    WhatsApp Number (for artwork proofs)
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="03149958963"
                    className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#E5E7EB] font-mono focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                  />
                </div>
              </div>

              {deliveryMethod === 'Home Delivery' && (
                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    Complete Umarzai Delivery Address <span className="text-[#DC2626]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House/Shop #, Street / Mohallah near Main Bazar..."
                    className={`w-full px-3.5 py-2.5 rounded-[12px] border ${
                      formErrors.deliveryAddress ? 'border-[#DC2626] bg-red-50' : 'border-[#E5E7EB]'
                    } focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none`}
                  />
                  {formErrors.deliveryAddress && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{formErrors.deliveryAddress}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Special Notes / Delivery Instructions
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g., Urgent requirement, pack in plastic wrapper..."
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-[#1B3A6B] hover:bg-[#264E8C] text-white font-heading font-bold py-3.5 px-5 rounded-[14px] text-sm shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-95 min-h-[52px] mt-2"
            >
              <span>Continue to Payment (Step 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT METHOD */}
      {checkoutStep === 2 && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-3.5">
            <h2 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#1B3A6B]" />
              <span>Choose Payment Method</span>
            </h2>

            <div className="space-y-2.5">
              {deliveryMethod === 'Shop Pickup' ? (
                <label className={`flex items-center justify-between p-3.5 rounded-[16px] border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Shop Pickup' ? 'border-[#1B3A6B] bg-blue-50/50' : 'border-[#E5E7EB]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Shop Pickup'}
                      onChange={() => setPaymentMethod('Cash on Shop Pickup')}
                      className="text-[#1B3A6B] focus:ring-[#1B3A6B] w-4 h-4"
                    />
                    <div>
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#111827] block">
                        Cash on Shop Pickup (Pay at Counter)
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Pay cash when you inspect and collect at Main Bazar Umarzai
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-5 h-5 text-[#16A34A]" />
                </label>
              ) : (
                <label className={`flex items-center justify-between p-3.5 rounded-[16px] border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery' ? 'border-[#1B3A6B] bg-blue-50/50' : 'border-[#E5E7EB]'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="text-[#1B3A6B] focus:ring-[#1B3A6B] w-4 h-4"
                    />
                    <div>
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#111827] block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Pay cash to rider upon doorstep delivery
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-[#1B3A6B]" />
                </label>
              )}

              {/* Online Advance Option */}
              <label className={`flex items-start justify-between p-3.5 rounded-[16px] border-2 cursor-pointer transition-all ${
                paymentMethod === 'JazzCash / EasyPaisa / Bank' ? 'border-[#1B3A6B] bg-blue-50/50' : 'border-[#E5E7EB]'
              }`}>
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'JazzCash / EasyPaisa / Bank'}
                    onChange={() => setPaymentMethod('JazzCash / EasyPaisa / Bank')}
                    className="text-[#1B3A6B] focus:ring-[#1B3A6B] w-4 h-4 mt-1"
                  />
                  <div>
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#111827] block">
                      JazzCash / EasyPaisa / Bank Transfer (Advance)
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Account details shown below. Send screenshot on WhatsApp.
                    </span>

                    {/* Account details revealed ONLY when selected */}
                    {paymentMethod === 'JazzCash / EasyPaisa / Bank' && (
                      <div className="mt-3 p-3 bg-white border border-[#E5E7EB] rounded-[14px] text-xs space-y-1.5 font-mono text-[#111827] shadow-xs">
                        <p>• <strong>JazzCash:</strong> {shopSettings.jazzCashNumber} ({shopSettings.jazzCashTitle})</p>
                        <p>• <strong>EasyPaisa:</strong> {shopSettings.easyPaisaNumber} ({shopSettings.easyPaisaTitle})</p>
                        <p>• <strong>Bank:</strong> {shopSettings.bankName}</p>
                        <p>• <strong>IBAN:</strong> {shopSettings.bankIban}</p>
                      </div>
                    )}
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#FF7A00]" />
              </label>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-[#1B3A6B] hover:bg-[#264E8C] text-white font-heading font-bold py-3.5 px-5 rounded-[14px] text-sm shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-95 min-h-[52px] mt-2"
            >
              <span>Review Order (Step 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {checkoutStep === 3 && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-4">
            <h2 className="font-heading text-sm font-bold text-[#111827]">
              Review &amp; Confirm Order
            </h2>

            {/* Delivery & Customer Info */}
            <div className="bg-[#F6F7FB] border border-[#E5E7EB] rounded-[16px] p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Customer:</span>
                <span className="font-bold text-[#111827]">{customerName} ({phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Delivery:</span>
                <span className="font-bold text-[#1B3A6B]">{deliveryMethod}</span>
              </div>
              {deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Address:</span>
                  <span className="font-medium text-[#111827] max-w-[200px] text-right truncate">{deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Payment:</span>
                <span className="font-bold text-[#111827]">{paymentMethod}</span>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-2 text-xs">
              <span className="font-heading font-bold text-[#111827] block">Items in this Order ({cart.length})</span>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-[#F3F4F6]">
                  <div>
                    <span className="font-semibold text-[#111827]">{item.name}</span>
                    <span className="text-[#6B7280] ml-1">x {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-[#1B3A6B]">{formatPKR(item.calculatedPrice)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs border-t border-[#F3F4F6] pt-3">
              <div className="flex justify-between text-[#6B7280]">
                <span>Items Subtotal:</span>
                <span className="font-mono text-[#111827] font-semibold">{formatPKR(cartTotals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Delivery Charge:</span>
                <span className="font-mono text-[#111827] font-semibold">
                  {cartTotals.deliveryCharge === 0 ? 'FREE' : formatPKR(cartTotals.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-base font-heading font-black text-[#1B3A6B] pt-2 border-t border-[#E5E7EB]">
                <span>Grand Total:</span>
                <span>{formatPKR(cartTotals.total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#FF7A00] hover:bg-[#E56D00] text-[#111827] font-heading font-bold py-4 px-6 rounded-[14px] text-base shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95 min-h-[52px]"
            >
              <Sparkles className="w-5 h-5 text-[#111827]" />
              <span>Place Order Now ({formatPKR(cartTotals.total)})</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL AFTER PLACING ORDER */}
      {placedOrder && (
        <OrderSuccessModal
          order={placedOrder}
          onClose={() => {
            setPlacedOrder(null);
            setCheckoutStep(0);
          }}
        />
      )}
    </div>
  );
};
