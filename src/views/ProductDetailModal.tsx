import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingCart, Star, Check, Shield, Truck, RotateCcw } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, closeProductDetail, addToCart, products, openProductDetail } = useStore();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const isOutOfStock = !selectedProduct.isAvailable || selectedProduct.stock <= 0;
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock <= 5;

  const relatedProducts = products
    .filter(p => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
    .slice(0, 3);

  const handleIncrement = () => {
    if (quantity < selectedProduct.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const success = addToCart(selectedProduct, quantity);
    if (success) {
      closeProductDetail();
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Store</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">{selectedProduct.categoryName}</span>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{selectedProduct.name}</span>
          </div>

          <button
            onClick={closeProductDetail}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Icon Box */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 h-64 flex flex-col items-center justify-center relative p-6">
              <span className="text-8xl select-none mb-3">
                {getCategoryIcon(selectedProduct.categoryName)}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {selectedProduct.categoryName}
              </span>
              {selectedProduct.badge && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Info & Buying Controls */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {selectedProduct.categoryName}
                  </span>
                  {selectedProduct.rating && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{selectedProduct.rating} / 5.0</span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black text-slate-900">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Only {selectedProduct.stock} left in stock
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {selectedProduct.stock} in stock
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Quantity Selector & Add Button */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Quantity</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-800 min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= selectedProduct.stock || isOutOfStock}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.99]'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} to Cart • $${(selectedProduct.price * quantity).toFixed(2)}`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {selectedProduct.specs && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Key Specifications & Features
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {selectedProduct.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Trust Badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-[11px] text-slate-500 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Free Shipping $50+</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Atomic Inventory Lock</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Instant Test Refund</span>
            </div>
          </div>

          {/* Related items */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                More in {selectedProduct.categoryName}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => openProductDetail(rel)}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="font-semibold text-xs text-slate-900 truncate group-hover:text-blue-600">
                      {rel.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-bold">
                      ${rel.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
