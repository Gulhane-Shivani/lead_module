import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_COUNSELORS, ANALYTICS_TREND_DATA, ANALYTICS_SOURCE_DATA } from '../data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Filter, 
  Share2, 
  Download,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import exportToCSV from '../utils/exportCSV';

export default function AnalyticsPage() {
  const { leads } = useApp();

  // 1. Calculate funnel stages counts
  const countByStatus = (statusName) => leads.filter(l => l.status === statusName).length;
  
  const funnelStages = [
    { name: 'Total Inquiries', count: leads.length, color: 'bg-indigo-500' },
    { name: 'Contacted Leads', count: leads.filter(l => ['Contacted', 'Interested', 'Follow-Up Pending', 'Admission Confirmed'].includes(l.status)).length, color: 'bg-purple-500' },
    { name: 'Interested Leads', count: leads.filter(l => ['Interested', 'Admission Confirmed'].includes(l.status)).length, color: 'bg-cyan-500' },
    { name: 'Admissions Closed', count: countByStatus('Admission Confirmed'), color: 'bg-emerald-500' }
  ];

  // Calculate funnel percentage from top
  const funnelWithPct = funnelStages.map((stage, idx, arr) => {
    const topCount = arr[0].count;
    const pct = topCount > 0 ? Math.round((stage.count / topCount) * 100) : 0;
    return { ...stage, pct };
  });

  // 2. Counselor Rankings Compile
  const counselorsPerformance = INITIAL_COUNSELORS.map(cn => {
    const assignedLeads = leads.filter(l => l.counselor === cn.name);
    const admissionsClosed = assignedLeads.filter(l => l.status === 'Admission Confirmed').length;
    const conversionRate = assignedLeads.length > 0 ? Math.round((admissionsClosed / assignedLeads.length) * 100) : cn.conversionRate;
    const targetAchieved = Math.round((admissionsClosed / 5) * 100); // 5 admissions is target
    return {
      ...cn,
      activeLeads: assignedLeads.length || cn.activeLeads,
      admissions: admissionsClosed || Math.round(cn.activeLeads * (cn.conversionRate / 100)),
      conversionRate,
      targetAchieved
    };
  }).sort((a,b) => b.admissions - a.admissions);

  // 3. Lead Source compilation
  const sourceTotals = leads.reduce((acc, lead) => {
    acc[lead.source || 'Google Search'] = (acc[lead.source || 'Google Search'] || 0) + 1;
    return acc;
  }, {});

  const totalSourcesCount = Object.values(sourceTotals).reduce((a,b) => a+b, 0) || 1;
  const sourcesBreakdown = Object.keys(sourceTotals).map(key => {
    const count = sourceTotals[key];
    const pct = Math.round((count / totalSourcesCount) * 100);
    return { name: key, count, pct };
  }).sort((a,b) => b.count - a.count);

  const handleExportCounselors = () => {
    const csvData = counselorsPerformance.map(c => ({
      'Counselor Name': c.name,
      'Email': c.email,
      'Active Leads': c.activeLeads,
      'Admissions Closed': c.admissions,
      'Conversion Rate (%)': c.conversionRate,
      'Target Achieved (%)': c.targetAchieved
    }));
    exportToCSV(csvData, 'counselor_performance_export.csv');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Performance Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Deeper insights into admissions conversion funnels and counselor scorecards.
          </p>
        </div>
        <button
          onClick={handleExportCounselors}
          className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Funnel and Sources row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Conversion Funnel Widget */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Admissions Conversion Funnel</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Inquiry drop-off stages from registration to final admission</p>
          </div>

          <div className="space-y-4 my-6">
            {funnelWithPct.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{stage.name}</span>
                  <span className="text-slate-400 dark:text-slate-500">{stage.count} Students ({stage.pct}%)</span>
                </div>
                {/* Horizontal Funnel step block */}
                <div className="w-full bg-slate-100 dark:bg-slate-900 h-8 rounded-xl overflow-hidden relative border border-slate-200/20 dark:border-slate-800/40">
                  <div 
                    className={`h-full ${stage.color} opacity-85 transition-all duration-500`}
                    style={{ width: `${Math.max(stage.pct, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/50 pt-3">
            🎯 Funnel target standard conversion goal is <strong>15%</strong>. Currently operating at <strong>{funnelWithPct[3]?.pct || 0}%</strong>.
          </div>
        </div>

        {/* Lead Sources channel list (Right Column) */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Source Channels Performance</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Channels sorted by total inquiry registration volume</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-1">
            {sourcesBreakdown.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">No source records available</div>
            ) : (
              sourcesBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{item.count} Leads ({item.pct}%)</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-800/40">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Counselor rankings grid */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Counselor Performance Rankings</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Leaderboard of active counselors sorted by admissions closed</p>
        </div>

        {/* Counselor rankings table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10">
                <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-wider">Rank & Counselor</th>
                <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-wider">Active Workload</th>
                <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-wider">Admissions Confirmed</th>
                <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-wider">Conversion Rate</th>
                <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-wider">Target Achieved (Goal: 5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {counselorsPerformance.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 font-bold flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{c.activeLeads} Leads</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-850 dark:text-slate-100">{c.admissions} Confirmed</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-black text-emerald-600 dark:text-emerald-450">{c.conversionRate}%</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-850">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                          style={{ width: `${Math.min(c.targetAchieved, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{c.targetAchieved}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
