import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';

export async function apiUpdateProfile(name, bio, college) {
    if (!auth.currentUser) return { success: false, message: 'Not authenticated' };
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const updates = { name, updatedAt: serverTimestamp() };
        if (bio !== undefined) updates.bio = bio;
        if (college !== undefined) updates.college = college;
        await updateDoc(userRef, updates);
        
        const snap = await getDoc(userRef);
        return { success: true, user: snap.data() };
    } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
        return { success: false, message: err.message };
    }
}

export async function apiSaveEvaluation(data) {
    if (!auth.currentUser) return { success: false, message: 'Not authenticated' };
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
        handleFirestoreError(err, OperationType.CREATE, `evaluations`);
        return { success: false, message: err.message };
    }
}

export async function apiGetEvaluations() {
    if (!auth.currentUser) return { success: false, evaluations: [] };
    try {
        const q = query(collection(db, 'evaluations'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const evaluations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, evaluations: evaluations.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) };
    } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'evaluations');
        return { success: false, evaluations: [] };
    }
}

export async function apiClearEvaluations() {
    if (!auth.currentUser) return { success: false };
    try {
        const q = query(collection(db, 'evaluations'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach(docSnap => batch.delete(docSnap.ref));
        await batch.commit();
        return { success: true };
    } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'evaluations');
        return { success: false, message: err.message };
    }
}

export async function apiSaveActivity(type, details) {
    if (!auth.currentUser) return { success: false };
    try {
        const docRef = doc(collection(db, 'activities'));
        const payload = {
            userId: auth.currentUser.uid,
            type: type, // 'career' or 'study'
            details: details || '',
            createdAt: serverTimestamp()
        };
        await setDoc(docRef, payload);
        return { success: true };
    } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'activities');
        return { success: false, message: err.message };
    }
}

export async function apiGetActivities() {
    if (!auth.currentUser) return { success: false, activities: [] };
    try {
        const q = query(collection(db, 'activities'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, activities: activities.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) };
    } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'activities');
        return { success: false, activities: [] };
    }
}


