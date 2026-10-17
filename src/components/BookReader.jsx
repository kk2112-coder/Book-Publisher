import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Headphones,
  Award,
  Feather,
  Star
} from 'lucide-react';
import { downloadBookPDF } from '../utils/pdfGenerator';

export const BookReader = () => {
  const { 
    currentReaderBook, 
    setCurrentReaderBook, 
    setCurrentModalBook,
    isBookOwned, 
    initiateCheckout, 
    addToCart,
    notify,
    currentUser,
    isReader,
    isAuthor,
    isReviewer
  } = useBooks();

  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState('text-base'); // 'text-sm' | 'text-base' | 'text-lg' | 'text-xl'
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark' | 'sepia' | 'oled'

  // Text-to-Speech (TTS) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1); // 0.8 | 1 | 1.25 | 1.5
  const utteranceRef = useRef(null);

  // Stop speech when reader unmounts or book changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentReaderBook]);

  if (!currentReaderBook) return null;

  const book = currentReaderBook;
  const owned = isBookOwned(book.id);
  const isCreatorOfBook = isAuthor && (book.sellerId === 'user-self' || !book.isOfficial);
  const isArcCriticReviewer = isReviewer;
  const hasFullAccess = owned || isCreatorOfBook || isArcCriticReviewer;
  const sampleLimit = book.sampleLimit || 3;

  // Prepare pages
  const previewPages = book.previewPages || [
    `CHAPTER 1\n\n${book.description || 'Welcome to this edition.'}`,
    `CHAPTER 2\n\nDeep exploration into the methodology and core foundations.`,
    `CHAPTER 3\n\nReal-world applications and future research paradigms.`
  ];

  const availablePages = hasFullAccess && book.chapters && book.chapters.length > 0
    ? book.chapters.map(ch => `${ch.title.toUpperCase()}\n\n${ch.content}`)
    : hasFullAccess
    ? [
        ...previewPages,
        `CHAPTER 4: CRITICAL EVALUATION EXCLUSIVE\n\nAdvance reading copy privileged chapter for certified reviewers and creators. Analyzing systemic implementation across global architectures.`
      ]
    : [...previewPages, 'LOCKED_PAYWALL'];

  const totalPagesCount = availablePages.length;
  const isPaywallPage = !hasFullAccess && currentPage >= sampleLimit;

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

  // Text to Speech Controls
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      notify('Text-to-Speech is not supported by your current browser.', 'error');
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      notify('Audio narration paused');
      return;
    }

    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      notify('Resuming audio narration');
      return;
    }

    // Start fresh speech for current page text
    window.speechSynthesis.cancel();
    const textToRead = isPaywallPage 
      ? 'Preview limit reached. Please purchase the full edition to continue reading.' 
      : availablePages[currentPage] || '';

    if (!textToRead.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      notify('Started AI audio narration');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Change page stops narration to avoid reading wrong page
  const handlePageChange = (newPage) => {
    handleStopSpeech();
    setCurrentPage(newPage);
  };

  const handleDownload = () => {
    if (owned) {
      notify(`Generating complete PDF for "${book.title}"...`, 'info');
      const ok = downloadBookPDF(book, {
        buyerEmail: currentUser?.email || 'alex.reader@austra.io'
      });
      if (ok) {
        notify(`Successfully downloaded "${book.title}_AustraPress.pdf"!`);
      }
    } else {
      initiateCheckout(book);
    }
  };

  const handleCloseReader = () => {
    handleStopSpeech();
    setCurrentReaderBook(null);
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
              {isArcCriticReviewer ? (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>ARC Evaluator Copy</span>
                </span>
              ) : isCreatorOfBook ? (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <Feather className="w-3 h-3 text-emerald-400" />
                  <span>Author Manuscript Mode</span>
                </span>
              ) : owned ? (
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

        {/* Reader Controls: Font, Theme, Audiobook Player, Download, Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Narration / TTS Player Bar */}
          <div className="flex items-center bg-[#131622] rounded-xl px-2 py-1 border border-white/[0.08] gap-1.5 shadow-sm">
            <button
              onClick={handleToggleSpeech}
              className={`p-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isSpeaking && !isPaused
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 animate-pulse'
                  : 'text-orange-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              title={isSpeaking ? (isPaused ? 'Resume Narration' : 'Pause Narration') : 'Listen to this page with AI Read-Aloud'}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">
                {isSpeaking ? (isPaused ? 'Resume' : 'Playing') : 'Listen'}
              </span>
              {isSpeaking && !isPaused && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-white animate-bounce"></span>
                  <span className="w-0.5 h-2 bg-white animate-pulse"></span>
                  <span className="w-0.5 h-3 bg-white animate-bounce"></span>
                </div>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
                title="Stop Narration"
              >
                <Square className="w-3 h-3" />
              </button>
            )}

            <select
              value={speechRate}
              onChange={(e) => {
                const r = parseFloat(e.target.value);
                setSpeechRate(r);
                if (isSpeaking) {
                  handleStopSpeech();
                  notify(`Narration speed set to ${r}x`);
                }
              }}
              className="hidden lg:block bg-transparent text-[10px] font-mono text-slate-300 border-0 focus:outline-none cursor-pointer pr-1"
              title="Narration Speed"
            >
              <option value="0.8" className="bg-[#131622]">0.8x</option>
              <option value="1" className="bg-[#131622]">1.0x</option>
              <option value="1.25" className="bg-[#131622]">1.25x</option>
              <option value="1.5" className="bg-[#131622]">1.5x</option>
            </select>
          </div>

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
              <span>Sepia</span>
            </button>
            <button
              onClick={() => setReaderTheme('oled')}
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1 ${readerTheme === 'oled' ? 'bg-black text-orange-400 border border-zinc-700' : 'text-slate-400'}`}
              title="OLED Pure Black"
            >
              <span>OLED</span>
            </button>
          </div>

          {/* PDF Download Button */}
          {owned ? (
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download High-Resolution DRM-Free PDF with Watermark"
            >
              <DownloadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          ) : (
            <button
              onClick={() => initiateCheckout(book)}
              className="btn-glow-primary px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
              title={`Purchase full book for $${book.price.toFixed(2)}`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Buy (${book.price.toFixed(2)})</span>
            </button>
          )}

          {/* Reviewer ARC Evaluation CTA */}
          {isArcCriticReviewer && (
            <button
              onClick={() => {
                handleStopSpeech();
                setCurrentReaderBook(null);
                setCurrentModalBook(book);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Publish Editorial Critique for this ARC title"
            >
              <Star className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Write Critique</span>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={handleCloseReader}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label="Exit Reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reader Main Content Canvas */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start transition-colors duration-300 ${themeClasses[readerTheme]}`}>
        <div className={`w-full max-w-3xl rounded-2xl p-6 sm:p-12 transition-all duration-300 border ${pageContainerThemes[readerTheme]}`}>
          {isPaywallPage ? (
            /* Locked Paywall Screen on Page 4+ */
            <div className="text-center py-10 px-4 animate-scale-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 mb-6 shadow-xl shadow-orange-500/20 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                Free Preview Limit Reached
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Unlock the Complete Edition
              </h2>

              <p className="max-w-md mx-auto text-sm opacity-80 leading-relaxed mb-6">
                You have reached the end of the free sample (Pages 1 to {sampleLimit}). Purchase now to read all remaining chapters ({book.totalPages || 310} pages) and download the DRM-free PDF.
              </p>

              {/* What's included checklist */}
              <div className="w-full max-w-md mx-auto rounded-xl p-4 bg-black/20 border border-white/[0.08] mb-8 text-left space-y-2.5 text-xs">
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
                  <span>Instant permanent addition to your Austra library</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>85% of payment goes directly to the author</span>
                </div>
              </div>

              {/* Purchase actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
                <button
                  onClick={() => initiateCheckout(book)}
                  className="w-full btn-glow-primary py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Now for ${book.price.toFixed(2)}</span>
                </button>

                <button
                  onClick={() => addToCart(book)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/[0.1] transition-all cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Page Prose Content with 3D Turn Animation */
            <div key={currentPage} className="animate-page-turn">
              {/* Page Header */}
              <div className="flex items-center justify-between pb-4 border-b border-current/10 opacity-70 text-xs mb-8">
                <span className="font-mono tracking-widest uppercase">{book.category}</span>
                <span className="italic">{book.title}</span>
              </div>

              {/* Page Prose Text */}
              <div className={`font-serif leading-loose whitespace-pre-line tracking-wide ${fontSize}`}>
                {availablePages[currentPage]}
              </div>

              {/* Page Footer */}
              <div className="pt-12 mt-12 border-t border-current/10 flex items-center justify-between text-xs opacity-60 font-mono">
                <span>Austra Digital Reader</span>
                <span>Page {currentPage + 1} of {owned ? totalPagesCount : sampleLimit}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reader Bottom Navigation Bar */}
      <div className="w-full h-16 px-4 sm:px-6 flex items-center justify-between border-t border-white/[0.1] bg-[#090b12] text-white">
        <button
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded-lg bg-[#141724] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 border border-white/[0.08] transition-all cursor-pointer"
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
          onClick={() => handlePageChange(Math.min(totalPagesCount - 1, currentPage + 1))}
          disabled={currentPage === totalPagesCount - 1}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
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
