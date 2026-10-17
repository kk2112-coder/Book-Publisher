import React, { useState, useEffect, useRef } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight, 
  Sparkles, 
  Key,
  AlertCircle 
} from 'lucide-react';

export const AdminLoginModal = () => {
  const { 
    isAdminLoginModalOpen, 
    setIsAdminLoginModalOpen, 
    settings, 
    setIsAdminAuthenticated, 
    setActiveTab, 
    notify,
    t 
  } = useBooks();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdminLoginModalOpen) {
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAdminLoginModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAdminLoginModalOpen) {
        setIsAdminLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoginModalOpen, setIsAdminLoginModalOpen]);

  if (!isAdminLoginModalOpen) return null;

  const handleAdminAuth = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validPass = settings?.adminPassword || 'admin';
    setTimeout(() => {
      if (password === validPass || password === 'admin') {
        setIsAdminAuthenticated(true);
        setIsAdminLoginModalOpen(false);
        setActiveTab('admin');
        notify('Admin access verified. Welcome to Publisher Command Center!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('Incorrect password. Default access passkey is "admin"');
      }
      setIsLoading(false);
    }, 250);
  };

  const handleQuickDemo = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginModalOpen(false);
    setActiveTab('admin');
    notify('Entered Admin Mode with 1-Click Demo Passkey!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={() => setIsAdminLoginModalOpen(false)}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#0d0f18] border border-orange-500/40 p-6 sm:p-8 text-white shadow-2xl shadow-orange-950/50 animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAdminLoginModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close admin authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/30 border border-orange-500/50 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 id="admin-modal-title" className="text-xl font-extrabold text-white tracking-wide">
              Publisher Admin Portal
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="text-[11px] font-mono text-orange-400 uppercase tracking-wider font-semibold">
                Protected Command Center
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Log in with your administrator key to manage full catalog inventory, book approvals, royalties, pricing, and system analytics.
        </p>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleAdminAuth} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="admin-modal-pass" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-orange-400" />
                <span>Admin Passkey</span>
              </label>
              <span className="text-[11px] font-mono text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                Default: admin
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                id="admin-modal-pass"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter admin password (e.g. admin)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-[#131624] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 border border-white/[0.12] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-glow-primary py-3 rounded-xl text-white font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate Admin Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]"></div>
            </div>
            <span className="relative px-3 bg-[#0d0f18] text-[11px] uppercase tracking-wider text-slate-500 font-mono">
              Quick Test
            </span>
          </div>

          {/* Quick 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1-Click Instant Demo Login (Passkey: admin)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
