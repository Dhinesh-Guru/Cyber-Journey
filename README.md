# 🛡️ CyberJourney - Gamified Cybersecurity & Cryptography Platform

**CyberJourney** is an interactive, gamified cybersecurity education platform designed to train aspiring security analysts, threat hunters, and cryptanalysts through hands-on simulations, interactive tools, and progressive story escape rooms.

---

## ⚡ Key Highlights & Architecture Updates

- **⚡ Supabase Real-Time Cloud Engine**: Powered by **Supabase Postgres Realtime WebSockets** (`supabase-config.js`). Player progress, XP, module completions, and ranks sync seamlessly in **sub-50ms** across laptops and mobile devices.
- **🛡️ Defensive Prevention Engine**: Active anti-DoS rate limiting, context-aware HTML entity escaping for XSS prevention, and SQL injection disarming via `security-defense.js`.
- **🏆 Global Real-Time Leaderboard**: Live ranking of top trainees synchronized across all connected devices.

---

## 🚀 Project Architecture & Level Overview

The application is structured into 3 progressive difficulty levels, each housed in its own isolated subfolder with dedicated themes, learning modules, interactive tools, and challenge engines:

```
CyberJourney/
├── index.html                    # Main Portal & Command Hub
├── style.css                     # Global Main Hub Styling (Dark Cyberpunk Grid)
├── app.js                        # Unified State & Progression Bridge Engine
├── supabase-config.js            # Supabase Real-Time Cloud Sync & Auth Manager
├── security-defense.js           # Self-Defensive Prevention & Security Engine
├── README.md                     # Comprehensive Project Documentation
│
├── Cyber Academy/                # 🟢 LEVEL 01: Fundamental Security & Virtual OS
│   ├── index.html                # Cyber Academy Hub & Virtual Desktop Workspace
│   ├── style.css                 # Emerald Neon Aesthetic (#00ff88)
│   ├── app.js                    # Level 1 State & Quiz Controller Engine
│   ├── data/                     # 5 Core Security Chapters + Final Exam
│   └── components/               # Virtual Workstation Desktop Apps (CyberOS)
│
├── CyberOps Lab/                 # 🔵 LEVEL 02: SOC Operations & Incident Response
│   ├── index.html                # SOC Incident Response Center Layout
│   ├── style.css                 # Cyan Neon Aesthetic (#00f3ff)
│   ├── app.js                    # Level 2 Operations Engine & Access Enforcer
│   ├── data/                     # SOC Log Samples, PCAP Traffic & 8 Incident Scenarios
│   └── components/               # SIEM Log Viewer, Hash Inspector, PCAP & Firewall Tools
│
└── Cipher Escape/                # 🟣 LEVEL 03: Cryptography & Escape Chambers
    ├── index.html                # Cryptographic Vault Layout
    ├── style.css                 # Purple Neon Aesthetic (#b026ff)
    ├── app.js                    # Level 3 Cryptography Engine & Access Enforcer
    ├── data/                     # 5 Cryptography Modules & 10 Escape Chambers
    └── components/               # Interactive Decoder Workbench & Chamber Stage Engine
```

---

## 🟢 Level 01: Cyber Academy (`/Cyber Academy/`)

- **Theme**: Emerald Cyberpunk (`#00ff88`)
- **Target Audience**: Beginners & Trainees
- **Core Features**:
  - **5 Core Chapters + Certification Final Exam**: Password Security, Phishing Detection, Malware Defense, Safe Web Browsing, Social Engineering, and the Cyber Defense Certification Final Exam.
  - **Virtual Desktop Workstation (CyberOS Virtual Laptop)**:
    1. **Terminal Console**: Interactive command execution and terminal tools.
    2. **File Manager**: Explains file safety and risk warnings.
    3. **Interactive Mailbox**: Simulates phishing email triage with flag/delete actions.
    4. **Password Vault**: Demonstrates password strength, hashing, and visibility toggles.
    5. **Security Center**: Configures firewall/antivirus settings with attack risk warning banners.
    6. **Cyber Browser**: URL safety verification and safe browsing practices.

---

## 🔵 Level 02: CyberOps Lab (`/CyberOps Lab/`)

- **Theme**: Cyan Cyberpunk (`#00f3ff`)
- **Target Audience**: Intermediate Security Analysts & Threat Hunters
- **Core Features**:
  - **10 SOC Analyst Modules**: Log Investigation, Password Security, Hash Detective, Network Mapping, PCAP Packet Analysis, Malware Investigation, Digital Forensics, Cryptography, Firewall Rules, Incident Response.
  - **4 Interactive SOC Workstation Apps**:
    1. **SIEM Log Viewer Console**: Filter raw authentication logs, click suspicious rows, and identify attacker IP (`45.142.120.9`).
    2. **Hash & Integrity Inspector**: Calculate 64-character SHA-256 signatures, query VirusTotal Global Threat Intelligence tables, and isolate infected files (`invoice_july.pdf.exe`).
    3. **Wireshark PCAP Inspector**: Inspect cleartext HTTP traffic (Port 80) and isolate transmitting source IPs (`192.168.1.14`).
    4. **Stateful Firewall Console**: Configure active `BLOCK` rules for Port 80 and test live perimeter policy.
  - **Enterprise Incident Response Triage**: 8 enterprise incident scenarios (Double Extension Phishing, SSH Brute Force, Web SQL Injection, DNS Tunneling) with randomized option order and high-water mark XP scoring.

---

## 🟣 Level 03: Cipher Escape (`/Cipher Escape/`)

- **Theme**: Purple Cryptographic Vault (`#b026ff`)
- **Target Audience**: Cryptanalysts & Advanced Problem Solvers
- **Core Features**:
  - **5 Cryptography Learning Modules**: Classical Caesar, ROT13, Atbash, Reverse Text, Morse Code Signals, 8-Bit Binary, Hexadecimal, Base64 Encodings, and Vigenère Polyalphabetic Ciphers.
  - **4 Interactive Decoder Workbench Tools**:
    1. **Caesar Shift Wheel**: Interactive cipher wheel with shift keys (+1 to +7).
    2. **Morse Code Interpreter & Audio Player**: Generates Web Audio API telegraph beeps (dots 100ms, dashes 300ms) with practice signals.
    3. **Binary & Hex Translator**: Translates 8-bit binary bytes (`01000001` $\rightarrow$ `A`) and Hex memory dumps (`0x43` $\rightarrow$ `C`).
    4. **Base64 & Vigenère Decryptor**: Decodes Base64 data strings (`Q1lCRVI=` $\rightarrow$ `CYBER`).
  - **10 Story-Driven Escape Chambers**: Multi-stage blast door unlock passcodes (`HELLO WORLD`, `SOS CYBER`, `CYBER SECRET`, `HEAVY GUARD`, `FREEDOM`, `CYPHER`, `REVERSE KEY`, `ATTACK`, `SAFE`, `FREEDOM`).

---

## 🛡️ Self-Defensive Security Architecture & Attack Prevention Engine

CyberJourney incorporates a real-time defensive security engine (`security-defense.js`) that protects the application against the very attacks demonstrated in its learning modules:

1. **Anti-DoS & Rate Limiter (`checkRateLimit`)**: Limits form submissions and authentication attempts (max 5 requests per 15s) and triggers HTTP 429 protection banners during brute-force attempts.
2. **XSS & Output Encoding Guard (`sanitizeHTML`)**: Context-aware HTML entity escaping prevents Cross-Site Scripting (XSS) payload injection into the DOM.
3. **SQL Injection Disarmer (`sanitizeSQLInput`)**: Sanitizes and parameterizes form text to disarm raw SQL injection payloads (`' OR '1'='1`).
4. **Active Mitigation Cards**: Interactive workstation apps embed live prevention cards detailing exact mitigation strategies (SPF/DKIM/DMARC for Phishing, Prepared Statements for SQLi, TLS/HSTS for Cleartext traffic, AES-256 for Cryptography).

---

## 🔒 Security & Access Control Features

- **Direct Link Bypass Protection**: Direct URLs verify player progression state and display a **`🔒 ACCESS DENIED`** lock screen if preceding levels are incomplete.
- **High-Water Mark XP System**: Prevents duplicate farming on repeated module/quiz attempts by awarding differential XP only when beating previous high scores.
- **Subfolder Isolation**: Each level maintains clean module boundaries within its respective subfolder.

---

## 🛠️ Running Locally

Run a local HTTP server from the project root directory:

```bash
# Python 3 HTTP Server
python -m http.server 8085 --directory .
```

Open your browser at: [http://localhost:8085/index.html](http://localhost:8085/index.html)
