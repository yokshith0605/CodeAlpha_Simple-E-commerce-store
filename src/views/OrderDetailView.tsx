import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderDetailView: React.FC = () => {
  const { selectedOrder, setActivePage } = useStore();

  if (!selectedOrder) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">No order selected</h2>
        <button
          onClick={() => setActivePage('orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Pending', label: 'Order Placed', desc: 'Order received & atomic lock cleared' },
    { status: 'Processing', label: 'Processing', desc: 'Packaged at automated distribution center' },
    { status: 'Shipped', label: 'In Transit', desc: 'Handed over to carrier for delivery' },
    { status: 'Delivered', label: 'Delivered', desc: 'Package dropped off at destination' },
  ];

  const statusOrder: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statusOrder.indexOf(selectedOrder.status);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={() => setActivePage('orders')}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </button>

        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {selectedOrder.orderNumber}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Order {selectedOrder.orderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Current Status: {selectedOrder.status}
            </span>
          </div>
        </div>

        {/* Status Tracker Timeline */}
        {selectedOrder.status !== 'Cancelled' ? (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
              Fulfillment Status Pipeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const isPassed = currentIndex >= idx;
                const isCurrent = currentIndex === idx;

                return (
                  <div key={step.status} className="flex md:flex-col items-center md:items-start gap-3 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isPassed ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>
                        {step.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
            <strong>Order Cancelled:</strong> This transaction was refunded and stock returned to active catalog.
          </div>
        )}

        {/* Address and Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-t border-b border-slate-100 py-6">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 block mb-2 text-sm">Delivery Address</span>
            <p className="font-semibold text-slate-800">{selectedOrder.firstName} {selectedOrder.lastName}</p>
            <p className="text-slate-600">{selectedOrder.address}</p>
            <p className="text-slate-600">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.postalCode}</p>
            <p className="text-slate-500 pt-1">Phone: {selectedOrder.phone}</p>
            <p className="text-slate-500">Email: {selectedOrder.email}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 block mb-2 text-sm">Payment & Shipping</span>
            <p className="text-slate-700">Payment: <strong className="capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</strong></p>
            <p className="text-slate-700">Method: <strong className="capitalize">{selectedOrder.shippingMethod} Delivery</strong></p>
            <p className="text-slate-500 pt-1">Security: Encrypted token representation</p>
          </div>
        </div>

        {/* Line items list */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Ordered Line Items
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800 block text-sm">{item.productName}</span>
                  <span className="text-slate-500">
                    Category: {item.categoryName} &bull; Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                  </span>
                </div>
                <span className="font-black text-slate-900 text-sm">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Calculation */}
        <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900">${selectedOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-semibold text-slate-900">
              {selectedOrder.shippingFee === 0 ? 'FREE' : `$${selectedOrder.shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span className="font-semibold text-slate-900">${selectedOrder.tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
            <span className="font-bold text-slate-900 text-sm">Total Paid:</span>
            <span className="text-lg font-black text-blue-600">${selectedOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
