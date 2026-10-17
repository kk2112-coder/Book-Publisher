import React, { useState, useEffect, useRef } from 'react';
import { useBooks } from '../context/BookContext';
import { downloadBookPDF } from '../utils/pdfGenerator';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  Check, 
  Sparkles,
  Zap,
  DownloadCloud,
  Smartphone,
  Key,
  RefreshCw,
  AlertCircle,
  Building2,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    checkoutTarget, 
    setCheckoutTarget,
    cart, 
    completePurchase,
    currentUser,
    setCurrentReaderBook,
    setActiveTab,
    notify 
  } = useBooks();

  // Multi-step flow: 'details' -> 'otp' -> 'processing' -> 'success'
  const [step, setStep] = useState('details');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking' | 'paypal'

  // Customer & Billing details
  const [email, setEmail] = useState(currentUser?.email || 'alex.reader@lumina.io');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [cardholderName, setCardholderName] = useState(currentUser?.name || 'Alex Mercer');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('672');
  const [upiId, setUpiId] = useState('alex.reader@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // OTP Authentication state
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [processingStage, setProcessingStage] = useState(1);

  const otpInputRefs = useRef([]);

  // Reset state on open
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('details');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setCompletedOrder(null);
      setAttemptsLeft(3);
      if (currentUser?.email) setEmail(currentUser.email);
      if (currentUser?.name) setCardholderName(currentUser.name);
    }
  }, [isCheckoutOpen, currentUser]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isCheckoutOpen) return null;

  const items = checkoutTarget ? [checkoutTarget] : cart;
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // Transition from Details to OTP verification
  const handleProceedToOtp = (e) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) {
      alert('Please provide a valid email and mobile number for 3D Secure verification.');
      return;
    }

    // Generate dynamic 6-digit OTP code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setTimer(60);
    setCanResend(false);
    setAttemptsLeft(3);
    setStep('otp');

    notify(`Security OTP sent to ${phone}: ${newCode} (Demo Passcode)`);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // Handle individual digit input
  const handleDigitChange = (index, value) => {
    // Only accept numeric
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);
    if (otpError) setOtpError('');

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace key navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Paste 6-digit OTP code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const updated = pasteData.split('');
      while (updated.length < 6) updated.push('');
      setOtpDigits(updated);
      const nextIndex = Math.min(pasteData.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  // 1-Click Auto-Fill Demo OTP
  const handleAutoFillOtp = () => {
    setOtpDigits(generatedOtp.split(''));
    setOtpError('');
    notify(`Auto-filled 3D-Secure demo passcode: ${generatedOtp}`);
  };

  // Resend OTP
  const handleResendOtp = () => {
    const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(freshCode);
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    setOtpError('');
    notify(`New 3D-Secure OTP dispatched: ${freshCode}`);
    setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
  };

  // Verify OTP and trigger payment processing
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otpDigits.join('');

    // Accept generated code or demo override '123456' / '000000'
    if (entered === generatedOtp || entered === '123456' || entered === '000000') {
      setStep('processing');
      setProcessingStage(1);

      setTimeout(() => setProcessingStage(2), 500);
      setTimeout(() => setProcessingStage(3), 1000);

      setTimeout(() => {
        const orderData = completePurchase({
          method: paymentMethod === 'card' 
            ? 'Credit Card (3D-Secure 2.0 OTP Verified)' 
            : paymentMethod === 'upi' 
            ? 'UPI 2.0 Instant (OTP Authenticated)' 
            : paymentMethod === 'netbanking' 
            ? `${selectedBank} NetBanking (OTP Verified)` 
            : 'PayPal Express 2FA Verified',
          email,
          gateway: 'Lumina SecurePay 3D Gateway',
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}-3DS`,
          keepModalOpen: true
        });

        setCompletedOrder(orderData);
        setStep('success');
      }, 1600);
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setOtpError('Maximum OTP attempts exceeded. Please request a new security code.');
        setCanResend(true);
      } else {
        setOtpError(`Incorrect OTP code. ${remaining} attempts remaining. (Demo Code: ${generatedOtp})`);
      }
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCheckoutTarget(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog" 
      aria-modal="true"
      onClick={handleClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-[#0c0e17] border border-orange-500/30 shadow-2xl shadow-orange-950/40 p-6 sm:p-8 text-white overflow-hidden animate-scale-in"
      >
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-orange-500/15 via-amber-500/5 to-transparent blur-[80px] pointer-events-none rounded-full"></div>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Lumina SecurePay Gateway</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  3D-SECURE 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">PCI-DSS Compliant • 256-Bit Bank Grade Encryption</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PAYMENT METHOD & BILLING DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleProceedToOtp} className="space-y-5 animate-fade-in">
            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-[#121422] border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase mb-2">
                <span>Order Summary ({items.length} {items.length === 1 ? 'Book' : 'Books'})</span>
                <span className="text-orange-400">DRM-Free PDF Included</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-2 mb-3 pr-1">
                {items.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04] last:border-0">
                    <span className="truncate max-w-[320px] text-slate-200 font-medium">{b.title}</span>
                    <span className="font-mono font-bold text-white shrink-0">${b.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-sm font-bold">
                <span className="text-slate-300">Total Settlement Amount</span>
                <span className="text-2xl font-black text-orange-400 font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Gateway Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-500/20'
                      : 'bg-[#121422] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">Card (3DS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-500/20'
                      : 'bg-[#121422] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">UPI 2.0</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-500/20'
                      : 'bg-[#121422] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[11px]">NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md shadow-orange-500/20'
                      : 'bg-[#121422] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-[11px]">PayPal 2FA</span>
                </button>
              </div>
            </div>

            {/* Contact Verification Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Receipt Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile for OTP Auth *</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#131622] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                  />
                </div>
              </div>
            </div>

            {/* Gateway Specific Form Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#10121d] border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                  <span>CARD INFORMATION</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-orange-400">
                    <Lock className="w-3 h-3" />
                    <span>3D Secure 2.0 Protected</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full bg-[#141624] rounded-xl px-3.5 py-2 text-xs text-white border border-white/[0.1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#141624] rounded-xl pl-3.5 pr-10 py-2 text-xs text-white font-mono border border-white/[0.1]"
                    />
                    <CreditCard className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-orange-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#141624] rounded-xl px-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-[#141624] rounded-xl px-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-[#10121d] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>UPI VIRTUAL PAYMENT ADDRESS</span>
                  <span className="text-emerald-400 text-[11px]">Instant 2-Step OTP</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Enter UPI ID</label>
                  <div className="relative">
                    <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-[#141624] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white font-mono border border-white/[0.1]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  After proceeding, a 6-digit transaction authorization OTP will be triggered for verification.
                </p>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-[#10121d] border border-white/[0.06] space-y-3">
                <div className="text-xs text-slate-400 font-mono">SELECT ISSUING BANK</div>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-[#141624] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1]"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Chase / JP Morgan">Chase / JP Morgan (US)</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="HSBC Global">HSBC Global</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Secure gateway handshake with {selectedBank} requires 3D Secure SMS OTP authorization.
                </p>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>PayPal Express 2-Factor Authentication</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  You will verify this purchase using an encrypted security code dispatched to your registered device.
                </p>
              </div>
            )}

            {/* CTA: Proceed to OTP */}
            <button
              type="submit"
              className="w-full btn-glow-primary py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to 3D-Secure OTP Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL</span>
              </span>
              <span>•</span>
              <span>PCI-DSS L1</span>
              <span>•</span>
              <span>RBI / Visa 3DS Compliant</span>
            </div>
          </form>
        )}

        {/* STEP 2: 3D-SECURE BANK OTP AUTHENTICATION */}
        {step === 'otp' && (
          <div className="space-y-5 animate-scale-in">
            {/* Bank Portal Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#141624] to-orange-950/40 border border-orange-500/30">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-orange-400 font-semibold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                  <span>Issuing Bank 3D-Secure 2.0</span>
                </span>
                <span className="text-xs font-mono font-bold text-white">${total.toFixed(2)} USD</span>
              </div>
              <p className="text-xs text-slate-300">
                A 6-digit One-Time Password (OTP) was sent to your registered device <strong className="text-white font-mono">{phone}</strong> and email <strong className="text-white">{email}</strong>.
              </p>
            </div>

            {/* Demo Quick Test Pill */}
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300">
                  Demo Passcode: <span className="font-mono font-black text-amber-400 text-sm tracking-widest">{generatedOtp}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-3 py-1 rounded-lg bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-all cursor-pointer whitespace-nowrap"
              >
                1-Click Auto-Fill Code
              </button>
            </div>

            {/* Error Message */}
            {otpError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* 6-Digit Segmented OTP Inputs */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 text-center mb-2">
                  Enter 6-Digit Authentication Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border bg-[#141624] text-white focus:outline-none transition-all ${
                        digit
                          ? 'border-orange-500 shadow-md shadow-orange-500/30 ring-1 ring-orange-500'
                          : 'border-white/[0.12] focus:border-orange-500/70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer & Resend Controls */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>
                    Expires in: <strong className="text-white">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!canResend}
                  onClick={handleResendOtp}
                  className="flex items-center gap-1 font-semibold text-orange-400 hover:text-orange-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={otpDigits.some((d) => !d)}
                className="w-full btn-glow-primary py-3.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Authorize ${total.toFixed(2)}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Payment Details
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: BANK SETTLEMENT PROCESSING */}
        {step === 'processing' && (
          <div className="py-10 text-center space-y-6 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Lock className="w-7 h-7 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">Authorizing Bank Transaction</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Securely communicating with issuing bank through 3D-Secure payment switch...
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2 text-left text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>3D-Secure OTP verified</span>
              </div>
              <div className={`flex items-center gap-2 ${processingStage >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {processingStage >= 2 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full"></div>}
                <span>Authorizing funds settlement</span>
              </div>
              <div className={`flex items-center gap-2 ${processingStage >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {processingStage >= 3 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full"></div>}
                <span>Issuing sovereign DRM-free license</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT SUCCESS & INSTANT FULFILLMENT */}
        {step === 'success' && (
          <div className="space-y-6 text-center animate-scale-in">
            {/* Success Ring */}
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
                AUTHENTICATED & SETTLED
              </div>
              <h3 className="text-2xl font-black text-white">Payment Successful!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your purchase has been verified via 3D-Secure OTP. The books are permanently added to your personal library.
              </p>
            </div>

            {/* Order Receipt Details */}
            <div className="p-4 rounded-2xl bg-[#121422] border border-white/[0.08] text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400 font-mono">TRANSACTION ID</span>
                <span className="font-mono font-bold text-orange-400">{completedOrder?.id || 'TXN-849201-3DS'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400 font-mono">METHOD</span>
                <span className="text-slate-200">{completedOrder?.paymentMethod || '3D-Secure OTP Verified'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400 font-mono">RECEIPT DISPATCHED TO</span>
                <span className="text-slate-200">{completedOrder?.customerEmail || email}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold text-sm">
                <span className="text-slate-300">Total Paid</span>
                <span className="text-lg font-black text-emerald-400 font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {items[0] && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentReaderBook(items[0]);
                    handleClose();
                  }}
                  className="btn-glow-primary py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Book Now</span>
                </button>
              )}

              {items[0] && (
                <button
                  type="button"
                  onClick={() => {
                    downloadBookPDF(items[0]);
                    notify(`Downloading "${items[0].title}" PDF...`);
                  }}
                  className="py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/[0.1] transition-all cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4 text-orange-400" />
                  <span>Download DRM-Free PDF</span>
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('library');
                  handleClose();
                }}
                className="text-xs text-orange-400 hover:text-orange-300 underline font-semibold cursor-pointer"
              >
                Go to My Library ({items.length} unlocked)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
