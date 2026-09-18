export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  rating?: number;
  badge?: string;
  specs?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItemRecord {
  productId: number;
  productName: string;
  categoryName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  items: OrderItemRecord[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'cod' | 'instant_demo';
  status: OrderStatus;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export type ActivePage = 
  | 'home'
  | 'products'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'orders'
  | 'order-detail'
  | 'profile'
  | 'about'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  text: string;
}
