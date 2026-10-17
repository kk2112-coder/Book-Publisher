import React from 'react';
import { useBooks } from '../context/BookContext';
import { BookCard } from './BookCard';
import { INITIAL_CATEGORIES } from '../data/initialBooks';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  BookOpen, 
  Search, 
  Layers, 
  TrendingUp 
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
    setIsSellModalOpen 
  } = useBooks();

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>
              {activeTab === 'community' ? 'Community Independent Creators' : 'Curated Publications'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {activeTab === 'community' ? 'Community Author Marketplace' : 'Explore Featured Books'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {activeTab === 'community'
              ? 'Books published directly by independent researchers, cyberpunks, and authors. 85% of all proceeds directly fund the creator.'
              : 'Browse high-impact publications. Read 3 free sample pages inside our interactive reader before buying.'}
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-[#10121d] px-3 py-2 rounded-xl border border-white/[0.08] text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#10121d]">Sort by: Featured</option>
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
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sell My Book</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {INITIAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 scale-102'
                : 'bg-[#10121d] text-slate-400 hover:text-white border border-white/[0.06] hover:border-orange-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search active indicator */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
          <span>Search results for: "{searchQuery}"</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-white font-bold"
          >
            Clear Search ✕
          </button>
        </div>
      )}

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#0c0e18] border border-white/[0.06] max-w-md mx-auto">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Books Match Your Filter</h3>
          <p className="text-xs text-slate-400 mb-4">Try selecting another category or clearing your search term.</p>
          <button
            onClick={() => {
              setSelectedCategory('All Books');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-orange-400"
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
