import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Landmark, HeartPulse, HardDrive, ShieldAlert, BookOpen, GraduationCap, 
  Plane, Home, Factory, ShieldCheck, AlertTriangle, Cpu, Terminal, Key, Network, Wrench, Play
} from 'lucide-react';

interface BuildingInfo {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  x: number; // SVG Placement
  y: number;
  width: number;
  height: number;
  color: string;
  borderColor: string;
  threats: string[];
  vulnerabilities: string[];
  controls: string[];
  bestPractices: string[];
  interactiveChallenge: {
    title: string;
    description: string;
    instructions: string;
    gameType: 'encryption' | 'segmentation' | 'password' | 'iot-patch';
    targetState: any;
  };
}

const buildingsData: BuildingInfo[] = [
  {
    id: 'bank',
    name: 'Apex National Bank',
    icon: Landmark,
    x: 80,
    y: 160,
    width: 100,
    height: 90,
    color: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400',
    threats: [
      'Ransomware locker targeting core ledgers',
      'Man-in-the-Middle (MitM) intercepting API requests',
      'Credential stuffing on consumer portals',
      'SWIFT transactional wire fraud attempts'
    ],
    vulnerabilities: [
      'Unparameterized SQL queries in wire gateway',
      'Weak API signature keys lacking OAuth2 rotation',
      'TLS 1.0 supported on outer perimeter gateways'
    ],
    controls: [
      'Web Application Firewall (WAF) rule sets filtering payloads',
      'Hardware Security Modules (HSM) signing transaction blocks',
      'Strict multi-factor authentication (MFA) for wire desks'
    ],
    bestPractices: [
      'Enforce zero-trust JWT token expirations',
      'Continuous reconciliation audits on ledger records',
      'Establish real-time fraud alerts with ML anomaly scoring'
    ],
    interactiveChallenge: {
      title: 'Intercept & Encrypt Transaction Payload',
      description: 'The bank API is sending raw unencrypted wire transfer packets across the wire. Prevent packet sniffing!',
      instructions: 'Click the toggle switches to activate SSL Handshake and Symmetric Encryption keys on the bank server.',
      gameType: 'encryption',
      targetState: { ssl: true, aes: true }
    }
  },
  {
    id: 'hospital',
    name: 'St. Jude Digital Health',
    icon: HeartPulse,
    x: 220,
    y: 80,
    width: 110,
    height: 100,
    color: 'bg-rose-500/10 hover:bg-rose-500/20',
    borderColor: 'border-rose-500/30 hover:border-rose-400',
    threats: [
      'Medical IoT life-support telemetry manipulation',
      'Ransomware encryption of Electronic Health Records (EHR)',
      'Legacy operating system vulnerability exploits',
      'Social engineering attacks on emergency triage nurses'
    ],
    vulnerabilities: [
      'Unsegmented flat hospital subnet (Wi-Fi links to infusion pumps)',
      'Default root creds left active on CT scan software dashboards',
      'Missing security patch updates on Windows 7 nursing terminals'
    ],
    controls: [
      'Network segmentation (VLAN micro-isolation of patient systems)',
      'Endpoint Detection and Response (EDR) blocking ransomware signatures',
      'Immutable daily cloud database backups of EHR registries'
    ],
    bestPractices: [
      'Zero-trust network access (ZTNA) requiring posture checks',
      'Perform medical IoT firmware authenticity reviews',
      'Enforce automatic screen timeouts on patient room displays'
    ],
    interactiveChallenge: {
      title: 'Isolate Medical IoT Infusion Pumps',
      description: 'An attacker has entered the visitor Wi-Fi network and is scanning for unsegmented infusion pumps. You must isolate them!',
      instructions: 'Select the "VLAN Segment: Medical Care" option to group the Infusion Pumps separately from visitor Wi-Fi.',
      gameType: 'segmentation',
      targetState: { isolated: true }
    }
  },
  {
    id: 'datacenter',
    name: 'Titan Cloud DataCenter',
    icon: HardDrive,
    x: 380,
    y: 180,
    width: 120,
    height: 100,
    color: 'bg-cyan-500/10 hover:bg-cyan-500/20',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    threats: [
      'DDoS packet floods exhausting hypervisor NIC bandwidths',
      'Container breakout exploits escalating to host hypervisors',
      'Physical social engineering tailgating security turnstiles',
      'Misconfigured storage buckets leaking raw client snapshots'
    ],
    vulnerabilities: [
      'Shared kernel memory architectures in host virtual environments',
      'Lax IAM credentials left open for public write requests',
      'Insufficient multi-tenant boundary checks in internal routing protocols'
    ],
    controls: [
      'Anti-DDoS routing scrubbers filtering inbound packet storms',
      'Strict RBAC least-privilege IAM storage policies',
      'Biometric MFA checkpoints at every physical rack server cage'
    ],
    bestPractices: [
      'Automate Infrastructure-as-Code (IaC) configuration audits',
      'Use isolated hypervisors with secure enclave processors',
      'Enforce complete data encryption-at-rest (AES-256) on raw SAN arrays'
    ],
    interactiveChallenge: {
      title: 'Mitigate DDoS Bandwidth Flood',
      description: 'Incoming fake SYN packets are flooding the primary NIC of Host VM 03, threatening a cluster-wide crash.',
      instructions: 'Set the scrubbing rate filter limit to 500 packets/sec to mitigate the traffic spike.',
      gameType: 'password', // repurposed for slider
      targetState: { limit: 500 }
    }
  },
  {
    id: 'government',
    name: 'Federal Intelligence Center',
    icon: ShieldCheck,
    x: 540,
    y: 100,
    width: 130,
    height: 110,
    color: 'bg-violet-500/10 hover:bg-violet-500/20',
    borderColor: 'border-violet-500/30 hover:border-violet-400',
    threats: [
      'State-sponsored Advanced Persistent Threats (APTs) cyber espionage',
      'Insider threat leakage of classified compartmentalized files',
      'Watering hole exploits tracking policy analyst browsing habits',
      'Supply chain backdoors planted in government hardware'
    ],
    vulnerabilities: [
      'Legacy protocol usage (unencrypted LDAP active for directories)',
      'Unvetted open-source libraries baked into federal secure software',
      'Lack of granular file encryption in multi-department servers'
    ],
    controls: [
      'Airgapped classified data networks (completely detached physical cables)',
      'Strict mandatory access controls (MAC) for multi-level security',
      'Data Loss Prevention (DLP) agents blocking USB drives'
    ],
    bestPractices: [
      'Perform comprehensive background audits on all key systems personnel',
      'Deploy code signing requirements for all deployable scripts',
      'Isolate all public-facing services from local command networks'
    ],
    interactiveChallenge: {
      title: 'Block Suspicious USB File Exfiltration',
      description: 'An insider has plugged an unvetted USB key into a workstation to download classified military intelligence.',
      instructions: 'Engage the "Workstation DLP Rule: Block Mass Storage" control to force eject the mount.',
      gameType: 'iot-patch',
      targetState: { dlpBlock: true }
    }
  },
  {
    id: 'airport',
    name: 'Skylink International Airport',
    icon: Plane,
    x: 100,
    y: 320,
    width: 140,
    height: 90,
    color: 'bg-sky-500/10 hover:bg-sky-500/20',
    borderColor: 'border-sky-500/30 hover:border-sky-400',
    threats: [
      'Unauthenticated ADS-B flight transponder telemetry spoofing',
      'Wi-Fi rogue access points hijacking crew scheduling portals',
      'Ransomware taking down terminal baggage sorting conveyor systems',
      'Bypassing airport badge terminals with cloned RFID credentials'
    ],
    vulnerabilities: [
      'Legacy serial protocols (RS-232/485) lacking authentication controls',
      'Missing rate limiting on terminal boarding gateway switches',
      'Unencrypted radio communications on standard ATC links'
    ],
    controls: [
      'RF intrusion tracking systems scanning for transponder anomalies',
      'Strict network segments separating flight critical loops from visitor portals',
      'Mutual cryptographic badge handshakes with secure smart card microchips'
    ],
    bestPractices: [
      'Conduct regular red-team penetration tests of boarding environments',
      'Isolate staff wireless access from baggage and fuel automation',
      'Develop real-time alternative manual systems checklists'
    ],
    interactiveChallenge: {
      title: 'Defuse ADS-B Telemetry Spoofing',
      description: 'A rogue transmitter is broadcasting ghost aircraft coordinates to the ground control ATC console.',
      instructions: 'Enable cryptographic verification checking (ADS-B Crypto-Auth) to filter spoofed packets.',
      gameType: 'encryption',
      targetState: { authVerify: true, radioEncrypt: true }
    }
  },
  {
    id: 'factory',
    name: 'Nexus Smart Assembly',
    icon: Factory,
    x: 290,
    y: 310,
    width: 130,
    height: 100,
    color: 'bg-amber-500/10 hover:bg-amber-500/20',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
    threats: [
      'ICS/SCADA Modbus command injection tampering with centrifuge speeds',
      'Malicious PLC firmware injection targeting boiler limit safety switches',
      'IP theft of industrial automation custom assembly robotics G-code',
      'Replay attacks of historical factory automation packets'
    ],
    vulnerabilities: [
      'Lack of encryption or sign-off keys in legacy Modbus protocols',
      'Centrally bridged IT and OT network interfaces',
      'Default telnet or web UI passwords active on remote terminal units'
    ],
    controls: [
      'Industrial Firewalls tracking Modbus payload packet deep contents (DPI)',
      'Strict unidirectional security diodes preventing IT to OT file routes',
      'Harden OT environments by keeping vital valves physically isolated'
    ],
    bestPractices: [
      'Conduct daily cryptographic hash checks on PLC program code blocks',
      'Establish strict security baselines for all automation configurations',
      'Regularly drill emergency physical shutdown drills'
    ],
    interactiveChallenge: {
      title: 'Harden PLC centifuge controllers',
      description: 'centrifuges are receiving anomalous telemetry packets telling them to exceed maximum physical speed levels.',
      instructions: 'Deploy deep packet inspection (DPI Modbus Guard) to drop unauthenticated register commands.',
      gameType: 'iot-patch',
      targetState: { dpiActive: true }
    }
  },
  {
    id: 'smarthome',
    name: 'Sentry Connected Smart Home',
    icon: Home,
    x: 470,
    y: 330,
    width: 90,
    height: 80,
    color: 'bg-teal-500/10 hover:bg-teal-500/20',
    borderColor: 'border-teal-500/30 hover:border-teal-400',
    threats: [
      'Rogue security camera streaming leaked to outer public web hubs',
      'Brute force attacks on smart door lock login servers',
      'Compromised smart appliances used in massive global IoT botnets'
    ],
    vulnerabilities: [
      'Default admin passwords baked into CCTV manufacturer firmware',
      'Universal Plug and Play (UPnP) automatically routing ports to public IP',
      'Lack of updates for local router DNS poisoning bugs'
    ],
    controls: [
      'Strong unique administration password configurations on local networks',
      'Disabling UPnP on the primary WAN gateway',
      'Creating a separate IoT-only isolated SSID/VLAN route'
    ],
    bestPractices: [
      'Ensure automatic firmware updates are engaged for all IoT items',
      'Perform regular Wi-Fi security credential updates',
      'Limit physical cloud connections where purely local control suffices'
    ],
    interactiveChallenge: {
      title: 'Secure IoT Camera Default Credentials',
      description: 'The smart camera has a default password of "admin123", leaving its feeds wide open to global search portals.',
      instructions: 'Enter a strong, custom 8+ character key with alphanumeric characters.',
      gameType: 'password',
      targetState: { passwordStrength: 'Strong' }
    }
  },
  {
    id: 'school',
    name: 'Metro Tech High School',
    icon: GraduationCap,
    x: 610,
    y: 240,
    width: 110,
    height: 90,
    color: 'bg-indigo-500/10 hover:bg-indigo-500/20',
    borderColor: 'border-indigo-500/30 hover:border-indigo-400',
    threats: [
      'Student database leakage of private medical or grade records',
      'Phishing emails mimicking principal demanding emergency gift cards',
      'DDoS attacks targeting student portals to delay exam submissions',
      'Ransomware blocking local library textbook databases'
    ],
    vulnerabilities: [
      'Insecure direct object reference (IDOR) on student profile portal',
      'Missing rate limit safety thresholds on grades administration form',
      'Weak spam security filters active on institutional email routes'
    ],
    controls: [
      'Secure spam proxy gateway scanning files in incoming emails',
      'Conducting secure application reviews of grading portal code',
      'Enforcing strict boundaries on student network user rights'
    ],
    bestPractices: [
      'Provide regular staff cybersecurity phishing awareness training',
      'Isolate school administration servers from open public student libraries',
      'Regularly audit web portal logs for brute-force access attempts'
    ],
    interactiveChallenge: {
      title: 'DDoS Defense Threshold Segmenter',
      description: 'The student portal is getting overloaded with fake request traffic. We need to segment student access away from administrative database ports.',
      instructions: 'Enable network subnet isolation filters to block remote untrusted scans.',
      gameType: 'segmentation',
      targetState: { limit: 200 }
    }
  }
];

export default function CyberCity() {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(buildingsData[0]);
  const [activeTab, setActiveTab] = useState<'info' | 'interact'>('info');

  // Interactive challenge states
  const [encryptionSSL, setEncryptionSSL] = useState(false);
  const [encryptionAES, setEncryptionAES] = useState(false);

  const [vlanIsolated, setVlanIsolated] = useState(false);

  const [ddosLimit, setDdosLimit] = useState(1000);

  const [dlpBlockActive, setDlpBlockActive] = useState(false);

  const [adsbAuth, setAdsbAuth] = useState(false);
  const [adsbRadio, setAdsbRadio] = useState(false);

  const [factoryDpi, setFactoryDpi] = useState(false);

  const [smartPassword, setSmartPassword] = useState('');
  const [smartPassStrength, setSmartPassStrength] = useState('Weak');

  const [challengeCompleted, setChallengeCompleted] = useState<{[key: string]: boolean}>({});
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  const checkPasswordStrength = (pass: string) => {
    setSmartPassword(pass);
    if (pass.length > 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
      setSmartPassStrength('Strong');
    } else if (pass.length >= 6) {
      setSmartPassStrength('Medium');
    } else {
      setSmartPassStrength('Weak');
    }
  };

  const handleRunChallenge = (buildingId: string) => {
    let completed = false;
    if (buildingId === 'bank') {
      if (encryptionSSL && encryptionAES) completed = true;
    } else if (buildingId === 'hospital') {
      if (vlanIsolated) completed = true;
    } else if (buildingId === 'datacenter') {
      if (ddosLimit <= 500) completed = true;
    } else if (buildingId === 'government') {
      if (dlpBlockActive) completed = true;
    } else if (buildingId === 'airport') {
      if (adsbAuth && adsbRadio) completed = true;
    } else if (buildingId === 'factory') {
      if (factoryDpi) completed = true;
    } else if (buildingId === 'smarthome') {
      if (smartPassStrength === 'Strong') completed = true;
    }

    if (completed) {
      setChallengeCompleted(prev => ({ ...prev, [buildingId]: true }));
      setScoreNotification('Success! Simulation complete. Threat neutralized (+25 XP)');
      setTimeout(() => setScoreNotification(null), 4000);
    } else {
      alert('Security configurations not yet sufficient. review instructions and retry!');
    }
  };

  const resetChallenge = (id: string) => {
    if (id === 'bank') {
      setEncryptionSSL(false);
      setEncryptionAES(false);
    } else if (id === 'hospital') {
      setVlanIsolated(false);
    } else if (id === 'datacenter') {
      setDdosLimit(1000);
    } else if (id === 'government') {
      setDlpBlockActive(false);
    } else if (id === 'airport') {
      setAdsbAuth(false);
      setAdsbRadio(false);
    } else if (id === 'factory') {
      setFactoryDpi(false);
    } else if (id === 'smarthome') {
      setSmartPassword('');
      setSmartPassStrength('Weak');
    }
    setChallengeCompleted(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div id="cyber-city-root" className="space-y-6">
      {/* Header Panel */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5.5 h-5.5 text-cyan-400" /> Digital Twin Cyber City
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            An interactive multi-sector smart city model. Inspect real-world infrastructure systems, analyze sector threats, vulnerabilities, controls, and patch live simulation challenges.
          </p>
        </div>
      </div>

      {scoreNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-mono font-bold animate-pulse text-center">
          {scoreNotification}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Interactive SVG Twin City Map - Left Column (Col span 2) */}
        <div className="xl:col-span-2 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />

          <div>
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Network className="w-4 h-4 text-cyan-400 animate-spin-slow" /> Sector Map - Active SCADA Grid
              </span>
              <span className="text-[9px] font-mono text-slate-500">Click any sector node to view intelligence records</span>
            </div>

            {/* City Grid SVG Layer */}
            <div className="relative w-full overflow-hidden rounded-xl border border-slate-950 bg-slate-950/80 p-1 flex justify-center">
              <svg viewBox="0 0 800 450" className="w-full max-w-4xl h-auto">
                {/* Cyberpunk Grid Lines */}
                <g className="stroke-slate-900/50 stroke-1 pointer-events-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line key={`x-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" />
                  ))}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line key={`y-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
                  ))}
                </g>

                {/* Simulated Data Streams connecting sectors */}
                <path d="M 130 205 L 275 130 L 440 230 L 605 155" className="fill-none stroke-cyan-500/20 stroke-1 stroke-dasharray-[5,5] animate-dash" />
                <path d="M 170 365 L 355 360 L 515 370 L 665 285" className="fill-none stroke-rose-500/20 stroke-1 stroke-dasharray-[5,5] animate-dash" />

                {/* Interactive Building Nodes */}
                {buildingsData.map((b) => {
                  const IconComponent = b.icon;
                  const isSelected = selectedBuilding?.id === b.id;
                  const isChCompleted = challengeCompleted[b.id];

                  return (
                    <g 
                      key={b.id} 
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedBuilding(b);
                        setActiveTab('info');
                      }}
                    >
                      {/* Outer boundary glow */}
                      <rect 
                        x={b.x} 
                        y={b.y} 
                        width={b.width} 
                        height={b.height} 
                        rx="12" 
                        className={`transition-all duration-300 fill-slate-950 stroke-2 ${
                          isSelected 
                            ? 'stroke-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                            : isChCompleted 
                            ? 'stroke-emerald-500'
                            : 'stroke-slate-800 group-hover:stroke-cyan-500/50'
                        }`}
                      />

                      {/* Inner accent category fill */}
                      <rect 
                        x={b.x + 3} 
                        y={b.y + 3} 
                        width={b.width - 6} 
                        height={b.height - 6} 
                        rx="9" 
                        className={`transition-colors duration-300 ${
                          isSelected ? 'fill-cyan-500/5' : 'fill-transparent'
                        }`}
                      />

                      {/* Icon Container */}
                      <g transform={`translate(${b.x + b.width/2 - 14}, ${b.y + b.height/2 - 25})`}>
                        <rect width="28" height="28" rx="6" className="fill-slate-900 border border-slate-800" />
                        <foreignObject width="28" height="28" className="text-slate-400">
                          <div className={`w-full h-full flex items-center justify-center p-1 ${isSelected ? 'text-cyan-400' : isChCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                        </foreignObject>
                      </g>

                      {/* Text details labels */}
                      <text 
                        x={b.x + b.width/2} 
                        y={b.y + b.height - 15} 
                        className={`font-mono text-[9px] font-bold ${
                          isSelected ? 'fill-cyan-400' : isChCompleted ? 'fill-emerald-400' : 'fill-slate-400'
                        }`} 
                        textAnchor="middle"
                      >
                        {b.name.split(' ')[0]}
                      </text>

                      {/* Tiny active vulnerability scanner dot */}
                      <circle 
                        cx={b.x + b.width - 15} 
                        cy={b.y + 15} 
                        r="3.5" 
                        className={`${
                          isChCompleted 
                            ? 'fill-emerald-400' 
                            : isSelected 
                            ? 'fill-cyan-400 animate-ping' 
                            : 'fill-rose-500 animate-pulse'
                        }`} 
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-900 rounded-xl text-[10px] font-mono text-slate-500 leading-normal mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Active Grid Telemetry: <strong>8 SCADA nodes synced</strong>
            </span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Threat Active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Selected Node</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Hardened (Secured)</span>
            </div>
          </div>
        </div>

        {/* Intelligence Side Desk Panel - Right Column (Col span 1) */}
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500" />

          {selectedBuilding ? (
            <div className="space-y-4">
              {/* Node Title header */}
              <div className="flex items-start gap-3 border-b border-slate-900 pb-3">
                <div className="w-10 h-10 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 shrink-0">
                  <selectedBuilding.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm leading-tight">{selectedBuilding.name}</h3>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Telemetry: SCADA_ADDR_{selectedBuilding.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Panel Sub Tab select buttons */}
              <div className="flex bg-slate-950 p-1 border border-slate-900 rounded-xl font-mono text-[9px] w-full">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                    activeTab === 'info' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Info Desk
                </button>
                {selectedBuilding.interactiveChallenge && (
                  <button
                    onClick={() => setActiveTab('interact')}
                    className={`flex-1 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                      activeTab === 'interact' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 mx-auto mb-0.5 block" /> Live Mitigation
                  </button>
                )}
              </div>

              {/* Sub-view Content render */}
              <AnimatePresence mode="wait">
                {activeTab === 'info' ? (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 text-xs font-sans leading-relaxed"
                  >
                    {/* Threats */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Cyber Threats
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {selectedBuilding.threats.map((t, idx) => (
                          <li key={idx} className="marker:text-rose-500">{t}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Vulnerabilities */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Vulnerabilities (CVE Risks)
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {selectedBuilding.vulnerabilities.map((v, idx) => (
                          <li key={idx} className="marker:text-amber-500">{v}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Security Controls */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Active Controls
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {selectedBuilding.controls.map((c, idx) => (
                          <li key={idx} className="marker:text-cyan-400">{c}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Best Practices */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Hardening Best Practices
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        {selectedBuilding.bestPractices.map((b, idx) => (
                          <li key={idx} className="marker:text-violet-500">{b}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  /* INTERACTIVE SIMULATION CHALLENGE PANEL */
                  <motion.div
                    key="challenge"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-4 font-mono text-[11px]"
                  >
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-slate-400">
                      <strong className="text-cyan-400 text-xs block mb-1">
                        Task: {selectedBuilding.interactiveChallenge.title}
                      </strong>
                      <p className="leading-relaxed mb-2">
                        {selectedBuilding.interactiveChallenge.description}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-normal border-t border-slate-900 pt-2">
                        <strong>Goal:</strong> {selectedBuilding.interactiveChallenge.instructions}
                      </p>
                    </div>

                    {/* Render corresponding controls based on challenge type */}
                    {selectedBuilding.id === 'bank' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span>Enable TLS SSL Handshake</span>
                          <input 
                            type="checkbox" 
                            checked={encryptionSSL} 
                            onChange={(e) => setEncryptionSSL(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Activate AES-256 GCM Payload Encryptor</span>
                          <input 
                            type="checkbox" 
                            checked={encryptionAES} 
                            onChange={(e) => setEncryptionAES(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBuilding.id === 'hospital' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span>Microsegment Infusion pumps (VLAN isolation)</span>
                          <input 
                            type="checkbox" 
                            checked={vlanIsolated} 
                            onChange={(e) => setVlanIsolated(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBuilding.id === 'datacenter' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>NIC Rate Limit (packets/sec)</span>
                            <span className="text-cyan-400 font-bold">{ddosLimit} p/s</span>
                          </div>
                          <input 
                            type="range" 
                            min="200" 
                            max="2000" 
                            step="100"
                            value={ddosLimit} 
                            onChange={(e) => setDdosLimit(parseInt(e.target.value))}
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBuilding.id === 'government' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span>Workstation DLP Mass Storage Block</span>
                          <input 
                            type="checkbox" 
                            checked={dlpBlockActive} 
                            onChange={(e) => setDlpBlockActive(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBuilding.id === 'airport' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span>ADS-B Cryptographic Verification</span>
                          <input 
                            type="checkbox" 
                            checked={adsbAuth} 
                            onChange={(e) => setAdsbAuth(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Encrypt Radar communications</span>
                          <input 
                            type="checkbox" 
                            checked={adsbRadio} 
                            onChange={(e) => setAdsbRadio(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBuilding.id === 'factory' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center">
                          <span>DPI Modbus Centrifuge guard</span>
                          <input 
                            type="checkbox" 
                            checked={factoryDpi} 
                            onChange={(e) => setFactoryDpi(e.target.checked)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBuilding.id === 'smarthome' && (
                      <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
                        <div className="space-y-1">
                          <span>Change camera password</span>
                          <input 
                            type="text" 
                            value={smartPassword} 
                            onChange={(e) => checkPasswordStrength(e.target.value)}
                            placeholder="Type a highly secure key..."
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-100"
                          />
                          <div className="flex justify-between text-[10px] mt-1">
                            <span>Strength:</span>
                            <span className={
                              smartPassStrength === 'Strong' ? 'text-emerald-400' : smartPassStrength === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                            }>{smartPassStrength}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => resetChallenge(selectedBuilding.id)}
                        className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 rounded-lg cursor-pointer text-center"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => handleRunChallenge(selectedBuilding.id)}
                        disabled={challengeCompleted[selectedBuilding.id]}
                        className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer text-slate-950 transition-all ${
                          challengeCompleted[selectedBuilding.id]
                            ? 'bg-slate-800 border border-slate-700 text-slate-500'
                            : 'bg-cyan-500 hover:bg-cyan-400 hover:scale-[1.02]'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" /> Deploy Patch
                      </button>
                    </div>

                    {challengeCompleted[selectedBuilding.id] && (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-1.5 justify-center">
                        <ShieldCheck className="w-4 h-4" /> SECURE HANDSHAKE: Neutralized
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 font-mono text-xs">
              Select a sector node on the map to query SCADA intelligence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
