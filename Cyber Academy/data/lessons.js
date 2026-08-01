/* ==========================================================================
   Cyber Academy - Data Module: Lessons, Theory Notes & Quiz Question Banks
   ========================================================================== */

const ACADEMY_LESSONS = [
    {
        id: 'ch1',
        title: 'Chapter 1: Password Security & Multi-Factor Auth',
        badgeId: 'pass_guardian',
        badgeName: 'Password Guardian',
        badgeIcon: 'fa-key',
        xpReward: 50,
        summary: 'Learn why passwords get cracked and how passphrases & MFA protect accounts.',
        theory: [
            {
                heading: 'Why Simple Passwords Fail',
                content: 'Hackers use automated programs called **Brute-Force Attackers** and **Dictionary Attackers**. A simple 8-character lowercase password like <code>password</code> or <code>john2005</code> can be guessed in under 1 second using modern GPUs.'
            },
            {
                heading: 'What Makes a Strong Password?',
                content: 'A strong password combines length (12+ characters), uppercase letters, lowercase letters, numbers, and special symbols (e.g., <code>T!ger#92Moon</code>). Better yet, use a **Passphrase**—a sequence of random words like <code>Purple#Elephant$Jumps99</code>.'
            },
            {
                heading: 'Multi-Factor Authentication (MFA / 2FA)',
                content: 'MFA adds a second layer of defense. Even if a cybercriminal steals your password, they cannot log in without the 6-digit code sent to your authenticator app or security key.'
            }
        ],
        questions: [
            {
                id: 'q1_1',
                question: 'Which of the following passwords provides the strongest protection against brute-force attacks?',
                options: [
                    'password123',
                    'john2005',
                    'T!ger#92Moon',
                    'admin2024'
                ],
                correctIndex: 2,
                explanation: 'Correct! "T!ger#92Moon" uses a combination of uppercase letters, lowercase letters, numbers, and special symbols (! and #), making it mathematically resilient to dictionary attacks.'
            },
            {
                id: 'q1_2',
                question: 'Why is Multi-Factor Authentication (MFA) essential for high-security accounts?',
                options: [
                    'It makes your password shorter and easier to type.',
                    'It requires a second proof of identity (like an authenticator code) even if your password is leaked.',
                    'It automatically changes your password every 5 minutes.',
                    'It disables internet access when you log out.'
                ],
                correctIndex: 1,
                explanation: 'Correct! MFA ensures that a compromised password alone is not enough for an attacker to breach your account.'
            },
            {
                id: 'q1_3',
                question: 'What is a "Credential Stuffing" attack?',
                options: [
                    'When hackers guess passwords by looking over your shoulder.',
                    'When attackers use stolen username/password pairs from one breach to attempt logins on other websites.',
                    'When your browser saves your passwords automatically.',
                    'When an antivirus blocks an unknown application.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Credential stuffing relies on people reusing the same password across multiple websites. Always use unique passwords!'
            },
            {
                id: 'q1_4',
                question: 'What is the recommended minimum length for a secure passphrase?',
                options: [
                    '4 characters',
                    '6 characters',
                    '8 characters',
                    '12 to 16+ characters'
                ],
                correctIndex: 3,
                explanation: 'Correct! Modern cybersecurity standards recommend passphrases of 12 to 16+ characters.'
            }
        ]
    },
    {
        id: 'ch2',
        title: 'Chapter 2: Phishing Attack Defense & Email Safety',
        badgeId: 'phish_detective',
        badgeName: 'Phishing Detective',
        badgeIcon: 'fa-fish',
        xpReward: 50,
        summary: 'Identify malicious emails, deceptive sender addresses, and urgency tactics.',
        theory: [
            {
                heading: 'What is Phishing?',
                content: 'Phishing is a social engineering attack where cybercriminals send fraudulent messages disguised as legitimate organizations (like banks, PayPal, or IT support) to trick you into revealing sensitive credentials.'
            },
            {
                heading: 'Red Flags in Phishing Emails',
                content: 'Look for: <ul><li><strong>Spoofed Senders:</strong> E.g., <code>support@paypa1-security.com</code> instead of <code>@paypal.com</code>.</li><li><strong>Artificial Urgency:</strong> "Account Suspended in 2 Hours!"</li><li><strong>Generic Greetings:</strong> "Dear Customer" instead of your name.</li><li><strong>Hidden Links:</strong> Text says one thing, but hovering reveals a dangerous URL.</li></ul>'
            },
            {
                heading: 'How to Respond to Phishing Attempts',
                content: 'Never click suspicious links or download unexpected attachments. Always verify directly through the official website or app, and report suspicious emails using your email provider’s "Report Phishing" button.'
            }
        ],
        questions: [
            {
                id: 'q2_1',
                question: 'You receive an email claiming your bank account is locked. The sender address is "service@bancofamerica-support-update.net". What should you do?',
                options: [
                    'Click the link in the email immediately to unlock it.',
                    'Reply to the email with your credit card details to verify.',
                    'Treat it as a phishing scam, do not click links, and report it.',
                    'Forward it to all your friends so they know.'
                ],
                correctIndex: 2,
                explanation: 'Correct! The domain "bancofamerica-support-update.net" is fake. Official notifications will come directly from verified bank domains.'
            },
            {
                id: 'q2_2',
                question: 'What happens when you hover your mouse cursor over a hyperlink in an email?',
                options: [
                    'The link automatically opens in a private tab.',
                    'Your email app scans the link for viruses.',
                    'The true destination URL is displayed in the preview status bar.',
                    'The text of the email turns green.'
                ],
                correctIndex: 2,
                explanation: 'Correct! Hovering over links reveals the actual destination URL, helping you spot misleading link text.'
            },
            {
                id: 'q2_3',
                question: 'Why do phishing emails frequently use urgent threats like "Urgent: Action Required in 30 Minutes"?',
                options: [
                    'Because bank servers shut down every 30 minutes.',
                    'To panic victims so they act quickly before thinking critically or checking details.',
                    'To speed up email delivery across internet routers.',
                    'Because it is an automated requirement by law.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Emotional urgency is a psychological tactic designed to bypass your logical security checks.'
            },
            {
                id: 'q2_4',
                question: 'What is "Spear Phishing"?',
                options: [
                    'Phishing attacks sent via SMS text message.',
                    'A highly targeted phishing attack customized with personal info about a specific individual or company.',
                    'Phishing through voice phone calls.',
                    'Phishing that targets Wi-Fi routers directly.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Spear phishing uses research about you (from social media or company sites) to create believable custom scams.'
            }
        ]
    },
    {
        id: 'ch3',
        title: 'Chapter 3: Safe Web Browsing & Domain Verification',
        badgeId: 'safe_browser',
        badgeName: 'Safe Browser',
        badgeIcon: 'fa-globe',
        xpReward: 50,
        summary: 'Master HTTPS locks, SSL certificates, domain names, and typosquatting.',
        theory: [
            {
                heading: 'Understanding Web Protocols: HTTP vs HTTPS',
                content: '<code>HTTP</code> transmits data in plain readable text—anyone on your network can sniff your passwords. <code>HTTPS</code> uses SSL/TLS encryption to protect your data in transit between your browser and the web server.'
            },
            {
                heading: 'Domain Names & Typosquatting',
                content: 'Attackers register domain names that look almost identical to popular sites (e.g. <code>g00gle.com</code> or <code>wellsfarg0.com</code>). Always double check the exact domain spelling in your browser address bar.'
            },
            {
                heading: 'Does HTTPS Mean a Site is 100% Safe?',
                content: 'No! The padlock icon means your connection is encrypted, but scam websites can also acquire free HTTPS certificates. Always verify **WHO** owns the domain, not just the lock icon.'
            }
        ],
        questions: [
            {
                id: 'q3_1',
                question: 'What is the main security advantage of HTTPS over HTTP?',
                options: [
                    'HTTPS makes web pages load 10 times faster.',
                    'HTTPS encrypts all data sent between your browser and the website.',
                    'HTTPS prevents websites from displaying advertisements.',
                    'HTTPS blocks all viruses from downloading automatically.'
                ],
                correctIndex: 1,
                explanation: 'Correct! HTTPS encrypts your credentials, credit card details, and personal data so interceptors cannot read them.'
            },
            {
                id: 'q3_2',
                question: 'You visit a online store displaying "http://store-login.com" without a padlock. Is it safe to enter passwords?',
                options: [
                    'Yes, as long as your computer has an antivirus installed.',
                    'Yes, because it has "login" in the web address.',
                    'No, unencrypted HTTP connections can be intercepted by hackers on your network.',
                    'Yes, if you use a private browsing window.'
                ],
                correctIndex: 2,
                explanation: 'Correct! Never enter credentials or financial data on unencrypted HTTP sites.'
            },
            {
                id: 'q3_3',
                question: 'What is "Typosquatting"?',
                options: [
                    'When a user types too fast and breaks their keyboard.',
                    'Registering mispelled domain names (like "arnazon.com") to trick visitors into fake websites.',
                    'A virus that changes your browser search engine.',
                    'When your internet connection drops suddenly.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Typosquatters register common misspellings of popular sites to host phishing clones.'
            },
            {
                id: 'q3_4',
                question: 'If a phishing site displays a padlock icon (HTTPS), does that guarantee it is safe?',
                options: [
                    'Yes, padlocks mean the site is verified by government agencies.',
                    'No, padlocks only mean the connection is encrypted; scammers can also enable HTTPS on fake sites.',
                    'Yes, padlocks mean no malware can exist on the server.',
                    'No, padlocks only work on desktop computers.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Padlocks mean encrypted transit, but scammers can encrypt fake websites too. Always check the domain domain name!'
            }
        ]
    },
    {
        id: 'ch4',
        title: 'Chapter 4: Malware Defense & Threat Detection',
        badgeId: 'malware_hunter',
        badgeName: 'Malware Hunter',
        badgeIcon: 'fa-bug',
        xpReward: 50,
        summary: 'Spot dangerous file extensions, trojans, ransomware, and scan systems.',
        theory: [
            {
                heading: 'Types of Malware',
                content: 'Malware (Malicious Software) includes: <ul><li><strong>Viruses:</strong> Self-replicating programs that infect files.</li><li><strong>Trojans:</strong> Disguised as legitimate games/cracks to infiltrate your device.</li><li><strong>Ransomware:</strong> Encrypts your files and demands payment for the decryption key.</li><li><strong>Spyware:</strong> Secretly records keystrokes and webcam feeds.</li></ul>'
            },
            {
                heading: 'Dangerous File Extensions',
                content: 'Be extremely cautious of executable files (`.exe`, `.bat`, `.vbs`, `.scr`). Watch out for double extension tricks like <code>invoice.pdf.exe</code> where Windows hides the final `.exe`!'
            },
            {
                heading: 'Best Defense Practices',
                content: 'Keep real-time antivirus protection active, download software only from official sources, enable automatic OS updates, and maintain offline backups of important files.'
            }
        ],
        questions: [
            {
                id: 'q4_1',
                question: 'You download a file named "homework_assignment.pdf.exe". What is this file?',
                options: [
                    'A standard Adobe PDF document.',
                    'An executable program disguised as a PDF using a double extension trick.',
                    'A compressed zip archive.',
                    'A video file.'
                ],
                correctIndex: 1,
                explanation: 'Correct! The true extension is the last one (.exe). Attackers name files ".pdf.exe" hoping Windows hides the .exe part!'
            },
            {
                id: 'q4_2',
                question: 'What is Ransomware?',
                options: [
                    'Malware that displays annoying pop-up advertisements.',
                    'Malware that encrypts your personal files and demands money to restore access.',
                    'A utility that cleans your hard drive.',
                    'A browser extension for online shopping discounts.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Ransomware locks down your files with encryption and demands ransom payments.'
            },
            {
                id: 'q4_3',
                question: 'What is a "Trojan Horse" in cybersecurity?',
                options: [
                    'A hardware virus that destroys your monitor.',
                    'Malicious software disguised as a helpful program or game crack to trick you into installing it.',
                    'An email attachment containing text only.',
                    'A secure backup drive.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Trojans pretend to be useful tools or free game cracks to trick users into running malicious code.'
            },
            {
                id: 'q4_4',
                question: 'Why are operating system security updates crucial for malware defense?',
                options: [
                    'They change your desktop background image.',
                    'They patch known security vulnerabilities before hackers can exploit them.',
                    'They delete all your stored browser cookies.',
                    'They increase your internet download bandwidth.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Software updates fix security flaws ("zero-days") that malware uses to infect computers.'
            }
        ]
    },
    {
        id: 'ch5',
        title: 'Chapter 5: Network Security & Wi-Fi Protection',
        badgeId: 'network_defender',
        badgeName: 'Network Defender',
        badgeIcon: 'fa-network-wired',
        xpReward: 50,
        summary: 'Understand IP addresses, router security, open Wi-Fi risks, and firewalls.',
        theory: [
            {
                heading: 'How Local Networks Work',
                content: 'Your computer connects to a **Router**, which acts as the gateway to the global **Internet**. Every device on the network gets an **IP Address** (like an online postal address).'
            },
            {
                heading: 'Public Open Wi-Fi Risks',
                content: 'Connecting to free open Wi-Fi in coffee shops without encryption allows hackers on the same network to perform **Man-in-the-Middle (MitM)** attacks. Use a trusted VPN when on public Wi-Fi!'
            },
            {
                heading: 'Securing Your Home Router & Firewall',
                content: 'Change default router admin passwords, enable WPA3/WPA2 Wi-Fi encryption, and keep your system **Firewall** turned ON to block unauthorized incoming connections.'
            }
        ],
        questions: [
            {
                id: 'q5_1',
                question: 'Why is it risky to log into bank accounts over an open public Wi-Fi network without a VPN?',
                options: [
                    'Public Wi-Fi makes your laptop battery drain faster.',
                    'Attackers on the same unencrypted network can sniff your data packets or redirect you to fake login pages.',
                    'Public Wi-Fi automatically deletes your saved bookmarks.',
                    'Your bank will charge you a extra transaction fee.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Open Wi-Fi lacks encryption, allowing adversaries on the same hotspot to capture unencrypted network traffic.'
            },
            {
                id: 'q5_2',
                question: 'What is the role of a network Firewall?',
                options: [
                    'To cool down your computer processor fan.',
                    'To monitor and filter incoming and outgoing network traffic based on security rules.',
                    'To increase your Wi-Fi signal range.',
                    'To clean physical dust inside your router.'
                ],
                correctIndex: 1,
                explanation: 'Correct! Firewalls act as a protective barrier, blocking suspicious ports and unauthorized network connections.'
            },
            {
                id: 'q5_3',
                question: 'What is an IP Address?',
                options: [
                    'A password created by Microsoft.',
                    'A unique numerical identifier assigned to a device on a network (e.g. 192.168.1.10).',
                    'A type of USB cable.',
                    'An antivirus scanning engine.'
                ],
                correctIndex: 1,
                explanation: 'Correct! An IP (Internet Protocol) address identifies devices on local and global networks.'
            },
            {
                id: 'q5_4',
                question: 'What is the safest Wi-Fi security encryption protocol for home networks?',
                options: [
                    'No Security (Open)',
                    'WEP (Wired Equivalent Privacy)',
                    'WPA3 / WPA2-Personal',
                    'Bluetooth 1.0'
                ],
                correctIndex: 2,
                explanation: 'Correct! WPA3 (and WPA2) provide strong modern encryption. WEP is outdated and can be cracked in minutes.'
            }
        ]
    },
    {
        id: 'final_exam',
        title: 'FINAL EXAM: Cyber Defense Certification',
        badgeId: 'cyber_defender_cert',
        badgeName: 'Cyber Defender Cert',
        badgeIcon: 'fa-shield-halved',
        xpReward: 100,
        summary: 'Synthesize all 5 chapters in a comprehensive 10-question final evaluation test.',
        theory: [
            {
                heading: 'Final Trainee Assessment',
                content: 'Demonstrate your mastery across Passwords, Phishing, Safe Browsing, Malware, and Networks to complete Cyber Academy and earn your official **Cyber Defender Certificate**!'
            }
        ],
        questions: [
            {
                id: 'fe_1',
                question: 'Which authentication method combines something you know (password) with something you have (phone app)?',
                options: ['Single Sign-On (SSO)', 'Multi-Factor Authentication (MFA)', 'Biometric Scan', 'Brute-Force Attack'],
                correctIndex: 1,
                explanation: 'MFA combines multiple independent credentials.'
            },
            {
                id: 'fe_2',
                question: 'An email states "Your Amazon order #9942 failed! Click HERE within 10 minutes". Sender is "notify@amzn-alert-center.info". What is this?',
                options: ['Official Amazon Alert', 'Phishing Scam', 'Antivirus Update', 'Browser Patch'],
                correctIndex: 1,
                explanation: 'Fake domain and high artificial urgency indicate phishing.'
            },
            {
                id: 'fe_3',
                question: 'Does an HTTPS padlock on a website mean it is 100% legitimate and safe from fraud?',
                options: ['Yes, padlocks guarantee safety.', 'No, HTTPS encrypts connection, but scammers can also get HTTPS certificates for fake sites.', 'Yes, padlocks block malware.', 'No, padlocks only work on mobile.'],
                correctIndex: 1,
                explanation: 'Padlock indicates encryption in transit, not domain legitimacy.'
            },
            {
                id: 'fe_4',
                question: 'You notice a file named "game_installer.exe.jpg". What is dangerous about it?',
                options: ['It is a high resolution photo.', 'It uses extension trickery to execute code on your PC.', 'It is too small.', 'It cannot be deleted.'],
                correctIndex: 1,
                explanation: 'The executable extension hides behind an image label.'
            },
            {
                id: 'fe_5',
                question: 'What is the primary function of a network Firewall?',
                options: ['Speed up downloads', 'Filter and block unauthorized network connections', 'Store browser cookies', 'Format hard drives'],
                correctIndex: 1,
                explanation: 'Firewalls inspect and restrict network traffic.'
            },
            {
                id: 'fe_6',
                question: 'What is the safest way to store 30+ complex, unique passwords?',
                options: ['Write them on a sticky note under your keyboard', 'Use a secure Master-Passphrase Encrypted Password Manager', 'Reuse one simple password for all 30 sites', 'Email them to yourself'],
                correctIndex: 1,
                explanation: 'Password managers securely encrypt unique logins.'
            },
            {
                id: 'fe_7',
                question: 'What is "Smishing"?',
                options: ['Phishing carried out via SMS text messages', 'Phishing carried out over video calls', 'Scanning Wi-Fi routers', 'Deleting spyware'],
                correctIndex: 0,
                explanation: 'Smishing = SMS + Phishing.'
            },
            {
                id: 'fe_8',
                question: 'Why should you avoid downloading free cracked software from file-sharing forums?',
                options: ['Cracked software runs slower.', 'Cracks often contain Trojan malware bundled inside the installer.', 'It consumes too much RAM.', 'It changes your display resolution.'],
                correctIndex: 1,
                explanation: 'Game cracks are a primary distribution vector for Trojans and Ransomware.'
            },
            {
                id: 'fe_9',
                question: 'What is a "Man-in-the-Middle" (MitM) attack?',
                options: ['When an attacker secretly intercepts and relays communications between two parties', 'When a computer fan overheats', 'When a password contains numbers in the middle', 'When a router reboots'],
                correctIndex: 0,
                explanation: 'MitM eavesdrops on or tampers with network transmissions.'
            },
            {
                id: 'fe_10',
                question: 'What Wi-Fi practice should you follow when connecting to public airport Wi-Fi?',
                options: ['Disable your firewall', 'Use a Virtual Private Network (VPN) to encrypt all traffic', 'Turn off MFA', 'Share your local folders'],
                correctIndex: 1,
                explanation: 'A VPN creates an encrypted tunnel over untrusted networks.'
            }
        ]
    }
];
