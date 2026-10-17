import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  Check, 
  Sparkles,
  Zap,
  DownloadCloud
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    checkoutTarget, 
    cart, 
    completePurchase,
    currentUser 
  } = useBooks();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'paypal' | 'crypto'
  const [email, setEmail] = useState(currentUser?.email || 'alex.reader@lumina.io');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const items = checkoutTarget ? [checkoutTarget] : cart;
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      completePurchase({
        method: paymentMethod === 'card' ? 'Credit Card (Stripe)' : paymentMethod === 'upi' ? 'UPI Instant Pay' : paymentMethod === 'paypal' ? 'PayPal Express' : 'USDC On-Chain',
        email
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-[#0c0e17] border border-orange-500/30 shadow-2xl shadow-orange-950/40 p-6 sm:p-8 text-white overflow-hidden"
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[80px] pointer-events-none rounded-full"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Secure Instant Checkout</h2>
              <p className="text-xs text-slate-400">End-to-End Encrypted Digital Book Purchase</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="mb-6 p-4 rounded-2xl bg-[#121422] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400 uppercase mb-2">Order Items ({items.length})</div>
          <div className="max-h-36 overflow-y-auto space-y-2 mb-3">
            {items.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[300px] text-slate-200">{b.title}</span>
                <span className="font-mono font-bold text-white shrink-0">${b.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-sm font-bold">
            <span className="text-slate-300">Total Amount</span>
            <span className="text-xl font-black text-orange-400 font-mono">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'card'
                ? 'bg-orange-500/15 border-orange-500/60 text-orange-300'
                : 'bg-[#121422] border-white/[0.06] text-slate-400'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'upi'
                ? 'bg-orange-500/15 border-orange-500/60 text-orange-300'
                : 'bg-[#121422] border-white/[0.06] text-slate-400'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'paypal'
                ? 'bg-orange-500/15 border-orange-500/60 text-orange-300'
                : 'bg-[#121422] border-white/[0.06] text-slate-400'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>PayPal</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('crypto')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              paymentMethod === 'crypto'
                ? 'bg-orange-500/15 border-orange-500/60 text-orange-300'
                : 'bg-[#121422] border-white/[0.06] text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>USDC</span>
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Receipt Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
            />
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl pl-3.5 pr-10 py-2 text-xs text-white font-mono border border-white/[0.1]"
                  />
                  <CreditCard className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Expires (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">CVC / Security Code</label>
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl px-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] text-center space-y-2">
              <div className="w-24 h-24 mx-auto rounded-lg bg-white p-2 flex items-center justify-center">
                <QrCode className="w-20 h-20 text-black" />
              </div>
              <p className="text-xs text-slate-300 font-mono">UPI ID: pay@luminapress</p>
              <p className="text-[11px] text-slate-500">Scan using any UPI app (GPay, PhonePe, Paytm)</p>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-center text-xs text-blue-200">
              You will be seamlessly authenticated with PayPal Express for 1-click settlement.
            </div>
          )}

          {paymentMethod === 'crypto' && (
            <div className="p-4 rounded-xl bg-[#141624] border border-orange-500/20 text-xs font-mono text-slate-300 space-y-1">
              <div>Network: Polygon / Base</div>
              <div className="text-[11px] text-orange-400 break-all">0x71C...aB89 (Verified Lumina Treasury)</div>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn-glow-primary py-3.5 rounded-xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {isProcessing ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                <span>Confirm Payment of ${total.toFixed(2)} & Download</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Unlocking of Web Reader + High-Resolution PDF</span>
          </div>
        </form>
      </div>
    </div>
  );
};
