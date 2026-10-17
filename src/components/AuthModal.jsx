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
  Sparkles,
  BookOpen,
  Feather,
  Award
} from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    setCurrentUser, 
    USER_PERSONAS,
    switchPersona,
    userRole,
    notify,
    t,
    setIsAdminLoginModalOpen 
  } = useBooks();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reader & Buyer');

  if (!isAuthModalOpen) return null;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const roleAvatar = role.includes('Author') 
      ? USER_PERSONAS.author.avatar 
      : role.includes('Reviewer') 
      ? USER_PERSONAS.reviewer.avatar 
      : USER_PERSONAS.reader.avatar;

    const roleTitle = role.includes('Author')
      ? 'Independent Author & Creator'
      : role.includes('Reviewer')
      ? 'Senior Literary Critic & ARC Evaluator'
      : 'Avid Reader & Digital Collector';

    const userObj = {
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      avatar: roleAvatar,
      role: role,
      title: roleTitle
    };

    setCurrentUser(userObj);
    localStorage.setItem('austra_user_v1', JSON.stringify(userObj));
    notify(isRegister ? 'Account created successfully!' : 'Signed in successfully!');
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('austra_user_v1');
    notify('Logged out from Austra Press.', 'info');
    setIsAuthModalOpen(false);
  };

  const handleQuickPersonaSelect = (key) => {
    switchPersona(key);
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
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentUser.role}</span>
              </div>
              {currentUser.title && (
                <p className="text-[11px] text-slate-500 mt-1">{currentUser.title}</p>
              )}
            </div>

            {/* Quick Switch Profiles */}
            <div className="pt-3 border-t border-white/[0.08] text-left">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 text-center">
                Switch Active Persona
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect('reader')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    userRole.includes('Reader')
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-[#131622] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                  <span className="block text-[10px] font-bold">Reader</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect('author')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    userRole.includes('Author')
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#131622] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Feather className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <span className="block text-[10px] font-bold">Author</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect('reviewer')}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    userRole.includes('Reviewer')
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-[#131622] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="block text-[10px] font-bold">Reviewer</span>
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
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
            <p className="text-xs text-slate-400 mb-4">
              {isRegister
                ? 'Join Austra Press to publish, read, or review sovereign digital books.'
                : 'Sign in to access your library, creator royalties, or ARC review desk.'}
            </p>

            {/* Quick Demo Sign In Pills */}
            <div className="mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                ⚡ Instant Demo Login As:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect('reader')}
                  className="p-2 rounded-xl bg-[#131622] hover:bg-orange-500/20 border border-white/[0.1] hover:border-orange-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-orange-400 mb-0.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold text-white group-hover:text-orange-300">Reader</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Alex Mercer</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect('author')}
                  className="p-2 rounded-xl bg-[#131622] hover:bg-emerald-500/20 border border-white/[0.1] hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-0.5">
                    <Feather className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold text-white group-hover:text-emerald-300">Author</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Dr. Julian Croft</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersonaSelect('reviewer')}
                  className="p-2 rounded-xl bg-[#131622] hover:bg-amber-500/20 border border-white/[0.1] hover:border-amber-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold text-white group-hover:text-amber-300">Reviewer</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Elena Rostova</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
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
                    Select Your Role & Profile
                  </label>
                  <select
                    id="auth-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1]"
                  >
                    <option value="Reader & Buyer">📖 Reader & Buyer (Library, Previews & Purchases)</option>
                    <option value="Author & Creator">✍️ Author & Creator (85% Royalties, Studio & Payouts)</option>
                    <option value="Reviewer & Critic">🎖️ Reviewer & Critic (ARC Desk, Editorial Badges)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-glow-primary py-3 rounded-xl text-white font-bold text-xs shadow-lg cursor-pointer mt-2"
              >
                {isRegister ? t('register') : t('login')}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-orange-400 hover:text-orange-300 underline font-medium cursor-pointer"
                >
                  {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
                </button>
              </div>

              <div className="pt-3 border-t border-white/[0.08] mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Publisher Staff?</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setIsAdminLoginModalOpen(true);
                  }}
                  className="text-orange-400 hover:text-orange-300 font-semibold underline ml-1 cursor-pointer"
                >
                  Admin Portal Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
