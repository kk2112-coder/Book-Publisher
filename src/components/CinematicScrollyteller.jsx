import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Eye, 
  ShoppingCart, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  ArrowDown,
  Volume2,
  CheckCircle2,
  Award,
  Feather,
  ChevronRight,
  Sliders,
  Layers,
  Info
} from 'lucide-react';

const FRAMES = [
  '/frames/frame-1.png',
  '/frames/frame-2.png',
  '/frames/frame-3.png',
  '/frames/frame-4.png',
  '/frames/frame-5.png'
];

const APPLE_CHAPTERS = [
  {
    index: 0,
    tag: 'AUSTRA PRESS ARCHITECTURE',
    title: 'Tactile Heritage.',
    accentTitle: 'Re-engineered for the digital age.',
    subtitle: 'We believe literature was never meant to be rented from corporate server farms. Austra Press unites the reverent, tactile weight of physical bookbinding with decentralized sovereign reading.',
    metric: '100% Sovereign',
    metricLabel: 'Zero algorithmic telemetry or corporate DRM',
    badge: 'Craft Heritage',
    color: '#f97316'
  },
  {
    index: 1,
    tag: 'PERMANENT OWNERSHIP',
    title: 'Touch the volume.',
    accentTitle: 'Own it for eternity.',
    subtitle: 'Every acquired title delivers an irrevocable digital proof of ownership with personalized watermarked, high-resolution DRM-free PDFs. No expired lending periods, no remote account deletions.',
    metric: 'DRM-Free PDF',
    metricLabel: 'Cryptographically watermarked to your verified account',
    badge: 'Decentralized Library',
    color: '#fb923c'
  },
  {
    index: 2,
    tag: 'NEXT-GEN READER EXPERIENCE',
    title: 'Read with focus.',
    accentTitle: 'Or listen with neural voice.',
    subtitle: 'Sample the first 3 pages of any curated or community manuscript without paying a cent. Switch dynamically to native AI read-aloud text-to-speech, toggle OLED night modes, and adjust typography.',
    metric: '3-Page Preview',
    metricLabel: 'Free sample paywall with Web Speech TTS audio narration',
    badge: 'Interactive OLED Reader',
    color: '#eab308'
  },
  {
    index: 3,
    tag: 'EDITORIAL RIGOR & CRITIQUE',
    title: 'Curated by critics.',
    accentTitle: 'Certified with distinction.',
    subtitle: 'Accredited reviewers evaluate advance review copies (ARCs) before global release. Verified critics publish in-depth literary analyses and award the official "Austra Critic\'s Choice" badge.',
    metric: 'ARC Desk',
    metricLabel: 'Advance Review Copies unlocked for accredited literary critics',
    badge: "Austra Critic's Choice",
    color: '#f59e0b'
  },
  {
    index: 4,
    tag: 'CREATOR EMPOWERMENT',
    title: '85% to the author.',
    accentTitle: 'Direct creator patronage.',
    subtitle: 'We invert traditional publishing economics. Independent authors, researchers, and novelists retain 85% of all gross sales with transparent real-time telemetry and instant withdrawal payouts.',
    metric: '85% Royalties',
    metricLabel: 'Direct payouts via Stripe, PayPal, or Bank Transfer',
    badge: 'Author Sovereign Studio',
    color: '#10b981'
  }
];

export const CinematicScrollyteller = () => {
  const { 
    books, 
    setCurrentReaderBook, 
    setCurrentModalBook, 
    addToCart,
    notify 
  } = useBooks();

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Reference book "Empire of Vision"
  const empireBook = books.find(b => b.id === 'book-empire-vision') || books[0];

  // Preload all 5 frames for instant responsiveness
  useEffect(() => {
    let loaded = 0;
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === FRAMES.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === FRAMES.length) setImagesLoaded(true);
      };
    });
  }, []);

  // Apple-style scroll progress calculation
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const totalDist = rect.height - window.innerHeight;

    if (totalDist <= 0) return;

    // rect.top is 0 when the sticky section first hits the top of viewport
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalDist));
    setScrollProgress(progress);

    if (progress > 0.02) {
      setHasScrolled(true);
    }

    // Determine current frame (0 to 4) smoothly
    const rawIdx = progress * (FRAMES.length - 1);
    const frameIdx = Math.min(FRAMES.length - 1, Math.round(rawIdx));
    setCurrentFrameIndex(frameIdx);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-play cinema mode
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          const next = (prev + 1) % FRAMES.length;
          // Smoothly scroll the page to match frame
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const containerTop = window.scrollY + rect.top;
            const totalDist = rect.height - window.innerHeight;
            const targetY = containerTop + (next / (FRAMES.length - 1)) * totalDist;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
          return next;
        });
      }, 2200);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying]);

  // Jump to specific chapter milestone
  const scrollToChapter = (chapterIndex) => {
    setIsPlaying(false);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalDist = rect.height - window.innerHeight;
    const targetY = containerTop + (chapterIndex / (FRAMES.length - 1)) * totalDist;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleReadSample = () => {
    if (empireBook) {
      setCurrentReaderBook(empireBook);
      notify(`Opening sample preview for "${empireBook.title}"...`);
    }
  };

  const handleInspectModal = () => {
    if (empireBook) {
      setCurrentModalBook(empireBook);
    }
  };

  const handleAddToCart = () => {
    if (empireBook) {
      addToCart(empireBook);
    }
  };

  const currentChapter = APPLE_CHAPTERS[currentFrameIndex];

  return (
    <div 
      ref={containerRef}
      id="cinematic-showcase"
      className="relative w-full h-[450vh] bg-black text-white"
      aria-label="Apple-style Interactive Showcase of Austra Press"
    >
      {/* Pinned Viewport Container (Sticky full screen) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-[#050608]">
        
        {/* Cinematic Background Frame Layers */}
        <div className="absolute inset-0 z-0">
          {FRAMES.map((src, idx) => {
            // Subtle zoom push-in as you scroll through each frame
            const isCurrent = idx === currentFrameIndex;
            return (
              <div
                key={src}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={src}
                  alt={`Austra Press Cinematic Showcase frame ${idx + 1}`}
                  className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 ease-out"
                  loading="eager"
                />
              </div>
            );
          })}

          {/* Apple-style Cinematic Vignette & Ambient Darkness */}
          <div className="absolute inset-0 z-15 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none"></div>
          <div className="absolute inset-0 z-15 bg-radial-vignette opacity-70 pointer-events-none"></div>

          {/* Floating Atmospheric Dust Particles */}
          <div className="absolute top-20 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping opacity-50 pointer-events-none"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-orange-300 blur-[0.5px] animate-pulse opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-yellow-200 animate-bounce opacity-60 pointer-events-none"></div>
        </div>

        {/* Top Header Bar inside Sticky Stage */}
        <header className="relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-xs font-mono text-white shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="font-bold tracking-wider uppercase text-orange-400">AUSTRA SHOWCASE</span>
              <span className="text-white/40">|</span>
              <span className="text-slate-300">SCENE 0{currentFrameIndex + 1} OF 05</span>
            </div>

            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl text-xs font-medium border transition-all cursor-pointer ${
                showHotspots
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30'
                  : 'bg-black/60 text-slate-300 border-white/10 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-orange-400" />
              <span>{showHotspots ? 'Hide Specs' : 'Inspect Details'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-orange-500 backdrop-blur-xl border border-white/10 hover:border-orange-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-lg group"
              aria-label={isPlaying ? "Pause showcase" : "Auto-play showcase"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-orange-400 group-hover:text-white" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={() => {
                const catalog = document.getElementById('catalog-section');
                if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:flex px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/15 text-xs font-semibold text-white transition-all items-center gap-1.5 cursor-pointer"
            >
              <span>Skip to Catalog</span>
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* Interactive Hotspot Annotations on the Scene */}
        {showHotspots && (
          <div className="absolute inset-0 z-25 pointer-events-auto">
            {/* Hotspot: Book */}
            <div className="absolute bottom-[36%] left-[46%] animate-fade-in">
              <div className="relative group">
                <span className="w-4 h-4 rounded-full bg-orange-500 animate-ping absolute inset-0 opacity-75"></span>
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-lg cursor-pointer"></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-orange-500/40 text-xs text-white shadow-2xl">
                  <p className="font-bold text-orange-400 mb-0.5">Empire of Vision</p>
                  <p className="text-[11px] text-slate-300">By Alejandro V. Ramos. Archival hardcover with high-res typography and DRM-free license.</p>
                </div>
              </div>
            </div>

            {/* Hotspot: Watch */}
            <div className="absolute bottom-[22%] left-[20%] animate-fade-in">
              <div className="relative group">
                <span className="w-4 h-4 rounded-full bg-amber-400 animate-ping absolute inset-0 opacity-75"></span>
                <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow-lg cursor-pointer"></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-amber-500/40 text-xs text-white shadow-2xl">
                  <p className="font-bold text-amber-300 mb-0.5">Sovereignty for Life</p>
                  <p className="text-[11px] text-slate-300">Permanent ownership unconstrained by subscriptions or server shutdowns.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Stage: Apple-style Dynamic Narrative Card */}
        <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 w-full my-auto">
          {APPLE_CHAPTERS.map((chap) => {
            const isVisible = chap.index === currentFrameIndex;
            return (
              <div
                key={chap.index}
                className={`transition-all duration-700 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0 pointer-events-auto block' 
                    : 'opacity-0 translate-y-8 pointer-events-none hidden'
                }`}
              >
                <div className="max-w-2xl bg-black/60 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/80">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase mb-4 border"
                    style={{ 
                      backgroundColor: `${chap.color}15`, 
                      borderColor: `${chap.color}40`,
                      color: chap.color 
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{chap.tag}</span>
                  </div>

                  {/* Apple Big Headline */}
                  <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                    {chap.title} <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">
                      {chap.accentTitle}
                    </span>
                  </h2>

                  {/* Subtitle / Website Explanation */}
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                    {chap.subtitle}
                  </p>

                  {/* Metric Highlight Box */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {chap.metric}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {chap.metricLabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/[0.06] text-white shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{chap.badge}</span>
                    </div>
                  </div>

                  {/* Interactive Action Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleReadSample}
                      className="btn-glow-primary px-5 py-3 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read 3-Page Free Sample</span>
                    </button>

                    <button
                      onClick={handleInspectModal}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-orange-400" />
                      <span>View Book Specs</span>
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="px-4 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>$26.50 (Own Edition)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation & Apple-style Timeline Bar */}
        <footer className="relative z-30 max-w-4xl w-full mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
          
          {/* Scroll Down Prompt (Pulsing hint that fades once user begins scrolling) */}
          {!hasScrolled && (
            <div className="flex flex-col items-center justify-center mb-4 text-center animate-bounce">
              <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold mb-1">
                Scroll to discover Austra Press
              </span>
              <ArrowDown className="w-4 h-4 text-orange-400" />
            </div>
          )}

          {/* Minimalist Apple-style Scrub Timeline Pill */}
          <div className="p-3 sm:p-4 rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-2">
            
            {/* Top Row: Milestone Buttons & Status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                {APPLE_CHAPTERS.map((chap) => {
                  const isActive = chap.index === currentFrameIndex;
                  return (
                    <button
                      key={chap.index}
                      onClick={() => scrollToChapter(chap.index)}
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      0{chap.index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Progress indicator */}
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400">
                  {Math.round(scrollProgress * 100)}% EXPLORED
                </span>
              </div>
            </div>

            {/* Apple Scrub Bar Track */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-150 ease-out rounded-full"
                style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
              ></div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};
