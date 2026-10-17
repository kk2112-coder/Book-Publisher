import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_BOOKS } from '../data/initialBooks';
import { translations } from '../utils/i18n';
import confetti from 'canvas-confetti';

const BookContext = createContext();

const STORAGE_KEYS = {
  BOOKS: 'lumina_books_v1',
  LIBRARY: 'lumina_library_v1',
  ORDERS: 'lumina_orders_v1',
  SETTINGS: 'lumina_settings_v1',
  USER: 'lumina_user_v1',
  THEME: 'lumina_theme_v1',
  LANG: 'lumina_lang_v1'
};

const DEFAULT_SETTINGS = {
  announcementText: '✦ NEW RELEASE: "Inference at the Edge" — Available now in Digital Deluxe with DRM-Free PDF →',
  announcementLink: 'book-1',
  authorRoyaltyShare: 85,
  siteHeadline: 'Publish, Discover & Own Extraordinary Books',
  siteSubheadline: 'Experience next-generation digital publishing. Read interactive sample previews, purchase securely, and download verified high-resolution PDFs directly to your personal library.',
  allowCommunityUploads: true,
  adminPassword: 'admin'
};

export const BookProvider = ({ children }) => {
  // Theme (Dark or Light)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Language
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
    } catch {
      return 'en';
    }
  });

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Sync theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  // Load Books
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  // User Purchased Library
  const [myLibrary, setMyLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      return saved ? JSON.parse(saved) : ['book-1'];
    } catch {
      return ['book-1'];
    }
  });

  // User Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'ORD-8941',
          date: '16 Oct 2026, 14:32',
          items: [{ id: 'book-1', title: 'Inference at the Edge', price: 24.99, author: 'Dr. Elena Vance' }],
          total: 24.99,
          paymentMethod: 'Credit Card (Stripe Verified)',
          customerEmail: 'alex.reader@lumina.io',
          status: 'Completed'
        }
      ];
    } catch {
      return [];
    }
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Current User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : {
        name: 'Alex Mercer',
        email: 'alex.reader@lumina.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Reader & Creator'
      };
    } catch {
      return {
        name: 'Alex Mercer',
        email: 'alex.reader@lumina.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Reader & Creator'
      };
    }
  });

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'community' | 'library' | 'analytics' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Books');
  const [sortBy, setSortBy] = useState('featured');

  // Modals
  const [currentReaderBook, setCurrentReaderBook] = useState(null);
  const [currentModalBook, setCurrentModalBook] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(myLibrary));
  }, [myLibrary]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Toast helper
  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Cart operations
  const addToCart = (book) => {
    if (myLibrary.includes(book.id)) {
      notify(`You already own "${book.title}" in your library!`, 'info');
      return;
    }
    if (cart.some((item) => item.id === book.id)) {
      notify(`"${book.title}" is already in your cart.`, 'info');
      setIsCartOpen(true);
      return;
    }
    setCart((prev) => [...prev, book]);
    notify(`Added "${book.title}" to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
    notify('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const isBookOwned = (bookId) => myLibrary.includes(bookId);

  const initiateCheckout = (book = null) => {
    setCheckoutTarget(book);
    setIsCheckoutOpen(true);
  };

  const completePurchase = (paymentInfo) => {
    const itemsToBuy = checkoutTarget ? [checkoutTarget] : cart;
    if (itemsToBuy.length === 0) return;

    const totalAmount = itemsToBuy.reduce((sum, item) => sum + item.price, 0);
    const newBookIds = itemsToBuy.map((b) => b.id);

    setMyLibrary((prev) => Array.from(new Set([...prev, ...newBookIds])));

    const newOrder = {
      id: paymentInfo?.transactionId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: itemsToBuy.map((b) => ({ id: b.id, title: b.title, price: b.price, author: b.author })),
      total: totalAmount,
      paymentMethod: paymentInfo?.method || 'Credit Card (3D-Secure OTP)',
      customerEmail: paymentInfo?.email || currentUser?.email || 'customer@example.com',
      gateway: paymentInfo?.gateway || 'Lumina SecurePay',
      otpVerified: true,
      status: 'Completed'
    };

    setOrders((prev) => [newOrder, ...prev]);

    setBooks((prev) =>
      prev.map((b) =>
        newBookIds.includes(b.id) ? { ...b, downloads: (b.downloads || 0) + 1 } : b
      )
    );

    if (checkoutTarget) {
      setCart((prev) => prev.filter((i) => i.id !== checkoutTarget.id));
    } else {
      clearCart();
    }

    if (!paymentInfo?.keepModalOpen) {
      setIsCheckoutOpen(false);
      setCheckoutTarget(null);
    }

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff6a00', '#ff9436', '#ffb366', '#ffffff']
      });
    } catch {}

    notify(`Purchase Successful! Unlocked full book & instant PDF download.`);
    return newOrder;
  };

  const uploadUserBook = (newBook) => {
    const bookEntry = {
      ...newBook,
      id: `community-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      downloads: 0,
      isOfficial: false,
      sellerName: currentUser?.name || 'Community Author',
      sellerEmail: currentUser?.email || 'creator@example.com',
      sellerId: 'user-self',
      status: 'approved',
      releaseDate: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      featured: false,
      sampleLimit: 3
    };

    setBooks((prev) => [bookEntry, ...prev]);
    notify(`Congratulations! "${newBook.title}" is published on Lumina Marketplace!`);
  };

  const adminAddBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: `book-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      downloads: 0,
      isOfficial: true,
      status: 'approved',
      releaseDate: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })
    };
    setBooks((prev) => [newBook, ...prev]);
    notify(`Admin successfully published "${bookData.title}"!`);
  };

  const adminUpdateBook = (bookId, updatedFields) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, ...updatedFields } : b))
    );
    notify(`Book updated successfully!`);
  };

  const adminDeleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setCart((prev) => prev.filter((b) => b.id !== bookId));
    setMyLibrary((prev) => prev.filter((id) => id !== bookId));
    notify(`Book deleted from platform.`, 'info');
  };

  const adminApproveBook = (bookId, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
    );
    notify(`Book status set to ${newStatus}.`);
  };

  const updatePublisherSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    notify(`Publisher settings saved!`);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setBooks(INITIAL_BOOKS);
    setMyLibrary(['book-1']);
    setOrders([]);
    setSettings(DEFAULT_SETTINGS);
    setCart([]);
    notify('Reset to default publisher catalog & settings.', 'info');
  };

  const filteredBooks = books.filter((book) => {
    if (book.status === 'rejected') return false;

    if (activeTab === 'community') {
      if (book.isOfficial) return false;
    }

    if (selectedCategory !== 'All Books') {
      if (selectedCategory === 'Community Marketplace') {
        if (book.isOfficial) return false;
      } else if (book.category !== selectedCategory) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title?.toLowerCase().includes(q);
      const matchAuthor = book.author?.toLowerCase().includes(q);
      const matchCategory = book.category?.toLowerCase().includes(q);
      const matchDesc = book.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCategory && !matchDesc) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <BookContext.Provider
      value={{
        books,
        filteredBooks,
        myLibrary,
        orders,
        settings,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        currentReaderBook,
        setCurrentReaderBook,
        currentModalBook,
        setCurrentModalBook,
        isSellModalOpen,
        setIsSellModalOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        checkoutTarget,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isBookOwned,
        initiateCheckout,
        completePurchase,
        uploadUserBook,
        adminAddBook,
        adminUpdateBook,
        adminDeleteBook,
        adminApproveBook,
        updatePublisherSettings,
        resetToDefaults,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        currentUser,
        setCurrentUser,
        toast,
        notify,
        theme,
        setTheme,
        language,
        setLanguage,
        t
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl glass-panel-glow border border-orange-500/40 text-white shadow-2xl animate-fade-in text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
          <span>{toast.message}</span>
        </div>
      )}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBooks must be used within a BookProvider');
  return context;
};
