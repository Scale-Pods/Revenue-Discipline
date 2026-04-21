import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Users, 
  PhoneCall, 
  Table, 
  Layers, 
  Settings, 
  Search, 
  User, 
  Plus, 
  Calendar, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Database,
  Moon,
  Sun,
  Bell,
  Image as ImageIcon,
  Upload,
  X,
  Trash2,
  MessageSquare,
  Send,
  MoreVertical as More,
  Briefcase,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { 
  BrowserRouter, 
  Routes, 
  Route,
  Navigate, 
  NavLink, 
  useLocation
} from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import Loader from './components/ui/loader-4';

// --- MOCK DATA ---
// Initial leads removed for cleanup


const STAGES = ['DNP1', 'DNP2', 'DNP3', 'DNP4', 'DNP5'];

const LEAD_STATUSES = [
  'New',
  'Moved to Funnel',
  'Moved to FollowUp',
  'No Response',
  '1st msg',
  '2nd msg',
  '3rd msg',
  '4th msg',
  'Mailed',
  'Not intrested'
];

const META_STATUSES = [
  'Intro-Whatsapp',
  'Intro Done - Phone Call',
  'Intro Done - Whatsapp',
  'DNP 1',
  'DNP 2',
  'DNP 3',
  'DNP 4',
  'Never Responded',
  'Demo Booked',
  'Proposal Call Booked',
  'Proposal Call booked- No show',
  'Proposal Call Booked- Meeting done',
  'Proposal Call booked- Potential Pipeline- Stopped responding',
  'not interested',
  'Junk',
  'Demo Booked - No show'
];

// --- SUB-COMPONENTS ---

const Badge = ({ status }) => {
  const styles = {
    'Converted': 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
    'Follow-up': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    'DNP': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    'New': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    'Not Interested': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'not interested': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'Junk': 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20',
  };

  return (
    <span className={`badge border ${styles[status] || styles['New']}`}>
      {status}
    </span>
  );
};

const LinkedinLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0077b5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const UpworkLogo = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#14a800"><path d="M18.5 13c-1.1 0-2.1-.5-3.1-1.2l.2-1.1.1-.1c.2-1.1.8-3.1 2.8-3.1 1.5 0 2.7 1.2 2.7 2.7s-1.2 2.8-2.7 2.8zm0-8.1c-2.5 0-4.5 1.6-5.3 4.4-1.2-1.8-2.1-4-2.7-5.9H7.8v7.1c0 1.5-1.2 2.7-2.7 2.7S2.4 12 2.4 10.5V3.4H0v7.1c0 2.2 1.8 4.1 4 4.6l-.4 4.9h2.8l.4-4.9c.2 0 .5 0 .7 0 2.2 0 4-1.8 4-4.1V9.6c.5 1.2 1.2 2.8 2.2 4.3l-1.5 6.9h2.8l1-4.9c.6.2 1.2.3 1.8.3 3 0 5.5-2.5 5.5-5.5-.1-3.1-2.5-5.6-5.4-5.6z"/></svg>
);

const CompanyLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h.01"/><path d="M9 12h.01"/><path d="M9 15h.01"/><path d="M13 13h.01"/><path d="M13 16h.01"/><path d="M17 17h.01"/></svg>
);

const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
    <div className="mb-16 scale-150">
      <Loader />
    </div>
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-text-main font-black text-xl tracking-tight">Synchronizing Pipeline</h3>
      <p className="text-text-muted text-sm font-bold flex items-center gap-2">
        Fetching live data from servers
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
        </span>
      </p>
      <div className="mt-4 px-4 py-1.5 bg-brand-primary/10 rounded-full border border-brand-primary/20">
        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Processing Request</span>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: LucideIcon, colorClass }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold mt-2 text-text-main">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <LucideIcon size={24} />
      </div>
    </div>
  </div>
);

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, componentStack: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ componentStack: errorInfo?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-[#182229] p-10 rounded-[32px] border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-4">Render Error Caught</h2>
            <p className="text-sm text-[#8696a0] font-medium leading-relaxed mb-6">
              A component crashed during rendering. See the error below.
            </p>
            <div className="bg-[#0b141a] rounded-xl p-4 mb-6 text-left border border-rose-500/20 max-h-36 overflow-y-auto">
              <p className="text-rose-400 text-xs font-mono font-bold break-all">
                {this.state.error?.message || 'Unknown error'}
              </p>
              {this.state.componentStack && (
                <p className="text-slate-600 text-[10px] font-mono mt-2 whitespace-pre-wrap break-all">
                  {this.state.componentStack.slice(0, 500)}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 py-4 bg-brand-primary text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Reload
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null, componentStack: null })}
                className="flex-1 py-4 bg-white/5 text-[#8696a0] border border-white/10 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                Try Recover
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


const SourceAnalytics = ({ leads, currentView }) => {
  const COLORS = ['#00a884', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6'];
  const LI_COLORS = ['#0a66c2', '#00a884', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899'];
  const [metaFilter, setMetaFilter] = useState('All');
  const [liFilter, setLiFilter] = useState('All');
  const LI_FILTER_STATUSES = ['All', 'Moved to Funnel', 'Moved to FollowUp', 'No Response', '1st msg', '2nd msg', '3rd msg', '4th msg', 'Mailed', 'Not intrested'];
  
  // Localized Pipeline Composition Data for Current View
  const sourceLeads = leads.filter(l => l.source === currentView);
  const statusCounts = sourceLeads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const sourceData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  })).sort((a, b) => b.value - a.value);
  
  const renderStatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-card p-4 rounded-2xl border border-border-main shadow-2xl">
          <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest w-[160px] truncate" title={payload[0].name}>{payload[0].name}</p>
          <p className="text-3xl font-black text-brand-primary">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // ─── LINKEDIN-SPECIFIC ANALYTICS ─────────────────────────
  if (currentView === 'Linkedin') {
    // LinkedIn Outreach Status Distribution
    const liStatuses = ['Moved to Funnel', 'Moved to FollowUp', 'No Response', '1st msg', '2nd msg', '3rd msg', '4th msg', 'Mailed', 'Not intrested'];
    const liStatusCounts = {};
    sourceLeads.forEach(l => {
      const st = l.status || 'New';
      if (liStatuses.includes(st)) {
        liStatusCounts[st] = (liStatusCounts[st] || 0) + 1;
      } else {
        liStatusCounts['Other'] = (liStatusCounts['Other'] || 0) + 1;
      }
    });
    const liStatusData = Object.keys(liStatusCounts).map(key => ({
      name: key,
      count: liStatusCounts[key]
    })).sort((a, b) => b.count - a.count);

    // Employee Size Distribution
    const sizeCounts = {};
    sourceLeads.forEach(l => {
      const size = (l.employeeSize && l.employeeSize !== '-') ? l.employeeSize.toString().trim() : 'Unknown';
      sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    });
    const sizeData = Object.keys(sizeCounts).map(key => ({
      name: key,
      value: sizeCounts[key]
    })).sort((a, b) => b.value - a.value).slice(0, 7);

    // LinkedIn Outreach Funnel
    const liTotal = sourceLeads.length;
    const liAccepted = sourceLeads.filter(l => l.acceptanceDate && l.acceptanceDate !== '-' && l.acceptanceDate !== '').length;
    const liResponded = sourceLeads.filter(l => ['Moved to Funnel', 'Moved to FollowUp', 'Not intrested'].includes(l.status)).length;
    const liMovedToFunnel = sourceLeads.filter(l => l.status === 'Moved to Funnel').length;
    const liMovedToFollowUp = sourceLeads.filter(l => l.status === 'Moved to FollowUp').length;

    const liFunnelData = [
      { name: 'Requests Sent', count: liTotal },
      { name: 'Accepted', count: liAccepted },
      { name: 'Responded', count: liResponded },
      { name: 'Moved to Funnel', count: liMovedToFunnel }
    ];

    // LinkedIn KPI Calculations
    const acceptanceRate = liTotal > 0 ? Math.round((liAccepted / liTotal) * 100) : 0;
    const responseRate = liAccepted > 0 ? Math.round((liResponded / liAccepted) * 100) : 0;
    const funnelConvRate = liTotal > 0 ? Math.round((liMovedToFunnel / liTotal) * 100) : 0;

    const renderLiFunnelTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        const idx = liFunnelData.findIndex(d => d.name === data.name);
        const prev = idx > 0 ? liFunnelData[idx - 1].count : data.count;
        const passRate = prev > 0 ? Math.round((data.count / prev) * 100) : 0;
        const totalYield = liTotal > 0 ? Math.round((data.count / liTotal) * 100) : 0;
        return (
          <div className="bg-bg-card p-4 rounded-2xl border border-border-main shadow-2xl">
            <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest">{data.name}</p>
            <p className="text-3xl font-black text-[#0a66c2]">{data.count}</p>
            {idx > 0 && (
              <div className="mt-3 pt-3 border-t border-border-main space-y-1.5">
                <div className="flex justify-between items-center gap-6">
                  <span className="text-[9px] font-black uppercase text-text-muted">Stage Conv:</span>
                  <span className="text-[10px] font-bold text-text-main">{passRate}%</span>
                </div>
                <div className="flex justify-between items-center gap-6">
                  <span className="text-[9px] font-black uppercase text-text-muted">Overall Yield:</span>
                  <span className="text-[10px] font-bold text-[#0a66c2]">{totalYield}%</span>
                </div>
              </div>
            )}
          </div>
        );
      }
      return null;
    };

    const filteredLiLeads = liFilter === 'All' ? sourceLeads : sourceLeads.filter(l => l.status === liFilter);
    const liFilteredCount = filteredLiLeads.length;

    // Action-Oriented Tactical Metrics for LinkedIn Segment
    const now = new Date('2026-04-10');
    const liDormant = filteredLiLeads.filter(l => {
      if (!l.lastContact) return true;
      const diff = Math.floor((now - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
      return diff >= 7;
    }).length;
    
    const liMomentum = filteredLiLeads.filter(l => {
      if (!l.lastContact) return false;
      const diff = Math.floor((now - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
      return diff <= 1;
    }).length;

    return (
      <div className="mt-8 px-2 pb-6">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-text-main tracking-tight block">LinkedIn Intelligence</h2>
          <div className="h-px bg-border-main flex-1 hidden sm:block"></div>
        </div>

        {/* LinkedIn Status Filter Bar */}
        <div className="flex items-center gap-4 mb-6 bg-bg-card p-3 rounded-2xl border border-border-main shadow-xs">
          <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] shrink-0 pl-2">Filter by Status:</span>
          <select
            value={liFilter}
            onChange={(e) => setLiFilter(e.target.value)}
            className="flex-1 max-w-xs px-4 py-2.5 rounded-xl border border-border-main bg-bg-main text-xs font-black text-text-main outline-none focus:border-[#0a66c2] cursor-pointer appearance-none transition-all"
          >
            {LI_FILTER_STATUSES.map(s => (
              <option key={s} value={s}>{s === 'All' ? '✦ All Statuses' : s}</option>
            ))}
          </select>
          {liFilter !== 'All' && (
            <button
              onClick={() => setLiFilter('All')}
              className="px-4 py-2 bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0a66c2] hover:text-white transition-all"
            >
              Clear Filter
            </button>
          )}
          {liFilter !== 'All' && (
            <div className="ml-auto flex items-center gap-3 px-4 py-2 bg-bg-main rounded-xl border border-border-main">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Showing</span>
              <span className="text-lg font-black text-[#0a66c2]">{liFilteredCount}</span>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">of {liTotal}</span>
            </div>
          )}
        </div>

        {/* LinkedIn Charts container with fluid roll-up/down transition */}
        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
          liFilter === 'All' 
            ? 'max-h-[1500px] opacity-100 mb-8 translate-y-0 visible' 
            : 'max-h-0 opacity-0 mb-0 -translate-y-20 pointer-events-none invisible'
        }`}>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-[#0a66c2]/20 transition-colors duration-300">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">Pipeline Composition</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={renderStatusTooltip} cursor={false} />

                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Outreach Status Distribution */}
            <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-[#0a66c2]/20 transition-colors duration-300">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">Top Statuses - LinkedIn</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liStatusData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3942" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#8696a0', fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} tickFormatter={(value) => value.substring(0, 10) + '...'} />
                    <YAxis tick={{ fill: '#8696a0', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip content={renderStatusTooltip} cursor={{ fill: 'rgba(10, 102, 194, 0.05)' }} />
                    <Bar dataKey="count" fill="#0a66c2" radius={[6, 6, 0, 0]} barSize={30}>
                      {liStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={LI_COLORS[(index + 1) % LI_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Global Distribution */}
            <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-[#0a66c2]/20 transition-colors duration-300">
              <h3 className="text-xs font-black text-[#8b5cf6] uppercase tracking-[0.2em] mb-6 select-none">Company Size Breakdown</h3>
              <div className="h-[250px] w-full">
                {sizeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sizeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                        {sizeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={LI_COLORS[index % LI_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={renderStatusTooltip} cursor={false} />

                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-50">No company size data</p>
                  </div>
                )}
              </div>
            </div>

            {/* LinkedIn Outreach Funnel */}
            <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-[#0a66c2]/20 transition-colors duration-300 xl:col-span-2 2xl:col-span-3">
              <h3 className="text-xs font-black text-[#0a66c2] uppercase tracking-[0.2em] mb-6 select-none">LinkedIn Outreach Funnel</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liFunnelData} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3942" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#8696a0', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} width={120} />
                    <RechartsTooltip content={renderLiFunnelTooltip} cursor={{ fill: 'rgba(10, 102, 194, 0.05)' }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={25}>
                      {liFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={LI_COLORS[index % LI_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Overview of LinkedIn outreach activity / Segment Scorecards */}
        <div className="mt-8 mb-6 animate-fade-in-up">
          <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">
            {liFilter !== 'All' ? 'Segment Performance Scorecard' : 'Overview of your LinkedIn outreach activity'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Volume */}
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#0a66c2]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0">
              <div className="absolute inset-0 bg-[#0a66c2]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{liFilter !== 'All' ? 'Current Volume' : 'Invites Sent'}</p>
                <h3 className="text-4xl font-black text-text-main tracking-tight">
                  {liFilter !== 'All' ? liFilteredCount.toLocaleString() : liTotal.toLocaleString()}
                </h3>
                <p className="text-[11px] text-text-muted font-bold mt-1 opacity-70">
                  {liFilter !== 'All' ? 'Leads in focus' : 'Total connection requests'}
                </p>
              </div>
              <div className="bg-[#0a66c2]/10 dark:bg-white/10 p-4 rounded-2xl text-[#0a66c2] shadow-lg border border-[#0a66c2]/10 dark:border-white/5 relative z-10 transition-transform group-hover:scale-110 duration-300">
                <Users size={24} strokeWidth={2.5} />
              </div>
            </div>

            {/* Response Success / Accepted Requests */}
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#00a884]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0 delay-100">
              <div className="absolute inset-0 bg-[#00a884]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{liFilter !== 'All' ? 'Segment Weight' : 'Accepted Requests'}</p>
                <h3 className="text-4xl font-black text-text-main tracking-tight">
                  {liFilter !== 'All' ? `${Math.round((liFilteredCount / liTotal) * 100)}%` : liAccepted.toLocaleString()}
                </h3>
                <p className="text-[11px] text-[#00a884] font-black mt-1">
                  {liFilter !== 'All' ? 'Of LinkedIn pipeline' : `${acceptanceRate}% acceptance rate`}
                </p>
              </div>
              <div className="bg-[#00a884]/10 dark:bg-white/10 p-4 rounded-2xl text-[#00a884] shadow-lg border border-[#00a884]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
            </div>

            {/* Tactical Metric: Dormant Leads */}
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#f59e0b]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0 delay-200">
              <div className="absolute inset-0 bg-[#f59e0b]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{liFilter !== 'All' ? 'Dormant Leads' : 'Total Follow-ups'}</p>
                <h3 className="text-4xl font-black text-text-main tracking-tight">
                  {liFilter !== 'All' ? liDormant : (sourceLeads.filter(l => ['1st msg', '2nd msg', '3rd msg'].includes(l.status)).length).toLocaleString()}
                </h3>
                <p className="text-[11px] text-text-muted font-bold mt-1 opacity-70">
                  {liFilter !== 'All' ? 'Idle for 7+ days' : `Primary touchpoints`}
                </p>
              </div>
              <div className="bg-[#f59e0b]/10 dark:bg-white/10 p-4 rounded-2xl text-[#f59e0b] shadow-lg border border-[#f59e0b]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
                {liFilter !== 'All' ? <XCircle size={24} strokeWidth={2.5} /> : <Send size={24} strokeWidth={2.5} />}
              </div>
            </div>

            {/* Tactical Metric: Recent Momentum */}
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#8b5cf6]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0 delay-300">
              <div className="absolute inset-0 bg-[#8b5cf6]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{liFilter !== 'All' ? 'Recent Momentum' : 'Total Replies'}</p>
                <h3 className="text-4xl font-black text-text-main tracking-tight">
                  {liFilter !== 'All' ? liMomentum : liResponded.toLocaleString()}
                </h3>
                <p className="text-[11px] text-text-muted font-bold mt-1 opacity-70">
                  {liFilter !== 'All' ? 'Active in last 24h' : 'Responses received'}
                </p>
              </div>
              <div className="bg-[#8b5cf6]/10 dark:bg-white/10 p-4 rounded-2xl text-[#8b5cf6] shadow-lg border border-[#8b5cf6]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
                {liFilter !== 'All' ? <Send size={24} strokeWidth={2.5} /> : <MessageSquare size={24} strokeWidth={2.5} />}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ─── META-SPECIFIC ANALYTICS ─────────────────────────

  const META_FILTER_STATUSES = [
    'All', 'Intro-Whatsapp', 'Intro Done - Phone Call', 'Intro Done - Whatsapp',
    'DNP 1', 'DNP 2', 'DNP 3', 'DNP 4', 'FUP', 'Never Responded',
    'Demo Booked', 'Demo Booked - No show',
    'Proposal Call Booked', 'Proposal Call booked- No show',
    'Proposal Call Booked- Meeting done', 'Proposal Call booked- Potential Pipeline- Stopped responding',
    'not interested', 'Junk', 'Junk lead'
  ];

  const totalMetaLeads = sourceLeads.length;
  const filteredLeads = metaFilter === 'All' ? sourceLeads : sourceLeads.filter(l => l.status === metaFilter);
  const filteredCount = filteredLeads.length;
  const filteredPercent = totalMetaLeads > 0 ? Math.round((filteredCount / totalMetaLeads) * 100) : 0;

  // Filtered Status Distribution
  const fStatusCounts = filteredLeads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const fStatusData = Object.keys(fStatusCounts).map(key => ({
    name: key,
    count: fStatusCounts[key]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  // Attrition from filtered leads
  const attritionStatuses = ['DNP 1', 'DNP 2', 'DNP 3', 'DNP 4', 'Never Responded', 'not interested', 'Junk', 'Demo Booked - No show', 'Proposal Call booked- No show', 'Proposal Call booked- Potential Pipeline- Stopped responding'];
  const attritionCounts = filteredLeads.filter(l => attritionStatuses.includes(l.status)).reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});
  const attritionData = Object.keys(attritionCounts).map(key => ({
    name: key,
    value: attritionCounts[key]
  })).sort((a,b) => b.value - a.value).slice(0, 5);

  // Funnel from filtered leads
  const introsList = ['Intro-Whatsapp', 'Intro Done - Phone Call', 'Intro Done - Whatsapp', 'FUP'];
  const demosList = ['Demo Booked', 'Demo Booked - No show'];
  const proposalsList = ['Proposal Call Booked', 'Proposal Call booked- No show', 'Proposal Call Booked- Meeting done', 'Proposal Call booked- Potential Pipeline- Stopped responding'];
  
  const proposalsCount = filteredLeads.filter(l => proposalsList.includes(l.status)).length;
  const demosCount = filteredLeads.filter(l => demosList.includes(l.status)).length + proposalsCount;
  const engagedCount = filteredLeads.filter(l => introsList.includes(l.status)).length + demosCount;

  const funnelData = [
    { name: 'Universe', count: filteredLeads.length },
    { name: 'Engaged', count: engagedCount },
    { name: 'Demos Rated', count: demosCount },
    { name: 'Proposals', count: proposalsCount }
  ];

  const universe = filteredLeads.length;
  const engagedRate = universe > 0 ? Math.round((engagedCount / universe) * 100) : 0;
  const demoRate = engagedCount > 0 ? Math.round((demosCount / engagedCount) * 100) : 0;
  const proposalRate = demosCount > 0 ? Math.round((proposalsCount / demosCount) * 100) : 0;

  // Action-Oriented Tactical Metrics
  const now = new Date('2026-04-10'); // Simulated current date
  const dormantLeads = filteredLeads.filter(l => {
    if (!l.lastContact) return true;
    const diff = Math.floor((now - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
    return diff >= 7;
  }).length;
  
  const recentMomentum = filteredLeads.filter(l => {
    if (!l.lastContact) return false;
    const diff = Math.floor((now - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
    return diff <= 1;
  }).length;

  const renderFunnelTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const index = funnelData.findIndex(d => d.name === data.name);
      const previous = index > 0 ? funnelData[index - 1].count : data.count;
      const rate = previous > 0 ? Math.round((data.count / previous) * 100) : 0;
      const overallRate = filteredLeads.length > 0 ? Math.round((data.count / filteredLeads.length) * 100) : 0;

      return (
        <div className="bg-bg-card p-4 rounded-2xl border border-border-main shadow-2xl">
          <p className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-widest">{data.name}</p>
          <p className="text-3xl font-black text-brand-primary">{data.count}</p>
          {index > 0 && (
            <div className="mt-3 pt-3 border-t border-border-main space-y-1.5">
              <div className="flex justify-between items-center gap-6">
                <span className="text-[9px] font-black uppercase text-text-muted">Pass-Through Rate:</span>
                <span className="text-[10px] font-bold text-text-main">{rate}%</span>
              </div>
              <div className="flex justify-between items-center gap-6">
                <span className="text-[9px] font-black uppercase text-text-muted">Total Yield:</span>
                <span className="text-[10px] font-bold text-brand-primary">{overallRate}%</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 px-2 pb-6">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-text-main tracking-tight block">Macro Telemetry</h2>
        <div className="h-px bg-border-main flex-1 hidden sm:block"></div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex items-center gap-4 mb-6 bg-bg-card p-3 rounded-2xl border border-border-main shadow-xs">
        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] shrink-0 pl-2">Filter by Status:</span>
        <select
          value={metaFilter}
          onChange={(e) => setMetaFilter(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2.5 rounded-xl border border-border-main bg-bg-main text-xs font-black text-text-main outline-none focus:border-brand-primary cursor-pointer appearance-none transition-all"
        >
          {META_FILTER_STATUSES.map(s => (
            <option key={s} value={s}>{s === 'All' ? '✦ All Statuses' : s}</option>
          ))}
        </select>
        {metaFilter !== 'All' && (
          <button
            onClick={() => setMetaFilter('All')}
            className="px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
          >
            Clear Filter
          </button>
        )}
        {metaFilter !== 'All' && (
          <div className="ml-auto flex items-center gap-3 px-4 py-2 bg-bg-main rounded-xl border border-border-main">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Showing</span>
            <span className="text-lg font-black text-brand-primary">{filteredCount}</span>
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">of {totalMetaLeads}</span>
          </div>
        )}
      </div>

      {/* Charts container with fluid roll-up/down transition */}
      <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
        metaFilter === 'All' 
          ? 'max-h-[1500px] opacity-100 mb-8 translate-y-0 visible' 
          : 'max-h-0 opacity-0 mb-0 -translate-y-20 pointer-events-none invisible'
      }`}>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-brand-primary/20 transition-colors duration-300">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">Pipeline Composition</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={renderStatusTooltip} cursor={false} />

                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-brand-primary/20 transition-colors duration-300">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">Top Statuses - Meta</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fStatusData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3942" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#8696a0', fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} tickFormatter={(value) => value.substring(0, 10) + '...'} />
                  <YAxis tick={{ fill: '#8696a0', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={renderStatusTooltip} cursor={{ fill: 'rgba(0, 168, 132, 0.05)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30}>
                    {fStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-brand-primary/20 transition-colors duration-300">
            <h3 className="text-xs font-black text-[#f43f5e] uppercase tracking-[0.2em] mb-6 select-none">Attrition Analysis</h3>
            <div className="h-[250px] w-full">
              {attritionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attritionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {attritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={renderStatusTooltip} cursor={false} />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-50">Zero friction reported</p>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-bg-card p-6 border border-border-main shadow-xl rounded-[32px] hover:border-brand-primary/20 transition-colors duration-300 xl:col-span-2 2xl:col-span-3">
            <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] mb-6 select-none">Conversion Funnel</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3942" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#8696a0', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={renderFunnelTooltip} cursor={{ fill: 'rgba(0, 168, 132, 0.05)' }} />
                  <Bar dataKey="count" fill="#00a884" radius={[0, 6, 6, 0]} barSize={25}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>



      {/* Macro Funnel Overview / Segment Scorecards */}
      <div className="mt-8 mb-6 animate-fade-in-up">
        <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">
          {metaFilter !== 'All' ? 'Segment Performance Scorecard' : 'Macro Funnel Performance'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Main Metric */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#00a884]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0">
            <div className="absolute inset-0 bg-[#00a884]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Current Volume' : 'Total Universe'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? filteredCount.toLocaleString() : universe.toLocaleString()}
              </h3>
              <p className="text-[11px] text-text-muted font-bold mt-1 opacity-70">
                {metaFilter !== 'All' ? 'Leads in active focus' : 'All registered leads'}
              </p>
            </div>
            <div className="bg-[#00a884]/10 dark:bg-white/10 p-4 rounded-2xl text-[#00a884] shadow-lg border border-[#00a884]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              {metaFilter !== 'All' ? <Users size={24} strokeWidth={2.5} /> : <Database size={24} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Engagement Status */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#3b82f6]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0 delay-100">
            <div className="absolute inset-0 bg-[#3b82f6]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Segment Weight' : 'Engaged Leads'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? filteredPercent : engagedCount.toLocaleString()}
                {metaFilter !== 'All' && <span className="text-xl">%</span>}
              </h3>
              <p className="text-[11px] text-[#3b82f6] font-black mt-1">
                {metaFilter !== 'All' ? 'Of source pipeline' : `${engagedRate}% engagement yield`}
              </p>
            </div>
            <div className="bg-[#3b82f6]/10 dark:bg-white/10 p-4 rounded-2xl text-[#3b82f6] shadow-lg border border-[#3b82f6]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              <MessageSquare size={24} strokeWidth={2.5} />
            </div>
          </div>

          {/* Dormant Leads Tracking */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#f59e0b]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0 delay-200">
            <div className="absolute inset-0 bg-[#f59e0b]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Dormant Leads' : 'Demos Conducted'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? dormantLeads : demosCount.toLocaleString()}
              </h3>
              <p className="text-[11px] text-[#f59e0b] font-black mt-1">
                {metaFilter !== 'All' ? 'Idle for 7+ days' : `${demoRate}% demo pass-through`}
              </p>
            </div>
            <div className="bg-[#f59e0b]/10 dark:bg-white/10 p-4 rounded-2xl text-[#f59e0b] shadow-lg border border-[#f59e0b]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              {metaFilter !== 'All' ? <XCircle size={24} strokeWidth={2.5} /> : <Layers size={24} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Recent Momentum Tracking */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#00a884]/30 transition-all duration-300 relative overflow-hidden animate-zoom-fade opacity-0 delay-300">
            <div className="absolute inset-0 bg-[#00a884]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Recent Momentum' : 'Proposals Sent'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? recentMomentum : proposalsCount.toLocaleString()}
              </h3>
              <p className="text-[11px] text-[#00a884] font-black mt-1">
                {metaFilter !== 'All' ? 'Active in last 24h' : `${proposalRate}% conversion yield`}
              </p>
            </div>
            <div className="bg-[#00a884]/10 dark:bg-white/10 p-4 rounded-2xl text-[#00a884] shadow-lg border border-[#00a884]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              {metaFilter !== 'All' ? <Send size={24} strokeWidth={2.5} /> : <Send size={24} strokeWidth={2.5} />}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

const Sidebar = ({ theme, user, onLogout }) => (
  <aside className="fixed left-0 top-0 h-full w-64 bg-bg-sidebar border-r border-border-main z-50 flex flex-col transition-colors duration-300">
    <div className="p-6">
      <div className="flex items-center justify-center">
        <img 
          src="https://framerusercontent.com/images/sTvMZBHEzwH4fTjPgKO2PS3htho.png?scale-down-to=2048&width=2363&height=2363" 
          alt="ScalePods Logo" 
          className={`h-[170px] w-auto object-contain transition-all duration-300 ${theme === 'light' ? 'brightness-0' : ''}`}
        />
      </div>
    </div>
    
    <nav className="flex-1 px-4 space-y-1 mt-4">
      {[
        { name: 'Dashboard', icon: Layers, path: '/dashboard' },
        { name: 'Leads', icon: Users, path: '/leads' },
        { name: 'DNP Pipeline', icon: Table, path: '/dnp' },
        { name: 'Settings', icon: Settings, path: '/settings' },
      ].map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => `sidebar-link w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-bold ${isActive ? 'sidebar-link-active shadow-md shadow-brand-primary/20' : 'text-text-muted hover:bg-brand-primary/10 hover:text-brand-primary'}`}
        >
          <item.icon size={20} className="mr-3" />
          {item.name}
        </NavLink>
      ))}
    </nav>

    <div className="p-4 mt-auto border-t border-border-main relative group cursor-pointer">
      {/* Profile Info - Fades out on hover */}
      <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'} group-hover:opacity-0 group-hover:scale-95`}>
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 font-bold overflow-hidden">
          {user?.photoURL ? <img src={user.photoURL} alt="User" /> : user?.displayName?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-text-main truncate">{user?.displayName || 'User'}</p>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest truncate">{user?.email}</p>
        </div>
      </div>

      {/* Logout Overlay - Fades in on hover */}
      <div className="absolute inset-x-4 inset-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto flex items-center justify-center">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/30 shadow-xl shadow-rose-500/10"
        >
          <LogIn size={14} className="rotate-180" />
          Terminate Session
        </button>
      </div>
    </div>
  </aside>
);

const TopBar = ({ searchQuery, setSearchQuery, onAddLead, theme, toggleTheme }) => (
  <header className="fixed top-0 right-0 left-64 h-20 bg-bg-sidebar/80 backdrop-blur-xl border-b border-border-main z-40 px-12 flex items-center justify-between shadow-xs transition-colors duration-300">
    <div className="relative w-96 group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors" size={20} />
      <input
        type="text"
        placeholder="Search prospects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-bg-main border border-border-main focus:bg-bg-sidebar focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary rounded-xl outline-none text-sm font-medium transition-all text-text-main"
      />
    </div>
    
    <div className="flex items-center gap-4">


      <div className="flex items-center gap-2 ml-2">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-bg-main border border-border-main text-text-muted hover:text-brand-primary hover:bg-bg-card transition-all shadow-xs"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2.5 rounded-xl bg-bg-main border border-border-main text-text-muted hover:text-brand-primary hover:bg-bg-card transition-all shadow-xs relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-bg-sidebar"></span>
        </button>
      </div>

      <div className="w-px h-6 bg-border-main mx-1" />

      <button 
        onClick={onAddLead}
        className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
      >
        <Plus size={18} />
        Add Lead
      </button>
    </div>
  </header>
);

const LeadModal = ({ onClose, onSubmit, formData, setFormData, activeSource, isSubmitting, linkedInAccounts }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const getPreview = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border-main">
        <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-main/50">
          <div>
            <h2 className="text-xl font-bold text-text-main leading-tight">Add New Lead</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-0.5">Registration Gateway</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors p-2 hover:bg-bg-card rounded-xl">
            <X size={24} />
          </button>
        </div>

        {/* Platform Toggle */}
        <div className="px-6 pt-6">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-bg-main border border-border-main rounded-2xl">
            {[
              { 
                id: 'Meta', 
                label: 'Meta', 
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )
              },
              { 
                id: 'Linkedin', 
                label: 'LinkedIn', 
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0077b5">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                )
              },
              { 
                id: 'Upwork', 
                label: 'Upwork', 
                icon: () => (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#14a800">
                    <path d="M18.5 13c-1.1 0-2.1-.5-3.1-1.2l.2-1.1.1-.1c.2-1.1.8-3.1 2.8-3.1 1.5 0 2.7 1.2 2.7 2.7s-1.2 2.8-2.7 2.8zm0-8.1c-2.5 0-4.5 1.6-5.3 4.4-1.2-1.8-2.1-4-2.7-5.9H7.8v7.1c0 1.5-1.2 2.7-2.7 2.7S2.4 12 2.4 10.5V3.4H0v7.1c0 2.2 1.8 4.1 4 4.6l-.4 4.9h2.8l.4-4.9c.2 0 .5 0 .7 0 2.2 0 4-1.8 4-4.1V9.6c.5 1.2 1.2 2.8 2.2 4.3l-1.5 6.9h2.8l1-4.9c.6.2 1.2.3 1.8.3 3 0 5.5-2.5 5.5-5.5-.1-3.1-2.5-5.6-5.4-5.6z"/>
                  </svg>
                )
              }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFormData({ ...formData, source: p.id })}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300 ${
                  formData.source === p.id 
                    ? 'bg-bg-card shadow-lg border border-border-main ring-1 ring-brand-primary/20' 
                    : 'opacity-40 hover:opacity-100 hover:bg-bg-card/50'
                }`}
              >
                <p.icon />
                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.source === p.id ? 'text-text-main' : 'text-text-muted'}`}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {formData.source !== 'Upwork' && formData.source !== 'Linkedin' && (
            <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 space-y-5 animate-in slide-in-from-top-4 duration-300">
               <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                Meta Lead Intelligence
              </h3>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">
                  Full Name {formData.source === 'Meta' && <span className="text-[7px] font-normal opacity-60 lowercase">(optional)</span>}
                </label>
                <input
                  required={formData.source !== 'Meta' && formData.source !== 'Upwork' && formData.source !== 'Linkedin'}
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  placeholder="e.g. Mithul"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">
                  Phone Number {formData.source === 'Meta' && <span className="text-[7px] font-normal opacity-60 lowercase">(optional)</span>}
                </label>
                <input
                  required={formData.source !== 'Meta' && formData.source !== 'Upwork' && formData.source !== 'Linkedin'}
                  type="tel"
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          )}

          {formData.source === 'Linkedin' && (
            <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 space-y-5 animate-in slide-in-from-top-4 duration-300">
               <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                LinkedIn Prospecting Intelligence
              </h3>

               <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">LinkedIn Account</label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  value={formData.linkedInAccount}
                  onChange={e => setFormData({...formData, linkedInAccount: e.target.value})}
                >
                  {linkedInAccounts.map(acc => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  placeholder="e.g. Mithul"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">LinkedIn Link</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Company Link</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  placeholder="https://company.com"
                  value={formData.companyUrl}
                  onChange={e => setFormData({...formData, companyUrl: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Company Size</label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                    value={formData.employeeSize}
                    onChange={e => setFormData({...formData, employeeSize: e.target.value})}
                  >
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Additional Info</label>
                <textarea
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-medium text-text-main outline-none min-h-[80px]"
                  placeholder="Record specific lead intelligence..."
                  value={formData.additionalInfo}
                  onChange={e => setFormData({...formData, additionalInfo: e.target.value})}
                ></textarea>
              </div>
            </div>
          )}
          
          {formData.source !== 'Upwork' && formData.source !== 'Linkedin' && (
            <div className="flex flex-col items-center py-6 border-y border-border-main/50 my-2">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Lead Documentation (Screenshots)</label>
              <div className="flex flex-wrap justify-center gap-4 mb-3">
                {formData.images.map((file, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border-main group shadow-sm transition-transform hover:scale-105">
                    <img src={getPreview(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-rose-500/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-border-main rounded-2xl cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-text-muted hover:text-brand-primary bg-bg-main/50 group">
                  <div className="p-2 bg-bg-card rounded-lg group-hover:scale-110 transition-transform">
                    <Upload size={20} />
                  </div>
                  <span className="text-[9px] font-black mt-2 uppercase tracking-widest">Upload</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />
                </label>
              </div>
            </div>
          )}

          {formData.source !== 'Meta' && formData.source !== 'Upwork' && formData.source !== 'Linkedin' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Current Status</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-border-main bg-bg-main outline-none focus:border-brand-primary text-text-main font-bold appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option>New</option>
                    <option>Follow-up</option>
                    <option>DNP</option>
                    <option>Not Interested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Follow-up Date</label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2.5 rounded-xl border ${!formData.nextFollowUp ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/10' : 'border-border-main bg-bg-main'} outline-none text-sm text-text-main font-bold transition-all`}
                    value={formData.nextFollowUp}
                    onChange={e => setFormData({...formData, nextFollowUp: e.target.value})}
                  />
                  {!formData.nextFollowUp && (
                    <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1.5 font-black uppercase tracking-widest pl-1">* Requirement</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Contextual Notes</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-border-main bg-bg-main outline-none min-h-[100px] text-text-main font-medium placeholder:font-normal transition-all focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary"
                  placeholder="Record specific lead intelligence..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>
            </>
          )}

          {formData.source === 'Upwork' && (
            <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 space-y-5 animate-in slide-in-from-top-4 duration-300">
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></div>
                Upwork Intelligence
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Apply Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                    value={formData.upworkApplyDate}
                    onChange={e => setFormData({...formData, upworkApplyDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Connects Used</label>
                  <input
                    type="number"
                    placeholder="e.g. 16"
                    className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                    value={formData.upworkConnects}
                    onChange={e => setFormData({...formData, upworkConnects: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Upwork Link</label>
                <input
                  type="url"
                  placeholder="https://upwork.com/jobs/..."
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  value={formData.upworkUrl}
                  onChange={e => setFormData({...formData, upworkUrl: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Job Type</label>
                <input
                  type="text"
                  placeholder="e.g. Fixed-price, Hourly"
                  className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  value={formData.upworkJobType}
                  onChange={e => setFormData({...formData, upworkJobType: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Amount Quoted</label>
                  <input
                    type="text"
                    placeholder="$500"
                    className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                    value={formData.upworkAmountQuoted}
                    onChange={e => setFormData({...formData, upworkAmountQuoted: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1">Bid Amount</label>
                  <input
                    type="text"
                    placeholder="$450"
                    className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                    value={formData.upworkBidAmount}
                    onChange={e => setFormData({...formData, upworkBidAmount: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                UPDATING REPOSITORY...
              </>
            ) : 'Save Lead Info'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AccountModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    await onSave(name.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-bg-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-border-main">
        <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-main/50">
          <h2 className="text-lg font-bold text-text-main">Add LinkedIn Account</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
             <XCircle size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-2">Account Identity</label>
            <input
              autoFocus
              required
              type="text"
              placeholder="e.g. Adnan / Sales Rep"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-main bg-bg-main focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-bold text-text-main"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-300 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : '+ Register Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const AppContent = ({ 
  theme, toggleTheme, searchQuery, setSearchQuery, setShowAddForm, 
  renderDashboard, renderLeads, renderDNP, updateLeadAccount,
  activeSource, setFormData, user, onLogout 
}) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Lead Operations Center';
      case '/leads': return 'Leads';
      case '/dnp': return 'DNP Pipeline';
      case '/settings': return 'Settings';
      default: return 'Lead Operations Center';
    }
  };

  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-300">
      <Sidebar theme={theme} user={user} onLogout={onLogout} />
      
      <main className="pl-64 pt-20">
        <TopBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onAddLead={() => {
            setFormData(prev => ({ ...prev, source: activeSource === 'All' ? 'Meta' : activeSource }));
            setShowAddForm(true);
          }}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="px-12 py-10 w-full overflow-x-hidden">
          <div className="mb-12 border-b border-border-main pb-8">
            <h1 className="text-5xl font-black text-text-main tracking-tighter mb-4">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full border border-brand-primary/20 text-[10px] font-black uppercase tracking-widest">
                  Active Session
               </div>
               <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] opacity-60">
                {location.pathname === '/dashboard' ? 'OPTIMIZING SALES CONVERSIONS THROUGH DATA INTERPRETATION' : 'SYSTEM DIRECTORY ACCESS'}
               </p>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={renderDashboard()} />
            <Route path="/leads" element={renderLeads()} />
            <Route path="/dnp" element={renderDNP()} />
            <Route path="/settings" element={
              <div className="card p-24 text-center">
                <Settings size={64} className="mx-auto text-brand-primary opacity-20 mb-8" />
                <h2 className="text-2xl font-black text-text-main tracking-tight">Configuration Locked</h2>
                <p className="text-text-muted mt-4 font-bold uppercase tracking-widest text-xs">Administrative credentials required for modification.</p>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const TERMINAL_STATUSES = ['converted', 'not intrested', 'not interested', 'junk'];

const DISPOSITION_GROUPS = {
  'Intro Phase': ['Intro-Whatsapp', 'Intro Done - Phone Call', 'Intro Done - Whatsapp'],
  'DNP / Outreach': ['DNP 1', 'DNP 2', 'DNP 3', 'DNP 4', 'Never Responded'],
  'Sales Funnel': [
    'Demo Booked', 'Proposal Call Booked', 'Proposal Call booked- No show', 
    'Proposal Call Booked- Meeting done', 'Proposal Call booked- Potential Pipeline- Stopped responding',
    'Demo Booked - No show'
  ],
  'Terminal': ['not interested', 'Junk']
};

const LINKEDIN_DISPOSITION_GROUPS = {
  'Outreach Status': ['1st msg', '2nd msg', '3rd msg', 'Mailed'],
  'Conversational Flow': ['No Response', 'Moved to Funnel', 'Moved to FollowUp']
};

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [leads, setLeads] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingSource, setLoadingSource] = useState(null);
  const [activeSource, setActiveSource] = useState(localStorage.getItem('activeSource') || 'Meta');
  const [activeAccount, setActiveAccount] = useState(localStorage.getItem('activeAccount') || 'All Accounts');
  const [linkedInAccounts, setLinkedInAccounts] = useState(['All Accounts']);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [tempSummary, setTempSummary] = useState('');
  const [isJobTypeExpanded, setIsJobTypeExpanded] = useState(false);
  const [activeChatLead, setActiveChatLead] = useState(null);
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeDashboardDropdown, setActiveDashboardDropdown] = useState(null);

  // Persistence management
  useEffect(() => {
    localStorage.setItem('activeSource', activeSource);
    localStorage.setItem('activeAccount', activeAccount);
    localStorage.setItem('theme', theme);
  }, [activeSource, activeAccount, theme]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    status: 'New',
    nextFollowUp: '',
    images: [],
    source: localStorage.getItem('activeSource') || 'Meta',
    upworkBidAmount: '',
    linkedinUrl: '',
    companyUrl: '',
    employeeSize: '11-50',
    linkedInAccount: 'All Accounts',
    additionalInfo: ''
  });

  const today = new Date().toLocaleDateString('en-CA'); // Gets YYYY-MM-DD in local time accurately

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  const leadsDueToday = leads.filter(l => {
    const isDue = l.nextFollowUp === today;
    const isNotTerminal = !TERMINAL_STATUSES.includes((l.status || '').toLowerCase());
    const matchesSource = activeSource === 'All' || l.source === activeSource;
    const matchesAccount = activeSource !== 'Linkedin' || activeAccount === 'All Accounts' || l.linkedInAccount === activeAccount;
    return isDue && isNotTerminal && matchesSource && matchesAccount;
  });

  const filteredLeads = leads.filter(l => {
    const name = l.name || '';
    const phone = l.phone || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         phone.includes(searchQuery);
    const matchesSource = activeSource === 'All' || l.source === activeSource;
    const matchesAccount = activeSource !== 'Linkedin' || activeAccount === 'All Accounts' || l.linkedInAccount === activeAccount;
    return matchesSearch && matchesSource && matchesAccount;
  });

  useEffect(() => {
    fetchLinkedInAccounts();
  }, []);

  const fetchLinkedInAccounts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_FETCH_LEADS}?action=LinkedinACC`);
      if (!response.ok) return;
      const data = await response.json();
      
      let names = [];
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          for (let i = 1; i <= 10; i++) {
            const accName = item[i.toString()];
            if (accName && typeof accName === 'string' && accName.trim()) {
              names.push(accName.trim());
            }
          }
        });
      } else if (Array.isArray(data)) {
        names = data.map(item => {
          if (typeof item === 'string') return item;
          return item['Linkedin Account'] || item.account || item.name || item.fullName;
        });
      }

      if (names.length > 0) {
        setLinkedInAccounts(['All Accounts', ...new Set(names)]);
      }
    } catch (error) {
      console.error('Account fetch error:', error);
    }
  };

  const addNewAccount = async (name) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ADD_ACCOUNT}?action=LinkedinACC`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
      });
      
      if (response.ok) {
        setShowAccountModal(false);
        fetchLinkedInAccounts();
      } else {
        throw new Error('Failed to add account');
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Could not add account. Please try again.');
    }
  };

  const fetchSourceLeads = async (source) => {
    setLoadingSource(source);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_FETCH_LEADS}?action=${source.toUpperCase()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      let incomingLeads = [];
      if (Array.isArray(data)) {
        incomingLeads = data;
      } else if (data.leads && Array.isArray(data.leads)) {
        incomingLeads = data.leads;
      } else if (data.data && Array.isArray(data.data)) {
        incomingLeads = data.data;
      } else if (data.rows && Array.isArray(data.rows)) {
        incomingLeads = data.rows;
      } else if (typeof data === 'object' && data !== null) {
        const nestedArray = Object.values(data).find(val => Array.isArray(val));
        incomingLeads = nestedArray || [data];
      } else {
        incomingLeads = [data];
      }
      
      const newLeads = incomingLeads.map((item, idx) => {
        let name = item.Name || item.name || item['Prospect Name'] || item['Name/Company'] || item.fullName || '';
        const roleRaw = item['Additional info '] || item['Additional info'] || item['additional info'] || '';
        const role = roleRaw.toString().trim();
        const linkedinUrl = item['Linkedin Link'] || item.linkedin || null;
        const companyUrl = item['Company'] || item.company_website || null;
        
        if ((!name || name.toLowerCase().includes('linkedin')) && linkedinUrl) {
           const match = linkedinUrl.match(/\/in\/([^/]+)/);
           if (match && match[1]) {
             const segments = match[1].split(/[/-]/);
             if (segments.length > 1 && /[0-9]/.test(segments[segments.length - 1])) {
               segments.pop();
             }
             name = segments.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
           }
        }
        
        const finalDisplayName = (source === 'Linkedin' && role) ? `${name} - ${role}` : name;
        if (!finalDisplayName) {
          name = source === 'Meta' ? (item.phone || item['Lead Phone No'] || 'Meta Prospect') : ('Lead from ' + source);
        }
        const phone = item['Lead Phone No'] || item.phone || item.mobile || '---';
        const rawStage = item['Lead stages'] || item.stage || '';
        const rawStatus = item['Status'] || item.status || (rawStage.toLowerCase().includes('junk') ? 'Not intrested' : 'New');
        
        let finalStatus = 'New';
        if (source === 'Meta') {
          finalStatus = META_STATUSES.includes(rawStatus) ? rawStatus : (LEAD_STATUSES.includes(rawStatus) ? rawStatus : 'New');
        } else {
          finalStatus = LEAD_STATUSES.includes(rawStatus) ? rawStatus : 'New';
        }
        
        const notes = [
          rawStatus,
          item.col_9,
          item.col_11,
          item.col_12,
          item.col_8 ? `Location: ${item.col_8}` : ''
        ].filter(Boolean).join(' | ') || `Direct sync from ${source}`;

        // ─── DATE NORMALIZATION ENGINE ─────────────────────────────────────
        // Converts any date format to YYYY-MM-DD. Returns null if not a real date.
        const normalizeDateForCheck = (rawVal) => {
          if (rawVal === null || rawVal === undefined || rawVal === '' || rawVal === '-') return null;

          // ── Excel serial number (e.g. 45392) ─────────────────────────────
          const numVal = Number(rawVal);
          if (!isNaN(numVal) && numVal > 40000 && numVal < 60000) {
            // Excel epoch is 1899-12-30
            const excelEpoch = new Date(1899, 11, 30);
            const d = new Date(excelEpoch.getTime() + numVal * 86400000);
            if (!isNaN(d.getTime())) {
              return d.toISOString().split('T')[0];
            }
          }

          // ── Must be a string from here ────────────────────────────────────
          const str = rawVal.toString().trim();
          if (!str || str.toLowerCase() === 'done') return null;

          // Strip trailing "Done" or date-stamp suffix (e.g. "14/04/26 Done")
          const stripped = str.replace(/\s*done\s*/gi, '').trim();
          if (!stripped) return null;

          // ── Try YYYY-MM-DD (already normalized) ───────────────────────────
          if (/^\d{4}-\d{2}-\d{2}$/.test(stripped)) return stripped;

          // ── Split on / or - ───────────────────────────────────────────────
          const parts = stripped.split(/[\/\-]/);
          if (parts.length !== 3) return null;

          const [a, b, c] = parts.map(p => p.trim());

          // All parts must be numeric
          if (!/^\d+$/.test(a) || !/^\d+$/.test(b) || !/^\d+$/.test(c)) return null;

          let year, month, day;

          if (a.length === 4) {
            // YYYY/MM/DD or YYYY-MM-DD
            year = a; month = b; day = c;
          } else if (c.length === 4) {
            // DD/MM/YYYY or MM/DD/YYYY — infer by value
            // If a > 12, it must be day; else assume DD/MM/YYYY (common in India)
            day = a; month = b; year = c;
          } else {
            // DD/MM/YY  or  YY/MM/DD — assume DD/MM/YY (Indian convention)
            day = a; month = b;
            year = (parseInt(c) < 50) ? '20' + c : '19' + c;
          }

          const iDay   = parseInt(day,   10);
          const iMonth = parseInt(month, 10);
          const iYear  = parseInt(year,  10);

          // Sanity check
          if (iMonth < 1 || iMonth > 12) return null;
          if (iDay   < 1 || iDay   > 31) return null;
          if (iYear  < 2000 || iYear > 2100) return null;

          return `${iYear}-${String(iMonth).padStart(2, '0')}-${String(iDay).padStart(2, '0')}`;
        };

        // ─── FOLLOW-UP DATE RESOLUTION ────────────────────────────────────
        const todayStr = today; // YYYY-MM-DD
        let nextFollowUp = '';
        let followUpReason = '';

        // Priority 1: Source-specific dedicated date columns
        if (source === 'Upwork') {
          const applyRaw = item['Apply Date'] || item['apply date'] || item['apply_date'] || item.col_10 || '';
          const parsed = normalizeDateForCheck(applyRaw);
          if (parsed) { nextFollowUp = parsed; followUpReason = 'Apply Date'; }
        }

        if (source === 'Linkedin') {
          // Check explicit follow-up columns for LinkedIn
          const liCols = ['Acceptance Date', 'acceptance_date', '1st fup', '2nd fup', '3rd fup', '4th fup', 'Follow Up Date', 'Follow-up Date', 'Follwup - 1', 'Follwup - 2', 'Follwup - 3', 'Follwup - 4'];
          for (const col of liCols) {
            const parsed = normalizeDateForCheck(item[col]);
            if (parsed) {
              if (parsed === todayStr) {
                nextFollowUp = parsed; followUpReason = col; break;
              } else if (!nextFollowUp) {
                nextFollowUp = parsed; followUpReason = col;
              }
            }
          }
        }

        // Priority 2: Scan ALL known date-bearing columns for today (works for all sources)
        // Only overwrite what we have if we find today's date (today takes priority over any other date)
        if (nextFollowUp !== todayStr) {
          const allDateCols = [
            // Meta status date columns
            'Intro-Whatsapp', 'Intro Whatsapp', 'Intro Done - Phone Call', 'Intro Done - Whatsapp',
            'DNP 1', 'DNP 2', 'DNP 3', 'DNP 4', 'Never Responded',
            'Demo Booked', 'Proposal Call Booked', 'Proposal Call booked- No show',
            'Proposal Call Booked- Meeting done', 'Proposal Call booked- Potential Pipeline- Stopped responding',
            'not interested', 'Junk', 'Demo Booked - No show',
            // LinkedIn columns
            'Acceptance Date', 'acceptance_date', '1st fup', '2nd fup', '3rd fup', '4th fup',
            'Follwup - 1', 'Follwup - 2', 'Follwup - 3', 'Follwup - 4',
            // Generic
            'Follow Up Date', 'Follow-up Date', 'FOLLOW UP DATE', 'FUP',
            'next_followup', 'Next Follow Up', 'NextFollowUp'
          ];

          for (const col of allDateCols) {
            const rawVal = item[col];
            if (!rawVal) continue;

            const parsed = normalizeDateForCheck(rawVal);
            if (!parsed) continue;

            if (parsed === todayStr) {
              // Found today's date — highest priority, stop scanning
              nextFollowUp = parsed;
              followUpReason = col;
              break;
            } else if (!nextFollowUp) {
              // Use first valid date found as fallback
              nextFollowUp = parsed;
              followUpReason = col;
            }
          }
        }



        const cleanName = (finalDisplayName || name).replace(/\s+/g, '');
        const applyDate = item['Apply Date'] || item['apply date'] || '';
        const linkedinLink = item['Linkedin Link'] || item.linkedin || '';
        const uniqueSuffix = applyDate || linkedinLink || idx;
        const deterministicId = `${source}-${cleanName}-${phone}-${uniqueSuffix}`.replace(/\s+/g, '');

        return {
          id: deterministicId,
          name: finalDisplayName || name,
          phone,
          status: finalStatus,
          stage: rawStage,
          lastContact: item.Date || item['Apply Date'] || item['apply date'] || item['apply_date'] || today,
          acceptanceDate: item['Acceptance Date'] || item.acceptance_date || '-',
          linkedInAccount: item['Linkedin Account'] || item.linkedin_account || '-',
          isAccepted: item['Accepted (Y/N)'] || item.is_accepted || 'No',
          // Upwork specific
          upworkConnects: item['Connects used'] || item.connects_used || item.upworkConnects || '-',
          upworkJobType: item['Job Type'] || item['JOB TYPE'] || item.job_type || item.col_12 || item.col_13 || '-',
          upworkAmountQuoted: item['Amount Quoted'] || item.amount_quoted || item.col_11 || '-',
          upworkBidAmount: item['Bid Amount'] || item.bid_amount || item.col_14 || '-',
          upworkApplyDate: item['Apply Date'] || item['apply date'] || item['apply_date'] || item.col_10 || '-',
          upworkUrl: item['Upwork Link'] || item['Upwork URL'] || item['Upwork link'] || item.upwork || item.col_15 || '',
          nextFollowUp,
          followUpReason,
          source,
          notes,
          linkedinUrl,
          companyUrl,
          employeeSize: item['Additional info '] || item['Additional info'] || item['additional info'] || '-',
          chatHistory: item['Chat History'] || item.chat_history || item.col_14 || null,
          rowNumber: item.row_number || item.row || item._row || null,
          rawData: item
        };
      });

      setLeads(prev => {
        // Replace all leads for THIS source, keep leads from other sources intact
        const otherSourceLeads = prev.filter(l => l.source !== source);
        return [...newLeads, ...otherSourceLeads];
      });
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Could not sync leads from ${source}`);
    } finally {
      setLoadingSource(null);
    }
  };

  useEffect(() => {
    fetchSourceLeads('Meta');
    fetchSourceLeads('Linkedin');
    fetchSourceLeads('Upwork');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddLead = async (e) => {
    e.preventDefault();
    if (formData.source !== 'Meta' && formData.source !== 'Upwork' && formData.source !== 'Linkedin' && !formData.nextFollowUp && (formData.status === 'Follow-up' || formData.status === 'DNP' || formData.status === 'New')) {
      alert('Next Follow-up date is mandatory!');
      return;
    }

    setIsSubmittingRecord(true);

    try {
      if (formData.source === 'Meta') {
        const payload = new FormData();
        payload.append('name', formData.name || 'Unnamed Meta Lead');
        payload.append('phone', formData.phone || '');
        payload.append('source', 'Meta');
        
        formData.images.forEach((file) => {
          payload.append('images', file);
        });

        const response = await fetch(`${import.meta.env.VITE_API_META_SYNC}?action=Meta`, {
          method: 'POST',
          body: payload
        });

        if (!response.ok) throw new Error('Network response failure during synchronization');
      }

      if (formData.source === 'Linkedin') {
        const response = await fetch(`${import.meta.env.VITE_API_LINKEDIN_SYNC}?action=Lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            linkedinUrl: formData.linkedinUrl,
            companyUrl: formData.companyUrl,
            employeeSize: formData.employeeSize,
            linkedInAccount: formData.linkedInAccount,
            additionalInfo: formData.additionalInfo,
            source: 'Linkedin'
          })
        });
        if (!response.ok) throw new Error('LinkedIn network failure during synchronization');
      }

      if (formData.source === 'Upwork') {
        const response = await fetch(import.meta.env.VITE_API_UPWORK_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name || formData.upworkJobType || 'Upwork Lead',
            upworkApplyDate: formData.upworkApplyDate,
            upworkUrl: formData.upworkUrl,
            upworkConnects: formData.upworkConnects,
            upworkJobType: formData.upworkJobType,
            upworkAmountQuoted: formData.upworkAmountQuoted,
            upworkBidAmount: formData.upworkBidAmount,
            source: 'Upwork'
          })
        });
        if (!response.ok) throw new Error('Upwork network failure during synchronization');
      }

      let finalName = formData.name;
      if (!finalName) {
        if (formData.source === 'Upwork') {
          finalName = formData.upworkJobType || 'Upwork Lead';
        } else if (formData.source === 'Linkedin') {
          finalName = formData.linkedinUrl ? 'LinkedIn Lead' : 'Unnamed LinkedIn Lead';
        } else if (formData.source === 'Meta') {
          finalName = 'Unnamed Meta Lead';
        } else {
          finalName = 'Unnamed Lead';
        }
      }

      const newLead = {
        ...formData,
        images: formData.images.map(file => URL.createObjectURL(file)),
        name: finalName,
        id: Date.now(),
        lastContact: today,
        source: formData.source === 'All' ? 'Internal' : formData.source,
        stage: formData.status === 'DNP' ? 'DNP1' : ''
      };
      
      setLeads([newLead, ...leads]);
      setShowAddForm(false);
      setFormData({ 
        name: '', 
        phone: '', 
        notes: '', 
        status: 'New', 
        nextFollowUp: '', 
        images: [], 
        source: activeSource === 'All' ? 'Meta' : activeSource,
        upworkApplyDate: '',
        upworkUrl: '',
        upworkConnects: '',
        upworkJobType: '',
        upworkAmountQuoted: '',
        upworkBidAmount: '',
        linkedinUrl: '',
        companyUrl: '',
        employeeSize: '11-50',
        linkedInAccount: 'All Accounts',
        additionalInfo: ''
      });

    } catch (error) {
      console.error('Submission error:', error);
      alert('Critical: Failed to transmit data to backend. Please check connectivity.');
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  const updateLeadStatus = async (id, newStatus, nextDate = null) => {
    // Immediate UI update
    setLeads(leads.map(l => {
      if (l.id === id) {
        let newStage = l.stage;
        if (newStatus === 'DNP') {
          const currentStageIndex = STAGES.indexOf(l.stage);
          newStage = (currentStageIndex < 4 && currentStageIndex !== -1) ? STAGES[currentStageIndex + 1] : 'DNP5';
        } else {
          newStage = '';
        }
        return { ...l, status: newStatus, stage: newStage, nextFollowUp: nextDate || l.nextFollowUp, lastContact: today };
      }
      return l;
    }));

    // Post-update side effects (Webhook for Meta)
    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Meta') {
      try {
        const [y, m, d] = today.split('-');
        const formattedDate = `${d}/${m}/${y.slice(-2)}`;
        const statusValue = `${formattedDate} Done`;

        await fetch(import.meta.env.VITE_API_META_STATUS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [newStatus]: statusValue,
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            lead_name: targetLead.name,
            phone: targetLead.phone,
            processed_status: newStatus
          })
        });
      } catch (err) {
        console.error('Telecommunications failure during status sync', err);
      }
    }
  };

  const updateLeadAccount = async (id, newAccount) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        return { ...l, linkedInAccount: newAccount };
      }
      return l;
    }));
    
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, linkedInAccount: newAccount });
    }

    // New sync logic
    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Linkedin') {
      try {
        await fetch(import.meta.env.VITE_API_LINKEDIN_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "Linkedin Account": newAccount,
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            input: newAccount,
            action_query: "Account"
          })
        });
      } catch (err) {
        console.error('LinkedIn Account Sync Error:', err);
      }
    }
  };

  const updateLeadAcceptedStatus = async (id, newStatus) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        return { ...l, isAccepted: newStatus };
      }
      return l;
    }));
    
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, isAccepted: newStatus });
    }

    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Linkedin') {
      try {
        await fetch(import.meta.env.VITE_API_LINKEDIN_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "Accepted (Y/N)": newStatus,
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            input: newStatus,
            action_query: "Status"
          })
        });
      } catch (err) {
        console.error('LinkedIn Sync Error:', err);
      }
    }
  };

  const updateLeadNotes = async (id, newNotes) => {
    // Immediate UI update
    const linkedInMap = {
      '1st msg': '1st fup',
      '2nd msg': '2nd fup',
      '3rd msg': '3rd fup',
      '4th msg': '4th fup',
      'Mailed': 'Mailed'
    };

    setLeads(leads.map(l => {
      if (l.id === id) {
        // Update both the notes and the rawData so the dashboard button sequence advances immediately
        const updatedRaw = { ...(l.rawData || {}) };
        const dateStr = new Date().toISOString().split('T')[0];
        const [y, m, d] = dateStr.split('-');
        const formattedDate = `${d}/${m}/${y.slice(-2)}`;
        
        const targetKey = l.source === 'Linkedin' ? (linkedInMap[newNotes] || newNotes) : newNotes;
        updatedRaw[targetKey] = `${formattedDate} Done`;
        updatedRaw[targetKey.toLowerCase()] = `${formattedDate} Done`;
        
        return { ...l, notes: newNotes, rawData: updatedRaw, lastContact: today };
      }
      return l;
    }));
    if (selectedLead && selectedLead.id === id) {
      const updatedRaw = { ...(selectedLead.rawData || {}) };
      const dateStr = new Date().toISOString().split('T')[0];
      const [y, m, d] = dateStr.split('-');
      const formattedDate = `${d}/${m}/${y.slice(-2)}`;
      
      const targetKey = selectedLead.source === 'Linkedin' ? (linkedInMap[newNotes] || newNotes) : newNotes;
      updatedRaw[targetKey] = `${formattedDate} Done`;
      
      setSelectedLead({ ...selectedLead, notes: newNotes, rawData: updatedRaw, lastContact: today });
      setActiveDropdown(null);
    }
    setIsEditingNotes(false);

    // Post-update side effects (Webhook for Meta)
    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Meta') {
      try {
        const [y, m, d] = today.split('-');
        const formattedDate = `${d}/${m}/${y.slice(-2)}`;
        const statusValue = `${formattedDate} Done`;

        await fetch(import.meta.env.VITE_API_META_STATUS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [newNotes]: statusValue,
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            lead_name: targetLead.name,
            phone: targetLead.phone,
            processed_notes_action: newNotes,
            action_query: "Button"
          })
        });
      } catch (err) {
        console.error('Telecommunications failure during notes sync', err);
      }
    } else if (targetLead && targetLead.source === 'Linkedin') {
      try {
        const targetCol = linkedInMap[newNotes] || newNotes;
        const dateStr = new Date().toISOString().split('T')[0];
        const [y, m, d] = dateStr.split('-');
        const formattedDate = `${d}/${m}/${y.slice(-2)}`;

        await fetch(import.meta.env.VITE_API_LINKEDIN_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            column_name: targetCol, // Field the user is asking for
            input: targetCol,
            date: formattedDate,
            action_query: "Situation"
          })
        });
      } catch (err) {
        console.error('LinkedIn Situation Sync Error:', err);
      }
    }
  };

  const updateLeadSummary = async (id, newSummary) => {
    // Immediate UI update
    setLeads(leads.map(l => {
      if (l.id === id) {
        const updatedRaw = { ...l.rawData };
        updatedRaw['Last conversation'] = newSummary;
        updatedRaw['last_conversation'] = newSummary;
        updatedRaw['Last Conversation'] = newSummary;
        return { ...l, rawData: updatedRaw };
      }
      return l;
    }));
    
    if (selectedLead && selectedLead.id === id) {
      const updatedRaw = { ...selectedLead.rawData };
      updatedRaw['Last conversation'] = newSummary;
      updatedRaw['last_conversation'] = newSummary;
      updatedRaw['Last Conversation'] = newSummary;
      setSelectedLead({ ...selectedLead, rawData: updatedRaw });
    }
    
    setIsEditingSummary(false);

    // Sync to backend via webhook for Meta
    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Meta') {
      try {
        await fetch(import.meta.env.VITE_API_META_STATUS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            summary_update: newSummary,
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            lead_name: targetLead.name,
            phone: targetLead.phone,
            action_query: "Comment"
          })
        });
      } catch (err) {
        console.error('Failed to sync summary update:', err);
      }
    } else if (targetLead && targetLead.source === 'Linkedin') {
      try {
        await fetch(import.meta.env.VITE_API_LINKEDIN_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row_number: targetLead.rowNumber || targetLead.rawData?.row_number || targetLead.rawData?.row || null,
            input: newSummary,
            action_query: "Comment"
          })
        });
      } catch (err) {
        console.error('LinkedIn Comment Sync Error:', err);
      }
    }
  };

  const renderDashboard = () => {
    const currentView = activeSource === 'All' ? 'Meta' : activeSource;
    // Compute directly from leads — no intermediary — to guarantee source isolation
    const activeLeads = leads.filter(l =>
      l.source === currentView &&
      l.nextFollowUp === today &&
      !TERMINAL_STATUSES.includes((l.status || '').toLowerCase()) &&
      (currentView !== 'Linkedin' || activeAccount === 'All Accounts' || l.linkedInAccount === activeAccount)
    );

    const getColumnTitle = (src) => {
      if (src === 'Meta') return 'Meta Engine';
      if (src === 'Linkedin') return 'Li Gateway';
      if (src === 'Upwork') return 'Upwork Channel';
      return src;
    };
    
    const getColumnIcon = (src) => {
      if (src === 'Meta') return <PhoneCall size={24} />;
      if (src === 'Linkedin') return <LinkedinLogo />;
      if (src === 'Upwork') return <UpworkLogo />;
      return null;
    };

    const renderSourceColumn = (title, sourceLeads, icon) => (
      <div className="card w-full flex flex-col h-[calc(100vh-22rem)] xl:h-[calc(100vh-14rem)] border border-border-main/50 bg-bg-main/30 shadow-2xl transition-all hover:border-brand-primary/30">
        <div className="p-6 border-b border-border-main flex items-center justify-between bg-bg-card backdrop-blur-xl sticky top-0 z-10 rounded-t-3xl">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-inner border border-brand-primary/20">
               {icon}
             </div>
             <div>
               <h3 className="text-xl font-black text-text-main tracking-tight">{title}</h3>
               <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Today's Requirements</p>
             </div>
          </div>
          <span className="px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-xs font-black tracking-widest shadow-sm">
            {sourceLeads.length} DUE
          </span>
        </div>
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5 bg-bg-main/5">
          {sourceLeads.length > 0 ? sourceLeads.map(lead => (
            <div 
              key={lead.id} 
              onClick={() => setSelectedLead(lead)}
              className={`group p-6 bg-bg-card rounded-2xl border transition-all shadow-sm relative overflow-hidden cursor-pointer
                ${['junk', 'not interested'].includes((lead.status || '').toLowerCase())
                  ? 'border-rose-500/50 shadow-lg shadow-rose-500/10 hover:border-rose-500' 
                  : 'border-border-main hover:border-brand-primary/40'}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150"></div>
              
              <div className="flex gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-bg-card text-text-muted flex items-center justify-center font-black text-xl border border-border-main shadow-xs group-hover:text-brand-primary transition-colors shrink-0">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-black text-text-main text-lg tracking-tight">{lead.name}</h4>
                      {lead.linkedInAccount && <span className="inline-block mt-1 text-[9px] font-black bg-bg-card text-text-muted px-2 py-0.5 rounded-full border border-border-main uppercase tracking-widest">{lead.linkedInAccount}</span>}
                    </div>
                    <Badge status={lead.status} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-text-muted font-bold mt-3">
                    <span className="flex items-center gap-1.5 bg-bg-card px-2 py-1 rounded-md border border-border-main"><PhoneCall size={12} className="text-brand-primary" /> {lead.phone}</span>
                  </div>
                  
                  <p className="text-[10px] text-text-muted mt-4 font-black uppercase tracking-widest opacity-60">Last Context: {lead.lastContact}</p>
                  
                  {lead.notes && (
                    <div className="mt-3 text-xs font-medium italic text-text-muted opacity-80 border-l-2 border-brand-primary/30 pl-3 py-1 bg-border-main/10 rounded-r-lg">
                      {lead.notes}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border-main relative z-10">
                {lead.source === 'Linkedin' && lead.linkedinUrl && (
                  <a 
                    href={lead.linkedinUrl}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 flex-1 py-3 bg-[#0a66c2]/10 border border-[#0a66c2]/20 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xs"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    LinkedIn
                  </a>
                )}
                {(() => {
                  const checkFilled = (s) => {
                    const rd = lead.rawData || {};
                    const val = (rd[s] || rd[s.toLowerCase()] || rd[s.toUpperCase()] || rd[s.replace(/-/g, ' ')] || rd[s.replace(/ - /g, ' ')] || '')?.toString().toLowerCase();
                    // A cell is only considered completed if it contains the word "done"
                    // DO NOT fallback to `notes === s` here because `notes` is initialized to the lead's rawStatus, 
                    // which causes false positives (e.g. if status is DNP 4, DNP 4 button lights up green).
                    return val.includes('done');
                  };
                  
                  let nextAction = 'Converted';
                  if (lead.source === 'Meta') {
                    const isFunnelOrTerminal = 
                      checkFilled('Demo Booked') || 
                      checkFilled('Proposal Call Booked') || 
                      checkFilled('Junk') || 
                      checkFilled('not interested');

                    if (isFunnelOrTerminal) {
                       nextAction = 'Action Logged';
                    } else if (!checkFilled('Intro-Whatsapp')) {
                       nextAction = 'Intro-Whatsapp';
                    } else if (!checkFilled('Intro Done - Phone Call') && !checkFilled('Intro Done - Whatsapp')) {
                       nextAction = 'Intro Done - Phone Call';
                    } else if (!checkFilled('DNP 1')) {
                       nextAction = 'DNP 1';
                    } else if (!checkFilled('DNP 2')) {
                       nextAction = 'DNP 2';
                    } else if (!checkFilled('DNP 3')) {
                       nextAction = 'DNP 3';
                    } else if (!checkFilled('DNP 4')) {
                       nextAction = 'DNP 4';
                    } else {
                       nextAction = 'Never Responded';
                    }
                  }

                  return (
                    <div className="flex-1 flex gap-2">
                      {lead.source === 'Linkedin' && nextAction === 'Converted' ? (
                        <div className="relative flex-1">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveDashboardDropdown(activeDashboardDropdown === `flow-${lead.id}` ? null : `flow-${lead.id}`);
                            }}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                          >
                            Select Flow
                            <ChevronRight size={14} className={activeDashboardDropdown === `flow-${lead.id}` ? 'rotate-90 transition-transform' : 'transition-transform'} />
                          </button>
                          
                          {activeDashboardDropdown === `flow-${lead.id}` && (
                            <div className="absolute bottom-full mb-3 left-0 z-[100] bg-bg-card border border-border-main rounded-3xl shadow-2xl p-3 min-w-[200px] animate-in slide-in-from-bottom-2 duration-200">
                              <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-3 opacity-50">
                                Conversational Flow
                              </p>
                              <div className="space-y-1">
                                {LINKEDIN_DISPOSITION_GROUPS['Conversational Flow'].map(status => (
                                  <button 
                                    key={status}
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      updateLeadNotes(lead.id, status); 
                                      setActiveDashboardDropdown(null); 
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 text-text-main rounded-xl text-[9px] font-bold uppercase tracking-wider transition-colors"
                                  >
                                    {status}
                                  </button>
                                ))}
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    updateLeadStatus(lead.id, 'Converted'); 
                                    setActiveDashboardDropdown(null); 
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-wider transition-colors border-t border-border-main mt-1"
                                >
                                  Converted
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (nextAction === 'Converted') {
                              updateLeadStatus(lead.id, 'Converted');
                            } else {
                              updateLeadNotes(lead.id, nextAction);
                            }
                          }}
                          className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-lg shadow-brand-primary/20 truncate px-2"
                        >
                          {nextAction}
                        </button>
                      )}
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setActiveDashboardDropdown(activeDashboardDropdown === lead.id ? null : lead.id);
                          }}
                          className={`w-12 h-full flex items-center justify-center rounded-xl border border-brand-primary/40 text-brand-primary transition-all
                            ${activeDashboardDropdown === lead.id ? 'bg-brand-primary text-white' : 'hover:bg-brand-primary/10'}`}
                          title="Quick Move to Funnel"
                        >
                          <Layers size={16} />
                        </button>
                        
                        {activeDashboardDropdown === lead.id && (
                          <div className="absolute bottom-full mb-3 right-0 z-[100] bg-bg-card border border-border-main rounded-3xl shadow-2xl p-3 min-w-[280px] animate-in slide-in-from-bottom-2 duration-200">
                            <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 px-3 opacity-50">
                              { (checkFilled('Demo Booked') || checkFilled('Proposal Call Booked')) ? 'Post-Booking Management' : 'Quick Funnel Jump' }
                            </p>
                            <div className="space-y-1">
                              {(() => {
                                const isBooked = checkFilled('Demo Booked') || checkFilled('Proposal Call Booked');
                                const options = isBooked 
                                  ? [
                                      'Proposal Call booked- No show',
                                      'Proposal Call Booked- Meeting done',
                                      'Proposal Call booked- Potential Pipeline- Stopped responding',
                                      'Demo Booked - No show'
                                    ]
                                  : ['Demo Booked', 'Proposal Call Booked', 'Not Interested', 'Junk'];
                                
                                return options.map(funnelStatus => (
                                  <button 
                                    key={funnelStatus}
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      updateLeadNotes(lead.id, funnelStatus); 
                                      setActiveDashboardDropdown(null); 
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-brand-primary/10 text-text-main rounded-xl text-[9px] font-bold uppercase tracking-wider transition-colors"
                                  >
                                    {funnelStatus}
                                  </button>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
               <div className="w-20 h-20 bg-bg-main border border-border-main rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <CheckCircle2 size={32} className="text-text-muted opacity-50" />
               </div>
               <h3 className="text-xl font-black text-text-main opacity-80">Phase Completed</h3>
               <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mt-3 opacity-60">Zero actionable targets remaining</p>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 w-full flex flex-col min-h-0 h-full">
        <div className="flex bg-bg-card border border-border-main rounded-2xl overflow-hidden w-full max-w-2xl mx-auto shadow-xs shrink-0 mb-6">
          {['Meta', 'Linkedin', 'Upwork'].map(src => (
             <button
                key={src}
                onClick={() => setActiveSource(src)}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest text-center transition-all ${
                  currentView === src 
                    ? 'bg-brand-primary text-white shadow-xl' 
                    : 'bg-transparent text-text-muted hover:bg-bg-main hover:text-text-main'
                }`}
             >
                {src}
             </button>
          ))}
        </div>
        
        <div className="flex flex-col xl:flex-row gap-8 flex-1 overflow-hidden min-h-0 pb-8">
          <div className="w-full xl:w-[450px] shrink-0 h-full">
            {renderSourceColumn(getColumnTitle(currentView), activeLeads, getColumnIcon(currentView))}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
            {(currentView === 'Meta' || currentView === 'Linkedin') ? (
              leads.length > 0 && <SourceAnalytics leads={leads.filter(l => l.source === currentView)} currentView={currentView} />
            ) : (
              <div className="h-[50vh] xl:h-full flex flex-col items-center justify-center p-8 bg-bg-main/30 rounded-3xl border border-border-main border-dashed">
                <Database size={48} className="text-text-muted opacity-30 mb-4" />
                <h2 className="text-xl font-black text-text-main opacity-80">Telemetry Unavailable</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mt-2 opacity-60">Specific analytic configurations required for {currentView}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLeads = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-bg-card p-4 rounded-3xl border border-border-main shadow-xs">
          <div className="flex items-center gap-1 bg-bg-main p-1.5 rounded-2xl border border-border-main w-full lg:w-fit overflow-x-auto">
            {['Meta', 'Linkedin', 'Upwork'].map(source => (
              <button
                key={source}
                onClick={() => {
                  setActiveSource(source);
                  fetchSourceLeads(source);
                }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSource === source ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-text-main hover:bg-bg-card'}`}
              >
                {source}
              </button>
            ))}
          </div>
          {activeSource === 'Linkedin' && linkedInAccounts.length > 1 && (
            <div className="flex items-center gap-3 bg-bg-main border border-border-main px-4 py-2 rounded-2xl">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Sender ID:</span>
              <select value={activeAccount} onChange={(e) => { if (e.target.value === 'ADD_NEW') { setShowAccountModal(true); return; } setActiveAccount(e.target.value); }} className="outline-none text-xs font-black text-text-main bg-transparent cursor-pointer appearance-none">
                {linkedInAccounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                <option value="ADD_NEW">+ REGISTER NEW SENDER</option>
              </select>
            </div>
          )}
        </div>

        <div className="card overflow-hidden min-h-[500px]">
          {loadingSource ? <LoadingAnimation /> : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Prospect Entity</th>
                    {activeSource !== 'Upwork' && (
                      <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Last Contact</th>
                    )}
                    {activeSource !== 'Meta' && activeSource !== 'Upwork' && (
                       <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Status</th>
                    )}
                    {activeSource !== 'Upwork' && (
                      <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">{activeSource === 'Meta' ? 'Lead Status' : 'Account Owner'}</th>
                    )}
                    <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">{activeSource === 'Upwork' ? 'Apply Date' : 'Follow-up'}</th>
                    {activeSource === 'Upwork' && (
                      <th className="px-5 py-6 text-center text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Link</th>
                    )}
                    <th className="px-5 py-6 text-center text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="group hover:bg-bg-main/50 transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border
                            ${lead.source === 'Upwork' 
                              ? 'bg-[#14a800]/10 text-[#14a800] border-[#14a800]/20' 
                              : 'bg-brand-primary/10 text-brand-primary border-brand-primary/10'}`}>
                            {(lead.source === 'Upwork' && lead.upworkJobType && !['-', '---', ''].includes(lead.upworkJobType) ? lead.upworkJobType : (lead.name || '?')).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-text-main text-sm">
                                {lead.source === 'Upwork' && lead.upworkJobType && !['-', '---', ''].includes(lead.upworkJobType) ? lead.upworkJobType : (lead.name || 'Unnamed Lead')}
                              </p>
                              {lead.source === 'Upwork' && (
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    window.open(lead.upworkUrl || 'https://www.upwork.com', '_blank'); 
                                  }}
                                  className="w-5 h-5 flex items-center justify-center rounded-md bg-[#14a800]/10 text-[#14a800] hover:bg-[#14a800] hover:text-white transition-all border border-[#14a800]/20"
                                  title={lead.upworkUrl ? "Open Upwork Job" : "Go to Upwork"}
                                >
                                  <UpworkLogo />
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5 opacity-50">
                              {lead.source}{lead.phone ? ` · ${lead.phone}` : ''}
                              {lead.source === 'Upwork' && lead.upworkJobType && !['-', '---', ''].includes(lead.upworkJobType) && ` · ${lead.name}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      {activeSource !== 'Upwork' && (
                        <td className="px-5 py-5">
                          <span className="text-xs text-text-muted">{lead.lastContact || '—'}</span>
                        </td>
                      )}
                      {activeSource !== 'Meta' && activeSource !== 'Upwork' && (
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${lead.status === 'New' ? 'bg-brand-primary' : lead.status === 'Follow-up' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                            <select 
                              value={lead.status} 
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)} 
                              className="bg-transparent text-xs font-semibold text-text-main focus:outline-none cursor-pointer uppercase tracking-wider appearance-none"
                            >
                              {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </td>
                      )}
                      {activeSource !== 'Upwork' && (
                        <td className="px-5 py-5">
                          {activeSource === 'Meta' ? (
                            <select 
                              value={lead.status} 
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className="bg-bg-main px-3 py-1.5 rounded-lg text-[10px] font-black text-text-main border border-border-main appearance-none outline-none focus:border-brand-primary transition-colors cursor-pointer w-full max-w-[150px]"
                            >
                              {!META_STATUSES.includes(lead.status) && lead.status !== 'New' && (
                                <option value={lead.status}>{lead.status}</option>
                              )}
                              <option value="New">New</option>
                              {META_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <select 
                                value={lead.linkedInAccount}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateLeadAccount(lead.id, e.target.value)}
                                className="bg-bg-main px-4 py-2 rounded-xl text-[10px] font-black text-text-main border border-border-main appearance-none outline-none focus:border-brand-primary transition-colors cursor-pointer w-full hover:border-brand-primary/50"
                              >
                                {!linkedInAccounts.includes(lead.linkedInAccount) && lead.linkedInAccount !== '-' && (
                                  <option value={lead.linkedInAccount}>{lead.linkedInAccount}</option>
                                )}
                                {linkedInAccounts.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          )}
                        </td>
                      )}
                      <td className="px-5 py-5">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-lg inline-block ${activeSource === 'Upwork' ? 'bg-emerald-500/10 text-emerald-500' : (lead.nextFollowUp === today ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-primary/10 text-brand-primary')}`}>
                          {activeSource === 'Upwork' ? (lead.upworkApplyDate || '—') : (lead.nextFollowUp || 'TBD')}
                        </span>
                      </td>
                      {activeSource === 'Upwork' && (
                         <td className="px-5 py-5 text-center">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                window.open(lead.upworkUrl || 'https://www.upwork.com', '_blank'); 
                              }}
                              className="p-3 mx-auto bg-[#14a800]/10 text-[#14a800] rounded-xl hover:bg-[#14a800] hover:text-white transition-all shadow-sm flex items-center justify-center border border-[#14a800]/20"
                              title={lead.upworkUrl ? "Open Upwork Job" : "Go to Upwork"}
                            >
                              <UpworkLogo />
                            </button>
                         </td>
                      )}
                      <td className="px-5 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {lead.source === 'Meta' && lead.chatHistory && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatLead(lead); }} className="px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-brand-primary/20">
                              Chat
                            </button>
                          )}

                          {lead.source === 'Linkedin' && lead.linkedinUrl && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); window.open(lead.linkedinUrl, '_blank'); }}
                               className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center justify-center border border-brand-primary/20"
                               title="View LinkedIn Profile"
                             >
                               <LinkedinLogo />
                             </button>
                           )}
                           {lead.source === 'Upwork' && lead.upworkUrl && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); window.open(lead.upworkUrl, '_blank'); }}
                               className="p-2.5 bg-[#14a800]/10 text-[#14a800] rounded-xl hover:bg-[#14a800] hover:text-white transition-all shadow-sm flex items-center justify-center border border-[#14a800]/20"
                               title="View Upwork Job"
                             >
                               <UpworkLogo />
                             </button>
                           )}
                           <button onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }} className="px-4 py-2 bg-bg-main hover:bg-brand-primary hover:text-white text-text-main rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-border-main">
                             Intelligence
                           </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={activeSource === 'Meta' ? 5 : 6} className="px-5 py-24 text-center">
                        <Database size={40} className="mx-auto text-text-muted opacity-10 mb-4" />
                        <p className="text-text-muted font-bold uppercase tracking-widest text-xs">No leads match the current filter</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDNP = () => (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide animate-in fade-in duration-500">
      {STAGES.map((stage) => (
        <div key={stage} className="min-w-[320px] bg-bg-main/50 p-4 rounded-3xl border border-border-main/50 flex flex-col h-[calc(100vh-350px)]">
          <div className="flex items-center justify-between mb-6 px-2">
            <h4 className="font-black text-text-main text-xs uppercase tracking-[0.2em] flex items-center gap-3">
              {stage}
              <span className="text-[10px] font-black bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full border border-brand-primary/20">
                {leads.filter(l => l.stage === stage).length}
              </span>
            </h4>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {leads.filter(l => l.stage === stage).map(lead => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="card p-5 group cursor-pointer border-l-[6px] border-l-rose-500/50 hover:border-l-rose-500 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-text-main text-sm">{lead.name}</p>
                  <More size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-4">{lead.phone}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border-main mb-2">
                   <div className="text-[10px] text-text-muted font-black uppercase tracking-widest">Last Activity</div>
                   <div className="text-[10px] text-text-main font-bold">{lead.lastContact}</div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                    updateLeadStatus(lead.id, 'DNP', nextDate);
                  }}
                  className="w-full py-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all mt-2"
                >
                  NEXT ATTEMPT
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Initial Full Screen Splash Loading
  if (leads.length === 0 && loadingSource) {
    return (
      <div className="fixed inset-0 bg-[#0b141a] z-[9999] flex flex-col items-center justify-center">
        <div className="text-white text-3xl font-black">LOADING...</div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
         <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent 
          theme={theme}
          toggleTheme={toggleTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowAddForm={setShowAddForm}
          renderDashboard={renderDashboard}
          renderLeads={renderLeads}
          renderDNP={renderDNP}
          updateLeadAccount={updateLeadAccount}
          activeSource={activeSource}
          setFormData={setFormData}
          user={user}
          onLogout={handleLogout}
        />
      </ErrorBoundary>

      {showAddForm && (
        <LeadModal 
          onClose={() => setShowAddForm(false)} 
          onSubmit={handleAddLead}
          formData={formData}
          setFormData={setFormData}
          theme={theme}
          activeSource={activeSource}
          isSubmitting={isSubmittingRecord}
          linkedInAccounts={linkedInAccounts}
        />
      )}

      {showAccountModal && (
        <AccountModal 
          onClose={() => setShowAccountModal(false)}
          onSave={addNewAccount}
          theme={theme}
        />
      )}

      {selectedLead && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-2xl z-50 flex items-center justify-center p-8">
            <div className="bg-bg-card w-full max-w-5xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.4)] border border-border-main overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
               <div className="p-10 border-b border-border-main flex justify-between items-center bg-bg-main/50">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-3xl font-black border border-brand-primary/20 shadow-inner">
                      {selectedLead.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-text-main tracking-tighter leading-tight">{selectedLead.name}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black text-white bg-brand-primary px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/30">{selectedLead.source}</span>
                        <span className="text-xs font-bold text-text-muted tracking-widest uppercase">{selectedLead.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedLead(null);
                      setActiveDropdown(null);
                      setIsJobTypeExpanded(false);
                    }} 
                    className="p-4 hover:bg-bg-main rounded-full text-text-muted hover:text-rose-500 transition-all"
                  >
                    <XCircle size={40} />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-12 bg-bg-main/10 flex justify-center">
                  <div className="w-full max-w-4xl space-y-12">
                        <div>
                           <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                              ANALYSIS ENGINE
                              <div className="h-px bg-brand-primary/20 flex-1"></div>
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/30 transition-colors">
                                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Operational Status</p>
                                 <p className="text-base font-black text-text-main">{selectedLead.status} {selectedLead.stage ? `• ${selectedLead.stage}` : ''}</p>
                              </div>
                              <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/30 transition-colors">
                                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Temporal Markers</p>
                                 <p className="text-sm font-black text-text-main">{selectedLead.lastContact} <span className="text-text-muted mx-2">→</span> {selectedLead.nextFollowUp}</p>
                                 {selectedLead.source === 'Linkedin' && selectedLead.acceptanceDate && (
                                   <p className="text-[9px] font-black text-brand-primary/80 uppercase tracking-widest mt-2">Accepted: {selectedLead.acceptanceDate}</p>
                                 )}
                                 {selectedLead.followUpReason && (
                                   <p className="text-[9px] font-black text-brand-primary/60 uppercase tracking-widest mt-2 flex items-center gap-2">
                                     <span className="w-1 h-1 rounded-full bg-brand-primary animate-pulse inline-block"></span>
                                     Triggered by: {selectedLead.followUpReason}
                                   </p>
                                 )}
                              </div>
                              <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/30 transition-colors relative">
                                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">
                                   {selectedLead.source === 'Linkedin' ? 'Sending Account' : 'Lead Assignment'}
                                 </p>
                                 {selectedLead.source === 'Linkedin' ? (
                                   <div className="relative">
                                      <button 
                                        onClick={() => setActiveDropdown(activeDropdown === 'modal-account' ? null : 'modal-account')}
                                        className="w-full flex items-center justify-between bg-bg-main/50 px-4 py-2.5 rounded-xl border border-border-main hover:border-brand-primary/40 transition-all text-sm font-black text-text-main group"
                                      >
                                        <span className="truncate">{selectedLead.linkedInAccount || 'Select Account'}</span>
                                        <ChevronRight size={16} className={`text-brand-primary transition-transform duration-300 ${activeDropdown === 'modal-account' ? 'rotate-90' : ''}`} />
                                      </button>
                                      
                                      {activeDropdown === 'modal-account' && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-main rounded-2xl shadow-2xl z-[110] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                           <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                              {['Select Account', ...linkedInAccounts.filter(a => a !== 'All Accounts')].map((acc) => (
                                                <button
                                                  key={acc}
                                                  onClick={() => {
                                                    updateLeadAccount(selectedLead.id, acc === 'Select Account' ? '-' : acc);
                                                    setActiveDropdown(null);
                                                  }}
                                                  className={`w-full px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-brand-primary/10 ${
                                                    (selectedLead.linkedInAccount === acc || (acc === 'Select Account' && selectedLead.linkedInAccount === '-')) 
                                                      ? 'text-brand-primary bg-brand-primary/5' 
                                                      : 'text-text-muted hover:text-text-main'
                                                  }`}
                                                >
                                                  {acc}
                                                </button>
                                              ))}
                                           </div>
                                        </div>
                                      )}
                                   </div>
                                 ) : (
                                   <p className="text-sm font-black text-text-main ml-1">Global Meta Pool</p>
                                 )}
                              </div>
                              {selectedLead.source === 'Linkedin' && (
                                <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/30 transition-colors relative">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Accepted Status</p>
                                   <div className="relative">
                                      <button 
                                        onClick={() => setActiveDropdown(activeDropdown === 'modal-accepted' ? null : 'modal-accepted')}
                                        className="w-full flex items-center justify-between bg-bg-main/50 px-4 py-2.5 rounded-xl border border-border-main hover:border-brand-primary/40 transition-all text-sm font-black text-text-main group"
                                      >
                                        <span>{selectedLead.isAccepted || 'No'}</span>
                                        <ChevronRight size={16} className={`text-brand-primary transition-transform duration-300 ${activeDropdown === 'modal-accepted' ? 'rotate-90' : ''}`} />
                                      </button>
                                      
                                      {activeDropdown === 'modal-accepted' && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-main rounded-2xl shadow-2xl z-[110] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                           {['Yes', 'No', 'Page Not Found'].map((status) => (
                                             <button
                                               key={status}
                                               onClick={() => {
                                                 updateLeadAcceptedStatus(selectedLead.id, status);
                                                 setActiveDropdown(null);
                                               }}
                                               className={`w-full px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-brand-primary/10 ${
                                                 selectedLead.isAccepted === status 
                                                   ? 'text-brand-primary bg-brand-primary/5' 
                                                   : 'text-text-muted hover:text-text-main'
                                               }`}
                                             >
                                               {status}
                                             </button>
                                           ))}
                                        </div>
                                      )}
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>

                        {selectedLead.source === 'Upwork' && (
                          <div className="animate-in slide-in-from-bottom-4 duration-500">
                             <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                BIDDING INTEL
                                <div className="h-px bg-brand-primary/20 flex-1"></div>
                             </h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm flex flex-col items-center justify-center hover:border-brand-primary/30 transition-colors">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50 text-center">Connects Consumed</p>
                                   <p className="text-xl font-black text-brand-primary">{selectedLead.upworkConnects}</p>
                                </div>
                                <div 
                                  onClick={() => setIsJobTypeExpanded(!isJobTypeExpanded)}
                                  className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm cursor-pointer hover:border-brand-primary/50 transition-all group"
                                >
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Job Classification</p>
                                   <p className={`text-sm font-bold text-text-main ${isJobTypeExpanded ? '' : 'truncate max-w-[150px]'}`}>
                                     {selectedLead.upworkJobType}
                                   </p>
                                   {!isJobTypeExpanded && (selectedLead.upworkJobType || '').length > 20 && (
                                     <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                                   )}
                                </div>
                                <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm flex flex-col items-center justify-center hover:border-brand-primary/30 transition-colors">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50 text-center">Amount Quoted</p>
                                   <p className="text-xl font-black text-emerald-500">{selectedLead.upworkAmountQuoted}</p>
                                </div>
                                <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm flex flex-col items-center justify-center hover:border-brand-primary/30 transition-colors">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50 text-center">Bid Amount</p>
                                   <p className="text-xl font-black text-text-main">{selectedLead.upworkBidAmount}</p>
                                </div>
                                <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm flex flex-col items-center justify-center hover:border-brand-primary/30 transition-colors">
                                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50 text-center">Apply Date</p>
                                   <p className="text-xl font-black text-brand-primary">{selectedLead.upworkApplyDate}</p>
                                </div>
                             </div>
                          </div>
                        )}
                        {selectedLead.images && selectedLead.images.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                               CAPTURED INTEL (IMAGES)
                               <div className="h-px bg-brand-primary/20 flex-1"></div>
                            </h4>
                            <div className="flex flex-wrap gap-4">
                              {selectedLead.images.map((img, idx) => (
                                <div key={idx} className="relative group cursor-pointer">
                                  <img 
                                    src={img} 
                                    alt={`Intel ${idx}`} 
                                    className="w-24 h-24 object-cover rounded-2xl border border-border-main hover:border-brand-primary transition-all shadow-md group-hover:scale-105"
                                    onClick={() => window.open(img, '_blank')}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Last Conversation Summary Section */}
                        <div>
                           <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center justify-between gap-4">
                              <span className="flex items-center gap-4">
                                LAST CONVERSATION SUMMARY
                                <div className="h-px bg-brand-primary/20 w-48"></div>
                              </span>
                              <div className="flex items-center gap-3">
                                {!isEditingSummary ? (
                                  <button 
                                    onClick={() => {
                                      setTempSummary(selectedLead.rawData['Last conversation'] || selectedLead.rawData['last_conversation'] || selectedLead.rawData['Last Conversation'] || '');
                                      setIsEditingSummary(true);
                                    }}
                                    className="text-[10px] bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all font-black"
                                  >
                                    MODIFY SUMMARY
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => updateLeadSummary(selectedLead.id, tempSummary)}
                                      className="text-[10px] bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all font-black"
                                    >
                                      OK
                                    </button>
                                    <button 
                                      onClick={() => setIsEditingSummary(false)}
                                      className="text-[10px] bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-full border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-black"
                                    >
                                      ESC
                                    </button>
                                  </div>
                                )}
                                <button 
                                  onClick={() => {
                                    if(window.confirm('Erase all conversation history for this lead?')) {
                                      updateLeadSummary(selectedLead.id, '');
                                    }
                                  }}
                                  className="text-[10px] bg-rose-500/5 text-rose-500/50 px-4 py-1.5 rounded-full border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all font-black opacity-60 hover:opacity-100"
                                >
                                  CLEAR
                                </button>
                              </div>
                           </h4>
                           {isEditingSummary ? (
                             <textarea 
                               autoFocus
                               value={tempSummary}
                               onChange={(e) => setTempSummary(e.target.value)}
                               className="w-full h-24 bg-bg-main p-6 rounded-3xl border-2 border-brand-primary/50 text-text-main font-bold outline-none focus:shadow-[0_0_20px_rgba(159,212,138,0.2)] transition-all resize-none custom-scrollbar"
                               placeholder="Enter summary..."
                             />
                           ) : (
                             <div 
                               onClick={() => {
                                 setTempSummary(selectedLead.rawData['Last conversation'] || selectedLead.rawData['last_conversation'] || selectedLead.rawData['Last Conversation'] || '');
                                 setIsEditingSummary(true);
                               }}
                               className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm group relative cursor-pointer hover:border-brand-primary/50 transition-all active:scale-[0.99]"
                             >
                                <p className="text-sm font-bold text-text-main leading-relaxed">
                                  {selectedLead.rawData['Last conversation'] || selectedLead.rawData['last_conversation'] || selectedLead.rawData['Last Conversation'] || 'No conversation summary recorded.'}
                                </p>
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                  <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest">Click to Edit</span>
                                  <MessageSquare size={14} className="text-brand-primary/40" />
                                </div>
                             </div>
                           )}
                        </div>
                        {selectedLead.source !== 'Upwork' && (
                          <div className="mt-12">
                             <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-10 flex items-center justify-center gap-4">
                                <div className="h-px bg-brand-primary/20 w-16"></div>
                                QUICK DISPOSITION & LOGS
                                <div className="h-px bg-brand-primary/20 w-16"></div>
                             </h4>
                             
                             <div className="space-y-10">
                                {(() => {
                                  const checkFilled = (s) => {
                                    const rd = selectedLead.rawData || {};
                                    const val = (rd[s] || rd[s.toLowerCase()] || rd[s.toUpperCase()] || rd[s.replace(/-/g, ' ')] || rd[s.replace(/ - /g, ' ')] || '')?.toString().toLowerCase();
                                    return val.includes('done') || selectedLead.notes === s;
                                  };
                                  
                                  const introFilled = checkFilled('Intro-Whatsapp');
                                  const phoneFilled = checkFilled('Intro Done - Phone Call');
                                  const waFilled = checkFilled('Intro Done - Whatsapp');
                                  const d1Filled = checkFilled('DNP 1');
                                  const d2Filled = checkFilled('DNP 2');
                                  const d3Filled = checkFilled('DNP 3');
                                  const d4Filled = checkFilled('DNP 4');
                                  
                                  const anyDnpDone = d1Filled || d2Filled || d3Filled || d4Filled;
                                  const anyIntroDone = introFilled || phoneFilled || waFilled;

                                  const groupsToUse = selectedLead.source === 'Linkedin' ? LINKEDIN_DISPOSITION_GROUPS : DISPOSITION_GROUPS;

                                  return Object.entries(groupsToUse).map(([group, statuses]) => {
                                    const filteredStatuses = statuses;

                                    if (filteredStatuses.length === 0) return null;

                                    return (
                                      <div key={group} className="flex flex-col items-center space-y-4">
                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-50">{group}</p>
                                        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                                            {filteredStatuses.map(status => {
                                              const rd = selectedLead.rawData || {};
                                              
                                              // Mapping for LinkedIn specific columns
                                              const linkedInMap = {
                                                '1st msg': '1st fup',
                                                '2nd msg': '2nd fup',
                                                '3rd msg': '3rd fup',
                                                '4th msg': '4th fup',
                                                'Mailed': 'Mailed'
                                              };
                                              
                                              const targetCol = selectedLead.source === 'Linkedin' ? (linkedInMap[status] || status) : status;
                                              const sheetValue = (rd[targetCol] || rd[targetCol.toLowerCase()] || rd[targetCol.toUpperCase()] || '')?.toString() || '';
                                              
                                              const isDone = sheetValue.toLowerCase().includes('done');
                                              let dateOnly = '';
                                              
                                              const locallyAddedValue = rd[status]?.toString() || '';
                                              const isLocallySelected = locallyAddedValue.includes('Done') && locallyAddedValue.includes('/');
                                              
                                              if (isLocallySelected) {
                                                const [y, m, d] = today.split('-');
                                                dateOnly = `${d}/${m}/${y.slice(-2)}`;
                                              } else if (sheetValue) {
                                                const dateMatch = sheetValue.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
                                                dateOnly = dateMatch ? dateMatch[0] : sheetValue.replace(/done/gi, '').trim();
                                              }

                                              const hasScheduledDate = !!dateOnly && !isDone && !isLocallySelected;
                                              const showGreen = isDone || isLocallySelected;

                                              return (
                                                <button 
                                                  key={status}
                                                  onClick={() => updateLeadNotes(selectedLead.id, status)}
                                                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex flex-col items-center gap-0.5 min-w-[120px]
                                                    ${showGreen
                                                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                                                      : hasScheduledDate
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/40'
                                                        : 'bg-bg-card text-text-muted border-border-main hover:border-brand-primary/50 hover:text-brand-primary'}`}
                                                  title={sheetValue || 'No record'}
                                                >
                                                  <span className="leading-tight">{status}</span>
                                                  {dateOnly && (
                                                    <span className={`text-[8px] font-black opacity-60 block ${showGreen ? 'text-white' : 'text-emerald-500'}`}>
                                                      {dateOnly}
                                                    </span>
                                                  )}
                                                </button>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                             </div>
                          </div>
                        )}
                  </div>
               </div>
               <div className="p-10 border-t border-border-main bg-bg-main/50 flex justify-end gap-4">
                  <button 
                    onClick={() => { setSelectedLead(null); setActiveDropdown(null); setIsJobTypeExpanded(false); }}
                    className="px-12 py-5 bg-text-main text-bg-main rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all shadow-2xl shadow-text-main/20"
                  >
                    TERMINATE VIEW
                  </button>
               </div>
            </div>
         </div>
      )}

      {activeChatLead && (
        <ChatModal 
          lead={activeChatLead} 
          onClose={() => setActiveChatLead(null)} 
        />
      )}
    </BrowserRouter>
  );
};

const ChatModal = ({ lead, onClose }) => {
  // Extremely robust parsing logic for chat history
  const messages = useMemo(() => {
    if (!lead.chatHistory) return [];
    
    let rawData = lead.chatHistory;
    
    // Normalize data if it's an array already
    if (Array.isArray(rawData)) {
      return rawData.map((m, i) => ({
        id: i,
        text: m.message_text || m.text || m.message || JSON.stringify(m),
        sender: m.sender || 'Lead',
        time: m.timestamp || m.time || '12:00 PM',
        isMe: m.sender === 'our_team' || m.sender === 'admin'
      }));
    }

    // Aggressive JSON extraction from string
    try {
      let chatStr = typeof rawData === 'string' ? rawData.trim() : JSON.stringify(rawData);
      
      // Remove any non-JSON wrapping (like Excel quotes or random text)
      const jsonMatch = chatStr.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        chatStr = jsonMatch[0];
      }

      const parsed = JSON.parse(chatStr);
      const arrayData = Array.isArray(parsed) ? parsed : [parsed];
      
      return arrayData.map((msg, i) => {
        const text = msg.message_text || msg.text || msg.message || (typeof msg === 'string' ? msg : JSON.stringify(msg));
        const sender = msg.sender || 'Lead';
        const isMe = sender === 'our_team' || sender === 'admin';
        const time = msg.timestamp || msg.time || '12:00 PM';
        return { id: i, text, sender, time, isMe };
      });
    } catch (e) {
      console.warn('Advanced JSON parse failed, trying line parser:', e);
    }

    // Fallback: Line-by-line parser
    return rawData.toString().split('\n').filter(l => l.trim()).map((line, i) => {
      const match = line.match(/(?:\[(.*?)\]\s)?(.*?):\s(.*)/);
      if (match) {
        return {
          id: i,
          time: match[1] || '',
          sender: match[2],
          text: match[3],
          isMe: match[2].toLowerCase().includes('me') || match[2].toLowerCase().includes('our_team')
        };
      }
      return { id: i, text: line, sender: 'Prospect', isMe: false };
    });
  }, [lead.chatHistory]);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-120 flex items-center justify-center p-4">
      <div className="bg-[#0b141a] w-full max-w-3xl h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/5 animate-in zoom-in duration-300">
        <div className="bg-[#202c33] p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="text-[#aebac1] hover:text-white transition-colors">
               <ChevronRight className="rotate-180" size={28} />
            </button>
            <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-xl overflow-hidden border border-brand-primary/20 shadow-inner">
               {lead.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">{lead.name}</h3>
              <p className="text-xs text-[#8696a0] font-bold mt-1 uppercase tracking-widest opacity-60">META PROSPECT • ONLINE</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#aebac1]">
             <Search size={20} className="hidden sm:block cursor-pointer hover:text-white" />
             <More size={20} className="cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a] custom-scrollbar" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'overlay', backgroundSize: 'cover' }}>
          <div className="flex justify-center mb-6">
            <span className="bg-[#182229] text-[#8696a0] px-4 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm">Encryption Validated</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[75%] rounded-[20px] p-5 shadow-sm relative ${msg.isMe ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}>
                 {!msg.isMe && <p className="text-[10px] font-black text-brand-primary mb-2 uppercase tracking-widest">{msg.sender}</p>}
                 <p className="text-base leading-relaxed font-medium break-words overflow-hidden whitespace-pre-wrap">{msg.text}</p>
                 <div className="flex items-center justify-end gap-2 mt-2 opacity-50">
                    <span className="text-[11px] font-bold">{msg.time || '12:00 PM'}</span>
                    {msg.isMe && <CheckCircle2 size={12} className="text-[#53bdeb]" />}
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#202c33] p-3 flex items-center gap-3">
           <div className="flex items-center gap-4 px-2 text-[#aebac1]">
              <Plus size={24} className="cursor-not-allowed opacity-50" />
           </div>
           <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2.5 text-[#aebac1] text-xs font-medium border border-white/5 opacity-50 select-none">
              History view only • Read mode active
           </div>
           <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-lg opacity-50">
              <Send size={20} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
