// Updated component name to ProCareers
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ParticleCanvas from './components/ParticleCanvas';
import AuthOverlay from './components/AuthOverlay';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import EvaluateSection from './components/EvaluateSection';
import ProCareers from './components/ProCareers';
import ProStudy from './components/ProStudy';
import ProfileSection from './components/ProfileSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminPanel from './components/AdminPanel';
import Forum from './components/Forum';
import studyTableBg from './assets/images/study_table_pens_vivid_1788237992563.jpg';

export default function App() {
    const { user } = useAuth();
    const [isAuthed, setIsAuthed] = useState(!!user);
    // Views: main | dashboard | evaluator | careers | study | profile
    const [currentView, setCurrentView] = useState('main');

    useEffect(() => { setIsAuthed(!!user); }, [user]);
    useEffect(() => { if (!user) { setIsAuthed(false); setCurrentView('main'); } }, [user]);

    // Scroll to top when changing views
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentView]);

    function scrollToSection(id) {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }

    // Counter animation & reveal
    useEffect(() => {
        if (!isAuthed) return;
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const step = target / (2000 / 16);
            let current = 0;
            function update() {
                current += step;
                if (current >= target) { counter.textContent = target.toLocaleString(); return; }
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
            }
            update();
        });
    }, [isAuthed]);

    useEffect(() => {
        if (!isAuthed) return;
        const items = document.querySelectorAll('.feature-card, .step-card, .section-header');
        items.forEach(el => el.classList.add('reveal'));
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        items.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [isAuthed, currentView]);

    if (!isAuthed) {
        return (
            <>
                <div className="study-table-bg-container" aria-hidden="true">
                    <img src={studyTableBg} alt="Study table with pens" className="study-table-bg-img" referrerPolicy="no-referrer" />
                    <div className="study-table-bg-gradient" />
                </div>
                <ParticleCanvas />
                <AuthOverlay onAuthSuccess={() => setIsAuthed(true)} />
            </>
        );
    }

    return (
        <>
            <div className="study-table-bg-container" aria-hidden="true">
                <img src={studyTableBg} alt="Study table with pens" className="study-table-bg-img" referrerPolicy="no-referrer" />
                <div className="study-table-bg-gradient" />
            </div>
            <ParticleCanvas />
            <div id="appWrapper" style={{ display: 'block' }}>
                <Navbar currentView={currentView} onNavigate={setCurrentView} onScrollTo={scrollToSection} />

                {currentView === 'main' && (
                    <>
                        <HeroSection onGetStarted={() => setCurrentView('evaluator')} onScrollTo={scrollToSection} />
                        <HowItWorks />
                        <Footer />
            {isAuthed && <Chatbot currentView={currentView} />}
                    </>
                )}

                {currentView === 'dashboard' && (
                    <Dashboard onNavigate={setCurrentView} />
                )}

                {currentView === 'evaluator' && (
                    <div style={{ paddingTop: '80px' }}>
                        <EvaluateSection />
                        <Footer />
                    </div>
                )}

                {currentView === 'careers' && (
                    <div style={{ paddingTop: '80px' }}>
                        <ProCareers onNavigate={setCurrentView} />
                    </div>
                )}

                {currentView === 'study' && (
                    <div style={{ paddingTop: '80px' }}>
                        <ProStudy onNavigate={setCurrentView} />
                    </div>
                )}

                {currentView === 'profile' && (
                    <div style={{ paddingTop: '80px' }}>
                        <ProfileSection onNavigate={setCurrentView} onScrollTo={scrollToSection} />
                    </div>
                )}

                {currentView === 'forum' && (
                    <div style={{ paddingTop: '80px' }}>
                        <Forum onNavigate={setCurrentView} />
                    </div>
                )}

                {currentView === 'admin' && (
                    <div style={{ paddingTop: '80px' }}>
                        {user?.email === 'vishwarojushiva273@gmail.com' ? (
                            <AdminPanel onNavigate={setCurrentView} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-secondary)' }}>
                                <h2>Access Denied</h2>
                                <p>You do not have permission to view the Admin Panel.</p>
                                <button className="btn btn-primary" onClick={() => setCurrentView('dashboard')} style={{ marginTop: '20px' }}>Return to Dashboard</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
