import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiSignup, apiUpdateProfile } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('pb_current_user');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('pb_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pb_current_user');
        }
    }, [user]);

    const login = async (email, password) => {
        const result = await apiLogin(email, password);
        if (result.success) setUser(result.user);
        return result;
    };

    const signup = async (name, email, password) => {
        const result = await apiSignup(name, email, password);
        if (result.success) setUser(result.user);
        return result;
    };

    const updateProfile = async (name, bio, college) => {
        if (!user) return { success: false };
        const result = await apiUpdateProfile(user.email, name, bio, college);
        if (result.success) setUser(result.user);
        return result;
    };

    const logout = () => setUser(null);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, getInitials }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
