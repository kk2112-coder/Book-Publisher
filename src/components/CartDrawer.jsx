import React from 'react';
import { useBooks } from '../context/BookContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    clearCart, 
    initiateCheckout 
  } = useBooks();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-[#0a0c14] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between text-white p-6 overflow-hidden animate-slide-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h2 className="text-base font-bold">Your Reading Cart ({cart.length})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-400 font-medium">Your cart is empty</p>
              <p className="text-xs text-slate-600 mt-1">Explore our publications to add books</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#121422] border border-white/[0.06] flex items-center gap-3 justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-lg border border-white/[0.1] shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{item.author}</p>
                    <span className="text-xs font-mono font-bold text-orange-400 mt-1 block">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-white/[0.08] space-y-4">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} books)</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>DRM-Free PDF Export</span>
                <span className="text-emerald-400 font-mono">Included Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.06]">
                <span>Total Due</span>
                <span className="text-orange-400 font-mono text-base">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                initiateCheckout(null); // Whole cart
              }}
              className="w-full btn-glow-primary py-3.5 px-4 rounded-xl text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Library Unlock + Instant PDF Download</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
