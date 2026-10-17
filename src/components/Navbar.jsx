import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  BookOpen, 
  ShoppingBag, 
  ShieldCheck, 
  PlusCircle, 
  Bookmark, 
  Search, 
  Menu, 
  X, 
  ArrowRight,
  TrendingUp,
  User,
  Sun,
  Moon,
  Globe,
  BarChart3,
  MessageSquare
} from 'lucide-react';

export const Navbar = () => {
  const { 
    settings, 
    cart, 
    myLibrary, 
    setIsCartOpen, 
    activeTab, 
    setActiveTab, 
    setIsSellModalOpen, 
    searchQuery, 
    setSearchQuery,
    books,
    setCurrentReaderBook,
    theme,
    setTheme,
    language,
    setLanguage,
    t,
    currentUser,
    setIsAuthModalOpen,
    setIsContactModalOpen
  } = useBooks();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleAnnouncementClick = () => {
    const featuredBook = books.find(b => b.id === settings.announcementLink) || books[0];
    if (featuredBook) {
      setCurrentReaderBook(featuredBook);
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090d]/90 border-b border-white/[0.08]">
      {/* Top Announcement Bar */}
      {settings.announcementText && (
        <div 
          onClick={handleAnnouncementClick}
          className="cursor-pointer group bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-orange-950/40 border-b border-orange-500/20 py-1.5 px-4 text-xs font-medium text-orange-200/90 text-center flex items-center justify-center gap-2 hover:bg-orange-900/30 transition-all duration-300"
          role="region"
          aria-label="Platform announcement"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
          <span>{settings.announcementText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('store')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 group-hover:scale-105 transition-all">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LUMINA
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono font-semibold border border-orange-500/30">
                PRESS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Digital Publisher & Hub</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'store'
                ? 'text-white bg-white/[0.08] border border-white/[0.12] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {t('exploreBooks')}
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'text-orange-400 bg-orange-500/10 border border-orange-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <span>{t('communityMarket')}</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'text-white bg-white/[0.08] border border-white/[0.12]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-orange-400" />
            <span>{t('myLibrary')}</span>
            {myLibrary.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-orange-400 border border-orange-500/30">
                {myLibrary.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('analytics')}</span>
          </button>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-500/10 transition-all flex items-center gap-1.5 border border-amber-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('sellBook')}</span>
          </button>
        </nav>

        {/* Right Actions: Search, Language, Theme, Auth, Cart, Admin */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Search Bar */}
          <div className="relative hidden xl:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11131c] text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-orange-500/60"
              aria-label="Search catalog"
            />
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300 hover:text-white hover:border-orange-500/40 text-xs font-mono uppercase flex items-center gap-1 cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#0f111a] border border-white/[0.1] shadow-2xl py-1 z-50">
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => {
                      setLanguage(lng.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-white/[0.05] transition-colors ${
                      language === lng.code ? 'text-orange-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {lng.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300 hover:text-white hover:border-orange-500/40 transition-all"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-orange-400" />
            )}
          </button>

          {/* Contact / Help Trigger */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="hidden sm:flex p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300 hover:text-white hover:border-orange-500/40 transition-all"
            aria-label="Customer Contact & Support"
            title="Contact Lumina Support"
          >
            <MessageSquare className="w-4 h-4 text-orange-400" />
          </button>

          {/* User Auth Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300 hover:text-white hover:border-orange-500/40 transition-all flex items-center gap-1.5"
            aria-label="User Account Profile"
            title="Account Management"
          >
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-orange-400" />
            )}
            <span className="hidden sm:inline text-xs font-medium truncate max-w-[70px]">
              {currentUser?.name?.split(' ')[0] || 'Account'}
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300 hover:text-white hover:border-orange-500/40 transition-all"
            aria-label={`View shopping cart with ${cart.length} items`}
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-orange-600/50 animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

          {/* Admin Control Switch */}
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'store' : 'admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              activeTab === 'admin'
                ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30'
                : 'bg-[#12141f] text-slate-300 hover:text-white border-white/[0.1] hover:border-orange-500/40'
            }`}
            aria-label={activeTab === 'admin' ? 'Exit Admin Mode' : 'Open Admin Panel'}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-white' : 'text-orange-400'}`} />
            <span className="hidden sm:inline">{activeTab === 'admin' ? t('exitAdmin') : t('adminPanel')}</span>
            <span className="sm:hidden">Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0c0e17] px-4 py-4 space-y-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141624] text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-white/[0.08]"
              aria-label="Search catalog on mobile"
            />
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <button
              onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'store' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'
              }`}
            >
              {t('exploreBooks')}
            </button>
            <button
              onClick={() => { setActiveTab('community'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'community' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'
              }`}
            >
              {t('communityMarket')}
            </button>
            <button
              onClick={() => { setActiveTab('library'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'library' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'
              }`}
            >
              {t('myLibrary')} ({myLibrary.length})
            </button>
            <button
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                activeTab === 'analytics' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
              }`}
            >
              {t('analytics')}
            </button>
            <button
              onClick={() => { setIsSellModalOpen(true); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10"
            >
              + {t('sellBook')}
            </button>
            <button
              onClick={() => { setIsContactModalOpen(true); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300"
            >
              {t('contactSupport')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
