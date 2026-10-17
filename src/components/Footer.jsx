import React from 'react';
import { BookOpen, ShieldCheck, DownloadCloud, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useBooks } from '../context/BookContext';

export const Footer = () => {
  const { setActiveTab, setIsSellModalOpen } = useBooks();

  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#07080d] text-slate-400 text-xs">
      {/* Newsletter / CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-orange-950/20 via-[#101320] to-orange-950/20 border border-orange-500/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-[11px] font-mono text-orange-400 uppercase tracking-widest">
                • DIGITAL LITERARY DISPATCH
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Stay Ahead of Breakthrough Publications
              </h3>
              <p className="text-slate-300 text-xs mt-1 max-w-md">
                Get notified of new edge computing architectures, speculative sci-fi, and exclusive sample releases.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full sm:w-72 bg-[#090b12] text-xs text-white px-4 py-3 rounded-xl border border-white/[0.1] focus:outline-none focus:border-orange-500/60"
              />
              <button 
                onClick={() => alert('Thank you for subscribing to Austra Press updates!')}
                className="btn-glow-primary px-5 py-3 rounded-xl text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-white/[0.06]">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/40">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold tracking-wider text-white">AUSTRA PRESS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mb-4">
            Next-generation decentralized publishing protocol. Inspect multi-page previews, read inside interactive browser canvases, and download verified DRM-free PDFs.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified DRM-Free Format</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Explore</h4>
          <ul className="space-y-2 text-slate-300">
            <li><button onClick={() => setActiveTab('store')} className="hover:text-white transition-colors cursor-pointer">Catalog</button></li>
            <li><button onClick={() => setActiveTab('community')} className="hover:text-white transition-colors cursor-pointer">Community Market</button></li>
            <li><button onClick={() => setActiveTab('library')} className="hover:text-white transition-colors cursor-pointer">My Library</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Publishers & Authors</h4>
          <ul className="space-y-2 text-slate-300">
            <li><button onClick={() => setIsSellModalOpen(true)} className="hover:text-orange-400 transition-colors cursor-pointer">Sell Your Book (85% Royalty)</button></li>
            <li><button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors cursor-pointer">Admin Portal</button></li>
            <li><a href="#catalog-section" className="hover:text-white transition-colors cursor-pointer">Sample Excerpts</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Architecture</h4>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li>Edge Reading Cache</li>
            <li>PDF Vector Engine</li>
            <li>Direct Author Splits</li>
            <li>Paywall Mesh</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div>© 2026 AUSTRA PRESS Inc. All rights reserved.</div>
        <div className="flex items-center gap-1">
          <span>Crafted for authors & readers with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
        </div>
      </div>
    </footer>
  );
};
