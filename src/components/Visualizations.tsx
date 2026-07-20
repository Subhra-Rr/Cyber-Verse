import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Network, Activity, Globe, ArrowRight, Server, Cpu, Layers, Radio, HelpCircle, RefreshCw, RefreshCw as LoopIcon } from 'lucide-react';

// ==========================================
// 1. GLOBAL CYBER THREAT MAP SIMULATOR
// ==========================================
export function CyberThreatMap() {
  const [logs, setLogs] = useState<{ id: string; type: string; origin: string; dest: string; severity: 'low' | 'med' | 'high' }[]>([]);
  const [activeVector, setActiveVector] = useState<number>(0);

  const origins = ['Beijing', 'Moscow', 'Pyongyang', 'Tehran', 'São Paulo', 'Sydney'];
  const destinations = ['Washington DC', 'Frankfurt', 'London', 'Tokyo', 'Silicon Valley', 'Singapore'];
  const attackTypes = ['DDoS Flood', 'SQL Injection Probe', 'Trojan Payload Upload', 'Ransomware Beacon', 'Port Scanner Sweep'];

  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 4 }).map((_, idx) => ({
      id: Math.random().toString(),
      type: attackTypes[idx % attackTypes.length],
      origin: origins[idx % origins.length],
      dest: destinations[(idx + 2) % destinations.length],
      severity: idx % 3 === 0 ? 'high' : idx % 3 === 1 ? 'med' : 'low'
    }));
    setLogs(initialLogs);

    // Keep generating logs
    const interval = setInterval(() => {
      const newLog = {
        id: Math.random().toString(),
        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        origin: origins[Math.floor(Math.random() * origins.length)],
        dest: destinations[Math.floor(Math.random() * destinations.length)],
        severity: Math.random() > 0.65 ? 'high' : Math.random() > 0.3 ? 'med' : 'low' as any
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
      setActiveVector((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="cyber-threat-map" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Globe className="text-cyan-400 w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          <h3 className="font-semibold text-slate-100 text-base">Global Threat Intelligence Monitor</h3>
        </div>
        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase animate-pulse">
          ● Live Intrusion Stream
        </span>
      </div>

      {/* SVG Map Representation */}
      <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-850 flex items-center justify-center">
        {/* Futuristic Grid Map Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.4)_1px,transparent_1px)] bg-[size:16px_16px]"></div>

        <svg className="w-full h-full max-h-[220px]" viewBox="0 0 800 400">
          {/* Virtual Target Nodes */}
          {/* North America */}
          <circle cx="150" cy="140" r="4" className="fill-cyan-400 animate-pulse" />
          <text x="150" y="125" className="fill-slate-500 font-mono text-[9px] text-center" textAnchor="middle">US_WEST</text>

          {/* South America */}
          <circle cx="280" cy="280" r="4" className="fill-indigo-500" />

          {/* Europe */}
          <circle cx="420" cy="130" r="4" className="fill-cyan-400 animate-pulse" />
          <text x="420" y="115" className="fill-slate-500 font-mono text-[9px]" textAnchor="middle">EU_CENTRAL</text>

          {/* Asia / Russia */}
          <circle cx="580" cy="110" r="4" className="fill-rose-500" />
          <circle cx="620" cy="160" r="4" className="fill-rose-500" />
          <text x="620" y="145" className="fill-slate-500 font-mono text-[9px]" textAnchor="middle">ASIA_EAST</text>

          {/* Australia */}
          <circle cx="700" cy="300" r="4" className="fill-indigo-500" />

          {/* Dynamic Laser Beams (Attacks) */}
          {activeVector === 0 && (
            <motion.path
              d="M 580 110 Q 350 70 150 140"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
          {activeVector === 1 && (
            <motion.path
              d="M 620 160 Q 520 120 420 130"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
            />
          )}
          {activeVector === 2 && (
            <motion.path
              d="M 280 280 Q 200 200 150 140"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2 }}
            />
          )}
          {activeVector === 3 && (
            <motion.path
              d="M 580 110 Q 640 220 700 300"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.5 }}
            />
          )}
        </svg>

        {/* Floating coordinates */}
        <div className="absolute bottom-3 right-4 font-mono text-[9px] text-cyan-500/40">
          SYS_PING_SYS_OK: (185.190.140 // LAT_64.08)
        </div>
      </div>

      {/* Live threat ticker logs */}
      <div className="space-y-1.5 font-mono text-[10px]">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center bg-slate-950/60 border border-slate-850 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                log.severity === 'high' ? 'bg-rose-500 animate-ping' : log.severity === 'med' ? 'bg-amber-500' : 'bg-blue-400'
              }`} />
              <span className="text-slate-200 font-bold">{log.type}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-rose-400 font-semibold">{log.origin}</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-cyan-400 font-semibold">{log.dest}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. THE CYBER KILL CHAIN & MITRE ATT&CK
// ==========================================
export function CyberKillChain() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: 'Reconnaissance',
      goal: 'Information Gathering',
      desc: 'Researching, identifying, and selecting targets using passive OSINT (Whois, Shodan, LinkedIn) and active port scanning.',
      defenses: 'Log auditing, public metadata sanitization, honeypots.'
    },
    {
      title: 'Weaponization',
      goal: 'Coupling Payload with Exploit',
      desc: 'Creating an deliverable payload (e.g., infected PDF, macro-enabled spreadsheet, or dropper executable) targeting discovered vulnerabilities.',
      defenses: 'Threat intelligence, endpoint protection analysis, software vulnerability scanning.'
    },
    {
      title: 'Delivery',
      goal: 'Transmitting the Weapon',
      desc: 'Sending the weapon to the victim via email attachments, malicious USB drives, compromised URLs, or social engineering.',
      defenses: 'Phishing filters, user security training, web application firewalls.'
    },
    {
      title: 'Exploitation',
      goal: 'Triggering Code Execution',
      desc: 'The payload runs on the target system, exploiting a vulnerability (such as memory corruption or unsafe macro permission) to gain control.',
      defenses: 'Host intrusion prevention (HIPS), memory protection, software security patching.'
    },
    {
      title: 'Installation',
      goal: 'Establishing Persistence',
      desc: 'Installing backdoors, trojans, or registry persistence hooks to maintain access even if the computer restarts or network resets.',
      defenses: 'File integrity checkers, application whitelisting, digital signature requirements.'
    },
    {
      title: 'Command & Control',
      goal: 'Opening Communication Canal',
      desc: 'Establishing an encrypted remote connection (C2 beacon) from the infected server back to the attacker’s control server to download instructions.',
      defenses: 'Network egress filtering, DNS blocklists, threat hunting logs.'
    },
    {
      title: 'Actions on Objectives',
      goal: 'Executing the Mission',
      desc: 'The final payload objective: encrypting disks for ransom, exfiltrating intellectual database records, or conducting computational espionage.',
      defenses: 'Data encryption at rest, incident response plan deployment, quick server isolation.'
    }
  ];

  return (
    <div id="cyber-kill-chain" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Activity className="text-violet-400 w-5 h-5 animate-pulse" />
        <h3 className="font-semibold text-slate-100 text-base">Cyber Kill Chain (Intrusion Lifecycle)</h3>
      </div>

      {/* Steps Slider Progress */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`px-3 py-2 rounded-lg text-[10px] font-mono font-bold shrink-0 transition-all border ${
              activeStep === idx
                ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                : 'bg-slate-950/60 border-slate-850 hover:border-slate-800 text-slate-500'
            }`}
          >
            0{idx + 1}. {step.title}
          </button>
        ))}
      </div>

      {/* Selected Step Description Panel */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-violet-400 font-mono uppercase font-bold tracking-wider">Stage Goal: {steps[activeStep].goal}</span>
            <h4 className="text-sm font-semibold text-slate-200 mt-0.5">{steps[activeStep].title}</h4>
          </div>
          <span className="text-2xl font-black font-mono text-slate-800">0{activeStep + 1}</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {steps[activeStep].desc}
        </p>

        <div className="border-t border-slate-900 pt-3 flex gap-2 items-start text-xs">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-300 block">Defense & Detection Mitigation:</span>
            <span className="text-slate-400">{steps[activeStep].defenses}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. INTERACTIVE TCP HANDSHAKE SIMULATION
// ==========================================
export function TcpHandshakeSimulation() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [synPos, setSynPos] = useState<number>(0);
  const [synAckPos, setSynAckPos] = useState<number>(0);
  const [ackPos, setAckPos] = useState<number>(0);

  const resetSimulation = () => {
    setActiveStep(0);
    setSynPos(0);
    setSynAckPos(0);
    setAckPos(0);
  };

  const runStep = () => {
    if (activeStep === 0) {
      // SYN
      setActiveStep(1);
      setSynPos(100);
    } else if (activeStep === 1) {
      // SYN-ACK
      setActiveStep(2);
      setSynAckPos(100);
    } else if (activeStep === 2) {
      // ACK
      setActiveStep(3);
      setAckPos(100);
    }
  };

  return (
    <div id="tcp-handshake-sim" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Server className="text-indigo-400 w-5 h-5 animate-pulse" />
          <h3 className="font-semibold text-slate-100 text-base">TCP Three-Way Handshake</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetSimulation}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runStep}
            disabled={activeStep >= 3}
            className="px-2.5 py-0.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 rounded text-[10px] font-mono text-slate-950 font-bold"
          >
            {activeStep === 0 ? 'Send SYN' : activeStep === 1 ? 'Send SYN-ACK' : activeStep === 2 ? 'Send ACK' : 'Connected'}
          </button>
        </div>
      </div>

      {/* Handshake visual link */}
      <div className="relative h-[120px] bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between px-8 overflow-hidden">
        {/* Client */}
        <div className="flex flex-col items-center z-10">
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">CLIENT_TERMINAL</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1.5">
            {activeStep === 0 ? 'LISTEN' : activeStep === 1 ? 'SYN_SENT' : 'ESTABLISHED'}
          </span>
        </div>

        {/* Cable / Line */}
        <div className="absolute inset-x-24 h-0.5 bg-slate-850 z-0">
          {/* Animated packets */}
          {activeStep >= 1 && (
            <motion.div
              className="absolute w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] font-mono font-black text-white"
              style={{ top: -6 }}
              initial={{ left: '0%' }}
              animate={{ left: '100%' }}
              transition={{ duration: 1 }}
            >
              SYN
            </motion.div>
          )}
          {activeStep >= 2 && (
            <motion.div
              className="absolute w-6 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[7px] font-mono font-black text-slate-950"
              style={{ top: -6 }}
              initial={{ right: '0%' }}
              animate={{ right: '100%' }}
              transition={{ duration: 1 }}
            >
              S-A
            </motion.div>
          )}
          {activeStep >= 3 && (
            <motion.div
              className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] font-mono font-black text-white"
              style={{ top: -6 }}
              initial={{ left: '0%' }}
              animate={{ left: '100%' }}
              transition={{ duration: 1 }}
            >
              ACK
            </motion.div>
          )}
        </div>

        {/* Server */}
        <div className="flex flex-col items-center z-10">
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center">
            <Server className="w-5 h-5 text-indigo-400" />
            <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">WEB_SERVER</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1.5">
            {activeStep === 0 ? 'LISTEN' : activeStep === 1 ? 'SYN_RCVD' : 'ESTABLISHED'}
          </span>
        </div>
      </div>

      {/* Explanations */}
      <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl font-mono text-[10px] space-y-1">
        <div className={`p-1 rounded ${activeStep === 1 ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-500'}`}>
          1. <b>SYN:</b> Client sends Synchronization request with sequence number (Seq=1000).
        </div>
        <div className={`p-1 rounded ${activeStep === 2 ? 'bg-amber-950/40 text-amber-300' : 'text-slate-500'}`}>
          2. <b>SYN-ACK:</b> Server acknowledges client request (Ack=1001) and sends sequence (Seq=5000).
        </div>
        <div className={`p-1 rounded ${activeStep === 3 ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-500'}`}>
          3. <b>ACK:</b> Client responds with confirmation (Ack=5001). Connection successfully established!
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. OSI MODEL PACKET ENCAPSULATION
// ==========================================
export function OsiLayerJourney() {
  const [activeLayer, setActiveLayer] = useState<number>(6);

  const layers = [
    { num: 7, name: 'Application', pdu: 'Data', desc: 'Adds application context (e.g., HTTP headers like GET / index.html).' },
    { num: 6, name: 'Presentation', pdu: 'Data', desc: 'Saves character formatting and encryption tags (TLS handshake session).' },
    { num: 5, name: 'Session', pdu: 'Data', desc: 'Opens communication tunnels and checks authentication logins.' },
    { num: 4, name: 'Transport', pdu: 'Segment', desc: 'Splits raw data into segments and attaches Source/Dest TCP ports.' },
    { num: 3, name: 'Network', pdu: 'Packet', desc: 'Wraps segments into packets, adding Sender and Target IP addresses.' },
    { num: 2, name: 'Data Link', pdu: 'Frame', desc: 'Adds local hardware MAC addresses and Ethernet frames with checksum trailers.' },
    { num: 1, name: 'Physical', pdu: 'Bits', desc: 'Converts all frame headers and contents into raw binary bits on copper wire.' }
  ];

  return (
    <div id="osi-layer-journey" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="text-teal-400 w-5 h-5 animate-pulse" />
          <h3 className="font-semibold text-slate-100 text-base">OSI Packet Encapsulation Tracer</h3>
        </div>
        <button
          onClick={() => setActiveLayer((prev) => (prev === 0 ? 6 : prev - 1))}
          className="px-2.5 py-0.5 bg-teal-500 hover:bg-teal-600 rounded text-[10px] font-mono text-slate-950 font-bold flex items-center gap-1 transition-all"
        >
          <LoopIcon className="w-3 h-3 animate-spin" />
          Descend Stack
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Vertical Stack list */}
        <div className="col-span-3 space-y-1">
          {layers.map((layer, idx) => (
            <button
              key={idx}
              onClick={() => setActiveLayer(idx)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg border font-mono text-[10px] flex justify-between items-center transition-all ${
                activeLayer === idx
                  ? 'bg-teal-500/10 border-teal-500 text-teal-300 font-bold'
                  : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-500'
              }`}
            >
              <span>L{layer.num}. {layer.name}</span>
              <span className="px-1 py-0.5 bg-slate-900 text-slate-400 rounded text-[9px] font-normal uppercase">{layer.pdu}</span>
            </button>
          ))}
        </div>

        {/* Encapsulated visual block */}
        <div className="col-span-2 bg-slate-950 rounded-xl border border-slate-850 p-3.5 flex flex-col justify-center items-center font-mono space-y-1.5 min-h-[180px]">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2 text-center">Encapsulation View</span>

          {/* Packet visual box layer blocks */}
          {activeLayer <= 5 && (
            <div className="w-full text-center py-0.5 bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-[8px] rounded uppercase font-bold">
              [MAC Eth Header]
            </div>
          )}
          {activeLayer <= 4 && (
            <div className="w-full text-center py-0.5 bg-rose-950/60 border border-rose-500/20 text-rose-300 text-[8px] rounded uppercase font-bold">
              [IP Header Data]
            </div>
          )}
          {activeLayer <= 3 && (
            <div className="w-full text-center py-0.5 bg-amber-950/60 border border-amber-500/20 text-amber-300 text-[8px] rounded uppercase font-bold">
              [TCP Segment Header]
            </div>
          )}
          <div className="w-full text-center py-4 bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[9px] rounded font-bold uppercase flex flex-col justify-center">
            <span>Payload Data</span>
            <span className="text-[7px] text-slate-400 font-normal mt-0.5">({layers[activeLayer].pdu})</span>
          </div>
          {activeLayer <= 5 && (
            <div className="w-full text-center py-0.5 bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-[8px] rounded uppercase font-bold">
              [CRC Checksum Trailer]
            </div>
          )}
        </div>
      </div>

      {/* Description guide box */}
      <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl text-xs flex gap-2">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200 block text-xs">Layer Details:</span>
          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{layers[activeLayer].desc}</p>
        </div>
      </div>
    </div>
  );
}
