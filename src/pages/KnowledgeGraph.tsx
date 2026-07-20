import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Search, Share2, ZoomIn, ZoomOut, HelpCircle, ArrowRight, BookOpen, 
  Settings, ShieldAlert, ShieldCheck, Key, Cpu, Compass, LayoutGrid, Award
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  category: 'Concepts' | 'Networking' | 'Protocols' | 'Attacks' | 'Defenses' | 'Tools' | 'Frameworks';
  description: string;
  connections: string[]; // Related node IDs
  details: {
    definition: string;
    vulnerabilities?: string;
    mitigation?: string;
    cves?: string;
    standard?: string;
  };
}

const graphNodes: GraphNode[] = [
  {
    id: 'cybersec',
    label: 'Cyber Security',
    category: 'Concepts',
    description: 'The practice of protecting systems, networks, and programs from digital attacks.',
    connections: ['networking', 'attacks', 'defenses', 'frameworks'],
    details: {
      definition: 'Comprehensive defense-in-depth domain ensuring Confidentiality, Integrity, and Availability (CIA Triad) of physical, software, and human endpoints.'
    }
  },
  {
    id: 'networking',
    label: 'Networking',
    category: 'Networking',
    description: 'Protocols and communication lines governing local and outer internet exchanges.',
    connections: ['cybersec', 'protocols', 'attacks'],
    details: {
      definition: 'Layered communication structures allowing systems to exchange frames, packets, segments, and application sockets seamlessly.',
      vulnerabilities: 'ARP Spoofing, DNS poisoning, BGP hijacking.'
    }
  },
  {
    id: 'protocols',
    label: 'Protocols',
    category: 'Networking',
    description: 'Cryptographic or clear-text communications standards (HTTP, TCP, TLS, SSH).',
    connections: ['networking', 'tls', 'ssh'],
    details: {
      definition: 'Standardized operational procedures detailing headers, payload sizes, packet handshakes, and transmission confirmation logic.',
      vulnerabilities: 'Cleartext interception of telnet/http payloads, handshake DDoS loops.'
    }
  },
  {
    id: 'tls',
    label: 'TLS / HTTPS',
    category: 'Networking',
    description: 'Secure, encrypted tunnel wrapping application-layer payloads.',
    connections: ['protocols', 'defenses', 'cryptography'],
    details: {
      definition: 'Transport Layer Security using asymmetric encryption for key handshake and symmetric encryption for fast ongoing communication cycles.',
      standard: 'RFC 8446 (TLS 1.3)'
    }
  },
  {
    id: 'ssh',
    label: 'SSH Protocol',
    category: 'Networking',
    description: 'Secure remote command shell interface for administrative terminal sessions.',
    connections: ['protocols', 'defenses'],
    details: {
      definition: 'Cryptographic network protocol for operating network services securely over an unsecured network, incorporating public key authorization.',
      standard: 'RFC 4251'
    }
  },
  {
    id: 'attacks',
    label: 'Attacks',
    category: 'Attacks',
    description: 'Exploitation vectors targeting hardware, configuration, or software design flaws.',
    connections: ['cybersec', 'networking', 'ddos', 'phishing', 'ransomware', 'sqli'],
    details: {
      definition: 'Offensive maneuvers deployed by unauthorized actors to breach compartmentalized boundaries, escalate privileges, or corrupt assets.'
    }
  },
  {
    id: 'ddos',
    label: 'DDoS Floods',
    category: 'Attacks',
    description: 'Distributed denial of service exhausting bandwidth, memory, or CPU thresholds.',
    connections: ['attacks', 'defenses'],
    details: {
      definition: 'Coordinated botnet attacks sending massive packet waves (SYN floods, UDP blasts, DNS amplification) to render routers unresponsive.',
      mitigation: 'Scrubbing centers, rate limits, edge CDN caching.'
    }
  },
  {
    id: 'phishing',
    label: 'Social Phishing',
    category: 'Attacks',
    description: 'Psychological manipulation mimicking trusted figures to harvest credentials.',
    connections: ['attacks', 'mfa'],
    details: {
      definition: 'Deceptive communication tunnels (emails, texts, QR codes) designed to lure users into revealing secrets or downloading malicious loaders.',
      mitigation: 'FIDO2 security keys, user awareness simulations, SPF/DKIM filters.'
    }
  },
  {
    id: 'ransomware',
    label: 'Ransomware',
    category: 'Attacks',
    description: 'Malicious payload that encrypts local disks and demands financial ransom.',
    connections: ['attacks', 'edr'],
    details: {
      definition: 'Sophisticated cryptoviral malware restricting access to documents via strong algorithms (AES/RSA) until a payment token is exchanged.',
      mitigation: 'Immutable offline backups, endpoint isolation heuristics.'
    }
  },
  {
    id: 'sqli',
    label: 'SQL Injection',
    category: 'Attacks',
    description: 'Input exploitation injecting database queries into web forms.',
    connections: ['attacks', 'waf'],
    details: {
      definition: 'Manipulating backend database instructions by slipping unchecked SQL statements into search bars or HTTP headers.',
      mitigation: 'Parameterized queries, prepared statements, strict input whitelists.'
    }
  },
  {
    id: 'defenses',
    label: 'Defenses',
    category: 'Defenses',
    description: 'Mitigation layers spanning network perimeter, endpoints, and identity checkers.',
    connections: ['cybersec', 'tls', 'ssh', 'waf', 'edr', 'mfa', 'cryptography'],
    details: {
      definition: 'Integrated technology grids, incident policies, and cryptographic controls maintaining safe perimeters and isolating active indicators of compromise.'
    }
  },
  {
    id: 'waf',
    label: 'WAF Guard',
    category: 'Defenses',
    description: 'Layer 7 application-level firewalls filtering HTTP requests.',
    connections: ['defenses', 'sqli', 'tools'],
    details: {
      definition: 'Web Application Firewalls tracking packet patterns, user agents, and URL endpoints to block OWASP Top 10 web injection scripts.',
      mitigation: 'Automatic OWASP rule sets, rate-limiting rules.'
    }
  },
  {
    id: 'edr',
    label: 'EDR Systems',
    category: 'Defenses',
    description: 'Endpoint Detection & Response tracking terminal behavior in real-time.',
    connections: ['defenses', 'ransomware', 'siem'],
    details: {
      definition: 'Advanced monitoring client installed on workstations/servers that aggregates local event logs and kills processes showing suspicious file-writes.'
    }
  },
  {
    id: 'mfa',
    label: 'Multi-Factor Auth',
    category: 'Defenses',
    description: 'Identity verification combining knowledge, possession, and biometrics.',
    connections: ['defenses', 'phishing'],
    details: {
      definition: 'Requiring multiple separate proof-tokens before opening session credentials, neutralizing stolen passwords.',
      standard: 'FIDO2 / WebAuthn'
    }
  },
  {
    id: 'cryptography',
    label: 'Cryptography',
    category: 'Defenses',
    description: 'Mathematical algorithms protecting information assets in transit and at rest.',
    connections: ['defenses', 'tls', 'frameworks'],
    details: {
      definition: 'Utilizing hard mathematical challenges (e.g., elliptic curves, discrete logarithms) to enforce secrecy and signature verification.'
    }
  },
  {
    id: 'tools',
    label: 'Security Tools',
    category: 'Tools',
    description: 'Administrative or hacker suites scanning and diagnosing network posture.',
    connections: ['nmap', 'wireshark', 'cybersec'],
    details: {
      definition: 'Command-line utilities and visual analyzers helping cyber analysts audit open ports, map subnets, and analyze binary packets.'
    }
  },
  {
    id: 'nmap',
    label: 'Nmap Scanner',
    category: 'Tools',
    description: 'Network exploration tool and port scanner querying services.',
    connections: ['tools', 'networking'],
    details: {
      definition: 'The Network Mapper. Uses raw IP packets to determine what hosts are available, what services they offer, and what OS versions they run.'
    }
  },
  {
    id: 'wireshark',
    label: 'Wireshark App',
    category: 'Tools',
    description: 'Interactive deep packet sniffer capturing frame exchanges.',
    connections: ['tools', 'protocols'],
    details: {
      definition: 'The world\'s foremost network protocol analyzer. Captures wire traffic and translates raw hex bits into human-readable field trees.'
    }
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    category: 'Frameworks',
    description: 'Standardized security guides detailing auditing benchmarks.',
    connections: ['cybersec', 'nist', 'mitre'],
    details: {
      definition: 'Structure collections of policies, technical controls, and testing guides compiled by security consortiums to standardize enterprise compliance.'
    }
  },
  {
    id: 'nist',
    label: 'NIST CSF',
    category: 'Frameworks',
    description: 'Identify, Protect, Detect, Respond, Recover cycle guide.',
    connections: ['frameworks', 'defenses'],
    details: {
      definition: 'The NIST Cybersecurity Framework. Organizes defensive operational goals to help companies construct a unified posture.'
    }
  },
  {
    id: 'mitre',
    label: 'MITRE ATT&CK',
    category: 'Frameworks',
    description: 'Globally-accessible knowledge base of adversary tactics and techniques.',
    connections: ['frameworks', 'attacks'],
    details: {
      definition: 'A systematic matrix mapping out exact steps cyber adversaries take (Tactics) and the individual system commands they execute (Techniques).'
    }
  }
];

// Layout Coordinates based on layout mode
// Circular orbital layout
const orbitCoords: { [id: string]: { x: number; y: number } } = {
  cybersec: { x: 400, y: 225 },
  networking: { x: 260, y: 150 },
  protocols: { x: 140, y: 120 },
  tls: { x: 120, y: 210 },
  ssh: { x: 170, y: 290 },
  attacks: { x: 300, y: 320 },
  ddos: { x: 200, y: 380 },
  phishing: { x: 360, y: 400 },
  ransomware: { x: 440, y: 400 },
  sqli: { x: 500, y: 360 },
  defenses: { x: 540, y: 150 },
  waf: { x: 640, y: 120 },
  edr: { x: 680, y: 210 },
  mfa: { x: 630, y: 290 },
  cryptography: { x: 500, y: 80 },
  tools: { x: 280, y: 80 },
  nmap: { x: 200, y: 40 },
  wireshark: { x: 360, y: 40 },
  frameworks: { x: 520, y: 280 },
  nist: { x: 580, y: 360 },
  mitre: { x: 460, y: 330 }
};

// Hub / Category grouping coordinates
const categoryHubCoords: { [id: string]: { x: number; y: number } } = {
  cybersec: { x: 400, y: 225 }, // Center
  // Networking (Left)
  networking: { x: 180, y: 180 },
  protocols: { x: 120, y: 240 },
  tls: { x: 80, y: 180 },
  ssh: { x: 130, y: 120 },
  // Attacks (Bottom Left)
  attacks: { x: 250, y: 350 },
  ddos: { x: 160, y: 380 },
  phishing: { x: 320, y: 400 },
  ransomware: { x: 230, y: 420 },
  sqli: { x: 180, y: 320 },
  // Defenses (Right)
  defenses: { x: 620, y: 180 },
  waf: { x: 680, y: 120 },
  edr: { x: 720, y: 190 },
  mfa: { x: 670, y: 250 },
  cryptography: { x: 580, y: 100 },
  // Tools (Top Center)
  tools: { x: 400, y: 80 },
  nmap: { x: 340, y: 40 },
  wireshark: { x: 460, y: 40 },
  // Frameworks (Bottom Right)
  frameworks: { x: 550, y: 350 },
  nist: { x: 510, y: 410 },
  mitre: { x: 600, y: 400 }
};

export default function KnowledgeGraph() {
  const [layoutMode, setLayoutMode] = useState<'orbit' | 'group'>('orbit');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(graphNodes[0]);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Map of nodes
  const nodeMap = useMemo(() => {
    const map: { [id: string]: GraphNode } = {};
    graphNodes.forEach(node => { map[node.id] = node; });
    return map;
  }, []);

  const coords = useMemo(() => {
    return layoutMode === 'orbit' ? orbitCoords : categoryHubCoords;
  }, [layoutMode]);

  // Handle Search nodes
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return graphNodes;
    const query = searchQuery.toLowerCase();
    return graphNodes.filter(n => 
      n.label.toLowerCase().includes(query) || 
      n.category.toLowerCase().includes(query) ||
      n.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Compute unique connection links to draw
  const links = useMemo(() => {
    const uniqueLinks: { from: string; to: string; id: string }[] = [];
    const seen = new Set<string>();

    graphNodes.forEach(node => {
      node.connections.forEach(targetId => {
        if (!nodeMap[targetId]) return;
        const linkKey = [node.id, targetId].sort().join('-');
        if (!seen.has(linkKey)) {
          seen.add(linkKey);
          uniqueLinks.push({ from: node.id, to: targetId, id: linkKey });
        }
      });
    });

    return uniqueLinks;
  }, [nodeMap]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Concepts': return 'stroke-cyan-400 fill-cyan-400 text-cyan-400';
      case 'Networking': return 'stroke-sky-400 fill-sky-400 text-sky-400';
      case 'Protocols': return 'stroke-teal-400 fill-teal-400 text-teal-400';
      case 'Attacks': return 'stroke-rose-500 fill-rose-500 text-rose-500';
      case 'Defenses': return 'stroke-emerald-400 fill-emerald-400 text-emerald-400';
      case 'Tools': return 'stroke-amber-400 fill-amber-400 text-amber-400';
      case 'Frameworks': return 'stroke-violet-400 fill-violet-400 text-violet-400';
      default: return 'stroke-slate-400 fill-slate-400 text-slate-400';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'Concepts': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300';
      case 'Networking': return 'bg-sky-500/10 border-sky-500/30 text-sky-300';
      case 'Protocols': return 'bg-teal-500/10 border-teal-500/30 text-teal-300';
      case 'Attacks': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'Defenses': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Tools': return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'Frameworks': return 'bg-violet-500/10 border-violet-500/30 text-violet-300';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-300';
    }
  };

  return (
    <div id="knowledge-graph-root" className="space-y-6">
      {/* Header bar */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5.5 h-5.5 text-cyan-400 animate-pulse" /> Cyber Intelligence Knowledge Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            An interactive topological correlation engine. Map logical relations across threat landscapes, networking standards, mitigation devices, security tools, and national compliance frameworks.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search concepts, cves, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full md:w-56"
            />
          </div>

          {/* Layout switch */}
          <div className="bg-slate-950 p-1 border border-slate-900 rounded-xl flex">
            <button
              onClick={() => setLayoutMode('orbit')}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer ${
                layoutMode === 'orbit' ? 'bg-cyan-500/10 text-cyan-400' : ''
              }`}
              title="Orbital Layout"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('group')}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer ${
                layoutMode === 'group' ? 'bg-cyan-500/10 text-cyan-400' : ''
              }`}
              title="Categorized Hubs"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Central Graph Box - SVG representation (col-span-3) */}
        <div className="xl:col-span-3 bg-slate-950/80 border border-slate-900 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

          {/* Zoom controls float */}
          <div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-800 rounded-lg p-1 flex gap-1 z-10">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.15))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="px-1.5 text-slate-500 hover:text-white text-[9px] font-mono font-bold cursor-pointer"
              title="Reset Zoom"
            >
              100%
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.15))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center overflow-auto relative">
            <div 
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
              className="w-full h-full flex justify-center items-center"
            >
              <svg viewBox="0 0 800 450" className="w-full max-w-4xl h-auto">
                {/* Background Grid Accent */}
                <g className="stroke-slate-950 stroke-[0.5] opacity-20 pointer-events-none">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <line key={`gx-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="450" />
                  ))}
                  {Array.from({ length: 23 }).map((_, i) => (
                    <line key={`gy-${i}`} x1="0" y1={i * 20} x2="800" y2={i * 20} />
                  ))}
                </g>

                {/* Connection links paths */}
                <g>
                  {links.map((link) => {
                    const fromCoord = coords[link.from];
                    const toCoord = coords[link.to];
                    if (!fromCoord || !toCoord) return null;

                    const isHighlighted = selectedNode && 
                      (selectedNode.id === link.from || selectedNode.id === link.to);

                    return (
                      <line
                        key={link.id}
                        x1={fromCoord.x}
                        y1={fromCoord.y}
                        x2={toCoord.x}
                        y2={toCoord.y}
                        className={`transition-all duration-300 fill-none stroke-1 ${
                          isHighlighted 
                            ? 'stroke-cyan-400/60 stroke-2 shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                            : 'stroke-slate-900'
                        }`}
                      />
                    );
                  })}
                </g>

                {/* Node Circles */}
                <g>
                  {graphNodes.map((node) => {
                    const coord = coords[node.id];
                    if (!coord) return null;

                    const isSelected = selectedNode?.id === node.id;
                    const matchesSearch = searchQuery && 
                      (node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       node.category.toLowerCase().includes(searchQuery.toLowerCase()));

                    const catColors = getCategoryColor(node.category);

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${coord.x}, ${coord.y})`}
                        className="cursor-pointer group"
                        onClick={() => setSelectedNode(node)}
                      >
                        {/* Outer pulsing glow */}
                        <circle
                          r={isSelected ? 16 : matchesSearch ? 14 : 9}
                          className={`transition-all duration-300 fill-slate-950 stroke-2 ${
                            isSelected 
                              ? `${catColors.split(' ')[0]} animate-pulse` 
                              : matchesSearch 
                              ? 'stroke-cyan-400 animate-ping'
                              : 'stroke-slate-800 group-hover:stroke-slate-500'
                          }`}
                        />

                        {/* Inner category colored dot */}
                        <circle
                          r={isSelected ? 6 : 4}
                          className={`transition-all duration-300 ${catColors.split(' ')[1]}`}
                        />

                        {/* Node Name Label text */}
                        <text
                          y={isSelected ? 26 : 20}
                          className={`font-mono text-[9px] font-bold text-center ${
                            isSelected 
                              ? 'fill-white' 
                              : matchesSearch 
                              ? 'fill-cyan-400' 
                              : 'fill-slate-500 group-hover:fill-slate-300'
                          }`}
                          textAnchor="middle"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Quick Legend rail */}
          <div className="border-t border-slate-900 pt-3 mt-2 flex flex-wrap gap-4 text-[9px] font-mono text-slate-500 justify-center">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Core Concepts</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Networking</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-400" /> Protocols</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Attacks & Exploits</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Defenses & Controls</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Security Tools</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400" /> Frameworks</span>
          </div>
        </div>

        {/* Selected Concept Deep Dive - Right Column (Col-span-1) */}
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

          {selectedNode ? (
            <div className="space-y-4">
              {/* Header category details badge */}
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div>
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-widest ${getCategoryBgColor(selectedNode.category)}`}>
                    {selectedNode.category}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm mt-1.5">{selectedNode.label}</h3>
                </div>
              </div>

              {/* Main text fields */}
              <div className="space-y-3.5 text-xs font-sans text-slate-400 leading-relaxed">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">Concept Summary</span>
                  <p>{selectedNode.description}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">Technical Spec</span>
                  <p className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-slate-300 font-mono text-[10px] leading-relaxed">
                    {selectedNode.details.definition}
                  </p>
                </div>

                {selectedNode.details.vulnerabilities && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">Associated Vulnerabilities</span>
                    <p className="text-rose-400/90">{selectedNode.details.vulnerabilities}</p>
                  </div>
                )}

                {selectedNode.details.mitigation && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">Neutralization Controls</span>
                    <p className="text-emerald-400/90">{selectedNode.details.mitigation}</p>
                  </div>
                )}

                {selectedNode.details.standard && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block mb-1">Governing Standards</span>
                    <p className="text-violet-300 font-mono text-[10px]">{selectedNode.details.standard}</p>
                  </div>
                )}

                {/* Relational Vectors */}
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Direct Graph Relations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connections.map((targetId) => {
                      const target = nodeMap[targetId];
                      if (!target) return null;
                      return (
                        <button
                          key={targetId}
                          onClick={() => setSelectedNode(target)}
                          className="px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-[9px] font-mono font-semibold rounded-lg text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {target.label} <ArrowRight className="w-3 h-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 font-mono text-xs">
              Select a node in the visual topological graph to query relations logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
