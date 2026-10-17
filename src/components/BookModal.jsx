import React from 'react';
import { useBooks } from '../context/BookContext';
import { 
  X, 
  Star, 
  BookOpen, 
  ShoppingBag, 
  DownloadCloud, 
  CheckCircle, 
  Lock, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  UserCheck, 
  Sparkles,
  Award,
  Feather,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { downloadBookPDF } from '../utils/pdfGenerator';

export const BookModal = () => {
  const { 
    currentModalBook, 
    setCurrentModalBook, 
    setCurrentReaderBook, 
    isBookOwned, 
    addToCart, 
    initiateCheckout,
    bookReviews,
    addReview,
    currentUser,
    isReader,
    isAuthor,
    isReviewer,
    notify 
  } = useBooks();

  const [newRating, setNewRating] = React.useState(5);
  const [newComment, setNewComment] = React.useState('');
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [isCriticsChoice, setIsCriticsChoice] = React.useState(false);

  if (!currentModalBook) return null;

  const book = currentModalBook;
  const owned = isBookOwned(book.id);
  const reviews = bookReviews?.[book.id] || [];

  const handleDownload = () => {
    if (owned) {
      notify(`Generating watermarked PDF for "${book.title}"...`, 'info');
      const success = downloadBookPDF(book, {
        buyerEmail: currentUser?.email || 'alex.reader@austra.io',
        orderId: `ORD-${book.id}-LIB`
      });
      if (success) notify(`Downloaded "${book.title}.pdf"!`);
    } else {
      initiateCheckout(book);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(book.id, {
      userName: currentUser?.name || 'Alex Mercer',
      rating: newRating,
      comment: newComment.trim(),
      isEditorial: isReviewer,
      criticsChoice: isReviewer ? isCriticsChoice : false
    });
    setNewComment('');
    setIsCriticsChoice(false);
    setShowReviewForm(false);
    notify(isReviewer ? 'Certified Editorial Critic Review published!' : 'Thank you! Your verified review has been published.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d0f18] border border-white/[0.1] shadow-2xl shadow-orange-950/40 p-6 sm:p-8 text-white animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={() => setCurrentModalBook(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all border border-white/[0.08]"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cover & Quick Actions */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/[0.1] group">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/75 backdrop-blur-md text-orange-400 border border-orange-500/30">
                  {book.category}
                </span>
              </div>

              {owned && (
                <div className="absolute bottom-3 left-3 right-3 py-1.5 rounded-xl bg-emerald-500/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Owned in Library</span>
                </div>
              )}
            </div>

            {/* Quick action buttons under cover */}
            <div className="w-full max-w-[280px] mt-4 space-y-2.5">
              <button
                onClick={() => {
                  setCurrentModalBook(null);
                  setCurrentReaderBook(book);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#171a28] hover:bg-[#202438] text-slate-200 hover:text-white border border-white/[0.1] hover:border-orange-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-orange-400" />
                <span>{owned ? 'Read Entire Book' : 'Read 3 Free Pages'}</span>
              </button>

              {owned ? (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Download Full PDF</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(book);
                    }}
                    className="flex-1 py-3 px-3 rounded-xl bg-[#171a28] hover:bg-orange-500/20 border border-white/[0.1] hover:border-orange-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    <span>Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentModalBook(null);
                      initiateCheckout(book);
                    }}
                    className="flex-2 btn-glow-primary py-3 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>Buy (${book.price.toFixed(2)})</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Book Details & Specs */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-orange-400 font-mono uppercase tracking-wider mb-2">
                <span>{book.isOfficial ? 'Austra Press Original' : 'Community Author Edition'}</span>
                <span>•</span>
                <span>{book.releaseDate || '2026'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {book.title}
              </h2>
              {book.subtitle && (
                <p className="text-sm text-slate-400 mt-1 italic">
                  {book.subtitle}
                </p>
              )}
            </div>

            {/* Author Block */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                {book.author.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{book.author}</h4>
                <p className="text-xs text-slate-400">{book.authorRole || 'Author & Researcher'}</p>
              </div>
            </div>

            {/* Ratings & Price Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#131622] border border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-sm text-white ml-1.5">{book.rating || 4.9}</span>
                </div>
                <span className="text-xs text-slate-500">({book.reviewsCount || 150} reviews)</span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">${book.price.toFixed(2)}</span>
                {book.originalPrice && (
                  <span className="text-xs text-slate-500 line-through ml-2">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Role-Specific Context Cards */}
            {isAuthor && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <Feather className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200 font-semibold">Author Split (85% Royalty):</span>
                </div>
                <div className="font-mono text-emerald-400 font-bold">
                  Author: ${(book.price * 0.85).toFixed(2)} • Platform: ${(book.price * 0.15).toFixed(2)}
                </div>
              </div>
            )}

            {isReviewer && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-semibold">Advance Review Copy (ARC) Privileges:</span>
                </div>
                <div className="font-mono text-amber-400 font-bold">
                  Verified Critic • Unrestricted ARC Evaluation
                </div>
              </div>
            )}

            {/* Synopsis */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Synopsis
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.08]">
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Length</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">{book.totalPages || 310} Pages</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02]">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Free Sample</div>
                <div className="text-xs font-semibold text-orange-400 mt-0.5">3 Pages Included</div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02]">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Format</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">PDF + Online Reader</div>
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DRM-Free Export</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Verified Authors</span>
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Lifetime Access</span>
              </span>
            </div>

            {/* Verified Community Reviews Section */}
            <div className="pt-5 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Community & Editorial Reviews ({reviews.length})
                  </h4>
                </div>
                {(owned || isReviewer) && !showReviewForm && (
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(true)}
                    className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      isReviewer 
                        ? 'text-amber-400 hover:text-amber-300' 
                        : 'text-orange-400 hover:text-orange-300'
                    }`}
                  >
                    {isReviewer ? <Award className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                    <span>{isReviewer ? 'Write Editorial Critique' : 'Write a Review'}</span>
                  </button>
                )}
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className={`p-4 rounded-xl space-y-3 animate-fade-in ${
                  isReviewer ? 'bg-[#181512] border border-amber-500/40' : 'bg-[#121422] border border-orange-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      {isReviewer && <Award className="w-4 h-4 text-amber-400" />}
                      <span>{isReviewer ? 'Publish Official Editorial Critique:' : 'Share your rating & thoughts:'}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${s <= newRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows="3"
                    required
                    placeholder={isReviewer 
                      ? "Provide comprehensive literary critique, narrative evaluation, and thematic assessment for this title..."
                      : "What did you think of the writing, concepts, or technical depth?"}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#181a29] rounded-lg p-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                  />

                  {/* Critic-Exclusive Stamp Award Checkbox */}
                  {isReviewer && (
                    <label className="flex items-center gap-2 text-xs text-amber-300 font-semibold cursor-pointer select-none p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <input
                        type="checkbox"
                        checked={isCriticsChoice}
                        onChange={(e) => setIsCriticsChoice(e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500 text-amber-500 focus:ring-0"
                      />
                      <span>Award Official Austra Critic's Choice Stamp ⭐</span>
                    </label>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-md cursor-pointer ${
                        isReviewer ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'btn-glow-primary text-white'
                      }`}
                    >
                      {isReviewer ? 'Publish Editorial Critique' : 'Publish Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No community reviews submitted yet. Be the first reader to rate this title!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {reviews.map((rev) => {
                    const isEditorialRev = rev.isEditorial || rev.role === 'Reviewer & Critic';

                    return (
                      <div 
                        key={rev.id} 
                        className={`p-3.5 rounded-xl transition-all ${
                          isEditorialRev 
                            ? 'bg-amber-950/20 border border-amber-500/40 shadow-md shadow-amber-950/30' 
                            : 'bg-white/[0.02] border border-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100">{rev.userName}</span>
                            {isEditorialRev ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-400" />
                                <span>{rev.userTitle || 'Editorial Critic Review'}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Verified Reader
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        {rev.criticsChoice && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/25 border border-amber-500/50 text-[10px] font-mono font-black text-amber-300 uppercase mb-2">
                            <span>★ AUSTRA CRITIC'S CHOICE AWARD</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-300 leading-normal">{rev.comment}</p>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">{rev.date || 'Recent'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
