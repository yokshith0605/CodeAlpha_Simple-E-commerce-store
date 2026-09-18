import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, CreditCard, Truck, Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartShippingFee, 
    cartTax, 
    currentUser, 
    placeOrder, 
    setActivePage 
  } = useStore();

  // Form State initialized with logged-in user if available
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || 'Alex',
    lastName: currentUser?.lastName || 'Morgan',
    email: currentUser?.email || 'demo@example.com',
    phone: currentUser?.phone || '+1 (555) 234-5678',
    address: currentUser?.address || '742 Evergreen Terrace',
    city: currentUser?.city || 'Springfield',
    state: currentUser?.state || 'IL',
    postalCode: currentUser?.postalCode || '62704',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'instant_demo' | 'card' | 'cod'>('instant_demo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const finalShipping = shippingMethod === 'express' ? 9.99 : cartShippingFee;
  const finalTotal = Number((cartSubtotal + finalShipping + cartTax).toFixed(2));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handlePrefillDemo = () => {
    setFormData({
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'demo@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
    });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      setFormError('Please fill in all required shipping fields.');
      return;
    }

    setIsProcessing(true);
    setFormError(null);

    // Simulate atomic concurrency lock check and latency (400ms)
    setTimeout(async () => {
      const res = await placeOrder({
        ...formData,
        shippingMethod,
        paymentMethod,
      });

      setIsProcessing(false);
      if (!res.success && res.error) {
        setFormError(res.error);
      }
    }, 450);
  };

  if (cart.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-3">No items to checkout</h2>
        <button
          onClick={() => setActivePage('products')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Checkout</h1>
          <p className="text-xs text-slate-500">
            Complete your order details with atomic inventory reservation.
          </p>
        </div>

        <button
          onClick={() => setActivePage('cart')}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shipping & Payment Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Customer & Shipping Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>1. Shipping Information</span>
              </h2>

              <button
                type="button"
                onClick={handlePrefillDemo}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Auto-fill Alex Morgan (Demo)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Alex"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Morgan"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="alex@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+1 (555) 234-5678"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="742 Evergreen Terrace"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Springfield"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="IL"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Zip / Postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="62704"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Method */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>2. Delivery Speed</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label 
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  shippingMethod === 'standard' 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value="standard"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                  className="mt-0.5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 flex justify-between">
                    <span>Standard Delivery</span>
                    <span>{cartShippingFee === 0 ? 'FREE' : `$${cartShippingFee.toFixed(2)}`}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">3-5 Business Days</p>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  shippingMethod === 'express' 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                  className="mt-0.5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 flex justify-between">
                    <span>Express Priority</span>
                    <span>$9.99</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">1-2 Business Days</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>3. Payment Simulation</span>
            </h2>

            <div className="space-y-2 text-xs">
              <label 
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'instant_demo' 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="instant_demo"
                  checked={paymentMethod === 'instant_demo'}
                  onChange={() => setPaymentMethod('instant_demo')}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900">⚡ Instant Demo Pay (Recommended)</div>
                  <p className="text-slate-500 text-[11px]">Instant automated approval for demonstration testing.</p>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900">💳 Simulated Credit Card (Stripe / AuthNet demo)</div>
                  <p className="text-slate-500 text-[11px]">Simulates test card tokenization & secure gateway checkout.</p>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900">💵 Cash On Delivery (COD)</div>
                  <p className="text-slate-500 text-[11px]">Pay upon physical shipment receipt.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Review & Submit */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Items in Order ({cart.length})
            </h2>

            {/* Item list */}
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
              {cart.map(item => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="truncate mr-2">
                    <span className="font-bold text-slate-800 block truncate">{item.product.name}</span>
                    <span className="text-[11px] text-slate-400">Qty: {item.quantity} &times; ${item.product.price.toFixed(2)}</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-semibold text-slate-900">
                  {finalShipping === 0 ? 'FREE' : `$${finalShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-semibold text-slate-900">${cartTax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Due</span>
                <span className="text-xl font-black text-blue-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              id="btnPlaceOrder"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Locking Inventory & Processing...' : `Place Order • $${finalTotal.toFixed(2)}`}</span>
            </button>

            {/* Atomic safety note */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Django Atomic Transaction</span>
              </div>
              <p className="text-emerald-700 leading-normal">
                Submitting executes <code className="bg-emerald-100 px-1 rounded">transaction.atomic()</code>: product inventory is locked via <code className="bg-emerald-100 px-1 rounded">select_for_update()</code> to guarantee race-condition-free ordering.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
