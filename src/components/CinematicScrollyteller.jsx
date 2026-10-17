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
  Sliders, 
  Info, 
  Clock, 
  Coffee, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const FRAMES = [
  '/frames/frame-1.png',
  '/frames/frame-2.png',
  '/frames/frame-3.png',
  '/frames/frame-4.png',
  '/frames/frame-5.png'
];

const FRAME_STORIES = [
  {
    step: '01',
    title: 'The Contemplative Gaze',
    tagline: 'Artisanal Hardcover Heritage',
    narrative: 'In the warm amber stillness of the private library, the human hand reaches out. Before a single word is read, the tactile gravity of physical literature speaks to the reader.',
    quote: '"To hold a book is to hold a preserved fragment of human consciousness."',
    badge: 'Archival Hardcover Binding',
    activeHotspots: ['book', 'cup', 'watch']
  },
  {
    step: '02',
    title: 'The Contact Point',
    tagline: 'Cryptographic Proof of Sovereignty',
    narrative: 'Fingers make contact with debossed gold foil on linen-pressed buckram cloth. Instant cryptographic handshake verifies sovereign ownership without cloud telemetry.',
    quote: '"The hand is not an accessory to the mind; it is its primary instrument of calibration."',
    badge: 'NFC Zero-Knowledge Verified',
    activeHotspots: ['book', 'watch']
  },
  {
    step: '03',
    title: 'The Grasp of Knowledge',
    tagline: 'DRM-Free Freedom & Portability',
    narrative: 'Gripping the spine. High-resolution typography with golden-ratio margins, designed for deep undistracted contemplation and personal offline longevity.',
    quote: '"Literature that can be revoked or altered by a remote server was never truly yours."',
    badge: 'High-Res Typography',
    activeHotspots: ['book']
  },
  {
    step: '04',
    title: 'The Critical Evaluation',
    tagline: 'Advance Review Copy (ARC) Access',
    narrative: 'Unlocking pre-release pages for accredited critics and verified readers. The reader notes margins, evaluates theses, and prepares editorial recognition.',
    quote: '"A book lives through the rigor of its readers and the discerning eye of its critics."',
    badge: "Austra Critic's Choice Stamp",
    activeHotspots: ['book', 'cup']
  },
  {
    step: '05',
    title: 'The Sovereign Horizon',
    tagline: '85% Creator Royalties Forever',
    narrative: 'The manuscript breathes open. Direct author patronage ensures 85% of proceeds flow to Alejandro V. Ramos, preserving independent literary masterworks.',
    quote: '"The digital press of tomorrow restores sovereignty to reader and creator alike."',
    badge: 'Permanent Sovereign Possession',
    activeHotspots: ['book', 'watch']
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1x or 2x
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const animIntervalRef = useRef(null);
  const isReducedMotion = useRef(false);

  // Find "Empire of Vision" in catalog
  const empireBook = books.find(b => b.id === 'book-empire-vision') || books[0];

  // Preload all frames for instant scrubbing
  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let loadedCount = 0;
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAMES.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAMES.length) setImagesLoaded(true);
      };
    });
  }, []);

  // Scroll listener for frame scrub calculation
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isPlaying) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalDist = rect.height - windowHeight;

    if (totalDist <= 0) return;

    // Progress from 0 (when top hits viewport top) to 1 (when bottom leaves)
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalDist));
    setScrollProgress(progress);

    const frameIdx = Math.min(FRAMES.length - 1, Math.floor(progress * FRAMES.length));
    setCurrentFrameIndex(frameIdx);
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-play cinematic loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = playSpeed === 1 ? 1600 : 900;
      animIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % FRAMES.length);
      }, intervalMs);
    } else {
      clearInterval(animIntervalRef.current);
    }

    return () => clearInterval(animIntervalRef.current);
  }, [isPlaying, playSpeed]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const jumpToFrame = (idx) => {
    setIsPlaying(false);
    setCurrentFrameIndex(idx);
    setActiveHotspot(null);
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

  const currentStory = FRAME_STORIES[currentFrameIndex];

  return (
    <section 
      ref={containerRef}
      id="cinematic-showcase"
      className="relative bg-[#07080c] border-y border-white/[0.08] text-white overflow-hidden py-16 sm:py-24"
      aria-label="Cinematic Interactive Book Showcase"
    >
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4 shadow-lg shadow-orange-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Scrollytelling Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            The Tactile Touch of <span className="text-gradient-orange">Sovereignty</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Scroll down or scrub through the timeline to experience the physical and cryptographic rebirth of the printed word with <strong className="text-white">"Empire of Vision"</strong> by Alejandro V. Ramos.
          </p>
        </div>

        {/* Cinematic Stage & Interactive Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Frame Viewer (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              ref={stickyRef}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl shadow-orange-950/50 bg-[#0d0f18] group"
            >
              {/* Stack of Preloaded Frames with Smooth Dissolve */}
              {FRAMES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`Empire of Vision cinematic scene frame ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                    idx === currentFrameIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-102'
                  }`}
                  loading="eager"
                />
              ))}

              {/* Floating Dust Mote Sparkles (CSS Particles Overlay) */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-radial-vignette opacity-40"></div>
              <div className="absolute top-12 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping opacity-60 pointer-events-none"></div>
              <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-orange-400 animate-pulse opacity-75 pointer-events-none"></div>
              <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-yellow-200/50 blur-[0.5px] animate-bounce pointer-events-none"></div>

              {/* Interactive Hotspot Pins on the Canvas */}
              {/* Hotspot 1: Book Cover */}
              <div className="absolute bottom-[28%] left-[45%] z-30">
                <button
                  type="button"
                  onClick={() => setActiveHotspot(activeHotspot === 'book' ? null : 'book')}
                  className="relative flex items-center justify-center p-2 rounded-full bg-orange-500/80 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/50 cursor-pointer transition-transform hover:scale-125"
                  aria-label="Inspect Book Cover"
                >
                  <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></span>
                  <BookOpen className="w-3.5 h-3.5 relative z-10" />
                </button>

                {activeHotspot === 'book' && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-2xl bg-[#0f121d]/95 backdrop-blur-md border border-orange-500/40 text-xs shadow-2xl z-40 animate-fade-in text-left">
                    <p className="font-bold text-white flex items-center gap-1.5 text-orange-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Empire of Vision</span>
                    </p>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Gold-leaf debossed typography on archival European linen. Features full DRM-free personal PDF ownership.
                    </p>
                    <div className="mt-2 pt-2 border-t border-white/[0.1] flex items-center justify-between">
                      <span className="text-[10px] text-orange-300 font-mono font-bold">$26.50 USD</span>
                      <button 
                        onClick={handleReadSample}
                        className="text-[10px] text-white hover:text-orange-400 underline font-semibold"
                      >
                        Read Sample →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hotspot 2: Coffee Cup */}
              <div className="absolute bottom-[35%] right-[22%] z-30">
                <button
                  type="button"
                  onClick={() => setActiveHotspot(activeHotspot === 'cup' ? null : 'cup')}
                  className="relative flex items-center justify-center p-2 rounded-full bg-amber-600/80 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/50 cursor-pointer transition-transform hover:scale-125"
                  aria-label="Inspect Ceramic Coffee Cup"
                >
                  <Coffee className="w-3.5 h-3.5 relative z-10" />
                </button>

                {activeHotspot === 'cup' && (
                  <div className="absolute bottom-full right-0 mb-3 w-56 p-3 rounded-2xl bg-[#0f121d]/95 backdrop-blur-md border border-amber-500/40 text-xs shadow-2xl z-40 animate-fade-in text-left">
                    <p className="font-bold text-amber-400 mb-0.5">Quiet Reading Sanctuary</p>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Engineered for distraction-free, contemplative reading sessions unpolluted by algorithms.
                    </p>
                  </div>
                )}
              </div>

              {/* Hotspot 3: Chronograph Watch */}
              <div className="absolute bottom-[16%] left-[18%] z-30">
                <button
                  type="button"
                  onClick={() => setActiveHotspot(activeHotspot === 'watch' ? null : 'watch')}
                  className="relative flex items-center justify-center p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white shadow-lg border border-white/20 cursor-pointer transition-transform hover:scale-125"
                  aria-label="Inspect Mechanical Watch"
                >
                  <Clock className="w-3.5 h-3.5 relative z-10 text-orange-400" />
                </button>

                {activeHotspot === 'watch' && (
                  <div className="absolute bottom-full left-0 mb-3 w-56 p-3 rounded-2xl bg-[#0f121d]/95 backdrop-blur-md border border-white/20 text-xs shadow-2xl z-40 animate-fade-in text-left">
                    <p className="font-bold text-white mb-0.5">Permanent Sovereignty</p>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Your books belong to you for eternity. No expiry dates, no recurring monthly rental fees.
                    </p>
                  </div>
                )}
              </div>

              {/* Timecode & Frame Indicator Pill (Top Left) */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="font-bold text-orange-400">FRAME {currentFrameIndex + 1} / 5</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">{( (currentFrameIndex + 1) * 0.4 ).toFixed(1)}s</span>
              </div>

              {/* Hotspot hint pill (Top Right) */}
              <div className="absolute top-4 right-4 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 text-[11px]">
                <Info className="w-3.5 h-3.5 text-orange-400" />
                <span>Tap glowing nodes on desk</span>
              </div>
            </div>

            {/* Interactive Timeline & Scrubber Bar */}
            <div className="w-full mt-5 p-4 rounded-2xl bg-[#10131f] border border-white/[0.08] shadow-lg">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 text-xs"
                    aria-label={isPlaying ? "Pause cinematic animation" : "Play cinematic animation"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play Sequence'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => jumpToFrame(0)}
                    className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all cursor-pointer text-xs"
                    title="Rewind to Frame 1"
                    aria-label="Rewind to beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlaySpeed(playSpeed === 1 ? 2 : 1)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-[11px] font-mono cursor-pointer"
                    title="Toggle playback speed"
                  >
                    {playSpeed}x Speed
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400">
                    Scroll down or click milestones
                  </span>
                </div>
              </div>

              {/* 5-Step Segmented Checkpoint Track */}
              <div className="grid grid-cols-5 gap-2">
                {FRAME_STORIES.map((item, idx) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => jumpToFrame(idx)}
                    className={`group relative p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      currentFrameIndex === idx
                        ? 'bg-orange-500/20 border-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-[#0d0f18] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold ${
                        currentFrameIndex === idx ? 'text-orange-400' : 'text-slate-500'
                      }`}>
                        {item.step}
                      </span>
                      {currentFrameIndex === idx && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      )}
                    </div>
                    <p className="text-[10px] font-semibold truncate leading-tight">
                      {item.title.split(' ')[1] || item.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Synchronized Storyline & Book Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            
            {/* Story Card matching Current Frame */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#121524] via-[#0e101a] to-[#0a0c13] border border-orange-500/30 shadow-2xl relative">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  ACT {currentStory.step} OF 05
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentStory.tagline}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {currentStory.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {currentStory.narrative}
              </p>

              <blockquote className="p-3 rounded-2xl bg-black/40 border-l-2 border-orange-500 text-xs italic text-slate-300 mb-5">
                {currentStory.quote}
              </blockquote>

              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-300 font-mono">
                  {currentStory.badge}
                </span>
              </div>

              {/* Book Action Card */}
              <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleReadSample}
                  className="w-full sm:w-auto flex-1 btn-glow-primary py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read 3-Page Sample</span>
                </button>

                <button
                  type="button"
                  onClick={handleInspectModal}
                  className="w-full sm:w-auto p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  title="View full specs"
                >
                  <Eye className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline">Specs</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Purchase Sovereign Copy"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>$26.50</span>
                </button>
              </div>
            </div>

            {/* Quick Metadata Highlights */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#0d0f18] border border-white/[0.06]">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Author</p>
                <p className="text-xs font-bold text-white mt-0.5 truncate">Alejandro V. Ramos</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d0f18] border border-white/[0.06]">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Print Length</p>
                <p className="text-xs font-bold text-white mt-0.5">384 Pages</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#0d0f18] border border-white/[0.06]">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Format</p>
                <p className="text-xs font-bold text-orange-400 mt-0.5 font-mono">DRM-Free PDF</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
