/* ==========================================================================
   CyberOps Lab (Level 2) - Data: 8 Randomized Real-World Incident Scenarios
   ========================================================================== */

const SOC_INCIDENT_SCENARIOS = [
    {
        id: 'inc_1',
        title: 'Incident #801: Double-Extension Phishing & Trojan Executable',
        moduleRef: 'ops_m6',
        moduleTitle: 'Module 6 (Malware Investigation)',
        briefing: 'At 10:04:22, a SIEM alert fired for employee computer <code>192.168.1.14</code>. User <code>sarah_m</code> opened a suspicious email attachment named <code>invoice_july.pdf.exe</code> downloaded from <code>unknown-host.ru</code>. Process logs show <code>AdobeReader.exe</code> spawning <code>powershell.exe -Enc ExecutionPolicy Bypass</code>.',
        questions: [
            {
                id: 'iq1_1',
                question: '1. What was the primary attack vector used to gain initial access?',
                options: [
                    'Phishing email attachment with a double-extension executable file',
                    'SQL Injection on the corporate web portal',
                    'Physical theft of an unencrypted laptop',
                    'Zero-day buffer overflow in the corporate router'
                ],
                correctIndex: 0
            },
            {
                id: 'iq1_2',
                question: '2. What is the malicious external host domain from which the payload was downloaded?',
                options: [
                    'unknown-host.ru',
                    'github.com',
                    'paypa1-security.com',
                    'google.com'
                ],
                correctIndex: 0
            },
            {
                id: 'iq1_3',
                question: '3. What suspicious parent-child process anomaly was detected in system process logs?',
                options: [
                    'AdobeReader.exe spawned powershell.exe with execution policy bypass',
                    'Chrome.exe spawned Notepad.exe',
                    'System.exe spawned Calculator.exe',
                    'Explorer.exe opened a JPEG file'
                ],
                correctIndex: 0
            },
            {
                id: 'iq1_4',
                question: '4. What file extension technique was used to trick the user into executing the malware?',
                options: [
                    'Double extension (.pdf.exe) hiding an executable binary behind a PDF icon',
                    'Base64 URL encoding',
                    'MD5 hash collision',
                    'ZIP archive compression'
                ],
                correctIndex: 0
            },
            {
                id: 'iq1_5',
                question: '5. What is the immediate containment action required for the infected workstation?',
                options: [
                    'Isolate workstation 192.168.1.14 from the network and terminate powershell.exe',
                    'Restart the office Wi-Fi router',
                    'Ignore the alert and monitor logs until tomorrow',
                    'Format the corporate database server'
                ],
                correctIndex: 0
            }
        ]
    },
    {
        id: 'inc_2',
        title: 'Incident #802: SSH Brute-Force & Account Takeover',
        moduleRef: 'ops_m1',
        moduleTitle: 'Module 1 (Log Investigation)',
        briefing: 'Between 10:01:05 and 10:01:14, SIEM authentication logs recorded 15 rapid failed SSH logins targeting user accounts <code>root</code>, <code>admin</code>, and <code>user1</code> from external IP <code>45.142.120.9</code>. At 10:01:20, a successful SSH login was established for <code>admin</code> from the same IP address.',
        questions: [
            {
                id: 'iq2_1',
                question: '1. What type of attack was conducted against the SSH server?',
                options: [
                    'Automated SSH Brute-Force / Credential Stuffing Attack',
                    'Cross-Site Scripting (XSS)',
                    'Man-in-the-Middle Wi-Fi Eavesdropping',
                    'DNS Poisoning Attack'
                ],
                correctIndex: 0
            },
            {
                id: 'iq2_2',
                question: '2. What is the malicious source IP address of the brute-force attacker?',
                options: [
                    '45.142.120.9',
                    '192.168.1.105',
                    '142.250.190.46',
                    '8.8.8.8'
                ],
                correctIndex: 0
            },
            {
                id: 'iq2_3',
                question: '3. What user account was successfully compromised by the attacker?',
                options: [
                    'admin',
                    'root',
                    'sarah_m',
                    'guest'
                ],
                correctIndex: 0
            },
            {
                id: 'iq2_4',
                question: '4. How many failed authentication attempts preceded the successful compromise?',
                options: [
                    '15 failed login attempts in 10 seconds',
                    '1 failed login attempt',
                    '1000 failed attempts',
                    'No failed attempts'
                ],
                correctIndex: 0
            },
            {
                id: 'iq2_5',
                question: '5. What firewall & account defense rule should be immediately applied?',
                options: [
                    'Add IP 45.142.120.9 to Firewall Blocklist and reset user admin credentials with mandatory MFA',
                    'Allow Port 22 open to all public IP addresses',
                    'Disable real-time antivirus scanning',
                    'Delete system authentication logs'
                ],
                correctIndex: 0
            }
        ]
    },
    {
        id: 'inc_3',
        title: 'Incident #803: Web SQL Injection & Database Dump',
        moduleRef: 'ops_m4',
        moduleTitle: 'Module 4 (Network & Web Security)',
        briefing: 'Web server logs on <code>192.168.1.50</code> recorded <code>GET /portal/login.php?user=\' OR 1=1--</code> originating from external IP <code>185.220.101.5</code>. Following this request, a 50MB SQL database dump file was transferred over HTTP.',
        questions: [
            {
                id: 'iq3_1',
                question: '1. What web application vulnerability was exploited by the attacker?',
                options: [
                    'SQL Injection (SQLi)',
                    'Buffer Overflow',
                    'Phishing Email',
                    'Hardware Failure'
                ],
                correctIndex: 0
            },
            {
                id: 'iq3_2',
                question: '2. What is the malicious source IP address of the web attacker?',
                options: [
                    '185.220.101.5',
                    '192.168.1.50',
                    '10.0.0.1',
                    '172.16.0.4'
                ],
                correctIndex: 0
            },
            {
                id: 'iq3_3',
                question: '3. What input payload pattern revealed the SQL Injection attempt in web logs?',
                options: [
                    'user=\' OR 1=1--',
                    'ping google.com',
                    'admin:password123',
                    'GET /index.html'
                ],
                correctIndex: 0
            },
            {
                id: 'iq3_4',
                question: '4. What risk is associated with SQL Injection attacks against database servers?',
                options: [
                    'Unauthorized reading, extraction, or deletion of sensitive database records',
                    'Slowing down monitor refresh rate',
                    'Corrupting physical Ethernet cables',
                    'Encrypting CPU fan speeds'
                ],
                correctIndex: 0
            },
            {
                id: 'iq3_5',
                question: '5. What developer remediation prevents SQL Injection vulnerabilities?',
                options: [
                    'Using Parameterized Queries (Prepared Statements) instead of concatenating raw SQL strings',
                    'Disabling HTTPS encryption',
                    'Changing the web server domain name',
                    'Increasing server RAM'
                ],
                correctIndex: 0
            }
        ]
    },
    {
        id: 'inc_4',
        title: 'Incident #804: DNS Tunneling Data Exfiltration',
        moduleRef: 'ops_m5',
        moduleTitle: 'Module 5 (Packet Analysis & PCAP)',
        briefing: 'PCAP packet analysis revealed workstation <code>192.168.1.14</code> sending hundreds of high-frequency DNS queries over Port 53 to subdomains like <code>exfil-data-chunk1.unknown-host.ru</code>, encoding sensitive corporate files inside DNS sub-queries.',
        questions: [
            {
                id: 'iq4_1',
                question: '1. What covert data exfiltration technique was detected in the PCAP packet stream?',
                options: [
                    'DNS Tunneling / Data Exfiltration over Port 53',
                    'FTP Anonymous Download',
                    'ARP Cache Poisoning',
                    'SMTP Mail Relay'
                ],
                correctIndex: 0
            },
            {
                id: 'iq4_2',
                question: '2. What protocol and port were abused to bypass firewall HTTP inspection filters?',
                options: [
                    'DNS protocol over Port 53',
                    'HTTP protocol over Port 80',
                    'HTTPS protocol over Port 443',
                    'SSH protocol over Port 22'
                ],
                correctIndex: 0
            },
            {
                id: 'iq4_3',
                question: '3. What domain suffix was receiving the exfiltrated data chunks?',
                options: [
                    'unknown-host.ru',
                    'google.com',
                    'github.com',
                    'cyberjourney.io'
                ],
                correctIndex: 0
            },
            {
                id: 'iq4_4',
                question: '4. Why do attackers abuse DNS queries for data exfiltration?',
                options: [
                    'Because DNS traffic (Port 53) is often left unblocked by default firewalls to allow domain lookups',
                    'Because DNS traffic travels faster than light',
                    'Because DNS encrypts all data automatically',
                    'Because DNS requires no IP addresses'
                ],
                correctIndex: 0
            },
            {
                id: 'iq4_5',
                question: '5. What network containment rule should be configured on the perimeter firewall?',
                options: [
                    'Restrict DNS outbound queries (Port 53) exclusively to internal corporate DNS resolvers',
                    'Allow all external DNS servers on public internet',
                    'Turn off system firewall',
                    'Disable IPv4 networking'
                ],
                correctIndex: 0
            }
        ]
    }
];
