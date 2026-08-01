/* ==========================================================================
   Cipher Escape (Level 3) - Data: 10 Progressive Story Escape Rooms
   ========================================================================== */

const CIPHER_ROOMS = [
    {
        id: 'room_1',
        title: 'Chamber 01: The Training Laboratory',
        moduleRef: 'cip_m1',
        moduleTitle: 'Module 1 (Caesar & Substitution Ciphers)',
        badgeId: 'escape_room_1',
        badgeName: 'Apprentice Breaker',
        badgeIcon: 'fa-door-open',
        xpReward: 100,
        story: 'You regain consciousness inside an abandoned cybersecurity training laboratory. Red emergency lights pulse overhead. The heavy steel exit door is sealed with a digital keypad requiring a 2-word access passkey.',
        puzzlePrompt: 'A glowing monitor on the wall displays an encrypted message left by an unknown hacker:<br><br><code class="cipher-box">KHOOR ZRUOG</code><br><br>Decipher the encrypted text above to unlock the exit door.',
        targetAnswer: 'HELLO WORLD',
        hints: [
            { level: 1, text: 'This puzzle uses a classical Caesar Shift Cipher.' },
            { level: 2, text: 'The shift key offset is 3 positions in the alphabet.' },
            { level: 3, text: 'Shift each letter backward by 3 (K -> H, H -> E, O -> L).' }
        ]
    },
    {
        id: 'room_2',
        title: 'Chamber 02: The Security Office',
        moduleRef: 'cip_m2',
        moduleTitle: 'Module 2 (Morse Code & Telegraph Signals)',
        badgeId: 'escape_room_2',
        badgeName: 'Signal Decoder',
        badgeIcon: 'fa-rss',
        xpReward: 120,
        story: 'You pass through Chamber 1 into the Security Chief\'s office. Surveillance monitors are flickering with static. A high-frequency telegraph speaker is beeping a repetitive signal.',
        puzzlePrompt: 'The terminal screen logs the incoming audio telegraph signal:<br><br><code class="cipher-box">... --- ...  -.-. -.-- -... . .-.</code><br><br>Translate the Morse Code sequence into cleartext letters to disarm the lock.',
        targetAnswer: 'SOS CYBER',
        hints: [
            { level: 1, text: 'Translate the short dots (.) and long dashes (-) using Morse Code.' },
            { level: 2, text: '... represents the letter S and --- represents the letter O.' },
            { level: 3, text: 'The signal consists of the international distress call followed by a 5-letter word.' }
        ]
    },
    {
        id: 'room_3',
        title: 'Chamber 03: The Research Facility',
        moduleRef: 'cip_m4',
        moduleTitle: 'Module 4 (Base64 & Web Encodings)',
        badgeId: 'escape_room_3',
        badgeName: 'Base64 Specialist',
        badgeIcon: 'fa-cube',
        xpReward: 140,
        story: 'You enter the central research lab. Glass test chambers line the walls. To unlock the containment barrier, you must decode the Base64 memory buffer string stored in the main mainframe memory.',
        puzzlePrompt: 'The mainframe console reads:<br><br><code class="cipher-box">Q1lCRVIgU0VDUkVU</code><br><br>Decode this Base64 string to reveal the clearance passcode.',
        targetAnswer: 'CYBER SECRET',
        hints: [
            { level: 1, text: 'This is a Base64 encoded data string.' },
            { level: 2, text: 'You can use the Base64 Decoder tool in the Decoder Workbench tab!' },
            { level: 3, text: 'Base64 translates groups of 4 ASCII characters into 3 bytes.' }
        ]
    },
    {
        id: 'room_4',
        title: 'Chamber 04: The Server Core',
        moduleRef: 'cip_m5',
        moduleTitle: 'Module 5 (Vigenère & Polyalphabetic Substitution)',
        badgeId: 'escape_room_4',
        badgeName: 'Core Cryptanalyst',
        badgeIcon: 'fa-server',
        xpReward: 160,
        story: 'You reach the humming Server Core. Cool mist fills the room. A Vigenère encrypted lock guards the primary root gateway.',
        puzzlePrompt: 'The server rack terminal displays:<br><br>Ciphertext: <code class="cipher-box">RIJVS UTVJN</code><br>Keyword Key: <code class="cipher-box">KEY</code><br><br>Decrypt the Vigenère Cipher using key "KEY" to obtain the root password.',
        targetAnswer: 'HEAVY GUARD',
        hints: [
            { level: 1, text: 'This is a Vigenère Cipher encrypted with keyword "KEY".' },
            { level: 2, text: 'Use the Vigenère Cipher tool in the Decoder Workbench tab.' },
            { level: 3, text: 'The keyword "KEY" repeats for each letter of the ciphertext (K-E-Y-K-E Y-K-E-Y-K).' }
        ]
    },
    {
        id: 'room_5',
        title: 'Chamber 05: The Cryptographic Vault',
        moduleRef: 'cip_m1',
        moduleTitle: 'Module 1 (ROT13 Symmetric Substitution)',
        badgeId: 'escape_room_5',
        badgeName: 'ROT13 Specialist',
        badgeIcon: 'fa-rotate',
        xpReward: 180,
        story: 'You step into the high-security cryptographic vault. Heavy titanium safe doors surround you. The lock mechanism uses ROT13 symmetric 13-place alphabet rotation.',
        puzzlePrompt: 'The vault keypad screen displays:<br><br><code class="cipher-box">SERRQBT</code><br><br>Apply ROT13 decryption (shift by 13) to reveal the vault passcode.',
        targetAnswer: 'FREEDOM',
        hints: [
            { level: 1, text: 'ROT13 rotates each letter 13 places in the 26-letter alphabet.' },
            { level: 2, text: 'S + 13 = F, E + 13 = R, R + 13 = E...' },
            { level: 3, text: 'The decrypted word describes your ultimate escape goal.' }
        ]
    },
    {
        id: 'room_6',
        title: 'Chamber 06: Machine Operations Center',
        moduleRef: 'cip_m3',
        moduleTitle: 'Module 3 (Hexadecimal Memory Dumps)',
        badgeId: 'escape_room_6',
        badgeName: 'Hex Analyst',
        badgeIcon: 'fa-microchip',
        xpReward: 200,
        story: 'You navigate to the Machine Operations Center. Industrial control terminals display raw Base-16 hexadecimal memory dump bytes.',
        puzzlePrompt: 'The terminal display logs Hex bytes:<br><br><code class="cipher-box">0x43 0x59 0x50 0x48 0x45 0x52</code><br><br>Convert these Hex bytes into cleartext ASCII characters to override machine lock.',
        targetAnswer: 'CYPHER',
        hints: [
            { level: 1, text: 'Convert Base-16 Hexadecimal numbers to ASCII characters (0x43 = 67 in decimal).' },
            { level: 2, text: '0x43 = C, 0x59 = Y, 0x50 = P, 0x48 = H...' },
            { level: 3, text: 'Spells a 6-letter cryptography term starting with C.' }
        ]
    },
    {
        id: 'room_7',
        title: 'Chamber 07: Signal Relay Station',
        moduleRef: 'cip_m1',
        moduleTitle: 'Module 1 (Reverse Text Transposition)',
        badgeId: 'escape_room_7',
        badgeName: 'Relay Operator',
        badgeIcon: 'fa-tower-broadcast',
        xpReward: 220,
        story: 'You climb into the Signal Relay Station. Radio towers hum outside. An inverted mirror text cipher seals the antenna relay gateway.',
        puzzlePrompt: 'The relay terminal displays backwards text:<br><br><code class="cipher-box">YEK ESREVER</code><br><br>Reverse the text sequence from right to left to obtain the relay passcode.',
        targetAnswer: 'REVERSE KEY',
        hints: [
            { level: 1, text: 'This is a simple reverse text transposition cipher.' },
            { level: 2, text: 'Read the characters backward from right to left.' },
            { level: 3, text: 'The first word is REVERSE.' }
        ]
    },
    {
        id: 'room_8',
        title: 'Chamber 08: Mainframe Firewall Hub',
        moduleRef: 'cip_m5',
        moduleTitle: 'Module 5 (Atbash Reverse Alphabet Cipher)',
        badgeId: 'escape_room_8',
        badgeName: 'Firewall Breaker',
        badgeIcon: 'fa-shield-halved',
        xpReward: 240,
        story: 'You access the Mainframe Firewall Hub. Heat flares from high-speed network switches. An ancient Atbash reversed-alphabet cipher protects root firewall parameters.',
        puzzlePrompt: 'The firewall rule display shows Atbash ciphertext:<br><br><code class="cipher-box">ZGYZTS</code><br><br>Reverse the alphabet mapping (A<->Z, B<->Y, C<->X) to decrypt the access code.',
        targetAnswer: 'ATTACK',
        hints: [
            { level: 1, text: 'Atbash flips the alphabet: A=Z, B=Y, C=X, D=W, E=V...' },
            { level: 2, text: 'Z -> A, G -> T, Y -> B, T -> G, S -> H...' },
            { level: 3, text: 'Spells a 6-letter cybersecurity threat word starting with A.' }
        ]
    },
    {
        id: 'room_9',
        title: 'Chamber 09: Quantum Encryption Bay',
        moduleRef: 'cip_m1',
        moduleTitle: 'Module 1 (Caesar Key Offset +3)',
        badgeId: 'escape_room_9',
        badgeName: 'Quantum Cryptographer',
        badgeIcon: 'fa-atom',
        xpReward: 260,
        story: 'You enter the ultra-secure Quantum Encryption Bay. Laser beams crisscross the chamber floor. A Caesar Shift cipher key (+3) seals the quantum core control panel.',
        puzzlePrompt: 'The quantum core display shows ciphertext:<br><br><code class="cipher-box">VDIH</code><br><br>Shift each letter backward by 3 positions to disarm the quantum lock.',
        targetAnswer: 'SAFE',
        hints: [
            { level: 1, text: 'Apply Caesar shift backward by 3 positions.' },
            { level: 2, text: 'V - 3 = S, D - 3 = A, I - 3 = F, H - 3 = E.' },
            { level: 3, text: 'Spells a 4-letter security adjective.' }
        ]
    },
    {
        id: 'room_10',
        title: 'Chamber 10: Master Control Center & Blast Exit',
        moduleRef: 'cip_m3',
        moduleTitle: 'Module 3 (8-Bit Binary ASCII Transmission)',
        badgeId: 'escape_room_10',
        badgeName: 'Master Escape Artist',
        badgeIcon: 'fa-award',
        xpReward: 300,
        story: 'You stand before the heavy blast doors of the Master Control Center! Sunlight beams through the reinforced observation window. An 8-bit binary ASCII sequence locks the final freedom exit gate.',
        puzzlePrompt: 'The master door keypad requires translating 8-bit ASCII binary bytes:<br><br><code class="cipher-box">01000110 01010010 01000101 01000101 01000100 01001111 01001101</code><br><br>Convert each 8-bit byte into ASCII text to trigger the final blast door escape sequence!',
        targetAnswer: 'FREEDOM',
        hints: [
            { level: 1, text: 'Convert each 8-bit binary byte to ASCII text (01000110 = F, 01010010 = R).' },
            { level: 2, text: 'Use the Binary Translator tool in the Decoder Workbench tab.' },
            { level: 3, text: 'The 7 binary bytes spell a single word describing your escape state.' }
        ]
    }
];
