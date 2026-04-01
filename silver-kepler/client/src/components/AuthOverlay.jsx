import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthOverlay({ onAuthSuccess }) {
    const { login, signup } = useAuth();
    const [showLogin, setShowLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [exitAnim, setExitAnim] = useState(false);
    const [cardAnim, setCardAnim] = useState('');

    // Password strength
    const [pwStrength, setPwStrength] = useState({ label: '', color: '', width: '0%' });

    function checkPwStrength(pw) {
        let s = 0;
        if (pw.length >= 6) s++;
        if (pw.length >= 10) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['', '#ff4757', '#ffb347', '#00d4aa', '#7c5cfc', '#00d4aa'];
        const widths = ['0%', '20%', '40%', '60%', '80%', '100%'];
        setPwStrength({ label: labels[s], color: colors[s], width: widths[s] });
    }

    function handleExit() {
        setExitAnim(true);
        setTimeout(() => onAuthSuccess(), 600);
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        const fd = new FormData(e.target);
        setTimeout(async () => {
            try {
                const result = await login(fd.get('email'), fd.get('password'));
                setLoading(false);
                if (result.success) handleExit();
                else setError(result.message);
            } catch { setLoading(false); setError('Connection error. Is the server running?'); }
        }, 1200);
    }

    async function handleSignupSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        const fd = new FormData(e.target);
        setTimeout(async () => {
            try {
                const result = await signup(fd.get('name'), fd.get('email'), fd.get('password'));
                setLoading(false);
                if (result.success) handleExit();
                else setError(result.message);
            } catch { setLoading(false); setError('Connection error. Is the server running?'); }
        }, 1400);
    }

    async function handleGoogleDemo() {
        try {
            let result = await login('demo@probuddy.ai', 'demo123');
            if (!result.success) result = await signup('Demo User', 'demo@probuddy.ai', 'demo123');
            if (result.success) handleExit();
        } catch { setError('Connection error. Is the server running?'); }
    }

    function switchToSignup(e) { e.preventDefault(); setError(''); setShowLogin(false); setCardAnim('auth-card-enter'); setTimeout(() => setCardAnim(''), 500); }
    function switchToLogin(e) { e.preventDefault(); setError(''); setShowLogin(true); setCardAnim('auth-card-enter'); setTimeout(() => setCardAnim(''), 500); }

    const [showLoginPw, setShowLoginPw] = useState(false);
    const [showSignupPw, setShowSignupPw] = useState(false);

    return (
        <div className={`auth-overlay${exitAnim ? ' auth-exit' : ''}`} id="authOverlay">
            <div className="auth-particles-bg"></div>
            <div className="auth-container">
                <div className="auth-brand">
                    <span className="logo-icon">⚡</span>
                    <span className="logo-text">Pro Buddy</span>
                </div>
                <p className="auth-tagline">From Confusion to Execution</p>

                {/* Login */}
                {showLogin && (
                    <div className={`auth-card ${cardAnim}`} id="loginCard">
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to continue your journey</p>
                        <form onSubmit={handleLoginSubmit} className="auth-form" id="loginForm">
                            {error && <div className="auth-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> {error}</div>}
                            <div className="auth-field">
                                <label htmlFor="loginEmail">Email</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
                                    <input type="email" name="email" id="loginEmail" placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label htmlFor="loginPassword">Password</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                                    <input type={showLoginPw ? 'text' : 'password'} name="password" id="loginPassword" placeholder="Enter your password" required />
                                    <button type="button" className="auth-toggle-pw" tabIndex={-1} onClick={() => setShowLoginPw(!showLoginPw)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg btn-full auth-submit" disabled={loading} id="loginBtn">
                                {!loading ? <span className="btn-text">Sign In</span> : <span className="btn-loading"><span className="spinner"></span> Signing in...</span>}
                            </button>
                        </form>
                        <div className="auth-divider"><span>or</span></div>
                        <button className="btn btn-ghost btn-lg btn-full auth-social" onClick={handleGoogleDemo} id="googleSignIn">
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continue with Google
                        </button>
                        <p className="auth-switch">Don't have an account? <a href="#" onClick={switchToSignup} id="showSignup">Create one</a></p>
                    </div>
                )}

                {/* Signup */}
                {!showLogin && (
                    <div className={`auth-card ${cardAnim}`} id="signupCard">
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Join Pro Buddy and start evaluating ideas</p>
                        <form onSubmit={handleSignupSubmit} className="auth-form" id="signupForm">
                            {error && <div className="auth-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> {error}</div>}
                            <div className="auth-field">
                                <label htmlFor="signupName">Full Name</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    <input type="text" name="name" id="signupName" placeholder="Your full name" required />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label htmlFor="signupEmail">Email</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>
                                    <input type="email" name="email" id="signupEmail" placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label htmlFor="signupPassword">Password</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                                    <input type={showSignupPw ? 'text' : 'password'} name="password" id="signupPassword" placeholder="Min 6 characters" required minLength={6} onChange={(e) => checkPwStrength(e.target.value)} />
                                    <button type="button" className="auth-toggle-pw" tabIndex={-1} onClick={() => setShowSignupPw(!showSignupPw)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                </div>
                                <div className="password-strength" id="pwStrength">
                                    <div className="pw-bar"><div className="pw-fill" style={{ width: pwStrength.width, background: pwStrength.color }}></div></div>
                                    <span className="pw-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg btn-full auth-submit" disabled={loading} id="signupBtn">
                                {!loading ? <span className="btn-text">Create Account</span> : <span className="btn-loading"><span className="spinner"></span> Creating...</span>}
                            </button>
                        </form>
                        <p className="auth-switch">Already have an account? <a href="#" onClick={switchToLogin} id="showLogin">Sign in</a></p>
                    </div>
                )}
            </div>
        </div>
    );
}
