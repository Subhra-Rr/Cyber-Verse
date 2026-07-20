import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Layers, Shield, Network, FileText, Clipboard, HelpCircle, 
  Terminal, ShieldCheck, Check, Globe
} from 'lucide-react';

interface CommandCheat {
  tool: string;
  command: string;
  purpose: string;
  args: { [arg: string]: string };
}

interface PortSpec {
  port: number;
  protocol: string;
  service: string;
  vulnerability: string;
  secureAlt?: string;
}

const nmapCommands: CommandCheat[] = [
  {
    tool: 'Nmap Port Scanner',
    command: 'nmap -sC -sV -O <target_ip>',
    purpose: 'Standard network discovery scanning with default script engine checking, version querying, and OS footprinting.',
    args: {
      '-sC': 'Runs default diagnostic scripts to test for basic CVE vulnerabilities.',
      '-sV': 'Probes open ports to determine exact running service brand and version.',
      '-O': 'Attempts to detect host OS kernel signatures.'
    }
  },
  {
    tool: 'Nmap Stealth scan',
    command: 'nmap -sS -Pn -f <target_ip>',
    purpose: 'Stealth SYN scanning, avoiding full TCP handshakes. Useful for bypassing older stateful packet filters.',
    args: {
      '-sS': 'Runs a stealth semi-open TCP SYN packet scan.',
      '-Pn': 'Treats all hosts as online; completely skips ping host discovery.',
      '-f': 'Fragments packets into tiny blocks to evade simple signature IDS checks.'
    }
  }
];

const opensslCommands: CommandCheat[] = [
  {
    tool: 'OpenSSL Symmetric Crypt',
    command: 'openssl enc -aes-256-cbc -salt -in file.txt -out file.enc',
    purpose: 'Encrypts a target document using high-entropy AES-256 in Cipher Block Chaining (CBC) mode.',
    args: {
      'enc': 'Performs encryption or decryption symmetric operations.',
      '-aes-256-cbc': 'Applies the AES 256-bit CBC encryption algorithm.',
      '-salt': 'Appends a random salt to the secret key prior to hashing.'
    }
  },
  {
    tool: 'OpenSSL Cert generate',
    command: 'openssl req -newkey rsa:2048 -nodes -keyout private.key -x509 -days 365 -out certificate.crt',
    purpose: 'Generates a self-signed X.509 SSL certificate and matching private key for local development perimeters.',
    args: {
      '-newkey rsa:2048': 'Generates a new RSA 2048-bit administration key.',
      '-nodes': 'Saves the private certificate key without requiring a passphrase.',
      '-x509': 'Outputs a self-signed X.509 standard container.'
    }
  }
];

const portsData: PortSpec[] = [
  { port: 20, protocol: 'TCP', service: 'FTP Data', vulnerability: 'Clear-text transfers, vulnerable to packet sniffing, anonymous authentication leaks.', secureAlt: 'SFTP (Port 22)' },
  { port: 21, protocol: 'TCP', service: 'FTP Control', vulnerability: 'Credential interception, anonymous login exploits.', secureAlt: 'SFTP (Port 22)' },
  { port: 22, protocol: 'TCP', service: 'SSH', vulnerability: 'Brute-force credential audits, unpatched client software exploits.', secureAlt: 'Key-Based Auth Only' },
  { port: 23, protocol: 'TCP', service: 'Telnet', vulnerability: 'Completely unencrypted shell terminal. Stolen passwords via packet wire sniffing.', secureAlt: 'SSH (Port 22)' },
  { port: 25, protocol: 'TCP', service: 'SMTP', vulnerability: 'Email spoofing, spam amplification relays.', secureAlt: 'SMTPS (Port 465)' },
  { port: 53, protocol: 'UDP/TCP', service: 'DNS', vulnerability: 'DNS Cache Poisoning, DNS amplification attacks, zone transfer leaks.', secureAlt: 'DNS over HTTPS (DoH)' },
  { port: 80, protocol: 'TCP', service: 'HTTP', vulnerability: 'Insecure web traffic. Susceptible to session hijacking, MitM, and payload tampering.', secureAlt: 'HTTPS (Port 443)' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', vulnerability: 'Weak cipher configurations, heartbleed-style buffer overflows.', secureAlt: 'TLS 1.3 enforced' },
  { port: 3389, protocol: 'TCP', service: 'RDP (Windows)', vulnerability: 'BlueKeep remote code execution, brute-force admin session queries.', secureAlt: 'VPN Tunnel + MFA' }
];

const glossaryAcronyms = [
  { acronym: 'CIA Triad', expanded: 'Confidentiality, Integrity, Availability', definition: 'The core security objective model safeguarding access controls (Confidentiality), record edits (Integrity), and system uptime (Availability).' },
  { acronym: 'SIEM', expanded: 'Security Information and Event Management', definition: 'A centralized enterprise server platform that aggregates logs and security alerts across firewalls, routers, and endpoints in real-time.' },
  { acronym: 'SOC', expanded: 'Security Operations Center', definition: 'A dedicated command center where cybersecurity analysts actively monitor, triage, and investigate system incidents.' },
  { acronym: 'DLP', expanded: 'Data Loss Prevention', definition: 'System software rules detecting and blocking unencrypted exfiltration of intellectual files (such as blocking USB mass storage devices).' },
  { acronym: 'WAF', expanded: 'Web Application Firewall', definition: 'A Layer 7 security device that inspects HTTP headers and payloads to filter malicious scripts (such as SQL Injection).' },
  { acronym: 'APT', expanded: 'Advanced Persistent Threat', definition: 'A highly skilled state-sponsored hacking collective executing quiet, prolonged operations to breach networks.' },
  { acronym: 'CVE', expanded: 'Common Vulnerabilities and Exposures', definition: 'A public database of standardized, cataloged security flaws and software vulnerabilities.' },
  { acronym: 'CVSS', expanded: 'Common Vulnerability Scoring System', definition: 'A standardized numeric metric (0 to 10) rating the severity and ease of exploitation of a specific software flaw.' },
  { acronym: 'HSM', expanded: 'Hardware Security Module', definition: 'A specialized physical processor cage used to generate, store, and execute cryptographic keys in high-security enclaves.' }
];

export default function ResourceCenter() {
  const [activeTab, setActiveTab] = useState<'cheat' | 'ports' | 'glossary'>('cheat');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  // Filter Ports
  const filteredPorts = useMemo(() => {
    if (!searchQuery.trim()) return portsData;
    const query = searchQuery.toLowerCase();
    return portsData.filter(p => 
      p.port.toString().includes(query) || 
      p.service.toLowerCase().includes(query) ||
      p.vulnerability.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Filter Glossary
  const filteredGlossary = useMemo(() => {
    if (!searchQuery.trim()) return glossaryAcronyms;
    const query = searchQuery.toLowerCase();
    return glossaryAcronyms.filter(g => 
      g.acronym.toLowerCase().includes(query) || 
      g.expanded.toLowerCase().includes(query) ||
      g.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div id="resource-center-root" className="space-y-6">
      {/* Header Panel */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5.5 h-5.5 text-cyan-400" /> Administrative Resource Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access secure offline command lists, port security specifications, and cybersecurity acronym glossaries instantly.
          </p>
        </div>

        {/* Global Search and Tab switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {activeTab !== 'cheat' && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={activeTab === 'ports' ? 'Search port, protocol, service...' : 'Search acronym, definition...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full sm:w-56 font-mono"
              />
            </div>
          )}

          <div className="bg-slate-950 p-1 border border-slate-900 rounded-xl flex font-mono text-[10px]">
            <button
              onClick={() => { setActiveTab('cheat'); setSearchQuery(''); }}
              className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                activeTab === 'cheat' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Cheat Sheets
            </button>
            <button
              onClick={() => { setActiveTab('ports'); setSearchQuery(''); }}
              className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                activeTab === 'ports' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Network className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Ports DB
            </button>
            <button
              onClick={() => { setActiveTab('glossary'); setSearchQuery(''); }}
              className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                activeTab === 'glossary' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Glossary
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Render blocks */}
      {activeTab === 'cheat' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nmap Column */}
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative space-y-4">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" /> Nmap Network Exploration commands
            </span>

            <div className="space-y-4">
              {nmapCommands.map((cmd, i) => (
                <div key={i} className="bg-slate-950/80 p-4 border border-slate-900 rounded-xl space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-2">
                    <strong className="text-cyan-400 text-xs block">{cmd.tool}</strong>
                    <button
                      onClick={() => handleCopyCommand(cmd.command)}
                      className={`px-2 py-1 border rounded text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        copiedCmd === cmd.command 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {copiedCmd === cmd.command ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                      {copiedCmd === cmd.command ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <code className="block bg-slate-900 p-2.5 border border-slate-850 rounded text-emerald-400 font-bold select-all overflow-x-auto text-[10px]">
                    {cmd.command}
                  </code>

                  <p className="text-slate-400 leading-relaxed font-sans text-xs">
                    {cmd.purpose}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-900 pt-2.5 mt-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Arguments Decoded</span>
                    {Object.entries(cmd.args).map(([flag, desc], idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-cyan-400 font-bold shrink-0">{flag}:</span>
                        <span className="text-slate-400 text-[10px] leading-relaxed font-sans">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OpenSSL Symmetric columns */}
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative space-y-4">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-violet-400" /> OpenSSL Cryptographic commands
            </span>

            <div className="space-y-4">
              {opensslCommands.map((cmd, i) => (
                <div key={i} className="bg-slate-950/80 p-4 border border-slate-900 rounded-xl space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-start gap-2 border-b border-slate-900 pb-2">
                    <strong className="text-violet-400 text-xs block">{cmd.tool}</strong>
                    <button
                      onClick={() => handleCopyCommand(cmd.command)}
                      className={`px-2 py-1 border rounded text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        copiedCmd === cmd.command 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {copiedCmd === cmd.command ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                      {copiedCmd === cmd.command ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <code className="block bg-slate-900 p-2.5 border border-slate-850 rounded text-emerald-400 font-bold select-all overflow-x-auto text-[10px]">
                    {cmd.command}
                  </code>

                  <p className="text-slate-400 leading-relaxed font-sans text-xs">
                    {cmd.purpose}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-900 pt-2.5 mt-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Arguments Decoded</span>
                    {Object.entries(cmd.args).map(([flag, desc], idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-violet-400 font-bold shrink-0">{flag}:</span>
                        <span className="text-slate-400 text-[10px] leading-relaxed font-sans">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ports' && (
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500" />

          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-4">
            Security Ports & Protocol vulnerabilities database
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] text-slate-400 border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-[9px] uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Port</th>
                  <th className="py-2.5 px-3">Protocol</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Default Security Flaw</th>
                  <th className="py-2.5 px-3">Hardened alternative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {filteredPorts.length > 0 ? (
                  filteredPorts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-3 text-cyan-400 font-bold">#{p.port}</td>
                      <td className="py-3 px-3 text-slate-500">{p.protocol}</td>
                      <td className="py-3 px-3 text-slate-200">{p.service}</td>
                      <td className="py-3 px-3 text-rose-400/95 leading-relaxed font-sans text-xs max-w-sm">{p.vulnerability}</td>
                      <td className="py-3 px-3 text-emerald-400 font-semibold">{p.secureAlt || 'None required'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-600 font-mono text-xs">
                      No matching diagnostic ports detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'glossary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGlossary.length > 0 ? (
            filteredGlossary.map((g, i) => (
              <div 
                key={i} 
                className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl relative hover:border-slate-800 transition-all space-y-2.5"
              >
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <strong className="text-cyan-400 font-mono text-sm uppercase tracking-wide">{g.acronym}</strong>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Spec check</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-semibold text-slate-300 block">{g.expanded}</span>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-sans">{g.definition}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-600 font-mono text-xs">
              No vocabulary terms match your search filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
