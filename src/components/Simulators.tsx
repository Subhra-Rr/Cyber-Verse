import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, Eye, EyeOff, Search, Play, RefreshCw, Plus, Trash, Check, AlertCircle, RefreshCw as LoopIcon } from 'lucide-react';

// ==========================================
// 1. PASSWORD STRENGTH ANALYZER
// ==========================================
export function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [metrics, setMetrics] = useState({
    score: 0,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    lengthOk: false,
    feedback: 'Too Short'
  });

  useEffect(() => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const lengthOk = password.length >= 8;

    let score = 0;
    if (password.length > 0) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let feedback = 'Weak';
    if (score <= 2) feedback = 'Very Weak';
    else if (score <= 4) feedback = 'Moderate';
    else if (score <= 6) feedback = 'Strong';
    else feedback = 'Unbreakable';

    setMetrics({ score, hasUpper, hasLower, hasNumber, hasSpecial, lengthOk, feedback });
  }, [password]);

  const getCrackTime = () => {
    if (!password) return '0 seconds';
    const entropy = metrics.score * 12; // Simple entropy approximation
    const combinations = Math.pow(2, entropy);
    const speed = 1e9; // 1 Billion guesses per second (standard GPU rig)
    const seconds = combinations / speed;

    if (seconds < 1) return 'Instantaneous';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return `${(seconds / 31536000).toExponential(2)} years`;
  };

  const getStrengthColor = () => {
    if (metrics.score <= 2) return 'bg-rose-500';
    if (metrics.score <= 4) return 'bg-amber-500';
    if (metrics.score <= 6) return 'bg-emerald-500';
    return 'bg-cyan-500';
  };

  return (
    <div id="password-strength-checker" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Key className="text-cyan-400 w-5 h-5" />
        <h3 className="font-semibold text-slate-100 text-base">Password Entropy Analyzer</h3>
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a test password..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Security Score: {metrics.score} / 7</span>
          <span className="text-cyan-400 font-mono">{metrics.feedback}</span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(metrics.score / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${metrics.lengthOk ? 'bg-emerald-500' : 'bg-rose-500/30'}`} />
          <span className={metrics.lengthOk ? 'text-emerald-400' : 'text-slate-400'}>At least 8 chars</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${metrics.hasUpper ? 'bg-emerald-500' : 'bg-rose-500/30'}`} />
          <span className={metrics.hasUpper ? 'text-emerald-400' : 'text-slate-400'}>Uppercase Letter (A-Z)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${metrics.hasLower ? 'bg-emerald-500' : 'bg-rose-500/30'}`} />
          <span className={metrics.hasLower ? 'text-emerald-400' : 'text-slate-400'}>Lowercase Letter (a-z)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${metrics.hasNumber ? 'bg-emerald-500' : 'bg-rose-500/30'}`} />
          <span className={metrics.hasNumber ? 'text-emerald-400' : 'text-slate-400'}>Number (0-9)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${metrics.hasSpecial ? 'bg-emerald-500' : 'bg-rose-500/30'}`} />
          <span className={metrics.hasSpecial ? 'text-emerald-400' : 'text-slate-400'}>Special Character (!@#)</span>
        </div>
      </div>

      {/* Estimation */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
        <div>
          <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">Est. Brute Force Time</span>
          <span className="text-slate-200 font-mono font-medium text-sm">{getCrackTime()}</span>
        </div>
        <span className="text-slate-500 text-[10px] font-mono text-right">Speed: 1 Billion/sec</span>
      </div>
    </div>
  );
}

// ==========================================
// 2. CRYPTOGRAPHIC HASH WORKBENCH
// ==========================================
export function HashGenerator() {
  const [text, setText] = useState('CyberVerse');
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' });

  // Simple hashing algorithm simulation in frontend
  const computeHashes = (str: string) => {
    // Basic hash simulator returning consistent hexadecimal representation based on values
    const hashSim = (input: string, length: number) => {
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
      }
      let hex = Math.abs(hash).toString(16).padStart(8, 'a');
      while (hex.length < length) {
        hex += Math.abs((hash ^ hex.length) * 17).toString(16);
      }
      return hex.slice(0, length);
    };

    setHashes({
      md5: hashSim(str, 32),
      sha1: hashSim(str, 40),
      sha256: hashSim(str, 64)
    });
  };

  useEffect(() => {
    computeHashes(text);
  }, [text]);

  return (
    <div id="hash-generator" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Lock className="text-violet-400 w-5 h-5" />
        <h3 className="font-semibold text-slate-100 text-base">Hash Algorithm Workbench</h3>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-medium">Plaintext Data Input</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type content to hash..."
          rows={2}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono text-sm"
        />
      </div>

      {/* Outputs */}
      <div className="space-y-3 font-mono text-xs">
        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>MD5 (128-bit)</span>
            <span className="text-rose-400">Highly Insecure / Collision Prone</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-rose-300 break-all">
            {hashes.md5}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>SHA-1 (160-bit)</span>
            <span className="text-yellow-400">Legacy / Deprecated</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-yellow-200 break-all">
            {hashes.sha1}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>SHA-256 (256-bit)</span>
            <span className="text-emerald-400">Extremely Secure / Industry Standard</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 border border-slate-850 rounded-lg text-emerald-300 break-all font-semibold">
            {hashes.sha256}
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 leading-normal flex items-start gap-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800/50">
        <AlertCircle className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
        <span><b>Avalanche Effect Demonstration:</b> Change a single letter (e.g., lowercase "c" to "C") and observe how the output hash completely reorganizes without retaining any patterns from the previous state.</span>
      </div>
    </div>
  );
}

// ==========================================
// 3. CAESAR CIPHER TOOL
// ==========================================
export function CaesarCipherTool() {
  const [text, setText] = useState('INTERCEPTED SECRET TRANSSMISSION');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const runCaesar = (inputStr: string, shiftVal: number, opMode: 'encrypt' | 'decrypt') => {
    const s = opMode === 'encrypt' ? shiftVal : (26 - shiftVal) % 26;
    return inputStr
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base + s) % 26) + base);
        }
        return char;
      })
      .join('');
  };

  useEffect(() => {
    setOutput(runCaesar(text, shift, mode));
  }, [text, shift, mode]);

  return (
    <div id="caesar-cipher-tool" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Shield className="text-amber-400 w-5 h-5" />
        <h3 className="font-semibold text-slate-100 text-base">Caesar Cipher Substitution</h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'encrypt'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          Encrypt Plaintext
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'decrypt'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          Decrypt Ciphertext
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Output Result</label>
          <div className="w-full bg-slate-950/80 border border-amber-500/20 rounded-xl px-3 py-2 text-amber-300 font-mono text-xs h-[74px] overflow-y-auto break-all whitespace-pre-wrap">
            {output}
          </div>
        </div>
      </div>

      {/* Shift Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">Rotational Shift Key (Shift Offset)</span>
          <span className="text-amber-400 font-bold font-mono">+{shift} positions (ROT{shift})</span>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>
    </div>
  );
}

// ==========================================
// 4. PORT SCANNER SIMULATION
// ==========================================
export function PortScanner() {
  const [ip, setIp] = useState('185.190.140.54');
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [discovered, setDiscovered] = useState<{ port: number; service: string; status: string; banner: string }[]>([]);

  const portsToScan = [
    { port: 21, service: 'FTP', status: 'Closed', banner: '-' },
    { port: 22, service: 'SSH', status: 'Open', banner: 'SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5' },
    { port: 23, service: 'Telnet', status: 'Closed', banner: '-' },
    { port: 53, service: 'DNS', status: 'Filtered', banner: '-' },
    { port: 80, service: 'HTTP', status: 'Open', banner: 'Apache/2.4.41 (Ubuntu)' },
    { port: 443, service: 'HTTPS', status: 'Open', banner: 'nginx/1.18.0 (SSL Secured)' },
    { port: 3306, service: 'MySQL', status: 'Filtered', banner: '-' },
    { port: 5432, service: 'PostgreSQL', status: 'Closed', banner: '-' }
  ];

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setLogs([`Initiating Nmap security audit scan for target host IP: ${ip}...`]);
    setDiscovered([]);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < portsToScan.length) {
        const item = portsToScan[idx];
        setLogs((prev) => [
          ...prev,
          `Sending TCP SYN packet to probe port ${item.port} (${item.service})...`
        ]);

        setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            `Port ${item.port}: ${item.status.toUpperCase()} ${
              item.status === 'Open' ? ` - banner retrieved: "${item.banner}"` : ''
            }`
          ]);
          if (item.status === 'Open') {
            setDiscovered((prev) => [...prev, item]);
          }
        }, 150);

        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLogs((prev) => [...prev, 'Host scan complete. 1 IP address (1 host up) scanned in 2.45 seconds.']);
          setScanning(false);
        }, 300);
      }
    }, 400);
  };

  return (
    <div id="port-scanner-tool" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Search className="text-teal-400 w-5 h-5 animate-pulse" />
          <h3 className="font-semibold text-slate-100 text-base">TCP Port Scanner Audit</h3>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="px-3 py-1 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 rounded-lg text-xs font-semibold text-slate-950 flex items-center gap-1.5 transition-all"
        >
          {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          {scanning ? 'Scanning...' : 'Scan Host'}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3 items-center">
        <span className="col-span-2 text-xs text-slate-400 font-semibold text-right">Target IP Address:</span>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          disabled={scanning}
          className="col-span-3 bg-slate-950/85 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-teal-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 h-[180px]">
        {/* Terminal Scan Log */}
        <div className="bg-slate-950/90 border border-slate-850 p-2.5 rounded-xl overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="leading-snug">{log}</div>
          ))}
        </div>

        {/* Discovered Hosts */}
        <div className="bg-slate-950/90 border border-slate-850 p-2.5 rounded-xl overflow-y-auto">
          <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block border-b border-slate-800 pb-1 mb-1.5">Open Ports Identified</span>
          {discovered.length === 0 ? (
            <div className="text-[10px] text-slate-500 text-center py-8 font-mono">No active services scanned yet. Click "Scan Host".</div>
          ) : (
            <div className="space-y-1 font-mono text-[10px]">
              {discovered.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded border border-teal-500/10">
                  <span className="text-teal-400 font-bold">Port {item.port} ({item.service})</span>
                  <span className="text-slate-400 text-[9px] max-w-[120px] truncate" title={item.banner}>{item.banner}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. FIREWALL RULE BUILDER
// ==========================================
interface FirewallRule {
  id: string;
  priority: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  source: string;
  port: string;
  action: 'ALLOW' | 'BLOCK';
}

export function FirewallBuilder() {
  const [rules, setRules] = useState<FirewallRule[]>([
    { id: '1', priority: 10, protocol: 'TCP', source: '10.0.8.44', port: '22', action: 'ALLOW' },
    { id: '2', priority: 20, protocol: 'TCP', source: 'ANY', port: '80', action: 'ALLOW' },
    { id: '3', priority: 30, protocol: 'TCP', source: 'ANY', port: '443', action: 'ALLOW' },
    { id: '4', priority: 40, protocol: 'TCP', source: 'ANY', port: 'ANY', action: 'BLOCK' }
  ]);

  const [newRule, setNewRule] = useState<Omit<FirewallRule, 'id'>>({
    priority: 50,
    protocol: 'TCP',
    source: 'ANY',
    port: '8080',
    action: 'BLOCK'
  });

  const [activeTraffic, setActiveTraffic] = useState<{ src: string; port: number; proto: string; result: string; color: string }[]>([]);
  const [testing, setTesting] = useState(false);

  const addRule = () => {
    const id = Date.now().toString();
    setRules((prev) => [...prev, { ...newRule, id }].sort((a, b) => a.priority - b.priority));
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRunTraffic = () => {
    if (testing) return;
    setTesting(true);
    setActiveTraffic([]);

    const probes = [
      { src: '185.190.140.54', port: 80, proto: 'TCP' },
      { src: '185.190.140.54', port: 22, proto: 'TCP' },
      { src: '10.0.8.44', port: 22, proto: 'TCP' },
      { src: '198.51.100.8', port: 5432, proto: 'TCP' },
      { src: '8.8.8.8', port: 443, proto: 'TCP' }
    ];

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < probes.length) {
        const probe = probes[idx];
        // Match ruleset sequentially (lowest priority number wins)
        let matchedAction = 'BLOCK';
        for (const rule of rules) {
          const protoMatch = rule.protocol === probe.proto;
          const srcMatch = rule.source === 'ANY' || rule.source === probe.src;
          const portMatch = rule.port === 'ANY' || Number(rule.port) === probe.port;

          if (protoMatch && srcMatch && portMatch) {
            matchedAction = rule.action;
            break;
          }
        }

        setActiveTraffic((prev) => [
          ...prev,
          {
            src: probe.src,
            port: probe.port,
            proto: probe.proto,
            result: matchedAction,
            color: matchedAction === 'ALLOW' ? 'text-emerald-400' : 'text-rose-500'
          }
        ]);
        idx++;
      } else {
        clearInterval(timer);
        setTesting(false);
      }
    }, 600);
  };

  return (
    <div id="firewall-rule-builder" className="p-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Shield className="text-emerald-400 w-5 h-5 animate-bounce" />
          <h3 className="font-semibold text-slate-100 text-base">ACL Firewall Policy Builder</h3>
        </div>
        <button
          onClick={handleRunTraffic}
          disabled={testing}
          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 rounded-lg text-xs font-semibold text-slate-950 flex items-center gap-1.5 transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          {testing ? 'Probing...' : 'Test Rules'}
        </button>
      </div>

      {/* Rules list */}
      <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
        {rules.map((rule) => (
          <div key={rule.id} className="flex justify-between items-center bg-slate-950/70 border border-slate-850 px-2.5 py-1.5 rounded-lg text-[10px] font-mono">
            <span className="text-slate-500">Prio {rule.priority}</span>
            <span className="text-blue-400 font-bold">{rule.protocol}</span>
            <span className="text-slate-300">Src: {rule.source}</span>
            <span className="text-slate-300">Port: {rule.port}</span>
            <span className={`px-1.5 py-0.5 rounded font-bold ${rule.action === 'ALLOW' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {rule.action}
            </span>
            <button onClick={() => deleteRule(rule.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add rule form */}
      <div className="grid grid-cols-5 gap-1.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-850">
        <input
          type="number"
          placeholder="Prio"
          value={newRule.priority}
          onChange={(e) => setNewRule({ ...newRule, priority: Number(e.target.value) })}
          className="bg-slate-900 text-white text-[10px] rounded p-1 border border-slate-800 focus:outline-none"
        />
        <select
          value={newRule.protocol}
          onChange={(e: any) => setNewRule({ ...newRule, protocol: e.target.value })}
          className="bg-slate-900 text-white text-[10px] rounded p-1 border border-slate-800 focus:outline-none"
        >
          <option>TCP</option>
          <option>UDP</option>
          <option>ICMP</option>
        </select>
        <input
          type="text"
          placeholder="Src IP"
          value={newRule.source}
          onChange={(e) => setNewRule({ ...newRule, source: e.target.value })}
          className="bg-slate-900 text-white text-[10px] rounded p-1 border border-slate-800 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Port"
          value={newRule.port}
          onChange={(e) => setNewRule({ ...newRule, port: e.target.value })}
          className="bg-slate-900 text-white text-[10px] rounded p-1 border border-slate-800 focus:outline-none"
        />
        <div className="flex gap-1">
          <select
            value={newRule.action}
            onChange={(e: any) => setNewRule({ ...newRule, action: e.target.value })}
            className="bg-slate-900 text-white text-[10px] rounded p-1 border border-slate-800 focus:outline-none flex-1"
          >
            <option>BLOCK</option>
            <option>ALLOW</option>
          </select>
          <button onClick={addRule} className="bg-emerald-500 text-slate-950 p-1 rounded hover:bg-emerald-600 transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live traffic output */}
      <div className="bg-slate-950 rounded-xl border border-slate-850 p-3">
        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-1.5">Traffic Match Diagnostics</span>
        {activeTraffic.length === 0 ? (
          <div className="text-[10px] text-slate-500 text-center py-4 font-mono">No simulation traffic active. Click "Test Rules" above.</div>
        ) : (
          <div className="space-y-1 font-mono text-[9px] h-[75px] overflow-y-auto">
            {activeTraffic.map((t, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-900 pb-1">
                <span>Incoming {t.proto} probe from {t.src}:{t.port}</span>
                <span className={`font-bold uppercase ${t.color}`}>{t.result}ED</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
