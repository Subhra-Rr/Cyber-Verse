import React, { useState, useEffect } from 'react';
import { 
  Settings, BookOpen, Volume2, VolumeX, Eye, HelpCircle, Code, ShieldAlert, 
  Terminal, Sparkles, Check, RefreshCw, Key, ShieldCheck, ListCollapse, ListCheck
} from 'lucide-react';

interface SettingProps {
  theme: string;
  setTheme: (t: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (r: boolean) => void;
}

export default function SystemDocsSettings({
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  reducedMotion,
  setReducedMotion
}: SettingProps) {
  const [activeTab, setActiveTab] = useState<'docs' | 'settings' | 'changelog' | 'secrets'>('settings');
  
  // Settings values
  const [language, setLanguage] = useState('EN');
  const [highContrastText, setHighContrastText] = useState(false);

  // Easter eggs values
  const [secretCode, setSecretCode] = useState('');
  const [secretOutput, setSecretOutput] = useState<string | null>(null);

  // Real-time audio synthesizer using Web Audio API
  const playSynthesizedSound = (type: 'click' | 'alert' | 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.setValueAtTime(480, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(640, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.32);
      }
    } catch (e) {
      console.warn('Audio context creation blocked until user interaction.', e);
    }
  };

  const triggerSecretCheat = () => {
    playSynthesizedSound('success');
    const input = secretCode.trim().toLowerCase();
    if (input === 'matrix') {
      setSecretOutput('>> INJECTING REENTRANT METADATA... ACCESS GRANTED [MATRIX THEME CODE ACTIVE]');
      setTheme('matrix');
    } else if (input === 'retro') {
      setSecretOutput('>> RETRO TERMINAL EMULATOR ENABLED... CLASSIC AMBER HUD ONLINE');
      setTheme('retro');
    } else if (input === 'cyber') {
      setSecretOutput('>> REVERTING TO COSMIC SLATE CANVASES [DEFAULT HUD ENGAGED]');
      setTheme('glass');
    } else if (input === 'konami') {
      setSecretOutput('>> CHEAT ENGAGED: +9999 CREDITS | GOD MODE ENABLED | SECURE ROUTERS VERIFIED');
    } else {
      setSecretOutput('>> CODE ERROR: CORE_SYS_REFUSED. TRY CODE: "matrix", "retro", "cyber", "konami".');
    }
  };

  return (
    <div id="settings-docs-root" className="space-y-6">
      {/* Header Panel */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5.5 h-5.5 text-cyan-400" /> Operational Center & System Configurations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access developer specifications, customize display layouts, enable real-time synthesized audio triggers, and activate system cheat parameters.
          </p>
        </div>

        {/* Local sub-tabs selector */}
        <div className="bg-slate-950 p-1 border border-slate-900 rounded-xl flex font-mono text-[10px]">
          <button
            onClick={() => { setActiveTab('settings'); playSynthesizedSound('click'); }}
            className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
              activeTab === 'settings' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Settings className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Control Desk
          </button>
          <button
            onClick={() => { setActiveTab('docs'); playSynthesizedSound('click'); }}
            className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
              activeTab === 'docs' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Sys Docs
          </button>
          <button
            onClick={() => { setActiveTab('changelog'); playSynthesizedSound('click'); }}
            className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
              activeTab === 'changelog' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Changelog
          </button>
          <button
            onClick={() => { setActiveTab('secrets'); playSynthesizedSound('click'); }}
            className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
              activeTab === 'secrets' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Secrets Box
          </button>
        </div>
      </div>

      {/* Main tab renders */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Customizations */}
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative space-y-4">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" /> Interface Customizer
            </span>

            {/* Themes list */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Visual Layout Skins</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'glass', name: 'Cosmic Glass' },
                  { id: 'matrix', name: 'Phosphor Green' },
                  { id: 'retro', name: 'Amber CRT' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      playSynthesizedSound('success');
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-[10px] font-mono font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                      theme === t.id
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[8px] font-normal text-slate-500 font-sans">Active skin</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility options */}
            <div className="space-y-3.5 pt-4 border-t border-slate-900 font-mono text-[11px] text-slate-400">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Accessibility & Motion Controls</label>
              
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                <span className="flex flex-col">
                  <span>Enforce Reduced Motion</span>
                  <span className="text-[9px] font-sans text-slate-500">Mutes complex Framer transitions.</span>
                </span>
                <input 
                  type="checkbox" 
                  checked={reducedMotion} 
                  onChange={(e) => {
                    setReducedMotion(e.target.checked);
                    playSynthesizedSound('click');
                  }}
                  className="cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-900">
                <span className="flex flex-col">
                  <span>High Contrast text readability</span>
                  <span className="text-[9px] font-sans text-slate-500">Bolds technical spec definitions.</span>
                </span>
                <input 
                  type="checkbox" 
                  checked={highContrastText} 
                  onChange={(e) => {
                    setHighContrastText(e.target.checked);
                    playSynthesizedSound('click');
                  }}
                  className="cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Sound Synthesizer Controls */}
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative space-y-4">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-violet-400" /> Synthesized Sound Waves Desk
            </span>

            <div className="space-y-4">
              <p className="text-slate-400 text-xs leading-relaxed">
                We generate real-time audio sound effects using the standard browser **Web Audio API**. This system runs completely client-side without any network packet loads or external media assets.
              </p>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="font-mono text-[11px] text-slate-400 flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  Sound FX Telemetry
                </span>
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    setTimeout(() => {
                      if (!soundEnabled) playSynthesizedSound('success');
                    }, 100);
                  }}
                  className={`px-3 py-1.5 border font-mono text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    soundEnabled 
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' 
                      : 'border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {soundEnabled ? 'Enabled (Synced)' : 'Disabled (Muted)'}
                </button>
              </div>

              {soundEnabled && (
                <div className="space-y-2 font-mono text-[10px]">
                  <span className="text-slate-500 block uppercase">Manual Oscillator Tests</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => playSynthesizedSound('click')}
                      className="py-1.5 bg-slate-950 border border-slate-900 rounded hover:border-slate-800 text-slate-400 cursor-pointer"
                    >
                      Keyboard Click
                    </button>
                    <button
                      onClick={() => playSynthesizedSound('alert')}
                      className="py-1.5 bg-slate-950 border border-slate-900 rounded hover:border-slate-800 text-slate-400 cursor-pointer"
                    >
                      IDS Scanner Alert
                    </button>
                    <button
                      onClick={() => playSynthesizedSound('success')}
                      className="py-1.5 bg-slate-950 border border-slate-900 rounded hover:border-slate-800 text-slate-400 cursor-pointer"
                    >
                      Security Unlock
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-[11px] text-slate-400">
          {/* File Architecture tree */}
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative lg:col-span-1">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3">
              Application Folder tree
            </span>

            <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2 overflow-x-auto text-slate-500 leading-normal">
              <div>📁 src/</div>
              <div className="pl-4">📁 components/</div>
              <div className="pl-8 text-slate-400">📄 Simulators.tsx <span className="text-slate-600">(Core tools)</span></div>
              <div className="pl-8 text-slate-400">📄 Visualizations.tsx <span className="text-slate-600">(Visual diagrams)</span></div>
              <div className="pl-8 text-slate-400">📄 TerminalSimulator.tsx</div>
              <div className="pl-4">📁 pages/</div>
              <div className="pl-8 text-slate-300">📄 Dashboard.tsx <span className="text-slate-600">(SOC Desk)</span></div>
              <div className="pl-8 text-slate-300">📄 CyberCity.tsx <span className="text-slate-600">(Digital twin)</span></div>
              <div className="pl-8 text-slate-300">📄 KnowledgeGraph.tsx</div>
              <div className="pl-8 text-slate-300">📄 SecurityArchitecture.tsx</div>
              <div className="pl-8 text-slate-300">📄 Notebook.tsx</div>
              <div className="pl-8 text-slate-300">📄 ResourceCenter.tsx</div>
              <div className="pl-4 text-slate-400">📄 App.tsx <span className="text-slate-600">(Global Router)</span></div>
              <div className="pl-4 text-slate-400">📄 types.ts <span className="text-slate-600">(Global typings)</span></div>
            </div>
          </div>

          {/* Design System docs */}
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative lg:col-span-2 space-y-4">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Design system & Theme parameters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Color Spec Profiles</span>
                <div className="flex gap-2 items-center">
                  <span className="w-5 h-5 rounded bg-cyan-400" />
                  <span>Cyan Neon (#22d3ee)</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-5 h-5 rounded bg-rose-500" />
                  <span>Rose Offense (#f43f5e)</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-5 h-5 rounded bg-emerald-400" />
                  <span>Emerald Defense (#34d399)</span>
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Visual Layout Grid Rules</span>
                <div className="space-y-1 text-[10px]">
                  <div>- Border Radius: <code className="text-cyan-400">rounded-2xl (1rem)</code></div>
                  <div>- Layout Border: <code className="text-cyan-400">border border-slate-900</code></div>
                  <div>- Glass Backdrop: <code className="text-cyan-400">backdrop-blur-md bg-slate-900/40</code></div>
                </div>
              </div>
            </div>

            <p className="text-slate-500 font-sans leading-relaxed text-xs">
              Every interface asset, panel border glow, card hover scale trigger, and indicator lamp across CyberVerse is custom-compiled using utility Tailwind CSS classes directly inside functional React code layers.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'changelog' && (
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative font-mono text-[11px] text-slate-400 space-y-4">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            System updates logs
          </span>

          <div className="space-y-4">
            <div className="border-l-2 border-cyan-400 pl-4 space-y-1">
              <strong className="text-white text-xs block">v2.5.0 - The Ultimate Edition (Active)</strong>
              <span className="text-slate-500 block text-[9px]">COMPLETED JULY 2026</span>
              <p className="text-slate-400 font-sans text-xs">
                Integrated Digital Twin SCADA City, topological Knowledge Relationship Graphs, animated perimeter system designs, personal encryption whiteboards, and Web Audio synths.
              </p>
            </div>

            <div className="border-l-2 border-slate-800 pl-4 space-y-1 text-slate-500">
              <strong className="text-slate-400 text-xs block">v1.2.0 - Command Terminals Update</strong>
              <span className="text-slate-600 block text-[9px]">COMPLETED MARCH 2026</span>
              <p className="font-sans text-xs">
                Added sandboxed Linux CLI console terminal parser and cryptographic Caesar tools.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'secrets' && (
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative space-y-4">
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" /> Sandboxed Secrets Command console
          </span>

          <div className="space-y-3 font-mono text-[11px]">
            <p className="text-slate-400 font-sans text-xs">
              Type special developer configuration override cheat codes in the shell below to trigger secret visual behaviors:
            </p>

            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-3">
              <div className="flex gap-2">
                <span className="text-cyan-400 font-bold leading-none mt-2.5">sys_override#</span>
                <input
                  type="text"
                  placeholder="Type matrix, retro, cyber, or konami..."
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') triggerSecretCheat();
                  }}
                  className="bg-slate-900 border border-slate-850 rounded px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 flex-1"
                />
                <button
                  onClick={triggerSecretCheat}
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded cursor-pointer transition-all"
                >
                  Run
                </button>
              </div>

              {secretOutput && (
                <div className="bg-slate-900/60 p-3 border border-slate-850 rounded text-emerald-400 text-[10px] whitespace-pre-wrap leading-normal">
                  {secretOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
