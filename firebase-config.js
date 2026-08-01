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
        if (!isFirebaseActive) return null;
        try {
            const userCred = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCred.user;
            await user.updateProfile({ displayName: username });

            const docKey = username.toLowerCase();
            const initialUserData = {
                uid: user.uid,
                email: email,
                username: username,
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

            await db.collection('users').doc(docKey).set(initialUserData);
            await db.collection('users').doc(user.uid).set(initialUserData);
            return initialUserData;
        } catch (e) {
            console.warn('Cloud signup notice:', e);
            return null;
        }
    }

    async function signInWithCloud(identifier, password) {
        if (!isFirebaseActive) return null;
        try {
            let userEmail = identifier.trim();
            const docKey = identifier.trim().toLowerCase();

            // Direct check by username document key first!
            const directDoc = await db.collection('users').doc(docKey).get();
            if (directDoc.exists) {
                userEmail = directDoc.data().email || userEmail;
            } else if (!userEmail.includes('@')) {
                // Search by query
                const querySnap = await db.collection('users')
                    .where('username', '==', identifier.trim())
                    .limit(1)
                    .get();

                if (!querySnap.empty) {
                    userEmail = querySnap.docs[0].data().email;
                }
            }

            if (userEmail.includes('@')) {
                try {
                    await auth.signInWithEmailAndPassword(userEmail, password);
                } catch (authErr) {
                    console.warn('Firebase Auth signin notice:', authErr);
                }
            }

            const doc = await db.collection('users').doc(docKey).get();
            if (doc.exists) {
                const data = doc.data();
                data.password = password;
                return data;
            }
            return null;
        } catch (e) {
            console.error('Firebase cloud login failed:', e);
            return null;
        }
    }

    async function syncProgressToCloud(userData) {
        if (!isFirebaseActive || !userData || !userData.username) return;
        try {
            const docKey = userData.username.trim().toLowerCase();
            const academyPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.academy || 0) : (typeof userData.progress === 'number' ? userData.progress : 0);
            const cyberopsPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cyberops || 0) : 0;
            const cipherPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cipher || 0) : 0;
            const overallPct = Math.round((academyPct + cyberopsPct + cipherPct) / 3);

            const payload = {
                username: userData.username,
                email: userData.email || '',
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

            await db.collection('users').doc(docKey).set(payload, { merge: true });

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
