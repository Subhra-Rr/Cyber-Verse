# CyberVerse – Interactive Cyber Security Learning Platform

CyberVerse is a world-class, premium educational cybersecurity learning portal developed entirely in React, TypeScript, and Tailwind CSS. The platform is designed to run **100% client-side**, allowing complete **offline** usage with zero external servers, databases, or API costs.

---

## 🚀 Key Architectural Capabilities

### 1. Security Curriculum (10 Comprehensive Modules)
- **Networking & Packet Analysis**: Layers of the OSI model, IP routing, UDP, and TCP three-way handshake parameters.
- **Cryptography & Encryption**: Symmetric vs asymmetric key theories, public-private links, and cryptographic hashing.
- **Web Application Security (OWASP Top 10)**: SQL Injection (SQLi) query hijacking, Cross-Site Scripting (XSS), and session hijacking.
- **Linux Fundamentals**: Navigation structures, octal permissions (`chmod`), ownership, and active process controls.
- **Ethical Hacking Methodologies**: passive OSINT, active scanning, banner harvesting, and vulnerability scanning.
- **Malware & Threat Actors**: Trojan horses, network worms, ransomware extortion, and C2 beacons.
- **Digital Forensics**: Order of volatility, chain of custody tracking, and integrity hashes.
- **Cloud Security**: IAM controls, Zero-Trust network segmentation, and Shared Responsibility Models.
- **Mobile Security**: Application sandbox separation and runtime permission policies.
- **AI & LLM Security**: Direct and indirect prompt injection attacks, and model poisoning vectors.

### 2. Standalone Interactive Utilities Suite
- **Password Strength Analyzer**: Real-time entropy mapping, requirements checklists, and cracking timeframe evaluations.
- **Hash Algorithm Workbench**: Computes MD5, SHA-1, and SHA-256 signatures with visual representations of the "Avalanche Effect".
- **Caesar Substitution Dial**: Slide matrices to visually shift plaintext into scrambled ROT code instantly.
- **TCP Port Scanner**: Sends virtual probes to map target servers, showing responses and banner details.
- **ACL Firewall Policy Sandbox**: Adds priority rules sequentially to filter streams of mock server traffic.

### 3. Capture The Flag (CTF) Challenges
- **Phishing Spotter**: Interactive email reader where clicking headers, urgency alerts, or bad links unveils phishing vectors.
- **SQL Injection Sandbox**: Type actual SQL query bypass statements (e.g. `' OR '1'='1`) to extract restricted tables.
- **Caesar ROT Cracker**: Adjust sliding dials to decrypt intercepted spy transmissions in real-time.
- **Active Incident Response**: Isolate corporate assets by finding and terminating malicious backdoor process IDs.
- **Firewall Hardening**: Define security policies to block brute force scanners while keeping HTTP/S traffic online.

### 4. Custom SVG Animations & Visualizations
- **Global Threat intelligence Map**: Project vectors across coordinates, backed by live security logs.
- **Cyber Kill Chain Roadmap**: Step-by-step interactive explorer mapping intrusion timelines.
- **TCP Handshake sequence**: Live packet delivery (SYN, SYN-ACK, ACK) and connection states.
- **OSI Encapsulation Engine**: Illustrates how application payloads aggregate nested headers as they descend the stack.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Sidebar.tsx               # Left navigation cockpit showing progress points
│   ├── TerminalSimulator.tsx     # In-memory virtual Linux CLI terminal shell
│   ├── Simulators.tsx           # Standalone password, hash, cipher, port, and firewall utilities
│   └── Visualizations.tsx       # SVG threat map, TCP handshake, and OSI stack animations
├── data/
│   ├── modules.ts               # Local JSON-like security curriculum database
│   └── labs.ts                  # CTF challenges briefings, hints, and decryption flags
├── hooks/
│   └── useProgress.ts           # React hook managing local persistent states via localStorage
├── pages/
│   ├── LandingPage.tsx          # Cyber-futuristic animated platform entry screen
│   ├── Dashboard.tsx            # Student command center with search, filters, and activity heatmap
│   ├── ModuleView.tsx           # Curriculum reader with dynamic simulations and assessments
│   └── LabsView.tsx             # Capture The Flag (CTF) challenge workstations
├── types.ts                     # Strict TypeScript interfaces representing courses and states
├── index.css                    # Tailwind CSS global styles and dark grids
├── main.tsx                     # React core renderer mounting the application
└── App.tsx                      # App orchestrator routing tabs and tracking scores
```

---

## 🛠️ Installation & Compilation Guide

### 1. Prerequisites
Ensure you have **Node.js 18+** installed in your developer workspace.

### 2. Setup Dependencies
Install package configurations from the project root:
```bash
npm install
```

### 3. Run Development Server
Boot the sandbox preview environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### 4. Build Production Distribution
Compile and bundle static files into `/dist` for offline deployment:
```bash
npm run build
```

---

## 🔐 Data Storage & Security
Everything inside **CyberVerse** is processed and preserved on the **client side**:
- **Zero API queries**: High-speed offline response.
- **Progress Tracking**: Completed lessons, certifications, unlocked achievements, and daily heatmap records are saved inside browser `localStorage`.
- **Sandbox Isomorphic Protection**: Interactive shells and injection challenges are entirely virtualized in JavaScript memory — safe for learning in any corporate network.
