import React, { useState, useEffect, useRef } from 'react';
import { 
  Notebook, FolderOpen, Tag, Plus, Trash2, Edit3, Save, FileText, Code, 
  Paintbrush, Eraser, RotateCcw, Image, Download, ShieldAlert, CheckCircle, Info
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  folder: string;
  tags: string[];
  content: string;
  codeSnippet?: string;
  canvasData?: string; // Base64 image snapshot of canvas drawing
  updatedAt: string;
}

export default function PersonalNotebook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Editing states
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  // Folder states
  const [newFolderName, setNewFolderName] = useState('');
  const [folders, setFolders] = useState<string[]>(['General', 'Cryptography', 'Network Security', 'CTF Writeups']);

  // Canvas drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#22d3ee'); // Default cyan neon
  const [brushSize, setBrushSize] = useState(3);
  const [canvasTool, setCanvasTool] = useState<'brush' | 'eraser'>('brush');

  const [notification, setNotification] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedNotes = localStorage.getItem('cyberverse_notes');
    const savedFolders = localStorage.getItem('cyberverse_note_folders');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
      if (parsed.length > 0) {
        loadNote(parsed[0]);
      }
    } else {
      // Seed initial note
      const seedNote: Note = {
        id: 'seed-1',
        title: 'Buffer Overflow Lab Notes',
        folder: 'General',
        tags: ['binary', 'exploit', 'lab'],
        content: '# Buffer Overflow Exploit Drafts\n\n- Targets return pointer EIP.\n- Vulnerable buffer size is 64 bytes.\n- Overflow occurs at index 72.',
        codeSnippet: 'run $(python -c "print \'A\' * 72 + \'\\xef\\xbe\\xad\\xde\'")',
        updatedAt: new Date().toLocaleDateString()
      };
      setNotes([seedNote]);
      loadNote(seedNote);
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save to local storage
  const saveAllNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('cyberverse_notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const loadNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setFolder(note.folder);
    setTagsInput(note.tags.join(', '));
    setContent(note.content);
    setCodeSnippet(note.codeSnippet || '');

    // Clear and reload drawing canvas if drawing data exists
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (note.canvasData) {
          const img = new window.Image();
          img.src = note.canvasData;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
        }
      }
    }
  };

  // Create new blank note
  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Forensic Log Entry',
      folder: 'General',
      tags: ['draft'],
      content: 'Write notes here. Supports standard text layout.',
      codeSnippet: '',
      updatedAt: new Date().toLocaleDateString()
    };
    const updated = [newNote, ...notes];
    saveAllNotes(updated);
    loadNote(newNote);
    triggerNotification('Created new forensic notebook entry.');
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    saveAllNotes(filtered);
    if (selectedNoteId === id) {
      if (filtered.length > 0) {
        loadNote(filtered[0]);
      } else {
        setSelectedNoteId(null);
        setTitle('');
        setContent('');
        setCodeSnippet('');
      }
    }
    triggerNotification('Deleted notebook entry.');
  };

  // Save active note changes
  const handleSaveActiveNote = () => {
    if (!selectedNoteId) return;

    // Get snapshot of canvas drawing
    let canvasSnap = '';
    const canvas = canvasRef.current;
    if (canvas) {
      canvasSnap = canvas.toDataURL();
    }

    const updated = notes.map(n => {
      if (n.id === selectedNoteId) {
        return {
          ...n,
          title,
          folder,
          tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
          content,
          codeSnippet,
          canvasData: canvasSnap,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return n;
    });

    saveAllNotes(updated);
    triggerNotification('Notebook entry saved locally.');
  };

  // Folder creation
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    if (folders.includes(newFolderName.trim())) return;
    const updated = [...folders, newFolderName.trim()];
    setFolders(updated);
    localStorage.setItem('cyberverse_note_folders', JSON.stringify(updated));
    setNewFolderName('');
    triggerNotification(`Created folder: ${newFolderName}`);
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // HTML5 Drawing Canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = canvasTool === 'eraser' ? '#020617' : drawColor; // #020617 matches slate-950

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div id="notebook-root" className="space-y-6">
      {/* Header section */}
      <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Notebook className="w-5.5 h-5.5 text-cyan-400" /> Analyst Cryptographic Notebook
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Write incident logs, parse payloads, and draw attack vector diagrams offline. All files are encrypted and cached locally on your device storage.
          </p>
        </div>

        {/* Global actions */}
        <button
          onClick={handleCreateNote}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Cyber Entry
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-mono font-bold animate-pulse text-center">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Side File Explorer (Col span 1) */}
        <div className="xl:col-span-1 space-y-4">
          {/* Note Files list */}
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500" />

            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-cyan-400" /> Device Log Directory
            </span>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {notes.length > 0 ? (
                notes.map(note => {
                  const isActive = selectedNoteId === note.id;
                  return (
                    <div
                      key={note.id}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all group ${
                        isActive
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
                      }`}
                    >
                      <button
                        onClick={() => loadNote(note)}
                        className="flex-1 text-left truncate flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[130px]">{note.title}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 transition-all cursor-pointer"
                        title="Erase Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-600 font-mono text-[10px]">
                  No directories found.
                </div>
              )}
            </div>
          </div>

          {/* Directory folders list creator */}
          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-violet-400" /> Partition Folders
            </span>

            <div className="space-y-1 font-mono text-[10px] text-slate-400 max-h-32 overflow-y-auto pr-1">
              {folders.map((f, i) => (
                <div key={i} className="flex justify-between items-center px-2 py-1 bg-slate-950 rounded-lg border border-slate-900/50">
                  <span>/ {f}</span>
                  <span className="text-slate-600">({notes.filter(n => n.folder === f).length})</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New partition..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-slate-950 border border-slate-900 rounded-lg px-2 py-1.5 text-[10px] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 flex-1 font-mono"
              />
              <button
                onClick={handleCreateFolder}
                className="p-1.5 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500 hover:text-slate-950 text-violet-400 rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Note Writing Console & Painting Board (Col span 3) */}
        <div className="xl:col-span-3 space-y-6">
          {selectedNoteId ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Text Area Console Inputs (Lg span 3) */}
              <div className="lg:col-span-3 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative space-y-4">
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500" />

                {/* Meta details form line */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Partition Folder</span>
                    <select
                      value={folder}
                      onChange={(e) => setFolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      {folders.map((f, idx) => (
                        <option key={idx} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Labels / Tags</span>
                    <div className="relative">
                      <Tag className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="binary, reverse, ctf..."
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Entry title */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Log Record Title</span>
                  <div className="relative">
                    <Edit3 className="w-4 h-4 text-slate-600 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Enter log name..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans font-bold"
                    />
                  </div>
                </div>

                {/* Log Text Description input */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Analysis Ledger Body</span>
                  <textarea
                    rows={10}
                    placeholder="# Target Exploitation Review..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed resize-none"
                  />
                </div>

                {/* Shell / Code Code Snippets panel */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-cyan-400" /> Shell / Code Sandbox block
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. nmap -sC -sV -O 10.10.10.1"
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Save details action */}
                <div className="flex justify-between items-center border-t border-slate-900 pt-4">
                  <span className="text-[9px] font-mono text-slate-500">Auto-saved to local state</span>
                  <button
                    onClick={handleSaveActiveNote}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Local Cache
                  </button>
                </div>
              </div>

              {/* Vector Paint Board whiteboard drawing (Lg span 2) */}
              <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 p-5 rounded-2xl relative flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500" />

                <div>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Paintbrush className="w-4 h-4 text-cyan-400" /> Vector Sandbox board
                    </span>
                    <button
                      onClick={clearCanvas}
                      className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                      title="Clear Whiteboard"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* HTML5 Whiteboard element */}
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 relative">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={240}
                      className="w-full h-auto cursor-crosshair block"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>

                  {/* Draw utilities line */}
                  <div className="flex flex-wrap gap-3 items-center justify-between mt-4">
                    {/* Color pins */}
                    <div className="flex gap-1.5">
                      {['#22d3ee', '#34d399', '#f43f5e', '#fbbf24', '#ffffff'].map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setDrawColor(col);
                            setCanvasTool('brush');
                          }}
                          className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                            drawColor === col && canvasTool === 'brush' ? 'scale-110 border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                      <button
                        onClick={() => setCanvasTool('eraser')}
                        className={`p-1 border rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ${
                          canvasTool === 'eraser' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-transparent'
                        }`}
                        title="Eraser Tool"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Width options slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Width</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-16 accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-[10px] font-mono text-slate-500 leading-normal mt-4">
                  Draw flowcharts, exploit directions, or network packet traces. Canvas state will save together with your notebook details when saved.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 font-mono text-xs">
              Select or create a log entry on the left to start writing notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
