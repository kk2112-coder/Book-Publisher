import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  DownloadCloud, 
  Lock, 
  Unlock, 
  BookOpen, 
  ShoppingBag, 
  Sparkles,
  Type,
  Sun,
  Moon,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { downloadBookPDF } from '../utils/pdfGenerator';

export const BookReader = () => {
  const { 
    currentReaderBook, 
    setCurrentReaderBook, 
    isBookOwned, 
    initiateCheckout, 
    addToCart,
    notify 
  } = useBooks();

  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState('text-base'); // 'text-sm' | 'text-base' | 'text-lg' | 'text-xl'
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark' | 'sepia' | 'oled'

  if (!currentReaderBook) return null;

  const book = currentReaderBook;
  const owned = isBookOwned(book.id);
  const sampleLimit = book.sampleLimit || 3;

  // Prepare pages
  // If previewPages provided, use them; for owned books, provide chapters as pages
  const previewPages = book.previewPages || [
    `CHAPTER 1\n\n${book.description || 'Welcome to this edition.'}`,
    `CHAPTER 2\n\nDeep exploration into the methodology and core foundations.`,
    `CHAPTER 3\n\nExamining the practical implications across global distributed environments.`
  ];

  // Total pages available in reader
  const availablePages = owned && book.chapters && book.chapters.length > 0
    ? book.chapters.map(ch => `${ch.title.toUpperCase()}\n\n${ch.content}`)
    : [...previewPages, 'LOCKED_PAYWALL'];

  const totalPagesCount = availablePages.length;
  const isPaywallPage = !owned && currentPage >= sampleLimit;

  // Theme styles
  const themeClasses = {
    dark: 'bg-[#0f111a] text-slate-200 border-white/[0.08]',
    sepia: 'bg-[#f4eedb] text-[#2b261f] border-[#d8cfbd]',
    oled: 'bg-[#000000] text-slate-100 border-zinc-800'
  };

  const pageContainerThemes = {
    dark: 'bg-[#141724] text-slate-200 border-white/[0.08] shadow-2xl shadow-black/80',
    sepia: 'bg-[#faf6eb] text-[#2c2720] border-[#e2d8c3] shadow-2xl shadow-amber-950/10',
    oled: 'bg-[#0a0a0c] text-slate-100 border-zinc-800 shadow-2xl shadow-black'
  };

  const handleDownload = () => {
    if (owned) {
      notify(`Generating complete PDF for "${book.title}"...`, 'info');
      const ok = downloadBookPDF(book);
      if (ok) {
        notify(`Successfully downloaded "${book.title}.pdf"!`);
      }
    } else {
      initiateCheckout(book);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl animate-fade-in">
      {/* Reader Top Bar */}
      <div className="w-full h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.1] bg-[#090b12] text-white">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold truncate text-white">{book.title}</h2>
              {owned ? (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Full Access Unlocked</span>
                </span>
              ) : (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Free Preview (3 Pages)</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">By {book.author}</p>
          </div>
        </div>

        {/* Reader Controls: Font, Theme, Download, Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Size Toggle */}
          <div className="hidden sm:flex items-center bg-[#131622] rounded-lg p-0.5 border border-white/[0.08]">
            <button
              onClick={() => setFontSize('text-sm')}
              className={`px-2 py-1 text-xs rounded font-serif ${fontSize === 'text-sm' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('text-base')}
              className={`px-2 py-1 text-xs rounded font-serif font-bold ${fontSize === 'text-base' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Normal text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('text-lg')}
              className={`px-2 py-1 text-xs rounded font-serif font-extrabold ${fontSize === 'text-lg' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Large text"
            >
              A+
            </button>
          </div>

          {/* Theme Selector */}
          <div className="hidden md:flex items-center bg-[#131622] rounded-lg p-0.5 border border-white/[0.08]">
            <button
              onClick={() => setReaderTheme('dark')}
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${readerTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
              title="Dark Theme"
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setReaderTheme('sepia')}
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${readerTheme === 'sepia' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-400'}`}
              title="Warm Sepia Theme"
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span>Sepia</span>
            </button>
            <button
              onClick={() => setReaderTheme('oled')}
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${readerTheme === 'oled' ? 'bg-black text-white border border-zinc-700' : 'text-slate-400'}`}
              title="OLED Pure Black"
            >
              <span>OLED</span>
            </button>
          </div>

          {/* Download PDF button */}
          <button
            onClick={handleDownload}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              owned 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
                : 'btn-glow-primary text-white'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{owned ? 'Download PDF' : `Buy ($${book.price})`}</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Close Reader */}
          <button
            onClick={() => setCurrentReaderBook(null)}
            className="p-1.5 rounded-lg bg-[#141724] hover:bg-slate-800 text-slate-400 hover:text-white border border-white/[0.1] transition-all"
            aria-label="Close reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-center ${themeClasses[readerTheme]}`}>
        <div className={`relative w-full max-w-3xl min-h-[580px] rounded-2xl p-6 sm:p-12 border flex flex-col justify-between transition-colors duration-200 ${pageContainerThemes[readerTheme]}`}>
          {isPaywallPage ? (
            /* Locked Paywall View (User prompt requirement: "users can seeing only some pages of books and then they will pay for the books and they can allow to tdownload the book in pdf") */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 animate-fade-in">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/50">
                  <Lock className="w-9 h-9" />
                </div>
                <div className="absolute -inset-2 rounded-full border border-orange-500/40 animate-ping pointer-events-none"></div>
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                Free Preview Limit Reached
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Unlock the Complete Edition
              </h2>

              <p className="max-w-md text-sm opacity-80 leading-relaxed mb-6">
                You have reached the end of the free sample (Pages 1 to {sampleLimit}). Purchase now to read all remaining chapters ({book.totalPages || 310} pages) and download the DRM-free PDF.
              </p>

              {/* What's included checklist */}
              <div className="w-full max-w-md rounded-xl p-4 bg-black/20 border border-white/[0.08] mb-8 text-left space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unrestricted web reader access across all devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Downloadable, printable PDF formatted with high-res typography</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant permanent addition to your Lumina library</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>85% of payment goes directly to the author</span>
                </div>
              </div>

              {/* Purchase actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                <button
                  onClick={() => initiateCheckout(book)}
                  className="w-full btn-glow-primary py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Now for ${book.price.toFixed(2)}</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(book);
                  }}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ) : (
            /* Open Content View */
            <div key={currentPage} className="flex-1 flex flex-col justify-between animate-page-turn">
              <div>
                {/* Running Header */}
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest opacity-60 pb-4 mb-6 border-b border-current/10 font-mono">
                  <span>{book.title}</span>
                  <span>{book.author}</span>
                </div>

                {/* Page Content Body with Serif Reader Font */}
                <div className={`font-serif leading-relaxed whitespace-pre-line select-text ${fontSize} space-y-4`}>
                  {availablePages[currentPage]}
                </div>
              </div>

              {/* Page Footer */}
              <div className="pt-8 mt-8 border-t border-current/10 flex items-center justify-between text-xs opacity-60 font-mono">
                <span>Lumina Digital Reader</span>
                <span>Page {currentPage + 1} of {owned ? totalPagesCount : sampleLimit}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reader Bottom Navigation Bar */}
      <div className="w-full h-16 px-4 sm:px-6 flex items-center justify-between border-t border-white/[0.1] bg-[#090b12] text-white">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded-lg bg-[#141724] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 border border-white/[0.08] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-orange-400 font-bold">
            Page {currentPage + 1}
          </span>
          <span className="text-slate-500">of</span>
          <span className="font-mono text-slate-300">
            {owned ? totalPagesCount : `${sampleLimit} (Preview)`}
          </span>
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPagesCount - 1, p + 1))}
          disabled={currentPage === totalPagesCount - 1}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
            !owned && currentPage === sampleLimit - 1
              ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-400 animate-pulse'
              : 'bg-[#141724] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none border-white/[0.08]'
          }`}
        >
          <span>{!owned && currentPage === sampleLimit - 1 ? 'Unlock Next' : 'Next Page'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
