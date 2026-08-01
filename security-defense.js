/* ==========================================================================
   CyberJourney - Unified Security Defense, Rate Limiter & XSS/SQLi Guard Engine
   ========================================================================== */

const CyberDefenseEngine = (function () {
    'use strict';

    // --- 1. Rate Limiting Defense (Anti-DoS & Brute Force Guard) ---
    const rateLimitMap = new Map();

    function checkRateLimit(actionKey, maxAttempts = 5, windowMs = 15000) {
        const now = Date.now();
        const record = rateLimitMap.get(actionKey) || { count: 0, resetTime: now + windowMs };

        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + windowMs;
            rateLimitMap.set(actionKey, record);
            return { allowed: true, remaining: maxAttempts - 1 };
        }

        if (record.count >= maxAttempts) {
            const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
            return {
                allowed: false,
                remaining: 0,
                retryAfterSec: retryAfterSec,
                error: `HTTP 429: Rate Limit Exceeded. Too many requests! Please wait ${retryAfterSec}s before retrying.`
            };
        }

        record.count++;
        rateLimitMap.set(actionKey, record);
        return { allowed: true, remaining: maxAttempts - record.count };
    }

    // --- 2. XSS & HTML Input Sanitizer ---
    function sanitizeHTML(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // --- 3. SQL Injection Payload Stripper ---
    function sanitizeSQLInput(str) {
        if (typeof str !== 'string') return str;
        // Detect and disarm common SQLi attack vectors
        const sqliPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|OR|AND|EXEC|CREATE)\b|'|--|\/\*|\*\/|;)/gi;
        if (sqliPattern.test(str)) {
            console.warn('🛡️ Security Guard: SQL Injection payload detected and disarmed in input:', str);
        }
        return str.replace(/'/g, "''").replace(/;/g, '').replace(/--/g, '');
    }

    // --- 4. Comprehensive Attack vs Prevention Knowledge Base ---
    const PREVENTION_KNOWLEDGE = {
        brute_force: {
            title: 'Brute Force & Dictionary Attacks',
            attack: 'Attackers attempt thousands of password combinations per second to break user accounts.',
            prevention: '1. Implement Rate Limiting (HTTP 429 after 5 failed tries).\n2. Enforce Account Lockout policies.\n3. Require Multi-Factor Authentication (MFA).\n4. Implement CAPTCHA verification on login forms.'
        },
        phishing: {
            title: 'Phishing & Email Spoofing',
            attack: 'Deceptive emails impersonating trusted brands to steal credentials or install malware.',
            prevention: '1. Enforce SPF (Sender Policy Framework), DKIM, and DMARC DNS email authentication.\n2. Use AI email gateway filtering.\n3. Verify sender domain names.\n4. Conduct regular Security Awareness Training.'
        },
        sqli: {
            title: 'SQL Injection (SQLi)',
            attack: 'Malicious SQL queries injected into input fields to bypass auth or leak database data.',
            prevention: '1. Use Prepared Statements & Parameterized Queries (ORMs).\n2. Input validation and strict type checking.\n3. Apply Principle of Least Privilege to database credentials.'
        },
        xss: {
            title: 'Cross-Site Scripting (XSS)',
            attack: 'Injecting malicious JavaScript code into web pages to steal session cookies or hijack DOM.',
            prevention: '1. Apply Context-Aware HTML Entity Output Encoding (`sanitizeHTML`).\n2. Enforce Content Security Policy (CSP) headers.\n3. Use `HttpOnly` and `SameSite=Strict` session cookies.'
        },
        cleartext_http: {
            title: 'Unencrypted Plaintext Traffic Leakage',
            attack: 'Intercepting HTTP Port 80 packets on public Wi-Fi to read passwords and session tokens.',
            prevention: '1. Enforce HTTPS (TLS/SSL encryption) for all web traffic.\n2. Implement HTTP Strict Transport Security (HSTS) headers.\n3. Redirect all Port 80 requests to Port 443.'
        },
        weak_ciphers: {
            title: 'Weak / Broken Encryption (Caesar, ROT13, Single-DES)',
            attack: 'Classical substitution ciphers are easily broken using frequency analysis or brute-force shifts.',
            prevention: '1. Use modern authenticated encryption standards like AES-256-GCM or ChaCha20-Poly1305.\n2. Hash passwords with bcrypt, Argon2, or PBKDF2 with unique salts.\n3. Rotate cryptographic keys regularly.'
        }
    };

    function renderPreventionCardHtml(categoryKey) {
        const item = PREVENTION_KNOWLEDGE[categoryKey];
        if (!item) return '';

        return `
            <div class="cyber-prevention-banner" style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.3); border-radius:12px; padding:14px 18px; margin-top:16px; margin-bottom:16px;">
                <h4 style="color:#00ff88; font-family:'Orbitron',sans-serif; font-size:0.95rem; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-shield-halved text-emerald"></i> Active Defense & Prevention Strategy: ${item.title}
                </h4>
                <div style="font-size:0.85rem; color:#d1d5db; line-height:1.5;">
                    <p style="margin-bottom:6px;"><strong style="color:#ff2a6d;">Attack Vector:</strong> ${item.attack}</p>
                    <p><strong style="color:#00ff88;">Prevention Techniques:</strong></p>
                    <ul style="margin-left:20px; margin-top:4px; font-family:monospace; line-height:1.6; color:#e5e7eb;">
                        ${item.prevention.split('\n').map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    return {
        checkRateLimit,
        sanitizeHTML,
        sanitizeSQLInput,
        PREVENTION_KNOWLEDGE,
        renderPreventionCardHtml
    };
})();
