import React from 'react';
import { useBooks } from '../context/BookContext';
import { BookCard } from './BookCard';
import { INITIAL_CATEGORIES } from '../data/initialBooks';
import { 
  ArrowUpDown, 
  BookOpen, 
  TrendingUp, 
  X,
  Sparkles,
  Feather,
  Award,
  Tag,
  ArrowRight
} from 'lucide-react';

export const BookCatalog = () => {
  const { 
    filteredBooks, 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy, 
    searchQuery, 
    setSearchQuery,
    activeTab,
    setActiveTab,
    setIsSellModalOpen,
    currentUser,
    userRole,
    isReader,
    isAuthor,
    isReviewer,
    t 
  } = useBooks();

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="catalog-heading">
      {/* Dynamic Profile Perk Banner */}
      <div className={`mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r border transition-all ${
        isAuthor
          ? 'from-emerald-950/40 via-[#0e171b] to-black border-emerald-500/30'
          : isReviewer
          ? 'from-amber-950/40 via-[#19150d] to-black border-amber-500/30'
          : 'from-orange-950/40 via-[#16100d] to-black border-orange-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isAuthor 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : isReviewer 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
            }`}>
              {isAuthor ? <Feather className="w-5 h-5" /> : isReviewer ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${
                  isAuthor 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                    : isReviewer 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                    : 'bg-orange-500/10 text-orange-300 border-orange-500/30'
                }`}>
                  {currentUser?.role || userRole}
                </span>
                <span className="text-xs text-slate-400 font-medium">Logged in as {currentUser?.name || 'Guest'}</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-1">
                {isAuthor && "Creator Mode: You keep 85% of book sales. Upload manuscripts directly to the community catalog."}
                {isReviewer && "Editorial Critic Mode: Full ARC preview access unlocked. Review books and award official Critic's Choice stamps."}
                {isReader && "Reader Discovery Mode: Enjoy 3 free sample pages, AI read-aloud TTS narration, and instant watermarked PDF downloads."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthor && (
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>+ Publish Manuscript</span>
              </button>
            )}

            {isReviewer && (
              <button
                onClick={() => setActiveTab('library')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Open Critic Desk</span>
              </button>
            )}

            {isReader && (
              <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.1] px-3 py-1.5 rounded-xl text-[11px] text-orange-300">
                <Tag className="w-3.5 h-3.5 text-orange-400" />
                <span>Use coupon <strong className="text-white font-mono bg-orange-500/30 px-1.5 py-0.5 rounded">AUSTRA20</strong> for 20% off</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>
              {activeTab === 'community' ? 'Community Independent Creators' : 'Curated Publications'}
            </span>
          </div>
          <h2 id="catalog-heading" className="text-3xl font-extrabold text-white tracking-tight">
            {activeTab === 'community' ? t('communityMarket') : t('exploreBooks')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {activeTab === 'community'
              ? 'Books published directly by independent researchers, cyberpunks, and authors. 85% of all proceeds directly fund the creator.'
              : 'Browse high-impact publications. Read 3 free sample pages inside our interactive reader before buying.'}
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Accessible Sort Selector */}
          <div className="flex items-center gap-2 bg-[#10121d] px-3 py-2 rounded-xl border border-white/[0.08] text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-400" />
            <label htmlFor="catalog-sort" className="sr-only">Sort books by</label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              aria-label="Sort books by criteria"
            >
              <option value="featured" className="bg-[#10121d]">Sort: Featured</option>
              <option value="rating" className="bg-[#10121d]">Highest Rated</option>
              <option value="price-low" className="bg-[#10121d]">Price: Low to High</option>
              <option value="price-high" className="bg-[#10121d]">Price: High to Low</option>
              <option value="downloads" className="bg-[#10121d]">Most Downloaded</option>
            </select>
          </div>

          {activeTab === 'community' && (
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="btn-glow-primary px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              aria-label="Publish and sell a new book"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('sellBook')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none" role="tablist" aria-label="Book categories">
        {INITIAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 scale-102'
                : 'bg-[#10121d] text-slate-300 hover:text-white border border-white/[0.06] hover:border-orange-500/30'
            }`}
          >
            {cat === 'All Books' ? t('allBooks') : cat}
          </button>
        ))}
      </div>

      {/* Search active indicator */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
          <span>Search results for: "{searchQuery}" ({filteredBooks.length} found)</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-300 hover:text-white font-bold flex items-center gap-1"
            aria-label="Clear active search"
          >
            <span>Clear Search</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#0c0e18] border border-white/[0.06] max-w-md mx-auto">
          <BookOpen className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Books Match Your Filter</h3>
          <p className="text-xs text-slate-300 mb-4">Try selecting another category or clearing your search term.</p>
          <button
            onClick={() => {
              setSelectedCategory('All Books');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-orange-400"
            aria-label="Reset all search and category filters"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};
