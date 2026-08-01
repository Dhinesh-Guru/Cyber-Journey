/* ==========================================================================
   CyberJourney - Firebase Cloud Sync & Configuration Manager
   ========================================================================== */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA_kcMuO9aqqSTLVNIX5O76YTYyxJOwG3k",
    authDomain: "cyber-journey-98b66.firebaseapp.com",
    projectId: "cyber-journey-98b66",
    storageBucket: "cyber-journey-98b66.firebasestorage.app",
    messagingSenderId: "215318770019",
    appId: "1:215318770019:web:5add4b4e455cfce066a356",
    measurementId: "G-JGWF0KF8BK"
};

// --- Firebase Cloud Bridge Service ---
const FirebaseSyncService = (function () {
    'use strict';

    let app = null;
    let auth = null;
    let db = null;
    let isFirebaseActive = false;

    function init() {
        if (typeof firebase !== 'undefined' && FIREBASE_CONFIG.apiKey !== "YOUR_FIREBASE_API_KEY") {
            try {
                app = firebase.initializeApp(FIREBASE_CONFIG);
                auth = firebase.auth();
                db = firebase.firestore();
                isFirebaseActive = true;
                console.log('⚡ Firebase Cloud Sync Active!');
            } catch (e) {
                console.warn('Firebase initialization error, falling back to LocalStorage:', e);
            }
        } else {
            console.log('ℹ️ Running in LocalStorage mode. To enable Firebase multi-device Cloud Sync, add your keys in firebase-config.js');
        }
    }

    // --- Cloud Auth Actions ---
    async function signUpWithCloud(email, password, username, userData = {}) {
        if (!isFirebaseActive || !username) return null;
        try {
            const userKey = username.trim().toLowerCase();
            const emailKey = (email || '').trim().toLowerCase();

            const initialUserData = {
                email: email || '',
                username: username,
                password: password || '',
                passwordHistory: userData.passwordHistory || [password || ''],
                xp: userData.xp || 50,
                level: userData.level || 1,
                rank: userData.rank || 'Cyber Trainee',
                experienceLevel: userData.experienceLevel || 'beginner',
                progress: userData.progress || { academy: 0, cyberops: 0, cipher: 0 },
                overallCompletion: 0,
                unlocked: userData.unlocked || { academy: true, cyberops: false, cipher: false },
                completedAcademyModules: userData.completedAcademyModules || [],
                completedCyberOpsModules: userData.completedCyberOpsModules || [],
                completedCipherModules: userData.completedCipherModules || [],
                quizBestScores: userData.quizBestScores || {},
                badges: userData.badges || [],
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Attempt Firebase Auth in background
            try {
                if (email && password && email.includes('@')) {
                    const userCred = await auth.createUserWithEmailAndPassword(email, password);
                    if (userCred && userCred.user) {
                        initialUserData.uid = userCred.user.uid;
                        await userCred.user.updateProfile({ displayName: username });
                    }
                }
            } catch (authErr) {
                console.warn('Firebase Auth user creation notice:', authErr);
            }

            await db.collection('users').doc(userKey).set(initialUserData, { merge: true });
            if (emailKey && emailKey.includes('@')) {
                await db.collection('users').doc(emailKey).set(initialUserData, { merge: true });
            }
            if (initialUserData.uid) {
                await db.collection('users').doc(initialUserData.uid).set(initialUserData, { merge: true });
            }

            return initialUserData;
        } catch (e) {
            console.error('Cloud signup error:', e);
            return null;
        }
    }

    async function signInWithCloud(identifier, password) {
        if (!isFirebaseActive || !identifier) return null;
        try {
            const idKey = identifier.trim().toLowerCase();

            // 1. Direct document lookup by username or email key
            let doc = await db.collection('users').doc(idKey).get();
            let data = doc.exists ? doc.data() : null;

            // 2. If direct key lookup missed, search Firestore collection case-insensitively
            if (!data) {
                try {
                    const snap = await db.collection('users').get();
                    const matched = snap.docs.find(d => {
                        const dData = d.data();
                        const uName = (dData.username || '').toLowerCase();
                        const uEmail = (dData.email || '').toLowerCase();
                        return uName === idKey || uEmail === idKey;
                    });

                    if (matched) {
                        data = matched.data();
                    }
                } catch (e) {}
            }

            // 3. Fallback: Try Firebase Auth directly if identifier contains '@'
            if (!data && identifier.includes('@')) {
                try {
                    const userCred = await auth.signInWithEmailAndPassword(identifier, password);
                    if (userCred && userCred.user) {
                        const userDoc = await db.collection('users').doc(userCred.user.uid).get();
                        if (userDoc.exists) return userDoc.data();
                        return {
                            username: userCred.user.displayName || identifier.split('@')[0],
                            email: identifier,
                            password: password,
                            xp: 50,
                            progress: { academy: 0, cyberops: 0, cipher: 0 }
                        };
                    }
                } catch (authErr) {
                    console.warn('Direct Firebase Auth signin fallback notice:', authErr);
                }
            }

            // 4. Password Verification
            if (data) {
                if (data.password && data.password !== password) {
                    console.warn('Cloud login password mismatch');
                    return null; // Invalid password
                }

                // Attempt Firebase Auth signin in background if email is present
                if (data.email && data.email.includes('@')) {
                    try {
                        await auth.signInWithEmailAndPassword(data.email, password);
                    } catch (aErr) {}
                }

                return data;
            }

            return null;
        } catch (e) {
            console.error('Firebase cloud login error:', e);
            return null;
        }
    }

    async function syncProgressToCloud(userData) {
        if (!isFirebaseActive || !userData || !userData.username) return;
        try {
            const userKey = userData.username.trim().toLowerCase();
            const emailKey = (userData.email || '').trim().toLowerCase();

            const academyPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.academy || 0) : (typeof userData.progress === 'number' ? userData.progress : 0);
            const cyberopsPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cyberops || 0) : 0;
            const cipherPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cipher || 0) : 0;
            const overallPct = Math.round((academyPct + cyberopsPct + cipherPct) / 3);

            const payload = {
                username: userData.username,
                email: userData.email || '',
                password: userData.password || '',
                xp: userData.xp || 0,
                level: Math.floor((userData.xp || 0) / 50) + 1,
                rank: userData.rank || 'Cyber Trainee',
                experienceLevel: userData.experienceLevel || 'beginner',
                progress: { academy: academyPct, cyberops: cyberopsPct, cipher: cipherPct },
                overallCompletion: overallPct,
                unlocked: userData.unlocked || { academy: true, cyberops: false, cipher: false },
                completedAcademyModules: userData.completedAcademyModules || [],
                completedCyberOpsModules: userData.completedCyberOpsModules || [],
                completedCipherModules: userData.completedCipherModules || [],
                quizBestScores: userData.quizBestScores || {},
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('users').doc(userKey).set(payload, { merge: true });
            if (emailKey && emailKey.includes('@')) {
                await db.collection('users').doc(emailKey).set(payload, { merge: true });
            }
            if (auth && auth.currentUser) {
                await db.collection('users').doc(auth.currentUser.uid).set(payload, { merge: true });
            }
        } catch (e) {
            console.error('Error syncing progress to cloud:', e);
        }
    }

    async function fetchCloudLeaderboard() {
        if (!isFirebaseActive) return [];
        try {
            const snapshot = await db.collection('users')
                .orderBy('xp', 'desc')
                .limit(20)
                .get();

            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error('Error fetching cloud leaderboard:', e);
            return [];
        }
    }

    async function fetchCloudProfile(identifier) {
        if (!isFirebaseActive || !identifier) return null;
        try {
            const docKey = identifier.trim().toLowerCase();
            const doc = await db.collection('users').doc(docKey).get();
            if (doc.exists) return doc.data();

            if (identifier.includes('@')) {
                const snap = await db.collection('users').where('email', '==', identifier.trim()).limit(1).get();
                if (!snap.empty) return snap.docs[0].data();
            }
            return null;
        } catch (e) {
            console.error('Error fetching cloud profile:', e);
            return null;
        }
    }

    function listenToLiveUserProfile(usernameOrEmail, callback) {
        if (!isFirebaseActive || !usernameOrEmail || typeof callback !== 'function') return null;
        try {
            const docKey = usernameOrEmail.trim().toLowerCase();
            return db.collection('users').doc(docKey).onSnapshot(doc => {
                if (doc.exists) {
                    callback(doc.data());
                }
            }, err => console.warn('Snapshot listener notice:', err));
        } catch (e) {
            console.warn('Could not attach realtime cloud listener:', e);
        }
        return null;
    }

    return {
        init,
        signUpWithCloud,
        signInWithCloud,
        syncProgressToCloud,
        fetchCloudLeaderboard,
        fetchCloudProfile,
        listenToLiveUserProfile,
        isCloudActive: () => isFirebaseActive
    };
})();

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        FirebaseSyncService.init();
    });
}
