import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, User, ShieldCheck, Menu, X, BookOpen, Layers } from 'lucide-react';
import { DEMO_USERS } from '../data/initialData';

export const Header: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    cartTotalItems, 
    currentUser, 
    loginAs, 
    logout,
    setSelectedCategorySlug,
    setSearchQuery
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (page: any) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogoClick = () => {
    setSelectedCategorySlug(null);
    setSearchQuery('');
    handleNav('home');
  };

  return (
    <header className="site-header sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="header-container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={handleLogoClick}
          className="brand-logo flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors focus:outline-none"
          id="brandLogo"
        >
          <div className="brand-icon w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm">
            🛒
          </div>
          <div className="flex flex-col text-left">
            <span className="leading-tight">Simple Store</span>
            <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Django MVT Architecture</span>
          </div>
        </button>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1" id="mainNav">
          <button
            onClick={() => handleNav('home')}
            className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activePage === 'home' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="navHome"
          >
            Home
          </button>

          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              handleNav('products');
            }}
            className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activePage === 'products' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="navProducts"
          >
            Products
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activePage === 'about' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="navAbout"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Architecture & MVT</span>
          </button>

          {/* Cart Button with Live Badge */}
          <button
            onClick={() => handleNav('cart')}
            className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
              activePage === 'cart' || activePage === 'checkout'
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="navCart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cartTotalItems > 0 && (
              <span 
                className="nav-cart-badge bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold min-w-[20px] text-center"
                id="cartBadge"
              >
                {cartTotalItems}
              </span>
            )}
          </button>

          {/* My Orders */}
          <button
            onClick={() => handleNav('orders')}
            className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activePage === 'orders' || activePage === 'order-detail'
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="navOrders"
          >
            Orders
          </button>

          {/* Admin link */}
          <button
            onClick={() => handleNav('admin')}
            className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              activePage === 'admin' 
                ? 'text-amber-700 bg-amber-50 font-semibold' 
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50'
            }`}
            id="navAdmin"
            title="Django Admin Simulation"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Admin</span>
          </button>

          {/* User Account / Role Switcher Menu */}
          <div className="relative ml-2">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-medium transition-all"
              id="userAccountBtn"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'Guest'}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Simulate User Role</div>
                </div>

                <button
                  onClick={() => {
                    loginAs(DEMO_USERS[0]);
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    currentUser?.username === 'demo' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">Alex Morgan (demo)</div>
                    <div className="text-[10px] text-slate-400">Regular Customer Account</div>
                  </div>
                  {currentUser?.username === 'demo' && <span className="text-blue-600 font-bold">✓</span>}
                </button>

                <button
                  onClick={() => {
                    loginAs(DEMO_USERS[1]);
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    currentUser?.username === 'admin' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">Staff Admin (admin)</div>
                    <div className="text-[10px] text-slate-400">Full Inventory & Order Control</div>
                  </div>
                  {currentUser?.username === 'admin' && <span className="text-amber-600 font-bold">✓</span>}
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      handleNav('profile');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50"
                  >
                    View Account Details
                  </button>

                  {currentUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50"
                    >
                      Logout to Guest
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        loginAs(DEMO_USERS[0]);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-blue-600 hover:bg-blue-50 font-medium"
                    >
                      Login as Demo User
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => handleNav('cart')}
            className="relative p-2 text-slate-700 hover:text-blue-600"
            id="mobileCartBtn"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartTotalItems > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {cartTotalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
            id="mobileToggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'home' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              handleNav('products');
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'products' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-700'
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              activePage === 'about' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Architecture & MVT</span>
          </button>
          <button
            onClick={() => handleNav('orders')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'orders' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-700'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => handleNav('admin')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
              activePage === 'admin' ? 'text-amber-700 bg-amber-50 font-bold' : 'text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Django Admin Simulation</span>
          </button>
          <button
            onClick={() => handleNav('profile')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePage === 'profile' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-700'
            }`}
          >
            Profile & Settings
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Role: <strong className="text-slate-800">{currentUser ? currentUser.role : 'Guest'}</strong>
            </span>
            <button
              onClick={() => {
                loginAs(currentUser?.role === 'admin' ? DEMO_USERS[0] : DEMO_USERS[1]);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-blue-600 font-semibold underline"
            >
              Switch Role
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
