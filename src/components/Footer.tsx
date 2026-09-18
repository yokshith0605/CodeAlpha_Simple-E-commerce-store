import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Code, Database, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, setSelectedCategorySlug, setActivePage } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-auto" id="siteFooter">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Store Bio */}
          <div className="footer-col space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">🛒</div>
              <h4 className="text-white font-bold text-lg">Simple Store</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A complete, academic full-stack e-commerce web application inspired by Django's
              Model-View-Template architecture, atomic stock transactions, and normalized schemas.
            </p>
            <div className="flex gap-2 pt-1 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-800 rounded flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-blue-400" /> Normalized SQL
              </span>
              <span className="px-2 py-1 bg-slate-800 rounded flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Atomic Locks
              </span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="footer-col">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
            <ul className="footer-links space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  onClick={() => { setActivePage('home'); window.scrollTo(0,0); }}
                  className="hover:text-white transition-colors"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedCategorySlug(null); setActivePage('products'); window.scrollTo(0,0); }}
                  className="hover:text-white transition-colors"
                >
                  All Products Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('cart'); window.scrollTo(0,0); }}
                  className="hover:text-white transition-colors"
                >
                  Shopping Cart & Checkout
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('about'); window.scrollTo(0,0); }}
                  className="hover:text-white transition-colors flex items-center gap-1 text-blue-400"
                >
                  <Code className="w-3.5 h-3.5" /> Project Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-col">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categories</h4>
            <ul className="footer-links space-y-2 text-sm text-slate-400">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Academic Info & Admin */}
          <div className="footer-col space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Academic Simulation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Safe demonstration mode. Real-time client persistence simulates session cart management,
              database records, and concurrency lock controls.
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setActivePage('admin'); window.scrollTo(0,0); }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Open Django Admin Portal &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>&copy; 2026 Simple E-Commerce Store. Built for academic demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Concurrency Safety Verified</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Django MVT Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
