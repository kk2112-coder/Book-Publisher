import React from 'react';
import { useBooks } from '../context/BookContext';
import { 
  ArrowRight, 
  BookOpen, 
  DownloadCloud, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  FileCheck
} from 'lucide-react';

export const Hero = () => {
  const { 
    settings, 
    books, 
    setCurrentReaderBook, 
    setIsSellModalOpen,
    t 
  } = useBooks();

  const flagshipBook = books.find((b) => b.id === 'book-1') || books[0];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden" aria-labelledby="hero-title">
      {/* Background Ambient Glow Flare (Referenced from Pinterest design) */}
      <div className="absolute top-0 right-1/4 -translate-y-12 w-[550px] h-[350px] bg-gradient-to-bl from-orange-500/25 via-amber-600/10 to-transparent blur-[110px] pointer-events-none rounded-full"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-gradient-to-tr from-orange-600/15 via-red-600/5 to-transparent blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161826]/90 border border-orange-500/30 text-xs font-semibold text-orange-300 shadow-lg shadow-orange-500/10 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span className="text-[11px] tracking-wide uppercase text-slate-300">Decentralized Publisher Protocol</span>
          <span className="text-slate-600">•</span>
          <span className="text-orange-400">Next-Gen Release</span>
        </div>

        {/* Hero Headline */}
        <h1 id="hero-title" className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          {settings.siteHeadline || 'Publish, Discover & Own Extraordinary Books'}
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-9">
          {settings.siteSubheadline || 
            'Read interactive sample previews online, purchase with instant access, and export verified DRM-free PDFs directly to your digital library.'}
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => {
              const catalogElement = document.getElementById('catalog-section');
              if (catalogElement) catalogElement.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-glow-primary px-7 py-3.5 rounded-full text-white text-sm font-bold flex items-center gap-2 group cursor-pointer"
          >
            <span>{t('exploreBooks')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              if (flagshipBook) setCurrentReaderBook(flagshipBook);
            }}
            className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-[#181b2e] text-slate-200 hover:text-white text-sm font-semibold border border-white/[0.12] hover:border-orange-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-black/40"
          >
            <BookOpen className="w-4 h-4 text-orange-400" />
            <span>{t('freePreview')} (Sample Pages)</span>
          </button>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 text-sm font-semibold border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t('sellBook')}</span>
          </button>
        </div>

        {/* Pinterest Reference Interactive Node Diagram */}
        <div className="relative mx-auto max-w-4xl p-6 sm:p-8 rounded-2xl glass-panel-glow border border-orange-500/25 shadow-2xl shadow-orange-950/20">
          <div className="relative z-10 flex flex-col items-center">
            {/* Top Tag */}
            <div className="text-[11px] font-mono tracking-widest uppercase text-slate-300 mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span>LUMINA PUBLISHER ARCHITECTURE MESH</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            </div>

            {/* Nodes Layout */}
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Node 1 */}
              <div className="p-4 rounded-xl bg-[#0b0d17]/80 border border-white/[0.08] hover:border-orange-500/50 transition-all text-left group">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3 text-orange-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-white mb-1">Free 3-Page Sample</h2>
                <p className="text-[11px] text-slate-400 leading-tight">Inspect typography, prose, and chapters before purchase.</p>
              </div>

              {/* Connecting line */}
              <div className="hidden md:flex justify-center items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-orange-500/40 to-orange-500"></div>
              </div>

              {/* Central Core */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#181a29] to-[#0f111d] border-2 border-orange-500/60 shadow-xl shadow-orange-500/20 text-center scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-bold uppercase tracking-wider">
                  Core Engine
                </div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center mb-2.5 text-orange-400">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-sm font-extrabold text-white">LUMINA PROTOCOL</h2>
                <p className="text-[10px] text-orange-300 font-mono mt-0.5">Automated Paywall & PDF</p>
              </div>

              {/* Connecting line */}
              <div className="hidden md:flex justify-center items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-orange-500 to-orange-500/40"></div>
              </div>

              {/* Node 2 */}
              <div className="p-4 rounded-xl bg-[#0b0d17]/80 border border-white/[0.08] hover:border-orange-500/50 transition-all text-left group">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3 text-orange-400 group-hover:scale-110 transition-transform">
                  <DownloadCloud className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-white mb-1">Instant PDF Export</h2>
                <p className="text-[11px] text-slate-400 leading-tight">One-click DRM-free high-res PDF generation for buyers.</p>
              </div>
            </div>

            {/* Bottom 3 Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-6 pt-6 border-t border-white/[0.07]">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Separate Admin Controls</div>
                  <div className="text-[10px] text-slate-400">Total catalogue, approvals & sales control</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Buy & Sell Marketplace</div>
                  <div className="text-[10px] text-slate-400">85% direct creator royalty payouts</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <FileCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Interactive Reader</div>
                  <div className="text-[10px] text-slate-400">Full in-browser reading & font sizing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
