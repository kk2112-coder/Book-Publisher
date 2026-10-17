import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    setCurrentUser, 
    notify,
    t 
  } = useBooks();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reader & Author');

  if (!isAuthModalOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const userObj = {
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      role: role
    };

    setCurrentUser(userObj);
    localStorage.setItem('lumina_user_v1', JSON.stringify(userObj));
    notify(isRegister ? 'Account created successfully!' : 'Signed in successfully!');
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lumina_user_v1');
    notify('Logged out from Lumina Press.', 'info');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#0d0f18] border border-orange-500/30 p-6 sm:p-8 text-white shadow-2xl shadow-orange-950/40"
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Profile Overview */
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-orange-500 shadow-xl shadow-orange-500/20">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {currentUser.role}
              </span>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Register Form */
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {isRegister ? t('register') : t('login')}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              {isRegister
                ? 'Join Lumina Press to publish, read, and manage sovereign books.'
                : 'Sign in to access your purchased library and creator royalties.'}
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                />
              </div>

              <div>
                <label htmlFor="auth-pass" className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  id="auth-pass"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                />
              </div>

              {isRegister && (
                <div>
                  <label htmlFor="auth-role" className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Role
                  </label>
                  <select
                    id="auth-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1]"
                  >
                    <option value="Reader & Buyer">Reader & Buyer</option>
                    <option value="Author & Creator">Author & Creator</option>
                    <option value="Publisher Reviewer">Publisher Reviewer</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-glow-primary py-3 rounded-xl text-white font-bold text-xs shadow-lg cursor-pointer mt-2"
              >
                {isRegister ? t('register') : t('login')}
              </button>

              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-orange-400 hover:text-orange-300 underline font-medium"
                >
                  {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
