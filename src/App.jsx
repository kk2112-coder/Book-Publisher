import React from 'react';
import { BookProvider, useBooks } from './context/BookContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookCatalog } from './components/BookCatalog';
import { BookReader } from './components/BookReader';
import { BookModal } from './components/BookModal';
import { SellBookModal } from './components/SellBookModal';
import { MyLibrary } from './components/MyLibrary';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

function MainApp() {
  const { activeTab } = useBooks();

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'store' && (
          <>
            <Hero />
            <BookCatalog />
          </>
        )}

        {activeTab === 'community' && (
          <div className="pt-6">
            <BookCatalog />
          </div>
        )}

        {activeTab === 'library' && (
          <MyLibrary />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Overlays & Modals */}
      <BookReader />
      <BookModal />
      <SellBookModal />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export default function App() {
  return (
    <BookProvider>
      <MainApp />
    </BookProvider>
  );
}
