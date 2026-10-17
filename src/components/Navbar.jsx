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
  Sparkles,
  ArrowRight,
  TrendingUp,
  User
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
    setCurrentReaderBook
  } = useBooks();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Click announcement banner to view featured book
  const handleAnnouncementClick = () => {
    const featuredBook = books.find(b => b.id === settings.announcementLink) || books[0];
    if (featuredBook) {
      setCurrentReaderBook(featuredBook);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090d]/85 border-b border-white/[0.08]">
      {/* Top Announcement Bar (Referenced directly from Pinterest layout) */}
      {settings.announcementText && (
        <div 
          onClick={handleAnnouncementClick}
          className="cursor-pointer group bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-orange-950/40 border-b border-orange-500/20 py-1.5 px-4 text-xs font-medium text-orange-200/90 text-center flex items-center justify-center gap-2 hover:bg-orange-900/30 transition-all duration-300"
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
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'store'
                ? 'text-white bg-white/[0.08] border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            Explore Books
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'text-orange-400 bg-orange-500/10 border border-orange-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <span>Community Market</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'text-white bg-white/[0.08] border border-white/[0.12]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-orange-400" />
            <span>My Library</span>
            {myLibrary.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-orange-400 border border-orange-500/30">
                {myLibrary.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-amber-300 hover:text-white hover:bg-amber-500/10 transition-all flex items-center gap-1.5 border border-amber-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Sell a Book</span>
          </button>
        </nav>

        {/* Right Actions: Search, Admin Toggle, Cart */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden xl:block w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11131c] text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Admin Control Switch */}
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'store' : 'admin')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              activeTab === 'admin'
                ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30'
                : 'bg-[#12141f] text-slate-300 hover:text-white border-white/[0.1] hover:border-orange-500/40'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-white' : 'text-orange-400'}`} />
            <span>{activeTab === 'admin' ? 'Exit Admin' : 'Admin Panel'}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300 hover:text-white hover:border-orange-500/40 transition-all"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-orange-600/50 animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#12141f] border border-white/[0.1] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0e17] px-4 py-4 space-y-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141624] text-sm text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-white/[0.08]"
            />
          </div>

          <div className="flex flex-col gap-1 pt-2">
            <button
              onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'store' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'
              }`}
            >
              Explore Books
            </button>
            <button
              onClick={() => { setActiveTab('community'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'community' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'
              }`}
            >
              Community Marketplace
            </button>
            <button
              onClick={() => { setActiveTab('library'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'library' ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'
              }`}
            >
              My Library ({myLibrary.length})
            </button>
            <button
              onClick={() => { setIsSellModalOpen(true); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-300 bg-amber-500/10"
            >
              + Sell Your Book
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-orange-400 bg-white/[0.05]"
            >
              Admin Control Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
