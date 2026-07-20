import React, { useState } from 'react';
import { Lab, UserProgress } from '../types';
import { ArrowLeft, Trophy, Shield, Key, AlertTriangle, Eye, RefreshCw, CheckCircle, ChevronRight, HelpCircle, Server } from 'lucide-react';

interface LabsViewProps {
  labs: Lab[];
  progress: UserProgress;
  onBack: () => void;
  onCompleteLab: (labId: string, points: number) => void;
}

export default function LabsView({ labs, progress, onBack, onCompleteLab }: LabsViewProps) {
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [inputFlag, setInputFlag] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'instructions' | 'hints'>('instructions');

  // PHISHING DETECT LAB WORKSTATE
  const [phishIndicators, setPhishIndicators] = useState({
    sender: false,
    subject: false,
    link: false
  });

  // SQL INJECTION LAB WORKSTATE
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResults, setSqlResults] = useState<{ id: number; username: string; notes: string }[]>([]);
  const [sqlError, setSqlError] = useState('');

  // CAESAR CTF WORKSTATE
  const [caesarShift, setCaesarShift] = useState(0);
  const encryptedCaesar = 'YSHN{YVA_JPWOLY_ZVSCLK_2209}'; // Shuffled ROT19 -> FLAG{ROT_CIPHER_SOLVED_2209}

  // INCIDENT RESPONSE WORKSTATE
  const [processes, setProcesses] = useState([
    { pid: 104, name: 'systemd', status: 'Active', port: '-' },
    { pid: 112, name: 'nginx-http', status: 'Active', port: '80' },
    { pid: 184, name: 'postgres-db', status: 'Active', port: '5432' },
    { pid: 840, name: '/tmp/.sys_daemon', status: 'RUNNING', port: '6667 (C2 Beacon)' }
  ]);

  // FIREWALL RULES LAB STATE
  const [fwRules, setFwRules] = useState<{ port: string; action: 'ALLOW' | 'BLOCK' }[]>([
    { port: '80', action: 'ALLOW' },
    { port: '22', action: 'ALLOW' }
  ]);
  const [fwTestOutput, setFwTestOutput] = useState<string[]>([]);
  const [fwSolved, setFwSolved] = useState(false);

  const activeLab = labs.find((l) => l.id === selectedLabId);
  const isLabCompleted = activeLab ? progress.completedLabs.includes(activeLab.id) : false;

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLab) return;

    if (inputFlag.trim() === activeLab.flag) {
      setSuccessMessage(`✓ EXPLOIT VERIFIED! Points Awarded: +${activeLab.points} PTS`);
      setErrorMessage('');
      onCompleteLab(activeLab.id, activeLab.points);
    } else {
      setErrorMessage('✗ INVALID FLAG ENVELOPE. Inspect the parameters and try again.');
      setSuccessMessage('');
    }
  };

  // 1. Phishing Spotter Action
  const handleSpotElement = (type: 'sender' | 'subject' | 'link') => {
    setPhishIndicators((prev) => {
      const updated = { ...prev, [type]: true };
      if (updated.sender && updated.subject && updated.link) {
        setInputFlag('FLAG{PHISH_SPOTTED_7493}');
      }
      return updated;
    });
  };

  // 2. SQL Injection Action
  const runSQLQuery = () => {
    const query = sqlQuery.trim().toLowerCase();
    setSqlError('');
    setSqlResults([]);

    if (!query) return;

    // Simulate SQL Injection bypass
    if (query.includes("' or '1'='1") || query.includes("' or 1=1") || query.includes("admin' or 'a'='a")) {
      setSqlResults([
        { id: 1, username: 'admin', notes: 'System Admin: FLAG{SQL_INJECT_SUCCESS_8830}' },
        { id: 2, username: 'operator', notes: 'Maintainer log: Keep ports closed' },
        { id: 3, username: 'guest', notes: 'Basic guest visitor permissions' }
      ]);
    } else if (query.includes("'")) {
      setSqlError('SQLITE_ERROR: Unclosed quotation mark near query string syntax "SELECT * FROM users WHERE username = \'' + sqlQuery + '\'"');
    } else {
      // Standard search
      if (query === 'admin') {
        setSqlResults([{ id: 1, username: 'admin', notes: 'System Administrator (Password Protected)' }]);
      } else {
        setSqlError('Query returned 0 records. Try a wider parameters query.');
      }
    }
  };

  // 3. Caesar Cipher ROT Solver
  const getCaesarDecrypted = () => {
    // Standard ROT cipher shifter
    return encryptedCaesar
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base + caesarShift) % 26) + base);
        }
        return char;
      })
      .join('');
  };

  const handleShiftSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCaesarShift(val);
    const decrypted = encryptedCaesar
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base + val) % 26) + base);
        }
        return char;
      })
      .join('');

    if (decrypted === 'FLAG{ROT_CIPHER_SOLVED_2209}') {
      setInputFlag('FLAG{ROT_CIPHER_SOLVED_2209}');
    }
  };

  // 4. Incident Response Action
  const killProcess = (pid: number) => {
    if (pid === 840) {
      setProcesses((prev) => prev.filter((p) => p.pid !== pid));
      setSuccessMessage('✓ C2 Connection terminated! Intrusion isolated.');
      setInputFlag('FLAG{INCIDENT_ISOLATED_8401}');
    }
  };

  // 5. Firewall Rules Action
  const addFWRule = (port: string, action: 'ALLOW' | 'BLOCK') => {
    setFwRules((prev) => [...prev, { port, action }]);
  };

  const testFirewall = () => {
    setFwTestOutput([]);
    // Find rules
    const sshBlocked = fwRules.some((r) => r.port === '22' && r.action === 'BLOCK');
    const dbBlocked = fwRules.some((r) => r.port === '5432' && r.action === 'BLOCK');
    const webAllowed = fwRules.some((r) => r.port === '80' && r.action === 'ALLOW');

    const logs: string[] = [
      'Simulating active packet test stream for network interfaces...',
      'Probe 1: TCP Port 80 (Web Traffic) -> ALLOWED (Passes baseline HTTP rules)',
      sshBlocked
        ? 'Probe 2: TCP Port 22 (SSH Scanner) -> BLOCKED (Successfully isolated SSH attacks)'
        : 'Probe 2: TCP Port 22 (SSH Scanner) -> EXPOSED (Attacker cracked SSH passwords!)',
      dbBlocked
        ? 'Probe 3: TCP Port 5432 (Postgres Leak) -> BLOCKED (Secure database shields)'
        : 'Probe 3: TCP Port 5432 (Postgres Leak) -> EXPOSED (Data database leaks detected!)'
    ];

    setFwTestOutput(logs);
    if (sshBlocked && dbBlocked && webAllowed) {
      setFwSolved(true);
      setInputFlag('FLAG{FIREWALL_HARDENED_9210}');
    }
  };

  // Load interactive lab workbench
  const renderLabWorkbench = () => {
    if (!activeLab) return null;

    switch (activeLab.id) {
      case 'spot-phishing':
        return (
          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 space-y-4">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block font-mono">Simulated Email Client Inbox</span>

            <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 text-xs">
              {/* Header */}
              <div className="bg-slate-950 p-3 border-b border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">From:</span>
                  <button
                    onClick={() => handleSpotElement('sender')}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      phishIndicators.sender ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    admin@m1crosoft-security-portal.com
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <button
                    onClick={() => handleSpotElement('subject')}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      phishIndicators.subject ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    [URGENT] Corporate Credentials update required within 2 hours
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 leading-relaxed text-slate-300 font-sans text-xs">
                <p>Dear Valued Colleague,</p>
                <p>We identified standard database maintenance changes on our authentication gateways. Failure to verify credentials within 2 hours will lead to temporary corporate account lockdowns.</p>
                <div className="py-2">
                  <button
                    onClick={() => handleSpotElement('link')}
                    className={`px-4 py-2 rounded-lg font-mono text-[10px] transition-all font-bold ${
                      phishIndicators.link
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {phishIndicators.link ? 'Target: http://192.168.1.1:8080/reset-pass' : 'Click to Verify Credentials Portal'}
                  </button>
                </div>
                <p>System Administration Desk</p>
              </div>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-slate-500">
              <span>Spot the 3 malicious anomalies (Sender address, subject urgency, bad URL) to reveal flag.</span>
              <span>Found: {Object.values(phishIndicators).filter(Boolean).length} / 3</span>
            </div>
          </div>
        );

      case 'sql-injection-lab':
        return (
          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 space-y-4">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block font-mono">Vulnerable Query Sandbox Form</span>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="SELECT * FROM users WHERE username = '...'"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={runSQLQuery}
                className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Execute
              </button>
            </div>

            {/* Error console panel */}
            {sqlError && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-[10px] font-mono text-rose-400">
                {sqlError}
              </div>
            )}

            {/* Results table representation */}
            {sqlResults.length > 0 && (
              <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden font-mono text-[10px]">
                <div className="grid grid-cols-3 bg-slate-950 px-3 py-1.5 text-slate-500 border-b border-slate-800 uppercase font-bold tracking-wider">
                  <span>ID</span>
                  <span>Username</span>
                  <span>Database Notes</span>
                </div>
                <div className="divide-y divide-slate-850">
                  {sqlResults.map((row) => (
                    <div key={row.id} className="grid grid-cols-3 px-3 py-2 text-emerald-400">
                      <span>{row.id}</span>
                      <span className="font-bold">{row.username}</span>
                      <span className="text-white font-mono break-all">{row.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'caesar-cipher-cracking':
        return (
          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 space-y-4">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block font-mono">Intercepted Encrypted Transmission</span>

            <div className="bg-slate-900 p-3.5 border border-slate-800 rounded-lg text-center font-mono text-amber-400 text-sm tracking-widest">
              {encryptedCaesar}
            </div>

            {/* Decrypted Shift result widget */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Shift sliding rot key:</span>
                <span className="text-cyan-400 font-bold">ROT{caesarShift}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={caesarShift}
                onChange={handleShiftSliderChange}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="bg-slate-900/60 p-3 border border-slate-850 rounded-lg font-mono text-[11px]">
              <span className="text-slate-500 block uppercase font-bold text-[9px] mb-1">Rotated Plaintext Result</span>
              <span className="text-white text-xs tracking-wider font-semibold">{getCaesarDecrypted()}</span>
            </div>
          </div>
        );

      case 'incident-response':
        return (
          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block font-mono">Active Connection Monitors</span>
              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[9px] font-bold font-mono">C2_BEACONING</span>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden text-[10px] font-mono">
              <div className="grid grid-cols-4 bg-slate-950 px-3 py-2 text-slate-500 border-b border-slate-800 uppercase font-bold">
                <span>PID</span>
                <span>Process Name</span>
                <span>Outbound Port</span>
                <span>Network Action</span>
              </div>
              <div className="divide-y divide-slate-850">
                {processes.map((proc) => (
                  <div key={proc.pid} className="grid grid-cols-4 px-3 py-2.5 items-center">
                    <span className="text-slate-400">{proc.pid}</span>
                    <span className={proc.pid === 840 ? 'text-rose-400 font-bold' : 'text-slate-200'}>{proc.name}</span>
                    <span className="text-slate-400">{proc.port}</span>
                    <div>
                      {proc.pid === 840 ? (
                        <button
                          onClick={() => killProcess(proc.pid)}
                          className="px-2 py-0.5 bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold rounded text-[9px] uppercase"
                        >
                          Kill Process
                        </button>
                      ) : (
                        <span className="text-emerald-400">System Safe</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'firewall-builder-lab':
        return (
          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block font-mono">Internal Firewall Controller</span>
              <button
                onClick={testFirewall}
                className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[10px] uppercase"
              >
                Deploy & Test Traffic
              </button>
            </div>

            {/* Quick pre-configured templates */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                onClick={() => addFWRule('22', 'BLOCK')}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-slate-300"
              >
                + Add Rule: BLOCK Port 22 (SSH)
              </button>
              <button
                onClick={() => addFWRule('5432', 'BLOCK')}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-slate-300"
              >
                + Add Rule: BLOCK Port 5432 (DB)
              </button>
            </div>

            {/* Current Policies list */}
            <div className="space-y-1 max-h-[80px] overflow-y-auto font-mono text-[9px]">
              {fwRules.map((rule, i) => (
                <div key={i} className="flex justify-between px-2.5 py-1 bg-slate-900 border border-slate-850 rounded">
                  <span>Match Port: {rule.port}</span>
                  <span className={`font-bold ${rule.action === 'ALLOW' ? 'text-emerald-400' : 'text-rose-500'}`}>{rule.action}</span>
                </div>
              ))}
            </div>

            {/* Firewall output stream console */}
            {fwTestOutput.length > 0 && (
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[10px] space-y-1">
                {fwTestOutput.map((out, i) => (
                  <div key={i} className={out.includes('EXPOSED') ? 'text-rose-400' : 'text-slate-300'}>{out}</div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="labs-root" className="space-y-6">
      {!selectedLabId ? (
        /* CHALLENGE CATALOG SCREEN */
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-900 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Trophy className="w-5.5 h-5.5 text-amber-400 animate-pulse" /> Active Capture The Flag Labs
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tackle simulated penetration tests, spot phishers, and analyze malware connections to earn points and badges.
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-3 py-1.5 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Back to Command Center
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map((lab) => {
              const isCompleted = progress.completedLabs.includes(lab.id);
              return (
                <div
                  key={lab.id}
                  onClick={() => {
                    setSelectedLabId(lab.id);
                    setSuccessMessage('');
                    setErrorMessage('');
                    setInputFlag('');
                    setPhishIndicators({ sender: false, subject: false, link: false });
                    setSqlQuery('');
                    setSqlResults([]);
                    setCaesarShift(0);
                  }}
                  className="p-5 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-900 hover:border-slate-800 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        {lab.category}
                      </span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        lab.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : lab.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {lab.difficulty}
                      </span>
                    </div>

                    <h4 className="text-slate-100 font-bold text-sm mt-2 group-hover:text-cyan-300 transition-colors">
                      {lab.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                      {lab.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-950 pt-4 mt-4 font-mono text-[10px]">
                    <span className="text-cyan-500 font-bold">{lab.points} PTS</span>
                    {isCompleted ? (
                      <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                        ✓ SOLVED
                      </span>
                    ) : (
                      <span className="text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-0.5">
                        Launch Lab <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ACTIVE LAB WORKBENCH SCREEN */
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Back button link header */}
          <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedLabId(null)}
                className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{activeLab?.category}</span>
                <h3 className="font-bold text-slate-200 text-base">{activeLab?.title}</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-cyan-400">{activeLab?.points} PTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left side: instructions and details */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex gap-2 border-b border-slate-850 pb-2">
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`flex-1 text-center py-1 rounded text-xs font-semibold ${
                      activeTab === 'instructions' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    Briefing Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('hints')}
                    className={`flex-1 text-center py-1 rounded text-xs font-semibold ${
                      activeTab === 'hints' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    Get Clues ({activeLab?.hints.length})
                  </button>
                </div>

                {activeTab === 'instructions' ? (
                  <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[11px]">
                      <span className="font-bold text-rose-400 block mb-0.5">System Vulnerability:</span>
                      <span className="text-slate-400 font-mono">{activeLab?.vulnerabilityDescription}</span>
                    </div>

                    <ol className="list-decimal pl-4 space-y-2 text-xs text-slate-300 font-sans">
                      {activeLab?.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-[10px]">
                    {activeLab?.hints.map((hint, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-2.5 rounded border border-slate-900 text-slate-400 leading-relaxed">
                        💡 <b>Clue {idx + 1}:</b> {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: visual simulator and flag submit */}
            <div className="md:col-span-3 space-y-6">
              {/* Load matching workbench workspace */}
              {renderLabWorkbench()}

              {/* CTF Flag Submit Panel */}
              <div className="p-5 bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
                  <Key className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                  <h4 className="font-semibold text-slate-100 text-xs uppercase font-mono tracking-wider">CTF Flag Submission</h4>
                </div>

                <form onSubmit={handleFlagSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={inputFlag}
                    onChange={(e) => setInputFlag(e.target.value)}
                    placeholder="Enter decrypted flag e.g. FLAG{...}"
                    disabled={isLabCompleted}
                    className="flex-1 bg-slate-950/80 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isLabCompleted}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs transition-all font-mono"
                  >
                    Submit Flag
                  </button>
                </form>

                {errorMessage && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-xl font-mono text-[10px] leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                {(successMessage || isLabCompleted) && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-xl font-mono text-[10px] leading-relaxed">
                    {isLabCompleted ? '✓ CHALLENGE COMPLETED SUCCESSFULLY! Earned points saved to profile catalog.' : successMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
