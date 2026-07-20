import React from 'react';
import { LayoutDashboard, BookOpen, Terminal, Shield, Trophy, LucideIcon, Menu, X, Network, Key, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  score: number;
}

export default function Sidebar({ activeTab, setActiveTab, score }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'modules', label: 'Security Curriculum', icon: BookOpen },
    { id: 'labs', label: 'CTF Challenge Labs', icon: Trophy },
    { id: 'tools', label: 'Security Tools Suite', icon: Terminal }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 hover:text-cyan-300 transition-colors shadow-lg"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-base tracking-wider block font-sans">CYBERVERSE</span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-500/60 uppercase">Virtual Academy</span>
            </div>
          </div>

          {/* User Score Stats Card */}
          <div className="mt-8 p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/10 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Accumulated Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">{score}</span>
                <span className="text-xs font-semibold text-slate-400">PTS</span>
              </div>
              <div className="w-full bg-slate-950 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${Math.min((score / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-slate-500 block mt-2 text-right">Target: 1000 PTS</span>
            </div>
          </div>
        </div>

        {/* Navigation Middle list */}
        <nav className="flex-1 px-4 space-y-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile status banner */}
        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-900">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
              ST
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Student Terminal</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Authenticated
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
