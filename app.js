/* ==========================================================================
   CyberJourney Main Hub - JavaScript Application Logic & Bridge Engine
   ========================================================================== */

(function () {
    'use strict';

    // --- State Storage Keys ---
    const STORAGE_KEY_USER = 'cyberjourney_user_v1';
    const STORAGE_KEY_REGISTERED_USERS = 'cyberjourney_registered_users_v1';
    const STORAGE_KEY_RESET_TOKENS = 'cyberjourney_reset_tokens_v1';

    // --- Ranks Definition ---
    const RANKS = [
        { name: 'Cyber Trainee', minXp: 0, minLevel: 1, badge: 'fa-user' },
        { name: 'Security Student', minXp: 100, minLevel: 5, badge: 'fa-graduation-cap' },
        { name: 'Security Analyst', minXp: 300, minLevel: 10, badge: 'fa-user-ninja' },
        { name: 'Cyber Defender', minXp: 600, minLevel: 20, badge: 'fa-shield-halved' }
    ];

    // --- Default User State ---
    const DEFAULT_USER = {
        isLoggedIn: false,
        isRegistered: false,
        username: 'Guest Agent',
        email: 'guest@cybersphere.local',
        password: '',
        passwordHistory: [],
        avatar: null,
        xp: 0,
        level: 1,
        rank: 'Cyber Trainee',
        experienceLevel: 'beginner',
        progress: {
            academy: 0,   // % progress in Level 1
            cyberops: 0,  // % progress in Level 2
            cipher: 0     // % progress in Level 3
        },
        unlocked: {
            academy: true,
            cyberops: false,
            cipher: false
        },
        badges: [
            { id: 'first_mission', name: 'First Mission', icon: 'fa-flag', unlocked: false, desc: 'Enrolled in CyberJourney' },
            { id: 'pass_guardian', name: 'Password Guardian', icon: 'fa-key', unlocked: false, desc: 'Mastered password security' },
            { id: 'phish_detective', name: 'Phishing Detective', icon: 'fa-fish', unlocked: false, desc: 'Identified malicious emails' },
            { id: 'threat_hunter', name: 'Threat Hunter', icon: 'fa-user-ninja', unlocked: false, desc: 'Completed CyberOps Lab' },
            { id: 'cipher_master', name: 'Cipher Master', icon: 'fa-user-secret', unlocked: false, desc: 'Escaped the cryptographic vault' }
        ]
    };

    let currentUser = loadUser();
    let soundEnabled = true;
    let pendingResetEmail = null;

    // --- Initialization ---
    document.addEventListener('DOMContentLoaded', async () => {
        initMatrixCanvas();
        initAudioEngine();
        updateUI();
        setupEventListeners();

        // Real-Time Cloud Sync on Page Load & Live Sync Listener
        if (currentUser.isLoggedIn && currentUser.isRegistered && typeof FirebaseSyncService !== 'undefined' && FirebaseSyncService.isCloudActive()) {
            try {
                const cloudData = await FirebaseSyncService.fetchCloudProfile(currentUser.username || currentUser.email);
                if (cloudData) {
                    mergeCloudDataIntoLocal(cloudData);
                }
                
                FirebaseSyncService.listenToLiveUserProfile(currentUser.username, (liveData) => {
                    if (liveData) {
                        mergeCloudDataIntoLocal(liveData);
                    }
                });
            } catch (syncErr) {
                console.warn('Initial cloud sync notice:', syncErr);
            }
        }

        // Enforce Signup modal on first load if user is not logged in
        if (!currentUser.isLoggedIn) {
            resetAuthForms();
            const signupTabBtn = document.getElementById('tab-signup-btn');
            if (signupTabBtn) switchAuthTab('signup', signupTabBtn);
            openModal('auth-modal');
        }

        // Check URL query parameters for reset token (e.g. index.html?token=RESET-KEY-4295)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('token')) {
            const tokenVal = urlParams.get('token');
            const tokenInput = document.getElementById('reset-token-input');
            if (tokenInput) tokenInput.value = tokenVal;
            closeModal('auth-modal');
            openModal('reset-link-modal');
        }
    });

    function mergeCloudDataIntoLocal(cloudData) {
        if (!cloudData) return;
        
        const academyPct = (typeof cloudData.progress === 'object' && cloudData.progress) ? (cloudData.progress.academy || 0) : 0;
        const cyberopsPct = (typeof cloudData.progress === 'object' && cloudData.progress) ? (cloudData.progress.cyberops || 0) : 0;
        const cipherPct = (typeof cloudData.progress === 'object' && cloudData.progress) ? (cloudData.progress.cipher || 0) : 0;

        const expLvl = cloudData.experienceLevel || currentUser.experienceLevel || 'beginner';
        const isCyberopsUnlocked = (expLvl === 'intermediate' || expLvl === 'advanced' || (cloudData.xp || 0) >= 300 || academyPct >= 100);
        const isCipherUnlocked = (expLvl === 'advanced' || (cloudData.xp || 0) >= 600 || cyberopsPct >= 100);

        currentUser.xp = Math.max(currentUser.xp || 0, cloudData.xp || 0);
        currentUser.level = Math.max(currentUser.level || 1, Math.floor(currentUser.xp / 50) + 1);
        currentUser.rank = cloudData.rank || calculateRank(currentUser.xp).name;
        currentUser.progress = {
            academy: Math.max(currentUser.progress.academy || 0, academyPct),
            cyberops: Math.max(currentUser.progress.cyberops || 0, cyberopsPct),
            cipher: Math.max(currentUser.progress.cipher || 0, cipherPct)
        };
        currentUser.unlocked = {
            academy: true,
            cyberops: isCyberopsUnlocked || currentUser.unlocked.cyberops,
            cipher: isCipherUnlocked || currentUser.unlocked.cipher
        };

        currentUser.completedAcademyModules = Array.from(new Set([...(currentUser.completedAcademyModules || []), ...(cloudData.completedAcademyModules || [])]));
        currentUser.completedCyberOpsModules = Array.from(new Set([...(currentUser.completedCyberOpsModules || []), ...(cloudData.completedCyberOpsModules || [])]));
        currentUser.completedCipherModules = Array.from(new Set([...(currentUser.completedCipherModules || []), ...(cloudData.completedCipherModules || [])]));
        currentUser.quizBestScores = { ...(currentUser.quizBestScores || {}), ...(cloudData.quizBestScores || {}) };

        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        updateUI();
    }

    // --- Auth Forms Clear Helper ---
    function resetAuthForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const forgotForm = document.getElementById('forgot-form');
        const directResetForm = document.getElementById('direct-reset-form');
        
        if (loginForm) loginForm.reset();
        if (signupForm) signupForm.reset();
        if (forgotForm) forgotForm.reset();
        if (directResetForm) directResetForm.reset();

        const signupSuggBox = document.getElementById('signup-suggestions-box');
        if (signupSuggBox) signupSuggBox.style.display = 'none';

        const profSuggBox = document.getElementById('prof-suggestions-box');
        if (profSuggBox) profSuggBox.style.display = 'none';
    }

    // --- Registered Users Storage ---
    function getRegisteredUsers() {
        try {
            const data = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveRegisteredUser(user) {
        if (!user || !user.username || !user.isRegistered || user.username.startsWith('Guest Agent_') || user.username.startsWith('Guest_')) return;
        let users = getRegisteredUsers();
        const existingIndex = users.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
        
        const academyPct = (typeof user.progress === 'object' && user.progress) ? (user.progress.academy || 0) : (typeof user.progress === 'number' ? user.progress : 0);
        const cyberopsPct = (typeof user.progress === 'object' && user.progress) ? (user.progress.cyberops || 0) : 0;
        const cipherPct = (typeof user.progress === 'object' && user.progress) ? (user.progress.cipher || 0) : 0;
        const overallPct = Math.round((academyPct + cyberopsPct + cipherPct) / 3);

        const userData = {
            username: user.username,
            email: user.email,
            password: user.password,
            passwordHistory: user.passwordHistory || [user.password],
            avatar: user.avatar || null,
            rank: user.rank,
            xp: user.xp,
            progress: { academy: academyPct, cyberops: cyberopsPct, cipher: cipherPct },
            overallCompletion: overallPct,
            unlocked: user.unlocked || { academy: true, cyberops: false, cipher: false },
            experienceLevel: user.experienceLevel || 'beginner',
            completedAcademyModules: user.completedAcademyModules || [],
            completedCyberOpsModules: user.completedCyberOpsModules || [],
            completedCipherModules: user.completedCipherModules || [],
            quizBestScores: user.quizBestScores || {},
            date: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            users[existingIndex] = userData;
        } else {
            users.push(userData);
        }
        localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(users));
    }

    // --- Reset Token Helpers (5-Minute Expiry & Single-Use Enforcement) ---
    const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 Minutes strictly

    // --- Password History Enforcement Helper ---
    function checkPasswordHistoryConstraint(userObj, newPassword) {
        if (!userObj) return null;
        const currentPass = userObj.password || '';
        const history = userObj.passwordHistory || (currentPass ? [currentPass] : []);

        // 1. Block current password
        if (newPassword === currentPass) {
            return 'CURRENT_PASSWORD';
        }

        // 2. Block immediate previous password (the password used immediately before currentPass)
        let immediatePrevPass = null;
        const currIdx = history.lastIndexOf(currentPass);
        if (currIdx > 0) {
            immediatePrevPass = history[currIdx - 1];
        } else if (history.length >= 2) {
            immediatePrevPass = history[history.length - 2];
        }

        if (immediatePrevPass && newPassword === immediatePrevPass) {
            return 'PREVIOUS_PASSWORD';
        }

        return null;
    }

    function saveResetToken(email, username, token) {
        try {
            const tokens = JSON.parse(localStorage.getItem(STORAGE_KEY_RESET_TOKENS) || '{}');
            const cleanToken = token.trim().toUpperCase();
            tokens[cleanToken] = {
                email: email.toLowerCase(),
                username: username,
                token: cleanToken,
                createdAt: Date.now(),
                expiresAt: Date.now() + TOKEN_EXPIRY_MS
            };
            localStorage.setItem(STORAGE_KEY_RESET_TOKENS, JSON.stringify(tokens));
        } catch (e) {
            console.error('Failed to save reset token', e);
        }
    }

    function findResetToken(tokenInput) {
        if (!tokenInput) return null;
        let rawKey = tokenInput.trim().toUpperCase();
        if (rawKey.includes('TOKEN=')) {
            rawKey = rawKey.split('TOKEN=').pop().trim();
        }

        try {
            const tokens = JSON.parse(localStorage.getItem(STORAGE_KEY_RESET_TOKENS) || '{}');
            
            // Direct key match
            if (tokens[rawKey]) {
                const tok = tokens[rawKey];
                if (Date.now() <= tok.expiresAt) return tok;
            }

            // Flexible key match: e.g. "4295" or "RESET-KEY-4295"
            for (let k in tokens) {
                if (k.endsWith(rawKey) || k === `RESET-KEY-${rawKey}`) {
                    const tok = tokens[k];
                    if (Date.now() <= tok.expiresAt) return tok;
                }
            }
        } catch (e) {
            console.error('Failed to find reset token', e);
        }
        return null;
    }

    function consumeResetToken(tokenKey) {
        if (!tokenKey) return;
        try {
            const tokens = JSON.parse(localStorage.getItem(STORAGE_KEY_RESET_TOKENS) || '{}');
            delete tokens[tokenKey.trim().toUpperCase()];
            localStorage.setItem(STORAGE_KEY_RESET_TOKENS, JSON.stringify(tokens));
        } catch (e) {
            console.error('Failed to consume reset token', e);
        }
    }

    // --- Username Uniqueness & Case-Insensitive Check ---
    function isUsernameTaken(name, currentUsername = '') {
        if (!name || name.trim() === '') return false;
        const target = name.trim().toLowerCase();
        
        if (currentUsername && currentUsername.toLowerCase() === target) {
            return false;
        }

        const registered = getRegisteredUsers();
        return registered.some(u => u.username.toLowerCase() === target);
    }

    function generateUsernameSuggestions(baseName) {
        const clean = (baseName || 'user').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'defender';
        const suggestions = [];
        const suffixes = ['10', '07', '99', '_cyber', '_sec', '360'];

        for (let s of suffixes) {
            const candidate = `${clean}${s}`;
            if (!isUsernameTaken(candidate) && !suggestions.includes(candidate)) {
                suggestions.push(candidate);
            }
            if (suggestions.length >= 3) break;
        }

        while (suggestions.length < 3) {
            const rand = Math.floor(10 + Math.random() * 89);
            const candidate = `${clean}${rand}`;
            if (!isUsernameTaken(candidate) && !suggestions.includes(candidate)) {
                suggestions.push(candidate);
            }
        }
        return suggestions;
    }

    function generateUniqueGuestUsername() {
        let guestName = '';
        let attempts = 0;
        do {
            const num = Math.floor(1000 + Math.random() * 8999);
            guestName = `Guest_${num}`;
            attempts++;
        } while (isUsernameTaken(guestName) && attempts < 100);
        return guestName;
    }

    // --- State Persistence ---
    function loadUser() {
        const data = localStorage.getItem(STORAGE_KEY_USER);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                if (typeof parsed.progress !== 'object' || !parsed.progress) {
                    const val = typeof parsed.progress === 'number' ? parsed.progress : 0;
                    parsed.progress = { academy: val, cyberops: 0, cipher: 0 };
                }
                return parsed;
            } catch (e) {
                console.error('Failed to parse user state', e);
            }
        }
        return { ...DEFAULT_USER };
    }

    function saveUser() {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        if (currentUser.isLoggedIn && currentUser.isRegistered) {
            saveRegisteredUser(currentUser);
        }
        updateUI();
    }

    // --- XP & Rank Calculation ---
    function calculateRank(xp) {
        let currentRank = RANKS[0];
        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (xp >= RANKS[i].minXp) {
                currentRank = RANKS[i];
                break;
            }
        }
        return currentRank;
    }

    function addXP(amount) {
        currentUser.xp += amount;
        currentUser.level = Math.floor(currentUser.xp / 50) + 1;
        const rankObj = calculateRank(currentUser.xp);
        currentUser.rank = rankObj.name;
        
        // Auto unlock sectors based on Rank progression
        if (currentUser.xp >= 300) {
            currentUser.unlocked.cyberops = true;
        }
        if (currentUser.xp >= 600) {
            currentUser.unlocked.cyberops = true;
            currentUser.unlocked.cipher = true;
        }

        if (currentUser.xp > 0) {
            const b = currentUser.badges.find(b => b.id === 'first_mission');
            if (b) b.unlocked = true;
        }

        saveUser();
        playSound('xpGain');
        showToast(`<i class="fa-solid fa-bolt highlight"></i> Gained +${amount} XP! Current Rank: ${currentUser.rank}`);
    }

    // --- UI Update Engine ---
    function updateUI() {
        const rankObj = calculateRank(currentUser.xp);
        
        // Quick Stat Bar
        document.getElementById('stat-rank').textContent = currentUser.rank;
        document.getElementById('stat-xp').textContent = `${currentUser.xp} XP`;
        
        const totalProgress = Math.round((currentUser.progress.academy + currentUser.progress.cyberops + currentUser.progress.cipher) / 3);
        document.getElementById('stat-progress').textContent = `${totalProgress}% Completed`;

        // User Widget (Header)
        const widget = document.getElementById('user-widget');
        if (currentUser.isLoggedIn) {
            const avatarContent = currentUser.avatar 
                ? `<img src="${currentUser.avatar}" alt="Avatar">` 
                : currentUser.username.charAt(0).toUpperCase();
            
            widget.innerHTML = `
                <div class="user-profile-pill" id="open-profile-pill">
                    <div class="user-avatar-mini">${avatarContent}</div>
                    <div class="user-info-mini">
                        <span class="user-name-lbl">${currentUser.username}</span>
                        <span class="user-rank-lbl">${currentUser.rank}</span>
                    </div>
                </div>
            `;
            document.getElementById('open-profile-pill').addEventListener('click', () => openModal('profile-modal'));
        } else {
            widget.innerHTML = `
                <button class="auth-trigger-btn" id="open-auth-btn">
                    <i class="fa-solid fa-right-to-bracket"></i> Sign In / Register
                </button>
            `;
            document.getElementById('open-auth-btn').addEventListener('click', () => {
                resetAuthForms();
                openModal('auth-modal');
            });
        }

        // Sector Cards
        document.getElementById('academy-progress-percent').textContent = `${currentUser.progress.academy}%`;
        document.getElementById('academy-progress-bar').style.width = `${currentUser.progress.academy}%`;

        const opsCard = document.getElementById('mode-cyberops-card');
        const opsStatus = document.getElementById('cyberops-status');
        const opsBtnText = document.getElementById('cyberops-btn-text');
        const opsBtnIcon = document.getElementById('cyberops-btn-icon');
        
        document.getElementById('cyberops-progress-percent').textContent = `${currentUser.progress.cyberops}%`;
        document.getElementById('cyberops-progress-bar').style.width = `${currentUser.progress.cyberops}%`;

        if (currentUser.unlocked.cyberops) {
            opsCard.classList.remove('locked');
            opsStatus.className = 'status-indicator unlocked';
            opsStatus.innerHTML = '<i class="fa-solid fa-lock-open"></i> UNLOCKED';
            opsBtnText.textContent = 'LAUNCH CYBEROPS';
            opsBtnIcon.className = 'fa-solid fa-arrow-right';
        } else {
            opsCard.classList.add('locked');
            opsStatus.className = 'status-indicator';
            opsStatus.innerHTML = '<i class="fa-solid fa-lock"></i> LOCKED';
            opsBtnText.textContent = 'REQUIRES ACADEMY';
            opsBtnIcon.className = 'fa-solid fa-lock';
        }

        const cipherCard = document.getElementById('mode-cipher-card');
        const cipherStatus = document.getElementById('cipher-status');
        const cipherBtnText = document.getElementById('cipher-btn-text');
        const cipherBtnIcon = document.getElementById('cipher-btn-icon');

        document.getElementById('cipher-progress-percent').textContent = `${currentUser.progress.cipher}%`;
        document.getElementById('cipher-progress-bar').style.width = `${currentUser.progress.cipher}%`;

        if (currentUser.unlocked.cipher) {
            cipherCard.classList.remove('locked');
            cipherStatus.className = 'status-indicator unlocked';
            cipherStatus.innerHTML = '<i class="fa-solid fa-lock-open"></i> UNLOCKED';
            cipherBtnText.textContent = 'LAUNCH CIPHER ESCAPE';
            cipherBtnIcon.className = 'fa-solid fa-arrow-right';
        } else {
            cipherCard.classList.add('locked');
            cipherStatus.className = 'status-indicator';
            cipherStatus.innerHTML = '<i class="fa-solid fa-lock"></i> LOCKED';
            cipherBtnText.textContent = 'REQUIRES CYBEROPS';
            cipherBtnIcon.className = 'fa-solid fa-lock';
        }

        // Profile Modal Updates
        document.getElementById('prof-username').textContent = currentUser.username;
        document.getElementById('prof-rank').textContent = currentUser.rank;
        document.getElementById('prof-level-num').textContent = currentUser.level;
        document.getElementById('prof-xp-val').textContent = currentUser.xp;
        
        const avatarImgEl = document.getElementById('profile-avatar-img');
        if (avatarImgEl) {
            if (currentUser.avatar) {
                avatarImgEl.innerHTML = `<img src="${currentUser.avatar}" alt="Profile Picture">`;
            } else {
                avatarImgEl.innerHTML = `<i class="fa-solid fa-user-shield"></i>`;
            }
        }

        // Guest Notice & Upload restrictions
        const guestNotice = document.getElementById('prof-guest-notice');
        const removeAvatarBtn = document.getElementById('avatar-remove-btn');

        if (removeAvatarBtn) {
            removeAvatarBtn.style.display = (currentUser.avatar && currentUser.isRegistered) ? 'flex' : 'none';
        }
        
        if (guestNotice) {
            if (!currentUser.isRegistered) {
                guestNotice.style.display = 'inline-block';
            } else {
                guestNotice.style.display = 'none';
            }
        }

        if (document.getElementById('prof-username-input')) {
            document.getElementById('prof-username-input').value = currentUser.username;
        }

        // Calculate next rank target
        let nextTarget = 'MAX RANK (Cyber Defender)';
        let targetXP = currentUser.xp;
        for (let r of RANKS) {
            if (currentUser.xp < r.minXp) {
                nextTarget = `${r.name} (${r.minXp} XP)`;
                targetXP = r.minXp;
                break;
            }
        }
        document.getElementById('prof-next-rank').textContent = nextTarget;
        
        const xpProgressRatio = Math.min(100, Math.round((currentUser.xp / Math.max(1, targetXP)) * 100));
        document.getElementById('prof-xp-bar').style.width = `${xpProgressRatio}%`;

        // Render Badges
        const badgeContainer = document.getElementById('badges-container');
        if (badgeContainer) {
            badgeContainer.innerHTML = currentUser.badges.map(b => `
                <div class="badge-item ${b.unlocked ? 'unlocked' : ''}" title="${b.desc}">
                    <i class="fa-solid ${b.icon} badge-icon"></i>
                    <span class="badge-name">${b.name}</span>
                </div>
            `).join('');
        }

        // Highlight active clearance button
        document.querySelectorAll('.clearance-btn').forEach(btn => {
            const btnLevel = btn.getAttribute('data-clearance');
            if (currentUser.experienceLevel === btnLevel) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Clearance Level Switcher & Rank Sync ---
    function setExperienceClearance(clearanceLevel, silent = false) {
        currentUser.experienceLevel = clearanceLevel;
        if (clearanceLevel === 'beginner') {
            currentUser.unlocked.academy = true;
            currentUser.unlocked.cyberops = false;
            currentUser.unlocked.cipher = false;
        } else if (clearanceLevel === 'intermediate') {
            currentUser.unlocked.academy = true;
            currentUser.unlocked.cyberops = true;
            currentUser.unlocked.cipher = false;
            if (currentUser.xp < 300) currentUser.xp = 300; // Base 300 XP for Intermediate (Security Analyst)
        } else if (clearanceLevel === 'advanced') {
            currentUser.unlocked.academy = true;
            currentUser.unlocked.cyberops = true;
            currentUser.unlocked.cipher = true;
            if (currentUser.xp < 600) currentUser.xp = 600; // Base 600 XP for Advanced (Cyber Defender)
        }

        currentUser.level = Math.floor(currentUser.xp / 50) + 1;
        const rankObj = calculateRank(currentUser.xp);
        currentUser.rank = rankObj.name;

        saveUser();
        if (!silent) {
            playSound('unlock');
            showToast(`<i class="fa-solid fa-sliders highlight"></i> Clearance updated to ${clearanceLevel.toUpperCase()} (Rank: ${currentUser.rank})`);
        }
    }

    // --- Mode Redirect Handler ---
    function launchMode(modeKey) {
        playSound('launch');
        let targetPath = '';
        if (modeKey === 'academy') {
            targetPath = './Cyber Academy/index.html';
        } else if (modeKey === 'cyberops') {
            if (!currentUser.unlocked.cyberops) {
                showToast('<i class="fa-solid fa-lock text-danger"></i> Complete Cyber Academy first to unlock CyberOps Lab!');
                playSound('error');
                return;
            }
            targetPath = './CyberOps Lab/index.html';
        } else if (modeKey === 'cipher') {
            if (!currentUser.unlocked.cipher) {
                showToast('<i class="fa-solid fa-lock text-danger"></i> Complete CyberOps Lab first to unlock Cipher Escape!');
                playSound('error');
                return;
            }
            targetPath = './Cipher Escape/index.html';
        }

        showToast(`<i class="fa-solid fa-satellite-dish highlight"></i> Navigating to ${modeKey.toUpperCase()}...`);
        setTimeout(() => {
            window.location.href = targetPath;
        }, 600);
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Sector Mode Launch Buttons
        document.getElementById('launch-academy-btn').addEventListener('click', () => launchMode('academy'));
        document.getElementById('launch-cyberops-btn').addEventListener('click', () => launchMode('cyberops'));
        document.getElementById('launch-cipher-btn').addEventListener('click', () => launchMode('cipher'));

        // Nav Buttons
        document.getElementById('nav-hub-btn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        document.getElementById('nav-leaderboard-btn').addEventListener('click', () => {
            renderLeaderboard();
            openModal('leaderboard-modal');
        });
        document.getElementById('nav-roadmap-btn').addEventListener('click', () => openModal('roadmap-modal'));

        // Sound Toggle
        document.getElementById('sound-toggle-btn').addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const icon = document.getElementById('sound-icon');
            icon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
            showToast(soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted');
        });

        // Auth Tab Buttons & Switch Prompts
        document.getElementById('tab-login-btn').addEventListener('click', (e) => {
            resetAuthForms();
            switchAuthTab('login', e.target);
        });
        document.getElementById('tab-signup-btn').addEventListener('click', (e) => {
            resetAuthForms();
            switchAuthTab('signup', e.target);
        });
        document.getElementById('switch-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            resetAuthForms();
            switchAuthTab('signup', document.getElementById('tab-signup-btn'));
        });
        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            resetAuthForms();
            switchAuthTab('login', document.getElementById('tab-login-btn'));
        });
        document.getElementById('link-forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            resetAuthForms();
            switchAuthTab('forgot', null);
        });
        document.getElementById('forgot-back-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            resetAuthForms();
            switchAuthTab('login', document.getElementById('tab-login-btn'));
        });

        // --- Live Username Uniqueness & Suggestion Checking on Signup ---
        const signupUsernameInput = document.getElementById('signup-username');
        const signupSuggBox = document.getElementById('signup-suggestions-box');
        const signupSuggChips = document.getElementById('signup-suggestions-chips');

        signupUsernameInput.addEventListener('input', () => {
            const name = signupUsernameInput.value.trim();
            if (isUsernameTaken(name)) {
                const suggestions = generateUsernameSuggestions(name);
                signupSuggChips.innerHTML = suggestions.map(s => `
                    <button type="button" class="chip-suggestion" data-name="${s}">${s}</button>
                `).join('');
                signupSuggBox.style.display = 'block';

                signupSuggChips.querySelectorAll('.chip-suggestion').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        signupUsernameInput.value = e.target.getAttribute('data-name');
                        signupSuggBox.style.display = 'none';
                    });
                });
            } else {
                signupSuggBox.style.display = 'none';
            }
        });

        // --- Multi-Device Cloud & Local Login Handler ---
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = document.getElementById('login-username').value.trim();
            const pass = document.getElementById('login-password').value.trim();
            
            const registered = getRegisteredUsers();
            let foundUser = registered.find(u => 
                (u.username.toLowerCase() === identifier.toLowerCase() || (u.email && u.email.toLowerCase() === identifier.toLowerCase()))
            );

            // If not found locally or password mismatch, attempt Firebase Cloud Login fallback
            if ((!foundUser || (foundUser.password && foundUser.password !== pass)) && typeof FirebaseSyncService !== 'undefined' && FirebaseSyncService.isCloudActive()) {
                try {
                    const cloudUser = await FirebaseSyncService.signInWithCloud(identifier, pass);
                    if (cloudUser) {
                        foundUser = cloudUser;
                    }
                } catch (err) {
                    console.warn('Cloud login fallback attempt failed:', err);
                }
            }

            // Generic security error response: Do not reveal if username or password caused failure!
            if (!foundUser || (foundUser.password && foundUser.password !== pass)) {
                showToast('<i class="fa-solid fa-circle-xmark text-danger"></i> Invalid username or password.');
                playSound('error');
                return;
            }

            // Restore user state on successful authentication
            const academyPct = (typeof foundUser.progress === 'object' && foundUser.progress) ? (foundUser.progress.academy || 0) : (typeof foundUser.progress === 'number' ? foundUser.progress : 0);
            const cyberopsPct = (typeof foundUser.progress === 'object' && foundUser.progress) ? (foundUser.progress.cyberops || 0) : 0;
            const cipherPct = (typeof foundUser.progress === 'object' && foundUser.progress) ? (foundUser.progress.cipher || 0) : 0;

            const expLvl = foundUser.experienceLevel || 'beginner';
            const isCyberopsUnlocked = (expLvl === 'intermediate' || expLvl === 'advanced' || (foundUser.xp || 0) >= 300 || academyPct >= 100);
            const isCipherUnlocked = (expLvl === 'advanced' || (foundUser.xp || 0) >= 600 || cyberopsPct >= 100);

            currentUser = {
                ...JSON.parse(JSON.stringify(DEFAULT_USER)),
                isLoggedIn: true,
                isRegistered: true,
                username: foundUser.username,
                email: foundUser.email,
                password: foundUser.password || pass,
                passwordHistory: foundUser.passwordHistory || [foundUser.password || pass],
                avatar: foundUser.avatar || null,
                xp: foundUser.xp || 0,
                rank: foundUser.rank || 'Cyber Trainee',
                level: Math.floor((foundUser.xp || 0) / 50) + 1,
                experienceLevel: expLvl,
                progress: { academy: academyPct, cyberops: cyberopsPct, cipher: cipherPct },
                unlocked: { academy: true, cyberops: isCyberopsUnlocked, cipher: isCipherUnlocked },
                completedAcademyModules: foundUser.completedAcademyModules || [],
                completedCyberOpsModules: foundUser.completedCyberOpsModules || [],
                completedCipherModules: foundUser.completedCipherModules || [],
                quizBestScores: foundUser.quizBestScores || {}
            };

            if (currentUser.xp >= 300) currentUser.unlocked.cyberops = true;
            if (currentUser.xp >= 600) currentUser.unlocked.cipher = true;

            resetAuthForms();
            saveUser();
            closeModal('auth-modal');
            playSound('login');
            showToast(`<i class="fa-solid fa-circle-check highlight"></i> Welcome back, ${currentUser.username}!`);
        });

        // --- Signup Form Submission ---
        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const selectedExpInput = document.querySelector('input[name="signup-exp"]:checked');
            const expLevel = selectedExpInput ? selectedExpInput.value : 'beginner';

            if (isUsernameTaken(username)) {
                showToast(`<i class="fa-solid fa-triangle-exclamation text-amber"></i> Username '${username}' is taken! Select one of the suggestions.`);
                playSound('error');
                return;
            }

            currentUser = {
                ...DEFAULT_USER,
                isLoggedIn: true,
                isRegistered: true,
                username: username,
                email: email,
                password: password,
                passwordHistory: [password],
                avatar: null,
                xp: 0,
                rank: 'Cyber Trainee'
            };

            setExperienceClearance(expLevel, true);
            addXP(50); // Bonus registration XP

            // Sync account creation to Firebase Cloud
            if (typeof FirebaseSyncService !== 'undefined' && FirebaseSyncService.isCloudActive()) {
                try {
                    await FirebaseSyncService.signUpWithCloud(email, password, username);
                } catch (cloudErr) {
                    console.warn('Firebase Cloud signup notice:', cloudErr);
                }
            }

            resetAuthForms();
            saveUser();
            closeModal('auth-modal');
            playSound('login');
            showToast(`<i class="fa-solid fa-user-plus highlight"></i> Welcome ${username}! Account registered.`);
        });

        // --- Password Reset Key Link Generator ---
        document.getElementById('forgot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            const registered = getRegisteredUsers();
            const found = registered.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

            if (found) {
                const token = 'RESET-KEY-' + Math.floor(1000 + Math.random() * 8999);
                const url = `http://localhost:8080/index.html?token=${token}`;
                
                // Save token to system storage
                saveResetToken(found.email, found.username, token);

                // Print reset link directly to CMD / Server Console ONLY
                console.log('\n==================================================================');
                console.log(' [CYBERJOURNEY DISPATCH] PASSWORD RESET MAIL SENT TO SYSTEM CMD ');
                console.log('==================================================================');
                console.log(` RECIPIENT  : ${found.email} (User: ${found.username})`);
                console.log(` TOKEN KEY  : ${token}`);
                console.log(` RESET LINK : ${url}`);
                console.log(' STATUS     : DISPATCHED TO CMD LOG CONSOLE SUCCESSFULLY');
                console.log('==================================================================\n');

                closeModal('auth-modal');
                openModal('reset-link-modal');
                playSound('unlock');
                showToast('<i class="fa-solid fa-terminal highlight"></i> Reset link sent to CMD! Copy your RESET-KEY from CMD log console.');
            } else {
                showToast('<i class="fa-solid fa-circle-xmark text-danger"></i> No registered user found with that email address.');
                playSound('error');
            }
        });

        // Link for users who already have a token
        const haveTokenBtn = document.getElementById('link-have-token');
        if (haveTokenBtn) {
            haveTokenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal('auth-modal');
                openModal('reset-link-modal');
            });
        }

        // Direct Password Reset Form inside Token Verification Modal
        const directResetForm = document.getElementById('direct-reset-form');
        if (directResetForm) {
            directResetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const tokenInput = document.getElementById('reset-token-input').value.trim();
                const newPass = document.getElementById('reset-new-password').value.trim();
                const confirmPass = document.getElementById('reset-confirm-password').value.trim();

                if (newPass !== confirmPass) {
                    showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> Passwords do not match!');
                    playSound('error');
                    return;
                }

                if (newPass.length < 6) {
                    showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> Password must be at least 6 characters.');
                    playSound('error');
                    return;
                }

                // Verify token WITHOUT deleting it prior to password validation checks
                const tokenObj = findResetToken(tokenInput);
                if (!tokenObj) {
                    showToast('<i class="fa-solid fa-circle-xmark text-danger"></i> Invalid or expired Reset Token Key! Check your CMD log console.');
                    playSound('error');
                    return;
                }

                let users = getRegisteredUsers();
                const idx = users.findIndex(u => u.email && u.email.toLowerCase() === tokenObj.email.toLowerCase());
                if (idx >= 0) {
                    const targetUser = users[idx];
                    
                    // Enforce password history constraint (cannot reuse current OR any previous password)
                    const historyError = checkPasswordHistoryConstraint(targetUser, newPass);
                    if (historyError === 'CURRENT_PASSWORD') {
                        showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> Security Violation: New password cannot be your current password!');
                        playSound('error');
                        return;
                    } else if (historyError === 'PREVIOUS_PASSWORD') {
                        showToast('<i class="fa-solid fa-shield-cat text-danger"></i> Security Violation: You cannot reuse any of your previous passwords!');
                        playSound('error');
                        return;
                    }

                    // Password update successful -> Now consume token
                    consumeResetToken(tokenObj.token);

                    if (!targetUser.passwordHistory) targetUser.passwordHistory = [targetUser.password];
                    targetUser.passwordHistory.push(newPass);
                    targetUser.password = newPass;

                    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(users));

                    if (currentUser.isLoggedIn && currentUser.email && currentUser.email.toLowerCase() === targetUser.email.toLowerCase()) {
                        currentUser.password = newPass;
                        currentUser.passwordHistory = targetUser.passwordHistory;
                        saveUser();
                    }

                    closeModal('reset-link-modal');
                    resetAuthForms();
                    switchAuthTab('login', document.getElementById('tab-login-btn'));
                    openModal('auth-modal');
                    playSound('unlock');
                    showToast('<i class="fa-solid fa-circle-check highlight"></i> Password reset successful! Please sign in with your new password.');
                } else {
                    showToast('<i class="fa-solid fa-circle-xmark text-danger"></i> Associated user account no longer exists.');
                    playSound('error');
                }
            });
        }

        // --- Guest Warning Trigger Buttons ---
        document.querySelectorAll('.guest-trigger-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                closeModal('auth-modal');
                openModal('guest-warning-modal');
            });
        });

        document.getElementById('confirm-guest-btn').addEventListener('click', () => {
            const guestName = generateUniqueGuestUsername();
            currentUser = {
                ...DEFAULT_USER,
                isLoggedIn: true,
                isRegistered: false,
                username: guestName
            };
            resetAuthForms();
            saveUser();
            closeModal('guest-warning-modal');
            playSound('login');
            showToast(`<i class="fa-solid fa-user-secret highlight"></i> Connected as ${guestName} (Guest Mode)`);
        });

        document.getElementById('cancel-guest-btn').addEventListener('click', () => {
            closeModal('guest-warning-modal');
            switchAuthTab('signup', document.getElementById('tab-signup-btn'));
            openModal('auth-modal');
        });

        // --- Profile Avatar Upload & Remove Handlers ---
        const avatarFileInput = document.getElementById('avatar-file-input');
        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', (e) => {
                if (!currentUser.isRegistered) {
                    showToast('<i class="fa-solid fa-lock text-danger"></i> Profile picture upload is only available for registered accounts!');
                    playSound('error');
                    avatarFileInput.value = '';
                    return;
                }

                const file = e.target.files[0];
                if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                        showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> File too large! Max 2MB allowed.');
                        playSound('error');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        currentUser.avatar = evt.target.result;
                        saveUser();
                        playSound('unlock');
                        showToast('<i class="fa-solid fa-camera highlight"></i> Profile picture updated!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        const avatarRemoveBtn = document.getElementById('avatar-remove-btn');
        if (avatarRemoveBtn) {
            avatarRemoveBtn.addEventListener('click', () => {
                currentUser.avatar = null;
                saveUser();
                playSound('click');
                showToast('<i class="fa-solid fa-trash-can highlight"></i> Profile picture removed.');
            });
        }

        // --- Profile Username Update Form ---
        const profUserForm = document.getElementById('profile-username-form');
        const profUserInput = document.getElementById('prof-username-input');
        const profSuggBox = document.getElementById('prof-suggestions-box');
        const profSuggChips = document.getElementById('prof-suggestions-chips');

        if (profUserForm) {
            profUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newName = profUserInput.value.trim();
                
                if (isUsernameTaken(newName, currentUser.username)) {
                    showToast(`<i class="fa-solid fa-triangle-exclamation text-amber"></i> Username '${newName}' is taken!`);
                    playSound('error');

                    const suggestions = generateUsernameSuggestions(newName);
                    profSuggChips.innerHTML = suggestions.map(s => `
                        <button type="button" class="chip-suggestion" data-name="${s}">${s}</button>
                    `).join('');
                    profSuggBox.style.display = 'block';

                    profSuggChips.querySelectorAll('.chip-suggestion').forEach(btn => {
                        btn.addEventListener('click', (evt) => {
                            profUserInput.value = evt.target.getAttribute('data-name');
                            profSuggBox.style.display = 'none';
                        });
                    });
                    return;
                }

                currentUser.username = newName;
                saveUser();
                profSuggBox.style.display = 'none';
                playSound('unlock');
                showToast(`<i class="fa-solid fa-circle-check highlight"></i> Username updated to ${newName}!`);
            });
        }

        // --- Profile Password Change Form (With History Check) ---
        const profPassForm = document.getElementById('profile-password-form');
        if (profPassForm) {
            profPassForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const currPass = document.getElementById('prof-curr-password').value.trim();
                const newPass = document.getElementById('prof-new-password').value.trim();
                const confirmPass = document.getElementById('prof-confirm-password').value.trim();

                if (currPass !== currentUser.password) {
                    showToast('<i class="fa-solid fa-key text-danger"></i> Current password is incorrect!');
                    playSound('error');
                    return;
                }

                if (newPass !== confirmPass) {
                    showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> New passwords do not match!');
                    playSound('error');
                    return;
                }

                if (newPass.length < 6) {
                    showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> New password must be at least 6 characters!');
                    playSound('error');
                    return;
                }

                // Password History Constraint Enforcement: Cannot use current or any previous password!
                const historyError = checkPasswordHistoryConstraint(currentUser, newPass);
                if (historyError === 'CURRENT_PASSWORD') {
                    showToast('<i class="fa-solid fa-triangle-exclamation text-amber"></i> Security Violation: New password cannot be your current password!');
                    playSound('error');
                    return;
                } else if (historyError === 'PREVIOUS_PASSWORD') {
                    showToast('<i class="fa-solid fa-shield-cat text-danger"></i> Security Violation: You cannot reuse any of your previous passwords!');
                    playSound('error');
                    return;
                }

                // Update password & history
                if (!currentUser.passwordHistory) currentUser.passwordHistory = [currentUser.password];
                currentUser.passwordHistory.push(newPass);
                currentUser.password = newPass;

                saveUser();
                profPassForm.reset();
                playSound('unlock');
                showToast('<i class="fa-solid fa-shield-halved highlight"></i> Password changed successfully!');
            });
        }

        // --- Clearance Adjustment with Confirmation Modal ---
        let pendingClearanceLevel = null;
        document.querySelectorAll('.clearance-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('.clearance-btn');
                if (targetBtn) {
                    const level = targetBtn.getAttribute('data-clearance');
                    if (level === currentUser.experienceLevel) return;

                    pendingClearanceLevel = level;
                    const confirmTextEl = document.getElementById('clearance-confirm-text');
                    if (confirmTextEl) {
                        confirmTextEl.innerHTML = `Are you sure you want to switch your clearance level to <strong>${level.toUpperCase()}</strong>?`;
                    }
                    openModal('clearance-confirm-modal');
                }
            });
        });

        const confirmClearanceBtn = document.getElementById('confirm-clearance-change-btn');
        if (confirmClearanceBtn) {
            confirmClearanceBtn.addEventListener('click', () => {
                if (pendingClearanceLevel) {
                    setExperienceClearance(pendingClearanceLevel);
                    pendingClearanceLevel = null;
                }
                closeModal('clearance-confirm-modal');
            });
        }

        const cancelClearanceBtn = document.getElementById('cancel-clearance-change-btn');
        if (cancelClearanceBtn) {
            cancelClearanceBtn.addEventListener('click', () => {
                pendingClearanceLevel = null;
                closeModal('clearance-confirm-modal');
            });
        }

        // --- Reset Profile Handler with Warning Modal ---
        const resetProfileBtn = document.getElementById('reset-profile-btn');
        if (resetProfileBtn) {
            resetProfileBtn.addEventListener('click', () => {
                openModal('reset-profile-modal');
            });
        }

        const confirmResetProfileBtn = document.getElementById('confirm-reset-profile-btn');
        if (confirmResetProfileBtn) {
            confirmResetProfileBtn.addEventListener('click', () => {
                // Reset all progress, scores, & XP to 0 Trainee while preserving clearance level
                currentUser.xp = 0;
                currentUser.level = 1;
                currentUser.rank = 'Cyber Trainee';
                currentUser.progress = { academy: 0, cyberops: 0, cipher: 0 };
                currentUser.completedAcademyModules = [];
                currentUser.completedCyberOpsModules = [];
                currentUser.completedCipherModules = [];
                currentUser.quizBestScores = {};
                if (currentUser.badges) currentUser.badges.forEach(b => b.unlocked = false);

                saveUser();
                updateUI();
                closeModal('reset-profile-modal');
                playSound('error');
                showToast('<i class="fa-solid fa-rotate-left highlight"></i> Profile reset! You can now re-complete modules to earn XP again.');
            });
        }

        const cancelResetProfileBtn = document.getElementById('cancel-reset-profile-btn');
        if (cancelResetProfileBtn) {
            cancelResetProfileBtn.addEventListener('click', () => {
                closeModal('reset-profile-modal');
            });
        }

        // Logout Button Handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                currentUser = { ...DEFAULT_USER };
                localStorage.removeItem(STORAGE_KEY_USER);
                resetAuthForms();
                updateUI();
                closeModal('profile-modal');
                switchAuthTab('signup', document.getElementById('tab-signup-btn'));
                openModal('auth-modal');
                playSound('click');
                showToast('<i class="fa-solid fa-right-from-bracket"></i> Logged out successfully.');
            });
        }

        // Modal Close Buttons
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) closeModal(modal.id);
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal.id);
            });
        });
    }

    // --- Modal Management ---
    function openModal(id) {
        playSound('click');
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
    }

    function closeModal(id) {
        playSound('click');
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    }

    function switchAuthTab(tab, btnElement) {
        playSound('click');
        document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');

        const tabsBar = document.getElementById('auth-tabs-bar');
        if (tabsBar) {
            tabsBar.style.display = (tab === 'forgot') ? 'none' : 'flex';
        }

        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        if (tab === 'login') {
            document.getElementById('login-form').classList.add('active');
        } else if (tab === 'signup') {
            document.getElementById('signup-form').classList.add('active');
        } else if (tab === 'forgot') {
            document.getElementById('forgot-form').classList.add('active');
        }
    }

    // --- Leaderboard Engine (Strictly Registered Users Only) ---
    function renderLeaderboard() {
        let users = getRegisteredUsers();
        
        // Filter out guests so only registered users appear in leaderboard
        users = users.filter(u => u.username && !u.username.startsWith('Guest_') && !u.username.startsWith('Guest Agent_'));

        // Sort users by XP descending
        users.sort((a, b) => b.xp - a.xp);

        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">
                        <i class="fa-solid fa-user-slash" style="font-size:24px; margin-bottom:8px; display:block;"></i>
                        No registered users yet. Register an account to claim #1 spot!
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map((u, i) => {
            const isUser = currentUser.isLoggedIn && currentUser.isRegistered && u.username.toLowerCase() === currentUser.username.toLowerCase();
            const completionPct = (typeof u.overallCompletion === 'number') ? u.overallCompletion : (
                typeof u.progress === 'object' && u.progress ? Math.round(((u.progress.academy || 0) + (u.progress.cyberops || 0) + (u.progress.cipher || 0)) / 3) : (typeof u.progress === 'number' ? u.progress : 0)
            );
            return `
                <tr class="${isUser ? 'user-row' : ''}">
                    <td>#${i + 1}</td>
                    <td><strong>${u.username}${isUser ? ' (YOU)' : ''}</strong></td>
                    <td><span class="badge-level ${u.rank.includes('Defender') ? 'advanced-badge' : 'intermediate-badge'}">${u.rank}</span></td>
                    <td>${completionPct}%</td>
                    <td><strong class="highlight">${u.xp} XP</strong></td>
                </tr>
            `;
        }).join('');
    }

    // --- Toast Engine ---
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'cyber-toast';
        toast.innerHTML = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // --- Web Audio API Synth Sound Effects ---
    let audioCtx = null;
    function initAudioEngine() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    function playSound(type) {
        if (!soundEnabled || !audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'launch') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'xpGain') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'unlock') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'login') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    }

    // --- Interactive Canvas Matrix Particle Grid ---
    function initMatrixCanvas() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Particle nodes
        const nodes = [];
        const NODE_COUNT = Math.floor((width * height) / 22000);

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Draw particles & connecting lines
            ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();
    }

})();
