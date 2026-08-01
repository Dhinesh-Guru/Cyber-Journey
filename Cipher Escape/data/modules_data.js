/* ==========================================================================
   Cipher Escape (Level 3) - Data: 5 Comprehensive Cryptography Modules
   ========================================================================== */

const CIPHER_MODULES = [
    {
        id: 'cip_m1',
        title: 'Module 1: Classical Ciphers (Caesar, ROT13, Atbash & Reverse Text)',
        badgeId: 'caesar_master',
        badgeName: 'Caesar Master',
        badgeIcon: 'fa-repeat',
        xpReward: 100,
        summary: 'Master Caesar shift offsets, symmetric ROT13, Atbash reverse alphabet mapping, and text transposition.',
        theory: [
            {
                heading: '1. The Caesar Cipher (Shift Cipher)',
                content: 'Named after Julius Caesar, this substitution cipher shifts each letter by a fixed number of positions (e.g. Shift $+3$: <code>A $\rightarrow$ D</code>, <code>B $\rightarrow$ E</code>). Decrypting requires shifting backward by the same key.'
            },
            {
                heading: '2. ROT13 Symmetric Substitution',
                content: 'ROT13 (Rotate by 13 places) is a symmetric Caesar shift of 13 positions. Because the English alphabet has 26 letters, applying ROT13 twice restores the original text.'
            },
            {
                heading: '3. The Atbash Reverse Alphabet Cipher',
                content: 'Atbash is an ancient monoalphabetic substitution cipher where the alphabet is mapped in reverse: <code>A $\leftrightarrow$ Z</code>, <code>B $\leftrightarrow$ Y</code>, <code>C $\leftrightarrow$ X</code>, <code>D $\leftrightarrow$ W</code>. For example, <code>ZGYZTS</code> maps to <code>ATTACK</code>.'
            },
            {
                heading: '4. Reverse Text Transposition Cipher',
                content: 'In Transposition ciphers, character order is rearranged without replacing the letters. A Reverse Text cipher simply reverses the character string from right to left (e.g. <code>YEK ESREVER $\rightarrow$ REVERSE KEY</code>).'
            }
        ],
        questions: [
            {
                id: 'cip_q1_1',
                question: 'If the plaintext letter "A" is encrypted with a Caesar Shift of +3, what is the resulting ciphertext letter?',
                options: ['C', 'D', 'E', 'B'],
                correctIndex: 1,
                explanation: 'Shifting "A" forward by 3 letters (A -> B -> C -> D) yields "D".'
            },
            {
                id: 'cip_q1_2',
                question: 'In the Atbash reverse-alphabet cipher (A=Z, B=Y, C=X), what letter does "Z" decrypt to?',
                options: ['A', 'B', 'M', 'Z'],
                correctIndex: 0,
                explanation: 'In Atbash, Z is the reverse mapping of A.'
            },
            {
                id: 'cip_q1_3',
                question: 'How do you decrypt a Reverse Text Transposition cipher like "YEK"?',
                options: [
                    'Read the characters backward from right to left to get "KEY"',
                    'Shift each letter forward by 3',
                    'Convert the letters to binary numbers',
                    'Multiply the letters by 13'
                ],
                correctIndex: 0,
                explanation: 'Reverse text transposition simply flips character sequence order backward.'
            }
        ]
    },
    {
        id: 'cip_m2',
        title: 'Module 2: Morse Code & Telegraph Signals',
        badgeId: 'morse_expert',
        badgeName: 'Morse Expert',
        badgeIcon: 'fa-rss',
        xpReward: 100,
        summary: 'Master short signals (dots `.`) and long signals (dashes `-`) for emergency telecommunication.',
        theory: [
            {
                heading: 'Morse Code Fundamentals',
                content: 'Morse Code represents text using sequences of short signals (Dots <code>.</code>) and long signals (Dashes <code>-</code>). For example, <code>S</code> is <code>...</code> and <code>O</code> is <code>---</code>, making <code>SOS</code> equal <code>... --- ...</code>.'
            }
        ],
        questions: [
            {
                id: 'cip_q2_1',
                question: 'What is the Morse Code representation for the international distress signal "SOS"?',
                options: ['... --- ...', '--- ... ---', '.. -- ..', '. - .'],
                correctIndex: 0,
                explanation: 'S = ... and O = ---, giving ... --- ... as the universal SOS distress call.'
            }
        ]
    },
    {
        id: 'cip_m3',
        title: 'Module 3: Binary & Hexadecimal Machine Codes',
        badgeId: 'binary_breaker',
        badgeName: 'Binary Breaker',
        badgeIcon: 'fa-code',
        xpReward: 100,
        summary: 'Understand 8-bit binary bytes (0s and 1s) and Base-16 hexadecimal memory representations.',
        theory: [
            {
                heading: 'Binary Byte Representation',
                content: 'Computers process data in 8-bit bytes of 1s and 0s using ASCII values. For example, ASCII letter "A" has decimal value 65, which equals binary <code>01000001</code>.'
            },
            {
                heading: 'Hexadecimal Notation (Base-16)',
                content: 'Hexadecimal uses digits 0-9 and letters A-F to represent 4-bit nibbles concisely (e.g. <code>0x41</code> = 65 = "A", <code>0x43</code> = 67 = "C").'
            }
        ],
        questions: [
            {
                id: 'cip_q3_1',
                question: 'In 8-bit ASCII binary, what uppercase letter is represented by byte 01000001 (Decimal 65)?',
                options: ['A', 'B', 'Z', 'M'],
                correctIndex: 0,
                explanation: 'Decimal 65 (01000001 in binary) is the standard ASCII code for uppercase letter "A".'
            },
            {
                id: 'cip_q3_2',
                question: 'In hexadecimal (Base-16) memory dumps, what character is represented by Hex byte 0x43 (Decimal 67)?',
                options: ['C', 'A', 'H', 'X'],
                correctIndex: 0,
                explanation: '0x43 in hexadecimal equals 67 in decimal, which is ASCII uppercase letter "C".'
            }
        ]
    },
    {
        id: 'cip_m4',
        title: 'Module 4: Base64 & Web Encoding Formats',
        badgeId: 'encoding_master',
        badgeName: 'Encoding Master',
        badgeIcon: 'fa-cube',
        xpReward: 100,
        summary: 'Distinguish reversible 64-character ASCII encoding from non-reversible hashing algorithms.',
        theory: [
            {
                heading: 'Base64 Encoding Purpose',
                content: 'Base64 translates binary data into 64 safe ASCII characters (A-Z, a-z, 0-9, +, /) with <code>=</code> padding. Base64 is <strong>NOT encryption</strong>—anyone can decode it instantly without a key.'
            }
        ],
        questions: [
            {
                id: 'cip_q4_1',
                question: 'Why is Base64 encoding NOT considered a security or encryption mechanism?',
                options: [
                    'Because Base64 requires a secret password',
                    'Because Base64 is completely reversible by anyone without needing a secret key',
                    'Because Base64 only works on images',
                    'Because Base64 changes file extensions'
                ],
                correctIndex: 1,
                explanation: 'Base64 is a data format encoding, not encryption. Anyone can decode Base64 back to plaintext instantly.'
            }
        ]
    },
    {
        id: 'cip_m5',
        title: 'Module 5: Vigenère & Polyalphabetic Substitution',
        badgeId: 'cipher_master',
        badgeName: 'Cipher Master',
        badgeIcon: 'fa-key-skeleton',
        xpReward: 150,
        summary: 'Break advanced multi-alphabet substitution ciphers using repeating keyword keys.',
        theory: [
            {
                heading: 'The Vigenère Cipher',
                content: 'The Vigenère Cipher uses a keyword (e.g. <code>KEY</code>) to shift each letter by a different Caesar amount based on the matching keyword letter index.'
            }
        ],
        questions: [
            {
                id: 'cip_q5_1',
                question: 'What makes the Vigenère Cipher stronger than a standard Caesar Cipher against frequency analysis?',
                options: [
                    'It uses a repeating keyword key to shift different letters by different amounts',
                    'It deletes all vowels',
                    'It encrypts data using quantum computers',
                    'It converts text into MP3 audio'
                ],
                correctIndex: 0,
                explanation: 'By shifting each letter with a different keyword character, identical plaintext letters produce different ciphertext letters, hiding frequency patterns.'
            }
        ]
    }
];
