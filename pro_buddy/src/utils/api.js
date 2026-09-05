import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';

function getSessionUser() {
    if (auth.currentUser) return { uid: auth.currentUser.uid, email: auth.currentUser.email };
    try {
        const stored = localStorage.getItem('probuddy_current_user');
        if (stored) return JSON.parse(stored);
    } catch {
        // Ignore
    }
    return null;
}

export async function apiUpdateProfile(name, bio, college) {
    const sessionUser = getSessionUser();
    if (!sessionUser) return { success: false, message: 'Not authenticated' };

    if (auth.currentUser) {
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const updates = { name, updatedAt: serverTimestamp() };
            if (bio !== undefined) updates.bio = bio;
            if (college !== undefined) updates.college = college;
            await updateDoc(userRef, updates);
            
            const snap = await getDoc(userRef);
            return { success: true, user: snap.data() };
        } catch (err) {
            console.warn("Firestore update profile failed, updating locally:", err);
        }
    }

    // Local profile update
    const updatedUser = { ...sessionUser, name, bio: bio ?? sessionUser.bio, college: college ?? sessionUser.college, updatedAt: new Date().toISOString() };
    localStorage.setItem('probuddy_current_user', JSON.stringify(updatedUser));
    return { success: true, user: updatedUser };
}

export async function apiSaveEvaluation(data) {
    const sessionUser = getSessionUser();
    if (!sessionUser) return { success: false, message: 'Not authenticated' };

    const email = sessionUser.email || 'default';
    const uid = sessionUser.uid || 'guest';

    // Store in localStorage backup
    try {
        const key = `probuddy_history_${email}`;
        const localHistory = JSON.parse(localStorage.getItem(key) || '[]');
        const exists = localHistory.some(item => item.title === data.title && item.overallScore === data.overallScore);
        if (!exists) {
            localHistory.unshift({ ...data, userId: uid, userEmail: email, timestamp: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(localHistory.slice(0, 50)));
        }
    } catch (e) {
        console.warn("Local history save error:", e);
    }

    if (auth.currentUser) {
        try {
            const docRef = doc(collection(db, 'evaluations'));
            const payload = {
                userId: auth.currentUser.uid,
                title: data.title,
                overallScore: data.overallScore,
                createdAt: serverTimestamp()
            };
            if (data.domain) payload.domain = data.domain;
            if (data.verdict) payload.verdict = data.verdict;
            if (data.description) payload.description = data.description;
            
            await setDoc(docRef, payload);
            return { success: true };
        } catch (err) {
            console.warn("Firestore evaluation save failed, saved locally:", err);
            return { success: true };
        }
    }
    return { success: true };
}

export async function apiGetEvaluations() {
    const sessionUser = getSessionUser();
    if (!sessionUser) return { success: false, evaluations: [] };

    if (auth.currentUser) {
        try {
            const q = query(collection(db, 'evaluations'), where('userId', '==', auth.currentUser.uid));
            const snapshot = await getDocs(q);
            const evaluations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (evaluations.length > 0) {
                return { success: true, evaluations: evaluations.sort((a,b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0)) };
            }
        } catch (err) {
            console.warn("Firestore evaluations fetch error, using local:", err);
        }
    }

    const email = sessionUser.email || 'default';
    const localEvals = JSON.parse(localStorage.getItem(`probuddy_history_${email}`) || '[]');
    return { success: true, evaluations: localEvals };
}

export async function apiClearEvaluations() {
    const sessionUser = getSessionUser();
    if (!sessionUser) return { success: false };

    const email = sessionUser.email || 'default';
    localStorage.removeItem(`probuddy_history_${email}`);

    if (auth.currentUser) {
        try {
            const q = query(collection(db, 'evaluations'), where('userId', '==', auth.currentUser.uid));
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.docs.forEach(docSnap => batch.delete(docSnap.ref));
            await batch.commit();
        } catch (err) {
            console.warn("Firestore clear evaluations error:", err);
        }
    }
    return { success: true };
}

export async function apiSaveActivity(type, details) {
    const sessionUser = getSessionUser();
    if (!sessionUser) return { success: false };

    const email = sessionUser.email || 'default';

    try {
        const key = `probuddy_activities_${email}`;
        const acts = JSON.parse(localStorage.getItem(key) || '[]');
        acts.unshift({ id: Date.now().toString(36), type, details: details || '', createdAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(acts.slice(0, 50)));
    } catch (e) {
        console.warn("Activity save error:", e);
    }

    if (auth.currentUser) {
        try {
            const docRef = doc(collection(db, 'activities'));
            const payload = {
                userId: auth.currentUser.uid,
                type: type, // 'career' or 'study'
                details: details || '',
                createdAt: serverTimestamp()
            };
            await setDoc(docRef, payload);
        } catch (err) {
            console.warn("Firestore activity save error:", err);
        }
    }
    return { success: true };
}

export async function apiGetActivities() {
    const sessionUser = getSessionUser();
    if (!sessionUser) return { success: false, activities: [] };

    if (auth.currentUser) {
        try {
            const q = query(collection(db, 'activities'), where('userId', '==', auth.currentUser.uid));
            const snapshot = await getDocs(q);
            const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (activities.length > 0) {
                return { success: true, activities: activities.sort((a,b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0)) };
            }
        } catch (err) {
            console.warn("Firestore activities fetch error, using local:", err);
        }
    }

    const email = sessionUser.email || 'default';
    const localActs = JSON.parse(localStorage.getItem(`probuddy_activities_${email}`) || '[]');
    return { success: true, activities: localActs };
}


