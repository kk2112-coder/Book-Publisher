import React from 'react';
import { useBooks } from '../context/BookContext';
import { 
  Star, 
  BookOpen, 
  ShoppingBag, 
  DownloadCloud, 
  CheckCircle, 
  Lock
} from 'lucide-react';
import { downloadBookPDF } from '../utils/pdfGenerator';

export const BookCard = ({ book }) => {
  const { 
    isBookOwned, 
    setCurrentReaderBook, 
    setCurrentModalBook, 
    addToCart, 
    initiateCheckout,
    notify,
    t 
  } = useBooks();

  const owned = isBookOwned(book.id);

  const handleDownload = (e) => {
    e.stopPropagation();
    if (owned) {
      notify(`Generating PDF for "${book.title}"...`, 'info');
      const success = downloadBookPDF(book);
      if (success) {
        notify(`Downloaded "${book.title}.pdf"!`);
      }
    } else {
      initiateCheckout(book);
    }
  };

  return (
    <article 
      onClick={() => setCurrentModalBook(book)}
      className="group relative flex flex-col rounded-2xl bg-[#0f111a] border border-white/[0.08] card-3d-hover animate-fade-in-up overflow-hidden cursor-pointer"
      aria-label={`Book card: ${book.title} by ${book.author}`}
    >
      {/* Top Image Banner with Cover */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gradient-to-t from-[#0f111a] to-[#1a1c29]">
        <img
          src={book.coverImage}
          alt={`Cover artwork for ${book.title} by ${book.author}`}
          width="400"
          height="500"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md text-orange-300 border border-orange-500/30">
            {book.category}
          </span>
          {book.isOfficial ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-600/90 backdrop-blur-md text-white">
              Official
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-600/90 backdrop-blur-md text-white">
              Community
            </span>
          )}
        </div>

        {/* Owned Pill */}
        {owned && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/95 text-white flex items-center gap-1 shadow-md shadow-emerald-950">
            <CheckCircle className="w-3 h-3" />
            <span>{t('owned')}</span>
          </div>
        )}

        {/* Floating Quick Action Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentReaderBook(book);
            }}
            className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/40 hover:bg-orange-600 transition-all scale-95 group-hover:scale-100"
            aria-label={`Open reader for ${book.title}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{owned ? t('readFullBook') : t('freePreview')}</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Sample Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-100">{book.rating || 4.9}</span>
              <span className="text-slate-400">({book.reviewsCount || 120})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-orange-300">
              <Lock className="w-3 h-3 text-orange-400" />
              <span>{owned ? 'Unlocked' : `3 Free Pages`}</span>
            </div>
          </div>

          {/* Book Title */}
          <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1 mb-1">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-300 line-clamp-1 mb-3">
            By <span className="text-white font-medium">{book.author}</span>
          </p>

          {/* Short Excerpt */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {book.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white">
                ${book.price.toFixed(2)}
              </span>
              {book.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">DRM-Free PDF + Web</span>
          </div>

          <div className="flex items-center gap-1.5">
            {owned ? (
              <button
                onClick={handleDownload}
                title="Download DRM-Free PDF"
                className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
                aria-label={`Download PDF for ${book.title}`}
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(book);
                }}
                className="p-2 rounded-lg bg-[#181a27] hover:bg-orange-500/20 text-slate-200 hover:text-orange-300 border border-white/[0.1] hover:border-orange-500/40 transition-all cursor-pointer"
                title="Add to Cart"
                aria-label={`Add ${book.title} to cart`}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (owned) {
                  setCurrentReaderBook(book);
                } else {
                  initiateCheckout(book);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                owned
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                  : 'btn-glow-primary text-white'
              }`}
            >
              {owned ? 'Open' : t('buyNow')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
