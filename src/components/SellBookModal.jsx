import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { 
  X, 
  UploadCloud, 
  DollarSign, 
  BookOpen, 
  Sparkles, 
  Check, 
  HelpCircle,
  FileCheck2,
  Wand2
} from 'lucide-react';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
];

export const SellBookModal = () => {
  const { 
    isSellModalOpen, 
    setIsSellModalOpen, 
    uploadUserBook, 
    currentUser, 
    settings,
    setActiveTab 
  } = useBooks();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState(currentUser?.name || 'Community Author');
  const [category, setCategory] = useState('Technology & AI');
  const [price, setPrice] = useState('18.00');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0]);
  const [totalPages, setTotalPages] = useState('250');
  const [description, setDescription] = useState('');
  const [previewPage1, setPreviewPage1] = useState('');
  const [previewPage2, setPreviewPage2] = useState('');
  const [previewPage3, setPreviewPage3] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  if (!isSellModalOpen) return null;

  // Pre-fill with sample manuscript for instant testing
  const handleAutofillDemo = () => {
    setTitle('Neural Weaves: The Next Fabric of Compute');
    setSubtitle('How biological wetware and memristor arrays are changing computational cognition');
    setAuthor(currentUser.name);
    setCategory('Technology & AI');
    setPrice('22.50');
    setTotalPages('295');
    setCoverImage(COVER_PRESETS[1]);
    setDescription('An in-depth investigation into modern neuromorphic silicon chips and bio-synthetic hybrid computing substrates that operate on less than 2 watts of energy.');
    setPreviewPage1('CHAPTER 1: THE BIO-SILICON INTERFACE\n\nSilicon had reached its thermodynamic limit. As lithography approached 1 nanometer, quantum tunneling rendered classical transistor gates leaky and hot. We needed a new medium.\n\nIn our Zurich laboratory, we introduced living cortical organoids to arrayed titanium microelectrodes. Within three weeks, the neurons had grown synaptic connections that mapped to the conductive grid.');
    setPreviewPage2('CHAPTER 2: MEMRISTOR REVOLUTION\n\nMemristors remember the amount of charge that has passed through them, behaving identically to human synaptic plasticity. When scaled to billions of junctions, the memory and processing bottlenecks of classical von Neumann architecture vanish entirely.');
    setPreviewPage3('CHAPTER 3: THE ZERO-POWER PARADIGM\n\nImagine an autonomous device that learns speech, navigation, and tactile object recognition while scavenging energy solely from ambient temperature differences. This is no longer science fiction.');
    setChapterContent('CHAPTER 4: THE FUTURE OF LIVING COMPUTERS\n\nAs we integrate synthetic biology with programmable hardware, the boundaries between user, code, and nature become beautifully blurred. The remaining chapters provide complete circuit blueprints and wetware synthesis protocols.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price) {
      alert('Please fill in at least Title, Description, and Price.');
      return;
    }

    const newBookData = {
      title,
      subtitle,
      author,
      authorRole: 'Independent Creator',
      category,
      price: parseFloat(price) || 15.0,
      coverImage: coverImage || COVER_PRESETS[0],
      totalPages: parseInt(totalPages, 10) || 200,
      description,
      previewPages: [
        previewPage1 || `CHAPTER 1\n\n${description}`,
        previewPage2 || `CHAPTER 2\n\nDeep dive into experimental frameworks and systems.`,
        previewPage3 || `CHAPTER 3\n\nPractical implementation considerations.`
      ],
      chapters: [
        { id: 1, title: 'Chapter 1: The First Steps', content: previewPage1 || description },
        { id: 2, title: 'Chapter 2: Core Methodology', content: previewPage2 || 'Core methodology.' },
        { id: 3, title: 'Chapter 3: Strategic Blueprint', content: previewPage3 || 'Strategic blueprint.' },
        { id: 4, title: 'Chapter 4: Advanced Synthesis', content: chapterContent || 'Full unredacted chapter for verified buyers.' }
      ]
    };

    uploadUserBook(newBookData);
    setIsSellModalOpen(false);
    setActiveTab('community');
  };

  const authorShare = settings?.authorRoyaltyShare || 85;
  const estimatedPayout = (parseFloat(price) || 0) * (authorShare / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0e18] border border-orange-500/30 shadow-2xl shadow-orange-950/40 p-6 sm:p-8 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Publish & Sell Your Book</h2>
              <p className="text-xs text-slate-400">Reach readers worldwide • Earn {authorShare}% creator royalties</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutofillDemo}
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold transition-all"
              title="Click to automatically fill demo manuscript data"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Autofill Demo</span>
            </button>

            <button
              onClick={() => setIsSellModalOpen(false)}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all border border-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Royalty Calculator Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-950/30 via-[#151828] to-orange-950/30 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-bold text-white">Direct Author Royalty Rate: {authorShare}%</div>
              <div className="text-slate-400 text-[11px]">Instant payouts, automated PDF generation, and no upfront listing fees.</div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold font-mono">
            You earn ~${estimatedPayout.toFixed(2)} per sale
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Quantum Internet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-sm text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. Protocols, Security and Future Hardware"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-sm text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Author Display Name *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-sm text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-sm text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Selling Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.99"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#131622] rounded-xl px-3.5 py-2.5 text-sm text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70 font-mono font-bold"
              />
            </div>
          </div>

          {/* Cover Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Book Cover Artwork
            </label>
            <div className="grid grid-cols-4 gap-3 mb-2">
              {COVER_PRESETS.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setCoverImage(imgUrl)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    coverImage === imgUrl ? 'border-orange-500 scale-102 ring-2 ring-orange-500/40' : 'border-white/[0.1] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="preset" className="w-full h-full object-cover" />
                  {coverImage === imgUrl && (
                    <div className="absolute top-1 right-1 bg-orange-600 rounded-full p-0.5 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or paste any custom Image URL..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-[#131622] rounded-xl px-3 py-2 text-xs text-slate-300 border border-white/[0.1]"
            />
          </div>

          {/* Book Synopsis */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Book Synopsis / Overview *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the themes, knowledge, or story your book offers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#131622] rounded-xl p-3 text-sm text-white border border-white/[0.1] focus:outline-none focus:border-orange-500/70 resize-none"
            />
          </div>

          {/* Free Preview Sample Configuration (User requirement: only some pages free!) */}
          <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/25 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
              <BookOpen className="w-4 h-4" />
              <span>Sample Pages for Free Reader Preview (Pages 1, 2, 3)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Prospective buyers will only be able to read these 3 sample pages. Subsequent pages are automatically locked behind your ${price} paywall!
            </p>

            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="Page 1 Sample Text (Prologue / Opening)..."
                value={previewPage1}
                onChange={(e) => setPreviewPage1(e.target.value)}
                className="w-full bg-[#0e101a] rounded-lg p-2.5 text-xs text-slate-200 border border-white/[0.1]"
              />
              <textarea
                rows={2}
                placeholder="Page 2 Sample Text..."
                value={previewPage2}
                onChange={(e) => setPreviewPage2(e.target.value)}
                className="w-full bg-[#0e101a] rounded-lg p-2.5 text-xs text-slate-200 border border-white/[0.1]"
              />
              <textarea
                rows={2}
                placeholder="Page 3 Sample Text..."
                value={previewPage3}
                onChange={(e) => setPreviewPage3(e.target.value)}
                className="w-full bg-[#0e101a] rounded-lg p-2.5 text-xs text-slate-200 border border-white/[0.1]"
              />
            </div>
          </div>

          {/* Full Locked Book Content (Unlocked after payment & exported into PDF) */}
          <div className="p-4 rounded-2xl bg-[#131622] border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
              <span>Full Book Chapter Content (Unlocked Post-Payment & PDF)</span>
            </div>
            <textarea
              rows={3}
              placeholder="Paste full chapter content that gets unlocked once user pays and downloaded in the generated PDF..."
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              className="w-full bg-[#0e101a] rounded-lg p-2.5 text-xs text-slate-200 border border-white/[0.1]"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsSellModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-glow-primary px-7 py-3 rounded-xl text-white font-bold text-xs shadow-xl flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publish Book to Marketplace</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
