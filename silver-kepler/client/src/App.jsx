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
                <ParticleCanvas />
                <AuthOverlay onAuthSuccess={() => setIsAuthed(true)} />
            </>
        );
    }

    return (
        <>
            <ParticleCanvas />
            <div id="appWrapper" style={{ display: 'block' }}>
                <Navbar currentView={currentView} onNavigate={setCurrentView} onScrollTo={scrollToSection} />

                {currentView === 'main' && (
                    <>
                        <HeroSection onScrollTo={scrollToSection} />
                        <EvaluateSection />
                        <FeaturesSection />
                        <HowItWorks />
                        <Footer />
                    </>
                )}

                {currentView === 'dashboard' && (
                    <Dashboard onNavigate={setCurrentView} />
                )}

                {currentView === 'evaluator' && (
                    <div style={{ paddingTop: '80px' }}>
                        <div className="view-header-minimal">
                            <button className="btn btn-back" onClick={() => setCurrentView('dashboard')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                Back to Dashboard
                            </button>
                        </div>
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
            </div>
        </>
    );
}
