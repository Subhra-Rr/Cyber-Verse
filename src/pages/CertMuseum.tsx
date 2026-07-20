import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Trophy, Landmark, Key, Cpu, HelpCircle, ArrowRight, RefreshCw, 
  BookOpen, Compass, Award, ExternalLink, Calendar, Users, DollarSign
} from 'lucide-react';

// ==========================================
// DATA DEFINITIONS
// ==========================================
const historicalMalware = [
  {
    name: 'Stuxnet',
    year: '2010',
    type: 'State-Sponsored Worm',
    impact: 'Destroyed ~1,000 nuclear centrifuges in Iran.',
    vector: 'Zero-day exploits, infected USB drives, SCADA PLC targets.',
    desc: 'Considered the first true cyber weapon, Stuxnet was a highly complex worm that specifically targeted Siemens PLC industrial control software to alter centrifuge rotor speed, physically tearing them apart while reporting normal operation back to operators.',
  },
  {
    name: 'WannaCry',
    year: '2017',
    type: 'Ransomware Cryptoworm',
    impact: 'Infected 200,000+ machines, £92M damage to UK NHS.',
    vector: 'EternalBlue SMB zero-day exploit, phishing.',
    desc: 'WannaCry combined a state-sponsored SMB vulnerability (EternalBlue, leaked from the NSA) with an aggressive encryption payload. It locked computer systems globally, demanding Bitcoin payments. It was halted by a security researcher triggering a hardcoded DNS "kill switch".',
  },
  {
    name: 'Morris Worm',
    year: '1988',
    type: 'First Internet Worm',
    impact: 'Crashed ~10% of all internet-connected systems at the time.',
    vector: 'Sendmail buffer overflow, fingerd exploit, weak passwords.',
    desc: 'Created by graduate student Robert Tappan Morris to gauge the size of the internet. Due to a design flaw that infected machines repeatedly even if already infected, it rapidly caused massive resource depletion and crashed host computers across universities and government labs.',
  }
];

const historicalBreaches = [
  {
    target: 'Equifax',
    year: '2017',
    impact: '147 million records stolen, $1.4B security overhaul cost.',
    vector: 'Apache Struts unpatched remote code execution vulnerability.',
    lessons: 'Strict patch management programs and thorough database credential auditing are vital for corporate data safety.'
  },
  {
    target: 'SolarWinds',
    year: '2020',
    impact: 'Systemic supply chain compromise of 18,000+ public/private orgs.',
    vector: 'Compromised updates build pipeline (SUNBURST trojan).',
    lessons: 'Code integrity signing systems and rigid network egress auditing must be implemented to identify supply-chain exploits.'
  }
];

const certRoadmaps = [
  {
    id: 'sec_plus',
    name: 'CompTIA Security+',
    tier: 'Entry-Level / Foundation',
    cost: '$392',
    salary: '$85,000',
    topics: ['General Security Concepts', 'Threats, Attacks, & Vulnerabilities', 'Security Architecture', 'Operations & Incident Response'],
    roadmap: 'Great starting certificate. Focus on terminology, basic encryption algorithms, port numbers, and compliance frameworks.'
  },
  {
    id: 'oscp',
    name: 'OffSec Certified Professional (OSCP)',
    tier: 'Intermediate / Active Pen Testing',
    cost: '$1,599',
    salary: '$115,000',
    topics: ['Passive/Active Reconnaissance', 'Windows/Linux Privilege Escalation', 'Exploiting Buffer Overflows', 'Report Writing'],
    roadmap: 'Fully hands-on 24-hour exam. You must build custom scripts, exploit live targets, bypass firewalls, and document findings cleanly.'
  },
  {
    id: 'cissp',
    name: 'CISSP (ISC²)',
    tier: 'Advanced / Management & Governance',
    cost: '$749',
    salary: '$135,000',
    topics: ['Security & Risk Management', 'Asset Security', 'Communication & Network Security', 'Identity & Access Management'],
    roadmap: 'Requires 5 years of verified professional cybersecurity experience. Heavy focus on governance, policy, risk mitigation, and management frameworks.'
  }
];

export default function CertMuseum() {
  const [activeTab, setActiveTab] = useState<'museum' | 'enigma' | 'roadmaps'>('museum');

  // Enigma Machine State
  const [rotor1Pos, setRotor1Pos] = useState(0);
  const [rotor2Pos, setRotor2Pos] = useState(0);
  const [rotor3Pos, setRotor3Pos] = useState(0);
  const [enigmaInput, setEnigmaInput] = useState('');
  const [enigmaOutput, setEnigmaOutput] = useState('');
  const [plugboard, setPlugboard] = useState<{ [key: string]: string }>({
    A: 'Z', Z: 'A',
    B: 'Y', Y: 'B',
  });

  // Enigma rotor mapping configurations
  const rotors = [
    'EKMFLGDQVZNTOWYHXUSPAIBRCJ', // Rotor I
    'AJDKSIRUXBLHWTMCQGZNPYFVOE', // Rotor II
    'BDFHJLCPRTXVZNYEIWGAKMUSQO', // Rotor III
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const pressEnigmaKey = (char: string) => {
    const uppercaseChar = char.toUpperCase();
    if (!alphabet.includes(uppercaseChar)) return;

    // Advance Rotors (Simplified Enigma stepping)
    let nextR1 = (rotor1Pos + 1) % 26;
    let nextR2 = rotor2Pos;
    let nextR3 = rotor3Pos;

    if (nextR1 === 0) {
      nextR2 = (rotor2Pos + 1) % 26;
      if (nextR2 === 0) {
        nextR3 = (rotor3Pos + 1) % 26;
      }
    }

    setRotor1Pos(nextR1);
    setRotor2Pos(nextR2);
    setRotor3Pos(nextR3);

    // Run cryptographic transposition through rotor configurations
    // 1. Plugboard Swap
    let currChar = plugboard[uppercaseChar] || uppercaseChar;
    let currIdx = alphabet.indexOf(currChar);

    // 2. Rotor 1 Forward
    let shift1 = (currIdx + nextR1) % 26;
    currChar = rotors[0][shift1];
    currIdx = (alphabet.indexOf(currChar) - nextR1 + 26) % 26;

    // 3. Rotor 2 Forward
    let shift2 = (currIdx + nextR2) % 26;
    currChar = rotors[1][shift2];
    currIdx = (alphabet.indexOf(currChar) - nextR2 + 26) % 26;

    // 4. Rotor 3 Forward
    let shift3 = (currIdx + nextR3) % 26;
    currChar = rotors[2][shift3];
    currIdx = (alphabet.indexOf(currChar) - nextR3 + 26) % 26;

    // 5. Reflector (Fixed swap mapping - e.g. A<->Y, B<->X...)
    currIdx = (25 - currIdx);

    // 6. Rotor 3 Reverse
    let revShift3 = (currIdx + nextR3) % 26;
    let revChar3 = alphabet[revShift3];
    currIdx = rotors[2].indexOf(revChar3);
    currIdx = (currIdx - nextR3 + 26) % 26;

    // 7. Rotor 2 Reverse
    let revShift2 = (currIdx + nextR2) % 26;
    let revChar2 = alphabet[revShift2];
    currIdx = rotors[1].indexOf(revChar2);
    currIdx = (currIdx - nextR2 + 26) % 26;

    // 8. Rotor 1 Reverse
    let revShift1 = (currIdx + nextR1) % 26;
    let revChar1 = alphabet[revShift1];
    currIdx = rotors[0].indexOf(revChar1);
    currIdx = (currIdx - nextR1 + 26) % 26;

    // 9. Plugboard Swap
    const finalChar = alphabet[currIdx];
    const outputChar = plugboard[finalChar] || finalChar;

    setEnigmaInput((prev) => prev + uppercaseChar);
    setEnigmaOutput((prev) => prev + outputChar);
  };

  const resetEnigma = () => {
    setRotor1Pos(0);
    setRotor2Pos(0);
    setRotor3Pos(0);
    setEnigmaInput('');
    setEnigmaOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5.5 h-5.5 text-cyan-400" /> Cyber Academy & Historical Museum
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dive into modern cybersecurity career pathways and operate interactive encryption algorithms from the analog and early digital ages.
          </p>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex bg-slate-950 p-1 border border-slate-900 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('museum')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'museum'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Museum Exhibition
        </button>
        <button
          onClick={() => setActiveTab('enigma')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'enigma'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          Enigma Simulator
        </button>
        <button
          onClick={() => setActiveTab('roadmaps')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'roadmaps'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Certification Hub
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ==========================================
            TAB 1: HISTORICAL MUSEUM EXHIBITIONS
            ========================================== */}
        {activeTab === 'museum' && (
          <motion.div
            key="museum"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Famous Malware Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                Famous Historical Malware curations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {historicalMalware.map((mw, idx) => (
                  <div key={idx} className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-3 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                        {mw.type}
                      </span>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {mw.year}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-200 text-sm">{mw.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">{mw.desc}</p>
                    <div className="border-t border-slate-850 pt-2 text-[10px] text-slate-500 font-mono space-y-1">
                      <div><strong className="text-slate-300">Vector:</strong> {mw.vector}</div>
                      <div className="text-rose-300/85 mt-1"><strong className="text-rose-400">Impact:</strong> {mw.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Breaches Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                Significant Corporate Intrusion Analyses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {historicalBreaches.map((br, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <span className="font-bold text-slate-300 text-xs font-mono">{br.target} Hack</span>
                      <span className="text-xs font-mono text-slate-500">{br.year}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 space-y-2">
                      <div><strong className="text-slate-300">Exploit Vector:</strong> {br.vector}</div>
                      <div className="text-rose-400"><strong className="text-slate-300">Stolen Data / Cost:</strong> {br.impact}</div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-normal">
                        <strong className="text-cyan-400">Architectural Lesson:</strong> {br.lessons}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            TAB 2: ENIGMA CRYPTOGRAPHIC MACHINE
            ========================================== */}
        {activeTab === 'enigma' && (
          <motion.div
            key="enigma"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-slate-300"
          >
            {/* Rotor indicators panel */}
            <div className="xl:col-span-2 bg-slate-900/60 border border-slate-900 p-6 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyan-400" /> Three-Rotor Enigma Cipher machine
                </h3>
                <button
                  onClick={resetEnigma}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Machine
                </button>
              </div>

              {/* Rotors visual container */}
              <div className="flex justify-around items-center bg-slate-950 p-6 rounded-2xl border border-slate-850">
                {[
                  { label: 'Rotor I (Fast)', val: rotor1Pos, set: setRotor1Pos },
                  { label: 'Rotor II (Med)', val: rotor2Pos, set: setRotor2Pos },
                  { label: 'Rotor III (Slow)', val: rotor3Pos, set: setRotor3Pos },
                ].map((rot, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{rot.label}</span>
                    <div className="w-16 h-20 bg-slate-900 border-2 border-slate-800 rounded-xl flex flex-col justify-between items-center p-1 shadow-inner relative">
                      <button
                        onClick={() => rot.set((rot.val + 1) % 26)}
                        className="text-slate-500 hover:text-cyan-400 text-xs font-bold w-full text-center cursor-pointer select-none"
                      >
                        ▲
                      </button>
                      <span className="text-cyan-400 font-mono font-black text-xl tracking-widest select-none">
                        {alphabet[rot.val]}
                      </span>
                      <button
                        onClick={() => rot.set((rot.val - 1 + 26) % 26)}
                        className="text-slate-500 hover:text-cyan-400 text-xs font-bold w-full text-center cursor-pointer select-none"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive QWERTY Keyboard */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block text-center mb-1">
                  Enigma Keypad Transmitter (Type to Encipher)
                </span>
                {[
                  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
                ].map((row, rowIdx) => (
                  <div key={rowIdx} className="flex justify-center gap-1.5">
                    {row.map((char) => (
                      <button
                        key={char}
                        onClick={() => pressEnigmaKey(char)}
                        className="w-10 h-10 bg-slate-950 border border-slate-850 hover:border-cyan-400/40 hover:text-cyan-400 active:scale-95 text-slate-200 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center justify-center select-none"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Output buffer logs */}
            <div className="xl:col-span-1 bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
                Output Cipher logs
              </h3>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">Plaintext Input</span>
                  <p className="text-slate-300 break-all h-10 overflow-y-auto">
                    {enigmaInput || <span className="text-slate-600 font-normal">Use keyboard to enter plaintext...</span>}
                  </p>
                </div>

                <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-cyan-500 uppercase block font-bold">Ciphertext Output</span>
                  <p className="text-cyan-400 font-extrabold break-all h-10 overflow-y-auto">
                    {enigmaOutput || <span className="text-slate-600 font-normal">Encrypted bytes appear here...</span>}
                  </p>
                </div>

                {/* Educational brief */}
                <div className="bg-slate-950/80 p-3.5 border border-slate-850 rounded-xl space-y-2 text-[10px] text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Cryptographic Mechanism
                  </span>
                  <p>
                    Each keypress advances Rotor I. When Rotor I returns to position "A", Rotor II clicks forward. Electricity routes through rotors, hits the symmetric reflector, and traverses backwards, ensuring <strong>perfect reciprocal encryption</strong> (Inputting Ciphertext decrypts it back to Plaintext!).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            TAB 3: EXAM ROADMAP ROADMAPS
            ========================================== */}
        {activeTab === 'roadmaps' && (
          <motion.div
            key="roadmaps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certRoadmaps.map((cert) => (
                <div key={cert.id} className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                        {cert.tier}
                      </span>
                      <Award className="w-5 h-5 text-indigo-400 shrink-0" />
                    </div>
                    <h4 className="font-bold text-slate-200 text-sm">{cert.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal font-mono">{cert.roadmap}</p>
                  </div>

                  <div className="border-t border-slate-850 pt-3 space-y-3 font-mono text-xs">
                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Exam Cost: <strong className="text-slate-300 ml-1">{cert.cost}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Avg Salary: <strong className="text-slate-300 ml-1">{cert.salary}</strong>
                      </div>
                    </div>

                    {/* Core domains */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">Primary Domains Tested:</span>
                      <div className="flex flex-wrap gap-1">
                        {cert.topics.map((t, i) => (
                          <span key={i} className="text-[9px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Tips Banner */}
            <div className="bg-slate-950/80 p-4 border border-slate-900 rounded-2xl flex items-start gap-3">
              <Compass className="w-5.5 h-5.5 text-violet-400 shrink-0 mt-0.5" />
              <div className="font-mono text-[10px] text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-200 block mb-1">🧭 Academy Career Guidance</span>
                There is no singular, perfect path to mastering cyber operations. For security managers and policy designers, CompTIA Security+ into CISSP provides an elite framework structure. For active penetration testers or digital forensics engineers, OSCP remains the industry gold standard. Combine certificate certifications with real-world CTF practice.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
