import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_COUNSELORS, ANALYTICS_TREND_DATA, ANALYTICS_SOURCE_DATA } from '../data/mockData';
import StatusBadge from '../components/Common/StatusBadge';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Heart, 
  Clock, 
  CheckCircle, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export default function DashboardPage() {
  const { leads: rawLeads, followups: rawFollowups } = useApp();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Filter leads and followups dynamically based on user role
  const leads = isAdmin ? rawLeads : rawLeads.filter(l => l.counselor_id === user?.id);
  const followups = isAdmin ? rawFollowups : rawFollowups.filter(f => f.counselor_id === user?.id || rawLeads.some(l => l.id === f.lead_id && l.counselor_id === user?.id));

  // 1. Calculate live KPI metrics
  const totalLeads = leads.length;
  const interested = leads.filter(l => l.status === 'Interested').length;
  const pending = leads.filter(l => l.status === 'Follow-Up Pending').length;
  const confirmed = leads.filter(l => l.status === 'Admission Confirmed').length;
  const conversionRate = totalLeads > 0 ? Math.round((confirmed / totalLeads) * 100) : 0;

  // Calculate some delta comparison for KPI cards
  const kpis = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      gradient: 'from-indigo-500/10 to-indigo-600/5 dark:from-indigo-500/20 dark:to-transparent',
      borderColor: 'border-indigo-500/20 dark:border-indigo-500/10',
      change: '+14% from last week',
      isPositive: true
    },
    {
      title: 'Interested Students',
      value: interested,
      icon: <Heart className="w-5 h-5 text-cyan-500" />,
      gradient: 'from-cyan-500/10 to-cyan-600/5 dark:from-cyan-500/20 dark:to-transparent',
      borderColor: 'border-cyan-500/20 dark:border-cyan-500/10',
      change: '+22% from last week',
      isPositive: true
    },
    {
      title: 'Pending Follow-Ups',
      value: pending,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      gradient: 'from-amber-500/10 to-amber-600/5 dark:from-amber-500/20 dark:to-transparent',
      borderColor: 'border-amber-500/20 dark:border-amber-500/10',
      change: '-5% since yesterday',
      isPositive: true // reduction in pending is positive
    },
    {
      title: 'Admissions Confirmed',
      value: confirmed,
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      gradient: 'from-emerald-500/10 to-emerald-600/5 dark:from-emerald-500/20 dark:to-transparent',
      borderColor: 'border-emerald-500/20 dark:border-emerald-500/10',
      change: '+8% this month',
      isPositive: true
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: <Percent className="w-5 h-5 text-purple-500" />,
      gradient: 'from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-transparent',
      borderColor: 'border-purple-500/20 dark:border-purple-500/10',
      change: '+4% overall conversion',
      isPositive: true
    }
  ];

  // 2. Prepare charts data dynamically
  // Monthly graph (mix mock with dynamic numbers)
  const monthlyGraphData = [...ANALYTICS_TREND_DATA];
  // update latest month (May) based on current leads
  const currentMonthIdx = monthlyGraphData.findIndex(d => d.month === 'May');
  if (currentMonthIdx !== -1) {
    monthlyGraphData[currentMonthIdx].Leads = Math.max(monthlyGraphData[currentMonthIdx].Leads, totalLeads * 10);
    monthlyGraphData[currentMonthIdx].Admissions = Math.max(monthlyGraphData[currentMonthIdx].Admissions, confirmed * 8);
  }

  // Source breakdown based on current leads
  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source || 'Google Search'] = (acc[lead.source || 'Google Search'] || 0) + 1;
    return acc;
  }, {});

  const dynamicSourceData = Object.keys(sourceCounts).map((key, idx) => {
    const defaultColors = ['#6366f1', '#9333ea', '#06b6d4', '#10b981', '#f97316', '#ec4899'];
    return {
      name: key,
      value: sourceCounts[key],
      color: defaultColors[idx % defaultColors.length]
    };
  });

  const finalSourceData = dynamicSourceData.length > 0 ? dynamicSourceData : ANALYTICS_SOURCE_DATA;

  // Counselor active workload compilation
  const counselorData = INITIAL_COUNSELORS.map(cn => {
    const counselorLeads = leads.filter(l => l.counselor?.full_name === cn.name || l.counselor === cn.name);
    const counselorConfirmed = counselorLeads.filter(l => l.status === 'Admission Confirmed').length;
    return {
      name: cn.name.split(' ')[0], // first name for chart label
      'Active Leads': counselorLeads.length || cn.activeLeads,
      'Conversions': counselorConfirmed || Math.round(cn.activeLeads * (cn.conversionRate / 100))
    };
  });

  // Recent leads list
  const recentLeads = leads.slice(0, 5);

  // Helper: get a field value from a lead's field_values array by label
  const getLeadFieldByLabel = (lead, label) => {
    const fv = (lead.field_values || []).find(
      v => (v.field?.label || '').toLowerCase() === label.toLowerCase()
    );
    return fv ? fv.value : '';
  };

  // Activity feed: vertical followups timeline
  const recentActivities = followups.slice(0, 5).map(f => {
    const lead = leads.find(l => l.id === f.leadId);
    return {
      id: f.id,
      leadName: lead ? lead.name : 'Unknown Student',
      leadId: f.leadId,
      type: f.type,
      notes: f.notes,
      counselor: f.counselor,
      time: new Date(f.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
  });

  // Follow-up type icons helper
  const getFupIcon = (type) => {
    switch (type) {
      case 'Call': return <Phone className="w-3.5 h-3.5 text-cyan-500" />;
      case 'Email': return <Mail className="w-3.5 h-3.5 text-indigo-500" />;
      case 'WhatsApp': return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <UserCheck className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Admissions Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
            Monitor student inquiries, counselor conversions, and follow-up activities in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/leads/add"
            className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md shadow-indigo-500/20 hover-scale"
          >
            + Add New Lead
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`glass-panel border ${kpi.borderColor} p-5 rounded-2xl flex flex-col justify-between bg-gradient-to-br ${kpi.gradient}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center shadow-sm">
                {kpi.icon}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                {kpi.value}
              </h3>
              <div className="flex items-center gap-1 mt-2.5 text-[10px] font-bold">
                {kpi.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className={kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'}>
                  {kpi.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (Left 2 columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Admissions Growth Trend</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Monthly summary of registered inquiries vs admissions confirmed</p>
            </div>
          </div>
          <div className="w-full h-[280px] text-xs">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyGraphData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(148, 163, 184, 0.5)" />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Leads" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="Admissions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAdmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie Chart (Right Column) */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Lead Source Analytics</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Channels bringing in the most inquiries</p>
          </div>
          <div className="w-full h-[220px] text-xs flex items-center justify-center relative mt-2">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={finalSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {finalSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Source</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                {finalSourceData.length > 0 
                  ? [...finalSourceData].sort((a,b)=> b.value - a.value)[0].name.split(' ')[0] 
                  : 'N/A'
                }
              </span>
            </div>
          </div>
          {/* Legenda Custom mapping */}
          <div className="grid grid-cols-2 gap-2 text-[10px] mt-4">
            {finalSourceData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-500 dark:text-slate-400 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* counselor metrics and widgets section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Counselor performance comparison (Left Column) */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Counselor Performance</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Active students vs completed admissions</p>
          </div>
          <div className="w-full h-[250px] text-xs">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={counselorData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Legend iconType="circle" />
                <Bar dataKey="Active Leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Inquiries List (Center Column) */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Recent Inquiries</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Latest students inquiries registered</p>
            </div>
            <Link to="/leads" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[250px] pr-1">
            {recentLeads.map((lead) => {
              const course = getLeadFieldByLabel(lead, 'Course of Interest') ||
                             getLeadFieldByLabel(lead, 'course') || 'Not specified';
              return (
                <Link
                  to={`/leads/${lead.id}`}
                  key={lead.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 dark:border-slate-800/40 dark:hover:border-indigo-900/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all duration-150 gap-3"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm">
                    {(lead.full_name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {lead.full_name || 'Unknown'}
                    </span>
                    <span className="block text-[10px] text-indigo-500 dark:text-indigo-400 font-medium truncate mt-0.5">
                      {course}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                      {lead.email || ''}
                    </span>
                  </div>
                  {/* Status */}
                  <div className="shrink-0 pt-0.5">
                    <StatusBadge status={lead.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Follow-up / Activity Timeline (Right Column) */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Counselor Activity Feed</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Timeline of recent student follow-ups</p>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[250px] pr-1 relative">
            {recentActivities.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-10">No recent activities log</div>
            ) : (
              recentActivities.map((act, i) => (
                <div key={act.id} className="relative flex gap-3 items-start group">
                  {/* Vertical line connector */}
                  {i < recentActivities.length - 1 && (
                    <span className="absolute left-[13px] top-[26px] bottom-[-20px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                  )}
                  {/* Icon */}
                  <div className="w-7.5 h-7.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm shrink-0 z-10">
                    {getFupIcon(act.type)}
                  </div>
                  {/* Content details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {act.leadName}
                      </span>
                      <span className="text-[9px] text-slate-400 shrink-0">{act.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed truncate">
                      {act.notes}
                    </p>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 block">
                      Logged by {act.counselor}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
