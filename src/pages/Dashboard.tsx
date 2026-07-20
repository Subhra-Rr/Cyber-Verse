import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Module, UserProgress, Achievement } from '../types';
import { 
  Search, Compass, BookOpen, Star, Sparkles, Filter, CheckCircle2, ChevronRight, 
  Play, Trophy, Calendar, Zap, AlertTriangle, ArrowRight, Shield, ShieldCheck, 
  Clock, Skull, Globe, Activity, Terminal, ShieldAlert, Cpu, Layers, RefreshCw, Plus, Trash2, X
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  modules: Module[];
  achievements: (Achievement & { unlockedAt?: string })[];
  onSelectModule: (id: string) => void;
  onSelectLab: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

// Country coordinates on our custom 600x300 world-grid view
interface ThreatCountry {
  name: string;
  x: number;
  y: number;
  threats: number;
  color: string;
}

const threatCountries: ThreatCountry[] = [
  { name: 'India', x: 420, y: 140, threats: 455, color: 'text-cyan-400' },
  { name: 'China', x: 460, y: 110, threats: 260, color: 'text-rose-400' },
  { name: 'United States', x: 140, y: 95, threats: 320, color: 'text-amber-400' },
  { name: 'Indonesia', x: 490, y: 180, threats: 275, color: 'text-cyan-400' },
  { name: 'Brazil', x: 230, y: 210, threats: 175, color: 'text-emerald-400' },
  { name: 'Spain', x: 310, y: 100, threats: 135, color: 'text-purple-400' },
  { name: 'Italy', x: 330, y: 95, threats: 127, color: 'text-pink-400' }
];

interface LiveAttack {
  id: string;
  source: ThreatCountry;
  target: { name: string; x: number; y: number };
  type: string;
  port: number;
  severity: 'Critical' | 'High' | 'Medium';
  timestamp: string;
  ip: string;
  progress: number; // 0 to 100 for line traveling animation
}

interface RadarThreat {
  id: string;
  angle: number;
  distance: number; // 10 to 90 %
  type: string;
  severity: 'Critical' | 'High' | 'Warning';
  cve: string;
  host: string;
  time: string;
  resolved: boolean;
}

export default function Dashboard({ progress, modules, achievements, onSelectModule, onSelectLab, setActiveTab }: DashboardProps) {
  // Operational Mode Toggle
  const [dashboardView, setDashboardView] = useState<'ops' | 'academy'>('ops');
  
  // Search & filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Real-time metrics
  const [totalThreats, setTotalThreats] = useState(750);
  const [unresolvedCount, setUnresolvedCount] = useState(99);
  const [resolvedCount, setResolvedCount] = useState(651);
  const [avgResponse, setAvgResponse] = useState(45);
  
  // Custom interactive widgets list
  const [widgets, setWidgets] = useState([
    { id: 'honeypot', name: 'Decoy Honeypot Cluster', type: 'status', value: 'Active', icon: Cpu, desc: '3 active simulated decoys tracking remote scans.' },
    { id: 'darkweb', name: 'Dark Web Leak Monitor', type: 'alert', value: '0 Leaks', icon: Skull, desc: 'Listening to underground forums for compromised hashes.' },
    { id: 'defense', name: 'Autonomous IPS Engine', type: 'toggle', value: 'ON', icon: ShieldCheck, desc: 'Auto-rate limits repeated network handshakes.' }
  ]);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState('');
  const [newWidgetType, setNewWidgetType] = useState('status');
  const [newWidgetDesc, setNewWidgetDesc] = useState('');

  // Live attacks animation state
  const [liveAttacks, setLiveAttacks] = useState<LiveAttack[]>([]);
  const [attackLogs, setAttackLogs] = useState<LiveAttack[]>([]);

  // Radar Sweep States
  const [radarThreats, setRadarThreats] = useState<RadarThreat[]>([
    { id: 't1', angle: 45, distance: 75, type: 'SQL Injection', severity: 'Critical', cve: 'CVE-2026-0104', host: 'web-srv-01', time: 'Just now', resolved: false },
    { id: 't2', angle: 185, distance: 40, type: 'Buffer Overflow', severity: 'High', cve: 'CVE-2026-4412', host: 'auth-gateway', time: '2 mins ago', resolved: false },
    { id: 't3', angle: 290, distance: 60, type: 'DDoS Flood', severity: 'Warning', cve: 'CVE-2026-9031', host: 'db-replica-03', time: '5 mins ago', resolved: false }
  ]);
  const [selectedRadarThreat, setSelectedRadarThreat] = useState<RadarThreat | null>(null);
  const [radarRotation, setRadarRotation] = useState(0);

  // Daily Trivia Challenge State
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [dailyCorrect, setDailyCorrect] = useState<boolean | null>(null);
  const [selectedDailyOption, setSelectedDailyOption] = useState<string | null>(null);

  const dailyQuestion = {
    question: 'Which cyber threat vector specifically manipulates human behavior to extract passwords or access privileges?',
    options: ['Brute Force attack', 'Social Engineering', 'Buffer Overflow', 'SQL Injection'],
    correct: 'Social Engineering',
    explanation: 'Social Engineering (such as phishing, baiting, or tailgating) uses psychological manipulation rather than pure code exploit vulnerabilities.'
  };

  const handleDailySubmit = (option: string) => {
    setSelectedDailyOption(option);
    const isCorrect = option === dailyQuestion.correct;
    setDailyCorrect(isCorrect);
    setDailyAnswered(true);
  };

  // Generate a random live attack event
  const triggerRandomAttack = (sourceCountry?: ThreatCountry) => {
    const source = sourceCountry || threatCountries[Math.floor(Math.random() * threatCountries.length)];
    const targetCandidates = [
      { name: 'US Mainframe', x: 130, y: 105 },
      { name: 'EU Cloud Cluster', x: 320, y: 105 },
      { name: 'Asia Central Hub', x: 430, y: 135 }
    ];
    const target = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
    const types = ['SQL Injection', 'Malware Beacon', 'SSH Bruteforce', 'Phishing Relay', 'DDoS Packet'];
    const ports = [80, 443, 22, 8080, 3306, 5432];
    const severities: ('Critical' | 'High' | 'Medium')[] = ['Critical', 'High', 'Medium'];

    const newAttack: LiveAttack = {
      id: Math.random().toString(),
      source,
      target,
      type: types[Math.floor(Math.random() * types.length)],
      port: ports[Math.floor(Math.random() * ports.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date().toLocaleTimeString(),
      ip: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      progress: 0
    };

    setLiveAttacks((prev) => [...prev, newAttack]);
    setAttackLogs((prev) => [newAttack, ...prev.slice(0, 15)]);

    // Update real-time counter metrics
    setTotalThreats((prev) => prev + 1);
    setUnresolvedCount((prev) => prev + 1);
  };

  // Live attack line animation updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAttacks((prev) => 
        prev
          .map((att) => ({ ...att, progress: att.progress + 6 }))
          .filter((att) => att.progress < 100)
      );
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Periodic simulated live threats background triggers
  useEffect(() => {
    const triggerInterval = setInterval(() => {
      triggerRandomAttack();
    }, 4500);
    return () => clearInterval(triggerInterval);
  }, []);

  // Radar continuous angle rotation loop
  useEffect(() => {
    const animationFrame = setInterval(() => {
      setRadarRotation((prev) => (prev + 2.5) % 360);
    }, 45);
    return () => clearInterval(animationFrame);
  }, []);

  // Isolate host or Deploy patch action
  const handleResolveRadarThreat = (id: string) => {
    setRadarThreats((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, resolved: true };
        }
        return t;
      })
    );
    setUnresolvedCount((prev) => Math.max(0, prev - 1));
    setResolvedCount((prev) => prev + 1);
    
    if (selectedRadarThreat?.id === id) {
      setSelectedRadarThreat((prev) => prev ? { ...prev, resolved: true } : null);
    }
  };

  // Add Custom User Widget function
  const handleAddWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWidgetName.trim()) return;
    const icons = [Cpu, Activity, Terminal, Shield, Star, Clock];
    const item = {
      id: Math.random().toString(),
      name: newWidgetName,
      type: newWidgetType,
      value: newWidgetType === 'toggle' ? 'ON' : '99%',
      icon: icons[Math.floor(Math.random() * icons.length)],
      desc: newWidgetDesc || 'Custom configured system monitoring node.'
    };
    setWidgets([...widgets, item]);
    setNewWidgetName('');
    setNewWidgetDesc('');
    setIsWidgetModalOpen(false);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  // Module catalog filters
  const categories = ['All', 'Infrastructure', 'Securing Data', 'Securing Code', 'Attack & Defense'];
  const filteredModules = modules.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalLessonsCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessonsCount = progress.completedLessons.length;
  const lessonPercentage = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  const totalQuizzesCount = modules.length;
  const completedQuizzesCount = progress.completedQuizzes.length;
  const quizPercentage = totalQuizzesCount > 0 ? Math.round((completedQuizzesCount / totalQuizzesCount) * 100) : 0;

  // Custom activity heatmap renderer
  const renderHeatmap = () => {
    const today = new Date();
    const columns = 14;
    const grid: number[][] = Array.from({ length: 7 }, () => Array(columns).fill(0));

    const dates = Object.keys(progress.activityLog);
    dates.forEach((dateStr) => {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dayDiff = Math.floor((today.getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
        if (dayDiff >= 0 && dayDiff < columns * 7) {
          const col = columns - 1 - Math.floor(dayDiff / 7);
          const row = dayDiff % 7;
          if (row >= 0 && row < 7 && col >= 0 && col < columns) {
            grid[row][col] += progress.activityLog[dateStr] || 0;
          }
        }
      }
    });

    const getIntensityColor = (val: number) => {
      if (val === 0) return 'fill-slate-900 border-slate-950';
      if (val === 1) return 'fill-cyan-900/60';
      if (val === 2) return 'fill-cyan-700/80';
      return 'fill-cyan-400';
    };

    return (
      <div className="bg-slate-950/60 p-4 border border-slate-900 rounded-xl">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Progression Activity Heatmap
        </span>
        <div className="flex gap-2">
          <div className="flex flex-col justify-between text-[8px] font-mono text-slate-600 pr-1 select-none">
            <span>M</span>
            <span>W</span>
            <span>F</span>
          </div>
          <svg className="w-full max-w-sm h-16" viewBox="0 0 170 80">
            {grid.map((rowArr, rowIdx) =>
              rowArr.map((cellVal, colIdx) => (
                <rect
                  key={`${rowIdx}-${colIdx}`}
                  x={colIdx * 11 + 5}
                  y={rowIdx * 10}
                  width="8"
                  height="8"
                  rx="1.5"
                  className={`${getIntensityColor(cellVal)} transition-colors duration-300`}
                />
              ))
            )}
          </svg>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2 border-t border-slate-900/40 pt-1.5">
          <span>Last 14 weeks of studies</span>
          <div className="flex gap-1 items-center">
            <span>Less</span>
            <span className="w-2 h-2 rounded-sm bg-slate-900"></span>
            <span className="w-2 h-2 rounded-sm bg-cyan-900/60"></span>
            <span className="w-2 h-2 rounded-sm bg-cyan-700/80"></span>
            <span className="w-2 h-2 rounded-sm bg-cyan-400"></span>
            <span>More</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="dashboard-root" className="space-y-6">
      {/* Top Header Row with dynamic Cyber security layout and visual theme */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5.5 h-5.5 text-cyan-400 animate-pulse" /> Cyber Intelligence CommandCenter
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze live threats, trigger manual defense trials, and keep track of your security academy curriculum.
          </p>
        </div>

        {/* View Toggle tabs */}
        <div className="flex bg-slate-950 p-1 border border-slate-900 rounded-xl text-[10px] font-mono">
          <button
            onClick={() => setDashboardView('ops')}
            className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              dashboardView === 'ops'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Operational Map Room
          </button>
          <button
            onClick={() => setDashboardView('academy')}
            className={`px-3.5 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              dashboardView === 'academy'
                ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-violet-400" /> Academy & Studies
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* =======================================================
            VIEW 1: OPERATIONAL WAR ROOM (MAP + CYBER THREAT RADAR)
            ======================================================= */}
        {dashboardView === 'ops' && (
          <motion.div
            key="ops-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top Row: Glowing metrics grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl relative overflow-hidden flex justify-between items-center shadow-lg shadow-cyan-500/5">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Total Threats</span>
                    <span className="text-[8px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/25 px-1.5 py-0.2 rounded-full">
                      +25%
                    </span>
                  </div>
                  <span className="text-3xl font-black font-mono text-cyan-400 mt-2 block tracking-tight">
                    {totalThreats}
                  </span>
                </div>
                <div className="w-10 h-10 bg-cyan-500/5 border border-cyan-500/15 rounded-lg flex items-center justify-center text-cyan-400">
                  <ShieldAlert className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl relative overflow-hidden flex justify-between items-center">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500" />
                <div>
                  <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Avg Response</span>
                  <span className="text-3xl font-black font-mono text-cyan-400 mt-2 block tracking-tight">
                    {avgResponse}m
                  </span>
                </div>
                <div className="w-10 h-10 bg-cyan-500/5 border border-cyan-500/15 rounded-lg flex items-center justify-center text-cyan-400">
                  <Clock className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl relative overflow-hidden flex justify-between items-center shadow-lg shadow-rose-500/5">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-rose-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rose-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-rose-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-rose-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Unresolved</span>
                    <span className="text-[8px] font-mono bg-rose-500/15 text-rose-400 px-1.5 py-0.2 rounded-full">
                      14%
                    </span>
                  </div>
                  <span className="text-3xl font-black font-mono text-rose-400 mt-2 block tracking-tight">
                    {unresolvedCount}
                  </span>
                </div>
                <div className="w-10 h-10 bg-rose-500/5 border border-rose-500/15 rounded-lg flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl relative overflow-hidden flex justify-between items-center shadow-lg shadow-emerald-500/5">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Resolved</span>
                    <span className="text-[8px] font-mono bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded-full">
                      86%
                    </span>
                  </div>
                  <span className="text-3xl font-black font-mono text-emerald-400 mt-2 block tracking-tight">
                    {resolvedCount}
                  </span>
                </div>
                <div className="w-10 h-10 bg-emerald-500/5 border border-emerald-500/15 rounded-lg flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5.5 h-5.5" />
                </div>
              </div>
            </div>

            {/* Middle Row: Cyber threats bar list + SVG Live Attack World Map + Cyber Radar Scan */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* Left col: Threats by Type horizontal bar meters */}
              <div className="xl:col-span-1 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />
                
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-3 block">
                  Threats by Attack Type
                </span>

                <div className="space-y-4 py-4">
                  {[
                    { label: 'Malware Transmission', count: 324, percent: 85, color: 'bg-rose-500' },
                    { label: 'Phishing Vectors', count: 218, percent: 65, color: 'bg-emerald-500' },
                    { label: 'Ransomware Locking', count: 142, percent: 45, color: 'bg-amber-500' },
                    { label: 'SQL Injection payloads', count: 86, percent: 30, color: 'bg-cyan-500' },
                    { label: 'DDoS Traffic floods', count: 53, percent: 18, color: 'bg-purple-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-400">
                        <span>{item.label}</span>
                        <span className="font-bold text-slate-200">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                        <div 
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cyber indicators block */}
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Defensive Shield</span>
                  <span className="text-cyan-400 font-bold">STEADY</span>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Center col: Interactive SVG Threat world map */}
              <div className="xl:col-span-2 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />

                <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" /> Real-time Global Attack Intrusion Map
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Click country to trigger simulated manual payload</span>
                </div>

                {/* SVG Map Canvas */}
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-950 bg-slate-950/80 p-1 flex justify-center">
                  <svg viewBox="0 0 600 300" className="w-full max-w-2xl h-auto">
                    {/* Simplified Elegant Grid Dots as World Map Background */}
                    <g className="fill-slate-800 opacity-30">
                      {/* Americas */}
                      {Array.from({ length: 15 }).map((_, i) =>
                        Array.from({ length: 18 }).map((_, j) => {
                          const x = 30 + i * 15 + (j % 2) * 5;
                          const y = 40 + j * 12;
                          // Custom filter to shape Americas roughly
                          if (y < 230 && (x < 190 || (y > 150 && x < 250))) {
                            return <circle key={`am-${i}-${j}`} cx={x} cy={y} r="1.5" />;
                          }
                          return null;
                        })
                      )}
                      {/* Africa & Europe */}
                      {Array.from({ length: 14 }).map((_, i) =>
                        Array.from({ length: 20 }).map((_, j) => {
                          const x = 270 + i * 14 + (j % 2) * 5;
                          const y = 30 + j * 12;
                          if (y < 250 && x > 270 && x < 400 && (y < 120 || x < 370)) {
                            return <circle key={`af-${i}-${j}`} cx={x} cy={y} r="1.5" />;
                          }
                          return null;
                        })
                      )}
                      {/* Asia & Australia */}
                      {Array.from({ length: 18 }).map((_, i) =>
                        Array.from({ length: 22 }).map((_, j) => {
                          const x = 390 + i * 14 + (j % 2) * 5;
                          const y = 20 + j * 11;
                          if (y < 280 && (y < 200 || (x > 480 && y > 200))) {
                            return <circle key={`as-${i}-${j}`} cx={x} cy={y} r="1.5" />;
                          }
                          return null;
                        })
                      )}
                    </g>

                    {/* Central Target Nodes (US, EU, ASIA) */}
                    <g>
                      {/* US Mainframe Target */}
                      <circle cx="130" cy="105" r="5" className="fill-cyan-500/10 stroke-cyan-400 stroke-2" />
                      <circle cx="130" cy="105" r="12" className="fill-none stroke-cyan-500/30 stroke-1 animate-pulse" />
                      <text x="130" y="90" className="fill-slate-400 font-mono text-[8px] text-center" textAnchor="middle">EU-US CLOUD</text>

                      {/* EU Cloud Cluster Target */}
                      <circle cx="320" cy="105" r="5" className="fill-cyan-500/10 stroke-cyan-400 stroke-2" />
                      <circle cx="320" cy="105" r="12" className="fill-none stroke-cyan-500/30 stroke-1 animate-pulse" />
                      <text x="320" y="90" className="fill-slate-400 font-mono text-[8px] text-center" textAnchor="middle">EU CENTRAL</text>

                      {/* Asia Central Hub Target */}
                      <circle cx="430" cy="135" r="5" className="fill-cyan-500/10 stroke-cyan-400 stroke-2" />
                      <circle cx="430" cy="135" r="12" className="fill-none stroke-cyan-500/30 stroke-1 animate-pulse" />
                      <text x="430" y="120" className="fill-slate-400 font-mono text-[8px] text-center" textAnchor="middle">ASIA REPLICA</text>
                    </g>

                    {/* Active Origin threat nodes (interactive on click!) */}
                    {threatCountries.map((c, idx) => (
                      <g 
                        key={idx} 
                        className="cursor-pointer group"
                        onClick={() => triggerRandomAttack(c)}
                      >
                        {/* Red pulsating warning circle */}
                        <circle cx={c.x} cy={c.y} r="4.5" className="fill-rose-500 stroke-white stroke-1" />
                        <circle cx={c.x} cy={c.y} r="14" className="fill-none stroke-rose-500/40 stroke-1 group-hover:scale-125 transition-transform animate-ping" />
                        <text 
                          x={c.x} 
                          y={c.y + 14} 
                          className="fill-slate-300 font-mono font-bold text-[8px] group-hover:fill-cyan-400 transition-colors"
                          textAnchor="middle"
                        >
                          {c.name}
                        </text>
                      </g>
                    ))}

                    {/* Traveling attack vector laser vectors */}
                    {liveAttacks.map((att) => {
                      const startX = att.source.x;
                      const startY = att.source.y;
                      const endX = att.target.x;
                      const endY = att.target.y;

                      // Calculate current animated point coordinates
                      const currX = startX + (endX - startX) * (att.progress / 100);
                      const currY = startY + (endY - startY) * (att.progress / 100);

                      return (
                        <g key={att.id}>
                          {/* Laser beam line */}
                          <line 
                            x1={startX} 
                            y1={startY} 
                            x2={endX} 
                            y2={endY} 
                            className="stroke-rose-500/40 stroke-1 stroke-dasharray-[4,4] animate-dash" 
                          />
                          {/* Traveling laser projectile packet node */}
                          <circle cx={currX} cy={currY} r="3" className="fill-rose-400 stroke-white stroke-1 shadow-lg shadow-rose-500" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Absolute positioning live overlay threat alerts */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-900 p-2.5 rounded-lg text-[9px] font-mono space-y-1 max-w-xs backdrop-blur-sm">
                    <span className="text-slate-500 uppercase font-bold block border-b border-slate-900 pb-1">Active Attack Origins</span>
                    {threatCountries.slice(0, 3).map((c, i) => (
                      <div key={i} className="flex justify-between gap-6">
                        <span className="text-slate-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {c.name}
                        </span>
                        <span className="text-slate-400">{c.threats} incidents</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right col: Rotating Cyber threat radar panel */}
              <div className="xl:col-span-1 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />

                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-3 block">
                  Interactive Threat Radar
                </span>

                {/* Rotating Sweep Radar Screen */}
                <div className="relative w-full aspect-square max-w-[200px] mx-auto bg-slate-950 rounded-full border border-cyan-500/20 p-1 flex items-center justify-center my-4 overflow-hidden">
                  {/* Concentric grid circles */}
                  <div className="absolute inset-2 rounded-full border border-cyan-500/5" />
                  <div className="absolute inset-8 rounded-full border border-cyan-500/5" />
                  <div className="absolute inset-16 rounded-full border border-cyan-500/5" />
                  {/* Crosshairs */}
                  <div className="absolute h-full w-px bg-cyan-500/5" />
                  <div className="absolute w-full h-px bg-cyan-500/5" />

                  {/* Glowing Radar Sweep Hand overlay */}
                  <div 
                    className="absolute inset-0 origin-center select-none pointer-events-none"
                    style={{ transform: `rotate(${radarRotation}deg)` }}
                  >
                    {/* Glowing conic gradient cone replica via CSS borders */}
                    <div className="w-1/2 h-full bg-gradient-to-r from-cyan-500/10 to-transparent origin-right transform rotate-90" />
                    {/* Solid leading edge */}
                    <div className="absolute right-1/2 top-0 bottom-1/2 w-0.5 bg-cyan-400/80 shadow-[0_0_8px_cyan]" />
                  </div>

                  {/* Active Blinking Threat Targets on Radar */}
                  {radarThreats.map((t) => {
                    // Convert polar (angle, distance) to Cartesian (x, y) for placement
                    const angleRad = (t.angle * Math.PI) / 180;
                    const radius = t.distance * 0.9; // Scale to fit inset
                    const x = 50 + radius * Math.cos(angleRad);
                    const y = 50 + radius * Math.sin(angleRad);

                    if (t.resolved) return null;

                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedRadarThreat(t)}
                        className={`absolute w-3.5 h-3.5 -ml-1.5 -mt-1.5 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-125 z-10 ${
                          t.severity === 'Critical' 
                            ? 'bg-rose-500 animate-pulse border border-white' 
                            : t.severity === 'High' 
                            ? 'bg-amber-500 animate-pulse' 
                            : 'bg-yellow-400'
                        }`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <span className="w-1 h-1 bg-white rounded-full" />
                      </button>
                    );
                  })}
                </div>

                {/* Radar warning message details */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-[10px] font-mono leading-relaxed text-slate-400 text-center">
                  <span className="text-rose-400 font-extrabold block">Warning: Active Host Intrusion</span>
                  Select a pulsing threat target on the radar to deploy emergency isolation patches.
                </div>
              </div>
            </div>

            {/* Radar Threat Analysis & Resolution Modal Drawer */}
            <AnimatePresence>
              {selectedRadarThreat && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-900/80 border border-cyan-500/20 p-5 rounded-2xl font-mono text-xs space-y-4 shadow-lg shadow-cyan-500/5 relative"
                >
                  <button 
                    onClick={() => setSelectedRadarThreat(null)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        selectedRadarThreat.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {selectedRadarThreat.severity} Severity Threat
                      </span>
                      <span className="text-cyan-400 font-bold">Incursion Target: {selectedRadarThreat.host}</span>
                    </div>
                    <span className="text-slate-500">Vector ID: {selectedRadarThreat.cve}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Exploit Category</span>
                      <p className="text-slate-200 mt-1 font-bold">{selectedRadarThreat.type}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Live Signature Stamp</span>
                      <p className="text-slate-200 mt-1">{selectedRadarThreat.time}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Diagnostic Mitigation Status</span>
                      <p className={`mt-1 font-bold ${selectedRadarThreat.resolved ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                        {selectedRadarThreat.resolved ? '✓ CONTAINED & SECURED' : '⚠ ACTIVE BUFFER EXPLOITING'}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Resolution Controls */}
                  <div className="flex justify-between items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-850 flex-wrap">
                    <p className="text-[10px] text-slate-400 leading-normal max-w-lg">
                      <strong>Incident Response Recommendation:</strong> Isolate the network interface of the target node and deploy a parameterized sanitization patch to secure database entry queries immediately.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveRadarThreat(selectedRadarThreat.id)}
                        disabled={selectedRadarThreat.resolved}
                        className={`px-4 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer ${
                          selectedRadarThreat.resolved 
                            ? 'bg-slate-900 border border-slate-800 text-slate-500' 
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        {selectedRadarThreat.resolved ? '✓ Threat Isolated' : '⚠ Isolate & Defuse Host'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Row: Threats Log + Custom Widgets Builder Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Threat incident Logs Table */}
              <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />

                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-3 block">
                  Attacker Intrusion Live telemetry stream
                </span>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full font-mono text-[10px] text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 uppercase text-[8px] font-bold">
                        <th className="pb-2">Timestamp</th>
                        <th className="pb-2">Source IP</th>
                        <th className="pb-2">Attacker Country</th>
                        <th className="pb-2">Target Cloud</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2 text-right">Port</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attackLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">
                            Waiting for simulated laser vector beacons to register...
                          </td>
                        </tr>
                      ) : (
                        attackLogs.map((log) => (
                          <tr key={log.id} className="border-b border-slate-950 hover:bg-slate-950/20 transition-all">
                            <td className="py-2.5 text-slate-500">{log.timestamp}</td>
                            <td className="py-2.5 text-cyan-400 font-bold">{log.ip}</td>
                            <td className="py-2.5 text-slate-200 font-bold">{log.source.name}</td>
                            <td className="py-2.5 text-slate-400">{log.target.name}</td>
                            <td className="py-2.5">
                              <span className={`px-1.5 py-0.2 rounded-sm text-[8px] font-bold ${
                                log.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-slate-500 font-bold">{log.port}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom configured Widgets manager */}
              <div className="lg:col-span-1 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />

                <div>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Custom Security Widgets
                    </span>
                    <button
                      onClick={() => setIsWidgetModalOpen(true)}
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-[9px] font-bold flex items-center gap-1 cursor-pointer bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD WIDGET
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {widgets.map((wd) => (
                      <div key={wd.id} className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex gap-3 items-start group relative">
                        <div className="w-8 h-8 bg-cyan-500/5 border border-cyan-500/15 rounded-lg flex items-center justify-center text-cyan-400 shrink-0">
                          <wd.icon className="w-4 h-4" />
                        </div>
                        <div className="font-mono text-[10px] flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-200">{wd.name}</span>
                            <span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.2 rounded text-[8px]">{wd.value}</span>
                          </div>
                          <p className="text-slate-500 mt-0.5 text-[9px] leading-relaxed">{wd.desc}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveWidget(wd.id)}
                          className="absolute right-2 bottom-2 text-slate-700 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-900/60 p-2.5 rounded-xl text-[9px] font-mono text-slate-500 leading-normal mt-4">
                  <strong className="text-slate-400 block mb-0.5">💡 Widget Config Panel</strong>
                  Create and destroy modular micro-diagnostic indicators to design your own cybersecurity interface layouts.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =======================================================
            VIEW 2: ACADEMY LEARNING PATHWAYS & TRACKER
            ======================================================= */}
        {dashboardView === 'academy' && (
          <motion.div
            key="academy-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left: Stats heatmap progress */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lesson counter card */}
                <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-violet-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-violet-500" />
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Theory Lessons</span>
                    <span className="text-2xl font-black font-mono text-cyan-400 mt-1 block">
                      {completedLessonsCount} <span className="text-xs font-normal text-slate-500">/ {totalLessonsCount}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">{lessonPercentage}% Completed</span>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500/5 border border-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
                    <BookOpen className="w-5.5 h-5.5" />
                  </div>
                </div>

                {/* Quiz progress card */}
                <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-violet-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-violet-500" />
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest block">Quizzes Cleared</span>
                    <span className="text-2xl font-black font-mono text-violet-400 mt-1 block">
                      {completedQuizzesCount} <span className="text-xs font-normal text-slate-500">/ {totalQuizzesCount}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">{quizPercentage}% Finished</span>
                  </div>
                  <div className="w-12 h-12 bg-violet-500/5 border border-violet-500/10 rounded-full flex items-center justify-center text-violet-400">
                    <Trophy className="w-5.5 h-5.5" />
                  </div>
                </div>
              </div>

              {renderHeatmap()}

              {/* Achievements badges panel */}
              <div className="bg-slate-900/40 p-5 border border-slate-900 rounded-xl relative">
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-violet-500" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-violet-500" />
                
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4 flex items-center gap-1.5 border-b border-slate-905 pb-3">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Earned Achievement Medals
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {achievements.map((ach) => {
                    const isUnlocked = !!ach.unlockedAt;
                    return (
                      <div
                        key={ach.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                          isUnlocked
                            ? 'bg-slate-950/80 border-cyan-500/20 text-slate-200'
                            : 'bg-slate-950/20 border-slate-900/50 text-slate-600'
                        }`}
                      >
                        <div>
                          <span className={`text-[8.5px] font-mono font-bold uppercase ${isUnlocked ? 'text-cyan-400' : 'text-slate-700'}`}>
                            {ach.category}
                          </span>
                          <h4 className={`text-xs font-bold mt-1 ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                            {ach.title}
                          </h4>
                          <p className="text-[9.5px] text-slate-500 leading-normal mt-1">{ach.description}</p>
                        </div>
                        {isUnlocked && (
                          <span className="text-[8px] font-mono font-black text-cyan-500 text-right uppercase mt-3 block">
                            ★ UNLOCKED
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Path recommendation + Daily challenge */}
            <div className="col-span-1 space-y-6">
              {/* Pathway banner */}
              <div className="p-5 bg-gradient-to-br from-slate-950 to-indigo-950 border border-indigo-500/10 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">Active Pathway Recommendation</span>
                <h3 className="font-bold text-slate-100 text-base mt-2">Resume: Networking Protocols</h3>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed font-mono">
                  Continue studying the TCP Handshake packet exchanges or test yourself inside the custom Firewall simulation sandboxes.
                </p>
                <button
                  onClick={() => onSelectModule('networking')}
                  className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Resume Study <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Daily trivia widget */}
              <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Zap className="w-4.5 h-4.5 text-yellow-400 animate-bounce" />
                  <h3 className="font-mono text-xs font-bold text-slate-400 uppercase">Daily Security Challenge</h3>
                </div>

                <p className="text-slate-300 text-[11px] font-mono leading-normal bg-slate-950 p-3 rounded-lg border border-slate-900">
                  {dailyQuestion.question}
                </p>

                <div className="space-y-1.5 text-xs font-mono">
                  {dailyQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={dailyAnswered}
                      onClick={() => handleDailySubmit(opt)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-[11px] transition-all flex justify-between items-center cursor-pointer ${
                        dailyAnswered
                          ? opt === dailyQuestion.correct
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                            : opt === selectedDailyOption
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                            : 'bg-slate-950/20 border-slate-950 text-slate-600'
                          : 'bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {!dailyAnswered && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                  ))}
                </div>

                {dailyAnswered && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-[10px] leading-relaxed font-mono">
                    <span className={`font-bold block ${dailyCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dailyCorrect ? '✓ Correct Answer (+10 XP)' : '✗ Incorrect Answer'}
                    </span>
                    <p className="text-slate-400 mt-1">{dailyQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curriculum Module Search and Catalog Row (Common to bottom) */}
      <div className="border-t border-slate-900 pt-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-mono uppercase">
            <Compass className="w-4.5 h-4.5 text-cyan-400" /> Interactive Curriculum pathways
          </h3>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search concepts, modules, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter categories tags */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-850 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog list grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((m) => {
            const finishedLessons = m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
            const progressPercent = Math.round((finishedLessons / m.lessons.length) * 100);

            return (
              <div
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className="p-5 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest">
                      {m.category}
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      m.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : m.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {m.difficulty}
                    </span>
                  </div>

                  <h4 className="text-slate-100 font-bold text-sm mt-2 group-hover:text-cyan-300 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-950/70 text-slate-500 border border-slate-900 rounded text-[8px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="border-t border-slate-950 pt-4 mt-4 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Lessons Complete</span>
                    <span>{finishedLessons} / {m.lessons.length}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredModules.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-900 rounded-2xl">
              No learning modules found matching: "{search}". Try searching category filters.
            </div>
          )}
        </div>
      </div>

      {/* Widget Customization Form Modal Dialogue */}
      {isWidgetModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-cyan-500/30 p-6 rounded-2xl max-w-sm w-full font-mono text-xs space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Configure Security Widget
              </span>
              <button 
                onClick={() => setIsWidgetModalOpen(false)} 
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWidgetSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-bold block">Widget Identifier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honeypot Monitor"
                  value={newWidgetName}
                  onChange={(e) => setNewWidgetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-bold block">Status Type Mode</label>
                <select
                  value={newWidgetType}
                  onChange={(e) => setNewWidgetType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                >
                  <option value="status">Static Diagnostic Indicator</option>
                  <option value="alert">Security Alert Monitor</option>
                  <option value="toggle">Autonomous Toggle Controller</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-bold block">Detailed Description</label>
                <textarea
                  placeholder="Describe what metric bytes are measured by this sensor node..."
                  value={newWidgetDesc}
                  onChange={(e) => setNewWidgetDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all cursor-pointer"
              >
                Deploy New Sensor Widget
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
