import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Bookmark, FileText, Send, Sparkles, HelpCircle, 
  RotateCw, Plus, Trash2, Bell, Shield, ChevronRight, CheckCircle, Info
} from 'lucide-react';

// ==========================================
// LOCAL DATABASE & DATA FOR INTEL KNOWLEDGE BASE
// ==========================================
const encyclopediaArticles = [
  {
    id: 'art_1',
    title: 'Advanced Persistent Threats (APTs)',
    category: 'Threat Intel',
    summary: 'Master stealthy cyber attack groups, sponsored by states, aiming for long-term target persistence.',
    content: 'An Advanced Persistent Threat (APT) is a stealthy computer network threat actor, typically a nation-state or state-supported group, which gains unauthorized access to a computer network and remains undetected for an extended period. APT goals are usually intelligence collection or strategic leverage rather than direct financial theft.'
  },
  {
    id: 'art_2',
    title: 'Defense in Depth Security Principles',
    category: 'Network Security',
    summary: 'Design layered defensive policies so no single security control represents a single point of failure.',
    content: 'Defense in depth is an information security strategy that integrates multiple layers of defensive security controls throughout an IT environment. If one control fails (e.g., a firewall rule is bypassed), other mechanisms (e.g., endpoint antivirus, network subnets, MFA) immediately isolate the threat.'
  },
  {
    id: 'art_3',
    title: 'Salting & Hashing Password Databases',
    category: 'Cryptography',
    summary: 'Why hashing alone is vulnerable to lookup tables and rainbow attacks, and how unique salts protect passwords.',
    content: 'Salting is the addition of a unique random string of characters to a password before it is run through a cryptographic hash function (like bcrypt). This ensures that two users with identical passwords will have completely different hashes, neutralizing rainbow-table lookup attacks.'
  }
];

const flashcards = [
  { q: 'What is a "Zero-Day" vulnerability?', a: 'A security flaw in software or hardware that is completely unknown to the vendor, meaning there are 0 days of protective patches available.' },
  { q: 'What does "MFA" stand for and require?', a: 'Multi-Factor Authentication. It requires 2+ credentials from distinct categories: Something you know (password), Something you have (token), or Something you are (biometrics).' },
  { q: 'What is the principal difference between IPS and IDS?', a: 'An IDS (Intrusion Detection System) passively monitors and alerts on anomalies. An IPS (Intrusion Prevention System) resides inline and actively blocks suspicious packets on detection.' },
  { q: 'Explain "Phishing" vs "Spear Phishing".', a: 'Phishing is a bulk email campaign targeting random recipients. Spear phishing is highly targeted, customizing payloads for a specific individual or corporation.' }
];

const mockAlerts = [
  { title: 'Critical Remote Code Execution on Apache HTTP Servers', severity: 'Critical', cve: 'CVE-2026-1049', time: '1 hr ago' },
  { title: 'New Ransomware Variant "DarkByte" targeting Linux filesystems', severity: 'High', cve: 'CVE-2026-4412', time: '5 hrs ago' },
  { title: 'Credential stuffing attack campaign active on cloud-endpoints', severity: 'Medium', cve: 'N/A', time: '1 day ago' }
];

const offlineAIBrain: { [key: string]: string } = {
  sqli: 'To prevent SQL Injection, use parameterized queries (prepared statements). This forces the database to compile the query outline first, treating user parameters strictly as safe literals rather than executable query tokens. Never concatenate inputs directly into SQL strings.',
  xss: 'Cross-Site Scripting (XSS) is mitigated by encoding all HTML output (converting < to &lt;), implementing a strong Content Security Policy (CSP) header, and setting the "HttpOnly" flag on authentication cookies to prevent access via JavaScript document.cookie.',
  hashing: 'Always hash passwords with a slow, memory-hard algorithm like bcrypt, Argon2, or PBKDF2. This slows down brute-force and GPU hashing attempts. Additionally, prepend a unique cryptographic salt string to neutralize pre-calculated rainbow tables.',
  enigma: 'The Enigma machine was an electro-mechanical rotor cipher machine used in WWII. It used three or four rotating rotors, a static plugboard, and a reflector which bounced electricity backwards through the rotors, meaning a letter could never encrypt to itself.'
};

export default function IntelKnowledgeBase() {
  const [activeSubView, setActiveSubView] = useState<'articles' | 'flashcards' | 'journal'>('articles');
  
  // Articles state
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Flashcards state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Journal notepad state
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>(() => {
    const saved = localStorage.getItem('cyberverse_student_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteInput, setNoteInput] = useState('');

  // AI Assistant state
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    { sender: 'assistant', text: 'Secured airgap link established. I can explain security controls, exploit mechanics, and defense practices. Try asking: "How to prevent SQL injection" or "What is salting?"' }
  ]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('cyberverse_student_notes', JSON.stringify(notes));
  }, [notes]);

  // Handle Search filtering
  const filteredArticles = encyclopediaArticles.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLocalBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const item = {
      id: Date.now().toString(),
      text: noteInput,
      date: new Date().toLocaleDateString()
    };
    setNotes([item, ...notes]);
    setNoteInput('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // Offline AI Response logic
  const handleSendAiMessage = () => {
    if (!aiInput.trim()) return;
    const query = aiInput.toLowerCase();
    const userMsg = aiInput;
    setAiInput('');

    setAiChat((prev) => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      let reply = "Security diagnostic complete. No specific keyword signature detected in my local airgapped brain. Try referencing topics like 'SQLi', 'XSS', 'Hashing', or 'Enigma' for granular engineering mitigations.";
      
      if (query.includes('sql') || query.includes('sqli') || query.includes('injection')) {
        reply = offlineAIBrain.sqli;
      } else if (query.includes('xss') || query.includes('scripting') || query.includes('cross-site')) {
        reply = offlineAIBrain.xss;
      } else if (query.includes('salt') || query.includes('hash') || query.includes('bcrypt') || query.includes('password')) {
        reply = offlineAIBrain.hashing;
      } else if (query.includes('enigma') || query.includes('rotor') || query.includes('cipher')) {
        reply = offlineAIBrain.enigma;
      }

      setAiChat((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 450);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Left Columns: Core Toolkit */}
      <div className="xl:col-span-3 space-y-6">
        {/* Sub Header tabs */}
        <div className="border-b border-slate-900 pb-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5.5 h-5.5 text-cyan-400" /> Intel Knowledge Base & Notebook
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Read comprehensive offline cyber writeups, drill essential terminology via flashcards, and write local security journal logs.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 border border-slate-900 rounded-xl font-mono text-[10px]">
            <button
              onClick={() => setActiveSubView('articles')}
              className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                activeSubView === 'articles' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Encyclopedia
            </button>
            <button
              onClick={() => setActiveSubView('flashcards')}
              className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                activeSubView === 'flashcards' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveSubView('journal')}
              className={`px-3 py-1.5 font-bold uppercase transition-all rounded-lg cursor-pointer ${
                activeSubView === 'journal' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Study Journal
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ==========================================
              SUBVIEW 1: ENCYCLOPEDIA ARTICLES
              ========================================== */}
          {activeSubView === 'articles' && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search articles, tactics, techniques, or security concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-900 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/30 font-mono"
                />
              </div>

              {/* Articles Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-800 transition-all cursor-pointer"
                    onClick={() => setSelectedArticleId(selectedArticleId === art.id ? null : art.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full uppercase">
                          {art.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLocalBookmark(art.id);
                          }}
                          className="text-slate-600 hover:text-cyan-400 p-1"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(art.id) ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-200 text-xs mt-1">{art.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">{art.summary}</p>
                    </div>

                    {selectedArticleId === art.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] font-mono text-slate-400 leading-relaxed overflow-hidden"
                      >
                        {art.content}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBVIEW 2: FLIPPABLE FLASHCARDS
              ========================================== */}
          {activeSubView === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col items-center justify-center p-4 space-y-6"
            >
              {/* Dual-Flippable Visual Container card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-md h-52 cursor-pointer relative preserve-3d transition-transform duration-500"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
              >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-slate-900/80 border-2 border-slate-800 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-lg">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    Interactive Drill Flashcard
                  </span>
                  <p className="text-sm font-bold text-slate-200 font-mono leading-relaxed">
                    {flashcards[cardIdx].q}
                  </p>
                  <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-1">
                    <RotateCw className="w-3 h-3 animate-spin" /> Click to Flip and Reveal
                  </span>
                </div>

                {/* Back Side */}
                <div
                  className="absolute inset-0 backface-hidden bg-slate-900 border-2 border-cyan-500/20 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-lg"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    Response / Concept Explanation
                  </span>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    {flashcards[cardIdx].a}
                  </p>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    Verification Complete
                  </span>
                </div>
              </div>

              {/* Stepper navigation button controls */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIdx((prev) => (prev - 1 + flashcards.length) % flashcards.length);
                  }}
                  className="px-4 py-1.5 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl font-mono text-xs cursor-pointer transition-all"
                >
                  Prev Card
                </button>
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIdx((prev) => (prev + 1) % flashcards.length);
                  }}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl font-mono text-xs cursor-pointer transition-all"
                >
                  Next Card
                </button>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUBVIEW 3: STUDENT NOTEBOOK / JOURNAL
              ========================================== */}
          {activeSubView === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300"
            >
              {/* Input section */}
              <div className="md:col-span-1 space-y-3 bg-slate-900/60 border border-slate-900 p-4 rounded-2xl h-fit">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">
                  Record Takeaway Note
                </h3>
                <textarea
                  placeholder="Record your lab flags, study topics, or code snippets. Notes are saved locally..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 font-mono resize-none"
                />
                <button
                  onClick={handleAddNote}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Save Journal Entry
                </button>
              </div>

              {/* Saved list section */}
              <div className="md:col-span-2 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {notes.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/40 border border-slate-900 rounded-2xl text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-slate-700 animate-pulse" />
                    <span>Journal empty. Log your first cybersecurity note!</span>
                  </div>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className="bg-slate-900/40 border border-slate-900 p-3.5 rounded-2xl space-y-2 flex justify-between items-start gap-4 group hover:border-slate-800 transition-all"
                    >
                      <div className="space-y-1 font-mono">
                        <span className="text-[8px] text-slate-500">{n.date}</span>
                        <p className="text-xs text-slate-300 whitespace-pre-wrap leading-normal">{n.text}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: AI airgapped Assistant & Ticker feed alerts */}
      <div className="xl:col-span-1 space-y-6">
        {/* Threat feed alert list */}
        <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-rose-500 animate-pulse" /> Active Zero-Day Alerts
          </h3>

          <div className="space-y-3 font-mono">
            {mockAlerts.map((alt, idx) => (
              <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1 text-[10px]">
                <div className="flex justify-between items-center text-[8px]">
                  <span className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                    alt.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400' : alt.severity === 'High' ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {alt.severity}
                  </span>
                  <span className="text-slate-500">{alt.time}</span>
                </div>
                <h4 className="font-bold text-slate-300 text-[10px] truncate">{alt.title}</h4>
                <div className="text-[9px] text-slate-500">CVE ID: {alt.cve}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Local brain Assistant agent chat box */}
        <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-2xl space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Offline Knowledge AI
          </h3>

          <div className="space-y-4">
            {/* Chat output frame */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 h-[180px] overflow-y-auto font-mono text-[9.5px] space-y-3 scrollbar-none">
              {aiChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border max-w-[90%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-[7.5px] text-slate-500 block uppercase font-bold mb-1">
                    {msg.sender === 'user' ? 'Student' : 'Offline Intel Agent'}
                  </span>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat input box */}
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Ask about SQLi, XSS, Hashing, Enigma..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/20 font-mono"
              />
              <button
                onClick={handleSendAiMessage}
                className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg flex items-center justify-center transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
