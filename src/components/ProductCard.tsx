import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openProductDetail } = useStore();

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

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  return (
    <div 
      className="product-card group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
      id={`product-${product.id}`}
    >
      {/* Visual Header / Thumbnail Box */}
      <div 
        onClick={() => openProductDetail(product)}
        className="relative h-44 bg-slate-100 flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-100 group-hover:bg-slate-50 transition-colors"
      >
        <span className="text-6xl select-none transform group-hover:scale-110 transition-transform duration-300">
          {getCategoryIcon(product.categoryName)}
        </span>

        {/* Badges */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Quick View overlay button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openProductDetail(product);
          }}
          className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          title="View Details"
        >
          <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </button>

        {/* Stock pill */}
        <div className="absolute bottom-2 right-2">
          {isOutOfStock ? (
            <span className="bg-rose-100 text-rose-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-rose-200">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-200">
              Only {product.stock} Left!
            </span>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-200">
              {product.stock} In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-blue-600">{product.categoryName}</span>
            {product.rating && (
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3 h-3 fill-amber-400" />
                {product.rating}
              </span>
            )}
          </div>

          <h3 
            onClick={() => openProductDetail(product)}
            className="font-bold text-slate-900 text-base mb-1.5 hover:text-blue-600 cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Card Footer: Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Price</span>
            <span className="text-lg font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95'
            }`}
            id={`addToCart-${product.id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
