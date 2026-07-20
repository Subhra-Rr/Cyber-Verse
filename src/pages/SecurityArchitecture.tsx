import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Server, Network, Layers, Users, Key, AlertOctagon, Info, Play, Check, 
  HelpCircle, Eye, RefreshCw, Cpu, Landmark, HeartPulse, Cloud, Activity
} from 'lucide-react';

interface ComponentSpec {
  name: string;
  role: string;
  vulnerability: string;
  hardening: string;
}

interface ArchitectureModel {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  components: { [key: string]: ComponentSpec };
  attackScenario: {
    name: string;
    description: string;
    attacker: string;
    vulnerablePoint: string;
    mitigationNode: string;
  };
}

const architectures: ArchitectureModel[] = [
  {
    id: 'dmz',
    name: 'Secure Perimeter (DMZ)',
    icon: Shield,
    description: 'Traditional defense-in-depth network segment isolating public web endpoints from the sensitive core database network.',
    components: {
      waf: {
        name: 'Web Application Firewall (WAF)',
        role: 'Inspects Layer 7 HTTP/S headers and payloads to filter malicious scripts (SQLi, XSS).',
        vulnerability: 'Signature bypasses via custom encodings, zero-day CVE logic errors.',
        hardening: 'Configure OWASP Core Rule Set, enable aggressive rate-limiting, restrict allowed HTTP request methods.'
      },
      firewall_ext: {
        name: 'Exterior Firewall',
        role: 'Filters incoming traffic on Layers 3/4. Only allows ports 80 (HTTP) and 443 (HTTPS) through to the DMZ.',
        vulnerability: 'Misconfiguration opening unwanted diagnostic ports (e.g. SSH/Telnet).',
        hardening: 'Implement strict default-deny policies, log all rejected packets, perform weekly rules validation.'
      },
      proxy: {
        name: 'Reverse Proxy & Load Balancer',
        role: 'Terminates TLS connection sessions, distributes backend payloads, and hides private server IP maps.',
        vulnerability: 'HTTP request smuggling, header overflow vulnerabilities.',
        hardening: 'Disable weak cipher profiles, mandate TLS 1.3 protocol usage, hide proxy server brand signature tags.'
      },
      firewall_int: {
        name: 'Interior Firewall',
        role: 'Restricts DMZ servers from initiating connections to the private internal DB network. Only allows DB query ports (e.g., 5432).',
        vulnerability: 'Over-permissive policies allowing general subnet-to-subnet administration tunnels.',
        hardening: 'Strictly white-list connection paths by exact DB-client IP addresses and database system ports.'
      },
      database: {
        name: 'Internal Database Server',
        role: 'Stores highly sensitive customer, financial, or core configuration state records.',
        vulnerability: 'Unpatched database engine CVEs, clear-text stored credentials, SQL injection.',
        hardening: 'Enforce AES-256 transparent data encryption (TDE), audit database logs, enforce strict RBAC schemas.'
      }
    },
    attackScenario: {
      name: 'SQL Injection Payload Bypass',
      description: 'An attacker attempts to retrieve master database rows by injecting a malicious SQL union statement in a request form.',
      attacker: 'Internet Client',
      vulnerablePoint: 'Database Server',
      mitigationNode: 'WAF Guard'
    }
  },
  {
    id: 'zerotrust',
    name: 'Zero Trust (ZTNA)',
    icon: Key,
    description: 'Modern access standard requiring complete, continuous verification of identity and device posture before opening connection resources.',
    components: {
      identity: {
        name: 'Identity Provider (IdP) & MFA',
        role: 'Authenticates system identities using passwords, FIDO2 security keys, and bio traits.',
        vulnerability: 'SIM-swapping bypasses on SMS authentication tokens, MFA exhaustion prompt fatigue.',
        hardening: 'Mandate hardware-backed FIDO2 security keys, configure context-aware risk scores.'
      },
      pdp: {
        name: 'Policy Decision Point (PDP)',
        role: 'Analyzes user credentials, location telemetry, device security posture, and requests to grant or deny access.',
        vulnerability: 'Logic gaps in access policy rules, compromised administrator credentials.',
        hardening: 'Integrate real-time EDR signal feeds, enforce strict least-privilege access rules.'
      },
      pep: {
        name: 'Policy Enforcement Point (PEP)',
        role: 'Acts as the gateway firewall that locks connection requests until PDP issues a signed access token.',
        vulnerability: 'Bypassing proxy configurations if routing rules are incomplete.',
        hardening: 'Ensure all networks require cryptographic authentication, completely block open ports.'
      },
      isolated_app: {
        name: 'Segmented Microservices',
        role: 'Isolated, sandboxed runtime environments serving single client API modules.',
        vulnerability: 'Privilege escalation to nearby host containers.',
        hardening: 'Configure strict mTLS handshakes between microservices, isolate cluster network paths.'
      }
    },
    attackScenario: {
      name: 'Stolen Credentials Intrusion',
      description: 'An attacker attempts to access financial services using a stolen system administrator username and password.',
      attacker: 'Remote Device',
      vulnerablePoint: 'Segmented Microservices',
      mitigationNode: 'IdP & MFA'
    }
  },
  {
    id: 'bank',
    name: 'Banking PCI-DSS Ledger',
    icon: Landmark,
    description: 'High-security tokenized network designed to shield raw transaction records and primary credit cards from exposure.',
    components: {
      api_gateway: {
        name: 'Secure API Gateway',
        role: 'Processes user requests, checks API keys, and routes secure transaction tokens.',
        vulnerability: 'Broken Object Level Authorization (BOLA), insufficient rate limits.',
        hardening: 'Validate all JWT session structures, configure rate limit triggers by IP and user ID.'
      },
      tokenizer: {
        name: 'Tokenization Engine',
        role: 'Translates sensitive primary credit account numbers (PAN) into random safe surrogate tokens.',
        vulnerability: 'Reversible weak generation algorithms.',
        hardening: 'Generate tokens using high-entropy cryptographic algorithms (HMAC-SHA256).'
      },
      hsm: {
        name: 'Hardware Security Module (HSM)',
        role: 'Physical server cage hosting cryptographic key decryption actions away from system memory.',
        vulnerability: 'Physical access compromise, side-channel timing analysis attacks.',
        hardening: 'Enforce dual-administrator custody configurations, store HSM files in secure racks.'
      },
      vault: {
        name: 'PCI Encrypted DB Vault',
        role: 'Isolated vault storing actual card records, encrypted using HSM keys.',
        vulnerability: 'Missing encryption on raw logical database backup files.',
        hardening: 'Always encrypt backups with public-key schemas, isolate vault networks from open subnets.'
      }
    },
    attackScenario: {
      name: 'Credit Card Database Theft',
      description: 'An attacker attempts to access the database vault to scrape unencrypted credit card details.',
      attacker: 'Outer Web Service',
      vulnerablePoint: 'PCI Encrypted DB Vault',
      mitigationNode: 'Tokenization Engine'
    }
  }
];

export default function SecurityArchitecture() {
  const [selectedArch, setSelectedArch] = useState<ArchitectureModel>(architectures[0]);
  const [selectedComponentKey, setSelectedComponentKey] = useState<string | null>(null);
  const [simulationState, setSimulationState] = useState<'idle' | 'good' | 'attack'>('idle');

  const selectedComp = selectedComponentKey ? selectedArch.components[selectedComponentKey] : null;

  const handleSimulate = (state: 'good' | 'attack') => {
    setSimulationState(state);
    setTimeout(() => {
      setSimulationState('idle');
    }, 4000);
  };

  return (
    <div id="architecture-root" className="space-y-6">
      {/* Header Panel */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5.5 h-5.5 text-cyan-400" /> Security Architecture & System Design
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore secure enterprise layouts and cloud topologies. Analyze detailed components, inspect vulnerabilities, and simulate real traffic flow behavior to examine packet filtering defense mechanics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Side Architecture Selector Rail */}
        <div className="xl:col-span-1 space-y-3">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Architecture Templates</span>
          <div className="space-y-1">
            {architectures.map((arch) => {
              const Icon = arch.icon;
              const isSelected = selectedArch.id === arch.id;
              return (
                <button
                  key={arch.id}
                  onClick={() => {
                    setSelectedArch(arch);
                    setSelectedComponentKey(null);
                    setSimulationState('idle');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <div>
                    <span className="block leading-none">{arch.name}</span>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 block">Active configuration</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick simulation controls card */}
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl space-y-3 font-mono text-[10px]">
            <span className="text-slate-400 font-bold block border-b border-slate-900 pb-2 uppercase tracking-wide">
              Live Flow Scripter
            </span>
            <p className="text-slate-500 leading-normal">
              Inject connection packets to visualize defensive filters.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleSimulate('good')}
                disabled={simulationState !== 'idle'}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-500 text-slate-950 font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Simulate Regular User
              </button>
              <button
                onClick={() => handleSimulate('attack')}
                disabled={simulationState !== 'idle'}
                className="w-full py-2 bg-rose-500 hover:bg-rose-400 disabled:bg-slate-900 disabled:text-slate-500 text-slate-950 font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" /> Inject Attack Offense
              </button>
            </div>
          </div>
        </div>

        {/* Central Visualization Stage (col-span-2) */}
        <div className="xl:col-span-2 bg-slate-950/80 border border-slate-900 p-5 rounded-2xl relative flex flex-col justify-between min-h-[420px]">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

          <div>
            <div className="flex justify-between items-start border-b border-slate-900 pb-3 mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> Network Stage Visualizer
                </span>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {selectedArch.description} Click components to inspect internal spec files.
                </p>
              </div>
            </div>

            {/* Render Custom Vector Layout Diagrams based on Active selection */}
            <div className="w-full bg-slate-950 rounded-xl border border-slate-900 p-2 flex justify-center items-center overflow-hidden min-h-[280px]">
              {selectedArch.id === 'dmz' && (
                <div className="relative w-full max-w-lg h-60 flex justify-between items-center px-4">
                  {/* Connectors lines with pulsing state */}
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900 -z-10" />

                  {/* Flowing animated dots */}
                  {simulationState === 'good' && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-flow-dmz shadow-[0_0_8px_rgba(52,211,153,0.8)] absolute" />
                    </div>
                  )}
                  {simulationState === 'attack' && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-flow-dmz-attack shadow-[0_0_8px_rgba(244,63,94,0.8)] absolute" />
                    </div>
                  )}

                  {/* External Network */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 text-center">Web Clients</span>
                  </div>

                  {/* Firewall Ext Pin */}
                  <button
                    onClick={() => setSelectedComponentKey('firewall_ext')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'firewall_ext' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-orange-400 ${
                      selectedComponentKey === 'firewall_ext' ? 'border-orange-400' : 'border-orange-500/30 hover:border-orange-500'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">Ext FW</span>
                  </button>

                  {/* WAF Pin */}
                  <button
                    onClick={() => setSelectedComponentKey('waf')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'waf' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-cyan-400 relative ${
                      selectedComponentKey === 'waf' ? 'border-cyan-400' : 'border-cyan-500/30 hover:border-cyan-500'
                    }`}>
                      <Shield className="w-5 h-5" />
                      {simulationState === 'attack' && (
                        <div className="absolute inset-0 bg-rose-500/20 border-2 border-rose-500 rounded-xl animate-ping" />
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">WAF Guard</span>
                  </button>

                  {/* Proxy Pin */}
                  <button
                    onClick={() => setSelectedComponentKey('proxy')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'proxy' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-sky-400 ${
                      selectedComponentKey === 'proxy' ? 'border-sky-400' : 'border-sky-500/30 hover:border-sky-500'
                    }`}>
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">Rev Proxy</span>
                  </button>

                  {/* Firewall Int Pin */}
                  <button
                    onClick={() => setSelectedComponentKey('firewall_int')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'firewall_int' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-orange-400 ${
                      selectedComponentKey === 'firewall_int' ? 'border-orange-400' : 'border-orange-500/30 hover:border-orange-500'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">Int FW</span>
                  </button>

                  {/* Database Pin */}
                  <button
                    onClick={() => setSelectedComponentKey('database')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'database' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-violet-400 ${
                      selectedComponentKey === 'database' ? 'border-violet-400' : 'border-violet-500/30 hover:border-violet-500'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">Core DB</span>
                  </button>
                </div>
              )}

              {selectedArch.id === 'zerotrust' && (
                <div className="relative w-full max-w-lg h-60 flex justify-between items-center px-4">
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900 -z-10" />

                  {/* Flowing animated dots */}
                  {simulationState === 'good' && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-flow-zt shadow-[0_0_8px_rgba(52,211,153,0.8)] absolute" />
                    </div>
                  )}
                  {simulationState === 'attack' && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-flow-zt-attack shadow-[0_0_8px_rgba(244,63,94,0.8)] absolute" />
                    </div>
                  )}

                  {/* Remote user */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 text-center">Remote client</span>
                  </div>

                  {/* Identity Provider */}
                  <button
                    onClick={() => setSelectedComponentKey('identity')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'identity' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-emerald-400 relative ${
                      selectedComponentKey === 'identity' ? 'border-emerald-400' : 'border-emerald-500/30 hover:border-emerald-500'
                    }`}>
                      <Key className="w-5 h-5" />
                      {simulationState === 'attack' && (
                        <div className="absolute inset-0 bg-rose-500/20 border-2 border-rose-500 rounded-xl animate-ping" />
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">IdP & MFA</span>
                  </button>

                  {/* PDP Controller */}
                  <button
                    onClick={() => setSelectedComponentKey('pdp')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'pdp' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-cyan-400 ${
                      selectedComponentKey === 'pdp' ? 'border-cyan-400' : 'border-cyan-500/30 hover:border-cyan-500'
                    }`}>
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">PDP policy</span>
                  </button>

                  {/* PEP Gateway */}
                  <button
                    onClick={() => setSelectedComponentKey('pep')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'pep' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-sky-400 ${
                      selectedComponentKey === 'pep' ? 'border-sky-400' : 'border-sky-500/30 hover:border-sky-500'
                    }`}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">PEP gateway</span>
                  </button>

                  {/* Segmented Apps */}
                  <button
                    onClick={() => setSelectedComponentKey('isolated_app')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'isolated_app' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-violet-400 ${
                      selectedComponentKey === 'isolated_app' ? 'border-violet-400' : 'border-violet-500/30 hover:border-violet-500'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">App Segment</span>
                  </button>
                </div>
              )}

              {selectedArch.id === 'bank' && (
                <div className="relative w-full max-w-lg h-60 flex justify-between items-center px-4">
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900 -z-10" />

                  {/* Flowing animated dots */}
                  {simulationState === 'good' && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-flow-bank shadow-[0_0_8px_rgba(52,211,153,0.8)] absolute" />
                    </div>
                  )}
                  {simulationState === 'attack' && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-flow-bank-attack shadow-[0_0_8px_rgba(244,63,94,0.8)] absolute" />
                    </div>
                  )}

                  {/* Client UI */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 text-center">App Client</span>
                  </div>

                  {/* API Gateway */}
                  <button
                    onClick={() => setSelectedComponentKey('api_gateway')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'api_gateway' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-cyan-400 ${
                      selectedComponentKey === 'api_gateway' ? 'border-cyan-400' : 'border-cyan-500/30 hover:border-cyan-500'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">API Gateway</span>
                  </button>

                  {/* Tokenizer */}
                  <button
                    onClick={() => setSelectedComponentKey('tokenizer')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'tokenizer' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-sky-400 relative ${
                      selectedComponentKey === 'tokenizer' ? 'border-sky-400' : 'border-sky-500/30 hover:border-sky-500'
                    }`}>
                      <RefreshCw className="w-5 h-5" />
                      {simulationState === 'attack' && (
                        <div className="absolute inset-0 bg-rose-500/20 border-2 border-rose-500 rounded-xl animate-ping" />
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">Tokenizer</span>
                  </button>

                  {/* HSM Modules */}
                  <button
                    onClick={() => setSelectedComponentKey('hsm')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'hsm' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-emerald-400 ${
                      selectedComponentKey === 'hsm' ? 'border-emerald-400' : 'border-emerald-500/30 hover:border-emerald-500'
                    }`}>
                      <Key className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">HSM Module</span>
                  </button>

                  {/* Database Vault */}
                  <button
                    onClick={() => setSelectedComponentKey('vault')}
                    className={`flex flex-col items-center gap-2 transition-transform duration-300 ${selectedComponentKey === 'vault' ? 'scale-110' : ''}`}
                  >
                    <div className={`w-12 h-12 bg-slate-900 border-2 rounded-xl flex items-center justify-center text-violet-400 ${
                      selectedComponentKey === 'vault' ? 'border-violet-400' : 'border-violet-500/30 hover:border-violet-500'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 text-center">DB Vault</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick instructions indicator footer */}
          <div className="bg-slate-950/60 p-4 border border-slate-900 rounded-xl text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> Choose any pin above to load technical details.
            </span>
            <div className="flex gap-4">
              <span>● Exterior Boundary (Untrusted)</span>
              <span>● Core Segment (Trusted Enclave)</span>
            </div>
          </div>
        </div>

        {/* Selected Component Inspection Panel - Right Column (Col-span-1) */}
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

          {selectedComp ? (
            <div className="space-y-4">
              {/* Component Header */}
              <div className="border-b border-slate-900 pb-3">
                <span className="text-[8px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Active Asset Inspection
                </span>
                <h3 className="font-bold text-slate-100 text-sm mt-1.5">{selectedComp.name}</h3>
              </div>

              {/* Specification data blocks */}
              <div className="space-y-4 text-xs font-sans text-slate-400 leading-relaxed">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Operational Role</span>
                  <p>{selectedComp.role}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">Common Vulnerabilities</span>
                  <p className="text-rose-400/90 bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg font-mono text-[10px]">
                    {selectedComp.vulnerability}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">Hardening Benchmarks</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedComp.hardening.split(', ').map((rule, idx) => (
                      <li key={idx} className="marker:text-emerald-400">{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-sans text-xs text-slate-400 leading-normal">
              <div className="border-b border-slate-900 pb-3">
                <span className="text-[8px] font-mono font-bold bg-violet-500/10 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Topological Analysis
                </span>
                <h3 className="font-bold text-slate-100 text-sm mt-1.5">No component selected</h3>
              </div>

              <p>
                Each system node in a digital enterprise carries distinct vulnerabilities. Click on any of the system blocks in the visual layout panel to pull up:
              </p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[10px] text-slate-500">
                <li>Operational boundaries</li>
                <li>Vulnerabilities & Weaknesses</li>
                <li>Harden compliance steps</li>
              </ul>

              {/* Scenario overview */}
              <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2 font-mono text-[10px] mt-4">
                <span className="text-cyan-400 font-bold block border-b border-slate-900 pb-1.5 uppercase">
                  ACTIVE MITIGATION DRILL
                </span>
                <div>
                  <span className="text-slate-500">SCENARIO:</span> <span className="text-slate-300">{selectedArch.attackScenario.name}</span>
                </div>
                <p className="text-slate-500 leading-normal mt-1.5">
                  {selectedArch.attackScenario.description}
                </p>
                <div className="border-t border-slate-900 pt-1.5 mt-1.5 space-y-1">
                  <div>
                    <span className="text-slate-500">Attacker Source:</span> <span className="text-slate-400">{selectedArch.attackScenario.attacker}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">At-Risk Target:</span> <span className="text-slate-400">{selectedArch.attackScenario.vulnerablePoint}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Defensive Shield:</span> <span className="text-emerald-400 font-bold">{selectedArch.attackScenario.mitigationNode}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
