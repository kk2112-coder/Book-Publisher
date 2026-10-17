import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { X, Mail, Send, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';

export const ContactModal = () => {
  const { isContactModalOpen, setIsContactModalOpen, notify } = useBooks();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      notify('Thank you! Your message has been routed to Austra Press Support.');
      setSubmitted(false);
      setIsContactModalOpen(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#0c0e18] border border-orange-500/30 p-6 sm:p-8 text-white shadow-2xl shadow-orange-950/40"
      >
        <button
          onClick={() => setIsContactModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
          aria-label="Close contact modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Contact Austra Press</h2>
            <p className="text-xs text-slate-400">Support, author manuscript inquiries, and licensing</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold">Message Dispatched!</h3>
            <p className="text-xs text-slate-400">Our editorial desk will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Elena Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-300 mb-1">
                Inquiry Topic
              </label>
              <select
                id="contact-topic"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-xs text-white border border-white/[0.1]"
              >
                <option value="General Support">General Reader Support</option>
                <option value="Author Manuscript">Author Manuscript & Publishing</option>
                <option value="PDF Download Issue">PDF Download / Order Help</option>
                <option value="Partnership">Publisher Partnership</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-msg" className="block text-xs font-semibold text-slate-300 mb-1">
                Message *
              </label>
              <textarea
                id="contact-msg"
                required
                rows={4}
                placeholder="How can we assist you today?..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#131622] rounded-xl p-3 text-xs text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-glow-primary py-3 rounded-xl text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
