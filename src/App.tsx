import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { ProductDetailModal } from './views/ProductDetailModal';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { OrdersView } from './views/OrdersView';
import { OrderDetailView } from './views/OrderDetailView';
import { ProfileView } from './views/ProfileView';
import { AboutView } from './views/AboutView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { activePage } = useStore();

  const renderView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'products':
        return <ProductsView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-success':
        return <OrderSuccessView />;
      case 'orders':
        return <OrdersView />;
      case 'order-detail':
        return <OrderDetailView />;
      case 'profile':
        return <ProfileView />;
      case 'about':
        return <AboutView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      <Header />
      <main className="flex-1 pb-16">
        {renderView()}
      </main>
      <Footer />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
