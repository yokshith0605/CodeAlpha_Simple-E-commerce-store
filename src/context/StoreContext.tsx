import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Category, 
  Product, 
  CartItem, 
  Order, 
  OrderItemRecord,
  UserAccount, 
  ActivePage, 
  ToastMessage,
  OrderStatus 
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, DEMO_USERS } from '../data/initialData';

interface StoreContextType {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentUser: UserAccount | null;
  activePage: ActivePage;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  selectedCategorySlug: string | null;
  searchQuery: string;
  toasts: ToastMessage[];
  
  // Actions
  setActivePage: (page: ActivePage) => void;
  setSelectedCategorySlug: (slug: string | null) => void;
  setSearchQuery: (query: string) => void;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  openOrderDetail: (order: Order) => void;
  
  // Cart operations
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartSubtotal: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;
  
  // Order operations
  placeOrder: (orderData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    shippingMethod: 'standard' | 'express';
    paymentMethod: 'card' | 'cod' | 'instant_demo';
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Auth operations
  loginAs: (user: UserAccount) => void;
  logout: () => void;
  
  // Admin & Inventory operations
  updateProductStock: (productId: number, newStock: number) => void;
  updateProductPrice: (productId: number, newPrice: number) => void;
  toggleProductAvailability: (productId: number) => void;
  addNewProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: number) => void;
  resetAllData: () => void;
  resetToDefaultData: () => void;
  
  // Toast notifications
  addToast: (typeOrText: ToastMessage['type'] | string, textOrType?: string | ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-init-1',
    orderNumber: 'ORD-A97F2B14C0',
    userId: 'user-demo-1',
    userName: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'demo@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    items: [
      {
        productId: 1,
        productName: 'Wireless Headphones',
        categoryName: 'Electronics',
        price: 89.99,
        quantity: 1,
        total: 89.99
      },
      {
        productId: 10,
        productName: 'Python Programming',
        categoryName: 'Books',
        price: 39.99,
        quantity: 1,
        total: 39.99
      }
    ],
    subtotal: 129.98,
    shippingFee: 0.00,
    tax: 10.40,
    totalAmount: 140.38,
    shippingMethod: 'standard',
    paymentMethod: 'card',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-init-2',
    orderNumber: 'ORD-4E81C099D2',
    userId: 'user-demo-1',
    userName: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'demo@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    items: [
      {
        productId: 7,
        productName: 'Casual Hoodie',
        categoryName: 'Clothing',
        price: 49.99,
        quantity: 1,
        total: 49.99
      },
      {
        productId: 14,
        productName: 'Coffee Mug',
        categoryName: 'Home & Kitchen',
        price: 12.99,
        quantity: 2,
        total: 25.98
      }
    ],
    subtotal: 75.97,
    shippingFee: 0.00,
    tax: 6.08,
    totalAmount: 82.05,
    shippingMethod: 'standard',
    paymentMethod: 'instant_demo',
    status: 'Shipped',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Categories (static)
  const categories = INITIAL_CATEGORIES;

  // Products state (persisted)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('store_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state (persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('store_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default seed 1 item into cart for instant preview delight
    const defaultProduct = INITIAL_PRODUCTS[0];
    return [{ product: defaultProduct, quantity: 1 }];
  });

  // Orders state (persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('store_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SEED_ORDERS;
  });

  // User auth state (persisted, default to Alex Morgan demo user for smooth first-run)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('store_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS[0]; // Alex Morgan
  });

  // Routing & navigation state
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('store_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('store_user');
    }
  }, [currentUser]);

  // Toast Helpers
  const addToast = (typeOrText: ToastMessage['type'] | string, textOrType?: string | ToastMessage['type']) => {
    let type: ToastMessage['type'] = 'info';
    let text = '';
    if (['success', 'info', 'warning', 'danger'].includes(typeOrText as string)) {
      type = typeOrText as ToastMessage['type'];
      text = (textOrType as string) || '';
    } else {
      text = (typeOrText as string) || '';
      type = (['success', 'info', 'warning', 'danger'].includes(textOrType as string) 
        ? textOrType 
        : 'info') as ToastMessage['type'];
    }
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart calculations
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = Number(cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2));
  const cartShippingFee = cartSubtotal >= 50 || cartSubtotal === 0 ? 0.00 : 4.99;
  const cartTax = Number((cartSubtotal * 0.08).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartShippingFee + cartTax).toFixed(2));

  // Add to cart with stock validation
  const addToCart = (product: Product, quantity = 1): boolean => {
    // Check latest live stock in products state
    const currentProd = products.find(p => p.id === product.id) || product;
    if (!currentProd.isAvailable || currentProd.stock <= 0) {
      addToast('danger', `Sorry, ${product.name} is currently out of stock.`);
      return false;
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const existingQty = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    const targetQty = existingQty + quantity;

    if (targetQty > currentProd.stock) {
      addToast('warning', `Cannot add ${quantity} more. Only ${currentProd.stock} units available in inventory.`);
      return false;
    }

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = targetQty;
      setCart(updated);
    } else {
      setCart(prev => [...prev, { product: currentProd, quantity }]);
    }

    addToast('success', `Added "${product.name}" (${quantity}) to shopping cart!`);
    return true;
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    const maxStock = product ? product.stock : 999;

    if (quantity > maxStock) {
      addToast('warning', `Requested quantity exceeds available stock (${maxStock} left).`);
      quantity = maxStock;
    }

    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(prev => prev.filter(i => i.product.id !== productId));
    if (item) {
      addToast('info', `Removed "${item.product.name}" from shopping cart.`);
    }
  };

  const clearCart = () => {
    setCart([]);
    addToast('info', 'Shopping cart cleared.');
  };

  // Place order simulating Django transaction.atomic() & select_for_update() row locking
  const placeOrder = async (orderData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    shippingMethod: 'standard' | 'express';
    paymentMethod: 'card' | 'cod' | 'instant_demo';
  }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Shopping cart is empty.' };
    }

    // Atomic Stock Check Verification:
    for (const item of cart) {
      const currentProd = products.find(p => p.id === item.product.id);
      if (!currentProd || currentProd.stock < item.quantity) {
        const remaining = currentProd ? currentProd.stock : 0;
        addToast('danger', `Transaction rollback: "${item.product.name}" has only ${remaining} in stock.`);
        return {
          success: false,
          error: `Insufficient inventory for ${item.product.name}. Transaction rolled back.`
        };
      }
    }

    // Deduct stock safely
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return {
            ...p,
            stock: newStock,
            isAvailable: newStock > 0
          };
        }
        return p;
      });
    });

    const orderItems: OrderItemRecord[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      categoryName: item.product.categoryName,
      price: item.product.price,
      quantity: item.quantity,
      total: Number((item.product.price * item.quantity).toFixed(2))
    }));

    const shippingCost = orderData.shippingMethod === 'express' ? 9.99 : cartShippingFee;
    const finalTotal = Number((cartSubtotal + shippingCost + cartTax).toFixed(2));

    const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${randomHex}`,
      userId: currentUser ? currentUser.id : 'guest-shopper',
      userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : `${orderData.firstName} ${orderData.lastName}`,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      state: orderData.state,
      postalCode: orderData.postalCode,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingFee: shippingCost,
      tax: cartTax,
      totalAmount: finalTotal,
      shippingMethod: orderData.shippingMethod,
      paymentMethod: orderData.paymentMethod,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setSelectedOrder(newOrder);
    setActivePage('order-success');
    addToast('success', `Order #${newOrder.orderNumber} successfully placed!`);

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    }));
    addToast('info', `Order status updated to ${status}`);
  };

  // Auth operations
  const loginAs = (user: UserAccount) => {
    setCurrentUser(user);
    addToast('success', `Logged in as ${user.firstName} ${user.lastName} (${user.role})`);
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('info', 'Logged out successfully.');
  };

  // Admin inventory modifications
  const updateProductStock = (productId: number, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const stockVal = Math.max(0, newStock);
        return { ...p, stock: stockVal, isAvailable: stockVal > 0 };
      }
      return p;
    }));
    addToast('success', `Inventory stock updated for item #${productId}.`);
  };

  const updateProductPrice = (productId: number, newPrice: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, price: Math.max(0.01, Number(newPrice.toFixed(2))) };
      }
      return p;
    }));
    addToast('success', `Price updated for item #${productId}.`);
  };

  const toggleProductAvailability = (productId: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, isAvailable: !p.isAvailable };
      }
      return p;
    }));
  };

  const addNewProduct = (prodData: Omit<Product, 'id' | 'slug'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const slug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      ...prodData,
      id: newId,
      slug
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast('success', `Product "${newProduct.name}" added to catalog.`);
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = {
      ...prodData,
      id: newId
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast('success', `Product "${newProduct.name}" added to catalog.`);
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('info', 'Product removed from catalog.');
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(SEED_ORDERS);
    setCart([{ product: INITIAL_PRODUCTS[0], quantity: 1 }]);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.removeItem('store_products');
    localStorage.removeItem('store_orders');
    localStorage.removeItem('store_cart');
    localStorage.removeItem('store_user');
    addToast('info', 'Database and storage reset to initial sample seed state.');
  };

  const resetToDefaultData = resetAllData;

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setActivePage('order-detail');
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        cart,
        orders,
        currentUser,
        activePage,
        selectedProduct,
        selectedOrder,
        selectedCategorySlug,
        searchQuery,
        toasts,
        setActivePage,
        setSelectedCategorySlug,
        setSearchQuery,
        openProductDetail,
        closeProductDetail,
        openOrderDetail,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalItems,
        cartSubtotal,
        cartShippingFee,
        cartTax,
        cartTotal,
        placeOrder,
        updateOrderStatus,
        loginAs,
        logout,
        updateProductStock,
        updateProductPrice,
        toggleProductAvailability,
        addNewProduct,
        addProduct,
        deleteProduct,
        resetAllData,
        resetToDefaultData,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
