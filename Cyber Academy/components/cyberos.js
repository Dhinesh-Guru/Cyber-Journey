/* ==========================================================================
   Cyber Academy - Component: Virtual Laptop Simulator ("CyberOS Academy Edition")
   ========================================================================== */

const CyberOSEngine = (function () {
    'use strict';

    let openWindows = {};

    // Stateful Virtual File System
    let systemFiles = [
        { id: 'f1', name: 'annual_report_2026.pdf', type: 'doc', icon: 'fa-file-pdf text-danger', isMalware: false, isCritical: false, isQuarantined: false, desc: 'Clean PDF Document' },
        { id: 'f2', name: 'invoice_july.pdf.exe', type: 'malware', icon: 'fa-file-circle-exclamation text-amber', isMalware: true, isCritical: false, isQuarantined: false, desc: 'Disguised Executable Trojan Payload' },
        { id: 'f3', name: 'vacation_photo.jpg', type: 'image', icon: 'fa-image text-cyan', isMalware: false, isCritical: false, isQuarantined: false, desc: 'Standard JPEG Image' },
        { id: 'f4', name: 'antivirus_core.sys', type: 'system', icon: 'fa-shield-halved text-emerald', isMalware: false, isCritical: true, isQuarantined: false, desc: 'Core Antivirus System Driver' },
        { id: 'f5', name: 'free_game_installer.exe', type: 'malware', icon: 'fa-box-archive text-purple', isMalware: true, isCritical: false, isQuarantined: false, desc: 'Suspicious Game Crack Installer' },
        { id: 'f6', name: 'saved_passwords.txt', type: 'txt', icon: 'fa-file-lines text-amber', isMalware: false, isCritical: false, isQuarantined: false, desc: 'Unencrypted Plaintext Passwords File' }
    ];

    // Stateful CyberMail Emails
    let emails = [
        {
            id: 'm1',
            sender: 'service@paypa1-security.com',
            subject: 'URGENT: Account Suspension Notice',
            preview: 'Your PayPal account will be disabled in 24h due to unauthorized activity. Click link to verify credentials.',
            isPhishing: true,
            body: 'Dear Customer,<br><br>We detected unusual logins on your account. To prevent suspension, click the secure verification link below:<br><br><a href="#" class="mail-sim-link text-danger" style="text-decoration:underline;">https://verify-paypa1-security-login.com/login</a><br><br><i>Note: Domain uses typosquatting ("paypa1").</i>'
        },
        {
            id: 'm2',
            sender: 'noreply@github.com',
            subject: 'New Public SSH Key Added',
            preview: 'A new public SSH key was added to your GitHub account from IP 192.168.1.5.',
            isPhishing: false,
            body: 'Hi Trainee,<br><br>A new SSH public key (rsa-sha2-512) was added to your account. If you initiated this action, no further steps are required.<br><br>Authentic sender signature verified via SPF/DKIM.'
        },
        {
            id: 'm3',
            sender: 'helpdesk@company-it-verify.org',
            subject: 'Action Required: Office 365 Password Migration',
            preview: 'IT Department requires all employees to update O365 credentials on third-party server.',
            isPhishing: true,
            body: 'Employees,<br><br>Our IT department is upgrading Office 365 servers. Please enter your domain login and password on the migration portal:<br><br><a href="#" class="mail-sim-link text-danger" style="text-decoration:underline;">http://company-it-verify.org/login.php</a><br><br><i>Note: External non-company domain requesting plaintext credentials.</i>'
        }
    ];

    function renderDesktop(container) {
        if (!container) return;

        container.innerHTML = `
            <div class="cyberos-desktop-environment">
                <!-- Top Status Bar -->
                <div class="cyberos-top-bar">
                    <div class="bar-left">
                        <span class="os-logo"><i class="fa-solid fa-laptop-code text-emerald"></i> CyberOS 2.5</span>
                        <span class="os-status"><i class="fa-solid fa-wifi text-emerald"></i> Protected Network</span>
                    </div>
                    <div class="bar-right">
                        <span id="cyberos-clock">12:00 PM</span>
                    </div>
                </div>

                <!-- Desktop Wallpaper Area & App Grid -->
                <div class="cyberos-wallpaper-area" id="cyberos-desktop-area">
                    <div class="desktop-icons-grid">
                        <div class="os-icon" data-app="email">
                            <div class="icon-wrap bg-cyan"><i class="fa-solid fa-envelope"></i></div>
                            <span class="icon-label">Email App</span>
                        </div>
                        <div class="os-icon" data-app="browser">
                            <div class="icon-wrap bg-emerald"><i class="fa-solid fa-globe"></i></div>
                            <span class="icon-label">CyberBrowser</span>
                        </div>
                        <div class="os-icon" data-app="files">
                            <div class="icon-wrap bg-purple"><i class="fa-solid fa-folder-open"></i></div>
                            <span class="icon-label">File Manager</span>
                        </div>
                        <div class="os-icon" data-app="security">
                            <div class="icon-wrap bg-danger"><i class="fa-solid fa-shield-halved"></i></div>
                            <span class="icon-label">Security Center</span>
                        </div>
                        <div class="os-icon" data-app="vault">
                            <div class="icon-wrap bg-amber"><i class="fa-solid fa-vault"></i></div>
                            <span class="icon-label">Password Vault</span>
                        </div>
                        <div class="os-icon" data-app="network">
                            <div class="icon-wrap bg-cyan"><i class="fa-solid fa-network-wired"></i></div>
                            <span class="icon-label">Network Panel</span>
                        </div>
                        <div class="os-icon" data-app="terminal">
                            <div class="icon-wrap bg-dark-green"><i class="fa-solid fa-terminal"></i></div>
                            <span class="icon-label">Terminal</span>
                        </div>
                    </div>

                    <!-- Open Window Containers render inside desktop-area -->
                </div>

                <!-- Taskbar -->
                <div class="cyberos-taskbar">
                    <button class="start-btn" id="os-start-btn"><i class="fa-solid fa-microchip"></i> CyberOS Menu</button>
                    <div class="taskbar-apps" id="os-taskbar-apps"></div>
                </div>
            </div>
        `;

        // Start Live Clock
        setInterval(() => {
            const clockEl = container.querySelector('#cyberos-clock');
            if (clockEl) {
                const now = new Date();
                clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        }, 1000);

        // App Launch Listeners
        container.querySelectorAll('.os-icon').forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                const appKey = e.currentTarget.getAttribute('data-app');
                launchAppWindow(container, appKey);
            });
            icon.addEventListener('click', (e) => {
                const appKey = e.currentTarget.getAttribute('data-app');
                launchAppWindow(container, appKey);
            });
        });
    }

    function launchAppWindow(container, appKey) {
        const desktop = container.querySelector('#cyberos-desktop-area');
        if (!desktop) return;

        const windowId = `win-${appKey}`;
        if (openWindows[windowId]) {
            // Bring to front
            const win = desktop.querySelector(`#${windowId}`);
            if (win) win.style.zIndex = '100';
            return;
        }

        let title = '';
        let icon = '';
        let contentHtml = '';

        if (appKey === 'email') {
            title = 'CyberMail Interactive Client';
            icon = 'fa-envelope text-cyan';
            contentHtml = renderEmailAppHtml();
        } else if (appKey === 'browser') {
            title = 'CyberBrowser URL Inspector & Security Simulator';
            icon = 'fa-globe text-emerald';
            contentHtml = renderBrowserAppHtml();
        } else if (appKey === 'files') {
            title = 'File Manager - Downloads & Documents';
            icon = 'fa-folder-open text-purple';
            contentHtml = renderFilesAppHtml();
        } else if (appKey === 'security') {
            title = 'CyberOS Security Defense Center';
            icon = 'fa-shield-halved text-danger';
            contentHtml = renderSecurityAppHtml();
        } else if (appKey === 'vault') {
            title = 'Encrypted Password Vault';
            icon = 'fa-vault text-amber';
            contentHtml = renderVaultAppHtml();
        } else if (appKey === 'network') {
            title = 'Network Packet Topology Visualizer';
            icon = 'fa-network-wired text-cyan';
            contentHtml = renderNetworkAppHtml();
        } else if (appKey === 'terminal') {
            title = 'CyberTrainee Terminal v2.5';
            icon = 'fa-terminal text-emerald';
            contentHtml = renderTerminalAppHtml();
        }

        const winEl = document.createElement('div');
        winEl.className = 'cyberos-window';
        winEl.id = windowId;
        winEl.style.zIndex = '10';

        winEl.innerHTML = `
            <div class="window-titlebar">
                <span class="title-text"><i class="fa-solid ${icon}"></i> ${title}</span>
                <div class="title-actions">
                    <button class="win-btn close-win-btn" data-id="${windowId}">&times;</button>
                </div>
            </div>
            <div class="window-content-body">
                ${contentHtml}
            </div>
        `;

        desktop.appendChild(winEl);
        openWindows[windowId] = true;

        winEl.querySelector('.close-win-btn').addEventListener('click', () => {
            winEl.remove();
            delete openWindows[windowId];
        });

        // Initialize App Event Listeners
        if (appKey === 'email') initEmailLogic(winEl);
        if (appKey === 'files') initFilesLogic(winEl);
        if (appKey === 'terminal') initTerminalLogic(winEl);
        if (appKey === 'security') initSecurityLogic(winEl);
        if (appKey === 'browser') initBrowserLogic(winEl);
        if (appKey === 'vault') initVaultLogic(winEl);
    }

    // --- Interactive Email App ---
    function renderEmailAppHtml() {
        return `
            <div class="os-app-box">
                <p style="margin-bottom:10px;">Select an email from your inbox to inspect link authenticity:</p>
                <div class="mini-inbox-list" style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
                    ${emails.map(m => `
                        <div class="inbox-item-btn" data-id="${m.id}" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:10px 14px; border-radius:8px; cursor:pointer;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <strong style="font-size:0.88rem; color:#fff;">${m.sender}</strong>
                                <span style="font-size:0.75rem;" class="${m.isPhishing ? 'text-amber' : 'text-emerald'}">${m.isPhishing ? '⚠️ SUSPICIOUS' : '✓ AUTHENTIC'}</span>
                            </div>
                            <span style="font-size:0.85rem; color:var(--emerald); font-weight:600; display:block;">${m.subject}</span>
                        </div>
                    `).join('')}
                </div>

                <div id="email-body-display" style="display:none; background:rgba(0,0,0,0.5); border:1px solid var(--border-color); padding:16px; border-radius:8px; margin-top:10px;">
                </div>

                <div id="email-action-feedback" class="os-file-feedback" style="display:none; margin-top:12px;"></div>
            </div>
        `;
    }

    function initEmailLogic(winEl) {
        const bodyDisplay = winEl.querySelector('#email-body-display');
        const feedbackBox = winEl.querySelector('#email-action-feedback');
        let currentMail = null;

        winEl.querySelectorAll('.inbox-item-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                currentMail = emails.find(m => m.id === id);
                if (!currentMail) return;

                feedbackBox.style.display = 'none';
                bodyDisplay.style.display = 'block';
                bodyDisplay.innerHTML = `
                    <div style="border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:10px;">
                        <span style="display:block; font-size:0.82rem; color:var(--text-muted);">From: <strong>${currentMail.sender}</strong></span>
                        <strong style="font-size:1.05rem; color:#fff;">Subject: ${currentMail.subject}</strong>
                    </div>
                    <div style="font-size:0.9rem; line-height:1.5; color:var(--text-primary); margin-bottom:16px;">
                        ${currentMail.body}
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="chip-btn danger" id="btn-report-phish"><i class="fa-solid fa-shield-halved"></i> REPORT PHISHING</button>
                        <button class="chip-btn" id="btn-open-phish-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> CLICK LINK / TRUST</button>
                    </div>
                `;

                bodyDisplay.querySelector('#btn-report-phish').onclick = () => {
                    feedbackBox.style.display = 'block';
                    if (currentMail.isPhishing) {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--emerald)';
                        feedbackBox.style.background = 'rgba(0,255,157,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-emerald" style="margin-bottom:6px;"><i class="fa-solid fa-shield-halved"></i> 🛡️ EXCELLENT PHISHING DETECTION!</h4>
                            <p>You correctly spotted the spoofed sender address (<code>${currentMail.sender}</code>) and reported the scam! Credential theft prevented.</p>
                        `;
                    } else {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--cyber-amber)';
                        feedbackBox.style.background = 'rgba(255,183,0,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-amber" style="margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> ℹ️ LEGITIMATE SYSTEM EMAIL</h4>
                            <p>This was a valid notification from <code>${currentMail.sender}</code>. Verified via cryptographically signed SPF/DKIM records.</p>
                        `;
                    }
                };

                bodyDisplay.querySelector('#btn-open-phish-link').onclick = () => {
                    feedbackBox.style.display = 'block';
                    if (currentMail.isPhishing) {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--cyber-danger)';
                        feedbackBox.style.background = 'rgba(255,42,109,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-danger" style="margin-bottom:6px;"><i class="fa-solid fa-bug"></i> 🚨 PHISHING TRAP EXPOSED! SYSTEM HACKED!</h4>
                            <p>Clicking unverified phishing links in emails (<code>${currentMail.sender}</code>) redirects you to fake credential-harvesting login pages! <strong>Never enter passwords on links from unverified emails!</strong></p>
                        `;
                    } else {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--emerald)';
                        feedbackBox.style.background = 'rgba(0,255,157,0.08)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-emerald" style="margin-bottom:6px;"><i class="fa-solid fa-circle-check"></i> ✅ SAFE ACTION</h4>
                            <p>Legitimate link opened safely over encrypted HTTPS connection.</p>
                        `;
                    }
                };
            };
        });
    }

    // --- Interactive CyberBrowser ---
    function renderBrowserAppHtml() {
        return `
            <div class="os-app-box">
                <div style="display:flex; gap:8px; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; background:rgba(0,0,0,0.6); border:1px solid var(--border-color); padding:4px 10px; border-radius:6px; flex:1;">
                        <i class="fa-solid fa-lock text-emerald" id="browser-lock-icon" style="margin-right:8px;"></i>
                        <input type="text" id="sim-url-input" value="https://bank-portal.com" style="background:transparent; border:none; color:#fff; font-family:monospace; font-size:0.85rem; flex:1; outline:none;">
                    </div>
                    <button class="cyber-primary-btn" id="btn-navigate-sim">NAVIGATE</button>
                </div>

                <div style="display:flex; gap:8px; margin-bottom:14px; align-items:center; font-size:0.8rem;">
                    <span class="text-muted">Bookmarks:</span>
                    <button class="chip-btn btn-bm" data-url="https://bank-portal.com"><i class="fa-solid fa-building-columns"></i> Bank (HTTPS)</button>
                    <button class="chip-btn danger btn-bm" data-url="http://free-giftcards-win.net"><i class="fa-solid fa-triangle-exclamation"></i> Free Giftcards (HTTP)</button>
                    <button class="chip-btn danger btn-bm" data-url="https://paypa1-verify-account.org"><i class="fa-solid fa-bug"></i> Phishing Fake</button>
                </div>

                <div class="sim-page-display" id="sim-page-content" style="background:rgba(0,0,0,0.5); border:1px solid var(--border-color); padding:16px; border-radius:8px;">
                    <h4 class="text-emerald"><i class="fa-solid fa-shield-halved"></i> SECURE BANKING PORTAL</h4>
                    <p style="font-size:0.88rem; margin-top:6px;">Connection is encrypted via TLS 1.3 (HTTPS). Domain certificate is verified authentic.</p>
                </div>
            </div>
        `;
    }

    function initBrowserLogic(winEl) {
        const btn = winEl.querySelector('#btn-navigate-sim');
        const input = winEl.querySelector('#sim-url-input');
        const page = winEl.querySelector('#sim-page-content');
        const lockIcon = winEl.querySelector('#browser-lock-icon');

        function testUrl(val) {
            val = val.trim();
            if (!val) return;

            // Normalize URL prefix for check if missing protocol
            let fullUrl = val;
            if (!val.startsWith('http://') && !val.startsWith('https://')) {
                fullUrl = 'https://' + val;
            }

            // 1. DNS Domain Validation (Must have valid TLD)
            const hasValidTld = /\.(com|org|net|io|gov|edu|co|info|dev|app|xyz)\b/i.test(fullUrl);
            if (!hasValidTld) {
                lockIcon.className = 'fa-solid fa-circle-xmark text-danger';
                page.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-circle-xmark"></i> ERR_NAME_NOT_RESOLVED (SERVER NOT FOUND)</h4>
                    <p style="font-size:0.88rem; margin-top:6px;">DNS server lookup failed for <code>${val}</code>. The host domain does not exist or has no valid IP routing address!</p>
                `;
                return;
            }

            // 2. Unencrypted HTTP Protocol Check
            if (val.toLowerCase().startsWith('http://')) {
                lockIcon.className = 'fa-solid fa-lock-open text-danger';
                page.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INSECURE UNENCRYPTED CONNECTION (HTTP)</h4>
                    <p style="font-size:0.88rem; margin-top:6px;">Warning: Connection to <code>${val}</code> is NOT encrypted! Plain HTTP transmits data in cleartext, exposing passwords to packet sniffing on public Wi-Fi.</p>
                `;
                return;
            }

            // 3. Phishing & Typosquatting Threat Detection
            if (val.toLowerCase().includes('paypa1') || val.toLowerCase().includes('free-giftcard') || val.toLowerCase().includes('login-verify') || val.toLowerCase().includes('account-lock')) {
                lockIcon.className = 'fa-solid fa-bug text-danger';
                page.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-bug"></i> DANGEROUS PHISHING DOMAIN BLOCKED</h4>
                    <p style="font-size:0.88rem; margin-top:6px;">CyberOS SmartGuard blocked connection to <code>${val}</code>. Domain uses typosquatting and brand spoofing to steal login credentials!</p>
                `;
                return;
            }

            // 4. Valid Encrypted HTTPS Webpage
            lockIcon.className = 'fa-solid fa-lock text-emerald';
            page.innerHTML = `
                <h4 class="text-emerald"><i class="fa-solid fa-circle-check"></i> SECURE WEBPAGE (HTTPS)</h4>
                <p style="font-size:0.88rem; margin-top:6px;">Navigated to <code>${fullUrl}</code>. Connection is encrypted with TLS 1.3 cryptographic security. Domain SSL certificate verified authentic.</p>
            `;
        }

        if (btn && input && page) {
            btn.onclick = () => testUrl(input.value);
            winEl.querySelectorAll('.btn-bm').forEach(bm => {
                bm.onclick = (e) => {
                    const u = e.currentTarget.getAttribute('data-url');
                    input.value = u;
                    testUrl(u);
                };
            });
        }
    }

    // --- Interactive File Manager ---
    function renderFilesAppHtml() {
        return `
            <div class="os-app-box">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4>System Downloads & Documents</h4>
                    <span class="text-muted" style="font-size:0.8rem;">Click RUN/OPEN or QUARANTINE to act on files</span>
                </div>
                <ul class="os-file-list-interactive" id="files-list-container">
                    ${renderFileListItems()}
                </ul>
                <div id="file-action-feedback-box" class="os-file-feedback" style="display:none;"></div>
            </div>
        `;
    }

    function renderFileListItems() {
        if (systemFiles.length === 0) {
            return `<li class="os-file-item" style="color:var(--text-muted);">No active files in folder.</li>`;
        }

        return systemFiles.map(f => {
            if (f.isQuarantined) {
                return `
                    <li class="os-file-item quarantined-item" id="item-${f.id}" style="opacity:0.6; background:rgba(0,255,157,0.03); border:1px solid rgba(0,255,157,0.3);">
                        <div class="file-meta-info">
                            <i class="fa-solid fa-shield-halved text-emerald" style="font-size:18px;"></i>
                            <div>
                                <span class="file-name-title" style="text-decoration:line-through;">${f.name}</span>
                                <span style="font-size:0.75rem; color:var(--emerald); display:block; font-weight:700;"><i class="fa-solid fa-lock"></i> ISOLATED & QUARANTINED</span>
                            </div>
                        </div>
                        <div class="file-action-btns">
                            <span class="quarantined-badge" style="background:rgba(0,255,157,0.12); color:var(--emerald); border:1px solid var(--emerald); padding:6px 12px; border-radius:6px; font-size:0.8rem; font-weight:bold;">
                                <i class="fa-solid fa-shield-halved"></i> QUARANTINED
                            </span>
                        </div>
                    </li>
                `;
            }

            return `
                <li class="os-file-item" id="item-${f.id}">
                    <div class="file-meta-info">
                        <i class="fa-solid ${f.icon}" style="font-size:18px;"></i>
                        <div>
                            <span class="file-name-title">${f.name}</span>
                            <span style="font-size:0.75rem; color:var(--text-muted); display:block;">${f.desc}</span>
                        </div>
                    </div>
                    <div class="file-action-btns">
                        <button class="chip-btn btn-run-os-file" data-id="${f.id}"><i class="fa-solid fa-play"></i> RUN / OPEN</button>
                        <button class="chip-btn danger btn-del-os-file" data-id="${f.id}"><i class="fa-solid fa-shield-halved"></i> QUARANTINE</button>
                    </div>
                </li>
            `;
        }).join('');
    }

    function initFilesLogic(winEl) {
        const feedbackBox = winEl.querySelector('#file-action-feedback-box');
        const listContainer = winEl.querySelector('#files-list-container');

        function attachFileEvents() {
            winEl.querySelectorAll('.btn-run-os-file').forEach(btn => {
                btn.onclick = (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const file = systemFiles.find(f => f.id === id);
                    if (!file || file.isQuarantined) return;

                    feedbackBox.style.display = 'block';

                    if (file.isMalware) {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--cyber-danger)';
                        feedbackBox.style.background = 'rgba(255,42,109,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-danger" style="margin-bottom:6px;"><i class="fa-solid fa-bug"></i> 🚨 WRONG DECISION! SYSTEM INFECTED!</h4>
                            <p>Running an unidentified executable file (<code>${file.name}</code>) allowed a malicious Trojan payload to execute on your system! <strong>Never launch suspicious executable files!</strong></p>
                        `;
                    } else if (file.name === 'saved_passwords.txt') {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--cyber-amber)';
                        feedbackBox.style.background = 'rgba(255,183,0,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-amber" style="margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> ⚠️ SECURITY WARNING! UNENCRYPTED CREDENTIALS</h4>
                            <p>Storing plain-text passwords inside unencrypted text files (<code>saved_passwords.txt</code>) leaves them exposed to keyloggers and spyware. <strong>Use an encrypted Password Vault instead!</strong></p>
                        `;
                    } else if (file.isCritical) {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--emerald)';
                        feedbackBox.style.background = 'rgba(0,255,157,0.08)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-emerald" style="margin-bottom:6px;"><i class="fa-solid fa-circle-info"></i> ℹ️ ACTIVE SECURITY SERVICE</h4>
                            <p><code>${file.name}</code> is a critical background security driver protecting system memory. It cannot be launched directly.</p>
                        `;
                    } else {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--emerald)';
                        feedbackBox.style.background = 'rgba(0,255,157,0.08)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-emerald" style="margin-bottom:6px;"><i class="fa-solid fa-circle-check"></i> ✅ SAFE ACTION! DOCUMENT OPENED</h4>
                            <p>Verified clean document extension. File <code>${file.name}</code> opened safely.</p>
                        `;
                    }
                };
            });

            winEl.querySelectorAll('.btn-del-os-file').forEach(btn => {
                btn.onclick = (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const file = systemFiles.find(f => f.id === id);
                    if (!file || file.isQuarantined) return;

                    feedbackBox.style.display = 'block';

                    if (file.isMalware) {
                        file.isQuarantined = true;
                        listContainer.innerHTML = renderFileListItems();
                        attachFileEvents();

                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--emerald)';
                        feedbackBox.style.background = 'rgba(0,255,157,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-emerald" style="margin-bottom:6px;"><i class="fa-solid fa-shield-halved"></i> 🛡️ EXCELLENT DECISION! THREAT QUARANTINED</h4>
                            <p>Quarantining unidentified executable files (<code>${file.name}</code>) protects your computer from Trojan infections and ransomware! The file is now safely isolated in Quarantine.</p>
                        `;
                    } else if (file.isCritical) {
                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'var(--cyber-danger)';
                        feedbackBox.style.background = 'rgba(255,42,109,0.1)';
                        feedbackBox.innerHTML = `
                            <h4 class="text-danger" style="margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> ❌ DANGEROUS DECISION! CRITICAL SECURITY FILE DELETED</h4>
                            <p>Deleting your Antivirus core file (<code>${file.name}</code>) leaves your computer completely defenceless against future virus attacks!</p>
                        `;
                    } else {
                        file.isQuarantined = true;
                        listContainer.innerHTML = renderFileListItems();
                        attachFileEvents();

                        feedbackBox.className = 'os-file-feedback';
                        feedbackBox.style.borderColor = 'rgba(255,255,255,0.2)';
                        feedbackBox.style.background = 'rgba(255,255,255,0.03)';
                        feedbackBox.innerHTML = `
                            <p class="text-muted"><i class="fa-solid fa-trash"></i> File <code>${file.name}</code> placed into Quarantine isolation.</p>
                        `;
                    }
                };
            });
        }

        attachFileEvents();
    }

    // --- Interactive Security Protection Center ---
    function renderSecurityAppHtml() {
        return `
            <div class="os-app-box security-center-box">
                <h4>System Defense Center</h4>
                <div class="security-toggles" style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">
                    <div class="toggle-row" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>System Firewall Status:</span>
                        <button class="cyber-primary-btn sec-toggle" data-sec="firewall">ENABLED</button>
                    </div>
                    <div class="toggle-row" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Real-Time Antivirus Scanner:</span>
                        <button class="cyber-primary-btn sec-toggle" data-sec="av">ENABLED</button>
                    </div>
                    <div class="toggle-row" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Automatic System Updates:</span>
                        <button class="cyber-primary-btn sec-toggle" data-sec="updates">ENABLED</button>
                    </div>
                </div>

                <div id="sec-warning-feedback" class="os-file-feedback" style="display:none; margin-top:16px;"></div>
            </div>
        `;
    }

    function initSecurityLogic(winEl) {
        const feedbackBox = winEl.querySelector('#sec-warning-feedback');

        winEl.querySelectorAll('.sec-toggle').forEach(btn => {
            btn.onclick = (e) => {
                const secType = e.currentTarget.getAttribute('data-sec');
                const isEnabled = (btn.textContent === 'ENABLED');
                feedbackBox.style.display = 'block';

                if (isEnabled) {
                    btn.textContent = 'DISABLED';
                    btn.className = 'cyber-secondary-btn danger-btn';
                    feedbackBox.className = 'os-file-feedback';
                    feedbackBox.style.borderColor = 'var(--cyber-danger)';
                    feedbackBox.style.background = 'rgba(255,42,109,0.1)';

                    if (secType === 'firewall') {
                        feedbackBox.innerHTML = `
                            <h4 class="text-danger" style="margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> 🚨 DANGEROUS ACTION! FIREWALL DISABLED</h4>
                            <p>Disabling system firewall filters exposes open ports (Port 80/443), allowing unauthorized network intrusion packets and remote exploit scans into your PC!</p>
                        `;
                    } else if (secType === 'av') {
                        feedbackBox.innerHTML = `
                            <h4 class="text-danger" style="margin-bottom:6px;"><i class="fa-solid fa-bug"></i> 🚨 DANGEROUS ACTION! ANTIVIRUS SCANNERS DISABLED</h4>
                            <p>Disabling real-time virus protection allows downloaded executable malware files to run in background memory without virus signature scanning!</p>
                        `;
                    } else {
                        feedbackBox.innerHTML = `
                            <h4 class="text-amber" style="margin-bottom:6px;"><i class="fa-solid fa-triangle-exclamation"></i> ⚠️ WARNING! AUTOMATIC UPDATES PAUSED</h4>
                            <p>Disabling automatic updates leaves system zero-day security vulnerabilities unpatched, exposing OS core files to known exploits.</p>
                        `;
                    }
                } else {
                    btn.textContent = 'ENABLED';
                    btn.className = 'cyber-primary-btn';
                    feedbackBox.className = 'os-file-feedback';
                    feedbackBox.style.borderColor = 'var(--emerald)';
                    feedbackBox.style.background = 'rgba(0,255,157,0.08)';
                    feedbackBox.innerHTML = `
                        <h4 class="text-emerald" style="margin-bottom:6px;"><i class="fa-solid fa-shield-halved"></i> 🛡️ PROTECTION RE-ENABLED</h4>
                        <p>Real-time security defense re-activated. System shield is ACTIVE.</p>
                    `;
                }
            };
        });
    }

    // --- Interactive Encrypted Password Vault ---
    function renderVaultAppHtml() {
        return `
            <div class="os-app-box">
                <h4>Encrypted Password Vault</h4>
                <div style="background:rgba(255,183,0,0.08); border:1px solid var(--cyber-amber); padding:10px 14px; border-radius:8px; margin:10px 0; font-size:0.85rem;">
                    <strong class="text-amber"><i class="fa-solid fa-key"></i> Zero-Knowledge Master Key Protection:</strong>
                    <span style="display:block; margin-top:2px;">Passwords are encrypted at rest using AES-256. Unmasking passwords requires Master Key authentication.</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span>Master Key Status: <strong class="text-emerald" id="vault-status-text">LOCKED & ENCRYPTED</strong></span>
                    <button class="chip-btn" id="btn-toggle-vault-pass"><i class="fa-solid fa-eye"></i> SHOW / DECRYPT PASSWORDS</button>
                </div>

                <div class="vault-stored-list" style="display:flex; flex-direction:column; gap:8px;">
                    <div class="vault-entry" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                        <span><strong>GitHub:</strong> <code class="vault-pass-val">••••••••••••</code></span>
                        <span class="text-emerald" style="font-size:0.78rem; font-weight:700;">AES-256 (Strong)</span>
                    </div>
                    <div class="vault-entry" style="background:rgba(255,255,255,0.03); padding:10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                        <span><strong>Banking:</strong> <code class="vault-pass-val">••••••••••••</code></span>
                        <span class="text-emerald" style="font-size:0.78rem; font-weight:700;">AES-256 (Strong)</span>
                    </div>
                </div>
            </div>
        `;
    }

    function initVaultLogic(winEl) {
        const toggleBtn = winEl.querySelector('#btn-toggle-vault-pass');
        const statusText = winEl.querySelector('#vault-status-text');
        const passEls = winEl.querySelectorAll('.vault-pass-val');
        let isUnmasked = false;

        if (toggleBtn) {
            toggleBtn.onclick = () => {
                isUnmasked = !isUnmasked;
                if (isUnmasked) {
                    passEls[0].textContent = 'T!ger#92MoonPass';
                    passEls[1].textContent = 'Purple#Elephant$99';
                    statusText.textContent = 'UNLOCKED WITH MASTER KEY';
                    statusText.className = 'text-amber';
                    toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> MASK / ENCRYPT PASSWORDS';
                } else {
                    passEls[0].textContent = '••••••••••••';
                    passEls[1].textContent = '••••••••••••';
                    statusText.textContent = 'LOCKED & ENCRYPTED';
                    statusText.className = 'text-emerald';
                    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i> SHOW / DECRYPT PASSWORDS';
                }
            };
        }
    }

    function renderNetworkAppHtml() {
        return `
            <div class="os-app-box network-vis-box">
                <h4>Network Packet Flow Diagram</h4>
                <div class="network-nodes-flow" style="display:flex; align-items:center; justify-content:space-around; margin-top:20px;">
                    <div class="net-node"><i class="fa-solid fa-desktop"></i> PC</div>
                    <i class="fa-solid fa-arrow-right"></i>
                    <div class="net-node"><i class="fa-solid fa-router"></i> Router</div>
                    <i class="fa-solid fa-arrow-right"></i>
                    <div class="net-node highlight-node"><i class="fa-solid fa-shield-halved"></i> Firewall</div>
                    <i class="fa-solid fa-arrow-right"></i>
                    <div class="net-node"><i class="fa-solid fa-server"></i> Web Server</div>
                </div>
            </div>
        `;
    }

    function renderTerminalAppHtml() {
        return `
            <div class="terminal-container">
                <div class="terminal-output" id="term-out-box">
                    <p class="term-line">CyberOS Trainee Terminal [Version 2.5.0]</p>
                    <p class="term-line">Type <span class="highlight">help</span> to view available security commands.</p>
                </div>
                <div class="terminal-input-bar">
                    <span class="prompt">trainee@cyberos:~$</span>
                    <input type="text" id="term-input-field" autofocus>
                </div>
            </div>
        `;
    }

    function initTerminalLogic(winEl) {
        const input = winEl.querySelector('#term-input-field');
        const out = winEl.querySelector('#term-out-box');
        if (!input || !out) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                input.value = '';

                const line = document.createElement('p');
                line.className = 'term-line';
                line.innerHTML = `<span class="prompt">trainee@cyberos:~$</span> ${cmd}`;
                out.appendChild(line);

                let resp = '';
                if (cmd === 'exit') {
                    winEl.remove();
                    delete openWindows['win-terminal'];
                    return;
                } else if (cmd === 'help') {
                    resp = 'Available commands: <br> • <strong>help</strong> - View options<br> • <strong>scan</strong> - Run system virus scan<br> • <strong>quarantine &lt;exact_filename&gt;</strong> - Isolate threat file (e.g. quarantine invoice_july.pdf.exe)<br> • <strong>status</strong> - Check firewall and network security<br> • <strong>firewall enable</strong> - Activate firewall defense<br> • <strong>ping google.com</strong> - Test HTTPS connectivity<br> • <strong>clear</strong> - Clear terminal window<br> • <strong>exit</strong> - Close terminal window';
                } else if (cmd === 'scan') {
                    const activeMalware = systemFiles.filter(f => f.isMalware && !f.isQuarantined);
                    if (activeMalware.length > 0) {
                        resp = `<span class="text-cyan">Scanning system files... 0 threats in core. ${activeMalware.length} threat(s) detected in Downloads folder (${activeMalware.map(m => m.name).join(', ')}). Type "quarantine &lt;exact_filename&gt;" to isolate.</span>`;
                    } else {
                        resp = `<span class="text-emerald"><i class="fa-solid fa-circle-check"></i> Scanning system files... 0 active threats detected. All threats isolated & quarantined. System is 100% SECURE.</span>`;
                    }
                } else if (cmd.startsWith('quarantine') || cmd.startsWith('delete')) {
                    const parts = cmd.split(' ');
                    const fileName = parts.slice(1).join(' ').trim();

                    if (!fileName) {
                        resp = '<span class="text-amber">Usage: quarantine &lt;exact_filename&gt; (Example: <strong>quarantine invoice_july.pdf.exe</strong>)</span>';
                    } else {
                        const target = systemFiles.find(f => f.name.toLowerCase() === fileName.toLowerCase());

                        if (!target) {
                            resp = `<span class="text-amber">There is no file named "${fileName}" in Downloads. Make sure to enter the exact full filename (e.g. <strong>invoice_july.pdf.exe</strong> or <strong>free_game_installer.exe</strong>).</span>`;
                        } else if (target.isQuarantined) {
                            resp = `<span class="text-cyan">File "${target.name}" is already quarantined and isolated in File Manager.</span>`;
                        } else if (target.isCritical) {
                            resp = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> ERROR: Cannot delete critical security driver "${target.name}". System protection requires this core.</span>`;
                        } else if (target.isMalware) {
                            target.isQuarantined = true;
                            // Refresh File Manager DOM if open
                            const desktop = document.querySelector('#cyberos-desktop-area');
                            if (desktop) {
                                const listContainer = desktop.querySelector('#files-list-container');
                                if (listContainer) listContainer.innerHTML = renderFileListItems();
                            }
                            resp = `<span class="text-emerald"><i class="fa-solid fa-shield-halved"></i> Threat "${target.name}" quarantined successfully. File is now marked as QUARANTINED in File Manager!</span>`;
                        } else {
                            target.isQuarantined = true;
                            resp = `<span class="text-muted">File "${target.name}" moved to Quarantine isolation.</span>`;
                        }
                    }
                } else if (cmd === 'status') {
                    resp = 'Firewall: ACTIVE | Antivirus: ACTIVE | MFA: ENABLED | Router WPA3: SECURE';
                } else if (cmd === 'firewall enable') {
                    resp = '<span class="text-emerald">Firewall rules updated. Port 80 and 443 filtered.</span>';
                } else if (cmd.startsWith('ping')) {
                    resp = 'PING google.com (142.250.190.46): 56 data bytes. 64 bytes: icmp_seq=0 ttl=118 time=14.2 ms';
                } else if (cmd === 'clear') {
                    out.innerHTML = '';
                    return;
                } else {
                    resp = `Command not recognized: "${cmd}". Type <span class="highlight">help</span> for assistance.`;
                }

                const respLine = document.createElement('p');
                respLine.className = 'term-line term-response';
                respLine.innerHTML = resp;
                out.appendChild(respLine);
                out.scrollTop = out.scrollHeight;
            }
        });
    }

    return {
        renderDesktop
    };
})();
