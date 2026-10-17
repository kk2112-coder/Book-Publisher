import React from 'react';
import { useBooks } from '../context/BookContext';
import { 
  ArrowRight, 
  BookOpen, 
  DownloadCloud, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  FileCheck,
  Feather,
  Award,
  CheckCircle2,
  Wallet,
  Star,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const Hero = () => {
  const { 
    settings, 
    books, 
    setCurrentReaderBook, 
    setIsSellModalOpen,
    setActiveTab,
    currentUser,
    isReader,
    isAuthor,
    isReviewer,
    switchPersona,
    t 
  } = useBooks();

  const flagshipBook = books.find((b) => b.id === 'book-1') || books[0];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden" aria-labelledby="hero-title">
      {/* Background Ambient Glow Flare (Referenced from Pinterest design) */}
      <div className={`absolute top-0 right-1/4 -translate-y-12 w-[550px] h-[350px] blur-[110px] pointer-events-none rounded-full transition-all duration-700 ${
        isAuthor 
          ? 'bg-gradient-to-bl from-emerald-500/25 via-teal-600/10 to-transparent' 
          : isReviewer
          ? 'bg-gradient-to-bl from-amber-500/25 via-yellow-600/10 to-transparent'
          : 'bg-gradient-to-bl from-orange-500/25 via-amber-600/10 to-transparent'
      }`}></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-gradient-to-tr from-orange-600/15 via-red-600/5 to-transparent blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Dynamic Role Pill Badge */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-lg mb-4 backdrop-blur-md transition-all ${
          isAuthor
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-emerald-500/15'
            : isReviewer
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-amber-500/15'
            : 'bg-[#161826]/90 border-orange-500/30 text-orange-300 shadow-orange-500/10'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-ping ${
            isAuthor ? 'bg-emerald-400' : isReviewer ? 'bg-amber-400' : 'bg-orange-500'
          }`}></span>
          <span className="text-[11px] tracking-wide uppercase font-mono text-slate-200">
            {isAuthor 
              ? 'Author & Creator Mode Active (85% Royalty)' 
              : isReviewer 
              ? 'Certified Critic Mode Active (Advance Review Copies)' 
              : 'Reader & Buyer Mode Active (DRM-Free Books)'}
          </span>
          <span className="text-slate-600">•</span>
          <span className={`font-semibold ${
            isAuthor ? 'text-emerald-400' : isReviewer ? 'text-amber-400' : 'text-orange-400'
          }`}>
            {currentUser?.name || 'Verified User'}
          </span>
        </div>

        {/* Interactive Persona Quick-Switch Bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex p-1 rounded-2xl bg-[#0f111c] border border-white/[0.08] shadow-xl">
            <button
              type="button"
              onClick={() => switchPersona('reader')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isReader
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reader & Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => switchPersona('author')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAuthor
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Author & Creator</span>
            </button>

            <button
              type="button"
              onClick={() => switchPersona('reviewer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isReviewer
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Reviewer & Critic</span>
            </button>
          </div>
        </div>

        {/* Dynamic Hero Headline */}
        <h1 id="hero-title" className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          {isAuthor ? (
            <>
              Publish Your Vision & <span className="text-emerald-400">Keep 85% Royalties</span>
            </>
          ) : isReviewer ? (
            <>
              Curate Literature with <span className="text-amber-400">Certified Editorial Critique</span>
            </>
          ) : (
            <>
              Publish, Discover & <span className="text-orange-400">Own Extraordinary Books</span>
            </>
          )}
        </h1>

        {/* Dynamic Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-9">
          {isAuthor
            ? 'Publish manuscripts directly without publisher middlemen. Draft chapters, set your own pricing, monitor real-time sales, and withdraw 85% royalties via Stripe or PayPal.'
            : isReviewer
            ? 'Access Advance Review Copies (ARC) across all publications before general release. Publish certified editorial reviews, evaluate typography, and award official Critic\'s Choice stamps.'
            : (settings.siteSubheadline || 'Read interactive sample previews online, listen with AI read-aloud TTS narration, and export verified DRM-free PDFs directly to your personal library.')}
        </p>

        {/* Call-to-Action Buttons Customized per Persona */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {isAuthor ? (
            <>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="btn-glow-primary px-7 py-3.5 rounded-full text-white text-sm font-bold flex items-center gap-2 group cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Feather className="w-4 h-4" />
                <span>+ Publish New Manuscript</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-[#181b2e] text-emerald-300 hover:text-white text-sm font-semibold border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Author Royalties & Payouts</span>
              </button>

              <button
                onClick={() => {
                  const catalogElement = document.getElementById('catalog-section');
                  if (catalogElement) catalogElement.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-white/[0.08] text-slate-300 text-sm font-semibold border border-white/[0.1] transition-all cursor-pointer"
              >
                <span>Browse Store Catalog</span>
              </button>
            </>
          ) : isReviewer ? (
            <>
              <button
                onClick={() => setActiveTab('library')}
                className="btn-glow-primary px-7 py-3.5 rounded-full text-white text-sm font-bold flex items-center gap-2 group cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4" />
                <span>Open Critic Evaluation Desk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  if (flagshipBook) setCurrentReaderBook(flagshipBook);
                }}
                className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-[#181b2e] text-amber-300 hover:text-white text-sm font-semibold border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Star className="w-4 h-4 text-amber-400" />
                <span>Evaluate Advance Review Copy (ARC)</span>
              </button>

              <button
                onClick={() => {
                  const catalogElement = document.getElementById('catalog-section');
                  if (catalogElement) catalogElement.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-white/[0.08] text-slate-300 text-sm font-semibold border border-white/[0.1] transition-all cursor-pointer"
              >
                <span>Browse Catalog</span>
              </button>
            </>
          ) : (
            <>
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
                <span>{t('freePreview')} (3 Free Pages)</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('cinematic-showcase');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 hover:text-white text-sm font-semibold border border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Watch Cinematic Film</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className="px-6 py-3.5 rounded-full bg-[#121422] hover:bg-orange-500/10 text-orange-300 hover:text-orange-200 text-sm font-semibold border border-orange-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-orange-400" />
                <span>My Library & PDFs</span>
              </button>
            </>
          )}
        </div>

        {/* Pinterest Reference Interactive Node Diagram */}
        <div className="relative mx-auto max-w-4xl p-6 sm:p-8 rounded-2xl glass-panel-glow border border-orange-500/25 shadow-2xl shadow-orange-950/20">
          <div className="relative z-10 flex flex-col items-center">
            {/* Top Tag */}
            <div className="text-[11px] font-mono tracking-widest uppercase text-slate-200 mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span>AUSTRA ARCHITECTURE MESH • {isAuthor ? 'CREATOR ENGINE' : isReviewer ? 'CRITIC EVALUATION NETWORK' : 'READER PROTOCOL'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            </div>

            {/* Nodes Layout */}
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Node 1 */}
              <div className="p-4 rounded-xl bg-[#0b0d17]/80 border border-white/[0.08] hover:border-orange-500/50 transition-all text-left group animate-float">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3 text-orange-400 group-hover:scale-110 transition-transform">
                  {isAuthor ? <Feather className="w-4 h-4 text-emerald-400" /> : isReviewer ? <Award className="w-4 h-4 text-amber-400" /> : <BookOpen className="w-4 h-4" />}
                </div>
                <h2 className="text-xs font-bold text-white mb-1">
                  {isAuthor ? 'Manuscript Drafting' : isReviewer ? 'Advance Review Copy (ARC)' : 'Free 3-Page Sample'}
                </h2>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {isAuthor 
                    ? 'Publish chapters directly to readers with customizable pricing.' 
                    : isReviewer
                    ? 'Pre-release critical evaluations with unrestricted chapter preview.'
                    : 'Inspect typography, prose, and chapters before purchase.'}
                </p>
              </div>

              {/* Connecting line */}
              <div className="hidden md:flex justify-center items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-orange-500/40 to-orange-500 animate-pulse"></div>
              </div>

              {/* Central Core */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#181a29] to-[#0f111d] border-2 border-orange-500/60 shadow-xl shadow-orange-500/20 text-center scale-105 transition-transform duration-500 hover:scale-108">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-extrabold uppercase tracking-wider border border-orange-400/50 shadow-sm">
                  {isAuthor ? '85% Royalties' : isReviewer ? 'Critic Guild' : 'Core Engine'}
                </div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center mb-2.5 text-orange-400">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-sm font-extrabold text-white">AUSTRA PROTOCOL</h2>
                <p className="text-[10px] text-orange-300 font-mono mt-0.5">
                  {isAuthor ? 'Automated Creator Split' : isReviewer ? 'Editorial Verification' : 'Automated Paywall & PDF'}
                </p>
              </div>

              {/* Connecting line */}
              <div className="hidden md:flex justify-center items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-orange-500 to-orange-500/40 animate-pulse"></div>
              </div>

              {/* Node 2 */}
              <div className="p-4 rounded-xl bg-[#0b0d17]/80 border border-white/[0.08] hover:border-orange-500/50 transition-all text-left group animate-float-delayed">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3 text-orange-400 group-hover:scale-110 transition-transform">
                  {isAuthor ? <Wallet className="w-4 h-4 text-emerald-400" /> : isReviewer ? <Star className="w-4 h-4 text-amber-400" /> : <DownloadCloud className="w-4 h-4" />}
                </div>
                <h2 className="text-xs font-bold text-white mb-1">
                  {isAuthor ? 'Stripe & PayPal Payouts' : isReviewer ? "Critic's Choice Badges" : 'Instant PDF Export'}
                </h2>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {isAuthor
                    ? 'Daily automated royalty disbursements straight to your account.'
                    : isReviewer
                    ? 'Publish verified editorial reviews with official accreditation.'
                    : 'One-click DRM-free watermarked PDF generation for buyers.'}
                </p>
              </div>
            </div>

            {/* Bottom 3 Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-6 pt-6 border-t border-white/[0.07]">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Role-Based Control Switch</div>
                  <div className="text-[10px] text-slate-400">Readers, Authors & Critics tailored</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Interactive Web Reader</div>
                  <div className="text-[10px] text-slate-400">AI TTS Audio Narration</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                <FileCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">Verified Marketplace</div>
                  <div className="text-[10px] text-slate-400">85% creator splits & 3D-Secure 2.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
