import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Database, ShoppingBag, Layers, Zap } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setActivePage, openProductDetail } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredProducts = products.filter(p => p.badge || p.rating! >= 4.8).slice(0, 6);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-12 animate-in fade-in duration-300">
      {/* Hero Banner matching Django templates/home.html */}
      <section 
        className="hero-banner rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 shadow-xl relative overflow-hidden"
        id="heroBanner"
      >
        <div className="absolute -right-10 -bottom-10 opacity-10 select-none text-[180px] pointer-events-none">
          🛒
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Django MVT Architecture Showcase
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Quality Products with Instant Checkout
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            A complete, robust online shopping experience featuring live inventory checks,
            session-backed shopping cart, customer order history, and full Django admin management.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setActivePage('products');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:translate-x-0.5"
              id="btnExploreProducts"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('about')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-colors"
              id="btnLearnArchitecture"
            >
              View Architecture
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-xs text-slate-500">Explore curated collections with live stock counts</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActivePage('products');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="category-card p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center cursor-pointer"
                id={`catCard-${cat.slug}`}
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-3xl mb-3 transition-colors">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {count} items available
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-xs text-slate-500">Handpicked top-rated items ready for immediate dispatch</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setActivePage('products');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Key Architectural Highlights Card */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-md">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Engineering & System Highlights
          </div>

          <h3 className="text-xl md:text-2xl font-bold">
            Built with Academic Rigor: MVT Patterns & Concurrency Safety
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-blue-400 font-semibold text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4" /> 1. Normalized Relational Models
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Categories, Products, Orders, and OrderItems maintain strict foreign-key integrity with decimal pricing and stock constraints.
              </p>
            </div>

            <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 2. Atomic Stock Locks
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Checkout prevents overselling by simulating Django's <code className="text-emerald-300">transaction.atomic()</code> and <code className="text-emerald-300">select_for_update()</code> row locks.
              </p>
            </div>

            <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="text-amber-400 font-semibold text-sm flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> 3. Session Cart & Admin
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guest cart persistence, customer order histories, and full administrative portal for inventory and fulfillment management.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActivePage('about')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline flex items-center gap-1"
            >
              Read full architecture & entity relationship documentation &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
