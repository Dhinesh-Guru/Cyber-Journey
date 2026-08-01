/* ==========================================================================
   CyberOps Lab (Level 2) - Main Application Controller & Bridge Engine
   ========================================================================== */

(function () {
    'use strict';

    const STORAGE_KEY_USER = 'cyberjourney_user_v1';
    const STORAGE_KEY_REGISTERED_USERS = 'cyberjourney_registered_users_v1';

    function loadUser() {
        try {
            const data = localStorage.getItem(STORAGE_KEY_USER);
            if (data) {
                const parsed = JSON.parse(data);
                if (!parsed.completedCyberOpsModules) parsed.completedCyberOpsModules = [];
                if (!parsed.quizBestScores) parsed.quizBestScores = {};
                return parsed;
            }
        } catch (e) {
            console.error('Error loading user state in CyberOps Lab', e);
        }
        return {
            isLoggedIn: true,
            isRegistered: false,
            username: 'Trainee',
            xp: 0,
            level: 2,
            rank: 'Junior Analyst',
            experienceLevel: 'beginner',
            progress: { academy: 100, cyberops: 0, cipher: 0 },
            unlocked: { academy: true, cyberops: true, cipher: false },
            badges: [],
            completedCyberOpsModules: [],
            quizBestScores: {}
        };
    }

    let currentUser = loadUser();
    let completedModules = new Set(currentUser.completedCyberOpsModules || []);

    document.addEventListener('DOMContentLoaded', async () => {
        if (!checkAccessControl()) return;

        if (currentUser.isLoggedIn && currentUser.isRegistered && typeof FirebaseSyncService !== 'undefined' && FirebaseSyncService.isCloudActive()) {
            try {
                const cloudData = await FirebaseSyncService.fetchCloudProfile(currentUser.username || currentUser.email);
                if (cloudData) {
                    mergeCloudData(cloudData);
                }
                FirebaseSyncService.listenToLiveUserProfile(currentUser.username, (liveData) => {
                    if (liveData) mergeCloudData(liveData);
                });
            } catch (e) {}
        }

        initUI();
        initNavigation();
        renderModulesView();
        initWorkstationView();
        initIncidentView();
        initModalEvents();
    });

    function mergeCloudData(cloudData) {
        if (!cloudData) return;
        currentUser.xp = Math.max(currentUser.xp || 0, cloudData.xp || 0);
        if (cloudData.completedCyberOpsModules && Array.isArray(cloudData.completedCyberOpsModules)) {
            cloudData.completedCyberOpsModules.forEach(id => completedModules.add(id));
        }
        if (cloudData.quizBestScores) {
            currentUser.quizBestScores = { ...(currentUser.quizBestScores || {}), ...cloudData.quizBestScores };
        }
        currentUser.completedCyberOpsModules = Array.from(completedModules);
        saveUser();
        initUI();
        renderModulesView();
    }

    function checkAccessControl() {
        const isAcademyComplete = (currentUser.progress && currentUser.progress.academy >= 100);
        const isUnlocked = (currentUser.unlocked && currentUser.unlocked.cyberops === true);
        const isPreunlocked = (currentUser.experienceLevel === 'intermediate' || currentUser.experienceLevel === 'advanced');

        if (!isAcademyComplete && !isUnlocked && !isPreunlocked) {
            document.body.innerHTML = `
                <div style="min-height:100vh; background:#050b14; display:flex; align-items:center; justify-content:center; padding:20px; font-family:sans-serif; color:#fff;">
                    <div style="background:rgba(10,25,47,0.9); border:2px solid #ff2a6d; box-shadow:0 0 40px rgba(255,42,109,0.3); border-radius:20px; padding:40px; max-width:540px; text-align:center;">
                        <div style="font-size:60px; color:#ff2a6d; margin-bottom:16px;"><i class="fa-solid fa-lock"></i></div>
                        <h2 style="font-family:'Orbitron',sans-serif; color:#ff2a6d; margin-bottom:12px;">ACCESS DENIED: LEVEL 02 LOCKED</h2>
                        <p style="color:#8892b0; line-height:1.6; margin-bottom:24px;">You must complete <strong>Level 01 (Cyber Academy 100%)</strong> before accessing CyberOps Lab.</p>
                        <a href="../Cyber Academy/index.html" style="background:#00f3ff; color:#050b14; text-decoration:none; font-family:'Orbitron',sans-serif; font-weight:800; padding:14px 28px; border-radius:10px; display:inline-block;">GO TO CYBER ACADEMY (LEVEL 01)</a>
                    </div>
                </div>
            `;
            return false;
        }
        return true;
    }

    function saveUser() {
        currentUser.completedCyberOpsModules = Array.from(completedModules);
        
        const opsCount = (currentUser.completedCyberOpsModules || []).length;
        currentUser.progress.cyberops = Math.min(100, Math.round((opsCount / 10) * 100));

        if (currentUser.progress.cyberops >= 100) {
            currentUser.unlocked.cipher = true;
        }

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));

        if (currentUser.isRegistered && currentUser.username) {
            try {
                let users = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTERED_USERS) || '[]');
                const idx = users.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
                
                const overallPct = Math.round(((currentUser.progress.academy || 0) + currentUser.progress.cyberops + (currentUser.progress.cipher || 0)) / 3);
                
                const updatedObj = {
                    username: currentUser.username,
                    email: currentUser.email,
                    password: currentUser.password,
                    passwordHistory: currentUser.passwordHistory || [currentUser.password],
                    avatar: currentUser.avatar || null,
                    rank: currentUser.rank,
                    xp: currentUser.xp,
                    progress: { ...currentUser.progress },
                    overallCompletion: overallPct,
                    unlocked: { ...currentUser.unlocked },
                    experienceLevel: currentUser.experienceLevel || 'beginner',
                    completedAcademyModules: currentUser.completedAcademyModules || [],
                    completedCyberOpsModules: currentUser.completedCyberOpsModules || [],
                    completedCipherModules: currentUser.completedCipherModules || [],
                    quizBestScores: currentUser.quizBestScores || {},
                    date: new Date().toISOString()
                };

                if (idx >= 0) {
                    users[idx] = updatedObj;
                } else {
                    users.push(updatedObj);
                }
                localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(users));
            } catch (e) {
                console.error('Error updating registered users in CyberOps Lab', e);
            }
        }

        if (typeof FirebaseSyncService !== 'undefined' && FirebaseSyncService.isCloudActive()) {
            FirebaseSyncService.syncProgressToCloud(currentUser);
        }
    }

    // --- Performance-Based High-Water Mark Quiz XP Engine ---
    function awardQuizXP(quizId, correctCount, totalQuestions, maxQuizXP, badgeId) {
        if (!currentUser.quizBestScores) currentUser.quizBestScores = {};

        const previousBest = currentUser.quizBestScores[quizId] || 0;
        const xpPerQuestion = maxQuizXP / totalQuestions;
        let gainedXP = 0;
        let isNewHigh = false;

        if (correctCount > previousBest) {
            const previousEarned = Math.round(previousBest * xpPerQuestion);
            const currentEarned = Math.round(correctCount * xpPerQuestion);
            gainedXP = currentEarned - previousEarned;

            currentUser.xp += gainedXP;
            currentUser.quizBestScores[quizId] = correctCount;
            isNewHigh = true;
        }

        if (correctCount > 0) {
            completedModules.add(quizId);
        }

        // Rank upgrades for Level 2
        if (currentUser.xp >= 300) currentUser.rank = 'Security Analyst';
        if (currentUser.xp >= 600) currentUser.rank = 'Threat Hunter';

        // Unlock Badge if provided
        if (badgeId && currentUser.badges) {
            const b = currentUser.badges.find(badge => badge.id === badgeId);
            if (b) b.unlocked = true;
        }

        // Calculate CyberOps Progress % (10% per completed module out of 10)
        const pct = Math.min(100, Math.round((completedModules.size / 10) * 100));
        currentUser.progress.cyberops = pct;

        if (pct >= 100) {
            currentUser.unlocked.cipher = true; // Auto-unlock Level 3 (Cipher Escape) in Main Hub!
        }

        saveUser();
        initUI();
        if (gainedXP > 0) playSound('xpGain');

        return {
            gainedXP,
            previousBest,
            currentCorrect: correctCount,
            totalQuestions,
            isNewHigh,
            totalQuizEarnedXP: (currentUser.quizBestScores[quizId] || 0) * xpPerQuestion
        };
    }

    function awardXP(amount, moduleId, badgeId) {
        let xpGranted = false;

        if (moduleId) {
            if (!completedModules.has(moduleId)) {
                completedModules.add(moduleId);
                currentUser.xp += amount;
                xpGranted = true;
            }
        } else {
            currentUser.xp += amount;
            xpGranted = true;
        }

        // Rank upgrades for Level 2
        if (currentUser.xp >= 300) currentUser.rank = 'Security Analyst';
        if (currentUser.xp >= 600) currentUser.rank = 'Threat Hunter';

        // Unlock Badge if provided
        if (badgeId && currentUser.badges) {
            const b = currentUser.badges.find(badge => badge.id === badgeId);
            if (b) b.unlocked = true;
        }

        // Calculate CyberOps Progress % (10% per completed module out of 10)
        const pct = Math.min(100, Math.round((completedModules.size / 10) * 100));
        currentUser.progress.cyberops = pct;

        if (pct >= 100) {
            currentUser.unlocked.cipher = true; // Auto-unlock Level 3 (Cipher Escape) in Main Hub!
        }

        saveUser();
        initUI();
        if (xpGranted) playSound('xpGain');
        return xpGranted;
    }

    // --- UI Update Engine ---
    function initUI() {
        const nameEl = document.getElementById('soc-user-name');
        const rankEl = document.getElementById('soc-user-rank');
        const xpEl = document.getElementById('soc-user-xp');
        const avatarEl = document.getElementById('soc-user-avatar');

        if (nameEl) nameEl.textContent = currentUser.username || 'Trainee';
        if (rankEl) rankEl.textContent = currentUser.rank || 'Junior Analyst';
        if (xpEl) xpEl.textContent = `${currentUser.xp} XP`;
        if (avatarEl) avatarEl.textContent = (currentUser.username || 'T').charAt(0).toUpperCase();
    }

    // --- Navigation Tabs ---
    function initNavigation() {
        const tabBtns = document.querySelectorAll('.soc-tab-btn');
        const views = document.querySelectorAll('.soc-view');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetView = btn.getAttribute('data-view');

                tabBtns.forEach(b => b.classList.remove('active'));
                views.forEach(v => v.classList.remove('active'));

                btn.classList.add('active');
                const vEl = document.getElementById(`view-${targetView}`);
                if (vEl) vEl.classList.add('active');
                playSound('click');
            });
        });
    }

    function renderModulesView() {
        const container = document.getElementById('soc-modules-container');
        SOCModulesEngine.renderModulesGrid(container, completedModules, currentUser.experienceLevel);
    }

    function initWorkstationView() {
        const appContainer = document.getElementById('workstation-stage-container');
        const appBtns = document.querySelectorAll('.app-tab-btn');

        function loadApp(appKey) {
            if (!appContainer) return;
            appContainer.innerHTML = '';

            if (appKey === 'logs') SOCWorkstationEngine.initLogViewer(appContainer);
            if (appKey === 'hash') SOCWorkstationEngine.initHashChecker(appContainer);
            if (appKey === 'pcap') SOCWorkstationEngine.initPacketInspector(appContainer);
            if (appKey === 'firewall') SOCWorkstationEngine.initFirewallManager(appContainer);
        }

        appBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appKey = e.currentTarget.getAttribute('data-app');
                appBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                loadApp(appKey);
                playSound('click');
            });
        });

        loadApp('logs');
    }

    function initIncidentView() {
        const stage = document.getElementById('incident-stage-container');
        IncidentSimulatorEngine.initIncidentSimulator(stage);
    }

    // --- Modal Handler & Quiz Engine ---
    function initModalEvents() {
        const overlay = document.getElementById('soc-modal');
        const closeBtn = document.getElementById('btn-close-soc-modal');

        if (closeBtn) closeBtn.onclick = hideModal;
        if (overlay) {
            overlay.onclick = (e) => {
                if (e.target === overlay) hideModal();
            };
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') hideModal();
        });
    }

    function hideModal() {
        const overlay = document.getElementById('soc-modal');
        if (overlay) overlay.classList.remove('active');
    }

    function openModuleModal(modId) {
        const mod = CYBEROPS_MODULES.find(m => m.id === modId);
        if (!mod) return;

        const overlay = document.getElementById('soc-modal');
        const content = document.getElementById('soc-modal-content');
        if (!overlay || !content) return;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        let currentQuestionIdx = 0;
        let correctAnswers = 0;

        function renderLessonView() {
            content.innerHTML = `
                <div class="soc-modal-body">
                    <span class="mod-badge-pill" style="margin-bottom:10px; display:inline-block;"><i class="fa-solid ${mod.badgeIcon}"></i> ${mod.badgeName}</span>
                    <h2 class="text-cyan" style="font-family:var(--font-heading); margin-bottom:14px;">${mod.title}</h2>
                    
                    <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:20px;">
                        ${mod.theory.map(t => `
                            <h4 class="text-cyan" style="margin-top:10px;">${t.heading}</h4>
                            <p style="font-size:0.9rem; line-height:1.5; color:var(--text-primary); margin-top:4px;">${t.content}</p>
                        `).join('')}
                    </div>

                    <button class="cyber-btn-cyan" id="btn-start-soc-quiz" style="width:100%; padding:12px;"><i class="fa-solid fa-graduation-cap"></i> KNOWLEDGE QUIZ & INVESTIGATION</button>
                </div>
            `;

            content.querySelector('#btn-start-soc-quiz').onclick = () => renderQuizView();
        }

        function renderQuizView() {
            const q = mod.questions[currentQuestionIdx];
            if (!q) {
                finishModule();
                return;
            }

            content.innerHTML = `
                <div class="soc-modal-body">
                    <span class="text-muted" style="font-size:0.85rem;">QUESTION ${currentQuestionIdx + 1} OF ${mod.questions.length}</span>
                    <h3 style="margin:10px 0 16px 0; color:#fff; font-family:var(--font-heading); font-size:1.1rem;">${q.question}</h3>

                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${q.options.map((opt, idx) => `
                            <button class="soc-opt-btn" data-idx="${idx}" style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); color:#fff; padding:12px 16px; border-radius:8px; text-align:left; cursor:pointer;">${opt}</button>
                        `).join('')}
                    </div>

                    <div id="soc-quiz-explain" style="display:none; margin-top:16px; padding:14px; background:rgba(0,243,255,0.08); border:1px solid var(--cyan); border-radius:8px;"></div>
                </div>
            `;

            const btns = content.querySelectorAll('.soc-opt-btn');
            const exp = content.querySelector('#soc-quiz-explain');

            btns.forEach(btn => {
                btn.onclick = (e) => {
                    const selectedIdx = parseInt(e.target.getAttribute('data-idx'));
                    btns.forEach(b => b.disabled = true);

                    if (selectedIdx === q.correctIndex) {
                        e.target.style.background = 'rgba(0,243,255,0.2)';
                        e.target.style.borderColor = 'var(--cyan)';
                        correctAnswers++;
                        playSound('unlock');
                    } else {
                        e.target.style.background = 'rgba(255,42,109,0.2)';
                        e.target.style.borderColor = 'var(--cyber-danger)';
                        btns[q.correctIndex].style.background = 'rgba(0,243,255,0.2)';
                        playSound('error');
                    }

                    exp.style.display = 'block';
                    exp.innerHTML = `
                        <strong>Explanation:</strong> ${q.explanation}
                        <div style="margin-top:12px; text-align:right;">
                            <button class="cyber-btn-cyan" id="btn-next-soc-q">${currentQuestionIdx < mod.questions.length - 1 ? 'NEXT QUESTION' : 'COMPLETE MODULE'}</button>
                        </div>
                    `;

                    exp.querySelector('#btn-next-soc-q').onclick = () => {
                        currentQuestionIdx++;
                        if (currentQuestionIdx < mod.questions.length) {
                            renderQuizView();
                        } else {
                            finishModule();
                        }
                    };
                };
            });
        }

        function finishModule() {
            const quizRes = awardQuizXP(mod.id, correctAnswers, mod.questions.length, mod.xpReward, mod.badgeId);
            renderModulesView();

            content.innerHTML = `
                <div style="text-align:center; padding:20px 0;">
                    <h2 class="text-cyan" style="font-family:var(--font-heading); margin-bottom:12px;"><i class="fa-solid fa-award"></i> MISSION QUIZ COMPLETED!</h2>
                    <p style="font-size:1.1rem; margin-bottom:10px;">You scored <strong>${correctAnswers} / ${mod.questions.length}</strong> correct answers.</p>
                    ${quizRes.isNewHigh ? `
                        <p class="highlight" style="font-size:1.15rem; margin:14px 0;">+${quizRes.gainedXP} NEW XP Earned! (Best Score: ${quizRes.currentCorrect}/${mod.questions.length} - Total Quiz XP: ${quizRes.totalQuizEarnedXP}/${mod.xpReward} XP)</p>
                    ` : `
                        <p style="color:var(--text-muted); font-size:0.95rem; margin:14px 0;">(Previous Best Score: ${quizRes.previousBest}/${mod.questions.length} — No new XP gained. Beat your high score to earn more XP!)</p>
                    `}
                    <button class="cyber-btn-cyan" id="btn-return-soc-modules" style="margin-top:16px;">RETURN TO MODULES</button>
                </div>
            `;

            content.querySelector('#btn-return-soc-modules').onclick = hideModal;
        }

        renderLessonView();
        overlay.classList.add('active');
    }

    // Audio Synth
    function playSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'click') {
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                osc.start();
                osc.stop(ctx.currentTime + 0.05);
            } else if (type === 'xpGain' || type === 'unlock') {
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            }
        } catch (e) {}
    }

    function switchToModulesTab(modId) {
        const tabBtns = document.querySelectorAll('.soc-tab-btn');
        const views = document.querySelectorAll('.soc-view');

        tabBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));

        const modTab = document.querySelector('.soc-tab-btn[data-view="modules"]');
        const modView = document.getElementById('view-modules');
        if (modTab) modTab.classList.add('active');
        if (modView) modView.classList.add('active');

        if (modId) {
            openModuleModal(modId);
        }
    }

    // Global Bridge Export
    window.CyberOpsApp = {
        awardXP,
        awardQuizXP,
        openModuleModal,
        switchToModulesTab
    };
})();
