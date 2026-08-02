/* ==========================================================================
   CyberJourney - Supabase Real-Time Cloud Sync & Configuration Manager
   ========================================================================== */

const SUPABASE_CONFIG = {
    url: "https://wsztjvpiyumzvtpqowlx.supabase.co",
    key: "sb_publishable_1FQr9dIQvk6nQRwxMvewVQ_ERxXCMEW"
};

const FirebaseSyncService = (function () {
    'use strict';

    let client = null;
    let isCloudActive = false;
    let activeChannel = null;

    function init() {
        if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.key) {
            try {
                client = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
                isCloudActive = true;
                console.log('⚡ Supabase Real-Time Cloud Sync Active!');
            } catch (e) {
                console.warn('Supabase initialization notice:', e);
            }
        }
    }

    async function fetchCloudProfile(usernameOrEmail) {
        if (!isCloudActive || !usernameOrEmail || !client) return null;
        try {
            const searchKey = usernameOrEmail.trim().toLowerCase();
            const { data, error } = await client
                .from('users')
                .select('*')
                .or(`username.ilike.${searchKey},email.ilike.${searchKey}`)
                .maybeSingle();

            if (error) {
                // Try profiles table fallback
                const { data: pData } = await client
                    .from('profiles')
                    .select('*')
                    .or(`username.ilike.${searchKey},email.ilike.${searchKey}`)
                    .maybeSingle();
                if (pData) return mapCloudToLocal(pData);
                return null;
            }

            return data ? mapCloudToLocal(data) : null;
        } catch (e) {
            console.warn('Error fetching cloud profile:', e);
            return null;
        }
    }

    async function signUpWithCloud(email, password, username, userData = {}) {
        if (!isCloudActive || !username || !client) return null;
        try {
            const userKey = username.trim();
            const emailVal = email || '';

            const payload = {
                username: userKey,
                email: emailVal,
                password: password || '',
                xp: userData.xp || 50,
                level: userData.level || 1,
                rank: userData.rank || 'Cyber Trainee',
                experience_level: userData.experienceLevel || 'beginner',
                progress: userData.progress || { academy: 0, cyberops: 0, cipher: 0 },
                unlocked: userData.unlocked || { academy: true, cyberops: false, cipher: false },
                completed_academy_modules: userData.completedAcademyModules || [],
                completed_cyberops_modules: userData.completedCyberOpsModules || [],
                completed_cipher_modules: userData.completedCipherModules || [],
                quiz_best_scores: userData.quizBestScores || {},
                is_reset: false,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await client
                .from('users')
                .upsert(payload, { onConflict: 'username' })
                .select()
                .single();

            if (error) {
                console.warn('Supabase signup upsert notice:', error);
            }

            return mapCloudToLocal(data || payload);
        } catch (e) {
            console.error('Supabase cloud signup error:', e);
            return null;
        }
    }

    async function signInWithCloud(identifier, password) {
        if (!isCloudActive || !identifier || !client) return null;
        try {
            const searchKey = identifier.trim().toLowerCase();
            const { data, error } = await client
                .from('users')
                .select('*')
                .or(`username.ilike.${searchKey},email.ilike.${searchKey}`)
                .maybeSingle();

            if (error || !data) return null;

            if (data.password && data.password !== password) {
                console.warn('Supabase password mismatch');
                return null;
            }

            return mapCloudToLocal(data);
        } catch (e) {
            console.error('Supabase cloud login error:', e);
            return null;
        }
    }

    async function syncProgressToCloud(userData) {
        if (!isCloudActive || !userData || !userData.username || !client) return;
        try {
            const academyPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.academy || 0) : (typeof userData.progress === 'number' ? userData.progress : 0);
            const cyberopsPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cyberops || 0) : 0;
            const cipherPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cipher || 0) : 0;

            const hasProgress = (userData.completedAcademyModules && userData.completedAcademyModules.length > 0) ||
                                (userData.completedCyberOpsModules && userData.completedCyberOpsModules.length > 0) ||
                                (userData.completedCipherModules && userData.completedCipherModules.length > 0) ||
                                ((userData.xp || 0) > 0);

            const isResetVal = hasProgress ? false : (userData.isReset || false);

            const payload = {
                username: userData.username.trim(),
                email: userData.email || '',
                password: userData.password || '',
                xp: userData.xp || 0,
                level: Math.floor((userData.xp || 0) / 50) + 1,
                rank: userData.rank || 'Cyber Trainee',
                experience_level: userData.experienceLevel || 'beginner',
                progress: { academy: academyPct, cyberops: cyberopsPct, cipher: cipherPct },
                unlocked: userData.unlocked || { academy: true, cyberops: false, cipher: false },
                completed_academy_modules: userData.completedAcademyModules || [],
                completed_cyberops_modules: userData.completedCyberOpsModules || [],
                completed_cipher_modules: userData.completedCipherModules || [],
                quiz_best_scores: userData.quizBestScores || {},
                is_reset: isResetVal,
                updated_at: new Date().toISOString()
            };

            await client.from('users').upsert(payload, { onConflict: 'username' });
        } catch (e) {
            console.warn('Supabase cloud sync notice:', e);
        }
    }

    function listenToLiveUserProfile(usernameOrEmail, callback) {
        if (!isCloudActive || !usernameOrEmail || typeof callback !== 'function' || !client) return null;
        try {
            const userKey = usernameOrEmail.trim().toLowerCase();

            if (activeChannel) {
                try { client.removeChannel(activeChannel); } catch (e) {}
                activeChannel = null;
            }

            activeChannel = client
                .channel('public:users')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'users',
                        filter: `username=eq.${userKey}`
                    },
                    (payload) => {
                        if (payload && payload.new) {
                            callback(mapCloudToLocal(payload.new));
                        }
                    }
                )
                .subscribe();

            return activeChannel;
        } catch (e) {
            console.warn('Could not attach Supabase realtime listener:', e);
            return null;
        }
    }

    async function fetchCloudLeaderboard() {
        if (!isCloudActive || !client) return [];
        try {
            const { data, error } = await client
                .from('users')
                .select('*')
                .order('xp', { ascending: false })
                .limit(20);

            if (error || !data) return [];
            return data.map(d => mapCloudToLocal(d));
        } catch (e) {
            console.warn('Supabase leaderboard fetch notice:', e);
            return [];
        }
    }

    function mapCloudToLocal(row) {
        if (!row) return null;
        return {
            username: row.username,
            email: row.email || '',
            password: row.password || '',
            xp: row.xp || 0,
            level: row.level || 1,
            rank: row.rank || 'Cyber Trainee',
            experienceLevel: row.experience_level || 'beginner',
            progress: row.progress || { academy: 0, cyberops: 0, cipher: 0 },
            unlocked: row.unlocked || { academy: true, cyberops: false, cipher: false },
            completedAcademyModules: row.completed_academy_modules || [],
            completedCyberOpsModules: row.completed_cyberops_modules || [],
            completedCipherModules: row.completed_cipher_modules || [],
            quizBestScores: row.quiz_best_scores || {},
            isReset: row.is_reset || false,
            lastUpdated: row.updated_at ? new Date(row.updated_at).getTime() : Date.now()
        };
    }

    return {
        init,
        signUpWithCloud,
        signInWithCloud,
        syncProgressToCloud,
        fetchCloudProfile,
        listenToLiveUserProfile,
        fetchCloudLeaderboard,
        isCloudActive: () => isCloudActive
    };
})();

// Auto-initialize on load
FirebaseSyncService.init();
