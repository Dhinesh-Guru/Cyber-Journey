/* ==========================================================================
   Cyber Academy - Component: 5 Interactive Mini-Games Engine
   ========================================================================= */

const MiniGamesEngine = (function () {
    'use strict';

    function attachModuleTipListener(container) {
        if (!container) return;
        container.querySelectorAll('.tip-link-modules').forEach(lnk => {
            lnk.addEventListener('click', (e) => {
                e.preventDefault();
                const targetCh = e.currentTarget.getAttribute('data-chapter');
                const btn = document.querySelector('.nav-tab-btn[data-view="modules"]');
                if (btn) btn.click();

                if (targetCh && window.AcademyApp && window.AcademyApp.openChapterModal) {
                    setTimeout(() => {
                        window.AcademyApp.openChapterModal(targetCh);
                    }, 100);
                }
            });
        });
    }

    function createTipBannerHtml(chId, chTitle) {
        return `
            <div class="learning-tip-banner">
                <i class="fa-solid fa-lightbulb text-amber"></i>
                <span><strong>Learning Tip:</strong> Want to master this topic in detail and gain full XP & badges? Check out the <a href="#" class="tip-link-modules" data-chapter="${chId}">Academy Module (${chTitle})</a> in the learning section!</span>
            </div>
        `;
    }

    // Game 1: Interactive Password Builder (Type Your Own Password)
    function initPasswordBuilderGame(container) {
        if (!container) return;

        container.innerHTML = `
            <div class="game-wrapper password-builder-card">
                ${createTipBannerHtml('ch1', 'Password Security')}
                <div class="game-header">
                    <h3><i class="fa-solid fa-key text-emerald"></i> Game 1: Password Strength Tester & Builder</h3>
                    <p class="game-desc">Type your own custom password below to test how long it would take supercomputers to guess it. Your goal is to build a password requiring 1,000,000+ years to crack and enable MFA.</p>
                </div>

                <!-- Custom Password Input with Eye Toggle -->
                <div class="custom-pass-input-wrap">
                    <input type="password" id="custom-pass-input" class="custom-pass-input" placeholder="Type your custom password here..." autocomplete="off">
                    <button type="button" class="toggle-pass-eye" id="btn-toggle-pass-vis" title="Show/Hide Password"><i class="fa-solid fa-eye"></i></button>
                </div>

                <!-- Live Strength & Crack Time Meter -->
                <div class="strength-meter-wrap">
                    <div class="meter-labels">
                        <span>Strength: <strong id="pass-strength-label" class="text-danger">WEAK</strong></span>
                        <span>Estimated Crack Time: <strong id="pass-crack-time" class="text-danger">Instantly (0 seconds)</strong></span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" id="pass-meter-bar" style="width: 5%; background: var(--cyber-danger);"></div>
                    </div>
                </div>

                <!-- Live Task Requirement Badges -->
                <div class="req-badges-grid">
                    <div class="req-badge-item" id="req-len">
                        <i class="fa-solid fa-ruler-horizontal"></i> <span>12+ Characters Length</span>
                    </div>
                    <div class="req-badge-item" id="req-upper">
                        <i class="fa-solid fa-font"></i> <span>Uppercase Letter (A-Z)</span>
                    </div>
                    <div class="req-badge-item" id="req-lower">
                        <i class="fa-solid fa-font"></i> <span>Lowercase Letter (a-z)</span>
                    </div>
                    <div class="req-badge-item" id="req-num">
                        <i class="fa-solid fa-hashtag"></i> <span>Number (0-9)</span>
                    </div>
                    <div class="req-badge-item" id="req-sym">
                        <i class="fa-solid fa-asterisk"></i> <span>Special Symbol (!@#$)</span>
                    </div>
                    <label class="req-badge-item mfa-badge" style="cursor:pointer;">
                        <input type="checkbox" id="chk-mfa-game1" style="accent-color:var(--emerald);">
                        <span><i class="fa-solid fa-mobile-screen-button text-emerald"></i> Enable Multi-Factor Auth (MFA)</span>
                    </label>
                </div>

                <div class="game-footer-actions">
                    <button class="cyber-primary-btn" id="btn-submit-pass-game">SUBMIT PASSWORD BUILD</button>
                    <span id="pass-game-status" class="status-msg" style="margin-left:14px; font-weight:600;"></span>
                </div>
            </div>
        `;

        attachModuleTipListener(container);

        const passInput = container.querySelector('#custom-pass-input');
        const eyeBtn = container.querySelector('#btn-toggle-pass-vis');
        const strengthLabel = container.querySelector('#pass-strength-label');
        const crackTimeLabel = container.querySelector('#pass-crack-time');
        const meterBar = container.querySelector('#pass-meter-bar');
        const submitBtn = container.querySelector('#btn-submit-pass-game');
        const statusMsg = container.querySelector('#pass-game-status');
        const chkMfa = container.querySelector('#chk-mfa-game1');

        // Requirement badges
        const reqLen = container.querySelector('#req-len');
        const reqUpper = container.querySelector('#req-upper');
        const reqLower = container.querySelector('#req-lower');
        const reqNum = container.querySelector('#req-num');
        const reqSym = container.querySelector('#req-sym');

        // Toggle Eye Visibility
        eyeBtn.addEventListener('click', () => {
            if (passInput.type === 'password') {
                passInput.type = 'text';
                eyeBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                passInput.type = 'password';
                eyeBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        });

        function calculateCustomPassword() {
            const pwd = passInput.value;
            const len = pwd.length;

            const hasUpper = /[A-Z]/.test(pwd);
            const hasLower = /[a-z]/.test(pwd);
            const hasNum = /[0-9]/.test(pwd);
            const hasSym = /[^A-Za-z0-9]/.test(pwd);
            const isLong = len >= 12;
            const hasMfa = chkMfa.checked;

            // Toggle Requirement Badges Live
            reqLen.classList.toggle('fulfilled', isLong);
            reqUpper.classList.toggle('fulfilled', hasUpper);
            reqLower.classList.toggle('fulfilled', hasLower);
            reqNum.classList.toggle('fulfilled', hasNum);
            reqSym.classList.toggle('fulfilled', hasSym);

            if (len === 0) {
                strengthLabel.textContent = 'WEAK';
                strengthLabel.style.color = 'var(--cyber-danger)';
                crackTimeLabel.textContent = 'Instantly (0 seconds)';
                crackTimeLabel.style.color = 'var(--cyber-danger)';
                meterBar.style.width = '5%';
                meterBar.style.background = 'var(--cyber-danger)';
                return { isUnbreakable: false, hasMfa };
            }

            // Pool calculation
            let pool = 0;
            if (hasLower) pool += 26;
            if (hasUpper) pool += 26;
            if (hasNum) pool += 10;
            if (hasSym) pool += 32;

            if (pool === 0) pool = 26;

            const combinations = Math.pow(pool, len);
            const guessesPerSec = 100000000000; // 100 Billion guesses/sec
            const secondsToCrack = combinations / guessesPerSec;

            let crackStr = '';
            let pct = 0;
            let label = 'WEAK';
            let color = 'var(--cyber-danger)';

            if (secondsToCrack < 1) {
                crackStr = 'Instantly (0.01 seconds)';
                pct = 10;
            } else if (secondsToCrack < 60) {
                crackStr = `${Math.round(secondsToCrack)} seconds`;
                pct = 25;
            } else if (secondsToCrack < 3600) {
                crackStr = `${Math.round(secondsToCrack / 60)} minutes`;
                pct = 40;
                label = 'MODERATE';
                color = 'var(--cyber-amber)';
            } else if (secondsToCrack < 86400 * 30) {
                crackStr = `${Math.round(secondsToCrack / 86400)} days`;
                pct = 60;
                label = 'STRONG';
                color = 'var(--cyber-cyan)';
            } else if (secondsToCrack < 86400 * 365 * 1000) {
                crackStr = `${Math.round(secondsToCrack / (86400 * 365))} years`;
                pct = 80;
                label = 'SUPER STRONG';
                color = 'var(--cyber-emerald)';
            } else {
                crackStr = 'Over 1,000,000+ Years (UNBREAKABLE)';
                pct = 100;
                label = 'GOD-TIER UNBREAKABLE';
                color = 'var(--cyber-emerald)';
            }

            strengthLabel.textContent = label;
            strengthLabel.style.color = color;
            crackTimeLabel.textContent = crackStr;
            crackTimeLabel.style.color = color;
            meterBar.style.width = `${pct}%`;
            meterBar.style.background = color;

            return { isUnbreakable: secondsToCrack >= 86400 * 365 * 1000, hasMfa };
        }

        passInput.addEventListener('input', calculateCustomPassword);
        chkMfa.addEventListener('change', calculateCustomPassword);

        submitBtn.addEventListener('click', () => {
            const res = calculateCustomPassword();
            if (res.isUnbreakable && res.hasMfa) {
                statusMsg.innerHTML = '<span class="text-emerald"><i class="fa-solid fa-circle-check"></i> AWESOME! Your custom password is God-Tier Unbreakable + MFA enabled! (+50 XP)</span>';
                if (window.AcademyApp) {
                    window.AcademyApp.awardXP(50, 'ch1', 'pass_guardian');
                }
            } else if (!res.isUnbreakable) {
                statusMsg.innerHTML = '<span class="text-amber"><i class="fa-solid fa-triangle-exclamation"></i> Password needs more strength! Add letters, numbers, symbols or extend length until crack time exceeds 1,000,000 years.</span>';
            } else if (!res.hasMfa) {
                statusMsg.innerHTML = '<span class="text-amber"><i class="fa-solid fa-triangle-exclamation"></i> Password is strong, but don\'t forget to check "Enable Multi-Factor Auth (MFA)"!</span>';
            }
        });
    }

    // Game 2: Phishing Email Inspector
    function initPhishingInspectorGame(container) {
        if (!container) return;

        let currentIndex = 0;
        let score = 0;

        function renderEmailCard() {
            const email = PHISHING_DATA[currentIndex];
            container.innerHTML = `
                <div class="game-wrapper phishing-inspector-card">
                    ${createTipBannerHtml('ch2', 'Phishing Defense')}
                    <div class="game-header">
                        <h3><i class="fa-solid fa-fish text-cyan"></i> Game 2: Phishing Email Inspector</h3>
                        <p class="game-desc">Analyze incoming emails. Inspect sender domain and links before making your decision (Email ${currentIndex + 1} of ${PHISHING_DATA.length}).</p>
                    </div>

                    <div class="email-inspector-box">
                        <div class="email-header-bar">
                            <div class="header-field">
                                <span class="lbl">From:</span>
                                <strong>${email.senderName}</strong> &lt;<span class="${email.isPhishing ? 'suspicious-address' : 'safe-address'}">${email.senderAddress}</span>&gt;
                            </div>
                            <div class="header-field">
                                <span class="lbl">Subject:</span>
                                <span>${email.subject}</span>
                            </div>
                        </div>

                        <div class="email-body-preview">
                            ${email.content}
                        </div>

                        <div class="hover-preview-bar" id="hover-url-preview">
                            <i class="fa-solid fa-link"></i> <span id="hover-url-text">Hover over any button or link to inspect true URL destination...</span>
                        </div>
                    </div>

                    <div class="inspector-decision-actions">
                        <button class="cyber-primary-btn" id="btn-decide-safe"><i class="fa-solid fa-circle-check"></i> MARK AS LEGITIMATE</button>
                        <button class="cyber-secondary-btn danger-btn" id="btn-decide-phish"><i class="fa-solid fa-triangle-exclamation"></i> REPORT PHISHING SCAM</button>
                    </div>
                </div>
            `;

            attachModuleTipListener(container);

            // Hover preview handler
            const inspectLinks = container.querySelectorAll('.inspectable-link');
            const hoverText = container.querySelector('#hover-url-text');

            inspectLinks.forEach(lnk => {
                lnk.addEventListener('mouseenter', () => {
                    const realUrl = lnk.getAttribute('data-real-url');
                    hoverText.innerHTML = `DESTINATION URL: <strong class="text-amber">${realUrl}</strong>`;
                });
                lnk.addEventListener('mouseleave', () => {
                    hoverText.textContent = 'Hover over any button or link to inspect true URL destination...';
                });
            });

            // Action Decision Handlers
            container.querySelector('#btn-decide-safe').addEventListener('click', () => handleDecision(false));
            container.querySelector('#btn-decide-phish').addEventListener('click', () => handleDecision(true));
        }

        function handleDecision(userSaidPhishing) {
            const email = PHISHING_DATA[currentIndex];
            const isCorrect = (userSaidPhishing === email.isPhishing);

            if (isCorrect) score++;

            let feedbackHtml = `
                <div class="decision-feedback-modal">
                    <h4>${isCorrect ? '<i class="fa-solid fa-circle-check text-emerald"></i> CORRECT DECISION!' : '<i class="fa-solid fa-circle-xmark text-danger"></i> INCORRECT DECISION!'}</h4>
                    <p>This email was <strong>${email.isPhishing ? 'A DANGEROUS PHISHING SCAM' : 'A LEGITIMATE EMAIL'}</strong>.</p>
                    ${email.redFlags.length > 0 ? `
                        <div class="red-flags-box" style="margin:14px 0; background:rgba(255,255,255,0.03); padding:12px; border-radius:8px;">
                            <h5 style="color:var(--cyber-amber);">Detected Red Flags:</h5>
                            <ul style="margin-left:20px; color:var(--text-secondary);">${email.redFlags.map(rf => `<li>${rf}</li>`).join('')}</ul>
                        </div>
                    ` : '<p class="text-emerald" style="margin:10px 0;">No security red flags were detected.</p>'}
                    <button class="cyber-primary-btn" id="btn-next-email">${currentIndex < PHISHING_DATA.length - 1 ? 'NEXT EMAIL' : 'VIEW FINAL SCORE'}</button>
                </div>
            `;

            const inspectorBox = container.querySelector('.email-inspector-box');
            inspectorBox.innerHTML = feedbackHtml;
            container.querySelector('.inspector-decision-actions').style.display = 'none';

            container.querySelector('#btn-next-email').addEventListener('click', () => {
                currentIndex++;
                if (currentIndex < PHISHING_DATA.length) {
                    renderEmailCard();
                } else {
                    renderPhishingResults();
                }
            });
        }

        function renderPhishingResults() {
            const passed = score >= 4;
            container.innerHTML = `
                <div class="game-wrapper game-results-card">
                    ${createTipBannerHtml('ch2', 'Phishing Defense')}
                    <h3>Phishing Inspection Complete!</h3>
                    <p class="final-score" style="font-size:1.2rem; margin:14px 0;">Your Score: <strong>${score} / ${PHISHING_DATA.length}</strong> (${Math.round((score / PHISHING_DATA.length) * 100)}%)</p>
                    <p>${passed ? '<i class="fa-solid fa-award text-emerald"></i> Congratulations! You earned the Phishing Detective Badge (+50 XP).' : 'Review the red flags and try again to achieve 80%+ accuracy.'}</p>
                    <button class="cyber-primary-btn" id="btn-retry-phish" style="margin-top:16px;">RETRY GAME</button>
                </div>
            `;

            attachModuleTipListener(container);

            if (passed && window.AcademyApp) {
                window.AcademyApp.awardXP(50, 'ch2', 'phish_detective');
            }

            container.querySelector('#btn-retry-phish').addEventListener('click', () => {
                currentIndex = 0;
                score = 0;
                renderEmailCard();
            });
        }

        renderEmailCard();
    }

    // Game 3: Safe Website URL Guard (Inline Feedback, No Browser Alerts)
    function initUrlGuardGame(container) {
        if (!container) return;

        const SCENARIOS = [
            { url: 'https://www.paypal.com/signin', isSafe: true, reason: 'Official PayPal domain with valid HTTPS encryption lock.' },
            { url: 'http://paypa1-secure-verify.com/login', isSafe: false, reason: 'Typosquatting domain ("paypa1") using unencrypted HTTP connection.' },
            { url: 'https://www.amazon.com/dp/B08N5WRWNW', isSafe: true, reason: 'Legitimate Amazon store domain with valid HTTPS certificate.' },
            { url: 'http://192.168.1.105/bank/login.php', isSafe: false, reason: 'Raw IP address login page using unencrypted HTTP.' },
            { url: 'https://g00gle-security-alert.net/auth', isSafe: false, reason: 'Fake Google domain ("g00gle" with zeros instead of "o").' }
        ];

        let index = 0;
        let score = 0;

        function renderUrlCard() {
            const s = SCENARIOS[index];
            container.innerHTML = `
                <div class="game-wrapper url-guard-card">
                    ${createTipBannerHtml('ch3', 'Safe Web Browsing')}
                    <div class="game-header">
                        <h3><i class="fa-solid fa-globe text-emerald"></i> Game 3: Safe Website URL Guard</h3>
                        <p class="game-desc">Inspect browser address bars to identify safe websites vs dangerous typosquatting scams (${index + 1} of ${SCENARIOS.length}).</p>
                    </div>

                    <div class="browser-bar-simulator">
                        <div class="bar-controls">
                            <span class="dot red"></span>
                            <span class="dot yellow"></span>
                            <span class="dot green"></span>
                        </div>
                        <div class="address-input-box">
                            <i class="fa-solid ${s.url.startsWith('https') ? 'fa-lock text-emerald' : 'fa-lock-open text-danger'}"></i>
                            <span class="url-text">${s.url}</span>
                        </div>
                    </div>

                    <div id="url-feedback-area"></div>

                    <div class="url-actions" id="url-actions-bar">
                        <button class="cyber-primary-btn" id="btn-url-safe"><i class="fa-solid fa-shield-halved"></i> SAFE WEBSITE</button>
                        <button class="cyber-secondary-btn danger-btn" id="btn-url-scam"><i class="fa-solid fa-triangle-exclamation"></i> DANGEROUS SCAM</button>
                    </div>
                </div>
            `;

            attachModuleTipListener(container);

            container.querySelector('#btn-url-safe').addEventListener('click', () => handleChoice(true));
            container.querySelector('#btn-url-scam').addEventListener('click', () => handleChoice(false));
        }

        function handleChoice(userSaidSafe) {
            const s = SCENARIOS[index];
            const isCorrect = (userSaidSafe === s.isSafe);
            if (isCorrect) score++;

            const feedbackArea = container.querySelector('#url-feedback-area');
            const actionsBar = container.querySelector('#url-actions-bar');

            actionsBar.style.display = 'none';
            feedbackArea.innerHTML = `
                <div class="decision-feedback-box" style="background:rgba(255,255,255,0.03); border:1px solid ${isCorrect ? 'var(--emerald)' : 'var(--cyber-danger)'}; padding:18px; border-radius:10px; margin:16px 0;">
                    <h4 style="color:${isCorrect ? 'var(--emerald)' : 'var(--cyber-danger)'}; margin-bottom:8px;">
                        ${isCorrect ? '<i class="fa-solid fa-circle-check"></i> CORRECT DECISION!' : '<i class="fa-solid fa-circle-xmark"></i> INCORRECT DECISION!'}
                    </h4>
                    <p style="color:var(--text-secondary); margin-bottom:14px;">${s.reason}</p>
                    <button class="cyber-primary-btn" id="btn-next-url">${index < SCENARIOS.length - 1 ? 'NEXT WEBSITE' : 'VIEW FINAL SCORE'}</button>
                </div>
            `;

            container.querySelector('#btn-next-url').addEventListener('click', () => {
                index++;
                if (index < SCENARIOS.length) {
                    renderUrlCard();
                } else {
                    renderUrlResults();
                }
            });
        }

        function renderUrlResults() {
            const passed = score >= 4;
            container.innerHTML = `
                <div class="game-wrapper game-results-card">
                    ${createTipBannerHtml('ch3', 'Safe Web Browsing')}
                    <h3>URL Guard Challenge Complete!</h3>
                    <p class="final-score" style="font-size:1.2rem; margin:14px 0;">Your Score: <strong>${score} / ${SCENARIOS.length}</strong> (${Math.round((score / SCENARIOS.length) * 100)}%)</p>
                    <p>${passed ? '<i class="fa-solid fa-award text-emerald"></i> Congratulations! You earned the Safe Browser Badge (+50 XP).' : 'Review domain spelling & HTTP locks and try again.'}</p>
                    <button class="cyber-primary-btn" id="btn-retry-url" style="margin-top:16px;">RETRY GAME</button>
                </div>
            `;

            attachModuleTipListener(container);

            if (passed && window.AcademyApp) {
                window.AcademyApp.awardXP(50, 'ch3', 'safe_browser');
            }

            container.querySelector('#btn-retry-url').addEventListener('click', () => {
                index = 0;
                score = 0;
                renderUrlCard();
            });
        }

        renderUrlCard();
    }

    // Game 4: Malware File Hunter (Inline Feedback, No Browser Alerts)
    function initMalwareHunterGame(container) {
        if (!container) return;

        let score = 0;

        container.innerHTML = `
            <div class="game-wrapper malware-hunter-card">
                ${createTipBannerHtml('ch4', 'Malware Defense')}
                <div class="game-header">
                    <h3><i class="fa-solid fa-bug text-purple"></i> Game 4: Malware File Hunter</h3>
                    <p class="game-desc">Scan downloads folder, detect suspicious double extensions & executables, and quarantine all 4 malware threats.</p>
                </div>

                <div class="files-grid" id="downloads-grid">
                    ${MALWARE_DATA.map(f => `
                        <div class="file-card-box" id="card-${f.id}">
                            <i class="fa-solid fa-file-code file-icon"></i>
                            <div class="file-info">
                                <strong class="file-name">${f.name}</strong>
                                <span class="file-meta">${f.size} • ${f.apparentType}</span>
                            </div>
                            <div class="file-actions">
                                <button class="chip-btn btn-scan-file" data-id="${f.id}"><i class="fa-solid fa-radar"></i> SCAN</button>
                                <button class="chip-btn danger btn-del-file" data-id="${f.id}"><i class="fa-solid fa-trash"></i> DELETE</button>
                            </div>
                            <div class="scan-result" id="scan-res-${f.id}" style="margin-top:8px; font-size:0.85rem;"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        attachModuleTipListener(container);

        container.querySelectorAll('.btn-scan-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                const file = MALWARE_DATA.find(f => f.id === id);
                const resEl = container.querySelector(`#scan-res-${id}`);
                if (file.isMalware) {
                    resEl.innerHTML = `<span class="text-danger"><i class="fa-solid fa-bug"></i> THREAT: ${file.threatName}</span>`;
                } else {
                    resEl.innerHTML = `<span class="text-emerald"><i class="fa-solid fa-circle-check"></i> CLEAN FILE</span>`;
                }
            });
        });

        container.querySelectorAll('.btn-del-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                const file = MALWARE_DATA.find(f => f.id === id);
                const card = container.querySelector(`#card-${id}`);
                const resEl = container.querySelector(`#scan-res-${id}`);

                if (file.isMalware) {
                    card.style.opacity = '0.35';
                    card.style.pointerEvents = 'none';
                    resEl.innerHTML = `<span class="text-emerald"><i class="fa-solid fa-shield-halved"></i> QUARANTINED</span>`;
                    score++;

                    if (score >= 4) {
                        let isFirstTime = false;
                        if (window.AcademyApp) {
                            isFirstTime = window.AcademyApp.awardXP(50, 'ch4', 'malware_hunter');
                        }

                        let feedbackEl = container.querySelector('#malware-completion-card');
                        if (!feedbackEl) {
                            feedbackEl = document.createElement('div');
                            feedbackEl.id = 'malware-completion-card';
                            feedbackEl.className = 'decision-feedback-box';
                            feedbackEl.style.cssText = 'background:rgba(255,255,255,0.03); border:1px solid var(--emerald); padding:20px; border-radius:12px; margin-top:24px; text-align:center;';
                            container.querySelector('.game-wrapper').appendChild(feedbackEl);
                        }

                        feedbackEl.innerHTML = `
                            <h3 class="text-emerald" style="margin-bottom:10px;"><i class="fa-solid fa-award"></i> ALL MALWARE THREATS QUARANTINED!</h3>
                            <p style="color:var(--text-secondary); margin-bottom:12px;">You successfully detected and isolated all 4 dangerous executable malware files.</p>
                            ${isFirstTime ? '<p class="highlight" style="font-size:1.1rem; margin:10px 0;">+50 XP Awarded! Unlocked Malware Hunter Badge.</p>' : '<p class="text-muted" style="font-size:0.92rem; margin:10px 0;">(Module Reviewed — XP already earned on first completion)</p>'}
                            <button class="cyber-primary-btn" id="btn-retry-malware" style="margin-top:14px;">RETRY FILE HUNTER</button>
                        `;

                        feedbackEl.querySelector('#btn-retry-malware').addEventListener('click', () => {
                            initMalwareHunterGame(container);
                        });
                    }
                } else {
                    resEl.innerHTML = `<span class="text-amber"><i class="fa-solid fa-triangle-exclamation"></i> Warning: Deleted legitimate file!</span>`;
                }
            });
        });
    }

    // Game 5: Security Quiz Battle (Timer Mode)
    function initQuizBattleGame(container) {
        if (!container) return;

        let timeLeft = 45;
        let score = 0;
        let timer = null;

        container.innerHTML = `
            <div class="game-wrapper quiz-battle-card">
                ${createTipBannerHtml('final_exam', 'Cyber Defense Certification')}
                <div class="game-header">
                    <h3><i class="fa-solid fa-bolt text-amber"></i> Game 5: Rapid Security Quiz Battle</h3>
                    <p class="game-desc">Answer as many security questions as possible in 45 seconds!</p>
                </div>

                <div class="quiz-timer-display" style="display:flex; justify-content:space-between; margin-bottom:16px;">
                    <span>TIME REMAINING: <strong id="battle-time-val" class="highlight">45</strong>s</span>
                    <span>SCORE: <strong id="battle-score-val" class="text-emerald">0</strong></span>
                </div>

                <div id="battle-question-box">
                    <button class="cyber-primary-btn" id="btn-start-battle">START BATTLE</button>
                </div>
            </div>
        `;

        attachModuleTipListener(container);

        const startBtn = container.querySelector('#btn-start-battle');
        const qBox = container.querySelector('#battle-question-box');
        const timeVal = container.querySelector('#battle-time-val');
        const scoreVal = container.querySelector('#battle-score-val');

        startBtn.addEventListener('click', () => {
            timer = setInterval(() => {
                timeLeft--;
                timeVal.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endBattle();
                }
            }, 1000);
            renderBattleQuestion();
        });

        const ALL_QUESTIONS = ACADEMY_LESSONS.flatMap(ch => ch.questions);
        let qIdx = 0;

        function renderBattleQuestion() {
            if (qIdx >= ALL_QUESTIONS.length) qIdx = 0;
            const q = ALL_QUESTIONS[qIdx];
            qBox.innerHTML = `
                <div class="battle-q-card">
                    <h4 style="margin-bottom:14px;">${q.question}</h4>
                    <div class="battle-options-list" style="display:flex; flex-direction:column; gap:10px;">
                        ${q.options.map((opt, i) => `
                            <button class="cyber-secondary-btn btn-battle-opt" data-idx="${i}">${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `;

            qBox.querySelectorAll('.btn-battle-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selected = parseInt(e.target.getAttribute('data-idx'));
                    if (selected === q.correctIndex) {
                        score += 10;
                        scoreVal.textContent = score;
                    }
                    qIdx++;
                    renderBattleQuestion();
                });
            });
        }

        function endBattle() {
            qBox.innerHTML = `
                <div class="game-results-card">
                    <h3>Time Up! Battle Complete</h3>
                    <p class="final-score" style="font-size:1.2rem; margin:14px 0;">Final Score: <strong>${score} Points</strong></p>
                    <button class="cyber-primary-btn" id="btn-restart-battle">PLAY AGAIN</button>
                </div>
            `;
            if (window.AcademyApp) {
                window.AcademyApp.awardXP(Math.min(100, score));
            }
        }
    }

    return {
        initPasswordBuilderGame,
        initPhishingInspectorGame,
        initUrlGuardGame,
        initMalwareHunterGame,
        initQuizBattleGame
    };
})();
