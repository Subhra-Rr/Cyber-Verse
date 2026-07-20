import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Monitor, Laptop, Router, HardDrive, Shield, Eye, Server, 
  Globe, Cloud, Play, Trash2, Link, RotateCcw, AlertCircle, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'PC' | 'Laptop' | 'Router' | 'Switch' | 'Firewall' | 'IDS' | 'IPS' | 'Server' | 'DNS' | 'DHCP' | 'Cloud' | 'Internet';
  label: string;
  x: number;
  y: number;
}

interface NetworkLink {
  id: string;
  from: string;
  to: string;
}

export default function NetworkBuilder() {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: '1', type: 'PC', label: 'Workstation-A', x: 100, y: 150 },
    { id: '2', type: 'Switch', label: 'Core-Switch', x: 260, y: 150 },
    { id: '3', type: 'Firewall', label: 'Edge-Firewall', x: 420, y: 150 },
    { id: '4', type: 'Router', label: 'Gateway-Router', x: 580, y: 150 },
    { id: '5', type: 'Internet', label: 'WWW-Cloud', x: 740, y: 150 },
    { id: '6', type: 'Server', label: 'Prod-Server', x: 260, y: 280 },
  ]);

  const [links, setLinks] = useState<NetworkLink[]>([
    { id: 'l1', from: '1', to: '2' },
    { id: 'l2', from: '2', to: '3' },
    { id: 'l3', from: '3', to: '4' },
    { id: 'l4', from: '4', to: '5' },
    { id: 'l5', from: '2', to: '6' },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [linkingSourceId, setLinkingSourceId] = useState<string | null>(null);
  const [packetSourceId, setPacketSourceId] = useState<string | null>(null);
  const [packetDestId, setPacketDestId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [animatedPacket, setAnimatedPacket] = useState<{ x: number; y: number } | null>(null);
  const [packetType, setPacketType] = useState<'TCP' | 'UDP' | 'ICMP' | 'DNS' | 'DHCP'>('TCP');

  // Dragging states
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const deviceTypes = [
    { type: 'PC', icon: Monitor, desc: 'Client terminal workstation host' },
    { type: 'Laptop', icon: Laptop, desc: 'Mobile terminal host' },
    { type: 'Router', icon: Router, desc: 'Layer 3 packet routing gateway' },
    { type: 'Switch', icon: Network, desc: 'Layer 2 local frame switch' },
    { type: 'Firewall', icon: Shield, desc: 'Access Control traffic filtering shield' },
    { type: 'IDS', icon: Eye, desc: 'Passive intrusion detection system listener' },
    { type: 'IPS', icon: Shield, desc: 'Active intrusion prevention system' },
    { type: 'Server', icon: Server, desc: 'Application host server' },
    { type: 'DNS', icon: HardDrive, desc: 'Domain name resolution host' },
    { type: 'DHCP', icon: HardDrive, desc: 'Automatic dynamic IP assigner' },
    { type: 'Cloud', icon: Cloud, desc: 'External cloud cluster system' },
    { type: 'Internet', icon: Globe, desc: 'External world wide web gateway' },
  ] as const;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (draggingNodeId) return;
    setSelectedNodeId(null);
  };

  const addDevice = (type: typeof deviceTypes[number]['type']) => {
    const id = Date.now().toString();
    const label = `${type}-${nodes.filter(n => n.type === type).length + 1}`;
    
    // Put near center or slightly scattered
    const x = 200 + Math.random() * 200;
    const y = 100 + Math.random() * 150;

    setNodes(prev => [...prev, { id, type, label, x, y }]);
    setSimulationLogs(prev => [`Installed physical device: ${label} on local grid network`, ...prev]);
  };

  const removeSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
    setLinks(prev => prev.filter(l => l.from !== selectedNodeId && l.to !== selectedNodeId));
    if (packetSourceId === selectedNodeId) setPacketSourceId(null);
    if (packetDestId === selectedNodeId) setPacketDestId(null);
    setSelectedNodeId(null);
    setSimulationLogs(prev => ['Uninstalled hardware interface node and severed active copper cabled connections', ...prev]);
  };

  const startLinking = (id: string) => {
    setLinkingSourceId(id);
    setSimulationLogs(prev => [`Select target device to patch link cable from ${nodes.find(n => n.id === id)?.label}...`, ...prev]);
  };

  const completeLinking = (targetId: string) => {
    if (!linkingSourceId || linkingSourceId === targetId) {
      setLinkingSourceId(null);
      return;
    }

    // Check if link already exists
    const exists = links.some(
      l => (l.from === linkingSourceId && l.to === targetId) || (l.from === targetId && l.to === linkingSourceId)
    );

    if (exists) {
      setSimulationLogs(prev => ['Error: Hardware interfaces already connected with a local transmission bus', ...prev]);
      setLinkingSourceId(null);
      return;
    }

    const newLink: NetworkLink = {
      id: `l_${Date.now()}`,
      from: linkingSourceId,
      to: targetId
    };

    setLinks(prev => [...prev, newLink]);
    setSimulationLogs(prev => [
      `Cabled connection established between ${nodes.find(n => n.id === linkingSourceId)?.label} and ${nodes.find(n => n.id === targetId)?.label}`,
      ...prev
    ]);
    setLinkingSourceId(null);
  };

  const resetTopology = () => {
    setNodes([
      { id: '1', type: 'PC', label: 'Workstation-A', x: 100, y: 150 },
      { id: '2', type: 'Switch', label: 'Core-Switch', x: 260, y: 150 },
      { id: '3', type: 'Firewall', label: 'Edge-Firewall', x: 420, y: 150 },
      { id: '4', type: 'Router', label: 'Gateway-Router', x: 580, y: 150 },
      { id: '5', type: 'Internet', label: 'WWW-Cloud', x: 740, y: 150 },
      { id: '6', type: 'Server', label: 'Prod-Server', x: 260, y: 280 },
    ]);
    setLinks([
      { id: 'l1', from: '1', to: '2' },
      { id: 'l2', from: '2', to: '3' },
      { id: 'l3', from: '3', to: '4' },
      { id: 'l4', from: '4', to: '5' },
      { id: 'l5', from: '2', to: '6' },
    ]);
    setSelectedNodeId(null);
    setLinkingSourceId(null);
    setPacketSourceId(null);
    setPacketDestId(null);
    setSimulationLogs(['Reverted to standard enterprise network topology base configuration.']);
  };

  const runPacketTrace = async () => {
    if (!packetSourceId || !packetDestId) {
      setSimulationLogs(prev => ['Error: Select packet SOURCE host and DESTINATION host first.', ...prev]);
      return;
    }
    if (packetSourceId === packetDestId) {
      setSimulationLogs(prev => ['Error: Packet source and destination cannot be the same device.', ...prev]);
      return;
    }

    setIsSimulating(true);
    setSimulationLogs(prev => [`[INIT] Drafting packet sequence: Type=${packetType} from ${nodes.find(n => n.id === packetSourceId)?.label} to ${nodes.find(n => n.id === packetDestId)?.label}...`, ...prev]);

    // Simple path finding algorithm (Breadth-First Search)
    const adj: { [key: string]: string[] } = {};
    nodes.forEach(n => { adj[n.id] = []; });
    links.forEach(l => {
      adj[l.from].push(l.to);
      adj[l.to].push(l.from);
    });

    const queue: string[][] = [[packetSourceId]];
    const visited = new Set([packetSourceId]);
    let path: string[] | null = null;

    while (queue.length > 0) {
      const currPath = queue.shift()!;
      const lastNode = currPath[currPath.length - 1];

      if (lastNode === packetDestId) {
        path = currPath;
        break;
      }

      for (const neighbor of adj[lastNode] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...currPath, neighbor]);
        }
      }
    }

    if (!path) {
      setSimulationLogs(prev => [
        `[DROP] Routing path failure. No cable links exist to bridge ${nodes.find(n => n.id === packetSourceId)?.label} to ${nodes.find(n => n.id === packetDestId)?.label}!`,
        ...prev
      ]);
      setIsSimulating(false);
      return;
    }

    // Animate across path
    for (let i = 0; i < path.length; i++) {
      const currNodeId = path[i];
      const currNode = nodes.find(n => n.id === currNodeId)!;
      
      // Update logs explaining current hop
      const hopExplain = getHopExplanation(currNode, i === 0, i === path.length - 1, packetType);
      setSimulationLogs(prev => [hopExplain, ...prev]);

      // Move packet visually
      setAnimatedPacket({ x: currNode.x, y: currNode.y });
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setAnimatedPacket(null);
    setIsSimulating(false);
    setSimulationLogs(prev => [`[SUCCESS] Transmission complete. Packet delivered safely to ${nodes.find(n => n.id === packetDestId)?.label}.`, ...prev]);
  };

  const getHopExplanation = (node: NetworkNode, isSrc: boolean, isDest: boolean, type: string) => {
    const time = new Date().toLocaleTimeString();
    if (isSrc) {
      return `[${time}] [TX] Host ${node.label} encapsulates raw payload data into standard ${type} headers and initiates frame dispatch.`;
    }
    if (isDest) {
      return `[${time}] [RX] Destination Host ${node.label} decapsulates and accepts ${type} packet payload successfully!`;
    }

    switch (node.type) {
      case 'Router':
        return `[${time}] [ROUTE] L3 Gateway Router "${node.label}" inspects target IP address, checks local routing table, and decrements TTL parameter.`;
      case 'Switch':
        return `[${time}] [SWITCH] L2 Switch "${node.label}" checks destination MAC address in SAT table, forwards frame to corresponding physical interface port.`;
      case 'Firewall':
        return `[${time}] [SHIELD] Edge-Firewall "${node.label}" parses state, maps matching active TCP connections list, checks ACL filters: PASS/ALLOW.`;
      case 'IDS':
        return `[${time}] [MONITOR] IDS Mirror Port "${node.label}" sniffs packet copy passively, runs signature audits (Snort Engine reports: 0 anomalies).`;
      case 'IPS':
        return `[${time}] [GUARD] IPS Inline Guard "${node.label}" parses headers, runs deep packet inspection (DPI) heuristics, passes security check.`;
      case 'DNS':
        return `[${time}] [RESOLVER] DNS Host "${node.label}" matches query string request, returns A-record IP mapping output.`;
      case 'DHCP':
        return `[${time}] [SERVER] DHCP Host "${node.label}" replies with DHCP Offer assigning IP address leases dynamically.`;
      default:
        return `[${time}] [TRANSIT] Intermediate Node "${node.label}" relays packet data frame down the wire interface.`;
    }
  };

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, e.clientY - rect.top));

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x, y } : n));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  return (
    <div className="space-y-6" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Page Title */}
      <div className="border-b border-slate-900 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="w-5.5 h-5.5 text-cyan-400" /> Interactive Network Topology Builder
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Drag, place, link hardware devices, and dispatch simulated packets to learn Layer 2 switching, Layer 3 routing, and Edge firewall policies.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Side Palette */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
              Hardware Inventory
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              Click any networking component below to install it into your active simulation sandbox grid space.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {deviceTypes.map((device) => {
                const Icon = device.icon;
                return (
                  <button
                    key={device.type}
                    onClick={() => addDevice(device.type)}
                    className="p-2.5 bg-slate-950/80 border border-slate-850 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 rounded-xl transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
                  >
                    <div className="p-1.5 bg-slate-900 rounded-lg group-hover:bg-cyan-500/10 transition-all border border-slate-800">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold">{device.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controller Operations Panel */}
          <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
              Trace Settings
            </h3>

            <div className="space-y-3">
              {/* Packet Selection */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Packet Type</label>
                <select
                  value={packetType}
                  onChange={(e) => setPacketType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                >
                  <option value="TCP">TCP (Three-Way SYN)</option>
                  <option value="UDP">UDP (DNS Resolution Request)</option>
                  <option value="ICMP">ICMP (Ping Utility Probe)</option>
                  <option value="DNS">DNS Query A-Record</option>
                  <option value="DHCP">DHCP Offer Lease Address</option>
                </select>
              </div>

              {/* Source & Dest Selection */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Source Host</label>
                  <select
                    value={packetSourceId || ''}
                    onChange={(e) => setPacketSourceId(e.target.value || null)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[10px] text-white font-mono"
                  >
                    <option value="">-- Select --</option>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Destination Host</label>
                  <select
                    value={packetDestId || ''}
                    onChange={(e) => setPacketDestId(e.target.value || null)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[10px] text-white font-mono"
                  >
                    <option value="">-- Select --</option>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Controls */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={runPacketTrace}
                  disabled={isSimulating || !packetSourceId || !packetDestId}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 disabled:bg-slate-800 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  {isSimulating ? 'Tracing Hop...' : 'Animate Packet Flow'}
                </button>
                <button
                  onClick={resetTopology}
                  className="w-full py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas & Diagnostics logs */}
        <div className="xl:col-span-3 space-y-6">
          {/* Active Canvas space */}
          <div className="bg-slate-900/40 rounded-2xl border border-slate-900 p-2 relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                LAN Map Canvas Grid space
              </span>
            </div>

            {/* Quick Actions overlay */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {selectedNodeId && (
                <>
                  <button
                    onClick={() => startLinking(selectedNodeId)}
                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 rounded-lg text-[9px] font-mono font-bold uppercase flex items-center gap-1.5 transition-all"
                  >
                    <Link className="w-3.5 h-3.5" />
                    Patch Cable Link
                  </button>
                  <button
                    onClick={removeSelectedNode}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg text-[9px] font-mono font-bold uppercase flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Uninstall
                  </button>
                </>
              )}
            </div>

            {/* Canvas grid container */}
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="h-[400px] bg-slate-950 rounded-xl border border-slate-900 relative overflow-hidden select-none cursor-crosshair"
              style={{
                backgroundImage: 'radial-gradient(rgba(8,47,73,0.15) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Link Cables */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {links.map((link) => {
                  const fromNode = nodes.find((n) => n.id === link.from);
                  const toNode = nodes.find((n) => n.id === link.to);
                  if (!fromNode || !toNode) return null;
                  return (
                    <g key={link.id}>
                      {/* Outer neon glow tube line */}
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#0e7490"
                        strokeWidth="4"
                        strokeOpacity="0.25"
                      />
                      {/* Inner copper cable link line */}
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Animated Packet visual */}
              {animatedPacket && (
                <motion.div
                  className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center text-[7px] font-mono font-black text-slate-950 z-30"
                  style={{ x: animatedPacket.x - 8, y: animatedPacket.y - 8 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                >
                  ✉
                </motion.div>
              )}

              {/* Linking target line indication */}
              {linkingSourceId && (
                <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none border border-cyan-500/20 rounded-xl flex items-center justify-center z-10">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 animate-pulse bg-slate-950/80 px-3 py-1.5 border border-cyan-500/30 rounded-xl">
                    ⚡ Patching network link wire: Click destination device interface
                  </span>
                </div>
              )}

              {/* Nodes element mapping */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isSource = packetSourceId === node.id;
                const isDest = packetDestId === node.id;
                const isTargetOfLink = linkingSourceId !== null && linkingSourceId !== node.id;
                
                const device = deviceTypes.find(d => d.type === node.type)!;
                const Icon = device.icon;

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (linkingSourceId) {
                        completeLinking(node.id);
                      }
                    }}
                    className={`absolute p-2 rounded-xl border flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing transition-all select-none z-20 ${
                      isSelected 
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]' 
                        : isSource
                        ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        : isDest
                        ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        : isTargetOfLink
                        ? 'bg-slate-900 border-cyan-500/40 animate-pulse hover:border-cyan-400'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                    style={{ left: node.x - 36, top: node.y - 36, width: '72px' }}
                  >
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <Icon className={`w-4 h-4 ${
                        isSelected ? 'text-cyan-400' : isSource ? 'text-emerald-400' : isDest ? 'text-rose-400' : 'text-slate-300'
                      }`} />
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-300 truncate max-w-full" title={node.label}>
                      {node.label}
                    </span>
                    {/* Source / Dest tags */}
                    {isSource && (
                      <span className="absolute -top-3.5 bg-emerald-500 text-slate-950 font-bold font-mono text-[7px] px-1 rounded uppercase">
                        Src
                      </span>
                    )}
                    {isDest && (
                      <span className="absolute -top-3.5 bg-rose-500 text-slate-100 font-bold font-mono text-[7px] px-1 rounded uppercase">
                        Dest
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostics console logs block */}
          <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
              Diagnostics Tracer Console logs
            </h3>
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 h-[140px] overflow-y-auto font-mono text-[10px] space-y-1.5 text-slate-400">
              {simulationLogs.length === 0 ? (
                <div className="text-slate-600 text-center py-10">Console ready. Dispatch a packet trace to monitor hopping diagnostics.</div>
              ) : (
                simulationLogs.map((log, idx) => {
                  let colorClass = 'text-slate-400';
                  if (log.includes('[TX]')) colorClass = 'text-cyan-400 font-bold';
                  else if (log.includes('[RX]')) colorClass = 'text-emerald-400 font-bold';
                  else if (log.includes('[ROUTE]')) colorClass = 'text-indigo-400';
                  else if (log.includes('[SHIELD]')) colorClass = 'text-teal-400';
                  else if (log.includes('[SWITCH]')) colorClass = 'text-purple-400';
                  else if (log.includes('[DROP]') || log.includes('Error')) colorClass = 'text-rose-400 font-bold';
                  else if (log.includes('[SUCCESS]')) colorClass = 'text-emerald-400 font-extrabold border-b border-emerald-950 pb-1.5';
                  return (
                    <div key={idx} className={`leading-normal border-l-2 border-slate-800 pl-2 py-0.5 ${colorClass}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
