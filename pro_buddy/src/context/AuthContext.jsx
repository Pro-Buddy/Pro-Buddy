import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { apiUpdateProfile } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                } else {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || 'User' });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const result = await signInWithPopup(auth, provider);
            
            // Check if user doc exists
            const docRef = doc(db, 'users', result.user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    uid: result.user.uid,
                    email: result.user.email,
                    name: result.user.displayName || 'User',
                    bio: '',
                    college: '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    const signup = async (name, email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const userDoc = {
                uid: result.user.uid,
                email: result.user.email,
                name: name || 'User',
                bio: '',
                college: '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            await setDoc(doc(db, 'users', result.user.uid), userDoc);
            setUser(userDoc);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const updateProfile = async (name, bio, college) => {
        if (!user) return { success: false };
        const result = await apiUpdateProfile(name, bio, college);
        if (result.success) setUser(result.user);
        return result;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout, updateProfile, getInitials }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
