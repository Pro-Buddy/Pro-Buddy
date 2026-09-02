export default function HeroSection({ onGetStarted, onScrollTo }) {
    const handleAction = () => {
        if (onGetStarted) {
            onGetStarted();
        } else if (onScrollTo) {
            onScrollTo('evaluate');
        }
    };

    return (
        <section id="home" className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title" id="heroTitle">
                    From Confusion<br />
                    <span className="hero-title-accent">to Execution.</span>
                </h1>
                <div className="hero-actions">
                    <button className="btn btn-primary btn-lg" id="heroGetStartedBtn" onClick={handleAction}>
                        <span>Get Started</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
