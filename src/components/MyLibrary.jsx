import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  BookOpen, 
  DownloadCloud, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  TrendingUp, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { downloadBookPDF } from '../utils/pdfGenerator';

export const MyLibrary = () => {
  const { 
    books, 
    myLibrary, 
    setCurrentReaderBook, 
    setIsSellModalOpen, 
    setActiveTab, 
    settings,
    notify 
  } = useBooks();

  const [libraryTab, setLibraryTab] = useState('purchased'); // 'purchased' | 'creator-listings'

  // Books user owns
  const purchasedBooks = books.filter((b) => myLibrary.includes(b.id));

  // Books user has listed for sale
  const userListings = books.filter((b) => b.sellerId === 'user-self' || !b.isOfficial);

  // Royalty rate
  const royaltyShare = settings?.authorRoyaltyShare || 85;

  // Calculate user author earnings
  const totalCopiesSold = userListings.reduce((sum, b) => sum + (b.downloads || 0), 0);
  const totalGrossSales = userListings.reduce((sum, b) => sum + (b.downloads || 0) * b.price, 0);
  const totalAuthorRoyalty = totalGrossSales * (royaltyShare / 100);

  const handleDownload = (book) => {
    notify(`Generating official PDF for "${book.title}"...`, 'info');
    const ok = downloadBookPDF(book);
    if (ok) {
      notify(`Downloaded "${book.title}.pdf"!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Personal Sovereign Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            My Library & Creator Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access your paid books anytime, download verified PDFs, and track books you are selling.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#11131f] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setLibraryTab('purchased')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              libraryTab === 'purchased'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Purchased Books ({purchasedBooks.length})</span>
          </button>

          <button
            onClick={() => setLibraryTab('creator-listings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              libraryTab === 'creator-listings'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>My Book Listings & Earnings</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Purchased Books */}
      {libraryTab === 'purchased' && (
        <div>
          {purchasedBooks.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl bg-[#0e101a] border border-white/[0.06] max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Books in Library Yet</h3>
              <p className="text-xs text-slate-400 mb-6">
                Explore our catalog, read free sample pages, and purchase books to enjoy lifetime reading and PDF exports.
              </p>
              <button
                onClick={() => setActiveTab('store')}
                className="btn-glow-primary px-6 py-3 rounded-xl text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Browse Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedBooks.map((book) => (
                <div
                  key={book.id}
                  className="rounded-2xl bg-[#0e101a] border border-white/[0.08] hover:border-orange-500/40 p-5 flex flex-col justify-between transition-all group"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded-xl border border-white/[0.1] shadow-md group-hover:scale-102 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-1.5">
                        ✓ Unrestricted
                      </span>
                      <h3 className="text-base font-bold text-white truncate group-hover:text-orange-300 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mb-2">By {book.author}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-400" />
                        <span>{book.totalPages || 310} Pages • DRM-Free</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                    <button
                      onClick={() => setCurrentReaderBook(book)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Online</span>
                    </button>

                    <button
                      onClick={() => handleDownload(book)}
                      title="Download PDF file"
                      className="py-2.5 px-3.5 rounded-xl bg-[#171a28] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 border border-white/[0.1] hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Creator Listings & Royalties */}
      {libraryTab === 'creator-listings' && (
        <div className="space-y-8 animate-fade-in">
          {/* Creator KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08] relative overflow-hidden">
              <div className="text-xs text-slate-400 font-mono">YOUR TOTAL ROYALTIES ({royaltyShare}%)</div>
              <div className="text-3xl font-black text-emerald-400 mt-2 font-mono">
                ${totalAuthorRoyalty.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Automatic payouts processed daily</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08] relative overflow-hidden">
              <div className="text-xs text-slate-400 font-mono">COPIES SOLD / DOWNLOADED</div>
              <div className="text-3xl font-black text-orange-400 mt-2 font-mono">
                {totalCopiesSold}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Across all community reader accounts</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-400 font-mono">ACTIVE BOOKS LISTED</div>
                <div className="text-3xl font-black text-white mt-2 font-mono">
                  {userListings.length}
                </div>
              </div>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="mt-3 py-2 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish Another Book</span>
              </button>
            </div>
          </div>

          {/* User Listings Table / Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Listed Books for Sale</h3>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <span>+ List New Book</span>
              </button>
            </div>

            {userListings.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-[#0e101a] border border-white/[0.06]">
                <p className="text-xs text-slate-400 mb-4">You have not listed any books for sale yet.</p>
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="btn-glow-primary px-5 py-2.5 rounded-xl text-white text-xs font-bold"
                >
                  Start Selling on Lumina
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userListings.map((book) => {
                  const bookSales = book.downloads || 0;
                  const bookRevenue = bookSales * book.price * (royaltyShare / 100);

                  return (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl bg-[#0e101a] border border-white/[0.08] flex items-center gap-4 justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-14 h-18 object-cover rounded-lg border border-white/[0.1]"
                        />
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                          <h4 className="text-sm font-bold text-white truncate max-w-[200px] mt-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-400">${book.price.toFixed(2)} / copy</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          +${bookRevenue.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">{bookSales} sales</div>
                        <button
                          onClick={() => setCurrentReaderBook(book)}
                          className="mt-1 text-[11px] text-orange-400 hover:underline"
                        >
                          View Reader
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
