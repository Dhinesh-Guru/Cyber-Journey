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
    async function signUpWithCloud(email, password, username) {
        if (!isFirebaseActive) return null;
        try {
            const userCred = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCred.user;
            await user.updateProfile({ displayName: username });

            const initialUserData = {
                uid: user.uid,
                email: email,
                username: username,
                xp: 0,
                level: 1,
                rank: 'Cyber Trainee',
                experienceLevel: 'beginner',
                progress: { academy: 0, cyberops: 0, cipher: 0 },
                unlocked: { academy: true, cyberops: false, cipher: false },
                badges: [],
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('users').doc(user.uid).set(initialUserData);
            return initialUserData;
        } catch (e) {
            throw e;
        }
    }

    async function signInWithCloud(identifier, password) {
        if (!isFirebaseActive) return null;
        try {
            let userEmail = identifier.trim();

            // If identifier is a username (no @), query Firestore users collection to find associated email
            if (!userEmail.includes('@')) {
                const querySnap = await db.collection('users')
                    .where('username', '==', identifier.trim())
                    .limit(1)
                    .get();

                if (!querySnap.empty) {
                    userEmail = querySnap.docs[0].data().email;
                } else {
                    // Case-insensitive fallback lookup
                    const allSnap = await db.collection('users').get();
                    const matched = allSnap.docs.find(d => d.data().username && d.data().username.toLowerCase() === identifier.trim().toLowerCase());
                    if (matched) {
                        userEmail = matched.data().email;
                    }
                }
            }

            const userCred = await auth.signInWithEmailAndPassword(userEmail, password);
            const doc = await db.collection('users').doc(userCred.user.uid).get();
            if (doc.exists) {
                const data = doc.data();
                data.password = password; // Preserve password for local verification
                return data;
            }
            return null;
        } catch (e) {
            console.error('Firebase cloud login failed:', e);
            return null;
        }
    }

    async function syncProgressToCloud(userData) {
        if (!isFirebaseActive || !auth || !auth.currentUser) return;
        try {
            const uid = auth.currentUser.uid;
            const academyPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.academy || 0) : (typeof userData.progress === 'number' ? userData.progress : 0);
            const cyberopsPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cyberops || 0) : 0;
            const cipherPct = (typeof userData.progress === 'object' && userData.progress) ? (userData.progress.cipher || 0) : 0;
            const overallPct = Math.round((academyPct + cyberopsPct + cipherPct) / 3);

            await db.collection('users').doc(uid).set({
                xp: userData.xp || 0,
                rank: userData.rank || 'Cyber Trainee',
                progress: { academy: academyPct, cyberops: cyberopsPct, cipher: cipherPct },
                overallCompletion: overallPct,
                unlocked: userData.unlocked || { academy: true, cyberops: false, cipher: false },
                completedAcademyModules: userData.completedAcademyModules || [],
                completedCyberOpsModules: userData.completedCyberOpsModules || [],
                completedCipherModules: userData.completedCipherModules || [],
                quizBestScores: userData.quizBestScores || {},
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
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

    return {
        init,
        signUpWithCloud,
        signInWithCloud,
        syncProgressToCloud,
        fetchCloudLeaderboard,
        isCloudActive: () => isFirebaseActive
    };
})();

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        FirebaseSyncService.init();
    });
}
