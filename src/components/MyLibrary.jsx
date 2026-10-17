import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  BookOpen, 
  DownloadCloud, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  TrendingUp, 
  Layers,
  ArrowRight,
  Star,
  Wallet,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard
} from 'lucide-react';
import { downloadBookPDF } from '../utils/pdfGenerator';

export const MyLibrary = () => {
  const { 
    books, 
    myLibrary, 
    setCurrentReaderBook, 
    setIsSellModalOpen, 
    setActiveTab, 
    settings,
    notify,
    currentUser,
    bookReviews,
    addReview,
    payoutRequests,
    requestPayout
  } = useBooks();

  const [libraryTab, setLibraryTab] = useState('purchased'); // 'purchased' | 'creator-listings'

  // Review modal state
  const [reviewModalBook, setReviewModalBook] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Payout request modal/form state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Stripe Connect');

  // Books user owns
  const purchasedBooks = books.filter((b) => myLibrary.includes(b.id));

  // Books user has listed for sale
  const userListings = books.filter((b) => b.sellerId === 'user-self' || !b.isOfficial);

  // Royalty rate
  const royaltyShare = settings?.authorRoyaltyShare || 85;

  // Calculate user author earnings
  const totalCopiesSold = userListings.reduce((sum, b) => sum + (b.downloads || 0), 0);
  const totalGrossSales = userListings.reduce((sum, b) => sum + (b.downloads || 0) * b.price, 0);
  const totalAuthorRoyalty = totalGrossSales * (royaltyShare / 100);

  // Calculate total settled payouts
  const totalWithdrawn = (payoutRequests || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  const availableBalance = Math.max(0, totalAuthorRoyalty - totalWithdrawn);

  const handleDownload = (book) => {
    notify(`Generating watermarked PDF for "${book.title}"...`, 'info');
    const ok = downloadBookPDF(book, {
      buyerEmail: currentUser?.email || 'alex.reader@austra.io',
      orderId: `ORD-${book.id}-LIB`
    });
    if (ok) {
      notify(`Downloaded "${book.title}.pdf"!`);
    }
  };

  const handleOpenReviewModal = (book) => {
    setReviewModalBook(book);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewModalBook) return;
    if (!reviewComment.trim()) {
      notify('Please enter your review comments.', 'error');
      return;
    }

    addReview(reviewModalBook.id, {
      userName: currentUser?.name || 'Alex Mercer',
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    notify(`Thank you! Your verified review for "${reviewModalBook.title}" has been saved.`);
    setReviewModalBook(null);
  };

  const handleRequestPayout = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      notify('Please enter a valid payout amount.', 'error');
      return;
    }
    if (amountNum > availableBalance && availableBalance > 0) {
      notify(`Requested amount exceeds available balance ($${availableBalance.toFixed(2)}).`, 'error');
      return;
    }

    requestPayout(amountNum, payoutMethod);
    setIsPayoutModalOpen(false);
    setPayoutAmount('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>Personal Sovereign Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            My Library & Creator Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Access your paid books anytime, download watermarked PDFs, and manage your author royalty payouts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#11131f] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setLibraryTab('purchased')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              libraryTab === 'purchased'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Purchased Books ({purchasedBooks.length})</span>
          </button>

          <button
            onClick={() => setLibraryTab('creator-listings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              libraryTab === 'creator-listings'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Author Earnings & Payouts</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Purchased Books */}
      {libraryTab === 'purchased' && (
        <div>
          {purchasedBooks.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl bg-[#0e101a] border border-white/[0.06] max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Books in Library Yet</h3>
              <p className="text-xs text-slate-400 mb-6">
                Explore our catalog, read free sample pages, and purchase books to enjoy lifetime reading and watermarked PDF exports.
              </p>
              <button
                onClick={() => setActiveTab('store')}
                className="btn-glow-primary px-6 py-3 rounded-xl text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedBooks.map((book) => {
                const bookReviewsList = bookReviews?.[book.id] || [];
                const userAlreadyReviewed = bookReviewsList.some((r) => r.userName === (currentUser?.name || 'Alex Mercer'));

                return (
                  <div
                    key={book.id}
                    className="rounded-2xl bg-[#0e101a] border border-white/[0.08] hover:border-orange-500/40 p-5 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex gap-4 mb-4">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-24 h-32 object-cover rounded-xl border border-white/[0.1] shadow-md group-hover:scale-102 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-1.5">
                            ✓ Unrestricted Access
                          </span>
                          <h3 className="text-base font-bold text-white truncate group-hover:text-orange-300 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-xs text-slate-400 truncate mb-2">By {book.author}</p>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-400" />
                            <span>{book.totalPages || 310} Pages • Dynamic DRM</span>
                          </div>
                        </div>
                      </div>

                      {/* Review Status Pill */}
                      <div className="mb-3 flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-slate-400">Community Score:</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{book.rating || 4.9} ({bookReviewsList.length} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentReaderBook(book)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read Online</span>
                        </button>

                        <button
                          onClick={() => handleDownload(book)}
                          title="Download watermarked PDF file"
                          className="py-2.5 px-3.5 rounded-xl bg-[#171a28] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 border border-white/[0.1] hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PDF</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenReviewModal(book)}
                        className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          userAlreadyReviewed
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:text-white hover:border-orange-500/40'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{userAlreadyReviewed ? 'Update Your Review' : 'Rate & Review Book'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Creator Listings, Royalties & Payouts */}
      {libraryTab === 'creator-listings' && (
        <div className="space-y-8 animate-fade-in">
          {/* Creator KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08] relative overflow-hidden">
              <div className="text-xs text-slate-400 font-mono">LIFETIME ROYALTIES ({royaltyShare}%)</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
                ${totalAuthorRoyalty.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Total revenue generated</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f111c] border border-emerald-500/20 relative overflow-hidden">
              <div className="text-xs text-slate-400 font-mono">AVAILABLE BALANCE</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
                ${availableBalance.toFixed(2)}
              </div>
              <button
                onClick={() => {
                  setPayoutAmount(availableBalance.toFixed(2));
                  setIsPayoutModalOpen(true);
                }}
                disabled={availableBalance <= 0}
                className="mt-2 text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Request Payout →</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08] relative overflow-hidden">
              <div className="text-xs text-slate-400 font-mono">COPIES SOLD / DOWNLOADED</div>
              <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-2 font-mono">
                {totalCopiesSold}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Across all reader accounts</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f111c] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-400 font-mono">ACTIVE BOOKS LISTED</div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">
                  {userListings.length}
                </div>
              </div>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="mt-2 py-1.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish Another Book</span>
              </button>
            </div>
          </div>

          {/* Author Payout History Ledger */}
          <div className="p-6 rounded-2xl bg-[#0e101a] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-orange-400" />
                  <span>Author Royalty Payouts Ledger</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track completed and in-flight creator withdrawals via Stripe, PayPal, and Bank Transfer.
                </p>
              </div>

              <button
                onClick={() => {
                  setPayoutAmount(availableBalance.toFixed(2));
                  setIsPayoutModalOpen(true);
                }}
                className="btn-glow-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Withdraw Royalties</span>
              </button>
            </div>

            {(!payoutRequests || payoutRequests.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-2">No payout requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-slate-400 font-mono text-[11px]">
                      <th className="pb-2.5">TRANSACTION ID</th>
                      <th className="pb-2.5">DATE</th>
                      <th className="pb-2.5">METHOD</th>
                      <th className="pb-2.5">AMOUNT</th>
                      <th className="pb-2.5 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {payoutRequests.map((payout) => (
                      <tr key={payout.id} className="text-slate-300">
                        <td className="py-2.5 font-mono font-bold text-orange-400">{payout.id}</td>
                        <td className="py-2.5 font-mono text-slate-400">{payout.date}</td>
                        <td className="py-2.5">{payout.method}</td>
                        <td className="py-2.5 font-mono font-bold text-white">${Number(payout.amount).toFixed(2)}</td>
                        <td className="py-2.5 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{payout.status || 'Settled'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Listings Table / Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Listed Books for Sale</h3>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                <span>+ List New Book</span>
              </button>
            </div>

            {userListings.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-[#0e101a] border border-white/[0.06]">
                <p className="text-xs text-slate-400 mb-4">You have not listed any books for sale yet.</p>
                <button
                  onClick={() => setIsSellModalOpen(true)}
                  className="btn-glow-primary px-5 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer"
                >
                  Start Selling on Austra
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userListings.map((book) => {
                  const bookSales = book.downloads || 0;
                  const bookRevenue = bookSales * book.price * (royaltyShare / 100);

                  return (
                    <div
                      key={book.id}
                      className="p-4 rounded-2xl bg-[#0e101a] border border-white/[0.08] flex items-center gap-4 justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-14 h-18 object-cover rounded-lg border border-white/[0.1]"
                        />
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active Listing
                          </span>
                          <h4 className="text-sm font-bold text-white truncate max-w-[200px] mt-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-400">${book.price.toFixed(2)} / copy</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          +${bookRevenue.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-500">{bookSales} sales</div>
                        <button
                          onClick={() => setCurrentReaderBook(book)}
                          className="mt-1 text-[11px] text-orange-400 hover:underline cursor-pointer"
                        >
                          View Reader
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT STAR RATING & REVIEW */}
      {reviewModalBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e101c] border border-orange-500/30 p-6 text-white shadow-2xl animate-scale-in">
            <button
              onClick={() => setReviewModalBook(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Rate & Review Book</h3>
            <p className="text-xs text-slate-400 truncate mb-4">"{reviewModalBook.title}"</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer text-amber-400 hover:scale-120 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-400 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Written Review</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Share details of what you enjoyed about the book..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-[#151726] rounded-xl p-3 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBook(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-glow-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST CREATOR PAYOUT */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e101c] border border-orange-500/30 p-6 text-white shadow-2xl animate-scale-in">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-orange-400" />
              <span>Request Royalty Payout</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Withdraw your 85% creator royalties directly to your financial account.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={availableBalance > 0 ? availableBalance : 1000}
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-[#151726] rounded-xl pl-8 pr-4 py-2.5 text-xs text-white font-mono border border-white/[0.1] focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Available Balance: ${availableBalance.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount(availableBalance.toFixed(2))}
                    className="text-orange-400 hover:underline cursor-pointer"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payout Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full bg-[#151726] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500"
                >
                  <option value="Stripe Direct">Stripe Direct Connect</option>
                  <option value="PayPal Payouts">PayPal Payouts</option>
                  <option value="Direct Bank Wire (ACH/SWIFT)">Direct Bank Wire (ACH/SWIFT)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-glow-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
