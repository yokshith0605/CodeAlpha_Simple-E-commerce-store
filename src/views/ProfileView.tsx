import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { DEMO_USERS } from '../data/initialData';
import { User, ShieldCheck, RefreshCw, Check, Package, ShoppingBag } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, loginAs, orders, resetToDefaultData, setActivePage } = useStore();
  const [copiedNote, setCopiedNote] = useState(false);

  const customerOrders = orders.filter(o => currentUser ? o.email === currentUser.email : true);
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleReset = () => {
    if (window.confirm('Reset all catalog inventory, sample orders, and shopping cart back to initial seed state?')) {
      resetToDefaultData();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">User Profile & Account</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your account credentials, role simulation, and saved address preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Account Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6 text-center">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            {currentUser?.firstName[0] || 'U'}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User'}
            </h2>
            <p className="text-xs text-slate-500">{currentUser?.email || 'guest@example.com'}</p>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              currentUser?.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Role: {currentUser?.role || 'Guest'}
            </span>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block">Total Orders</span>
              <span className="font-extrabold text-slate-800 text-base">{customerOrders.length}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block">Total Spent</span>
              <span className="font-extrabold text-blue-600 text-base">${totalSpent.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActivePage('orders')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>View Order History</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Role Switcher & Address */}
        <div className="md:col-span-2 space-y-6">
          {/* Role switcher */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Simulate Django User Accounts</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click to switch instant session</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {DEMO_USERS.map(u => {
                const isActive = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => loginAs(u)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isActive 
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{u.firstName} {u.lastName}</span>
                      {isActive && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-slate-500 block text-[11px]">Username: {u.username}</span>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role === 'admin' ? 'Staff Superuser' : 'Standard Customer'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default Shipping Address */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Default Shipping Address on File
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">{currentUser?.firstName} {currentUser?.lastName}</p>
              <p>{currentUser?.address}</p>
              <p>{currentUser?.city}, {currentUser?.state} {currentUser?.postalCode}</p>
              <p className="text-slate-500 pt-1">Phone: {currentUser?.phone}</p>
            </div>
          </div>

          {/* Reset System State */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Restore Default Database Seed</h4>
              <p className="text-xs text-slate-500">
                Resets all stock levels, sample products, and orders back to pristine state.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
