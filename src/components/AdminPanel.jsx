import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  ShieldCheck, 
  BookOpen, 
  PlusCircle, 
  DollarSign, 
  Users, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Settings, 
  RefreshCw, 
  ShoppingBag, 
  Star, 
  Eye,
  EyeOff,
  Lock,
  Key,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AdminPanel = () => {
  const { 
    books, 
    orders, 
    settings, 
    adminAddBook, 
    adminUpdateBook, 
    adminDeleteBook, 
    adminApproveBook, 
    updatePublisherSettings, 
    resetToDefaults, 
    setCurrentReaderBook,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    setActiveTab,
    notify 
  } = useBooks();

  const [adminTab, setAdminTab] = useState('inventory'); // 'inventory' | 'submissions' | 'orders' | 'settings'
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // New Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Technology & AI');
  const [newPrice, setNewPrice] = useState('29.00');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
  const [newDesc, setNewDesc] = useState('');
  const [newPages, setNewPages] = useState('320');

  // Platform Analytics Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const platformEarnings = totalRevenue * (1 - (settings?.authorRoyaltyShare || 85) / 100);
  const totalDownloads = books.reduce((sum, b) => sum + (b.downloads || 0), 0);
  const communityBooks = books.filter((b) => !b.isOfficial);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === (settings.adminPassword || 'admin') || passwordInput === 'admin') {
      setIsAdminAuthenticated(true);
      notify('Admin access verified. Welcome to Command Center!');
    } else {
      notify('Invalid Admin Credentials. Try password: admin', 'error');
    }
  };

  const handleCreateBook = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newPrice) {
      alert('Please fill Title, Author and Price');
      return;
    }

    const created = {
      title: newTitle,
      subtitle: newSubtitle,
      author: newAuthor,
      authorRole: 'Official Austra Author',
      category: newCategory,
      price: parseFloat(newPrice) || 25.0,
      coverImage: newCover,
      totalPages: parseInt(newPages, 10) || 300,
      description: newDesc || 'Official publication.',
      featured: true,
      sampleLimit: 3,
      previewPages: [
        `CHAPTER 1: FOUNDATIONS\n\n${newDesc || 'Opening text of the book.'}`,
        `CHAPTER 2: METHODOLOGY\n\nDetailed technical analysis.`,
        `CHAPTER 3: APPLICATIONS\n\nGlobal rollout considerations.`
      ],
      chapters: [
        { id: 1, title: 'Chapter 1: Foundations', content: newDesc || 'Opening chapter.' },
        { id: 2, title: 'Chapter 2: Methodology', content: 'Detailed technical analysis.' },
        { id: 3, title: 'Chapter 3: Applications', content: 'Global rollout considerations.' },
        { id: 4, title: 'Chapter 4: The Next Frontier', content: 'Future vision and conclusions.' }
      ]
    };

    adminAddBook(created);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  // If not authenticated as Admin, show login gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#0e101a] border border-orange-500/30 text-white shadow-2xl shadow-orange-950/40 text-center animate-fade-in">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/30 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-4 shadow-lg shadow-orange-500/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold mb-1 tracking-wide">Publisher Admin Portal</h2>
        <p className="text-xs text-slate-400 mb-6">
          Separate administrative control panel to manage book catalogue, approvals, pricing, and system revenue.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Admin Password (default: admin)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#131622] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-400 border border-white/[0.1] focus:outline-none focus:border-orange-500/80 font-mono text-center"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full btn-glow-primary py-3 rounded-xl text-white font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate Admin Control</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAdminAuthenticated(true);
              notify('Entered Admin Mode with Demo Passkey!');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Quick 1-Click Demo Login (Passkey: admin)</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Master Publisher Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Full Platform Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Full control over official publications, user submissions, pricing, paywalls, and analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-glow-primary px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Official Book</span>
          </button>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white text-xs font-semibold border border-white/[0.08]"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">TOTAL PLATFORM SALES</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">{orders.length} Verified Orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">PLATFORM FEE REVENUE</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
            ${platformEarnings.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">15% net commission</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">TOTAL TITLES CATALOGED</div>
          <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-2 font-mono">
            {books.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{communityBooks.length} Community Books</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">TOTAL READERS & EXPORTS</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
            {totalDownloads}
          </div>
          <div className="text-[11px] text-orange-400 mt-1">PDFs & Digital Unlocks</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-white/[0.08] mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setAdminTab('inventory')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'inventory'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book Inventory & Prices ({books.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('submissions')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'submissions'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Community Submissions ({communityBooks.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'orders'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Audit Logs ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'settings'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Publisher Settings & Banner</span>
        </button>
      </div>

      {/* Tab Content 1: Book Inventory Table */}
      {adminTab === 'inventory' && (
        <div className="rounded-2xl bg-[#0e101a] border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141624] text-slate-400 uppercase font-mono border-b border-white/[0.06]">
                <tr>
                  <th className="p-3.5">Book & Author</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Downloads</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-10 h-14 object-cover rounded border border-white/[0.1] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate max-w-[220px]">{b.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">{b.author}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-medium">{b.category}</td>

                    <td className="p-3.5 font-mono font-bold text-white">
                      ${b.price.toFixed(2)}
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.isOfficial ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {b.isOfficial ? 'Official' : 'Community'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono">{b.downloads || 0}</td>

                    <td className="p-3.5">
                      <button
                        onClick={() => adminUpdateBook(b.id, { featured: !b.featured })}
                        className={`p-1 rounded ${b.featured ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Toggle Featured on Hero"
                      >
                        <Star className={`w-4 h-4 ${b.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCurrentReaderBook(b)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white"
                          title="Preview in Reader"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            const newP = prompt(`Update price for "${b.title}":`, b.price);
                            if (newP !== null && !isNaN(parseFloat(newP))) {
                              adminUpdateBook(b.id, { price: parseFloat(newP) });
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-orange-400"
                          title="Edit Price"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${b.title}"?`)) {
                              adminDeleteBook(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Community Submissions */}
      {adminTab === 'submissions' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Control books uploaded by users. You can inspect sample limits, view content, and approve or reject listings.
          </p>

          {communityBooks.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-[#0e101a] border border-white/[0.06] text-xs text-slate-500">
              No community books submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityBooks.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-[#0e101a] border border-white/[0.08] flex flex-col justify-between">
                  <div className="flex gap-4">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-16 h-24 object-cover rounded-xl border border-white/[0.1]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {b.status?.toUpperCase() || 'APPROVED'}
                        </span>
                        <span className="text-xs font-mono text-orange-400">${b.price.toFixed(2)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{b.title}</h4>
                      <p className="text-xs text-slate-400">By {b.author} ({b.sellerName || 'User'})</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{b.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <button
                      onClick={() => setCurrentReaderBook(b)}
                      className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect 3 Sample Pages</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adminApproveBook(b.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => adminApproveBook(b.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Orders Audit Logs */}
      {adminTab === 'orders' && (
        <div className="rounded-2xl bg-[#0e101a] border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141624] text-slate-400 uppercase font-mono border-b border-white/[0.06]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Customer Email</th>
                  <th className="p-3.5">Items Purchased</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Total Paid</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-mono font-bold text-orange-400">{ord.id}</td>
                    <td className="p-3.5 text-slate-400">{ord.date}</td>
                    <td className="p-3.5 text-slate-200">{ord.customerEmail}</td>
                    <td className="p-3.5 max-w-[240px] truncate text-slate-300">
                      {ord.items?.map(i => i.title).join(', ')}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div className="font-medium">{ord.paymentMethod}</div>
                      {ord.otpVerified && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>OTP Authenticated</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">${ord.total.toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {ord.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 4: Global Settings */}
      {adminTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e101a] border border-white/[0.08] space-y-4">
            <h3 className="text-base font-bold text-white">Publisher Configuration</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Top Announcement Banner Text
              </label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => updatePublisherSettings({ announcementText: e.target.value })}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Community Author Royalty Share (%)
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={settings.authorRoyaltyShare || 85}
                onChange={(e) => updatePublisherSettings({ authorRoyaltyShare: parseInt(e.target.value, 10) })}
                className="w-32 bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
              />
              <span className="text-[11px] text-slate-500 ml-2">Platform takes {100 - (settings.authorRoyaltyShare || 85)}% commission</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Headline
              </label>
              <input
                type="text"
                value={settings.siteHeadline || ''}
                onChange={(e) => updatePublisherSettings({ siteHeadline: e.target.value })}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
            <h3 className="text-sm font-bold text-red-400">Database Reset</h3>
            <p className="text-xs text-slate-400">
              Reset all local book catalogs, order logs, and libraries back to the initial demo state.
            </p>
            <button
              onClick={() => {
                if (confirm('Reset all demo data and restore defaults?')) {
                  resetToDefaults();
                }
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Reset to Factory Demo State
            </button>
          </div>
        </div>
      )}

      {/* Modal: Publish Official Book */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0e18] border border-orange-500/30 p-6 sm:p-8 text-white space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-lg font-bold">Publish Official Flagship Book</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
                >
                  <option value="Technology & AI">Technology & AI</option>
                  <option value="Sci-Fi & Cyberpunk">Sci-Fi & Cyberpunk</option>
                  <option value="Business & Startups">Business & Startups</option>
                  <option value="Philosophy & Mind">Philosophy & Mind</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Fiction & Mystery">Fiction & Mystery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Cover Artwork URL</label>
                <input
                  type="text"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Synopsis & Overview</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl p-3 text-xs text-white border border-white/[0.1] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-glow-primary px-6 py-2 rounded-xl text-white font-bold text-xs"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
