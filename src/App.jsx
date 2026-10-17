import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BookProvider, useBooks } from './context/BookContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BookCatalog } from './components/BookCatalog';
import { CinematicScrollyteller } from './components/CinematicScrollyteller';
import { BookModal } from './components/BookModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { DownloadCloud, Sparkles, X } from 'lucide-react';

// Lazy loaded heavy components to optimize bundle performance
const BookReader = lazy(() => import('./components/BookReader').then(m => ({ default: m.BookReader })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const SellBookModal = lazy(() => import('./components/SellBookModal').then(m => ({ default: m.SellBookModal })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const MyLibrary = lazy(() => import('./components/MyLibrary').then(m => ({ default: m.MyLibrary })));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));

function MainApp() {
  const { activeTab, currentReaderBook, isSellModalOpen, isCheckoutOpen } = useBooks();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  // Catch PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPwaBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col app-root-bg transition-colors duration-300 selection:bg-orange-500 selection:text-white">
      {/* PWA Install Banner */}
      {showPwaBanner && (
        <aside aria-label="App installation banner" className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg z-50">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 animate-bounce" />
            <span>Install Austra Press App for offline reading & fast access</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallPwa}
              className="px-3 py-1 rounded-lg bg-black text-white text-[11px] font-bold hover:bg-zinc-900 cursor-pointer"
            >
              Install App
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="p-1 text-white hover:text-black cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Dynamic View */}
      <main id="main-content" className="flex-1" role="main">
        {activeTab === 'store' && (
          <>
            <Hero />
            <CinematicScrollyteller />
            <BookCatalog />
          </>
        )}

        {activeTab === 'community' && (
          <div className="pt-6">
            <BookCatalog />
          </div>
        )}

        {activeTab === 'library' && (
          <Suspense fallback={<div className="p-12 text-center text-xs text-orange-400">Loading your library...</div>}>
            <MyLibrary />
          </Suspense>
        )}

        {activeTab === 'analytics' && (
          <Suspense fallback={<div className="p-12 text-center text-xs text-orange-400">Loading analytics telemetry...</div>}>
            <AnalyticsDashboard />
          </Suspense>
        )}

        {activeTab === 'admin' && (
          <Suspense fallback={<div className="p-12 text-center text-xs text-orange-400">Loading admin security...</div>}>
            <AdminPanel />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals (Lazy Loaded) */}
      {currentReaderBook && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white text-xs">Opening Book Reader...</div>}>
          <BookReader />
        </Suspense>
      )}

      <BookModal />
      <AuthModal />
      <AdminLoginModal />
      <ContactModal />
      <CartDrawer />

      {isSellModalOpen && (
        <Suspense fallback={null}>
          <SellBookModal />
        </Suspense>
      )}

      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal />
        </Suspense>
      )}
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
