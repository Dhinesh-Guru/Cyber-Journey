/* ==========================================================================
   Cyber Academy (Level 1) - Main Application Controller & Bridge Engine
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
                if (!parsed.completedAcademyModules) parsed.completedAcademyModules = [];
                if (!parsed.quizBestScores) parsed.quizBestScores = {};
                return parsed;
            }
        } catch (e) {
            console.error('Error loading user state', e);
        }
        return {
            isLoggedIn: true,
            isRegistered: false,
            username: 'Trainee',
            xp: 0,
            level: 1,
            rank: 'Cyber Trainee',
            experienceLevel: 'beginner',
            progress: { academy: 0, cyberops: 0, cipher: 0 },
            unlocked: { academy: true, cyberops: false, cipher: false },
            badges: [],
            completedAcademyModules: [],
            quizBestScores: {}
        };
    }

    let currentUser = loadUser();
    let completedChapters = new Set(currentUser.completedAcademyModules || []);

    document.addEventListener('DOMContentLoaded', async () => {
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
        renderChaptersView();
        initMiniGamesView();
        initCyberOSView();
    });

    function mergeCloudData(cloudData) {
        if (!cloudData) return;

        const isCloudReset = (cloudData.xp === 0 && (!cloudData.completedAcademyModules || cloudData.completedAcademyModules.length === 0) && (!cloudData.quizBestScores || Object.keys(cloudData.quizBestScores).length === 0));

        if (isCloudReset) {
            currentUser.xp = 0;
            currentUser.level = 1;
            currentUser.rank = 'Cyber Trainee';
            currentUser.progress.academy = 0;
            completedChapters.clear();
            currentUser.completedAcademyModules = [];
            currentUser.quizBestScores = {};
        } else {
            currentUser.xp = Math.max(currentUser.xp || 0, cloudData.xp || 0);
            currentUser.level = Math.floor(currentUser.xp / 50) + 1;
            if (cloudData.rank) currentUser.rank = cloudData.rank;

            if (cloudData.progress) {
                currentUser.progress.academy = Math.max(currentUser.progress.academy || 0, cloudData.progress.academy || 0);
            }

            if (cloudData.completedAcademyModules && Array.isArray(cloudData.completedAcademyModules)) {
                cloudData.completedAcademyModules.forEach(id => completedChapters.add(id));
            }
            currentUser.completedAcademyModules = Array.from(completedChapters);

            const mergedScores = { ...(currentUser.quizBestScores || {}) };
            if (cloudData.quizBestScores) {
                Object.keys(cloudData.quizBestScores).forEach(qId => {
                    mergedScores[qId] = Math.max(mergedScores[qId] || 0, cloudData.quizBestScores[qId] || 0);
                });
            }
            currentUser.quizBestScores = mergedScores;
        }

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        initUI();
        renderChaptersView();
    }

    function saveUser() {
        currentUser.completedAcademyModules = Array.from(completedChapters);
        
        // Calculate Academy Progress % (20% per completed chapter out of 5 main chapters)
        const mainChapterCount = Array.from(completedChapters).filter(id => id !== 'final_exam').length;
        const pct = Math.min(100, Math.round((mainChapterCount / 5) * 100));
        currentUser.progress.academy = pct;
        currentUser.lastUpdated = Date.now();

        if (pct >= 100) {
            currentUser.unlocked.cyberops = true;
        }

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));

        if (currentUser.isRegistered && currentUser.username) {
            try {
                let users = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTERED_USERS) || '[]');
                const idx = users.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
                
                const overallPct = Math.round((currentUser.progress.academy + (currentUser.progress.cyberops || 0) + (currentUser.progress.cipher || 0)) / 3);
                
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
                console.error('Error updating registered users in Cyber Academy', e);
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
            completedChapters.add(quizId);
        }

        currentUser.level = Math.floor(currentUser.xp / 50) + 1;

        // Unlock Badge if provided
        if (badgeId && currentUser.badges) {
            const b = currentUser.badges.find(badge => badge.id === badgeId);
            if (b) b.unlocked = true;
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
            totalQuizEarnedXP: Math.round((currentUser.quizBestScores[quizId] || 0) * xpPerQuestion)
        };
    }

    function awardXP(amount, chapterId, badgeId) {
        let xpGranted = false;

        if (chapterId) {
            if (!completedChapters.has(chapterId)) {
                completedChapters.add(chapterId);
                currentUser.xp += amount;
                xpGranted = true;
            }
        } else {
            // General reward
            currentUser.xp += amount;
            xpGranted = true;
        }

        currentUser.level = Math.floor(currentUser.xp / 50) + 1;

        // Unlock Badge if provided
        if (badgeId && currentUser.badges) {
            const b = currentUser.badges.find(badge => badge.id === badgeId);
            if (b) b.unlocked = true;
        }

        // Calculate Academy Progress % (20% per completed chapter out of 5 main chapters)
        const mainChapterCount = Array.from(completedChapters).filter(id => id !== 'final_exam').length;
        const pct = Math.min(100, Math.round((mainChapterCount / 5) * 100));
        currentUser.progress.academy = pct;

        if (pct >= 100) {
            currentUser.unlocked.cyberops = true; // Auto-unlock Level 2 in Main Hub!
        }

        saveUser();
        initUI();
        if (xpGranted) playSound('xpGain');
        return xpGranted;
    }

    // --- UI Update Engine ---
    function initUI() {
        const nameEl = document.getElementById('user-display-name');
        const rankEl = document.getElementById('user-display-rank');
        const xpEl = document.getElementById('user-display-xp');
        const avatarEl = document.getElementById('user-display-avatar');

        if (nameEl) nameEl.textContent = currentUser.username || 'Trainee';
        if (rankEl) rankEl.textContent = currentUser.rank || 'Cyber Trainee';
        if (xpEl) xpEl.textContent = `${currentUser.xp} XP`;

        if (avatarEl) {
            if (currentUser.avatar) {
                avatarEl.innerHTML = `<img src="${currentUser.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else {
                avatarEl.textContent = (currentUser.username || 'T').charAt(0).toUpperCase();
            }
        }
    }

    // --- Navigation Tabs ---
    function initNavigation() {
        const tabBtns = document.querySelectorAll('.nav-tab-btn');
        const views = document.querySelectorAll('.academy-view');

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

    // --- Chapters Render & Quiz Controller ---
    function renderChaptersView() {
        const container = document.getElementById('chapters-grid-container');
        if (!container) return;

        const mainChapterCount = Array.from(completedChapters).filter(id => id !== 'final_exam').length;
        const isAllCompleted = mainChapterCount >= 5;

        const completionBannerHtml = isAllCompleted ? `
            <div class="cyber-completion-banner" style="background:rgba(0,255,136,0.08); border:1px solid rgba(0,255,136,0.4); border-radius:12px; padding:16px 20px; margin-bottom:24px; display:flex; align-items:center; gap:16px; width:100%; grid-column:1 / -1;">
                <div style="font-size:32px; color:#00ff88;"><i class="fa-solid fa-circle-check"></i></div>
                <div>
                    <h4 style="color:#00ff88; font-family:'Orbitron',sans-serif; font-size:1.05rem; margin-bottom:4px;">🎉 ALL ACADEMY MODULES COMPLETED!</h4>
                    <p style="color:#e5e7eb; font-size:0.9rem; margin:0; line-height:1.5;">Outstanding work! You've mastered all security fundamentals. Ready for extra XP and hands-on practice? Explore the <strong>Mini-Games Arena</strong> to battle security quizzes or launch the <strong>CyberOS Virtual Laptop</strong> to interact with simulated security tools!</p>
                </div>
            </div>
        ` : '';

        const cardsHtml = ACADEMY_LESSONS.map((ch, idx) => {
            const isCompleted = completedChapters.has(ch.id);
            const isUnlocked = idx === 0 || completedChapters.has(ACADEMY_LESSONS[idx - 1]?.id);

            return `
                <div class="chapter-card ${isUnlocked ? '' : 'locked'}">
                    <div class="ch-badge-header">
                        <span class="badge-tag"><i class="fa-solid ${ch.badgeIcon}"></i> ${ch.badgeName}</span>
                        <span class="badge-tag highlight">+${ch.xpReward} XP</span>
                    </div>
                    <h3 class="ch-title">${ch.title}</h3>
                    <p class="ch-desc">${ch.summary}</p>
                    <div class="ch-footer">
                        <span class="status-lbl">${isCompleted ? '<i class="fa-solid fa-circle-check text-emerald"></i> COMPLETED' : (isUnlocked ? 'READY TO START' : '<i class="fa-solid fa-lock text-muted"></i> LOCKED')}</span>
                        <button class="cyber-primary-btn btn-start-chapter" data-id="${ch.id}" ${isUnlocked ? '' : 'disabled'}>
                            ${isCompleted ? 'REVIEW MODULE' : 'START MODULE'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = completionBannerHtml + cardsHtml;

        container.querySelectorAll('.btn-start-chapter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chId = e.currentTarget.getAttribute('data-id');
                openChapterModal(chId);
            });
        });
    }

    function openChapterModal(chapterId) {
        const idx = ACADEMY_LESSONS.findIndex(c => c.id === chapterId);
        if (idx === -1) return;

        const ch = ACADEMY_LESSONS[idx];
        const isPreunlocked = (currentUser.experienceLevel === 'intermediate' || currentUser.experienceLevel === 'advanced');
        const isUnlocked = isPreunlocked || idx === 0 || completedChapters.has(ACADEMY_LESSONS[idx - 1]?.id);

        if (!isUnlocked) {
            playSound('error');
            alert(`🔒 MODULE LOCKED!\n\nYou must complete ${ACADEMY_LESSONS[idx - 1].title} first before opening this module.`);
            return;
        }

        let modal = document.getElementById('academy-chapter-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-overlay active';
            modal.id = 'academy-chapter-modal';
            document.body.appendChild(modal);
        } else {
            modal.classList.add('active');
            modal.style.display = 'flex';
        }

        // Auto-scroll window into view
        window.scrollTo({ top: 0, behavior: 'smooth' });

        function hideModal() {
            if (modal) {
                modal.classList.remove('active');
                modal.style.display = 'none';
            }
        }

        // Global Escape Key & Backdrop Click to Close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                hideModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        modal.onclick = (e) => {
            if (e.target === modal) hideModal();
        };

        let qIndex = 0;
        let correctAnswers = 0;

        function renderLessonContent() {
            modal.innerHTML = `
                <div class="lesson-card-box modal-box-large">
                    <div class="ch-badge-header">
                        <span class="badge-tag"><i class="fa-solid ${ch.badgeIcon}"></i> ${ch.badgeName}</span>
                        <button class="cyber-secondary-btn close-chapter-modal" id="btn-close-modal-top" title="Close Modal">&times;</button>
                    </div>
                    <h2>${ch.title}</h2>
                    <div class="theory-section">
                        ${ch.theory.map(t => `
                            <div class="theory-block">
                                <h4>${t.heading}</h4>
                                <p>${t.content}</p>
                            </div>
                        `).join('')}
                    </div>
                    <button class="cyber-primary-btn full-width" id="btn-start-quiz">TAKE CHAPTER QUIZ (${ch.questions.length} Questions)</button>
                </div>
            `;

            modal.querySelectorAll('.close-chapter-modal').forEach(btn => btn.addEventListener('click', hideModal));
            modal.querySelector('#btn-start-quiz').addEventListener('click', renderQuizQuestion);
        }

        function renderQuizQuestion() {
            const q = ch.questions[qIndex];
            modal.innerHTML = `
                <div class="lesson-card-box modal-box-large">
                    <div class="ch-badge-header">
                        <span class="badge-tag">Question ${qIndex + 1} of ${ch.questions.length}</span>
                        <button class="cyber-secondary-btn close-chapter-modal" id="btn-close-modal-top" title="Close Modal">&times;</button>
                    </div>
                    <div class="mcq-container">
                        <h3 class="mcq-question-text">${q.question}</h3>
                        <div class="mcq-options-grid">
                            ${q.options.map((opt, i) => `
                                <button class="mcq-opt-btn" data-idx="${i}">${opt}</button>
                            `).join('')}
                        </div>
                        <div id="quiz-explain-area" style="display:none;"></div>
                    </div>
                </div>
            `;

            modal.querySelectorAll('.close-chapter-modal').forEach(btn => btn.addEventListener('click', hideModal));

            const optBtns = modal.querySelectorAll('.mcq-opt-btn');
            const explainArea = modal.querySelector('#quiz-explain-area');

            optBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedIdx = parseInt(e.target.getAttribute('data-idx'));
                    optBtns.forEach(b => b.disabled = true);

                    if (selectedIdx === q.correctIndex) {
                        e.target.classList.add('correct');
                        correctAnswers++;
                        playSound('unlock');
                    } else {
                        e.target.classList.add('incorrect');
                        optBtns[q.correctIndex].classList.add('correct');
                        playSound('error');
                    }

                    explainArea.style.display = 'block';
                    explainArea.innerHTML = `
                        <div class="quiz-explanation-box">
                            <strong>Explanation:</strong> ${q.explanation}
                            <div style="margin-top:14px; text-align:right;">
                                <button class="cyber-primary-btn" id="btn-next-q">${qIndex < ch.questions.length - 1 ? 'NEXT QUESTION' : 'COMPLETE CHAPTER'}</button>
                            </div>
                        </div>
                    `;

                    modal.querySelector('#btn-next-q').addEventListener('click', () => {
                        qIndex++;
                        if (qIndex < ch.questions.length) {
                            renderQuizQuestion();
                        } else {
                            finishChapterQuiz();
                        }
                    });
                });
            });
        }

        function finishChapterQuiz() {
            const quizRes = awardQuizXP(ch.id, correctAnswers, ch.questions.length, ch.xpReward, ch.badgeId);
            renderChaptersView();

            modal.innerHTML = `
                <div class="lesson-card-box modal-box-large text-center" style="text-align:center;">
                    <h2 class="text-emerald" style="margin-bottom:12px;"><i class="fa-solid fa-award"></i> CHAPTER QUIZ COMPLETED!</h2>
                    <p style="font-size:1.1rem; margin-bottom:10px;">You scored <strong>${correctAnswers} / ${ch.questions.length}</strong> correct answers.</p>
                    ${quizRes.isNewHigh ? `
                        <p class="highlight" style="font-size:1.15rem; margin:14px 0;">+${quizRes.gainedXP} NEW XP Earned! (Best Score: ${quizRes.currentCorrect}/${ch.questions.length} - Total Quiz XP: ${quizRes.totalQuizEarnedXP}/${ch.xpReward} XP)</p>
                    ` : `
                        <p style="color:var(--text-muted); font-size:0.95rem; margin:14px 0;">(Previous Best Score: ${quizRes.previousBest}/${ch.questions.length} — No new XP gained. Beat your high score to earn more XP!)</p>
                    `}
                    <button class="cyber-primary-btn close-chapter-modal" style="margin-top:20px; padding:12px 28px; width:auto; display:inline-block; white-space:nowrap; font-size:0.95rem;"><i class="fa-solid fa-arrow-left"></i> RETURN TO MODULES</button>
                </div>
            `;
            modal.querySelectorAll('.close-chapter-modal').forEach(btn => btn.addEventListener('click', hideModal));
        }

        renderLessonContent();
    }

    // --- Mini-Games View Controller ---
    function initMiniGamesView() {
        const sel = document.getElementById('select-game-picker');
        const container = document.getElementById('mini-game-stage');

        if (!sel || !container) return;

        function loadGame(gameKey) {
            container.innerHTML = '';
            if (gameKey === 'password') {
                MiniGamesEngine.initPasswordBuilderGame(container);
            } else if (gameKey === 'phishing') {
                MiniGamesEngine.initPhishingInspectorGame(container);
            } else if (gameKey === 'url') {
                MiniGamesEngine.initUrlGuardGame(container);
            } else if (gameKey === 'malware') {
                MiniGamesEngine.initMalwareHunterGame(container);
            } else if (gameKey === 'battle') {
                MiniGamesEngine.initQuizBattleGame(container);
            }
        }

        sel.addEventListener('change', (e) => {
            loadGame(e.target.value);
        });

        loadGame('password');
    }

    // --- CyberOS Virtual Laptop Controller ---
    function initCyberOSView() {
        const container = document.getElementById('cyberos-stage-container');
        if (container) {
            CyberOSEngine.renderDesktop(container);
        }
    }

    // --- Web Audio Synth Sound FX ---
    let audioCtx = null;
    function playSound(type) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'click') {
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'xpGain') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.08);
                osc.frequency.setValueAtTime(783, now + 0.16);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'unlock') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(160, now);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            }
        } catch (e) {}
    }

    // Export global bridge API
    window.AcademyApp = {
        awardXP,
        openChapterModal
    };

})();
