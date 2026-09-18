import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Package, ArrowRight, ShieldCheck, Printer, ShoppingBag } from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { selectedOrder, setActivePage } = useStore();

  if (!selectedOrder) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">No recent order found</h2>
        <button
          onClick={() => setActivePage('products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Products
        </button>
      </div>
    );
  }

  const formattedDate = new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Success Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 text-center space-y-3">
          <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Order Placed Successfully!</h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-md mx-auto">
            Thank you, {selectedOrder.firstName}! Your order has been placed and inventory deducted atomically.
          </p>
          <div className="inline-block bg-black/20 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
            Order Reference: {selectedOrder.orderNumber}
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Order Date</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                {selectedOrder.status}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment</span>
              <span className="font-semibold text-slate-800 capitalize">
                {selectedOrder.paymentMethod.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Total Paid</span>
              <span className="font-extrabold text-blue-600">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block mb-1">Shipping Destination</span>
              <p className="font-medium text-slate-800">{selectedOrder.firstName} {selectedOrder.lastName}</p>
              <p className="text-slate-600">{selectedOrder.address}</p>
              <p className="text-slate-600">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.postalCode}</p>
              <p className="text-slate-500 mt-1">Phone: {selectedOrder.phone}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block mb-1">Fulfillment Details</span>
              <p className="text-slate-600">
                Method: <strong className="text-slate-800 capitalize">{selectedOrder.shippingMethod} Delivery</strong>
              </p>
              <p className="text-slate-600">
                Contact: <strong className="text-slate-800">{selectedOrder.email}</strong>
              </p>
              <p className="text-slate-500 pt-1">
                Estimated Delivery: 2-4 business days via Express ground tracking.
              </p>
            </div>
          </div>

          {/* Items Purchased List */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Purchased Line Items
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <div>
                    <span className="font-bold text-slate-800 block">{item.productName}</span>
                    <span className="text-slate-500">
                      Category: {item.categoryName} &bull; Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">${selectedOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-slate-900">
                {selectedOrder.shippingFee === 0 ? 'FREE' : `$${selectedOrder.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax:</span>
              <span className="font-semibold text-slate-900">${selectedOrder.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Total:</span>
              <span className="text-lg font-black text-blue-600">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Academic confirmation banner */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold block">Persistent Record Created</span>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                This order is stored in client storage and synchronized to the simulated Django SQLite database. You can review tracking under <strong>My Orders</strong> or manage its status in the <strong>Admin Portal</strong>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActivePage('orders')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>View in My Orders</span>
            </button>

            <button
              onClick={() => setActivePage('products')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
