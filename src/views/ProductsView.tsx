import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { 
    categories, 
    products, 
    selectedCategorySlug, 
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery 
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name' | 'stock'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Category match
    if (selectedCategorySlug && product.categoryId !== selectedCategorySlug) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.categoryName.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) {
        return false;
      }
    }

    // In-stock only
    if (inStockOnly && (!product.isAvailable || product.stock <= 0)) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      case 'stock': return b.stock - a.stock;
      case 'featured':
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  const activeCategory = categories.find(c => c.slug === selectedCategorySlug);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {activeCategory ? activeCategory.name : 'All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeCategory ? activeCategory.description : 'Explore our complete catalog with live inventory tracking.'}
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, specs, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            id="productSearchInput"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar: Category Pills & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategorySlug === null
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Products ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            const isSelected = selectedCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(isSelected ? null : cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary controls: In stock toggle & Sort */}
        <div className="flex items-center gap-3 self-end md:self-auto text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span>In-Stock Only</span>
          </label>

          <div className="flex items-center gap-1.5 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured / Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="stock">Highest Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Bar (if any) */}
      {(selectedCategorySlug || searchQuery || inStockOnly) && (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="font-semibold text-slate-700">Active Filters:</span>
          {activeCategory && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
              Category: {activeCategory.name}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-blue-950" 
                onClick={() => setSelectedCategorySlug(null)} 
              />
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
              Search: "{searchQuery}"
              <X 
                className="w-3 h-3 cursor-pointer hover:text-blue-950" 
                onClick={() => setSearchQuery('')} 
              />
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
              In-Stock Only
              <X 
                className="w-3 h-3 cursor-pointer hover:text-emerald-950" 
                onClick={() => setInStockOnly(false)} 
              />
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="ml-auto text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-800">No products match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any products matching your current category filter or search query. Try clearing filters or searching for something else.
          </p>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
