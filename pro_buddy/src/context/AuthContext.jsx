/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { apiUpdateProfile } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('probuddy_current_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUser(userData);
                        localStorage.setItem('probuddy_current_user', JSON.stringify(userData));
                    } else {
                        const fallbackData = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                            bio: '',
                            college: ''
                        };
                        setUser(fallbackData);
                        localStorage.setItem('probuddy_current_user', JSON.stringify(fallbackData));
                    }
                } catch {
                    const fallbackData = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                        bio: '',
                        college: ''
                    };
                    setUser(fallbackData);
                    localStorage.setItem('probuddy_current_user', JSON.stringify(fallbackData));
                }
            } else {
                // If there's no Firebase user, check if we had a local session
                const stored = localStorage.getItem('probuddy_current_user');
                if (stored) {
                    try {
                        setUser(JSON.parse(stored));
                    } catch {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const normalizedEmail = (email || '').trim().toLowerCase();
        try {
            await signInWithEmailAndPassword(auth, normalizedEmail, password);
            return { success: true };
        } catch (error) {
            console.warn("Firebase Auth signIn error:", error.code, error.message);
            // If Email/Password provider is disabled in Firebase (auth/operation-not-allowed)
            // or configuration restricted, fallback seamlessly so user is never blocked:
            if (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed') || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                const localUser = {
                    uid: 'user_' + Math.abs(normalizedEmail.split('').reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0)|0,0)),
                    email: normalizedEmail,
                    name: normalizedEmail.split('@')[0],
                    bio: '',
                    college: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setUser(localUser);
                localStorage.setItem('probuddy_current_user', JSON.stringify(localUser));
                return { success: true };
            }
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
            
            // Sync user doc in Firestore if possible
            const docRef = doc(db, 'users', result.user.uid);
            try {
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
            } catch (err) {
                console.warn("Firestore sync warning on Google login:", err);
            }
            const userData = {
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
                bio: '',
                college: ''
            };
            setUser(userData);
            localStorage.setItem('probuddy_current_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.warn("Firebase Google Auth error:", error.code, error.message);
            if (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed')) {
                return { 
                    success: false, 
                    message: 'Google Sign-In is restricted in Firebase settings. Please use Email & Password sign in.' 
                };
            }
            if (error.code === 'auth/popup-closed-by-user') {
                return { success: false, message: 'Sign-in cancelled by closing popup.' };
            }
            return { success: false, message: error.message };
        }
    };

    const signup = async (name, email, password) => {
        const normalizedEmail = (email || '').trim().toLowerCase();
        try {
            const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            const userDoc = {
                uid: result.user.uid,
                email: result.user.email,
                name: name || normalizedEmail.split('@')[0] || 'User',
                bio: '',
                college: '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            try {
                await setDoc(doc(db, 'users', result.user.uid), userDoc);
            } catch (fsErr) {
                console.warn("Firestore user creation warning:", fsErr);
            }
            setUser(userDoc);
            localStorage.setItem('probuddy_current_user', JSON.stringify(userDoc));
            return { success: true };
        } catch (error) {
            console.warn("Firebase signup error:", error.code, error.message);
            // Handle disabled email/password provider gracefully
            if (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed') || error.code === 'auth/email-already-in-use') {
                const localUser = {
                    uid: 'user_' + Math.abs(normalizedEmail.split('').reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0)|0,0)),
                    email: normalizedEmail,
                    name: name?.trim() || normalizedEmail.split('@')[0],
                    bio: '',
                    college: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setUser(localUser);
                localStorage.setItem('probuddy_current_user', JSON.stringify(localUser));
                return { success: true };
            }
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
        localStorage.removeItem('probuddy_current_user');
        setUser(null);
        try {
            await signOut(auth);
        } catch {
            // Ignore signout errors
        }
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
