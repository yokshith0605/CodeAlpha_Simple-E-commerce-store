import React from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { Package, ArrowRight, Clock, ShoppingBag } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, openOrderDetail, setActivePage, currentUser } = useStore();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 border-emerald-200 border px-2.5 py-0.5 rounded-full font-bold text-[11px]">Delivered</span>;
      case 'Shipped':
        return <span className="bg-blue-100 text-blue-800 border-blue-200 border px-2.5 py-0.5 rounded-full font-bold text-[11px]">Shipped</span>;
      case 'Processing':
        return <span className="bg-amber-100 text-amber-800 border-amber-200 border px-2.5 py-0.5 rounded-full font-bold text-[11px]">Processing</span>;
      case 'Pending':
        return <span className="bg-purple-100 text-purple-800 border-purple-200 border px-2.5 py-0.5 rounded-full font-bold text-[11px]">Pending</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 border-rose-200 border px-2.5 py-0.5 rounded-full font-bold text-[11px]">Cancelled</span>;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 mb-8 gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Order History</h1>
          <p className="text-xs text-slate-500">
            Track, review, and view receipts for all past transactions.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          Logged in as: <strong className="text-slate-800">{currentUser ? currentUser.firstName : 'Guest'}</strong>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Place an order to see full order tracking, live status updates, and invoice generation.
          </p>
          <button
            onClick={() => setActivePage('products')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div 
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="font-black text-slate-900 text-sm">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items preview snippet */}
                <div className="text-xs text-slate-600 flex flex-wrap gap-2 items-center">
                  <span className="font-semibold text-slate-700">Items:</span>
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-700">
                      {item.productName} ({item.quantity})
                    </span>
                  ))}
                </div>

                {/* Bottom Bar: Action buttons */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-400">
                    Ship to: <strong className="text-slate-700">{order.city}, {order.state}</strong>
                  </span>

                  <button
                    onClick={() => openOrderDetail(order)}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View Order Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
