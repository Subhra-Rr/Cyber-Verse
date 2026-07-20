import React from 'react';
import { Shield, ArrowRight, Terminal, Trophy, Cpu, Network, Heart, Zap, Globe } from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: () => void;
}

export default function LandingPage({ onEnterPlatform }: LandingPageProps) {
  return (
    <div id="landing-page-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(8,47,73,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(8,47,73,0.1)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* Floating Particle Orbs */}
      <div className="absolute top-1/4 left-1/12 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-1/4 right-1/12 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm block">CYBERVERSE</span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-500/60 uppercase">Virtual Academy</span>
          </div>
        </div>
        <button
          onClick={onEnterPlatform}
          className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors"
        >
          Access Sandbox
        </button>
      </header>

      {/* Hero section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        {/* Release tag badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider mb-6 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Interactive Offline Platform v1.4
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-white max-w-3xl leading-tight">
          Master Modern Cyber Security <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            Through Interactive Play
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-6 leading-relaxed">
          Learn networking, cryptography, Linux command line terminals, web application firewalls, and forensic analysis entirely inside your browser. No server setup, no risk.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-md">
          <button
            onClick={onEnterPlatform}
            className="px-7 py-4 bg-cyan-500 hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            Enter Platform <ArrowRight className="w-4.5 h-4.5" />
          </button>
          <a
            href="#features-section"
            className="px-7 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl font-bold text-sm transition-colors flex items-center justify-center"
          >
            Explore Curriculum
          </a>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mt-20 border-t border-slate-900/50 pt-12 text-left font-mono">
          <div>
            <span className="text-2xl font-black text-cyan-400">10</span>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mt-1">Virtual Modules</span>
          </div>
          <div>
            <span className="text-2xl font-black text-violet-400">5+</span>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mt-1">Capture The Flags</span>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-400">5+</span>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mt-1">Virtual Sandboxes</span>
          </div>
          <div>
            <span className="text-2xl font-black text-indigo-400">100%</span>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mt-1">Client-Side Offline</span>
          </div>
        </div>

        {/* Features Bento Grid */}
        <section id="features-section" className="w-full mt-32 max-w-5xl text-left space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">Professional Interactive Sandbox</h2>
            <p className="text-slate-400 text-xs leading-normal">
              Get direct hands-on experience without risking host systems or configuring heavy VM layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-900 hover:border-slate-850 transition-all space-y-4">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Simulated Linux Shell</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Navigate directories, read log files, inspect active ports, and run scripts in a real responsive, memory-backed command-line engine.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-900 hover:border-slate-850 transition-all space-y-4">
              <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Capture the Flag (CTF)</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Tackle five custom interactive security puzzle labs including SQL injection sandboxes, spot phishing emails, and incident responses.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-900 hover:border-slate-850 transition-all space-y-4">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Symmetric & Hash Dials</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Visually encrypt messages with interactive Caesar matrices, and generate hashes showing the mathematical avalanche effects.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 border-t border-slate-900/40 text-center flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs">
        <span>&copy; {new Date().getFullYear()} CyberVerse. For educational exploration only. No real servers were harmed.</span>
        <div className="flex items-center gap-1 mt-4 sm:mt-0 text-[10px] font-mono">
          <span>Crafted for local performance</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 mx-1" />
          <span>with offline support</span>
        </div>
      </footer>
    </div>
  );
}
