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
  ChevronDown,
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
  MessageCircle,
  Phone,
  Send,
  MoreVertical as More,
  Briefcase,
  ExternalLink,
  LogIn,
  Zap,
  PencilLine,
  Clock
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


const FUNNEL_STATUSES = [
  'Moved to Funnel',
  'Demo Booked', 
  'Proposal Call Booked', 
  'Proposal Call booked- No show', 
  'Proposal Call Booked- Meeting done', 
  'Proposal Call booked- Potential Pipeline- Stopped responding',
  'Demo Booked - No show',
  'MOVE TO PIPELINE'
];

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
  'Demo Booked - No show',
  'MOVE TO PIPELINE'
];

const PIPELINE_FINAL_STATUSES = ['dropped', 'closed'];
const PIPELINE_STAGES = [
  'intro meeting done',
  'proposal call done',
  'closed',
  'not closed',
  'proposal sent'
];

// --- SUB-COMPONENTS ---

const WhatsappLogo = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneLogo = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const DnpLogo = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="16.5" cy="16.5" r="3.5" />
    <polyline points="16.5 14.5 16.5 16.5 18 17.5" />
  </svg>
);
const JunkLogo = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const NeverRespondedLogo = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);



const CustomSelect = ({ options, value, onChange, placeholder = "Select...", className = "", triggerClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 250);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => (opt.value !== undefined ? opt.value : opt) === value);
  const displayValue = selectedOption?.label || selectedOption || value || placeholder;

  return (
    <div className={`relative ${className} ${isOpen ? 'z-[100]' : ''}`} ref={dropdownRef} onClick={e => e.stopPropagation()}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        className={`cursor-pointer flex items-center justify-between gap-2 ${triggerClassName} focus:outline-none min-h-[32px]`}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute ${openUpward ? 'bottom-full mb-2' : 'top-full mt-1'} left-0 min-w-[180px] w-full bg-bg-card border border-border-main rounded-xl shadow-2xl z-[999] animate-in fade-in zoom-in-95 duration-200 overflow-hidden backdrop-blur-xl`}>
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar py-1">
            {options.map((opt, idx) => {
              const val = opt.value !== undefined ? opt.value : opt;
              const label = opt.label !== undefined ? opt.label : opt;
              const isSelected = val === value;
              
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onChange({ target: { value: val } });
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm font-bold cursor-pointer transition-colors flex items-center justify-between gap-4
                    ${isSelected ? 'bg-brand-primary/20 text-brand-primary' : 'text-text-main hover:bg-white/5'}`}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <CheckCircle2 size={12} className="shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Badge = ({ status }) => {
  const styles = {
    'Converted': 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
    'Follow-up': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    'DNP': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    'New': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    'Not Interested': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'not interested': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'Junk': 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20',
    'Demo Booked': 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 font-black',
    'Proposal Call Booked': 'bg-indigo-500 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 font-black tracking-tight',
    'Proposal Call Booked- Meeting done': 'bg-teal-500 text-white border-teal-600 shadow-md shadow-teal-500/20',
    'Moved to Funnel': 'bg-brand-primary/20 text-brand-primary border-brand-primary/30',
    'dropped': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'closed': 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 font-black',
  };

  return (
    <span className={`badge border ${styles[status] || styles['New']}`}>
      {status}
    </span>
  );
};

const LeadStatusTracker = ({ lead, compact = false, customStatuses = null }) => {
  const [expandedComment, setExpandedComment] = useState(null);
  const statuses = customStatuses || [
    'Intro-Whatsapp',
    'Intro Done - Phone Call',
    'Intro Done - Whatsapp',
    'DNP 1',
    'DNP 2',
    'DNP 3',
    'DNP 4',
    'Never Responded',
    'Junk'
  ];

  const rd = lead.rawData || {};
  
  const getStatusState = (s) => {
    const val = (rd[s] || rd[s.toLowerCase()] || rd[s.toUpperCase()] || rd[s.replace(/-/g, ' ')] || '')?.toString() || '';
    const isDone = val.toLowerCase().includes('done');
    const comment = rd[`${s} comment`] || rd[`${s.toLowerCase()} comment`] || rd[`${s} Comment`] || '';
    return { isDone, comment };
  };

  const nr = getStatusState('Never Responded').isDone;
  const junk = getStatusState('Junk').isDone;
  const isTerminal = nr || junk;

  return (
    <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-8'} w-full overflow-visible pb-12`}>
      <style>{`
        @keyframes breathing-inner {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 rgba(255,255,255,0)); transform: scale(1); }
          50% { filter: brightness(1.5) drop-shadow(0 0 8px rgba(255,255,255,0.8)); transform: scale(1.08); }
        }
        @keyframes flow-line-new {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .inner-glow {
          box-shadow: inset 0 0 15px rgba(255,255,255,0.4);
        }
        .flow-effect {
          background: linear-gradient(90deg, #0EA5A4 0%, #ffffff 50%, #0EA5A4 100%);
          background-size: 200% auto;
          animation: flow-line-new 3s linear infinite;
        }
      `}</style>

      {/* Row 1: Labels (Above) */}
      {!compact && (
        <div className={`flex items-start justify-center w-full px-2 transition-all duration-500 ${expandedComment ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          {statuses.map((s, idx) => {
            const { isDone } = getStatusState(s);
            const isCrossed = isTerminal && s !== 'Never Responded' && s !== 'Junk';
            const isActive = isDone && !isCrossed;
            const prevStatuses = statuses.slice(0, idx);
            const allPrevDone = prevStatuses.every(ps => getStatusState(ps).isDone);
            const isCurrentStage = !isDone && allPrevDone && !isTerminal;

            return (
              <React.Fragment key={s}>
                {idx > 0 && <div className="flex-1 min-w-[25px] max-w-[50px] invisible" />}
                <div className="w-12 flex flex-col items-center">
                  <span className={`text-[9px] font-black uppercase tracking-wider text-center w-24 transition-all duration-500 ${isActive ? 'text-brand-primary' : isCurrentStage ? 'text-white' : 'text-slate-600'}`}>
                    {s.replace('Intro Done - ', '').replace('Intro-', '')}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Row 2: Circles and Lines */}
      <div className={`flex items-center ${compact ? 'justify-start' : 'justify-center'} w-full relative z-10 transition-all duration-500 ${expandedComment ? 'opacity-30 scale-95 blur-[1px]' : 'opacity-100 scale-100 blur-0'}`}>
        {statuses.map((s, idx) => {
          const { isDone, comment } = getStatusState(s);
          const isCrossed = isTerminal && s !== 'Never Responded' && s !== 'Junk';
          const isDnp = s.includes('DNP');
          const isActive = isDone && !isCrossed;
          
          const prevStatuses = statuses.slice(0, idx);
          const allPrevDone = prevStatuses.every(ps => getStatusState(ps).isDone);
          const isCurrentStage = !isDone && allPrevDone && !isTerminal;

          let colorClass = 'bg-slate-800/40 border-slate-700/50 text-slate-600';
          if (isActive) {
            colorClass = (s === 'Never Responded' || s === 'Junk') 
              ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
              : 'bg-[#0F766E] border-brand-primary/50 text-white shadow-[0_0_20px_rgba(14,165,164,0.2)]';
          } else if (isCrossed) {
            colorClass = 'bg-rose-500/5 border-rose-500/10 text-rose-500/20';
          } else if (isCurrentStage) {
            colorClass = 'bg-transparent border-brand-primary/50 text-brand-primary/70';
          }

          return (
            <React.Fragment key={s}>
              {idx > 0 && (
                <div className={`h-[2px] ${compact ? 'w-2' : 'flex-1 min-w-[25px] max-w-[50px]'} relative overflow-hidden bg-slate-800/80`}>
                  {isDone && !isCrossed && (
                    <div className="absolute inset-0 flow-effect"></div>
                  )}
                </div>
              )}
              <div className="relative group/status">
                {compact && comment && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3 py-2 bg-bg-card border border-border-main rounded-xl shadow-2xl opacity-0 group-hover/status:opacity-100 group-hover/status:-translate-y-1 translate-y-0 pointer-events-none transition-all duration-300 z-[100] w-max max-w-[180px] backdrop-blur-xl">
                    <p className="text-[10px] font-bold text-text-main leading-tight italic text-center">"{comment}"</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 w-3 h-3 bg-bg-card border-r border-b border-border-main rotate-45"></div>
                  </div>
                )}
                <div 
                  className={`
                    ${compact ? 'w-6 h-6' : 'w-12 h-12'} 
                    rounded-full flex items-center justify-center border-2 shrink-0 
                    ${colorClass}
                    ${(isActive || isCurrentStage) ? 'inner-glow' : ''}
                  `}
                >
                  <div 
                    className={(isActive || isCurrentStage) ? 'animate-[breathing-inner_3s_ease-in-out_infinite]' : ''}
                    style={{ animationDelay: `${idx * 200}ms` }}
                  >
                    {isCrossed ? (
                      <X size={compact ? 12 : 20} strokeWidth={3} />
                    ) : (isDone || isCurrentStage) ? (
                      s.includes('Whatsapp') ? <WhatsappLogo size={compact ? 12 : 24} color="white" /> :
                      s.includes('Phone') ? <PhoneLogo size={compact ? 12 : 24} color="white" /> :
                      isDnp ? <DnpLogo size={compact ? 12 : 24} color="white" /> :
                      s === 'Junk' ? <JunkLogo size={compact ? 12 : 24} color="white" /> :
                      s === 'Never Responded' ? <NeverRespondedLogo size={compact ? 12 : 24} color="white" /> :
                      <CheckCircle2 size={compact ? 12 : 24} strokeWidth={3} />
                    ) : (
                      <div className={`rounded-full ${compact ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'} bg-slate-700`}></div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Row 3: Comments Below Circles */}
      {!compact && (
        <div className="flex items-start justify-center w-full px-2 relative z-30">
          {statuses.map((s, idx) => {
            const { comment } = getStatusState(s);
            const isExpanded = expandedComment === s;

            return (
              <React.Fragment key={s}>
                {idx > 0 && <div className="flex-1 min-w-[25px] max-w-[50px] invisible" />}
                <div className={`w-12 flex flex-col items-center transition-all duration-500 ${expandedComment && !isExpanded ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  {comment ? (
                    <button
                      onClick={() => setExpandedComment(isExpanded ? null : s)}
                      className={`
                        text-[8px] font-black text-center py-1.5 px-3 rounded-full border transition-all duration-500 leading-tight
                        ${isExpanded
                          ? 'bg-brand-primary/20 border-brand-primary text-brand-primary w-48 z-50 relative shadow-[0_0_30px_rgba(14,165,164,0.3)] scale-125 translate-y-2 animate-in zoom-in-95 duration-300'
                          : 'bg-bg-main/80 border-border-main text-text-muted hover:border-brand-primary/40 hover:text-text-main w-24 hover:scale-110 active:scale-95 shadow-sm'}
                      `}
                    >
                      {isExpanded
                        ? <span className="whitespace-normal break-words italic text-[10px] drop-shadow-sm">"{comment}"</span>
                        : <span className="truncate block w-full uppercase tracking-tighter">{comment.length > 10 ? comment.substring(0, 9) + '…' : comment}</span>
                      }
                    </button>
                  ) : (
                    <div className="h-5" />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

    </div>
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

const BoostedIcon = ({ size = 10, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.5 1.5L14.5 1.5V4.5H19.5L14.5 10.5L11.5 7.5L0.5 18.5V22.5H23.5V1.5ZM3.5 20.5H5.5V16.5H3.5V20.5ZM8.5 20.5H10.5V13.5H8.5V20.5ZM13.5 20.5H15.5V12.5H13.5V20.5ZM18.5 20.5H20.5V8.5H18.5V20.5Z"/>
  </svg>
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
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-[#0a0a0a] p-10 rounded-[32px] border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-4">Render Error Caught</h2>
            <p className="text-sm text-[#8696a0] font-medium leading-relaxed mb-6">
              A component crashed during rendering. See the error below.
            </p>
            <div className="bg-[#000000] rounded-xl p-4 mb-6 text-left border border-rose-500/20 max-h-36 overflow-y-auto">
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


const SourceAnalytics = ({ 
  leads, currentView, mainLeads = [], 
  activeAccount, setActiveAccount, linkedInAccounts, 
  activeAccountDropdown, setActiveAccountDropdown, setShowAccountModal,
  activeDashboardDropdown, setActiveDashboardDropdown
}) => {

  const COLORS = ['#0EA5A4', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6'];
  const LI_COLORS = ['#0a66c2', '#0EA5A4', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899'];
  const [metaFilter, setMetaFilter] = useState('All');
  const [liFilter, setLiFilter] = useState('All');
  const LI_FILTER_STATUSES = ['All', 'Moved to Funnel', 'Moved to FollowUp', 'No Response', '1st msg', '2nd msg', '3rd msg', '4th msg', 'Mailed', 'Not intrested'];
  
  // Localized Pipeline Composition Data for Current View
  const sourceLeads = useMemo(() => leads.filter(l => 
    l.source === currentView && 
    (currentView !== 'Linkedin' || activeAccount === 'All Accounts' || l.linkedInAccount === activeAccount)
  ), [leads, currentView, activeAccount]);

  const sourceData = useMemo(() => {
    const counts = sourceLeads.reduce((acc, lead) => {
      const status = lead.status || 'New';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    })).sort((a, b) => b.value - a.value);
  }, [sourceLeads]);
  
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
    const liStatusData = useMemo(() => {
      const liStatuses = ['Moved to Funnel', 'Moved to FollowUp', 'No Response', '1st msg', '2nd msg', '3rd msg', '4th msg', 'Mailed', 'Not intrested'];
      const counts = {};
      sourceLeads.forEach(l => {
        const st = l.status || 'New';
        if (liStatuses.includes(st)) {
          counts[st] = (counts[st] || 0) + 1;
        } else {
          counts['Other'] = (counts['Other'] || 0) + 1;
        }
      });
      return Object.keys(counts).map(key => ({
        name: key,
        count: counts[key]
      })).sort((a, b) => b.count - a.count);
    }, [sourceLeads]);

    // Employee Size Distribution
    const sizeData = useMemo(() => {
      const counts = {};
      sourceLeads.forEach(l => {
        const size = (l.employeeSize && l.employeeSize !== '-') ? l.employeeSize.toString().trim() : 'Unknown';
        counts[size] = (counts[size] || 0) + 1;
      });
      return Object.keys(counts).map(key => ({
        name: key,
        value: counts[key]
      })).sort((a, b) => b.value - a.value).slice(0, 7);
    }, [sourceLeads]);

    const liFunnelData = useMemo(() => {
      const accepted = sourceLeads.filter(l => l.acceptanceDate && l.acceptanceDate !== '-' && l.acceptanceDate !== '').length;
      const responded = sourceLeads.filter(l => ['Moved to Funnel', 'Moved to FollowUp', 'Not intrested'].includes(l.status)).length;
      const movedToFunnel = sourceLeads.filter(l => l.status === 'Moved to Funnel').length;
      return [
        { name: 'Requests Sent', count: sourceLeads.length },
        { name: 'Accepted', count: accepted },
        { name: 'Responded', count: responded },
        { name: 'Moved to Funnel', count: movedToFunnel }
      ];
    }, [sourceLeads]);

    // LinkedIn KPI Calculations (Derived from memoized funnel data)
    const liTotal = liFunnelData[0].count;
    const liAccepted = liFunnelData[1].count;
    const liResponded = liFunnelData[2].count;
    const liMovedToFunnel = liFunnelData[3].count;

    const acceptanceRate = liTotal > 0 ? Math.round((liAccepted / liTotal) * 100) : 0;
    const responseRate = liAccepted > 0 ? Math.round((liResponded / liAccepted) * 100) : 0;
    const funnelConvRate = liTotal > 0 ? Math.round((liMovedToFunnel / liTotal) * 100) : 0;

    const renderLiFunnelTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        const idx = liFunnelData.findIndex(d => d.name === data.name);
        const prev = idx > 0 ? liFunnelData[idx - 1].count : data.count;
        const passRate = prev > 0 ? Math.round((data.count / prev) * 100) : 0;
        const totalYield = liFunnelData[0].count > 0 ? Math.round((data.count / liFunnelData[0].count) * 100) : 0;
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

        {/* LinkedIn Status & Account Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-bg-card p-3 rounded-2xl border border-border-main shadow-xs">
          {/* Sender ID Filter (Custom Dropdown) */}
          {linkedInAccounts.length > 1 && (
            <div className="relative flex items-center gap-3 bg-bg-main px-4 py-2 rounded-xl border border-border-main">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest shrink-0">Sender ID:</span>
              <button 
                onClick={() => setActiveAccountDropdown(!activeAccountDropdown)}
                className="flex items-center gap-4 text-[10px] font-black text-text-main hover:text-brand-primary transition-colors uppercase tracking-widest min-w-[140px] justify-between"
              >
                {activeAccount}
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeAccountDropdown ? 'rotate-180' : ''}`} />
              </button>

              {activeAccountDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 z-[120] bg-bg-card border border-border-main rounded-3xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                    {linkedInAccounts.map((acc) => (
                      <button
                        key={acc}
                        onClick={() => {
                          setActiveAccount(acc);
                          setActiveAccountDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                          ${activeAccount === acc 
                            ? 'bg-brand-primary text-white shadow-lg' 
                            : 'text-text-muted hover:bg-bg-main hover:text-text-main'}`}
                      >
                        {acc}
                      </button>
                    ))}
                    <div className="border-t border-border-main mt-1 pt-1">
                      <button 
                        onClick={() => {
                          setShowAccountModal(true);
                          setActiveAccountDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black text-brand-primary uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                      >
                        + REGISTER NEW SENDER
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-border-main hidden md:block"></div>

          {/* Status Filter (Custom Dropdown) */}
          <div className="relative flex items-center gap-3 bg-bg-main px-4 py-2 rounded-xl border border-border-main">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest shrink-0">Status:</span>
            <button 
              onClick={() => setActiveDashboardDropdown(activeDashboardDropdown === 'status-filter' ? null : 'status-filter')}
              className="flex items-center gap-4 text-[10px] font-black text-text-main hover:text-brand-primary transition-colors uppercase tracking-widest min-w-[140px] justify-between"
            >
              {liFilter === 'All' ? '✦ All Statuses' : liFilter}
              <ChevronDown size={14} className={`transition-transform duration-300 ${activeDashboardDropdown === 'status-filter' ? 'rotate-180' : ''}`} />
            </button>

            {activeDashboardDropdown === 'status-filter' && (
              <div className="absolute top-full mt-2 left-0 right-0 z-[120] bg-bg-card border border-border-main rounded-3xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                  {LI_FILTER_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setLiFilter(s);
                        setActiveDashboardDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                        ${liFilter === s 
                          ? 'bg-brand-primary text-white shadow-lg' 
                          : 'text-text-muted hover:bg-bg-main hover:text-text-main'}`}
                    >
                      {s === 'All' ? '✦ All Statuses' : s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {liFilter !== 'All' && (
            <button
              onClick={() => setLiFilter('All')}
              className="px-6 py-2.5 bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0a66c2] hover:text-white transition-all shadow-sm"
            >
              Clear Filter
            </button>
          )}

          {liFilter !== 'All' && (
            <div className="ml-auto hidden sm:flex items-center gap-3 px-4 py-2 bg-bg-main rounded-xl border border-border-main shadow-inner">
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
                    <Pie 
                      data={sourceData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={90} 
                      paddingAngle={5} 
                      dataKey="value" 
                      stroke="none"
                      isAnimationActive={false}
                      labelLine={{ stroke: '#334155', strokeWidth: 1 }}
                      label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius * 1.35;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        if (!name || name === '-' || name === '---' || percent < 0.01) return null;
                        const displayName = name.length > 12 ? name.substring(0, 10) + '..' : name;
                        return (
                          <text x={x} y={y} fill="#8696a0" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={8} fontWeight="900" className="uppercase tracking-widest">
                            {displayName} ({Math.round(percent * 100)}%)
                          </text>
                        );
                      }}
                    >
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
                    <Bar dataKey="count" fill="#0a66c2" radius={[6, 6, 0, 0]} barSize={30} isAnimationActive={false} label={{ position: 'top', fill: '#8696a0', fontSize: 9, fontWeight: 900 }}>
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
                      <Pie 
                        data={sizeData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={50} 
                        outerRadius={80} 
                        paddingAngle={4} 
                        dataKey="value" 
                        stroke="none"
                        isAnimationActive={false}
                        labelLine={{ stroke: '#334155', strokeWidth: 1 }}
                        label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius * 1.35;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          if (!name || name === 'Unknown' || percent < 0.01) return null;
                          return (
                            <text x={x} y={y} fill="#8696a0" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={8} fontWeight="900" className="uppercase tracking-widest">
                              {name} ({Math.round(percent * 100)}%)
                            </text>
                          );
                        }}
                      >
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
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={25} isAnimationActive={false} label={{ position: 'right', fill: '#8696a0', fontSize: 9, fontWeight: 900 }}>
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
        <div className="mt-8 mb-6">
          <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">
            {liFilter !== 'All' ? 'Segment Performance Scorecard' : 'Overview of your LinkedIn outreach activity'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Volume */}
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#0a66c2]/30 transition-all duration-300 relative overflow-hidden">
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
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#0EA5A4]/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#0EA5A4]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{liFilter !== 'All' ? 'Segment Weight' : 'Accepted Requests'}</p>
                <h3 className="text-4xl font-black text-text-main tracking-tight">
                  {liFilter !== 'All' ? `${Math.round((liFilteredCount / liTotal) * 100)}%` : liAccepted.toLocaleString()}
                </h3>
                <p className="text-[11px] text-[#0EA5A4] font-black mt-1">
                  {liFilter !== 'All' ? 'Of LinkedIn pipeline' : `${acceptanceRate}% acceptance rate`}
                </p>
              </div>
              <div className="bg-[#0EA5A4]/10 dark:bg-white/10 p-4 rounded-2xl text-[#0EA5A4] shadow-lg border border-[#0EA5A4]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
            </div>

            {/* Tactical Metric: Dormant Leads */}
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#f59e0b]/30 transition-all duration-300 relative overflow-hidden">
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
            <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#8b5cf6]/30 transition-all duration-300 relative overflow-hidden">
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
    'not interested', 'Junk', 'Junk lead', 'MOVE TO PIPELINE'
  ];

  const totalMetaLeads = sourceLeads.length;
  const filteredLeads = metaFilter === 'All' ? sourceLeads : sourceLeads.filter(l => l.status === metaFilter);
  const filteredCount = filteredLeads.length;
  const filteredPercent = totalMetaLeads > 0 ? Math.round((filteredCount / totalMetaLeads) * 100) : 0;

  // Filtered Status Distribution
  const fStatusData = useMemo(() => {
    const counts = filteredLeads.reduce((acc, lead) => {
      const status = lead.status || 'New';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredLeads]);

  // Attrition from filtered leads
  const attritionData = useMemo(() => {
    const attritionStatuses = ['DNP 1', 'DNP 2', 'DNP 3', 'DNP 4', 'Never Responded', 'not interested', 'Junk', 'Demo Booked - No show', 'Proposal Call booked- No show', 'Proposal Call booked- Potential Pipeline- Stopped responding'];
    const counts = filteredLeads.filter(l => attritionStatuses.includes(l.status)).reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    })).sort((a,b) => b.value - a.value).slice(0, 5);
  }, [filteredLeads]);

  // ─── MAIN LEADS PERFORMANCE (FOR CARDS) ─────────────────────────
  const outreachLeads = mainLeads.length > 0 ? mainLeads : [];
  
  const introsList = ['Intro-Whatsapp', 'Intro Done - Phone Call', 'Intro Done - Whatsapp', 'FUP'];
  const nurturingList = ['DNP 1', 'DNP 2'];
  const advancedDnpList = ['DNP 3', 'DNP 4'];
  
  const mUniverse = outreachLeads.length;
  const mEngaged = outreachLeads.filter(l => introsList.includes(l.status)).length;
  const mNurturing = outreachLeads.filter(l => nurturingList.includes(l.status)).length;
  const mAdvanced = outreachLeads.filter(l => advancedDnpList.includes(l.status)).length;

  const mEngagedRate = mUniverse > 0 ? Math.round((mEngaged / mUniverse) * 100) : 0;
  const mNurtureRate = mEngaged > 0 ? Math.round((mNurturing / mEngaged) * 100) : 0;
  const mAdvancedRate = mNurturing > 0 ? Math.round((mAdvanced / mNurturing) * 100) : 0;

  // ─── ACTION-ORIENTED TACTICAL METRICS ─────────────────────────
  const now = new Date('2026-04-10'); // Simulated current date
  const dormantLeads = sourceLeads.filter(l => {
    if (!l.lastContact) return true;
    const diff = Math.floor((now - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
    return diff >= 7;
  }).length;
  
  const recentMomentum = sourceLeads.filter(l => {
    if (!l.lastContact) return false;
    const diff = Math.floor((now - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
    return diff <= 1;
  }).length;

  // ─── RECONSTRUCT FUNNEL DATA (FOR CHARTS) ─────────────────────────
  const funnelData = useMemo(() => {
    const introsList = ['Intro-Whatsapp', 'Intro Done - Phone Call', 'Intro Done - Whatsapp', 'FUP'];
    const demosList = ['Demo Booked', 'Demo Booked - No show'];
    const proposalsList = ['Proposal Call Booked', 'Proposal Call booked- No show', 'Proposal Call Booked- Meeting done', 'Proposal Call booked- Potential Pipeline- Stopped responding'];
    
    const proposals = sourceLeads.filter(l => proposalsList.includes(l.status)).length;
    const demos = sourceLeads.filter(l => demosList.includes(l.status)).length + proposals;
    const engaged = sourceLeads.filter(l => introsList.includes(l.status)).length + demos;

    return [
      { name: 'Universe', count: sourceLeads.length },
      { name: 'Engaged', count: engaged },
      { name: 'Demos Booked', count: demos },
      { name: 'Proposals', count: proposals }
    ];
  }, [sourceLeads]);

  const renderFunnelTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const index = funnelData.findIndex(d => d.name === data.name);
      const previous = index > 0 ? funnelData[index - 1].count : data.count;
      const rate = previous > 0 ? Math.round((data.count / previous) * 100) : 0;
      const overallRate = sourceLeads.length > 0 ? Math.round((data.count / sourceLeads.length) * 100) : 0;

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
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-black text-text-main tracking-tight block">Macro Telemetry</h2>
        <div className="h-px bg-border-main flex-1 hidden sm:block"></div>
      </div>
      {/* Status Filter Bar */}
      <div className="flex items-center gap-4 mb-6 bg-bg-card p-3 rounded-2xl border border-border-main shadow-xs">
        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] shrink-0 pl-2">Filter by Status:</span>
        <CustomSelect
          value={metaFilter}
          onChange={(e) => setMetaFilter(e.target.value)}
          options={META_FILTER_STATUSES.map(s => ({ value: s, label: s === 'All' ? '✦ All Statuses' : s }))}
          className="flex-1 max-w-xs"
          triggerClassName="px-4 py-2.5 rounded-xl border border-border-main bg-bg-main text-xs font-black text-text-main outline-none focus:border-brand-primary"
        />
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
                  <Pie 
                    data={sourceData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={90} 
                    paddingAngle={5} 
                    dataKey="value" 
                    stroke="none"
                    isAnimationActive={false}
                    labelLine={{ stroke: '#334155', strokeWidth: 1 }}
                    label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.35;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      if (!name || name === '-' || name === '---' || percent < 0.01) return null;
                      const displayName = name.length > 12 ? name.substring(0, 10) + '..' : name;
                      return (
                        <text x={x} y={y} fill="#8696a0" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={8} fontWeight="900" className="uppercase tracking-widest">
                          {displayName} ({Math.round(percent * 100)}%)
                        </text>
                      );
                    }}
                  >
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
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} isAnimationActive={false} label={{ position: 'top', fill: '#8696a0', fontSize: 9, fontWeight: 900 }}>
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
                    <Pie 
                      data={attritionData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={50} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value" 
                      stroke="none"
                      isAnimationActive={false}
                      labelLine={{ stroke: '#334155', strokeWidth: 1 }}
                      label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius * 1.35;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        if (!name || name === '-' || percent < 0.01) return null;
                        const displayName = name.length > 12 ? name.substring(0, 10) + '..' : name;
                        return (
                          <text x={x} y={y} fill="#8696a0" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={8} fontWeight="900" className="uppercase tracking-widest">
                            {displayName} ({Math.round(percent * 100)}%)
                          </text>
                        );
                      }}
                    >
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
                  <Bar dataKey="count" fill="#0EA5A4" radius={[0, 6, 6, 0]} barSize={25} isAnimationActive={false} label={{ position: 'right', fill: '#8696a0', fontSize: 9, fontWeight: 900 }}>
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
      <div className="mt-8 mb-6">
        <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6 select-none">
          {metaFilter !== 'All' ? 'Segment Performance Scorecard' : 'Outreach Performance Scorecard'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Main Metric */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#0EA5A4]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0EA5A4]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Current Volume' : 'Total Main Universe'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? filteredCount.toLocaleString() : mUniverse.toLocaleString()}
              </h3>
              <p className="text-[11px] text-text-muted font-bold mt-1 opacity-70">
                {metaFilter !== 'All' ? 'Leads in active focus' : 'People in Outreach phase'}
              </p>
            </div>
            <div className="bg-[#0EA5A4]/10 dark:bg-white/10 p-4 rounded-2xl text-[#0EA5A4] shadow-lg border border-[#0EA5A4]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              {metaFilter !== 'All' ? <Users size={24} strokeWidth={2.5} /> : <Database size={24} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Engagement Status */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#3b82f6]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#3b82f6]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Segment Weight' : 'Initial Engagement'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? filteredPercent : mEngaged.toLocaleString()}
                {metaFilter !== 'All' && <span className="text-xl">%</span>}
              </h3>
              <p className="text-[11px] text-[#3b82f6] font-black mt-1">
                {metaFilter !== 'All' ? 'Of source pipeline' : `${mEngagedRate}% initial yield`}
              </p>
            </div>
            <div className="bg-[#3b82f6]/10 dark:bg-white/10 p-4 rounded-2xl text-[#3b82f6] shadow-lg border border-[#3b82f6]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              <MessageSquare size={24} strokeWidth={2.5} />
            </div>
          </div>

          {/* Dormant Leads Tracking */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#f59e0b]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#f59e0b]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Dormant Leads' : 'Active Nurturing'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? dormantLeads : mNurturing.toLocaleString()}
              </h3>
              <p className="text-[11px] text-[#f59e0b] font-black mt-1">
                {metaFilter !== 'All' ? 'Idle for 7+ days' : `${mNurtureRate}% nurture pass-through`}
              </p>
            </div>
            <div className="bg-[#f59e0b]/10 dark:bg-white/10 p-4 rounded-2xl text-[#f59e0b] shadow-lg border border-[#f59e0b]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
              {metaFilter !== 'All' ? <XCircle size={24} strokeWidth={2.5} /> : <Layers size={24} strokeWidth={2.5} />}
            </div>
          </div>

          {/* Recent Momentum Tracking */}
          <div className="bg-bg-card p-6 rounded-[32px] border border-border-main/50 shadow-md dark:shadow-xl flex items-center justify-between group hover:border-[#0EA5A4]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0EA5A4]/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{metaFilter !== 'All' ? 'Recent Momentum' : 'Pending Advanced'}</p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">
                {metaFilter !== 'All' ? recentMomentum : mAdvanced.toLocaleString()}
              </h3>
              <p className="text-[11px] text-[#0EA5A4] font-black mt-1">
                {metaFilter !== 'All' ? 'Active in last 24h' : `${mAdvancedRate}% advanced yield`}
              </p>
            </div>
            <div className="bg-[#0EA5A4]/10 dark:bg-white/10 p-4 rounded-2xl text-[#0EA5A4] shadow-lg border border-[#0EA5A4]/20 relative z-10 transition-transform group-hover:scale-110 duration-300">
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
        { name: 'Funnel', icon: Layers, path: '/funnel' },
        { name: 'Pipeline', icon: Briefcase, path: '/pipeline' },
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
                <CustomSelect
                  options={linkedInAccounts}
                  value={formData.linkedInAccount}
                  onChange={e => setFormData({...formData, linkedInAccount: e.target.value})}
                  triggerClassName="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                />
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
                  <CustomSelect
                    options={['11-50', '51-200']}
                    value={formData.employeeSize}
                    onChange={e => setFormData({...formData, employeeSize: e.target.value})}
                    triggerClassName="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                  />
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
                  <CustomSelect
                    options={['New', 'Follow-up', 'DNP', 'Not Interested']}
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    triggerClassName="w-full px-4 py-3 rounded-xl border border-border-main bg-bg-main outline-none focus:border-brand-primary text-text-main font-bold"
                  />
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
                  <label className="block text-[8px] font-black text-brand-primary uppercase tracking-widest mb-2 ml-1 flex justify-between items-center">
                    <span className="flex items-center gap-1"><Clock size={8} /> Apply Time</span>
                    <div className="flex bg-bg-main border border-brand-primary/20 rounded-lg overflow-hidden">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, upworkTimeType: 'Now'})}
                        className={`px-1.5 py-0.5 text-[6px] font-black transition-all ${formData.upworkTimeType === 'Now' ? 'bg-brand-primary text-white' : 'text-brand-primary/60 hover:bg-brand-primary/5'}`}
                      >
                        NOW
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, upworkTimeType: 'Other'})}
                        className={`px-1.5 py-0.5 text-[6px] font-black transition-all ${formData.upworkTimeType === 'Other' ? 'bg-brand-primary text-white' : 'text-brand-primary/60 hover:bg-brand-primary/5'}`}
                      >
                        OTHER
                      </button>
                    </div>
                  </label>
                  {formData.upworkTimeType === 'Other' ? (
                    <input
                      type="time"
                      className="w-full px-3 py-2 rounded-xl border border-brand-primary/20 bg-bg-main text-xs font-bold text-text-main outline-none"
                      value={formData.upworkApplyTime}
                      onChange={e => setFormData({...formData, upworkApplyTime: e.target.value})}
                    />
                  ) : (
                    <div className="w-full px-3 py-2 rounded-xl border border-brand-primary/10 bg-bg-main/50 text-[10px] font-bold text-text-muted italic flex items-center gap-1.5 h-[34px]">
                      <div className="w-1 h-1 bg-brand-primary rounded-full animate-pulse"></div>
                      Auto-sync
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isAppliedWithin10Mins: !prev.isAppliedWithin10Mins }))}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-[0.98] border ${
                    formData.isAppliedWithin10Mins 
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' 
                      : 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 hover:bg-brand-primary/20'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors ${formData.isAppliedWithin10Mins ? 'bg-white' : 'bg-brand-primary'}`}></div>
                  Applied within 10 mins
                  <Send size={12} className={formData.isAppliedWithin10Mins ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'} />
                </button>
                <p className="text-[8px] text-brand-primary/60 font-bold mt-2 text-center uppercase tracking-widest italic">
                  * Toggling this adds high-priority IST tracking
                </p>
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

const FunnelWrapper = ({ renderFunnel, fetchSourceLeads, activeSource, setActiveSource }) => {
  const location = useLocation();
  useEffect(() => {
    const source = (activeSource === 'Meta' || activeSource === 'Linkedin') ? activeSource : 'Meta';
    if (activeSource !== source) setActiveSource(source);
    fetchSourceLeads(source, true);
  }, [location.pathname]);

  return renderFunnel();
};

const LeadsWrapper = ({ renderLeads, fetchSourceLeads, activeSource }) => {
  const location = useLocation();
  useEffect(() => {
    fetchSourceLeads(activeSource, false);
  }, [location.pathname]);

  return renderLeads();
};

const PipelineWrapper = ({ renderPipeline, fetchSourceLeads, activeSource }) => {
  const location = useLocation();
  useEffect(() => {
    fetchSourceLeads(activeSource, false, true);
  }, [location.pathname]);

  return renderPipeline();
};

// --- MAIN APP COMPONENT ---

const AppContent = ({ 
  theme, toggleTheme, searchQuery, setSearchQuery, setShowAddForm, 
  renderDashboard, renderLeads, renderFunnel, renderPipeline, fetchSourceLeads, updateLeadAccount,
  activeSource, setActiveSource, setFormData, user, onLogout 
}) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Lead Operations Center';
      case '/leads': return 'Leads';
      case '/funnel': return 'Sales Funnel';
      case '/pipeline': return 'Pipeline Management';
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
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border-main/40">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-md animate-pulse"></div>
                  <div className="relative w-2.5 h-2.5 bg-brand-primary rounded-full border border-white/20"></div>
                </div>
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">System Live • 2026-04-25</span>
              </div>
              <h1 className="text-6xl font-black text-text-main tracking-tighter leading-none">
                {getPageTitle()}
              </h1>
              <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em] mt-4 opacity-50 flex items-center gap-2">
                <Database size={12} className="opacity-40" />
                {location.pathname === '/dashboard' ? 'OPTIMIZING SALES CONVERSIONS THROUGH DATA INTERPRETATION' : 'SECURE SYSTEM DIRECTORY ACCESS'}
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 pr-4">
               <div className="text-right">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Active Session</p>
               </div>
               <div className="h-8 w-px bg-border-main/50"></div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Corpus</p>
                  <p className="text-xs font-black text-text-main uppercase tracking-widest">Revenue Discipline</p>
               </div>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={renderDashboard()} />
            <Route path="/leads" element={<LeadsWrapper renderLeads={renderLeads} fetchSourceLeads={fetchSourceLeads} activeSource={activeSource} />} />
            <Route path="/funnel" element={<FunnelWrapper renderFunnel={renderFunnel} fetchSourceLeads={fetchSourceLeads} activeSource={activeSource} setActiveSource={setActiveSource} />} />
            <Route path="/pipeline" element={<PipelineWrapper renderPipeline={renderPipeline} fetchSourceLeads={fetchSourceLeads} activeSource={activeSource} />} />
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
    'Demo Booked - No show', 'MOVE TO PIPELINE'
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
  const [funnelLeads, setFunnelLeads] = useState([]);
  const [pipelineLeads, setPipelineLeads] = useState([]);
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
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeDatePreset, setActiveDatePreset] = useState('ALL_TIME');
  const [activeDateDropdown, setActiveDateDropdown] = useState(false);
  const [activeDnpComment, setActiveDnpComment] = useState(null);
  const [dnpCommentText, setDnpCommentText] = useState('');
  const [activeAccountDropdown, setActiveAccountDropdown] = useState(false);
  const [usdToInr, setUsdToInr] = useState(null);
  const [editingConnects, setEditingConnects] = useState(false);
  const [editingBidAmount, setEditingBidAmount] = useState(false);
  const [connectsInputVal, setConnectsInputVal] = useState('');
  const [bidAmountInputVal, setBidAmountInputVal] = useState('');
  const [showInrTotal, setShowInrTotal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [upworkJobStatusFilter, setUpworkJobStatusFilter] = useState('All');
  const [upworkOutcomeFilter, setUpworkOutcomeFilter] = useState('All');



  // Fetch live USD→INR rate
  useEffect(() => {
    fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=INR')
      .then(r => r.json())
      .then(data => {
        if (data?.rates?.INR) setUsdToInr(data.rates.INR);
      })
      .catch(() => setUsdToInr(83.5)); // fallback
  }, []);

  // Auto-cycle Total Spent currency display
  useEffect(() => {
    const timer = setInterval(() => {
      setShowInrTotal(prev => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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
    linkedinUrl: '',
    companyUrl: '',
    employeeSize: '11-50',
    linkedInAccount: 'All Accounts',
    additionalInfo: '',
    isAppliedWithin10Mins: false,
    upworkApplyTime: '',
    upworkTimeType: 'Now'
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
    
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const leadDate = l.lastContact || '';
      if (dateRange.start && leadDate < dateRange.start) matchesDate = false;
      if (dateRange.end && leadDate > dateRange.end) matchesDate = false;
    }

    return matchesSearch && matchesSource && matchesAccount && matchesDate;
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

  const setDatePreset = (preset) => {
    setActiveDatePreset(preset);
    setActiveDateDropdown(false);
    const todayDate = new Date();
    if (preset === 'THIS_MONTH') {
      const start = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
      const end = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
      setDateRange({ 
        start: start.toLocaleDateString('en-CA'), 
        end: end.toLocaleDateString('en-CA') 
      });
    } else if (preset === 'LAST_MONTH') {
      const start = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
      const end = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
      setDateRange({ 
        start: start.toLocaleDateString('en-CA'), 
        end: end.toLocaleDateString('en-CA') 
      });
    } else if (preset === 'ALL_TIME') {
      setDateRange({ start: '', end: '' });
    }
    // If CUSTOM, we don't clear, just let the user change inputs
  };

  const fetchSourceLeads = async (source, isFunnel = false, isPipeline = false) => {
    setLoadingSource(source);
    try {
      let url = `${import.meta.env.VITE_API_FETCH_LEADS}?action=${source.toUpperCase()}`;
      if (isFunnel) {
         const funnelAction = source === 'Meta' ? 'MetaFunnel' : 'LinkedinFunnel';
         url = `https://n8n.srv1010832.hstgr.cloud/webhook/739d38b1-3cf2-4adb-9a88-51ba283b109f?action=${funnelAction}`;
      } else if (isPipeline) {
         url = `https://n8n.srv1010832.hstgr.cloud/webhook/739d38b1-3cf2-4adb-9a88-51ba283b109f?action=Pipeline`;
      }
      const response = await fetch(url);
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
        // Case-insensitive key lookup helper
        const getCI = (obj, ...keys) => {
          const lowerMap = {};
          Object.keys(obj).forEach(k => { lowerMap[k.toLowerCase().trim()] = obj[k]; });
          for (const k of keys) {
            const v = lowerMap[k.toLowerCase().trim()];
            if (v !== undefined && v !== null && v !== '' && v !== '-' && v !== '---') return v;
          }
          return null;
        };

        let name = item.Name || item.name || item['Prospect Name'] || item['Name/Company'] || item.fullName || '';
        const roleRaw = item['Additional info '] || item['Additional info'] || item['additional info'] || '';
        const role = roleRaw.toString().trim();
        const linkedinUrl = item['Linkedin Link'] || item.linkedin || null;
        const companyUrl = item['Company'] || item.company_website || null;
        const rawStatus = item['Status'] || item.status || (item['Lead stages'] ? item['Lead stages'] : 'New');
        
        // Determine the actual source for this specific item (crucial for Pipeline mixed leads)
        const itemSource = item.source || item['Lead Source'] || item['source'] || source;
        
        let finalStatus = 'New';
        if (itemSource === 'Meta') {
          finalStatus = META_STATUSES.includes(rawStatus) ? rawStatus : (LEAD_STATUSES.includes(rawStatus) ? rawStatus : 'New');
        } else {
          finalStatus = LEAD_STATUSES.includes(rawStatus) ? rawStatus : 'New';
        }

        const phone = item.Number || item['Lead Phone No'] || item.phone || item.mobile || '---';

        const upworkJobTypeResolved = itemSource === 'Upwork'
          ? (getCI(item,
              'Job type applied for', 'job type applied for', 'JOB TYPE APPLIED FOR',
              'Job Type Applied For', 'jobTypeAppliedFor',
              'JOB TYPE', 'Job Type', 'job type',
              'Job Classification', 'job classification'
            ) || null)
          : null;

        const upworkBidPlacedResolved = itemSource === 'Upwork'
          ? (getCI(item,
              'bid placed', 'Bid Placed', 'BID PLACED', 'BD', 'bd', 'connects bid for'
            ) || null)
          : null;

        const upworkBidAmountResolved = itemSource === 'Upwork'
          ? (getCI(item, 'Bid Amount', 'bid amount', 'BID AMOUNT', 'bid for amount', 'amount bid') || '-')
          : '-';

        const upworkAmountQuotedResolved = itemSource === 'Upwork'
          ? (getCI(item, 'Amount Quoted', 'amount quoted', 'AMOUNT QUOTED', 'quoted amount') || '-')
          : '-';

        const upworkConnectsResolved = itemSource === 'Upwork'
          ? (getCI(item, 'Connects used', 'connects used', 'CONNECTS USED', 'connects', 'connects applied for', 'Connects applied for') || '-')
          : '-';

        const upworkApplyDateResolved = itemSource === 'Upwork'
          ? (getCI(item, 'Apply Date', 'apply date', 'APPLY DATE', 'Date Applied') || '-')
          : '-';

        // ── Upwork: URL, Job Status, Outcome ──────────────────────────────
        const upworkUrlResolved = itemSource === 'Upwork'
          ? (getCI(item,
              'Link', 'link', 'URL', 'url', 'Upwork Link', 'upwork link',
              'Job URL', 'job url', 'Upwork URL', 'upwork url', 'Job Link'
            ) || null)
          : null;

        // Normalise "Open" / "Closed" from whatever the sheet sends
        const rawJobStatus = itemSource === 'Upwork'
          ? (getCI(item,
              'Job Status', 'job status', 'JOB STATUS', 'Job status',
              'Status', 'status'
            ) || 'Open')
          : 'Open';
        const upworkJobStatusResolved = ['Open','Closed'].includes(rawJobStatus) ? rawJobStatus : 'Open';

        // Normalise outcome
        const rawOutcome = itemSource === 'Upwork'
          ? (getCI(item,
              'Outcome', 'outcome', 'OUTCOME', 'Result', 'result',
              'Application Result', 'application result'
            ) || 'Pending')
          : 'Pending';
        const upworkOutcomeResolved = ["Pending", "Got it", "Didn't get it"].includes(rawOutcome) ? rawOutcome : 'Pending';

        // Row number for webhook updates
        const rowNumberResolved = item.row_number || item.row || item.ID || item.id || null;
        
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

        // For Upwork: use job type as display name when available
        if (itemSource === 'Upwork') {
          if (upworkJobTypeResolved) {
            name = upworkJobTypeResolved;
          } else if (!name || name.includes('Lead from')) {
            const link = item.Link || item.link || '';
            const match = link.match(/proposals\/(\d+)/);
            name = match ? `Upwork Job #${match[1].slice(-4)}` : 'Upwork Lead';
          }
        }
        
        const finalDisplayName = (source === 'Linkedin' && role) ? `${name} - ${role}` : name;
        if (!finalDisplayName) {
          name = itemSource === 'Meta' ? (phone !== '---' ? phone : 'Meta Prospect') : ('Lead from ' + itemSource);
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
        if (itemSource === 'Upwork') {
          const applyRaw = item['Apply Date'] || item['apply date'] || item['apply_date'] || item.col_10 || '';
          const parsed = normalizeDateForCheck(applyRaw);
          if (parsed) { nextFollowUp = parsed; followUpReason = 'Apply Date'; }
        }

        if (itemSource === 'Linkedin') {
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
            'next_followup', 'Next Follow Up', 'NextFollowUp',
            'FU1', 'FU2', 'FU3', 'FU4'
          ];

          for (const col of allDateCols) {
            const rawVal = (item[col] || '').toString();
            if (!rawVal || rawVal.toLowerCase().includes('done')) continue;

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



        const rawStage = item['Lead stages'] || item.stage || '';
        const cleanName = (finalDisplayName || name || 'lead').toString().replace(/\s+/g, '');
        const applyDate = item['Apply Date'] || item['apply date'] || '';
        const linkedinLink = item['Linkedin Link'] || item.linkedin || '';
        const uniqueSuffix = applyDate || linkedinLink || idx;
        const deterministicId = `${itemSource}-${cleanName}-${phone}-${uniqueSuffix}`.replace(/\s+/g, '');

        return {
          id: deterministicId,
          name: finalDisplayName || name,
          phone,
          source: itemSource,
          status: finalStatus,
          stage: rawStage,
          rowNumber: rowNumberResolved,
          lastContact: normalizeDateForCheck(item.Date || item.date || item.last_contact_date || item['Date/Time'] || item['Apply Date']) || today,
          acceptanceDate: item['Acceptance Date'] || item.acceptance_date || '-',
          linkedInAccount: item['Linkedin Account'] || item.linkedin_account || '-',
          isAccepted: item['Accepted (Y/N)'] || item.is_accepted || 'No',
          linkedinUrl: linkedinUrl,
          companyUrl: companyUrl,
          notes: notes,
          chatHistory: item['Chat History'] || item.chat_history || null,
          rawData: item,
          // Upwork specific fields
          upworkUrl: upworkUrlResolved,
          upworkConnects: upworkConnectsResolved,
          upworkJobType: upworkJobTypeResolved || null,
          upworkAmountQuoted: upworkAmountQuotedResolved,
          upworkBidAmount: upworkBidAmountResolved,
          upworkBidPlaced: upworkBidPlacedResolved,
          upworkApplyDate: upworkApplyDateResolved,
          upworkJobStatus: upworkJobStatusResolved,
          upworkOutcome: upworkOutcomeResolved,
          nextFollowUp: nextFollowUp || 'TBD',
          followUpReason: followUpReason || '-',
          images: item.images || []
        };
      });

      if (isFunnel) {
        // Funnel fetch → store separately, NEVER touch the main leads state
        setFunnelLeads(prev => {
          const otherSourceLeads = prev.filter(l => l.source !== source);
          return [...newLeads, ...otherSourceLeads];
        });
      } else if (isPipeline) {
        setPipelineLeads(newLeads);
      } else {
        // Main fetch → replace only this source's main leads, keep others intact
        setLeads(prev => {
          const otherSourceLeads = prev.filter(l => l.source !== source);
          return [...newLeads, ...otherSourceLeads];
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Could not sync leads from ${source}: ${error.message}`);
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

  // Removed handleQuickApply as it is now a toggle option

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
        const connects = parseFloat(formData.upworkConnects) || 0;
        const connectsCostUsd = (connects * 0.15).toFixed(2);
        const connectsCostInr = usdToInr ? (connects * 0.15 * usdToInr).toFixed(2) : null;

        const rawPayload = {
          name: formData.name || formData.upworkJobType || 'Upwork Lead',
          upworkApplyDate: formData.upworkApplyDate,
          upworkApplyTime: formData.upworkTimeType === 'Now' 
            ? new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) 
            : formData.upworkApplyTime,
          upworkUrl: formData.upworkUrl,
          upworkConnects: formData.upworkConnects,
          upworkJobType: formData.upworkJobType,
          upworkAmountQuoted: formData.upworkAmountQuoted,
          source: 'Upwork',
          isAppliedWithin10Mins: formData.isAppliedWithin10Mins,
          connectsCostUsd,
          connectsCostInr
        };

        const filteredPayload = Object.fromEntries(
          Object.entries(rawPayload).filter(([_, v]) => v !== '' && v !== null && v !== undefined && v !== '-')
        );

        const response = await fetch(import.meta.env.VITE_API_UPWORK_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filteredPayload)
        });
        if (!response.ok) throw new Error('Upwork network failure during synchronization');

        // Optional Priority Sync if toggled
        if (formData.isAppliedWithin10Mins) {
          const istTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
          const priorityPayload = {
            priority: 'Applied within 10 mins',
            istAppliedTime: istTime,
            name: formData.name || formData.upworkJobType || 'Upwork Lead',
            upworkUrl: formData.upworkUrl,
            upworkJobType: formData.upworkJobType,
            upworkConnects: formData.upworkConnects,
            upworkApplyDate: formData.upworkApplyDate,
            upworkAmountQuoted: formData.upworkAmountQuoted,
            source: 'Upwork',
            connectsCostUsd,
            connectsCostInr
          };

          const filteredPriority = Object.fromEntries(
            Object.entries(priorityPayload).filter(([_, v]) => v !== '' && v !== null && v !== undefined && v !== '-')
          );

          fetch('https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b?action=NEW', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filteredPriority)
          }).catch(err => console.error('Priority sync background error:', err));
        }
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
        linkedinUrl: '',
        companyUrl: '',
        employeeSize: '11-50',
        linkedInAccount: 'All Accounts',
        additionalInfo: '',
        upworkApplyTime: '',
        upworkTimeType: 'Now'
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

    // New requested webhook for Pipeline changes
    if (targetLead && (window.location.pathname.includes('/pipeline') || pipelineLeads.some(pl => pl.id === id))) {
      try {
        const pipelineUpdateUrl = import.meta.env.VITE_API_PIPELINE_UPDATE || "https://n8n.srv1010832.hstgr.cloud/webhook/81784f57-7689-4f8c-9345-5f074f61e857";
        const updatedLeadData = { ...targetLead, status: newStatus, lastContact: today };
        
        fetch(pipelineUpdateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            field_changed: 'Status',
            new_value: newStatus,
            full_lead_info: updatedLeadData,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Pipeline Status Sync Error:', err));
      } catch (err) {
        console.error('Pipeline Status Sync Setup Error:', err);
      }
    }

    // Upwork Master Sheet Sync
    if (targetLead && targetLead.source === 'Upwork') {
      try {
        const upworkWebhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
        const updatedLead = { ...targetLead, status: newStatus, stage: (newStatus === 'DNP' ? 'DNP1' : ''), lastContact: today };
        
        fetch(upworkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            action: 'StatusUpdate',
            'Status': newStatus,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Upwork Status Sync Error:', err));
      } catch (err) {
        console.error('Upwork Status Sync Setup Error:', err);
      }
    }
  };

  const updateLeadJobType = async (id, newJobType) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        // If it's an Upwork lead, the job type is usually the display name
        return { ...l, upworkJobType: newJobType, name: l.source === 'Upwork' ? newJobType : l.name };
      }
      return l;
    }));
    
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, upworkJobType: newJobType, name: selectedLead.source === 'Upwork' ? newJobType : selectedLead.name });
    }

    const targetLead = leads.find(l => l.id === id);
    if (!targetLead) return;

    // --- Webhook Sync Logic ---
    
    // 1. Pipeline Webhook (if applicable)
    if (window.location.pathname.includes('/pipeline') || pipelineLeads.some(pl => pl.id === id)) {
      try {
        const pipelineUpdateUrl = import.meta.env.VITE_API_PIPELINE_UPDATE || "https://n8n.srv1010832.hstgr.cloud/webhook/81784f57-7689-4f8c-9345-5f074f61e857";
        const updatedLeadData = { ...targetLead, upworkJobType: newJobType, name: targetLead.source === 'Upwork' ? newJobType : targetLead.name };

        fetch(pipelineUpdateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            field_changed: 'Job Type',
            new_value: newJobType,
            full_lead_info: updatedLeadData,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Pipeline Job Type Sync Error:', err));
      } catch (err) {
        console.error('Pipeline Job Type Sync Setup Error:', err);
      }
    }

    // 2. Upwork-specific Webhook (for all Upwork leads)
    if (targetLead.source === 'Upwork') {
      try {
        const upworkWebhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
        const updatedLeadData = { ...targetLead, upworkJobType: newJobType, name: newJobType };

        fetch(upworkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            action: 'JobTypeUpdate',
            'Job type applied for': newJobType,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Upwork Job Type Sync Error:', err));
      } catch (err) {
        console.error('Upwork Job Type Sync Setup Error:', err);
      }
    }
  };

  const syncUpworkConnections = async (lead, updatedFields) => {
    try {
      const webhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
      
      const connects = parseFloat(updatedFields.upworkConnects ?? lead.upworkConnects) || 0;
      const bidConnects = parseFloat(String(updatedFields.upworkBidAmount ?? lead.upworkBidAmount ?? '').replace(/[^0-9.]/g, '')) || 0;
      
      const appliedAmountUsd = connects * 0.15;
      const bidAmountUsd = bidConnects * 0.15;
      const appliedAmountInr = usdToInr ? (appliedAmountUsd * usdToInr) : null;
      const bidAmountInr = usdToInr ? (bidAmountUsd * usdToInr) : null;
      
      const totalConnects = connects + bidConnects;
      const totalUsd = totalConnects * 0.15;
      const totalInr = usdToInr ? (totalUsd * usdToInr) : null;

      const payload = {
        id_number: lead.rawData?.id || lead.rawData?.ID || lead.rawData?.row_number || lead.id,
        action: 'Connections',
        'applied for (connects)': connects,
        'applied for amount': appliedAmountInr ? appliedAmountInr.toFixed(0) : null,
        'bid for (connects)': bidConnects,
        'bid for amount': bidAmountInr ? bidAmountInr.toFixed(0) : null,
        totalConnects,
        costUsd: totalUsd.toFixed(2),
        costInr: totalInr ? totalInr.toFixed(0) : null,
        exchangeRate: usdToInr,
        timestamp: new Date().toISOString()
      };

      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error('Upwork Connections Sync Error:', err));
    } catch (err) {
      console.error('Upwork Connections Sync Setup Error:', err);
    }
  };

  const updateLeadConnects = async (id, newConnects) => {
    const val = newConnects === '' ? '-' : newConnects;
    setLeads(leads.map(l => l.id === id ? { ...l, upworkConnects: val } : l));
    if (selectedLead && selectedLead.id === id) setSelectedLead({ ...selectedLead, upworkConnects: val });
    
    const targetLead = leads.find(l => l.id === id);
    if (targetLead) {
      // Send only to specialized connections webhook
      syncUpworkConnections(targetLead, { upworkConnects: val });
    }
  };

  const updateUpworkJobStatus = async (id, status) => {
    setLeads(leads.map(l => l.id === id ? { ...l, upworkJobStatus: status } : l));
    if (selectedLead && selectedLead.id === id) setSelectedLead({ ...selectedLead, upworkJobStatus: status });
    
    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Upwork') {
      try {
        const upworkWebhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
        const updatedLead = { ...targetLead, upworkJobStatus: status };
        fetch(upworkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            action: 'JobStatusUpdate',
            'Job Status': status,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Upwork Job Status Sync Error:', err));
      } catch (err) {
        console.error('Upwork Job Status Sync Setup Error:', err);
      }
    }
  };

  const updateUpworkOutcome = async (id, outcome) => {
    setLeads(leads.map(l => l.id === id ? { ...l, upworkOutcome: outcome } : l));
    if (selectedLead && selectedLead.id === id) setSelectedLead({ ...selectedLead, upworkOutcome: outcome });
    
    const targetLead = leads.find(l => l.id === id);
    if (targetLead && targetLead.source === 'Upwork') {
      try {
        const upworkWebhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
        const updatedLead = { ...targetLead, upworkOutcome: outcome };
        fetch(upworkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            action: 'OutcomeUpdate',
            'Outcome': outcome,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Upwork Outcome Sync Error:', err));
      } catch (err) {
        console.error('Upwork Outcome Sync Setup Error:', err);
      }
    }
  };

  const updateLeadBidAmount = async (id, newBid) => {
    const val = newBid === '' ? '-' : newBid;
    setLeads(leads.map(l => l.id === id ? { ...l, upworkBidAmount: val } : l));
    if (selectedLead && selectedLead.id === id) setSelectedLead({ ...selectedLead, upworkBidAmount: val });
    
    const targetLead = leads.find(l => l.id === id);
    if (targetLead) {
      // Send only to specialized connections webhook
      syncUpworkConnections(targetLead, { upworkBidAmount: val });
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

    // New requested webhook for Pipeline changes
    if (targetLead && (window.location.pathname.includes('/pipeline') || pipelineLeads.some(pl => pl.id === id))) {
      try {
        const pipelineUpdateUrl = import.meta.env.VITE_API_PIPELINE_UPDATE || "https://n8n.srv1010832.hstgr.cloud/webhook/81784f57-7689-4f8c-9345-5f074f61e857";
        const updatedLeadData = { ...targetLead, linkedInAccount: newAccount };

        fetch(pipelineUpdateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            field_changed: 'LinkedIn Account',
            new_value: newAccount,
            full_lead_info: updatedLeadData,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Pipeline Account Sync Error:', err));
      } catch (err) {
        console.error('Pipeline Account Sync Setup Error:', err);
      }
    }

    // Upwork Master Sheet Sync
    if (targetLead && targetLead.source === 'Upwork') {
      try {
        const upworkWebhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
        const updatedLead = { ...targetLead, linkedInAccount: newAccount };
        
        fetch(upworkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            action: 'AccountUpdate',
            'LinkedIn Account': newAccount,
            full_lead_info: updatedLead,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Upwork Account Sync Error:', err));
      } catch (err) {
        console.error('Upwork Account Sync Setup Error:', err);
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

    // New requested webhook for Pipeline changes
    if (targetLead && (window.location.pathname.includes('/pipeline') || pipelineLeads.some(pl => pl.id === id))) {
      try {
        const pipelineUpdateUrl = import.meta.env.VITE_API_PIPELINE_UPDATE || "https://n8n.srv1010832.hstgr.cloud/webhook/81784f57-7689-4f8c-9345-5f074f61e857";
        const updatedLeadData = { ...targetLead, notes: newNotes, lastContact: today };

        fetch(pipelineUpdateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            field_changed: 'Disposition/Notes',
            new_value: newNotes,
            full_lead_info: updatedLeadData,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Pipeline Notes Sync Error:', err));
      } catch (err) {
        console.error('Pipeline Notes Sync Setup Error:', err);
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
    } else if (targetLead && targetLead.source === 'Upwork') {
      try {
        const upworkWebhookUrl = "https://n8n.srv1010832.hstgr.cloud/webhook/8ae8210b-c800-4ce4-b775-5435060f5b4b";
        const updatedRaw = { ...(targetLead.rawData || {}) };
        updatedRaw['Last conversation'] = newSummary;
        const updatedLead = { ...targetLead, rawData: updatedRaw };

        fetch(upworkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_number: targetLead.rawData?.id || targetLead.rawData?.ID || targetLead.rawData?.row_number || id,
            action: 'SummaryUpdate',
            'Last conversation': newSummary,
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('Upwork Summary Sync Error:', err));
      } catch (err) {
        console.error('Upwork Summary Sync Setup Error:', err);
      }
    }
  };
  
  const updatePipelineField = async (leadId, field, value) => {
    const updateLeadsList = (list) => list.map(l => {
      if (l.id === leadId) {
        const updatedRaw = { ...(l.rawData || {}), [field]: value };
        return { ...l, rawData: updatedRaw };
      }
      return l;
    });

    setLeads(updateLeadsList(leads));
    setPipelineLeads(updateLeadsList(pipelineLeads));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({
        ...prev,
        rawData: { ...(prev.rawData || {}), [field]: value }
      }));
    }

    try {
      // Original webhook
      fetch(`${import.meta.env.VITE_API_FETCH_LEADS}?action=UpdatePipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          field,
          value,
          row_number: selectedLead?.rawData?.row_number || selectedLead?.rawData?.row || null
        })
      }).catch(err => console.error('Original Pipeline Sync Error:', err));

      // New requested webhook
      const pipelineUpdateUrl = import.meta.env.VITE_API_PIPELINE_UPDATE || "https://n8n.srv1010832.hstgr.cloud/webhook/81784f57-7689-4f8c-9345-5f074f61e857";
      const updatedLeadData = {
        ...selectedLead,
        rawData: { ...(selectedLead?.rawData || {}), [field]: value }
      };

      await fetch(pipelineUpdateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_number: selectedLead?.rawData?.id || selectedLead?.rawData?.ID || selectedLead?.rawData?.row_number || leadId,
          field_changed: field,
          new_value: value,
          full_lead_info: updatedLeadData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Pipeline Update Webhook Error:', err);
    }
  };
  
  const submitDnpComment = async (lead, status, comment) => {
    if (!comment.trim()) {
      updateLeadNotes(lead.id, status);
      setActiveDnpComment(null);
      return;
    }

    // 1. Mark the button as Done and save comment locally
    setLeads(prevLeads => prevLeads.map(l => {
      if (l.id === lead.id) {
        const updatedRaw = { ...(l.rawData || {}) };
        updatedRaw[`${status} comment`] = comment;
        updatedRaw[`${status.toLowerCase()} comment`] = comment;
        return { ...l, rawData: updatedRaw };
      }
      return l;
    }));

    if (selectedLead && selectedLead.id === lead.id) {
      const updatedRaw = { ...(selectedLead.rawData || {}) };
      updatedRaw[`${status} comment`] = comment;
      updatedRaw[`${status.toLowerCase()} comment`] = comment;
      setSelectedLead({ ...selectedLead, rawData: updatedRaw });
    }

    updateLeadNotes(lead.id, status);

    // 2. Send comment to webhook
    if (lead.source === 'Meta') {
      try {
        await fetch(import.meta.env.VITE_API_META_STATUS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            [`${status} comment`]: comment,
            row_number: lead.rowNumber || lead.rawData?.row_number || lead.rawData?.row || null,
            lead_name: lead.name,
            phone: lead.phone,
            action_query: "Comment"
          })
        });
      } catch (err) {
        console.error('DNP Comment Sync Error:', err);
      }
    } else if (lead.source === 'Linkedin') {
      try {
        await fetch(import.meta.env.VITE_API_LINKEDIN_SYNC, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row_number: lead.rowNumber || lead.rawData?.row_number || lead.rawData?.row || null,
            column_name: `${status} comment`,
            input: comment,
            action_query: "Comment"
          })
        });
      } catch (err) {
        console.error('LinkedIn DNP Comment Sync Error:', err);
      }
    }

    setActiveDnpComment(null);
    setDnpCommentText('');
  };

  const renderDashboard = () => {
    const currentView = activeSource === 'All' ? 'Meta' : activeSource;
    // Compute directly from leads — no intermediary — to guarantee source isolation
    const mainLeads = leads.filter(l => !FUNNEL_STATUSES.includes(l.status));
    
    const activeLeads = mainLeads.filter(l =>
      l.source === currentView &&
      l.nextFollowUp === today &&
      !TERMINAL_STATUSES.includes((l.status || '').toLowerCase()) &&
      (currentView !== 'Linkedin' || activeAccount === 'All Accounts' || l.linkedInAccount === activeAccount)
    );

    const getColumnTitle = (src) => {
      if (src === 'Meta') return 'Meta';
      if (src === 'Linkedin') return 'Linkedin';
      if (src === 'Upwork') return 'Upwork';
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
                                      'Demo Booked - No show',
                                      'MOVE TO PIPELINE'
                                    ]
                                  : ['Demo Booked', 'Proposal Call Booked', 'Not Interested', 'Junk', 'MOVE TO PIPELINE'];
                                
                                return options.map(funnelStatus => (
                                  <button 
                                    key={funnelStatus}
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      if (funnelStatus === 'MOVE TO PIPELINE') {
                                        const comment = window.prompt("Add a comment for moving to pipeline:");
                                        if (comment !== null) {
                                          fetch('https://n8n.srv1010832.hstgr.cloud/webhook/8ac97b11-acf4-45f1-ab0a-e40d68ee214b', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...lead, lead_source: lead.source, pipeline_comment: comment })
                                          }).catch(err => console.error('Webhook failed', err));
                                          updateLeadNotes(lead.id, funnelStatus);
                                        }
                                        setActiveDashboardDropdown(null);
                                      } else {
                                        updateLeadNotes(lead.id, funnelStatus); 
                                        setActiveDashboardDropdown(null); 
                                      }
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

        {currentView === 'Linkedin' && linkedInAccounts.length > 1 && (
          <div className="mb-4">
             {/* Account filter moved into SourceAnalytics for better UI placement */}
          </div>
        )}

        
        <div className="flex flex-col xl:flex-row gap-8 flex-1 overflow-hidden min-h-0 pb-8">
          <div className="w-full xl:w-[450px] shrink-0 h-full">
            {renderSourceColumn(getColumnTitle(currentView), activeLeads, getColumnIcon(currentView))}
          </div>
          
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
            {(currentView === 'Meta' || currentView === 'Linkedin') ? (
              leads.length > 0 && (
                <SourceAnalytics 
                  leads={leads} 
                  mainLeads={mainLeads}
                  currentView={currentView} 
                  activeAccount={activeAccount}
                  setActiveAccount={setActiveAccount}
                  linkedInAccounts={linkedInAccounts}
                  activeAccountDropdown={activeAccountDropdown}
                  setActiveAccountDropdown={setActiveAccountDropdown}
                  setShowAccountModal={setShowAccountModal}
                  activeDashboardDropdown={activeDashboardDropdown}
                  setActiveDashboardDropdown={setActiveDashboardDropdown}
                />
              )
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
    const filteredLeads = leads.filter(lead => {
      const isFunnel = FUNNEL_STATUSES.includes(lead.status);
      const matchesSource = activeSource === 'All' || lead.source === activeSource;
      const matchesAccount = activeSource !== 'Linkedin' || activeAccount === 'All Accounts' || lead.linkedInAccount === activeAccount;
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const name = lead.name || '';
      const phone = lead.phone || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || phone.includes(searchQuery);
      
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const leadDate = lead.lastContact || '';
        if (dateRange.start && leadDate < dateRange.start) matchesDate = false;
        if (dateRange.end && leadDate > dateRange.end) matchesDate = false;
      }
      
      let matchesUpworkJobStatus = true;
      if (activeSource === 'Upwork' && upworkJobStatusFilter !== 'All') {
        matchesUpworkJobStatus = (lead.upworkJobStatus || 'Open') === upworkJobStatusFilter;
      }

      let matchesUpworkOutcome = true;
      if (activeSource === 'Upwork' && upworkOutcomeFilter !== 'All') {
        matchesUpworkOutcome = (lead.upworkOutcome || 'Pending') === upworkOutcomeFilter;
      }
      
      return matchesSource && matchesAccount && matchesStatus && matchesSearch && matchesDate && !isFunnel && matchesUpworkJobStatus && matchesUpworkOutcome;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-bg-card p-4 rounded-3xl border border-border-main shadow-xs">
          <div className="flex items-center gap-1 bg-bg-main p-1.5 rounded-2xl border border-border-main w-full lg:w-fit overflow-x-auto">
            {['Meta', 'Linkedin', 'Upwork'].map(source => (
              <button
                key={source}
                onClick={() => {
                  setActiveSource(source);
                  setStatusFilter('All');
                  fetchSourceLeads(source, false);
                }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSource === source ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-text-muted hover:text-text-main hover:bg-bg-card'}`}
              >
                {source}
              </button>
            ))}
          </div>
          {activeSource === 'Linkedin' && linkedInAccounts.length > 1 && (
            <div className="relative md:ml-4">
              <div className="flex items-center gap-3 bg-bg-main border border-border-main px-6 py-2.5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Sender ID:</span>
                <button 
                  onClick={() => setActiveAccountDropdown(!activeAccountDropdown)}
                  className="flex items-center gap-4 text-[10px] font-black text-text-main hover:text-brand-primary transition-colors uppercase tracking-widest min-w-[140px] justify-between"
                >
                  {activeAccount}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeAccountDropdown ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {activeAccountDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 z-[110] bg-bg-card border border-border-main rounded-3xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                    {linkedInAccounts.map((acc) => (
                      <button
                        key={acc}
                        onClick={() => {
                          setActiveAccount(acc);
                          setActiveAccountDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                          ${activeAccount === acc 
                            ? 'bg-brand-primary text-white shadow-lg' 
                            : 'text-text-muted hover:bg-bg-main hover:text-text-main'}`}
                      >
                        {acc}
                      </button>
                    ))}
                    <div className="border-t border-border-main mt-1 pt-1">
                      <button 
                        onClick={() => {
                          setShowAccountModal(true);
                          setActiveAccountDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black text-brand-primary uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                      >
                        + REGISTER NEW SENDER
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSource === 'Upwork' && (
            <div className="flex flex-wrap items-center gap-3 ml-auto">
              <div className="flex items-center gap-1 bg-bg-main p-1 rounded-2xl border border-border-main">
                {['All', 'Open', 'Closed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setUpworkJobStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${upworkJobStatusFilter === status ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-bg-main p-1 rounded-2xl border border-border-main">
                {['All', 'Pending', 'Got it', "Didn't get it"].map(outcome => (
                  <button
                    key={outcome}
                    onClick={() => setUpworkOutcomeFilter(outcome)}
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${upworkOutcomeFilter === outcome ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(activeSource === 'Meta' || activeSource === 'Linkedin') && (
            <div className="flex flex-wrap items-center gap-3 ml-auto">
              <div className="relative">
                <button 
                  onClick={() => setActiveDashboardDropdown(activeDashboardDropdown === 'status-filter' ? null : 'status-filter')}
                  className="bg-bg-main border border-border-main px-6 py-2.5 rounded-2xl text-[10px] font-black text-text-main outline-none flex items-center gap-4 hover:border-brand-primary transition-all shadow-sm uppercase tracking-widest min-w-[160px] justify-between"
                >
                  {statusFilter === 'All' ? 'All Statuses' : statusFilter}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDashboardDropdown === 'status-filter' ? 'rotate-180' : ''}`} />
                </button>
                {activeDashboardDropdown === 'status-filter' && (
                  <div className="absolute top-full mt-2 right-0 z-[110] bg-bg-card border border-border-main rounded-3xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-300 min-w-[200px]">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                      {['All', ...(activeSource === 'Meta' ? META_STATUSES : LEAD_STATUSES)].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatusFilter(s);
                            setActiveDashboardDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                            ${statusFilter === s 
                              ? 'bg-brand-primary text-white shadow-lg' 
                              : 'text-text-muted hover:bg-bg-main hover:text-text-main'}`}
                        >
                          {s === 'All' ? '✦ All Statuses' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setActiveDateDropdown(!activeDateDropdown)}
                  className="bg-bg-main border border-border-main px-6 py-2.5 rounded-2xl text-[10px] font-black text-text-main outline-none flex items-center gap-4 hover:border-brand-primary transition-all shadow-sm uppercase tracking-widest min-w-[160px] justify-between"
                >
                  {activeDatePreset === 'ALL_TIME' ? 'All Time' : activeDatePreset.replace('_', ' ')}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDateDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDateDropdown && (
                  <div className="absolute top-full mt-2 left-0 z-[100] bg-bg-card border border-border-main rounded-2xl shadow-2xl p-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-300">
                    {[
                      { id: 'ALL_TIME', label: 'All Time' },
                      { id: 'THIS_MONTH', label: 'This Month' },
                      { id: 'LAST_MONTH', label: 'Last Month' },
                      { id: 'CUSTOM', label: 'Custom Range' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDatePreset(opt.id)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                          ${activeDatePreset === opt.id 
                            ? 'bg-brand-primary text-white shadow-lg' 
                            : 'text-text-muted hover:bg-bg-main hover:text-text-main'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {activeDatePreset === 'CUSTOM' && (
                <div className="flex items-center gap-2 bg-bg-main border border-brand-primary/20 px-4 py-2 rounded-2xl animate-in slide-in-from-right-4 duration-300 shadow-sm">
                  <Calendar size={14} className="text-brand-primary" />
                  <input 
                    type="date" 
                    value={dateRange.start} 
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-transparent text-[10px] font-black text-text-main outline-none uppercase"
                  />
                  <span className="text-text-muted text-[10px] font-black opacity-30">TO</span>
                  <input 
                    type="date" 
                    value={dateRange.end} 
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-transparent text-[10px] font-black text-text-main outline-none uppercase"
                  />
                  <button 
                    onClick={() => {
                      setDateRange({ start: '', end: '' });
                      setActiveDatePreset('ALL_TIME');
                    }}
                    className="ml-1 p-1 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card min-h-[500px] mb-32">
          {loadingSource ? <LoadingAnimation /> : (
            <div className="overflow-x-auto custom-scrollbar !overflow-y-visible pb-60">
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
                      <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">{activeSource === 'Meta' ? 'Upcoming' : 'Account Owner'}</th>
                    )}
                    {activeSource === 'Upwork' && (
                      <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Apply Date</th>
                    )}
                    {activeSource === 'Upwork' && (
                      <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Job Status</th>
                    )}
                    {activeSource === 'Upwork' && (
                      <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Outcome</th>
                    )}
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
                      className={`group hover:bg-bg-main/50 transition-all duration-300 cursor-pointer ${
                        lead.source === 'Upwork' && (lead.upworkJobStatus || 'Open') === 'Open' ? 'bg-emerald-500/[0.1] border-l-4 border-emerald-500' : 
                        lead.source === 'Upwork' && lead.upworkJobStatus === 'Closed' ? 'bg-rose-500/[0.1] border-l-4 border-rose-500' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border
                              ${lead.source === 'Upwork' 
                                ? 'bg-[#14a800]/10 text-[#14a800] border-[#14a800]/20' 
                                : 'bg-brand-primary/10 text-brand-primary border-brand-primary/10'}`}>
                              {(lead.source === 'Upwork' 
                                ? (lead.upworkJobType && !['-', '---', ''].includes(lead.upworkJobType) ? lead.upworkJobType : (lead.name || '?'))
                                : (lead.name || '?')).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-text-main text-sm">
                                 {lead.source === 'Upwork' && lead.upworkBidPlaced && !['-', '---', '', '0', 0].includes(lead.upworkBidPlaced) && (
                                   <div className="flex items-center gap-1 px-2 py-0.5 bg-[#14a800]/10 border border-[#14a800]/30 rounded-full text-[8px] font-black text-[#14a800] uppercase tracking-widest shadow-[0_0_10px_rgba(20,168,0,0.1)]">
                                     <BoostedIcon size={10} />
                                     Boosted
                                   </div>
                                 )}
                                 {lead.source === 'Upwork' 
                                   ? (lead.upworkJobType && !['-', '---', ''].includes(lead.upworkJobType) ? lead.upworkJobType : (lead.name || 'Unnamed Lead'))
                                   : (lead.name || 'Unnamed Lead')}
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
                          {lead.source === 'Meta' && (
                            <div className="w-[300px]" onClick={(e) => e.stopPropagation()}>
                              <LeadStatusTracker lead={lead} compact={true} />
                            </div>
                          )}
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
                            <CustomSelect 
                              value={lead.status} 
                              options={LEAD_STATUSES}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)} 
                              triggerClassName="bg-transparent text-xs font-semibold text-text-main focus:outline-none cursor-pointer uppercase tracking-wider"
                              className="flex-1"
                            />
                          </div>
                        </td>
                      )}
                      {activeSource !== 'Upwork' && (
                        <td className="px-5 py-5">
                          {activeSource === 'Meta' ? (
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-lg inline-block ${lead.nextFollowUp === today ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                              {lead.nextFollowUp || 'TBD'}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CustomSelect 
                                value={lead.linkedInAccount}
                                options={[
                                  ...(!linkedInAccounts.includes(lead.linkedInAccount) && lead.linkedInAccount !== '-' ? [lead.linkedInAccount] : []),
                                  ...linkedInAccounts
                                ]}
                                onChange={(e) => updateLeadAccount(lead.id, e.target.value)}
                                triggerClassName="bg-bg-main px-4 py-2 rounded-xl text-[10px] font-black text-text-main border border-border-main appearance-none outline-none focus:border-brand-primary transition-colors cursor-pointer w-full hover:border-brand-primary/50"
                                className="w-full"
                              />
                            </div>
                          )}
                        </td>
                      )}
                      {activeSource === 'Upwork' && (
                        <td className="px-5 py-5">
                          <span className="text-[11px] font-bold px-3 py-1 rounded-lg inline-block bg-emerald-500/10 text-emerald-500">
                            {lead.upworkApplyDate || '—'}
                          </span>
                        </td>
                      )}
                      {activeSource === 'Upwork' && (
                        <td className="px-5 py-5 min-w-[140px]">
                          <CustomSelect
                            value={lead.upworkJobStatus || 'Open'}
                            options={['Open', 'Closed']}
                            onChange={(e) => updateUpworkJobStatus(lead.id, e.target.value)}
                            triggerClassName={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                              (lead.upworkJobStatus || 'Open') === 'Open' 
                                ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/10' 
                                : 'bg-text-muted/5 text-text-muted border-text-muted/20 hover:bg-text-muted/10'
                            }`}
                          />
                        </td>
                      )}
                      {activeSource === 'Upwork' && (
                        <td className="px-5 py-5 min-w-[160px]">
                          <CustomSelect
                            value={lead.upworkOutcome || 'Pending'}
                            options={['Pending', 'Got it', "Didn't get it"]}
                            onChange={(e) => updateUpworkOutcome(lead.id, e.target.value)}
                            triggerClassName={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                              lead.upworkOutcome === 'Got it' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' : 
                              lead.upworkOutcome === "Didn't get it" ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20' : 
                              'bg-amber-500/5 text-amber-500/70 border-amber-500/10 hover:bg-amber-500/10'
                            }`}
                          />
                        </td>
                      )}
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
                          {lead.source === 'Meta' && (
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const cleanPhone = (lead.phone || '').toString().replace(/\D/g, '');
                                  window.open(`https://wa.me/${cleanPhone}`, '_blank');
                                }} 
                                className="p-2.5 bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366] hover:text-white rounded-xl transition-all border border-[#25d366]/20 shadow-sm"
                                title="WhatsApp Prospect"
                              >
                                <WhatsappLogo size={18} />
                              </button>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const cleanPhone = (lead.phone || '').toString().replace(/\D/g, '');
                                  window.location.href = `tel:${cleanPhone}`;
                                }} 
                                className="p-2.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl transition-all border border-brand-primary/20 shadow-sm"
                                title="Call Prospect"
                              >
                                <PhoneLogo size={18} />
                              </button>
                            </div>
                          )}

                          {lead.source === 'Meta' && lead.chatHistory && !['', '-', '---'].includes(lead.chatHistory) && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatLead(lead); }} className="px-4 py-2 bg-bg-card hover:bg-bg-main text-text-muted rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-border-main">
                              History
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
                      <td colSpan={activeSource === 'Meta' ? 3 : (activeSource === 'Upwork' ? 6 : 4)} className="px-5 py-24 text-center">
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

  const renderFunnel = () => {
    const currentFunnelSource = (activeSource === 'Meta' || activeSource === 'Linkedin') ? activeSource : 'Meta';

    const funnelLeadsList = funnelLeads.filter(l => {
      const matchesSource = l.source === currentFunnelSource;
      const matchesAccount = l.source !== 'Linkedin' || activeAccount === 'All Accounts' || l.linkedInAccount === activeAccount;
      
      const name = l.name || '';
      const phone = l.phone || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || phone.includes(searchQuery);

      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const leadDate = l.lastContact || '';
        if (dateRange.start && leadDate < dateRange.start) matchesDate = false;
        if (dateRange.end && leadDate > dateRange.end) matchesDate = false;
      }

      return matchesSource && matchesAccount && matchesSearch && matchesDate;
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-bg-card p-4 rounded-3xl border border-border-main shadow-xs">
          <div className="flex bg-[#000000] p-1.5 rounded-2xl border border-white/5 w-full lg:w-fit overflow-x-auto shadow-inner">
            {['Meta', 'Linkedin'].map(source => (
              <button
                key={source}
                onClick={() => {
                  setActiveSource(source);
                  fetchSourceLeads(source, true);
                }}
                className={`px-12 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 min-w-[140px] ${
                  currentFunnelSource === source 
                    ? 'bg-brand-primary text-[#000000] shadow-lg shadow-brand-primary/20' 
                    : 'text-[#8696a0] hover:text-white hover:bg-white/5'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
          {currentFunnelSource === 'Linkedin' && linkedInAccounts.length > 1 && (
            <div className="flex items-center gap-3 bg-bg-main border border-border-main px-4 py-2 rounded-2xl md:ml-4">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Sender ID:</span>
              <CustomSelect 
                value={activeAccount} 
                options={[
                  ...linkedInAccounts.map(acc => ({ value: acc, label: acc })),
                  { value: 'ADD_NEW', label: '+ REGISTER NEW SENDER' }
                ]}
                onChange={(e) => { 
                  if (e.target.value === 'ADD_NEW') { 
                    setShowAccountModal(true); 
                    return; 
                  } 
                  setActiveAccount(e.target.value); 
                }} 
                triggerClassName="outline-none text-xs font-black text-text-main bg-transparent cursor-pointer"
                className="flex-1"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <div className="relative">
              <button 
                onClick={() => setActiveDateDropdown(!activeDateDropdown)}
                className="bg-[#000000] border border-white/10 px-6 py-2.5 rounded-2xl text-[10px] font-black text-[#8696a0] outline-none flex items-center gap-4 hover:border-brand-primary transition-all shadow-sm uppercase tracking-widest min-w-[160px] justify-between"
              >
                {activeDatePreset === 'ALL_TIME' ? 'All Time' : activeDatePreset.replace('_', ' ')}
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDateDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDateDropdown && (
                <div className="absolute top-full mt-2 left-0 z-[100] bg-[#000000] border border-white/10 rounded-2xl shadow-2xl p-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-300">
                  {[
                    { id: 'ALL_TIME', label: 'All Time' },
                    { id: 'THIS_MONTH', label: 'This Month' },
                    { id: 'LAST_MONTH', label: 'Last Month' },
                    { id: 'CUSTOM', label: 'Custom Range' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => { setDatePreset(opt.id); setActiveDateDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all
                        ${activeDatePreset === opt.id 
                          ? 'bg-brand-primary text-[#000000] shadow-lg shadow-brand-primary/20' 
                          : 'text-[#8696a0] hover:bg-white/5 hover:text-white'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeDatePreset === 'CUSTOM' && (
              <div className="flex items-center gap-2 bg-[#000000] border border-brand-primary/30 px-4 py-2 rounded-2xl animate-in slide-in-from-right-4 duration-300 shadow-sm">
                <Calendar size={14} className="text-brand-primary" />
                <input 
                  type="date" 
                  value={dateRange.start} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent text-[10px] font-black text-[#8696a0] outline-none uppercase"
                />
                <span className="text-[#8696a0]/50 text-[10px] font-black">TO</span>
                <input 
                  type="date" 
                  value={dateRange.end} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent text-[10px] font-black text-[#8696a0] outline-none uppercase"
                />
                <button 
                  onClick={() => {
                    setDateRange({ start: '', end: '' });
                    setActiveDatePreset('ALL_TIME');
                  }}
                  className="ml-1 p-1 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card min-h-[500px] mb-32">
          {loadingSource ? <LoadingAnimation /> : (
            <div className="overflow-x-auto custom-scrollbar !overflow-y-visible pb-60">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Prospect Entity</th>
                    <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Last Contact</th>
                    <th className="px-5 py-6 text-left text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">{currentFunnelSource === 'Meta' ? 'Upcoming' : 'Account Owner'}</th>
                    <th className="px-5 py-6 text-center text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {funnelLeadsList.length > 0 ? funnelLeadsList.map(lead => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="group hover:bg-bg-main/50 transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/10 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                              {(lead.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-text-main text-sm">{lead.name || 'Unnamed Lead'}</p>
                              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5 opacity-50">
                                {lead.source}{lead.phone ? ` · ${lead.phone}` : ''}
                              </p>
                            </div>
                          </div>
                          {(lead.source === 'Meta' || lead.source === 'Linkedin') && (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {['1', '2', '3', '4'].map((num) => {
                                const stage = `FU${num}`;
                                const rawDate = lead?.rawData?.[`FU - ${num}`] || 
                                                lead?.rawData?.[`FU-${num}`] || 
                                                lead?.rawData?.[`FU ${num}`] || 
                                                lead?.rawData?.[stage] || '—';
                                
                                const isDone = rawDate.toLowerCase().includes('done');
                                const displayDate = rawDate.replace(/done/gi, '').trim();
                                
                                const comment = lead?.rawData?.[`FU - ${num} Comment`] || 
                                                lead?.rawData?.[`FU-${num} Comment`] || 
                                                lead?.rawData?.[`FU ${num} Comment`] || 
                                                lead?.rawData?.[`${stage}_comment`] || 
                                                lead?.rawData?.[`${stage} Comment`] || '';
                                
                                return (
                                  <div key={stage} className="relative group/tooltip">
                                    <div className={`flex flex-col items-center justify-center px-3 py-1 border rounded-lg transition-all cursor-help min-w-[64px] ${
                                      isDone 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                        : displayDate !== '—'
                                          ? 'bg-white/5 border-white/10 text-text-main hover:border-brand-primary/40'
                                          : 'bg-white/[0.02] border-white/5 text-text-muted opacity-20'
                                    }`}>
                                      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">{stage}</span>
                                      <span className="text-[9px] font-black uppercase tracking-tight">
                                        {displayDate || '—'}
                                      </span>
                                    </div>
                                    
                                    {comment && (
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-bg-card border border-border-main rounded-2xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-[100] backdrop-blur-xl">
                                        <div className="flex items-center gap-1.5 mb-2 border-b border-border-main/50 pb-1.5">
                                          <MessageCircle size={10} className="text-brand-primary" />
                                          <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{stage} Intel</span>
                                        </div>
                                        <p className="text-[10px] text-text-main leading-relaxed font-medium">
                                          {comment}
                                        </p>
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-bg-card border-r border-b border-border-main rotate-45"></div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="text-xs text-text-muted">{lead.lastContact || '—'}</span>
                      </td>
                      <td className="px-5 py-5">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-lg inline-block ${lead.nextFollowUp === today ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                          {currentFunnelSource === 'Meta' ? (lead.nextFollowUp || 'TBD') : (lead.linkedInAccount || '-')}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {lead.source === 'Meta' && (
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const cleanPhone = (lead.phone || '').toString().replace(/\D/g, '');
                                  window.open(`https://wa.me/${cleanPhone}`, '_blank');
                                }} 
                                className="p-2.5 bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366] hover:text-white rounded-xl transition-all border border-[#25d366]/20 shadow-sm"
                                title="WhatsApp Prospect"
                              >
                                <WhatsappLogo size={18} />
                              </button>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const cleanPhone = (lead.phone || '').toString().replace(/\D/g, '');
                                  window.location.href = `tel:${cleanPhone}`;
                                }} 
                                className="p-2.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl transition-all border border-brand-primary/20 shadow-sm"
                                title="Call Prospect"
                              >
                                <PhoneLogo size={18} />
                              </button>
                            </div>
                          )}

                          {lead.source === 'Meta' && lead.chatHistory && !['', '-', '---'].includes(lead.chatHistory) && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveChatLead(lead); }} className="px-4 py-2 bg-bg-card hover:bg-bg-main text-text-muted rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-border-main">
                              History
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
                           <button onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }} className="px-4 py-2 bg-bg-main hover:bg-brand-primary hover:text-white text-text-main rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-border-main">
                             Intelligence
                           </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-24 text-center">
                        <Database size={40} className="mx-auto text-text-muted opacity-10 mb-4" />
                        <p className="text-text-muted font-bold uppercase tracking-widest text-xs">No prospects in the funnel cycle</p>
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



  const renderPipeline = () => {
    const headers = [
      "Entity Information", "Follow-up", "Final Status", "Stage", "Next Action", "Source"
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="glass-panel rounded-[40px] border border-border-main/40 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
          {loadingSource ? <LoadingAnimation /> : (
            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-bg-main/40 backdrop-blur-md sticky top-0 z-50">
                    {headers.map(h => (
                      <th key={h} className="px-8 py-7 text-left text-[9px] font-black text-text-muted uppercase tracking-[0.25em] border-b border-border-main/30 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/10">
                  {pipelineLeads.length > 0 ? pipelineLeads.map(lead => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-sm border border-brand-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#020617] flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-black text-text-main tracking-tight leading-tight">{lead.rawData?.['Lead Name'] || lead.name}</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">
                              {lead.rawData?.['Account Name'] || lead.linkedInAccount || 'Unmapped Entity'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap min-w-[200px]">
                        <div className="relative group/tooltip">
                          {(() => {
                            const rawDate = lead.rawData?.['Follow-up'] || '—';
                            const isDone = rawDate.toLowerCase().includes('done');
                            const displayDate = rawDate.replace(/done/gi, '').trim();
                            
                            return (
                              <div className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all cursor-help ${
                                isDone 
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                                  : 'bg-white/5 border-white/10 text-text-main hover:border-brand-primary/50'
                              }`}>
                                {isDone ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Calendar size={14} className="text-brand-primary opacity-60" />}
                                <span className="text-[11px] font-black uppercase tracking-widest">
                                  {displayDate || '—'}
                                </span>
                              </div>
                            );
                          })()}
                          
                          {lead.rawData?.['follow-up_comment'] && (
                            <div className="absolute bottom-full left-0 mb-3 w-64 p-4 bg-bg-card border border-border-main rounded-2xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-[100] backdrop-blur-xl">
                              <div className="flex items-center gap-2 mb-2 border-b border-border-main pb-2">
                                <MessageSquare size={12} className="text-brand-primary" />
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Comment</span>
                              </div>
                              <p className="text-xs text-text-main leading-relaxed font-medium">
                                {lead.rawData?.['follow-up_comment']}
                              </p>
                              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-bg-card border-r border-b border-border-main rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <CustomSelect 
                          options={PIPELINE_FINAL_STATUSES}
                          value={lead.rawData?.['Final Status'] || lead.status}
                          onChange={(e) => updatePipelineField(lead.id, 'Final Status', e.target.value)}
                          triggerClassName="badge border bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:scale-105 transition-all min-w-[100px]"
                        />
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <CustomSelect 
                          options={PIPELINE_STAGES}
                          value={lead.rawData?.['Stage'] || lead.stage || '—'}
                          onChange={(e) => updatePipelineField(lead.id, 'Stage', e.target.value)}
                          triggerClassName="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-text-main transition-colors text-left min-w-[160px]"
                        />
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-brand-primary">
                          <ArrowRight size={14} className="opacity-40" />
                          <span className="text-xs font-black uppercase tracking-tight">{lead.rawData?.['Next Action'] || 'System Default'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-[9px] font-black bg-white/5 px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-[0.2em] text-text-muted group-hover:text-text-main transition-colors">
                          {lead.source}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={headers.length + 1} className="px-5 py-32 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mb-6 shadow-inner border border-border-main">
                            <Database size={32} className="text-text-muted opacity-20" />
                          </div>
                          <h3 className="text-xl font-black text-text-main opacity-80">Pipeline Empty</h3>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mt-3 opacity-60">System standing by for telemetry data</p>
                        </div>
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
      <div className="fixed inset-0 bg-[#000000] z-[9999] flex flex-col items-center justify-center">
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
          renderFunnel={renderFunnel}
          renderPipeline={renderPipeline}
          updateLeadAccount={updateLeadAccount}
          activeSource={activeSource}
          setActiveSource={setActiveSource}
          setFormData={setFormData}
          fetchSourceLeads={fetchSourceLeads}
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
                      <h2 className="text-3xl font-black text-text-main tracking-tighter leading-tight flex items-center gap-4">
                        {selectedLead.source === 'Upwork' && isEditingName ? (
                          <input 
                            autoFocus
                            className="bg-bg-main border border-brand-primary/30 rounded-xl px-4 py-1 text-2xl font-black w-full outline-none focus:border-brand-primary animate-in slide-in-from-left-2 duration-200"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={() => {
                              if (tempName.trim() && tempName !== selectedLead.name) {
                                updateLeadJobType(selectedLead.id, tempName);
                              }
                              setIsEditingName(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (tempName.trim() && tempName !== selectedLead.name) {
                                  updateLeadJobType(selectedLead.id, tempName);
                                }
                                setIsEditingName(false);
                              } else if (e.key === 'Escape') {
                                setIsEditingName(false);
                              }
                            }}
                          />
                        ) : (
                          <span 
                            onClick={() => {
                              if (selectedLead.source === 'Upwork') {
                                setTempName(selectedLead.name);
                                setIsEditingName(true);
                              }
                            }}
                            className={selectedLead.source === 'Upwork' ? 'group cursor-pointer hover:text-brand-primary transition-all flex items-center gap-3' : ''}
                          >
                            {selectedLead.name}
                            {selectedLead.source === 'Upwork' && (
                              <PencilLine size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary" />
                            )}
                          </span>
                        )}
                        {selectedLead.source === 'Upwork' && selectedLead.upworkBidPlaced && !['-', '---', '', '0', 0].includes(selectedLead.upworkBidPlaced) && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-[#14a800]/10 border border-[#14a800]/30 rounded-full text-[10px] font-black text-[#14a800] uppercase tracking-widest shadow-[0_0_15px_rgba(20,168,0,0.15)]">
                            <BoostedIcon size={12} />
                            Boosted
                          </div>
                        )}
                        {selectedLead.rawData?.['Final Status'] && (
                          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20 uppercase tracking-[0.2em] shadow-sm">
                            {selectedLead.rawData['Final Status']}
                          </span>
                        )}
                        {selectedLead.rawData?.['Stage'] && (
                          <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-4 py-1 rounded-full border border-brand-primary/20 uppercase tracking-[0.2em] shadow-sm">
                            {selectedLead.rawData['Stage']}
                          </span>
                        )}
                      </h2>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] font-black text-white bg-brand-primary px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/30">{selectedLead.source}</span>
                        <span className="text-xs font-bold text-text-muted tracking-widest uppercase opacity-60">{selectedLead.phone || 'NO CONTACT RECORDED'}</span>
                        {selectedLead.rawData?.['Next Action'] && (
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] flex items-center gap-2 bg-bg-main px-3 py-1 rounded-lg border border-border-main ml-2">
                             <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse"></div>
                             NEXT: {selectedLead.rawData['Next Action']}
                          </span>
                        )}
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
                        {window.location.pathname.includes('/pipeline') && (
                           <div className="animate-in slide-in-from-bottom-4 duration-500 mb-12">
                              <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                 PIPELINE & ENTITY INTEL
                                 <div className="h-px bg-brand-primary/20 flex-1"></div>
                              </h4>
                              
                              <div className="bg-bg-card/40 backdrop-blur-3xl p-8 rounded-[32px] border border-border-main/50 shadow-2xl relative overflow-visible">
                                 {/* Decorative glow */}
                                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                                 {/* NEXT FOLLOWUP - COMPACT VERSION */}
                                 <div className="relative mb-8">
                                    <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
                                       NEXT FOLLOWUP
                                       <div className="h-px bg-brand-primary/20 flex-1"></div>
                                    </h5>
                                    
                                    <div className="bg-bg-main/30 backdrop-blur-xl p-5 rounded-[24px] border border-border-main/50 shadow-inner relative overflow-hidden">
                                       <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-primary/5 opacity-50 rounded-[24px]"></div>
                                       
                                       {(() => {
                                          const fup = 'FU1';
                                          const commentKey = `${fup}_Comment`;
                                          const comment = selectedLead.rawData?.[commentKey] || selectedLead.rawData?.[`${fup} Comment`];
                                          const hasComment = !!comment;
                                          const dateValue = selectedLead.rawData?.[fup];
                                          const isDone = hasComment || (dateValue && dateValue.toLowerCase().includes('done'));
                                          
                                          return (
                                             <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                                                <div className="relative group/logo shrink-0">
                                                   <div 
                                                      className={`
                                                         w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative
                                                         ${isDone 
                                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                                                            : 'bg-bg-card/50 border-border-main text-slate-700 hover:border-brand-primary/40 hover:text-brand-primary hover:shadow-[0_0_20px_rgba(159,212,138,0.1)]'}
                                                      `}
                                                   >
                                                      {isDone ? (
                                                         <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                                            <CheckCircle2 size={24} weight="bold" />
                                                            <span className="text-[6px] font-black mt-0.5 tracking-widest uppercase">Done</span>
                                                         </div>
                                                      ) : (
                                                         <div className={`w-2 h-2 rounded-full transition-all duration-300 ${dateValue ? 'bg-brand-primary/40 scale-125' : 'bg-slate-800 group-hover:bg-brand-primary/60'}`}></div>
                                                      )}
                                                      
                                                      {dateValue && !isDone && (
                                                         <div className="absolute inset-0 rounded-full border border-brand-primary/30 animate-ping opacity-20"></div>
                                                      )}
                                                   </div>
                                                </div>
                                                
                                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                                                   <div className="lg:col-span-1">
                                                      <p className="text-[9px] font-black text-brand-primary/70 uppercase tracking-widest mb-1.5">Schedule</p>
                                                      <input 
                                                         type="datetime-local"
                                                         className={`
                                                            w-full bg-bg-main/40 text-[13px] font-black py-2 px-3 rounded-xl border border-border-main outline-none transition-all
                                                            ${isDone ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : dateValue ? 'text-brand-primary border-brand-primary/20 bg-brand-primary/5' : 'text-text-muted/30'}
                                                            focus:border-brand-primary/50 focus:text-brand-primary focus:bg-brand-primary/10
                                                         `}
                                                         value={dateValue || ''}
                                                         onChange={(e) => updatePipelineField(selectedLead.id, fup, e.target.value)}
                                                      />
                                                   </div>
                                                   <div className="lg:col-span-2">
                                                      <p className="text-[9px] font-black text-brand-primary/70 uppercase tracking-widest mb-1.5">Internal Observation</p>
                                                      <textarea 
                                                         className={`
                                                            w-full bg-bg-main/20 text-[13px] font-medium p-2.5 rounded-xl border border-border-main/50 outline-none transition-all resize-none h-[42px] custom-scrollbar
                                                            ${hasComment ? 'text-text-main border-brand-primary/30' : 'text-text-muted/40'}
                                                            focus:border-brand-primary/50 focus:bg-bg-main/40
                                                         `}
                                                         placeholder="Record follow-up details..."
                                                         value={comment || ''}
                                                         onChange={(e) => updatePipelineField(selectedLead.id, commentKey, e.target.value)}
                                                      />
                                                   </div>
                                                </div>
                                             </div>
                                          );
                                       })()}
                                    </div>
                                 </div>

                                 {/* Section 1: Core Pipeline Status */}
                                 <div className="mb-8 relative focus-within:z-50">
                                    <h5 className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 opacity-50 pl-2 border-l-2 border-brand-primary/50">Core Status</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-brand-primary/70 uppercase tracking-widest mb-1 flex items-center gap-2">Final Status</p>
                                          <CustomSelect 
                                            options={['dropped', 'closed']}
                                            value={selectedLead.rawData?.['Final Status'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Final Status', e.target.value)}
                                            placeholder="Select Status..."
                                            triggerClassName="w-full text-sm font-black text-text-main outline-none"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-brand-primary/70 uppercase tracking-widest mb-1 flex items-center gap-2">Stage</p>
                                          <CustomSelect 
                                            options={['intro meeting done', 'proposal call done', 'closed', 'not closed', 'proposal sent']}
                                            value={selectedLead.rawData?.['Stage'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Stage', e.target.value)}
                                            placeholder="Select Stage..."
                                            triggerClassName="w-full text-sm font-black text-text-main outline-none"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group lg:col-span-2">
                                          <p className="text-[9px] font-black text-brand-primary/70 uppercase tracking-widest mb-1 flex items-center gap-2">Next Action</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-emerald-500 outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Next Action'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Next Action', e.target.value)}
                                            placeholder="Specify next action required..."
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 {/* Section 2: Entity Details */}
                                 <div className="mb-8 relative focus-within:z-50">
                                    <h5 className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 opacity-50 pl-2 border-l-2 border-emerald-500/50">Entity & Source</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Account Name</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Account Name'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Account Name', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Industry</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Industry'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Industry', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Lead Name</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Lead Name'] || selectedLead.name || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Lead Name', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Lead Source</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Lead Source'] || selectedLead.source || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Lead Source', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group lg:col-span-2">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Website</p>
                                          <input 
                                            type="url"
                                            className="w-full bg-transparent text-sm font-black text-brand-primary outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Website'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Website', e.target.value)}
                                            placeholder="https://"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Country</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Country'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Country', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">City</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['City'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'City', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 {/* Section 3: Contact Channels */}
                                 <div className="mb-8 relative focus-within:z-50">
                                    <h5 className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 opacity-50 pl-2 border-l-2 border-blue-500/50">Contact Channels</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group lg:col-span-2">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Primary Email</p>
                                          <input 
                                            type="email"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Email ID'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Email ID', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group lg:col-span-2">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Primary Mobile</p>
                                          <input 
                                            type="tel"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Mobile'] || selectedLead.phone || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Mobile', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Secondary Name</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Lead 2 Name'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Lead 2 Name', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Secondary Mobile</p>
                                          <input 
                                            type="tel"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Mobile 2'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Mobile 2', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group lg:col-span-2">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Secondary Email</p>
                                          <input 
                                            type="email"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Email 2'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Email 2', e.target.value)}
                                            placeholder="—"
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group lg:col-span-4">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">LinkedIn Profile</p>
                                          <input 
                                            type="url"
                                            className="w-full bg-transparent text-sm font-black text-[#0a66c2] outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['LinkedIn'] || selectedLead.linkedinUrl || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'LinkedIn', e.target.value)}
                                            placeholder="https://linkedin.com/in/..."
                                          />
                                       </div>
                                    </div>
                                 </div>

                                 {/* Section 4: Documentation & Notes */}
                                 <div className="relative focus-within:z-50 mb-12">
                                    <h5 className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 opacity-50 pl-2 border-l-2 border-purple-500/50">Documentation</h5>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Proposal Link</p>
                                          <input 
                                            type="url"
                                            className="w-full bg-transparent text-sm font-black text-purple-400 outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Proposal Link'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Proposal Link', e.target.value)}
                                            placeholder="Link to document..."
                                          />
                                       </div>
                                       <div className="bg-bg-main/50 p-5 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group relative focus-within:z-40">
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Proposal Sent Date</p>
                                          <input 
                                            type="text"
                                            className="w-full bg-transparent text-sm font-black text-text-main outline-none placeholder:text-text-muted/30"
                                            value={selectedLead.rawData?.['Proposal Sent'] || ''}
                                            onChange={(e) => updatePipelineField(selectedLead.id, 'Proposal Sent', e.target.value)}
                                            placeholder="DD/MM/YYYY"
                                          />
                                       </div>
                                    </div>
                                    <div className="bg-bg-main/50 p-6 rounded-2xl border border-border-main hover:border-brand-primary/40 transition-all focus-within:border-brand-primary/60 focus-within:shadow-[0_0_20px_rgba(159,212,138,0.1)] group">
                                       <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-3">Pipeline Comments</p>
                                       <textarea 
                                         className="w-full bg-transparent text-sm font-bold text-text-main leading-relaxed outline-none min-h-[80px] resize-none placeholder:text-text-muted/30 placeholder:italic"
                                         value={selectedLead.rawData?.['Comments'] || selectedLead.rawData?.['pipeline_comment'] || ''}
                                         onChange={(e) => updatePipelineField(selectedLead.id, 'Comments', e.target.value)}
                                         placeholder="Record strategic pipeline intelligence, negotiation notes, or follow-up specifics here..."
                                       />
                                    </div>
                                 </div>

                              </div>
                           </div>
                        )}

                        {!window.location.pathname.includes('/pipeline') && (
                           <div>
                              <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                                 ANALYSIS ENGINE
                                 <div className="h-px bg-brand-primary/20 flex-1"></div>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {selectedLead.source !== 'Upwork' && (
                                    <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/30 transition-colors">
                                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Operational Status</p>
                                       <p className="text-base font-black text-text-main">{selectedLead.status} {selectedLead.stage ? `• ${selectedLead.stage}` : ''}</p>
                                    </div>
                                 )}
                                 {selectedLead.source !== 'Upwork' && (
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
                                 )}
                                 {selectedLead.source === 'Upwork' && (
                                    <div className="bg-bg-card p-6 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/30 transition-colors">
                                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Apply Date</p>
                                       <p className="text-xl font-black text-brand-primary">{selectedLead.upworkApplyDate || '-'}</p>
                                    </div>
                                 )}
                                 {selectedLead.source !== 'Upwork' && (
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
                                 )}
                                 {selectedLead.source === 'Upwork' && (() => {
                                    const connects = parseFloat(selectedLead.upworkConnects) || 0;
                                    const bidConnects = parseFloat((selectedLead.upworkBidAmount || '').replace(/[^0-9.]/g, '')) || 0;
                                    
                                    const totalConnects = connects + bidConnects;
                                    const totalUsd = totalConnects * 0.15;
                                    const totalInr = usdToInr ? (totalUsd * usdToInr) : null;

                                    return (
                                       <>
                                          {/* Connects Used — always shown for Upwork, editable */}
                                          <div className="bg-bg-card p-5 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/40 transition-colors col-span-1">
                                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 opacity-50">Connects Used</p>
                                             {editingConnects ? (
                                                <div className="flex items-center gap-2">
                                                   <input
                                                      type="number"
                                                      min="0"
                                                      autoFocus
                                                      value={connectsInputVal}
                                                      onChange={e => setConnectsInputVal(e.target.value)}
                                                      onBlur={() => {
                                                         updateLeadConnects(selectedLead.id, connectsInputVal);
                                                         setEditingConnects(false);
                                                      }}
                                                      onKeyDown={e => {
                                                         if (e.key === 'Enter') { updateLeadConnects(selectedLead.id, connectsInputVal); setEditingConnects(false); }
                                                         if (e.key === 'Escape') setEditingConnects(false);
                                                      }}
                                                      className="w-full bg-bg-main border border-brand-primary/40 rounded-xl px-3 py-2 text-lg font-black text-brand-primary outline-none focus:border-brand-primary transition-all"
                                                      placeholder="e.g. 6"
                                                   />
                                                </div>
                                             ) : (
                                                <button
                                                   onClick={() => { setConnectsInputVal(selectedLead.upworkConnects && selectedLead.upworkConnects !== '-' ? selectedLead.upworkConnects : ''); setEditingConnects(true); }}
                                                   className="w-full text-left group"
                                                >
                                                   <p className="text-2xl font-black text-brand-primary group-hover:opacity-70 transition-opacity">
                                                      {selectedLead.upworkConnects && selectedLead.upworkConnects !== '-' && selectedLead.upworkConnects !== '---' ? selectedLead.upworkConnects : <span className="text-text-muted text-sm font-bold">Click to enter</span>}
                                                   </p>
                                                   {connects > 0 && (
                                                      <div className="mt-2 space-y-0.5">
                                                         <p className="text-[10px] font-bold text-text-muted">Cost: <span className="text-amber-400">${(connects * 0.15).toFixed(2)}</span></p>
                                                         {usdToInr && (
                                                            <p className="text-[10px] font-bold text-text-muted">≈ <span className="text-emerald-400">₹{(connects * 0.15 * usdToInr).toFixed(0)}</span></p>
                                                         )}
                                                      </div>
                                                   )}
                                                </button>
                                             )}
                                          </div>
                                          {/* Bid Placed — always shown for Upwork, editable */}
                                          <div className="bg-bg-card p-5 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/40 transition-colors col-span-1">
                                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 opacity-50">Bid Placed</p>
                                             {editingBidAmount ? (
                                                <div className="flex items-center gap-2">
                                                   <input
                                                      type="number"
                                                      min="0"
                                                      autoFocus
                                                      value={bidAmountInputVal}
                                                      onChange={e => setBidAmountInputVal(e.target.value)}
                                                      onBlur={() => {
                                                         updateLeadBidAmount(selectedLead.id, bidAmountInputVal);
                                                         setEditingBidAmount(false);
                                                      }}
                                                      onKeyDown={e => {
                                                         if (e.key === 'Enter') { updateLeadBidAmount(selectedLead.id, bidAmountInputVal); setEditingBidAmount(false); }
                                                         if (e.key === 'Escape') setEditingBidAmount(false);
                                                      }}
                                                      className="w-full bg-bg-main border border-brand-primary/40 rounded-xl px-3 py-2 text-lg font-black text-text-main outline-none focus:border-brand-primary transition-all"
                                                      placeholder="e.g. 50"
                                                   />
                                                </div>
                                             ) : (
                                                <button
                                                   onClick={() => { setBidAmountInputVal(selectedLead.upworkBidAmount && selectedLead.upworkBidAmount !== '-' ? selectedLead.upworkBidAmount : ''); setEditingBidAmount(true); }}
                                                   className="w-full text-left group"
                                                >
                                                   <p className="text-2xl font-black text-text-main group-hover:opacity-70 transition-opacity">
                                                      {selectedLead.upworkBidAmount && selectedLead.upworkBidAmount !== '-' && selectedLead.upworkBidAmount !== '---' ? selectedLead.upworkBidAmount : <span className="text-text-muted text-sm font-bold">Click to enter</span>}
                                                   </p>
                                                   {bidConnects > 0 && (
                                                      <div className="mt-2 space-y-0.5">
                                                         <p className="text-[10px] font-bold text-text-muted">Cost: <span className="text-amber-400">${(bidConnects * 0.15).toFixed(2)}</span></p>
                                                         {usdToInr && (
                                                            <p className="text-[10px] font-bold text-text-muted">≈ <span className="text-emerald-400">₹{(bidConnects * 0.15 * usdToInr).toFixed(0)}</span></p>
                                                         )}
                                                      </div>
                                                   )}
                                                 </button>
                                              )}
                                           </div>
                                          <div className="bg-brand-primary/5 p-5 rounded-3xl border border-brand-primary/20 shadow-sm col-span-1 flex flex-col justify-center relative overflow-hidden group/total">
                                             <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/total:opacity-100 transition-opacity">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-brand-primary ${showInrTotal ? 'opacity-100' : 'opacity-30'}`}></div>
                                             </div>
                                             <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-3 opacity-70">Total Spent</p>
                                             <div className="relative h-8">
                                                {!showInrTotal ? (
                                                   <p key="usd" className="text-2xl font-black text-white absolute inset-0 animate-in fade-in duration-700">
                                                      ${totalUsd.toFixed(2)}
                                                   </p>
                                                ) : (
                                                   <p key="inr" className="text-2xl font-black text-emerald-400 absolute inset-0 animate-in fade-in duration-700">
                                                      ₹{totalInr ? totalInr.toFixed(0) : '---'}
                                                   </p>
                                                )}
                                             </div>
                                          </div>
                                          <div className="bg-bg-card p-5 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/40 transition-colors col-span-1">
                                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 opacity-50">Job Status</p>
                                             <div className="relative">
                                                <button 
                                                  onClick={() => setActiveDropdown(activeDropdown === 'upwork-status' ? null : 'upwork-status')}
                                                  className="w-full flex items-center justify-between bg-bg-main/50 px-4 py-2.5 rounded-xl border border-border-main hover:border-brand-primary/40 transition-all text-sm font-black text-text-main group"
                                                >
                                                  <span>{selectedLead.upworkJobStatus || 'Open'}</span>
                                                  <ChevronRight size={16} className={`text-brand-primary transition-transform duration-300 ${activeDropdown === 'upwork-status' ? 'rotate-90' : ''}`} />
                                                </button>
                                                
                                                {activeDropdown === 'upwork-status' && (
                                                  <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-main rounded-2xl shadow-2xl z-[110] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                     {['Open', 'Closed'].map((status) => (
                                                        <button
                                                          key={status}
                                                          onClick={() => {
                                                             updateUpworkJobStatus(selectedLead.id, status);
                                                             setActiveDropdown(null);
                                                          }}
                                                          className={`w-full px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-brand-primary/10 ${
                                                             (selectedLead.upworkJobStatus || 'Open') === status 
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
                                          <div className="bg-bg-card p-5 rounded-3xl border border-border-main shadow-sm hover:border-brand-primary/40 transition-colors col-span-1">
                                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 opacity-50">Outcome</p>
                                             <div className="relative">
                                                <button 
                                                  onClick={() => setActiveDropdown(activeDropdown === 'upwork-outcome' ? null : 'upwork-outcome')}
                                                  className="w-full flex items-center justify-between bg-bg-main/50 px-4 py-2.5 rounded-xl border border-border-main hover:border-brand-primary/40 transition-all text-sm font-black text-text-main group"
                                                >
                                                  <span className={
                                                    selectedLead.upworkOutcome === 'Got it' ? 'text-emerald-400' : 
                                                    selectedLead.upworkOutcome === "Didn't get it" ? 'text-rose-400' : ''
                                                  }>
                                                    {selectedLead.upworkOutcome || 'Pending'}
                                                  </span>
                                                  <ChevronRight size={16} className={`text-brand-primary transition-transform duration-300 ${activeDropdown === 'upwork-outcome' ? 'rotate-90' : ''}`} />
                                                </button>
                                                
                                                {activeDropdown === 'upwork-outcome' && (
                                                  <div className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-border-main rounded-2xl shadow-2xl z-[110] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                     {['Pending', 'Got it', "Didn't get it"].map((outcome) => (
                                                        <button
                                                          key={outcome}
                                                          onClick={() => {
                                                             updateUpworkOutcome(selectedLead.id, outcome);
                                                             setActiveDropdown(null);
                                                          }}
                                                          className={`w-full px-5 py-3 text-left text-xs font-bold transition-colors hover:bg-brand-primary/10 ${
                                                             (selectedLead.upworkOutcome || 'Pending') === outcome 
                                                                ? 'text-brand-primary bg-brand-primary/5' 
                                                                : 'text-text-muted hover:text-text-main'
                                                          }`}
                                                        >
                                                          {outcome}
                                                        </button>
                                                     ))}
                                                  </div>
                                                )}
                                             </div>
                                          </div>
                                       </>
                                    );
                                 })()}
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
                        {!window.location.pathname.includes('/pipeline') && (
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
                        )}

                        {selectedLead.source !== 'Upwork' && !window.location.pathname.includes('/pipeline') && (
                         <div className="mt-12">
                            <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-10 flex items-center justify-center gap-4">
                                <div className="h-px bg-brand-primary/20 w-16"></div>
                                {window.location.pathname.includes('/funnel') ? 'FOLLOW-UP PIPELINE' : 'OPERATIONAL PROGRESS TRACKER'}
                                <div className="h-px bg-brand-primary/20 w-16"></div>
                            </h4>
                            <div className="bg-bg-card p-10 rounded-[40px] border border-border-main shadow-inner mb-12">
                               {window.location.pathname.includes('/funnel') && (selectedLead.source === 'Meta' || selectedLead.source === 'Linkedin') ? (
                                 <div className="flex items-center justify-center gap-4">
                                   {['1', '2', '3', '4'].map((num) => {
                                     const stage = `FU${num}`;
                                     const rawDate = selectedLead.rawData?.[`FU - ${num}`] || 
                                                     selectedLead.rawData?.[`FU-${num}`] || 
                                                     selectedLead.rawData?.[`FU ${num}`] || 
                                                     selectedLead.rawData?.[stage] || '—';
                                     
                                     const isDone = rawDate.toLowerCase().includes('done');
                                     const displayDate = rawDate.replace(/done/gi, '').trim();
                                     
                                     const comment = selectedLead.rawData?.[`FU - ${num} Comment`] || 
                                                     selectedLead.rawData?.[`FU-${num} Comment`] || 
                                                     selectedLead.rawData?.[`FU ${num} Comment`] || 
                                                     selectedLead.rawData?.[`${stage}_comment`] || 
                                                     selectedLead.rawData?.[`${stage} Comment`] || '';
                                     
                                     return (
                                       <div key={stage} className="relative group/tooltip flex-1 max-w-[160px]">
                                         <div className={`flex flex-col items-center justify-center p-6 border rounded-[24px] transition-all cursor-help ${
                                           isDone 
                                             ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                                             : displayDate !== '—'
                                               ? 'bg-white/5 border-white/10 text-text-main hover:border-brand-primary/50'
                                               : 'bg-white/[0.02] border-white/5 text-text-muted opacity-20'
                                         }`}>
                                           <div className="flex items-center gap-2 mb-2">
                                             {isDone ? <CheckCircle2 size={12} /> : <Calendar size={12} className="opacity-40" />}
                                             <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">{stage}</span>
                                           </div>
                                           <span className="text-sm font-black uppercase tracking-tight">
                                             {displayDate || '—'}
                                           </span>
                                         </div>
                                         
                                         {comment && (
                                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-5 bg-bg-card border border-border-main rounded-[24px] shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-[110] backdrop-blur-2xl">
                                             <div className="flex items-center gap-2 mb-3 border-b border-border-main/50 pb-3">
                                               <Zap size={12} className="text-brand-primary" />
                                               <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{stage} Intelligence</span>
                                             </div>
                                             <p className="text-xs text-text-main leading-relaxed font-medium">
                                               {comment}
                                             </p>
                                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-bg-card border-r border-b border-border-main rotate-45"></div>
                                           </div>
                                         )}
                                       </div>
                                     );
                                   })}
                                 </div>
                               ) : (
                                 <LeadStatusTracker lead={selectedLead} />
                               )}
                            </div>

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

                                  let groupsToUse = selectedLead.source === 'Linkedin' ? LINKEDIN_DISPOSITION_GROUPS : DISPOSITION_GROUPS;

                                  // Filter out initial outreach groups if we are in the funnel view
                                  if (window.location.pathname.includes('/funnel')) {
                                    const filteredGroups = {};
                                    Object.entries(groupsToUse).forEach(([group, statuses]) => {
                                      if (group !== 'Intro Phase' && group !== 'DNP / Outreach') {
                                        filteredGroups[group] = statuses;
                                      }
                                    });
                                    groupsToUse = filteredGroups;
                                  }

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
                                              const isDnpType = status.includes('DNP') && !status.includes('Never');

                                              return (
                                                <div key={status} className="relative group/btn">
                                                  <button 
                                                    onClick={() => {
                                                      if (status === 'MOVE TO PIPELINE' || isDnpType) {
                                                        setActiveDnpComment(status);
                                                        setDnpCommentText('');
                                                      } else {
                                                        updateLeadNotes(selectedLead.id, status);
                                                      }
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex flex-col items-center gap-2 min-w-[120px] transition-all
                                                      ${showGreen
                                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                                                        : hasScheduledDate
                                                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/40'
                                                          : 'bg-bg-card text-text-muted border-border-main hover:border-brand-primary/50 hover:text-brand-primary'}`}
                                                    title={sheetValue || 'No record'}
                                                  >
                                                    <div className="flex items-center gap-2">
                                                      {isDnpType && <DnpLogo size={14} color={showGreen ? "white" : "currentColor"} />}
                                                      {status === 'Junk' && <JunkLogo size={14} color={showGreen ? "white" : "currentColor"} />}
                                                      {status === 'Never Responded' && <NeverRespondedLogo size={14} color={showGreen ? "white" : "currentColor"} />}
                                                      <span className="leading-tight">{status}</span>
                                                    </div>
                                                    {dateOnly && (
                                                      <span className={`text-[8px] font-black opacity-60 block ${showGreen ? 'text-white' : 'text-emerald-500'}`}>
                                                        {dateOnly}
                                                      </span>
                                                    )}
                                                  </button>
                                                  
                                                  {activeDnpComment === status && (
                                                    <div className="absolute inset-0 z-[60] animate-in zoom-in-95 duration-200">
                                                      <input 
                                                        autoFocus
                                                        placeholder={status === 'MOVE TO PIPELINE' ? "Pipeline Comment..." : "DNP Note..."}
                                                        value={dnpCommentText}
                                                        onChange={(e) => setDnpCommentText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                          if (e.key === 'Enter') {
                                                            if (status === 'MOVE TO PIPELINE') {
                                                              fetch('https://n8n.srv1010832.hstgr.cloud/webhook/8ac97b11-acf4-45f1-ab0a-e40d68ee214b', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ ...selectedLead, lead_source: selectedLead.source, pipeline_comment: dnpCommentText })
                                                              }).catch(err => console.error('Webhook failed', err));
                                                              updateLeadNotes(selectedLead.id, status);
                                                              setActiveDnpComment(null);
                                                            } else {
                                                              submitDnpComment(selectedLead, status, dnpCommentText);
                                                            }
                                                          } else if (e.key === 'Escape') {
                                                            setActiveDnpComment(null);
                                                          }
                                                        }}
                                                        className="w-full h-full bg-[#000000] text-white text-[10px] font-black px-4 py-2 rounded-xl border-2 border-[#25d366] outline-none shadow-2xl uppercase placeholder:text-white/20"
                                                      />
                                                    </div>
                                                  )}
                                                </div>
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
      <div className="bg-[#000000] w-full max-w-3xl h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-white/5 animate-in zoom-in duration-300">
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#000000] custom-scrollbar" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundBlendMode: 'overlay', backgroundSize: 'cover' }}>
          <div className="flex justify-center mb-6">
            <span className="bg-[#0a0a0a] text-[#8696a0] px-4 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm">Encryption Validated</span>
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
           <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-lg opacity-50">
              <Send size={20} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
