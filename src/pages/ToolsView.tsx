import React, { useState } from 'react';
import { Terminal, Key, ShieldAlert, Key as KeyIcon, Search, Eye, Columns } from 'lucide-react';
import { PasswordStrengthChecker, HashGenerator, CaesarCipherTool, PortScanner, FirewallBuilder } from '../components/Simulators';

export default function ToolsView() {
  const [activeTool, setActiveTool] = useState<'password' | 'hash' | 'caesar' | 'port' | 'firewall'>('password');

  const tools = [
    { id: 'password', label: 'Password Entropy Analyzer', icon: KeyIcon, component: PasswordStrengthChecker, desc: 'Analyzes password complexity, character classes, and brute-force cracking durations.' },
    { id: 'hash', label: 'Hash Workbench', icon: ShieldAlert, component: HashGenerator, desc: 'Computes real-time MD5, SHA-1, and SHA-256 integrity signatures showing mathematical cascades.' },
    { id: 'caesar', label: 'Substitution Cipher', icon: Columns, component: CaesarCipherTool, desc: 'Encrypts or decrypts texts in real-time with customizable Caesar matrix rotational offsets.' },
    { id: 'port', label: 'TCP Port Scanner', icon: Search, component: PortScanner, desc: 'Simulates active TCP sweeps, queries open ports, and retrieves application banners.' },
    { id: 'firewall', label: 'Firewall Policy Sandbox', icon: Terminal, component: FirewallBuilder, desc: 'Defines rulesets (ALLOW/BLOCK) to match active mock server traffic diagnostics.' }
  ];

  const ActiveComponent = tools.find((t) => t.id === activeTool)?.component || PasswordStrengthChecker;

  return (
    <div id="tools-view-root" className="space-y-6">
      {/* Title Header Row */}
      <div className="border-b border-slate-900 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Terminal className="w-5.5 h-5.5 text-cyan-400" /> Standalone Security Utilities Workbench
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore cryptographic mechanics, password strength calculations, and packet filtering policies in isolated playground nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Tool Selection Grid Rail */}
        <div className="col-span-1 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">Available Utilities</span>
          <div className="space-y-1.5">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold leading-none">{tool.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans leading-normal mt-2 line-clamp-2">
                    {tool.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Playground Pane */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-slate-900/20 rounded-2xl border border-slate-900 p-2">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
