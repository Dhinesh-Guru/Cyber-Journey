# 🛡️ CyberJourney - Gamified Cybersecurity & Cryptography Platform

**CyberJourney** is an interactive, gamified cybersecurity education platform designed to train aspiring security analysts, threat hunters, and cryptanalysts through hands-on simulations, interactive tools, and progressive story escape rooms.

---

## 🚀 Project Architecture & Level Overview

The application is structured into 3 progressive difficulty levels, each housed in its own isolated subfolder with dedicated themes, learning modules, interactive tools, and challenge engines:

```
CyberJourney/
├── index.html                    # Main Portal & Level Selector Hub
├── style.css                     # Global Main Hub Styling (Dark Cyberpunk Grid)
├── app.js                        # Unified State & Progression Bridge Engine
├── README.md                     # Comprehensive Project Documentation
│
├── Cyber Academy/                # 🟢 LEVEL 01: Fundamental Security & Virtual OS
│   ├── index.html                # Cyber Academy Hub & Virtual Desktop Workspace
│   ├── style.css                 # Emerald Neon Aesthetic (#00ff88)
│   ├── app.js                    # Level 1 State & High-Water Mark Quiz Engine
│   ├── data/                     # 10 Fundamental Security Modules Data
│   └── components/               # Virtual Workstation Desktop Apps
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
  - **10 Fundamental Security Modules**: Password Security, Phishing Detection, Malware Awareness, Public Wi-Fi Risks, Social Engineering, Multi-Factor Authentication (2FA), Physical Security, Data Privacy, Web Browsing Safety, Incident Reporting.
  - **Virtual Desktop Workstation (6 Interactive Apps)**:
    1. **Terminal Console**: Supports system commands, help, and window self-closing via `exit`.
    2. **File Manager**: Explains file safety and triggers attack risk warnings when disabling firewalls.
    3. **Interactive Mailbox**: Simulates phishing email triage with interactive flag/delete actions.
    4. **Password Vault**: Demonstrates password encryption with secure show/hide visibility toggles.
    5. **Security Center**: Configures security features with attack risk warning banners when turned off.
    6. **Cyber Browser**: Includes URL safety verification and dynamic wallpaper toggles.

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
  - **Randomized 5-Point Incident Response Triage**: 8 enterprise incident scenarios (Double Extension Phishing, SSH Brute Force, Web SQL Injection, DNS Tunneling) with randomized option order and high-water mark XP scoring.

---

## 🟣 Level 03: Cipher Escape (`/Cipher Escape/`)

- **Theme**: Purple Cryptographic Vault (`#b026ff`)
- **Target Audience**: Cryptanalysts & Advanced Problem Solvers
- **Core Features**:
  - **5 Cryptography Learning Modules**: Classical Caesar, ROT13, Atbash, Reverse Text, Morse Code Signals, 8-Bit Binary, Hexadecimal, Base64 Encodings, and Vigenère Polyalphabetic Ciphers.
  - **4 Interactive Decoder Workbench Tools**:
    1. **Caesar Shift Wheel**: Slider defaults to `+1` (no pre-revealed answers) with randomized practice ciphers (`UGETGV`, `GCFIV`, `LZFWI`, `KHOOR`, `IYHCL`) across varied shift keys (+2, +3, +4, +5, +7).
    2. **Morse Code Interpreter & Audio Player**: Generates authentic Web Audio API telegraph beeps (dots 100ms, dashes 300ms) with randomized practice signals (`... --- ...`, `-.-. -.-- -... . .-`, etc.).
    3. **Binary & Hex Translator**: Translates 8-bit binary bytes (`01000001` $\rightarrow$ `A`) and Hex memory dumps (`0x43` $\rightarrow$ `C`).
    4. **Base64 & Vigenère Decryptor**: Decodes Base64 data strings (`Q1lCRVI=` $\rightarrow$ `CYBER`).
  - **10 Story-Driven Escape Chambers**:
    - Progressive chamber unlocks with zero pre-revealed hints at start.
    - **-5 XP Penalty per Hint**: Unlocking hints costs -5 XP penalty per hint used (capped at 3 hints).
    - Multi-stage blast door unlock passcodes (`HELLO WORLD`, `SOS CYBER`, `CYBER SECRET`, `HEAVY GUARD`, `FREEDOM`, `CYPHER`, `REVERSE KEY`, `ATTACK`, `SAFE`, `FREEDOM`).

---

## 🔒 Security & Access Control Features

- **Direct Link Bypass Protection**: Direct URLs (`/CyberOps Lab/index.html` or `/Cipher Escape/index.html`) verify player progression state (`cyberjourney_user_v1` in `localStorage`) and display a **`🔒 ACCESS DENIED`** lock screen if preceding levels are incomplete.
- **High-Water Mark XP System**: Prevents duplicate farming on repeated module/quiz attempts by awarding differential XP only when beating previous high scores.
- **Subfolder Isolation**: Each level maintains clean module boundaries within its respective subfolder.

---

## 🛠️ Running Locally

Run a local HTTP server from the project root directory:

```bash
# Python 3 HTTP Server
python -m http.server 8085 --directory "d:\Antigravity DG\CyberJourney"
```

Open your browser at: [http://localhost:8085/index.html](http://localhost:8085/index.html)
