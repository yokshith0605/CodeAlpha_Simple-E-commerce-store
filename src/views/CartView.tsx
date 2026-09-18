import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotalItems,
    cartSubtotal,
    cartShippingFee,
    cartTax,
    cartTotal,
    setActivePage 
  } = useStore();

  const freeShippingThreshold = 50.00;
  const amountNeededForFreeShipping = Math.max(0, Number((freeShippingThreshold - cartSubtotal).toFixed(2)));
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Electronics': return '📱';
      case 'Clothing': return '👕';
      case 'Books': return '📚';
      case 'Home & Kitchen': return '☕';
      case 'Accessories': return '🎒';
      default: return '📦';
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm space-y-5">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't added any products to your cart yet. Explore our catalog of tech, clothing, books, and home essentials!
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage('products')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-2 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500">
            You have {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} in your session cart.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold self-start sm:self-auto flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Shopping Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Cart Table / Item List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                {amountNeededForFreeShipping === 0 ? (
                  <strong className="text-emerald-600">🎉 You unlocked FREE Standard Shipping!</strong>
                ) : (
                  <span>Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Shipping</strong>!</span>
                )}
              </span>
              <span className="text-slate-400 font-medium">{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => {
              const lineTotal = (item.product.price * item.quantity).toFixed(2);
              const maxStock = item.product.stock;

              return (
                <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  {/* Thumbnail & Product Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl shrink-0">
                      {getCategoryIcon(item.product.categoryName)}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                        {item.product.categoryName}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.product.name}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Unit: ${item.product.price.toFixed(2)}</span>
                        <span>&bull;</span>
                        <span className="text-emerald-700 font-medium">In Stock ({maxStock})</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        ${lineTotal}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActivePage('products')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping for More Items</span>
            </button>
          </div>
        </div>

        {/* Right Col: Order Summary Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartTotalItems} items)</span>
                <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Estimated Shipping</span>
                </span>
                {cartShippingFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-900">${cartShippingFee.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold text-slate-900">${cartTax.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-xl font-black text-blue-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setActivePage('checkout')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow transition-all flex items-center justify-center gap-2"
              id="btnProceedCheckout"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Academic Concurrency Safety</span>
              </div>
              <p>
                Stocks are validated against inventory with atomic isolation prior to order finalization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
