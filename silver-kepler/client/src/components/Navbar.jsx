import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, onNavigate, onScrollTo }) {
    const { user, logout, getInitials } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const initials = user ? getInitials(user.name) : '?';

    const handleNavClick = (e, viewOrId) => {
        e.preventDefault();
        if (['main', 'dashboard', 'evaluator', 'careers', 'study', 'profile'].includes(viewOrId)) {
            onNavigate(viewOrId);
        } else {
            if (currentView !== 'main' && currentView !== 'evaluator') onNavigate('main');
            setTimeout(() => onScrollTo(viewOrId), 50);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        setDropdownOpen(false);
        logout();
    };

    const isActive = (view) => currentView === view ? ' active' : '';

    return (
        <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
            <div className="nav-container">
                <a href="#" className="nav-logo" id="navLogo" onClick={(e) => handleNavClick(e, 'main')}>
                    <span className="logo-icon">⚡</span>
                    <span className="logo-text">Pro Buddy</span>
                </a>
                <div className="nav-links">
                    <a href="#" className={`nav-link${isActive('main')}`} onClick={(e) => handleNavClick(e, 'main')}>Home</a>
                    <a href="#" className={`nav-link${isActive('dashboard')}`} onClick={(e) => handleNavClick(e, 'dashboard')}>Dashboard</a>
                    <a href="#" className={`nav-link${isActive('evaluator')}`} onClick={(e) => handleNavClick(e, 'evaluator')}>Evaluator</a>
                    <a href="#" className={`nav-link${isActive('careers')}`} onClick={(e) => handleNavClick(e, 'careers')}>Careers</a>
                    <a href="#" className={`nav-link${isActive('study')}`} onClick={(e) => handleNavClick(e, 'study')}>Study</a>
                </div>
                <div className="nav-right">
                    <button className="nav-cta" id="navCtaBtn" onClick={(e) => handleNavClick(e, 'dashboard')}>Services</button>
                    <div className="user-menu" id="userMenu" ref={dropdownRef}>
                        <button className="user-avatar-btn" id="userAvatarBtn" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
                            <div className="user-avatar" id="userAvatar">{initials}</div>
                            <svg className="avatar-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        <div className={`user-dropdown${dropdownOpen ? ' show' : ''}`} id="userDropdown">
                            <div className="dropdown-user-info">
                                <div className="dropdown-avatar" id="dropdownAvatar">{initials}</div>
                                <div>
                                    <div className="dropdown-name" id="dropdownName">{user?.name || 'User'}</div>
                                    <div className="dropdown-email" id="dropdownEmail">{user?.email || 'user@mail.com'}</div>
                                </div>
                            </div>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); onNavigate('dashboard'); }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                Dashboard
                            </a>
                            <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); onNavigate('profile'); }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                My Profile
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item dropdown-logout" id="dropdownLogout" onClick={handleLogout}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                Sign Out
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
