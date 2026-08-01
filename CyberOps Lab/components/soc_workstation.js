/* ==========================================================================
   CyberOps Lab (Level 2) - Component: Interactive Virtual SOC Workstation Apps
   ========================================================================== */

const SOCWorkstationEngine = (function () {
    'use strict';

    function createTipBannerHtml(moduleRef, moduleTitle) {
        return `
            <div class="soc-learning-banner" style="background:rgba(0,243,255,0.08); border:1px dashed var(--cyan); border-radius:10px; padding:10px 16px; margin-bottom:18px; display:flex; align-items:center; gap:12px; font-size:0.88rem;">
                <i class="fa-solid fa-lightbulb text-amber" style="font-size:18px;"></i>
                <div>
                    <strong>Learning Tip:</strong> Want to master this topic before taking workstation challenges? Check out 
                    <a href="#" class="tip-jump-modules text-cyan" data-mod="${moduleRef}" style="font-weight:700; text-decoration:underline;">${moduleTitle}</a> in the SOC Modules section!
                </div>
            </div>
        `;
    }

    function attachTipListener(container) {
        container.querySelectorAll('.tip-jump-modules').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const modId = e.currentTarget.getAttribute('data-mod');
                if (window.CyberOpsApp) {
                    window.CyberOpsApp.switchToModulesTab(modId);
                }
            };
        });
    }

    // --- 1. Interactive SIEM Log Viewer Console ---
    function initLogViewer(container) {
        if (!container) return;

        let selectedLogRowId = null;

        container.innerHTML = `
            <div class="soc-app-wrapper">
                ${createTipBannerHtml('ops_m1', 'Module 1: Log Investigation')}

                <div class="soc-app-header">
                    <h3><i class="fa-solid fa-file-lines text-cyan"></i> SOC SIEM Log Investigation Console</h3>
                    <p>Inspect raw authentication logs, click the suspicious attack log row, and identify the attacker IP.</p>
                </div>

                <div class="log-toolbar">
                    <input type="text" id="log-search-input" placeholder="Search IP or user..." class="soc-input">
                    <select id="log-severity-filter" class="soc-select">
                        <option value="ALL">All Severities</option>
                        <option value="INFO">INFO Only</option>
                        <option value="WARN">WARN Only</option>
                        <option value="CRITICAL">CRITICAL Only</option>
                    </select>
                </div>

                <div class="log-table-container" style="margin-bottom:16px;">
                    <table class="soc-table">
                        <thead>
                            <tr>
                                <th>SELECT</th>
                                <th>TIME</th>
                                <th>SEVERITY</th>
                                <th>SOURCE IP</th>
                                <th>USER</th>
                                <th>EVENT</th>
                                <th>MESSAGE</th>
                            </tr>
                        </thead>
                        <tbody id="log-table-body">
                            ${renderLogRows(SOC_LOG_SAMPLES, selectedLogRowId)}
                        </tbody>
                    </table>
                </div>

                <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                    <h4 class="text-cyan" style="margin-bottom:10px;"><i class="fa-solid fa-user-ninja"></i> Log Challenge Task</h4>
                    <p style="font-size:0.88rem; margin-bottom:10px;">1. Click the log row in the table above that shows the <strong>Brute Force Attack</strong> in progress.<br>2. Type the malicious attacker IP address below:</p>
                    
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="log-ip-input" placeholder="Enter IP address..." class="soc-input" style="width:240px;">
                        <button class="cyber-btn-cyan" id="btn-submit-log-challenge"><i class="fa-solid fa-paper-plane"></i> SUBMIT ANOMALY REPORT</button>
                    </div>

                    <div id="log-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                </div>
            </div>
        `;

        attachTipListener(container);

        const searchInput = container.querySelector('#log-search-input');
        const sevFilter = container.querySelector('#log-severity-filter');
        const tableBody = container.querySelector('#log-table-body');
        const ipInput = container.querySelector('#log-ip-input');
        const feedback = container.querySelector('#log-challenge-feedback');

        function updateRows() {
            const query = searchInput.value.toLowerCase().trim();
            const sev = sevFilter.value;

            const filtered = SOC_LOG_SAMPLES.filter(l => {
                const matchQ = l.sourceIp.toLowerCase().includes(query) || l.user.toLowerCase().includes(query) || l.msg.toLowerCase().includes(query);
                const matchSev = (sev === 'ALL' || l.severity === sev);
                return matchQ && matchSev;
            });

            tableBody.innerHTML = renderLogRows(filtered, selectedLogRowId);
            attachRowClickHandlers();
        }

        function attachRowClickHandlers() {
            tableBody.querySelectorAll('.log-selectable-row').forEach(row => {
                row.onclick = (e) => {
                    selectedLogRowId = parseInt(e.currentTarget.getAttribute('data-id'));
                    updateRows();
                };
            });
        }

        searchInput.addEventListener('input', updateRows);
        sevFilter.addEventListener('change', updateRows);
        attachRowClickHandlers();

        container.querySelector('#btn-submit-log-challenge').onclick = () => {
            const enteredIp = ipInput.value.trim();
            feedback.style.display = 'block';

            const isRowCorrect = (selectedLogRowId === 105);
            const isIpCorrect = (enteredIp === '45.142.120.9');

            if (isRowCorrect && isIpCorrect) {
                feedback.className = 'soc-feedback-box success';
                feedback.innerHTML = `
                    <h4 class="text-cyan"><i class="fa-solid fa-circle-check"></i> ANOMALY DETECTED & CONTAINED!</h4>
                    <p>Outstanding log analysis! You correctly selected Log Entry #105 and identified attacker IP <code>45.142.120.9</code>. 15 failed logins in 10s confirmed the automated dictionary attack.</p>
                `;
                if (window.CyberOpsApp) window.CyberOpsApp.awardXP(50, 'tool_log_investigation', 'log_master');
            } else {
                feedback.className = 'soc-feedback-box danger';
                feedback.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT LOG SELECTION OR IP</h4>
                    <p>Review the logs above: Look for sequential <code>AUTH_FAILURE</code> logs coming from an external IP within seconds, leading to a <code>BRUTE_FORCE_DETECTED</code> alert.</p>
                `;
            }
        };
    }

    function renderLogRows(logs, selectedId) {
        if (logs.length === 0) return `<tr><td colspan="7" class="text-center text-muted">No log records found matching query.</td></tr>`;

        return logs.map(l => `
            <tr class="log-row log-selectable-row ${l.severity.toLowerCase()} ${selectedId === l.id ? 'selected-row' : ''}" data-id="${l.id}" style="cursor:pointer;">
                <td style="text-align:center;"><i class="fa-solid ${selectedId === l.id ? 'fa-circle-dot text-cyan' : 'fa-circle text-muted'}"></i></td>
                <td><code>${l.timestamp}</code></td>
                <td><span class="sev-tag ${l.severity.toLowerCase()}">${l.severity}</span></td>
                <td><code>${l.sourceIp}</code></td>
                <td><strong>${l.user}</strong></td>
                <td><code class="text-cyan">${l.event}</code></td>
                <td style="font-size:0.85rem;">${l.msg}</td>
            </tr>
        `).join('');
    }

    // --- 2. Interactive Hash Check & File Integrity Inspector ---
    function initHashChecker(container) {
        if (!container) return;

        const suspectFiles = [
            { id: 'sf1', name: 'gta6_beta_setup.exe', size: '4.2 MB', path: 'C:\\Downloads\\gta6_beta_setup.exe', computedSha256: '24d004a104d4d54034dbcffc2a4b19a0ac3908c775dd4863653258686a8b4680', isTrojan: true, threatName: 'Ransomware.WannaCry.Payload' },
            { id: 'sf2', name: 'annual_report_2026.pdf', size: '1.8 MB', path: 'C:\\Documents\\annual_report_2026.pdf', computedSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', isTrojan: false, threatName: 'Clean PDF Document' },
            { id: 'sf3', name: 'invoice_july.pdf.exe', size: '310 KB', path: 'C:\\Downloads\\invoice_july.pdf.exe', computedSha256: '8f14e45f9a2b8c9d0123ef456789a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', isTrojan: true, threatName: 'Trojan.DisguisedPDF.Exe' }
        ];

        container.innerHTML = `
            <div class="soc-app-wrapper">
                ${createTipBannerHtml('ops_m3', 'Module 3: Hash Detective')}

                <div class="soc-app-header">
                    <h3><i class="fa-solid fa-fingerprint text-cyan"></i> Cryptographic Hash & Integrity Inspector</h3>
                    <p>Calculate SHA-256 checksums for suspicious downloaded files and match fingerprints against global malware threat databases.</p>
                </div>

                <div class="hash-suspect-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
                    ${suspectFiles.map(f => `
                        <div class="soc-file-hash-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <strong style="font-family:monospace; color:#fff;">${f.name}</strong>
                                <span style="font-size:0.75rem; color:var(--text-muted);">${f.size}</span>
                            </div>
                            <button class="cyber-btn-cyan btn-calc-file-hash" data-id="${f.id}" style="width:100%; margin-bottom:8px;"><i class="fa-solid fa-calculator"></i> CALCULATE SHA-256</button>
                            <div id="hash-out-${f.id}" style="font-family:monospace; font-size:0.75rem; word-break:break-all; display:none;" class="text-cyan"></div>
                        </div>
                    `).join('')}
                </div>

                <!-- VirusTotal Threat Intelligence Lookup Reference Table -->
                <div style="background:rgba(0,0,0,0.4); border:1px solid var(--border-color); padding:14px; border-radius:10px; margin-bottom:20px;">
                    <h4 class="text-amber" style="font-size:0.9rem; margin-bottom:8px;"><i class="fa-solid fa-database"></i> Global Threat Intelligence Database Signatures (VirusTotal)</h4>
                    <div style="font-size:0.8rem; font-family:monospace; color:var(--text-muted); line-height:1.6;">
                        • <span class="text-danger">8f14e45f9a2b8c9d0123ef456789a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7</span> $\rightarrow$ <strong>Trojan.DisguisedPDF.Exe</strong><br>
                        • <span class="text-danger">24d004a104d4d54034dbcffc2a4b19a0ac3908c775dd4863653258686a8b4680</span> $\rightarrow$ <strong>Ransomware.WannaCry.Payload</strong><br>
                        • <span class="text-cyan">9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</span> $\rightarrow$ <strong>Clean Verified Document Signature</strong>
                    </div>
                </div>

                <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                    <h4 class="text-cyan" style="margin-bottom:12px;"><i class="fa-solid fa-user-ninja"></i> Hash Detective Challenge</h4>
                    
                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">1. Calculate the SHA-256 hashes above and enter/paste the malicious Trojan hash signature:</label>
                        <input type="text" id="hash-string-input" placeholder="Paste 64-character SHA-256 hash (e.g. 8f14e45f...)" class="soc-input" style="width:100%;">
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">2. Select the infected file name matching this malware signature:</label>
                        <select id="hash-answer-sel" class="soc-select" style="width:100%;">
                            <option value="">Select infected file...</option>
                            <option value="gta6_beta_setup.exe">gta6_beta_setup.exe</option>
                            <option value="annual_report_2026.pdf">annual_report_2026.pdf</option>
                            <option value="invoice_july.pdf.exe">invoice_july.pdf.exe</option>
                        </select>
                    </div>

                    <button class="cyber-btn-cyan" id="btn-submit-hash-challenge" style="width:100%; padding:10px;"><i class="fa-solid fa-paper-plane"></i> VERIFY THREAT DATABASE</button>
                    <div id="hash-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                </div>
            </div>
        `;

        attachTipListener(container);

        container.querySelectorAll('.btn-calc-file-hash').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const file = suspectFiles.find(f => f.id === id);
                const out = container.querySelector(`#hash-out-${id}`);
                if (!file || !out) return;

                out.style.display = 'block';
                out.innerHTML = `<strong>SHA-256:</strong> <code>${file.computedSha256}</code>`;
            };
        });

        container.querySelector('#btn-submit-hash-challenge').onclick = () => {
            const enteredHash = container.querySelector('#hash-string-input').value.trim().toLowerCase();
            const selFile = container.querySelector('#hash-answer-sel').value;
            const feedback = container.querySelector('#hash-challenge-feedback');
            feedback.style.display = 'block';

            const targetHash = '8f14e45f9a2b8c9d0123ef456789a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7';
            const isHashCorrect = (enteredHash === targetHash);
            const isFileCorrect = (selFile === 'invoice_july.pdf.exe');

            if (isHashCorrect && isFileCorrect) {
                feedback.className = 'soc-feedback-box success';
                feedback.innerHTML = `
                    <h4 class="text-cyan"><i class="fa-solid fa-circle-check"></i> CHECKSUM MATCH CONFIRMED!</h4>
                    <p>Correct threat detection! Hash <code>8f14e45f...</code> matched <strong>Trojan.DisguisedPDF.Exe</strong> in VirusTotal threat databases, confirming <code>invoice_july.pdf.exe</code> is malicious.</p>
                `;
                if (window.CyberOpsApp) window.CyberOpsApp.awardXP(50, 'tool_hash_investigation', 'integrity_guard');
            } else {
                feedback.className = 'soc-feedback-box danger';
                feedback.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT HASH OR FILE SELECTION</h4>
                    <p>Calculate the SHA-256 hashes above, paste the Trojan hash signature <code>8f14e45f...</code>, and select <code>invoice_july.pdf.exe</code>.</p>
                `;
            }
        };
    }

    // --- 3. Interactive PCAP Packet Inspector ---
    function initPacketInspector(container) {
        if (!container) return;

        let selectedPacketNum = null;

        container.innerHTML = `
            <div class="soc-app-wrapper">
                ${createTipBannerHtml('ops_m5', 'Module 5: Packet Analysis (PCAP)')}

                <div class="soc-app-header">
                    <h3><i class="fa-solid fa-magnifying-glass-chart text-cyan"></i> Mini Wireshark Packet Inspector</h3>
                    <p>Analyze network packet streams, click suspicious rows, and uncover cleartext password leakage or DNS tunneling.</p>
                </div>

                <div class="pcap-table-container" style="margin-bottom:16px;">
                    <table class="soc-table pcap-table">
                        <thead>
                            <tr>
                                <th>SELECT</th>
                                <th>NO.</th>
                                <th>TIME</th>
                                <th>SOURCE</th>
                                <th>DESTINATION</th>
                                <th>PROTOCOL</th>
                                <th>PORT</th>
                                <th>INFO</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${SOC_PCAP_SAMPLES.map(p => `
                                <tr class="pcap-row pcap-selectable-row ${p.isSuspicious ? 'suspicious' : ''}" data-num="${p.num}" style="cursor:pointer;">
                                    <td style="text-align:center;"><i class="fa-solid ${selectedPacketNum === p.num ? 'fa-circle-dot text-cyan' : 'fa-circle text-muted'}"></i></td>
                                    <td>${p.num}</td>
                                    <td><code>${p.time}</code></td>
                                    <td><code>${p.source}</code></td>
                                    <td><code>${p.dest}</code></td>
                                    <td><span class="protocol-tag ${p.isSuspicious ? 'danger' : 'safe'}">${p.protocol}</span></td>
                                    <td>Port ${p.port}</td>
                                    <td>${p.info}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                    <h4 class="text-cyan" style="margin-bottom:12px;"><i class="fa-solid fa-user-ninja"></i> Packet Inspection Challenge</h4>
                    
                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">1. Why is unencrypted HTTP (Port 80) transmission in Packet #2 hazardous?</label>
                        <select id="pcap-hazard-sel" class="soc-select" style="width:100%;">
                            <option value="">Select hazard reason...</option>
                            <option value="cleartext">Because unencrypted HTTP transmits cleartext data, allowing eavesdroppers to read usernames and passwords in plain text</option>
                            <option value="slow">Because HTTP packets travel slower than HTTPS packets</option>
                            <option value="delete">Because Port 80 automatically deletes files from the web server</option>
                        </select>
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-weight:700; margin-bottom:6px; color:#fff;">2. Enter the Source IP address that transmitted plain-text login credentials:</label>
                        <input type="text" id="pcap-ip-input" placeholder="Enter Source IP address..." class="soc-input" style="width:100%;">
                    </div>

                    <button class="cyber-btn-cyan" id="btn-submit-pcap-challenge" style="width:100%; padding:10px;"><i class="fa-solid fa-paper-plane"></i> VERIFY PACKET ANALYSIS</button>
                    <div id="pcap-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                </div>
            </div>
        `;

        attachTipListener(container);

        container.querySelectorAll('.pcap-selectable-row').forEach(row => {
            row.onclick = (e) => {
                selectedPacketNum = parseInt(e.currentTarget.getAttribute('data-num'));
                container.querySelectorAll('.pcap-selectable-row').forEach(r => r.style.outline = 'none');
                e.currentTarget.style.outline = '2px solid var(--cyan)';
            };
        });

        container.querySelector('#btn-submit-pcap-challenge').onclick = () => {
            const hazardVal = container.querySelector('#pcap-hazard-sel').value;
            const enteredIp = container.querySelector('#pcap-ip-input').value.trim();
            const feedback = container.querySelector('#pcap-challenge-feedback');
            feedback.style.display = 'block';

            const isPacketCorrect = (selectedPacketNum === 2);
            const isHazardCorrect = (hazardVal === 'cleartext');
            const isIpCorrect = (enteredIp === '192.168.1.14');

            if (isPacketCorrect && isHazardCorrect && isIpCorrect) {
                feedback.className = 'soc-feedback-box success';
                feedback.innerHTML = `
                    <h4 class="text-cyan"><i class="fa-solid fa-circle-check"></i> CLEARTEXT CREDENTIAL LEAK DETECTED!</h4>
                    <p>Outstanding analysis! You selected Packet #2, identified why HTTP Port 80 cleartext transmission exposes credentials (<code>uname=admin&pass=T!ger#92</code>), and correctly identified Source IP <code>192.168.1.14</code>.</p>
                `;
                if (window.CyberOpsApp) window.CyberOpsApp.awardXP(50, 'tool_pcap_investigation', 'packet_master');
            } else {
                feedback.className = 'soc-feedback-box danger';
                feedback.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INCORRECT PACKET SELECTION OR ANALYSIS</h4>
                    <p>Make sure you click Packet #2 row in the table, select the cleartext hazard reason, and type Source IP <code>192.168.1.14</code>.</p>
                `;
            }
        };
    }

    // --- 4. Interactive Firewall Rule Console ---
    function initFirewallManager(container) {
        if (!container) return;

        let rules = [
            { id: 1, action: 'ALLOW', port: 443, proto: 'TCP', desc: 'HTTPS Encrypted Web Traffic' },
            { id: 2, action: 'ALLOW', port: 53, proto: 'UDP', desc: 'DNS Domain Resolution' }
        ];

        function renderRules() {
            const tbody = container.querySelector('#fw-rules-tbody');
            if (!tbody) return;

            tbody.innerHTML = rules.map(r => `
                <tr>
                    <td><span class="rule-action ${r.action.toLowerCase()}">${r.action}</span></td>
                    <td>Port <code>${r.port}</code></td>
                    <td><code>${r.proto}</code></td>
                    <td>${r.desc}</td>
                    <td><button class="chip-btn danger btn-del-rule" data-id="${r.id}">&times; DELETE</button></td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.btn-del-rule').forEach(btn => {
                btn.onclick = (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    rules = rules.filter(r => r.id !== id);
                    renderRules();
                };
            });
        }

        container.innerHTML = `
            <div class="soc-app-wrapper">
                ${createTipBannerHtml('ops_m9', 'Module 9: Firewall Rules')}

                <div class="soc-app-header">
                    <h3><i class="fa-solid fa-shield-halved text-cyan"></i> Stateful Firewall Rule Console</h3>
                    <p>Configure Firewall rules to BLOCK insecure Port 80 (HTTP) traffic and secure network perimeter.</p>
                </div>

                <div class="fw-add-bar" style="display:flex; gap:10px; margin-bottom:14px;">
                    <select id="fw-action-sel" class="soc-select">
                        <option value="BLOCK">BLOCK</option>
                        <option value="ALLOW">ALLOW</option>
                    </select>
                    <input type="number" id="fw-port-input" placeholder="Port number..." class="soc-input" style="width:140px;">
                    <input type="text" id="fw-desc-input" placeholder="Rule Description..." class="soc-input" style="flex:1;">
                    <button class="cyber-btn-cyan" id="btn-add-fw-rule"><i class="fa-solid fa-plus"></i> ADD RULE</button>
                </div>

                <div class="fw-table-container" style="margin-bottom:16px;">
                    <table class="soc-table">
                        <thead>
                            <tr>
                                <th>ACTION</th>
                                <th>PORT</th>
                                <th>PROTOCOL</th>
                                <th>DESCRIPTION</th>
                                <th>MANAGE</th>
                            </tr>
                        </thead>
                        <tbody id="fw-rules-tbody">
                        </tbody>
                    </table>
                </div>

                <div class="soc-investigation-quiz-card" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                    <h4 class="text-cyan" style="margin-bottom:10px;"><i class="fa-solid fa-user-ninja"></i> Firewall Challenge</h4>
                    <p style="font-size:0.88rem; margin-bottom:10px;">Configure a firewall rule above to <strong>BLOCK Port 80 (unencrypted HTTP)</strong> traffic. Once configured, click test rule:</p>
                    <button class="cyber-btn-cyan" id="btn-test-fw-config"><i class="fa-solid fa-shield"></i> TEST FIREWALL SECURITY</button>
                    <div id="fw-challenge-feedback" class="soc-feedback-box" style="display:none; margin-top:14px;"></div>
                </div>
            </div>
        `;

        attachTipListener(container);
        renderRules();

        container.querySelector('#btn-add-fw-rule').onclick = () => {
            const action = container.querySelector('#fw-action-sel').value;
            const port = parseInt(container.querySelector('#fw-port-input').value);
            const desc = container.querySelector('#fw-desc-input').value.trim();

            if (!port || !desc) return;

            rules.push({ id: Date.now(), action, port, proto: 'TCP', desc });
            container.querySelector('#fw-port-input').value = '';
            container.querySelector('#fw-desc-input').value = '';
            renderRules();
        };

        container.querySelector('#btn-test-fw-config').onclick = () => {
            const feedback = container.querySelector('#fw-challenge-feedback');
            feedback.style.display = 'block';

            const hasBlockPort80 = rules.some(r => r.action === 'BLOCK' && r.port === 80);

            if (hasBlockPort80) {
                feedback.className = 'soc-feedback-box success';
                feedback.innerHTML = `
                    <h4 class="text-cyan"><i class="fa-solid fa-circle-check"></i> FIREWALL SECURITY TEST PASSED!</h4>
                    <p>Excellent policy enforcement! Port 80 (cleartext HTTP) is blocked, forcing all corporate traffic onto Port 443 (TLS Encrypted HTTPS).</p>
                `;
                if (window.CyberOpsApp) window.CyberOpsApp.awardXP(50, 'tool_firewall_investigation', 'firewall_hero');
            } else {
                feedback.className = 'soc-feedback-box danger';
                feedback.innerHTML = `
                    <h4 class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> INSECURE FIREWALL POLICY</h4>
                    <p>Add a rule above setting Action to <code>BLOCK</code> for Port <code>80</code> to secure cleartext web traffic.</p>
                `;
            }
        };
    }

    return {
        initLogViewer,
        initHashChecker,
        initPacketInspector,
        initFirewallManager
    };
})();
