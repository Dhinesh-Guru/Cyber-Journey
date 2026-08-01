/* ==========================================================================
   CyberOps Lab (Level 2) - Data: 10 SOC Analyst Investigation Modules
   ========================================================================== */

const CYBEROPS_MODULES = [
    {
        id: 'ops_m1',
        title: 'Module 1: Log Investigation & Anomaly Detection',
        badgeId: 'log_master',
        badgeName: 'Log Master',
        badgeIcon: 'fa-file-lines',
        xpReward: 100,
        summary: 'Analyze authentication logs, identify brute-force attacks, and detect suspicious geographic logins.',
        theory: [
            {
                heading: 'Understanding Security Logs',
                content: 'Security Information and Event Management (SIEM) systems continuously log authentication events. Every login attempt records a timestamp, username, source IP address, and status (SUCCESS / FAILURE).'
            },
            {
                heading: 'Brute-Force & Credential Stuffing Patterns',
                content: 'Multiple rapid failed login attempts (e.g. 5 failures in 10 seconds) followed by a successful login indicate a <strong>Brute-Force Attack</strong>. Attacks originating from foreign or unexpected IP addresses signal account takeover.'
            }
        ],
        questions: [
            {
                id: 'ops_q1_1',
                question: 'In a SIEM log, what pattern strongly indicates an active Brute-Force Password attack?',
                options: [
                    'Single login failure followed by a password reset request',
                    'Multiple failed login attempts within seconds for the same user followed by a sudden success from an unknown IP',
                    'A user logging in at 9:00 AM from their corporate laptop',
                    'System updates running automatically at midnight'
                ],
                correctIndex: 1,
                explanation: 'Rapid sequential login failures indicate automated script guessing. A sudden success from an unknown IP confirms account compromise.'
            },
            {
                id: 'ops_q1_2',
                question: 'Which log field is most critical for identifying the physical or network origin of an unauthorized login attempt?',
                options: ['User Agent string', 'Source IP Address', 'CPU Usage %', 'File extension'],
                correctIndex: 1,
                explanation: 'The Source IP Address identifies the originating computer or proxy network on the internet.'
            }
        ]
    },
    {
        id: 'ops_m2',
        title: 'Module 2: Password Security & Hash Analysis',
        badgeId: 'hash_expert',
        badgeName: 'Hash Expert',
        badgeIcon: 'fa-key',
        xpReward: 100,
        summary: 'Understand how attackers extract password hashes, perform dictionary attacks, and why plain-text storage is catastrophic.',
        theory: [
            {
                heading: 'Cryptographic Hashing vs Plaintext',
                content: 'Secure databases never store passwords in plaintext. Instead, they run passwords through cryptographic hash functions (such as SHA-256 or bcrypt) to produce a fixed-length mathematical fingerprint.'
            },
            {
                heading: 'Dictionary & Rainbow Table Attacks',
                content: 'Attackers use pre-computed tables of word hashes (Rainbow Tables) to reverse weak hashes like <code>hello123</code>. Adding unique random <strong>Salts</strong> prevents rainbow table lookups.'
            }
        ],
        questions: [
            {
                id: 'ops_q2_1',
                question: 'Why is storing user passwords in plaintext inside a database considered a catastrophic security failure?',
                options: [
                    'It slows down database queries',
                    'Any database breach or leaked SQL dump immediately exposes all user passwords to attackers',
                    'Plaintext passwords take up more disk space than hashes',
                    'It prevents users from resetting passwords'
                ],
                correctIndex: 1,
                explanation: 'If a database with plaintext passwords leaks, attackers can instantly log in as users across all services without needing to crack anything.'
            },
            {
                id: 'ops_q2_2',
                question: 'What is the purpose of adding a random "Salt" to a password before hashing it?',
                options: [
                    'To compress the password file size',
                    'To ensure identical passwords produce different hash outputs, neutralizing pre-computed Rainbow Table attacks',
                    'To hide the username from system administrators',
                    'To bypass multi-factor authentication'
                ],
                correctIndex: 1,
                explanation: 'Salting appends unique random data to each password so two users with "password123" will have completely different hashes.'
            }
        ]
    },
    {
        id: 'ops_m3',
        title: 'Module 3: Hash Detective & File Integrity Checks',
        badgeId: 'integrity_guard',
        badgeName: 'Integrity Guard',
        badgeIcon: 'fa-fingerprint',
        xpReward: 100,
        summary: 'Use SHA-256 checksums to verify software integrity, lookup signatures in threat databases, and detect Trojan malware binaries.',
        theory: [
            {
                heading: 'One-Way Hash Property & File Integrity',
                content: 'Changing even a single byte in a file completely alters its SHA-256 checksum output (the Avalanche Effect). If an official software checksum matches the downloaded file checksum, the software is untampered.'
            },
            {
                heading: 'Threat Database Hash Matching (VirusTotal)',
                content: 'Security analysts do not need to execute suspicious files to analyze them. Instead, analysts calculate the file\'s 64-character SHA-256 hash (e.g., <code>8f14e45f9a2b8c9d0123ef...</code>) and query global threat intelligence databases (like VirusTotal). If the hash matches a known malware entry (such as <strong>Trojan.DisguisedPDF.Exe</strong>), the file is confirmed malicious.'
            }
        ],
        questions: [
            {
                id: 'ops_q3_1',
                question: 'How do security analysts identify if an unknown downloaded file is a known Trojan without executing it?',
                options: [
                    'By opening the file in Microsoft Word',
                    'By calculating its SHA-256 hash and looking up the fingerprint in VirusTotal or threat databases',
                    'By renaming the file extension to .txt',
                    'By restarting the workstation'
                ],
                correctIndex: 1,
                explanation: 'Matching a calculated SHA-256 checksum against global threat intelligence databases reveals known malware signatures instantly without risking system infection.'
            },
            {
                id: 'ops_q3_2',
                question: 'An analyst compares an official software hash (8f14e45f...) with a downloaded installer hash (3a99bc12...). What does a mismatch mean?',
                options: [
                    'The file downloaded faster than expected',
                    'The file has been modified, corrupted, or infected with malware during transit',
                    'The user needs to restart their browser',
                    'The file is encrypted with AES-256'
                ],
                correctIndex: 1,
                explanation: 'Cryptographic hashes are exact digital fingerprints. Any difference in checksum proves the file was altered or infected.'
            }
        ]
    },
    {
        id: 'ops_m4',
        title: 'Module 4: Network Investigation & Port Mapping',
        badgeId: 'net_detective',
        badgeName: 'Network Detective',
        badgeIcon: 'fa-network-wired',
        xpReward: 100,
        summary: 'Analyze network ports, IP addressing, DNS resolution, and common protocol numbers.',
        theory: [
            {
                heading: 'Port Assignments in Security',
                content: 'Common ports include: <strong>Port 80 (HTTP Unencrypted)</strong>, <strong>Port 443 (HTTPS Encrypted)</strong>, <strong>Port 22 (SSH Secure Shell)</strong>, <strong>Port 53 (DNS Lookup)</strong>, and <strong>Port 3389 (RDP Remote Desktop)</strong>. Unexpected listening ports can indicate open backdoors.'
            }
        ],
        questions: [
            {
                id: 'ops_q4_1',
                question: 'Which network port is standard for secure, encrypted HTTPS web traffic?',
                options: ['Port 80', 'Port 22', 'Port 443', 'Port 53'],
                correctIndex: 2,
                explanation: 'Port 443 handles TLS/SSL encrypted HTTPS communication.'
            }
        ]
    },
    {
        id: 'ops_m5',
        title: 'Module 5: Packet Analysis & PCAP Inspection',
        badgeId: 'packet_master',
        badgeName: 'Packet Master',
        badgeIcon: 'fa-magnifying-glass-chart',
        xpReward: 100,
        summary: 'Inspect PCAP packet headers, TCP flags, source/destination IPs, and cleartext payloads.',
        theory: [
            {
                heading: 'Packet Captures (PCAP)',
                content: 'Packet inspection toolkits (like Wireshark) capture raw Ethernet frames. Security analysts inspect IP headers, TCP flags (SYN, ACK, FIN, RST), and payload contents to uncover exfiltration or rogue command-and-control (C2) beacons.'
            }
        ],
        questions: [
            {
                id: 'ops_q5_1',
                question: 'What danger exists when inspecting raw TCP packet captures transmitted over plain Port 80 (HTTP)?',
                options: [
                    'Packets travel slower over HTTP',
                    'Unencrypted passwords, session tokens, and data payloads are visible in plain readable text to any eavesdropper',
                    'Port 80 automatically blocks viruses',
                    'Packets cannot cross internet routers'
                ],
                correctIndex: 1,
                explanation: 'HTTP transmits unencrypted data, meaning sniffers can read entire user sessions in raw packet payloads.'
            }
        ]
    },
    {
        id: 'ops_m6',
        title: 'Module 6: Malware Investigation & Process Trees',
        badgeId: 'malware_analyst',
        badgeName: 'Malware Analyst',
        badgeIcon: 'fa-bug',
        xpReward: 100,
        summary: 'Trace malicious executable child processes, registry persistence keys, and command execution chains.',
        theory: [
            {
                heading: 'Parent-Child Process Anomalies',
                content: 'Legitimate document viewers (like Word or PDF readers) should never spawn command prompts (<code>cmd.exe</code> or <code>powershell.exe</code>). When a document process launches a shell, it indicates a macro or exploit execution.'
            }
        ],
        questions: [
            {
                id: 'ops_q6_1',
                question: 'An analyst spots a PDF reader launching `cmd.exe` and `powershell.exe` in process explorer. What type of activity does this represent?',
                options: [
                    'Normal PDF printing routine',
                    'Suspicious process creation indicating exploit payload execution',
                    'Standard operating system updates',
                    'Disk defragmentation'
                ],
                correctIndex: 1,
                explanation: 'Document applications should never spawn administrative command prompts. This is a classic indicator of malicious payload execution.'
            }
        ]
    },
    {
        id: 'ops_m7',
        title: 'Module 7: Digital Forensics & Event Timelines',
        badgeId: 'forensics_expert',
        badgeName: 'Forensics Expert',
        badgeIcon: 'fa-boxes-packing',
        xpReward: 100,
        summary: 'Reconstruct post-attack timelines using browser history, USB insertion event logs, and file system artifacts.',
        theory: [
            {
                heading: 'Digital Forensics Timelines',
                content: 'When an incident occurs, analysts build a chronological timeline by correlating USB connection events (Event ID 20001), shell commands, file creation timestamps, and web access caches.'
            }
        ],
        questions: [
            {
                id: 'ops_q7_1',
                question: 'What is the primary goal of establishing an incident timeline in digital forensics?',
                options: [
                    'To clean temporary browser files',
                    'To reconstruct the exact order of events from initial breach vector to payload execution',
                    'To speed up CPU clock speed',
                    'To delete event log files'
                ],
                correctIndex: 1,
                explanation: 'A forensic timeline reveals how the attacker entered, what tools were executed, and what data was accessed or stolen.'
            }
        ]
    },
    {
        id: 'ops_m8',
        title: 'Module 8: Cryptography & Encoding Concepts',
        badgeId: 'crypto_analyst',
        badgeName: 'Crypto Analyst',
        badgeIcon: 'fa-shield-cat',
        xpReward: 100,
        summary: 'Distinguish between Base64 Encoding, SHA-256 Hashing, and Symmetric AES / Asymmetric RSA Encryption.',
        theory: [
            {
                heading: 'Encoding vs Hashing vs Encryption',
                content: '• <strong>Encoding (Base64)</strong>: Reversible data format for transmission; NOT security.<br>• <strong>Hashing (SHA-256)</strong>: One-way non-reversible mathematical fingerprint for verification.<br>• <strong>Encryption (AES/RSA)</strong>: Reversible using secret cryptographic keys.'
            }
        ],
        questions: [
            {
                id: 'ops_q8_1',
                question: 'Which mechanism is TWO-WAY and requires a secret key to transform ciphertext back into readable plaintext?',
                options: ['Base64 Encoding', 'SHA-256 Hashing', 'Symmetric Encryption (AES)', 'MD5 Checksum'],
                correctIndex: 2,
                explanation: 'Encryption requires a matching cryptographic key to decrypt ciphertext back to original plaintext.'
            }
        ]
    },
    {
        id: 'ops_m9',
        title: 'Module 9: Firewall Rules & Network Filtering',
        badgeId: 'firewall_hero',
        badgeName: 'Firewall Hero',
        badgeIcon: 'fa-shield-halved',
        xpReward: 100,
        summary: 'Configure stateful firewall rules to block unauthorized ports and isolate malicious external IP ranges.',
        theory: [
            {
                heading: 'Default-Deny Firewall Strategy',
                content: 'Best practice firewall configuration uses a <strong>Default-Deny</strong> policy: Block all incoming traffic by default, and only explicitly ALLOW verified secure ports (Port 443 for HTTPS, Port 22 for VPN/SSH).'
            }
        ],
        questions: [
            {
                id: 'ops_q9_1',
                question: 'What does a "Default-Deny" firewall policy enforce?',
                options: [
                    'Allow all internet traffic without inspection',
                    'Block all inbound and outbound network traffic unless an explicit ALLOW rule permits it',
                    'Block only email attachments',
                    'Turn off the network interface'
                ],
                correctIndex: 1,
                explanation: 'Default-Deny ensures that any unapproved port or unauthorized service is automatically blocked.'
            }
        ]
    },
    {
        id: 'ops_m10',
        title: 'Module 10: Full SOC Incident Response & Triage',
        badgeId: 'threat_hunter',
        badgeName: 'Threat Hunter',
        badgeIcon: 'fa-user-ninja',
        xpReward: 150,
        summary: 'Synthesize SIEM logs, PCAP captures, and file hashes to contain an enterprise breach and publish a SOC Incident Report.',
        theory: [
            {
                heading: 'The Incident Response Lifecycle',
                content: '1. <strong>Preparation</strong> $\rightarrow$ 2. <strong>Detection & Analysis</strong> $\rightarrow$ 3. <strong>Containment & Eradication</strong> $\rightarrow$ 4. <strong>Recovery & Lessons Learned</strong>.'
            }
        ],
        questions: [
            {
                id: 'ops_q10_1',
                question: 'Once a active malware infection is detected on a workstation, what is the immediate first containment step?',
                options: [
                    'Format the hard drive immediately',
                    'Isolate the infected computer from the network to prevent lateral movement to other servers',
                    'Send an email to the entire company',
                    'Ignore the alert until the end of the shift'
                ],
                correctIndex: 1,
                explanation: 'Network isolation stops ransomware and Trojans from spreading laterally across corporate servers while preserving forensic evidence.'
            }
        ]
    }
];
