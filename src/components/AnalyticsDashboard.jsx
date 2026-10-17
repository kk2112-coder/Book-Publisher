import React from 'react';
import { useBooks } from '../context/BookContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen, 
  DownloadCloud, 
  Sparkles,
  BarChart3,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { books, orders, settings } = useBooks();

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalDownloads = books.reduce((sum, b) => sum + (b.downloads || 0), 0);
  const conversionRate = 34.8; // Preview to purchase %

  // Genre breakdown
  const categoryCount = books.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + 1;
    return acc;
  }, {});

  const weeklyTrend = [
    { day: 'Mon', sales: 12, amount: 288 },
    { day: 'Tue', sales: 19, amount: 456 },
    { day: 'Wed', sales: 24, amount: 620 },
    { day: 'Thu', sales: 31, amount: 790 },
    { day: 'Fri', sales: 42, amount: 1080 },
    { day: 'Sat', sales: 38, amount: 960 },
    { day: 'Sun', sales: 45, amount: 1240 },
  ];

  const maxAmount = Math.max(...weeklyTrend.map(w => w.amount));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-white">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Real-Time Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold">Publishing Platform Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Live telemetry of book sales, preview conversions, PDF downloads, and reader behavior.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Telemetry Live</span>
          </span>
        </div>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0e101a] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">GROSS REVENUE</div>
          <div className="text-3xl font-black text-emerald-400 mt-2 font-mono">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last week</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e101a] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">PDF EXPORT VELOCITY</div>
          <div className="text-3xl font-black text-orange-400 mt-2 font-mono">
            {totalDownloads}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">DRM-Free vector downloads</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e101a] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">PREVIEW CONVERSION RATE</div>
          <div className="text-3xl font-black text-white mt-2 font-mono">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-orange-300 mt-1">3-page preview to paywall unlock</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e101a] border border-white/[0.08]">
          <div className="text-xs font-mono text-slate-400">CREATOR ROYALTIES PAID</div>
          <div className="text-3xl font-black text-amber-300 mt-2 font-mono">
            ${(totalRevenue * 0.85).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">85% direct author disbursement</div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0e101a] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                <span>Weekly Sales Trajectory ($ USD)</span>
              </h2>
              <p className="text-xs text-slate-400">Total gross volume processed through digital gate</p>
            </div>
            <span className="text-xs font-mono font-bold text-orange-400">Last 7 Days</span>
          </div>

          <div className="h-60 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-white/[0.08]">
            {weeklyTrend.map((item) => {
              const heightPercent = Math.round((item.amount / maxAmount) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.amount}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-orange-600 via-amber-500 to-orange-400 group-hover:from-orange-500 group-hover:to-amber-300 transition-all shadow-lg shadow-orange-950/40"
                  ></div>
                  <div className="text-xs font-mono text-slate-400">{item.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Genre Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0e101a] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-orange-400" />
              <span>Genre Distribution</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">Published books cataloged across categories</p>

            <div className="space-y-3.5">
              {Object.entries(categoryCount).map(([genre, count]) => {
                const percent = Math.round((count / books.length) * 100);
                return (
                  <div key={genre}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 truncate">{genre}</span>
                      <span className="font-mono text-orange-400 font-bold">{count} titles ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
