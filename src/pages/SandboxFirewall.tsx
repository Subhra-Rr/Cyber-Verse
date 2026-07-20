import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Play, Plus, Trash2, Bug, Radio, Cloud, Server, 
  Terminal, ArrowRight, ShieldX, RefreshCw, Layers, ListFilter, Cpu, Lock, FileCode, Globe
} from 'lucide-react';

// ==========================================
// TYPES FOR SIMULATORS
// ==========================================
interface FirewallRule {
  id: string;
  action: 'ALLOW' | 'DENY';
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  port: string; // e.g., "80", "22", "ANY"
  source: string; // e.g., "192.168.1.0/24", "ANY"
  dest: string; // e.g., "10.0.0.1", "ANY"
}

interface SimulatedPacket {
  id: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  port: string;
  source: string;
  dest: string;
  status?: 'PASSED' | 'BLOCKED';
  matchedRuleId?: string;
}

interface MalwareNode {
  id: number;
  type: 'Healthy' | 'Infected' | 'Encrypted' | 'Patched';
  x: number;
  y: number;
  speedX: number;
  speedY: number;
}

export default function SandboxFirewall() {
  const [activeTab, setActiveTab] = useState<'firewall' | 'malware' | 'wireshark' | 'cloud'>('firewall');

  // ==========================================
  // FIREWALL SIMULATOR STATE
  // ==========================================
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([
    { id: 'r1', action: 'ALLOW', protocol: 'TCP', port: '443', source: 'ANY', dest: 'ANY' },
    { id: 'r2', action: 'ALLOW', protocol: 'TCP', port: '80', source: 'ANY', dest: 'ANY' },
    { id: 'r3', action: 'DENY', protocol: 'TCP', port: '22', source: 'ANY', dest: 'ANY' },
    { id: 'r4', action: 'ALLOW', protocol: 'UDP', port: '53', source: 'ANY', dest: '1.1.1.1' },
    { id: 'r5', action: 'DENY', protocol: 'ANY', port: 'ANY', source: 'ANY', dest: 'ANY' }, // Default Deny
  ]);

  const [newRule, setNewRule] = useState<Omit<FirewallRule, 'id'>>({
    action: 'ALLOW',
    protocol: 'TCP',
    port: '8080',
    source: 'ANY',
    dest: 'ANY',
  });

  const [testPacket, setTestPacket] = useState<Omit<SimulatedPacket, 'id'>>({
    protocol: 'TCP',
    port: '22',
    source: '192.168.1.50',
    dest: '10.0.0.4',
  });

  const [packetHistory, setPacketHistory] = useState<SimulatedPacket[]>([]);
  const [firewallConsoleLogs, setFirewallConsoleLogs] = useState<string[]>([]);

  const addFirewallRule = () => {
    const id = `r_${Date.now()}`;
    setFirewallRules([...firewallRules, { ...newRule, id }]);
    setFirewallConsoleLogs(prev => [`[RULE ADDED] Active policy expanded with rule ${id}`, ...prev]);
  };

  const deleteRule = (id: string) => {
    setFirewallRules(firewallRules.filter(r => r.id !== id));
    setFirewallConsoleLogs(prev => [`[RULE DELETED] Rule ${id} removed from security policy`, ...prev]);
  };

  const testFirewallPacket = () => {
    const packet: SimulatedPacket = {
      id: `p_${Date.now()}`,
      ...testPacket,
    };

    // Evaluate rules top-down
    let matchedRule: FirewallRule | null = null;
    for (const rule of firewallRules) {
      const protoMatch = rule.protocol === 'ANY' || rule.protocol === packet.protocol;
      const portMatch = rule.port === 'ANY' || rule.port === packet.port;
      const srcMatch = rule.source === 'ANY' || rule.source === packet.source;
      const destMatch = rule.dest === 'ANY' || rule.dest === packet.dest;

      if (protoMatch && portMatch && srcMatch && destMatch) {
        matchedRule = rule;
        break;
      }
    }

    const action = matchedRule ? matchedRule.action : 'ALLOW'; // default fallback is ALLOW if no rules match
    packet.status = action === 'ALLOW' ? 'PASSED' : 'BLOCKED';
    packet.matchedRuleId = matchedRule?.id || 'default-fallback';

    setPacketHistory([packet, ...packetHistory]);
    setFirewallConsoleLogs(prev => [
      `[PACKET TRAFFIC] ${packet.protocol} Packet from ${packet.source}:${packet.port} -> ${packet.dest} evaluated. Result: ${packet.status} (Matched Rule: ${packet.matchedRuleId})`,
      ...prev
    ]);
  };

  // ==========================================
  // MALWARE SIMULATOR STATE
  // ==========================================
  const [malwareNodes, setMalwareNodes] = useState<MalwareNode[]>([]);
  const [malwareType, setMalwareType] = useState<'virus' | 'worm' | 'ransomware'>('virus');
  const [simStats, setSimStats] = useState({ healthy: 40, infected: 0, encrypted: 0 });
  const [isMalwareRunning, setIsMalwareRunning] = useState(false);

  // Initialize nodes for malware simulation
  const initMalwareNodes = () => {
    const count = 40;
    const temp: MalwareNode[] = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        id: i,
        type: i === 0 ? 'Infected' : 'Healthy', // Node 0 starts infected
        x: Math.random() * 95,
        y: Math.random() * 95,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
      });
    }
    setMalwareNodes(temp);
    setIsMalwareRunning(true);
  };

  // Move and infection loop
  useEffect(() => {
    if (!isMalwareRunning || malwareNodes.length === 0) return;

    const interval = setInterval(() => {
      setMalwareNodes((prevNodes) => {
        // Update positions
        let updated = prevNodes.map((node) => {
          let nx = node.x + node.speedX;
          let ny = node.y + node.speedY;

          // Bounce off bounds
          let sx = node.speedX;
          let sy = node.speedY;
          if (nx < 2 || nx > 98) sx = -sx;
          if (ny < 2 || ny > 98) sy = -sy;

          return {
            ...node,
            x: Math.max(2, Math.min(98, nx)),
            y: Math.max(2, Math.min(98, ny)),
            speedX: sx,
            speedY: sy,
          };
        });

        // Resolve infections on contact
        for (let i = 0; i < updated.length; i++) {
          if (updated[i].type !== 'Infected') continue;

          for (let j = 0; j < updated.length; j++) {
            if (i === j || updated[j].type !== 'Healthy') continue;

            // Calculate Euclidean distance
            const dx = updated[i].x - updated[j].x;
            const dy = updated[i].y - updated[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If close enough, infect!
            if (dist < 8) {
              if (malwareType === 'virus') {
                updated[j].type = 'Infected';
              } else if (malwareType === 'ransomware') {
                updated[j].type = 'Encrypted';
              } else if (malwareType === 'worm') {
                // Worm propagates along network node linkages (modeled by nearby index links)
                if (Math.abs(i - j) < 5) {
                  updated[j].type = 'Infected';
                }
              }
            }
          }
        }

        // Gather stats
        const healthy = updated.filter(n => n.type === 'Healthy').length;
        const infected = updated.filter(n => n.type === 'Infected').length;
        const encrypted = updated.filter(n => n.type === 'Encrypted').length;
        setSimStats({ healthy, infected, encrypted });

        return updated;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isMalwareRunning, malwareType, malwareNodes.length]);

  const deployAntivirusPatch = () => {
    setMalwareNodes(prev => prev.map(n => n.type === 'Infected' || n.type === 'Encrypted' ? { ...n, type: 'Patched' } : n));
    setSimStats(prev => ({ healthy: prev.healthy, infected: 0, encrypted: 0 }));
  };

  const stopMalwareSimulation = () => {
    setIsMalwareRunning(false);
    setMalwareNodes([]);
    setSimStats({ healthy: 40, infected: 0, encrypted: 0 });
  };

  // ==========================================
  // WIRESHARK PACKET ANALYZER STATE
  // ==========================================
  const mockPackets = [
    {
      id: 'ws_1',
      time: '0.000000',
      src: '192.168.1.104',
      dst: '172.217.16.142',
      proto: 'DNS',
      length: '74',
      info: 'Standard query 0x1f41 A google.com',
      details: {
        ethernet: {
          src: '00:0a:95:9d:68:16',
          dst: '00:11:95:f3:b4:a1',
          type: 'IPv4 (0x0800)'
        },
        ipv4: {
          src: '192.168.1.104',
          dst: '172.217.16.142',
          proto: 'UDP (17)',
          ttl: '64',
          checksum: '0xa411'
        },
        udp: {
          srcPort: '53310',
          dstPort: '53',
          len: '40',
          checksum: '0xfbc2'
        },
        app: {
          name: 'Domain Name System (Query)',
          payload: 'Transaction ID: 0x1f41, Flags: Standard query, Name: google.com, Type: A'
        }
      },
      hex: '00 11 95 f3 b4 a1 00 0a 95 9d 68 16 08 00 45 00 00 4a a4 11 40 00 40 11 b3 c1 c0 a8 01 68 ac d9 10 8e d0 3e 00 35 00 28 fb c2 1f 41 01 00 00 01 00 00 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01'
    },
    {
      id: 'ws_2',
      time: '0.012450',
      src: '172.217.16.142',
      dst: '192.168.1.104',
      proto: 'DNS',
      length: '90',
      info: 'Standard query response 0x1f41 A google.com A 142.250.72.46',
      details: {
        ethernet: {
          src: '00:11:95:f3:b4:a1',
          dst: '00:0a:95:9d:68:16',
          type: 'IPv4 (0x0800)'
        },
        ipv4: {
          src: '172.217.16.142',
          dst: '192.168.1.104',
          proto: 'UDP (17)',
          ttl: '120',
          checksum: '0x10b2'
        },
        udp: {
          srcPort: '53',
          dstPort: '53310',
          len: '56',
          checksum: '0x32a1'
        },
        app: {
          name: 'Domain Name System (Response)',
          payload: 'Transaction ID: 0x1f41, IP Mapping resolved: google.com -> 142.250.72.46 (TTL=300)'
        }
      },
      hex: '00 0a 95 9d 68 16 00 11 95 f3 b4 a1 08 00 45 00 00 5a 10 b2 40 00 78 11 b3 c1 ac d9 10 8e c0 a8 01 68 00 35 d0 3e 00 38 32 a1 1f 41 81 80 00 01 00 01 00 00 00 00 06 67 6f 6f 67 6c 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 2c 00 04 8e fa 48 2e'
    },
    {
      id: 'ws_3',
      time: '0.021045',
      src: '192.168.1.104',
      dst: '142.250.72.46',
      proto: 'TCP',
      length: '66',
      info: '53312 -> 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460',
      details: {
        ethernet: {
          src: '00:0a:95:9d:68:16',
          dst: '00:11:95:f3:b4:a1',
          type: 'IPv4 (0x0800)'
        },
        ipv4: {
          src: '192.168.1.104',
          dst: '142.250.72.46',
          proto: 'TCP (6)',
          ttl: '64',
          checksum: '0x2ba1'
        },
        udp: {
          srcPort: '53312',
          dstPort: '443',
          len: '0 (Handshake Phase)',
          checksum: '0xfa42'
        },
        app: {
          name: 'Transmission Control Protocol (TCP SYN)',
          payload: 'Flags: SYN, Sequence Number: 0, Window Size: 64240, MSS: 1460'
        }
      },
      hex: '00 11 95 f3 b4 a1 00 0a 95 9d 68 16 08 00 45 00 00 28 2b a1 40 00 40 06 b3 c1 c0 a8 01 68 8e fa 48 2e d0 40 01 bb 00 00 00 00 00 00 00 00 50 02 fa 42 00 00'
    },
    {
      id: 'ws_4',
      time: '0.035411',
      src: '142.250.72.46',
      dst: '192.168.1.104',
      proto: 'TCP',
      length: '66',
      info: '443 -> 53312 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0',
      details: {
        ethernet: {
          src: '00:11:95:f3:b4:a1',
          dst: '00:0a:95:9d:68:16',
          type: 'IPv4 (0x0800)'
        },
        ipv4: {
          src: '142.250.72.46',
          dst: '192.168.1.104',
          proto: 'TCP (6)',
          ttl: '115',
          checksum: '0xbb12'
        },
        udp: {
          srcPort: '443',
          dstPort: '53312',
          len: '0 (Handshake Phase)',
          checksum: '0xcb10'
        },
        app: {
          name: 'Transmission Control Protocol (TCP SYN-ACK)',
          payload: 'Flags: SYN, ACK, Sequence: 0, Acknowledgment: 1, Win Size: 65535'
        }
      },
      hex: '00 0a 95 9d 68 16 00 11 95 f3 b4 a1 08 00 45 00 00 28 bb 12 40 00 73 06 b3 c1 8e fa 48 2e c0 a8 01 68 01 bb d0 40 00 00 00 00 00 00 00 01 50 12 cb 10 00 00'
    },
    {
      id: 'ws_5',
      time: '0.036012',
      src: '192.168.1.104',
      dst: '142.250.72.46',
      proto: 'TLSv1.2',
      length: '185',
      info: 'Client Hello, TLSv1.2 handshake initiation record',
      details: {
        ethernet: {
          src: '00:0a:95:9d:68:16',
          dst: '00:11:95:f3:b4:a1',
          type: 'IPv4 (0x0800)'
        },
        ipv4: {
          src: '192.168.1.104',
          dst: '142.250.72.46',
          proto: 'TCP (6)',
          ttl: '64',
          checksum: '0xa4c1'
        },
        udp: {
          srcPort: '53312',
          dstPort: '443',
          len: '119 (Data Transfer)',
          checksum: '0xf92b'
        },
        app: {
          name: 'Transport Layer Security (TLSv1.2)',
          payload: 'Handshake Protocol: Client Hello, Version: TLS 1.2, Cipher Suites Offered: 16, Extension: SNI (google.com)'
        }
      },
      hex: '16 03 01 00 b4 01 00 00 b0 03 03 a4 c1 f9 2b 00 00 00 00 00 00 00 00 c0 a8 01 68 8e fa 48 2e 00 00 00 10 c0 2b c0 2f c0 0a c0 09 c0 13 c0 14 00 9c 00 9d 00 2f 00 35 00 0a 01 00 00 77 00 00 00 0f 00 0d 00 00 0a 67 6f 6f 67 6c 65 2e 63 6f 6d'
    }
  ];

  const [selectedWsPacket, setSelectedWsPacket] = useState<typeof mockPackets[0]>(mockPackets[0]);
  const [expandedSection, setExpandedSection] = useState<'eth' | 'ip' | 'l4' | 'app' | null>('ip');

  // ==========================================
  // CLOUD SECURITY ARCHITECTURE STATE
  // ==========================================
  const [naclConfig, setNaclConfig] = useState({
    port80Allowed: true,
    port22Allowed: false,
    egressAllowed: true
  });
  const [cloudTrafficLog, setCloudTrafficLog] = useState<string[]>([]);

  const triggerCloudRequest = (requestType: 'HTTP' | 'SSH' | 'OUTBOUND') => {
    let allowed = false;
    let desc = '';

    if (requestType === 'HTTP') {
      allowed = naclConfig.port80Allowed;
      desc = allowed 
        ? '✔ Traffic ALLOWED: Port 80 HTTP packet successfully traversed VPC Internet Gateway and reached ALB load balancer cluster.'
        : '❌ Traffic BLOCKED: Port 80 HTTP request rejected at VPC boundary due to matching deny rule on Security Group acl.';
    } else if (requestType === 'SSH') {
      allowed = naclConfig.port22Allowed;
      desc = allowed
        ? '✔ Traffic ALLOWED: Port 22 SSH administration shell established tunnel session with bastion-host EC2 instance.'
        : '❌ Traffic BLOCKED: Port 22 SSH authentication blocked. Port is closed and isolated at subnet firewall layer.';
    } else {
      allowed = naclConfig.egressAllowed;
      desc = allowed
        ? '✔ Traffic ALLOWED: Database instance completed microservice sync query response via NAT Gateway router.'
        : '❌ Traffic BLOCKED: Outbound data exfiltration blocked. Egress packet isolated at outbound Security Group filter.';
    }

    setCloudTrafficLog(prev => [desc, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-cyan-400" /> Advanced Interactive Threat Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build defensive policy rules, dissect raw Wireshark frames, study malware epidemics, and configure security parameters in microservice clouds.
          </p>
        </div>
      </div>

      {/* Tabs navigation menu */}
      <div className="flex bg-slate-950 p-1 border border-slate-900 rounded-xl max-w-2xl">
        <button
          onClick={() => setActiveTab('firewall')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'firewall'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Firewall Simulator
        </button>
        <button
          onClick={() => setActiveTab('malware')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'malware'
              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Bug className="w-4 h-4" />
          Malware Sandbox
        </button>
        <button
          onClick={() => setActiveTab('wireshark')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'wireshark'
              ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Radio className="w-4 h-4" />
          Packet Analyzer
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'cloud'
              ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Cloud className="w-4 h-4" />
          Cloud Visualizer
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ==========================================
            TAB 1: FIREWALL SIMULATOR
            ========================================== */}
        {activeTab === 'firewall' && (
          <motion.div
            key="firewall"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-slate-300"
          >
            {/* Left side: Policy rule list */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ListFilter className="w-4 h-4 text-cyan-400" /> Firewall Access Control Rules (ACL)
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Rules evaluated sequentially top-down</span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {firewallRules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="bg-slate-950/80 border border-slate-850 rounded-xl p-3 flex justify-between items-center text-xs font-mono group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-600 font-bold w-6">#{idx + 1}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rule.action === 'ALLOW' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {rule.action}
                        </span>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 text-[11px]">
                          <span>Proto: <strong className="text-slate-200">{rule.protocol}</strong></span>
                          <span>Port: <strong className="text-slate-200">{rule.port}</strong></span>
                          <span>Src: <strong className="text-slate-200">{rule.source}</strong></span>
                          <span>Dst: <strong className="text-slate-200">{rule.dest}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* New Rule creation form */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Action</label>
                    <select
                      value={newRule.action}
                      onChange={(e) => setNewRule({ ...newRule, action: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono"
                    >
                      <option value="ALLOW">ALLOW</option>
                      <option value="DENY">DENY</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Protocol</label>
                    <select
                      value={newRule.protocol}
                      onChange={(e) => setNewRule({ ...newRule, protocol: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                      <option value="ANY">ANY</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Port</label>
                    <input
                      type="text"
                      value={newRule.port}
                      onChange={(e) => setNewRule({ ...newRule, port: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono"
                      placeholder="e.g., 80"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Src IP</label>
                    <input
                      type="text"
                      value={newRule.source}
                      onChange={(e) => setNewRule({ ...newRule, source: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <button
                      onClick={addFirewallRule}
                      className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Rule
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Testing packet block */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-emerald-400" /> Packet Generator & Injector
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Protocol</label>
                    <select
                      value={testPacket.protocol}
                      onChange={(e) => setTestPacket({ ...testPacket, protocol: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1.5"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Source IP</label>
                      <input
                        type="text"
                        value={testPacket.source}
                        onChange={(e) => setTestPacket({ ...testPacket, source: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Destination IP</label>
                      <input
                        type="text"
                        value={testPacket.dest}
                        onChange={(e) => setTestPacket({ ...testPacket, dest: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Target Port</label>
                    <input
                      type="text"
                      value={testPacket.port}
                      onChange={(e) => setTestPacket({ ...testPacket, port: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1"
                    />
                  </div>

                  <button
                    onClick={testFirewallPacket}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer hover:brightness-110"
                  >
                    🚀 Inject Packet Frame
                  </button>
                </div>
              </div>

              {/* Console Output logs */}
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Console Diagnostics Audit
                </h4>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 h-[100px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1 leading-relaxed">
                  {firewallConsoleLogs.length === 0 ? (
                    <span className="text-slate-600 block text-center mt-5">Console ready. Inject packets to parse rule logs.</span>
                  ) : (
                    firewallConsoleLogs.map((log, idx) => (
                      <span key={idx} className={`block ${log.includes('PASSED') ? 'text-emerald-400' : log.includes('BLOCKED') ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {log}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            TAB 2: MALWARE SANDBOX
            ========================================== */}
        {activeTab === 'malware' && (
          <motion.div
            key="malware"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-slate-300"
          >
            {/* Left side: Malware simulation canvas */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Bug className="w-4.5 h-4.5 text-rose-500" /> Isolated Host Malware Epidemic Arena
                  </h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={malwareType}
                      onChange={(e) => setMalwareType(e.target.value as any)}
                      className="bg-slate-950 border border-slate-850 text-[10px] font-mono px-2 py-1 rounded"
                    >
                      <option value="virus">Stuxnet Virus (Contact Infection)</option>
                      <option value="worm">Conficker Worm (Port Scans Propagation)</option>
                      <option value="ransomware">WannaCry Ransomware (File Encryption lock)</option>
                    </select>
                    {isMalwareRunning ? (
                      <button
                        onClick={stopMalwareSimulation}
                        className="bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                      >
                        Reset Arena
                      </button>
                    ) : (
                      <button
                        onClick={initMalwareNodes}
                        className="bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-mono px-2.5 py-1 rounded cursor-pointer"
                      >
                        Infect & Start
                      </button>
                    )}
                  </div>
                </div>

                {/* 2D simulation arena */}
                <div className="h-[320px] bg-slate-950 rounded-xl border border-slate-900 relative overflow-hidden">
                  {malwareNodes.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <Bug className="w-10 h-10 text-slate-600 animate-bounce" />
                      <span className="text-slate-400 font-bold font-mono text-xs">Awaiting Epidemic Initialization</span>
                      <p className="text-[10px] text-slate-500 max-w-sm">Select malware vector taxonomy and execute sandbox payload injection to trace physical network epidemic kinetics.</p>
                    </div>
                  ) : (
                    malwareNodes.map((node) => {
                      let bgClass = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                      if (node.type === 'Infected') bgClass = 'bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse';
                      else if (node.type === 'Encrypted') bgClass = 'bg-amber-500 shadow-[0_0_12px_#f59e0b]';
                      else if (node.type === 'Patched') bgClass = 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';

                      return (
                        <div
                          key={node.id}
                          className={`absolute w-3.5 h-3.5 rounded-full border border-slate-950 transition-all ${bgClass}`}
                          style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Controls and metrics */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Infection Diagnostics
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-400">Total Hosts Analysed</span>
                    <strong className="text-white">40</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-emerald-400">Healthy Hosts</span>
                    <strong className="text-emerald-400">{simStats.healthy}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-rose-400">Active Infections</span>
                    <strong className="text-rose-400">{simStats.infected}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-amber-400">Encrypted Blocks</span>
                    <strong className="text-amber-400">{simStats.encrypted}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={deployAntivirusPatch}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 hover:brightness-110 cursor-pointer"
                  >
                    🛡 Deploy Antivirus Patch
                  </button>
                </div>
              </div>

              {/* Explainer card */}
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Vector Taxonomy Guide
                </h4>
                <div className="text-[10px] text-slate-400 font-mono space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-rose-400">Virus (Stuxnet)</strong>: Propagates strictly on proximity vector contact. Demonstrates host attachment.
                  </p>
                  <p>
                    <strong className="text-indigo-400">Worm (Conficker)</strong>: Scans and jumps to adjacent memory cells using peer-to-peer logical interface tunnels.
                  </p>
                  <p>
                    <strong className="text-amber-400">Ransomware (WannaCry)</strong>: Freezes system memory blocks, replacing active states with encrypted visual markers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            TAB 3: WIRESHARK PACKET ANALYZER
            ========================================== */}
        {activeTab === 'wireshark' && (
          <motion.div
            key="wireshark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-4 text-slate-300"
          >
            {/* Top row: Packet stream table */}
            <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5">
                <Layers className="w-4.5 h-4.5 text-indigo-400" /> Wireshark packet dissection frame stream
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full font-mono text-[10px] border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-850 text-slate-500 text-left">
                      <th className="p-2">No.</th>
                      <th className="p-2">Time</th>
                      <th className="p-2">Source</th>
                      <th className="p-2">Destination</th>
                      <th className="p-2">Protocol</th>
                      <th className="p-2">Length</th>
                      <th className="p-2 text-left">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPackets.map((pkt, idx) => (
                      <tr
                        key={pkt.id}
                        onClick={() => setSelectedWsPacket(pkt)}
                        className={`border-b border-slate-850/60 hover:bg-slate-800/40 cursor-pointer transition-all ${
                          selectedWsPacket.id === pkt.id 
                            ? 'bg-indigo-500/10 text-indigo-200 font-bold border-l-2 border-l-indigo-400' 
                            : 'text-slate-400'
                        }`}
                      >
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{pkt.time}</td>
                        <td className="p-2">{pkt.src}</td>
                        <td className="p-2">{pkt.dst}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            pkt.proto === 'DNS' ? 'bg-indigo-500/10 text-indigo-400' : pkt.proto === 'TCP' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                          }`}>
                            {pkt.proto}
                          </span>
                        </td>
                        <td className="p-2">{pkt.length}</td>
                        <td className="p-2 text-left truncate max-w-xs" title={pkt.info}>{pkt.info}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom row splits: Accordion Tree & Hex dump */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Expandable Dissection tree */}
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Packet Dissection tree Details
                </h4>

                <div className="font-mono text-xs space-y-2">
                  {/* Frame 1 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'eth' ? null : 'eth')}
                      className="w-full flex justify-between items-center text-slate-300 font-bold"
                    >
                      <span>Ethernet II, Src: {selectedWsPacket.details.ethernet.src}, Dst: {selectedWsPacket.details.ethernet.dst}</span>
                      <span>{expandedSection === 'eth' ? '▼' : '▶'}</span>
                    </button>
                    {expandedSection === 'eth' && (
                      <div className="mt-2 pl-4 border-l border-slate-800 text-slate-400 space-y-1 text-[11px]">
                        <div>Destination MAC: {selectedWsPacket.details.ethernet.dst}</div>
                        <div>Source MAC: {selectedWsPacket.details.ethernet.src}</div>
                        <div>Type: {selectedWsPacket.details.ethernet.type}</div>
                      </div>
                    )}
                  </div>

                  {/* Frame 2 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'ip' ? null : 'ip')}
                      className="w-full flex justify-between items-center text-slate-300 font-bold"
                    >
                      <span>Internet Protocol Version 4, Src: {selectedWsPacket.details.ipv4.src}, Dst: {selectedWsPacket.details.ipv4.dst}</span>
                      <span>{expandedSection === 'ip' ? '▼' : '▶'}</span>
                    </button>
                    {expandedSection === 'ip' && (
                      <div className="mt-2 pl-4 border-l border-slate-800 text-slate-400 space-y-1 text-[11px]">
                        <div>Source IP Address: {selectedWsPacket.details.ipv4.src}</div>
                        <div>Destination IP Address: {selectedWsPacket.details.ipv4.dst}</div>
                        <div>Protocol type: {selectedWsPacket.details.ipv4.proto}</div>
                        <div>Time To Live (TTL): {selectedWsPacket.details.ipv4.ttl}</div>
                        <div>Header Checksum: {selectedWsPacket.details.ipv4.checksum}</div>
                      </div>
                    )}
                  </div>

                  {/* Frame 3 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'l4' ? null : 'l4')}
                      className="w-full flex justify-between items-center text-slate-300 font-bold"
                    >
                      <span>Layer 4 Protocol Header details</span>
                      <span>{expandedSection === 'l4' ? '▼' : '▶'}</span>
                    </button>
                    {expandedSection === 'l4' && (
                      <div className="mt-2 pl-4 border-l border-slate-800 text-slate-400 space-y-1 text-[11px]">
                        <div>Source Port: {selectedWsPacket.details.udp.srcPort}</div>
                        <div>Destination Port: {selectedWsPacket.details.udp.dstPort}</div>
                        <div>Length: {selectedWsPacket.details.udp.len}</div>
                        <div>Checksum: {selectedWsPacket.details.udp.checksum}</div>
                      </div>
                    )}
                  </div>

                  {/* Frame 4 */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'app' ? null : 'app')}
                      className="w-full flex justify-between items-center text-slate-300 font-bold"
                    >
                      <span>Application: {selectedWsPacket.details.app.name}</span>
                      <span>{expandedSection === 'app' ? '▼' : '▶'}</span>
                    </button>
                    {expandedSection === 'app' && (
                      <div className="mt-2 pl-4 border-l border-slate-800 text-slate-400 space-y-1 text-[11px] leading-relaxed">
                        <div>Data Payload:</div>
                        <div className="bg-slate-900 p-2 rounded text-cyan-400 border border-slate-850">{selectedWsPacket.details.app.payload}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hex dump byte view */}
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-3">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Hexadecimal Payload octet Dump
                </h4>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg font-mono text-[10px] text-slate-500 leading-relaxed overflow-x-auto select-none h-[180px] hover:text-slate-400 transition-colors">
                  {selectedWsPacket.hex.split(' ').reduce((acc: string[][], cur, idx) => {
                    const lineIdx = Math.floor(idx / 16);
                    if (!acc[lineIdx]) acc[lineIdx] = [];
                    acc[lineIdx].push(cur);
                    return acc;
                  }, []).map((line, lineIdx) => (
                    <div key={lineIdx} className="flex gap-4">
                      {/* Offset address */}
                      <span className="text-slate-600 font-bold">{(lineIdx * 16).toString(16).padStart(4, '0')}</span>
                      {/* Hex bytes */}
                      <span className="text-slate-300 flex-1 hover:text-cyan-300 transition-colors">
                        {line.join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[9px] font-mono text-slate-500 text-center uppercase tracking-widest">
                  🔬 Hover hex blocks to examine binary raw framing octets
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            TAB 4: CLOUD CONFIG SECURITY VISUALIZER
            ========================================== */}
        {activeTab === 'cloud' && (
          <motion.div
            key="cloud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-slate-300"
          >
            {/* Left side: cloud configuration parameters map */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5">
                  <Cloud className="w-5 h-5 text-violet-400" /> Amazon VPC Network Architecture Security Groups mapping
                </h3>

                {/* Cloud Topology SVG visualization map */}
                <div className="h-[300px] bg-slate-950 border border-slate-900 rounded-xl relative p-4 flex flex-col justify-between overflow-hidden">
                  {/* Internet Gateway */}
                  <div className="flex justify-between items-center z-10">
                    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                      <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <div className="font-mono text-[9px]">
                        <span className="text-slate-500 block uppercase font-bold">Public Traffic</span>
                        <span className="text-slate-200">0.0.0.0/0 Gateway</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerCloudRequest('HTTP')}
                        className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 rounded font-mono text-[9px] uppercase cursor-pointer transition-all"
                      >
                        Inbound HTTP (Port 80)
                      </button>
                      <button
                        onClick={() => triggerCloudRequest('SSH')}
                        className="px-2 py-1 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 rounded font-mono text-[9px] uppercase cursor-pointer transition-all"
                      >
                        Inbound SSH (Port 22)
                      </button>
                      <button
                        onClick={() => triggerCloudRequest('OUTBOUND')}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded font-mono text-[9px] uppercase cursor-pointer transition-all"
                      >
                        Outbound DB Sync
                      </button>
                    </div>
                  </div>

                  {/* Subnet grid space */}
                  <div className="grid grid-cols-2 gap-4 z-10">
                    {/* Public Subnet */}
                    <div className="border border-indigo-500/20 bg-indigo-500/5 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center border-b border-indigo-500/10 pb-1.5">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Public DMZ Subnet</span>
                        <span className="text-[8px] text-slate-500 font-mono">10.0.1.0/24</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <Server className="w-4.5 h-4.5 text-slate-400" />
                        <div className="font-mono text-[9px]">
                          <span className="text-slate-200 block">ALB-Cluster-LB</span>
                          <span className="text-slate-500">Security Group: SG-Web-LB</span>
                        </div>
                      </div>
                    </div>

                    {/* Private Subnet */}
                    <div className="border border-violet-500/20 bg-violet-500/5 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center border-b border-violet-500/10 pb-1.5">
                        <span className="text-[9px] font-mono text-violet-400 font-bold uppercase">Private DB Subnet</span>
                        <span className="text-[8px] text-slate-500 font-mono">10.0.2.0/24</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-850">
                        <Lock className="w-4.5 h-4.5 text-rose-400" />
                        <div className="font-mono text-[9px]">
                          <span className="text-slate-200 block">RDS-Postgres-Primary</span>
                          <span className="text-slate-500">Security Group: SG-Secure-DB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[8px] font-mono text-slate-500 uppercase text-center">
                    🔒 Subnet logical division protects backend RDS clusters from direct IP probing
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Security group rules configuration and firewall logs */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Security Group Policies
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-400">Inbound HTTP (Port 80)</span>
                    <input
                      type="checkbox"
                      checked={naclConfig.port80Allowed}
                      onChange={(e) => setNaclConfig({ ...naclConfig, port80Allowed: e.target.checked })}
                      className="accent-cyan-500"
                    />
                  </div>

                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-400">Inbound SSH (Port 22)</span>
                    <input
                      type="checkbox"
                      checked={naclConfig.port22Allowed}
                      onChange={(e) => setNaclConfig({ ...naclConfig, port22Allowed: e.target.checked })}
                      className="accent-cyan-500"
                    />
                  </div>

                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-slate-400">Egress Sync (Outbound)</span>
                    <input
                      type="checkbox"
                      checked={naclConfig.egressAllowed}
                      onChange={(e) => setNaclConfig({ ...naclConfig, egressAllowed: e.target.checked })}
                      className="accent-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Traffic activity logs */}
              <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                  VPC Traffic Flow Logs
                </h4>
                <div className="bg-slate-950 p-2 rounded border border-slate-850 h-[100px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 leading-normal">
                  {cloudTrafficLog.length === 0 ? (
                    <span className="text-slate-600 block text-center mt-5">Console ready. Dispatch inbound queries to audit cloud gateway.</span>
                  ) : (
                    cloudTrafficLog.map((log, idx) => (
                      <span key={idx} className={`block ${log.includes('ALLOWED') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {log}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
