export default function HeroSection({ onScrollTo }) {
    return (
        <section id="home" className="hero-section">
            <div className="hero-content">
                <div className="hero-badge" id="heroBadge">
                    <span className="badge-dot"></span>
                    AI-Powered Idea Evaluation
                </div>
                <h1 className="hero-title" id="heroTitle">
                    From <span className="gradient-text">Confusion</span><br />
                    to <span className="gradient-text-alt">Execution</span>
                </h1>
                <p className="hero-subtitle" id="heroSubtitle">
                    Stop guessing. Start building what matters. Pro Buddy analyzes your project ideas
                    with AI — evaluating feasibility, innovation, and industry fit — so you can win
                    hackathons and create real-world impact.
                </p>
                <div className="hero-actions">
                    <button className="btn btn-primary btn-lg" id="heroEvaluateBtn" onClick={() => onScrollTo('evaluate')}>
                        <span>Evaluate Your Idea</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="btn btn-ghost btn-lg" id="heroLearnBtn" onClick={() => onScrollTo('how-it-works')}>
                        Learn How It Works
                    </button>
                </div>
            </div>
            <div className="hero-visual">
                <div className="floating-card card-1" id="floatingCard1">
                    <div className="fc-icon">🎯</div>
                    <div className="fc-text">Difficulty: <span className="fc-score medium">Moderate</span></div>
                </div>
                <div className="floating-card card-2" id="floatingCard2">
                    <div className="fc-icon">📈</div>
                    <div className="fc-text">Success: <span className="fc-score high">85%</span></div>
                </div>
                <div className="floating-card card-3" id="floatingCard3">
                    <div className="fc-icon">✨</div>
                    <div className="fc-text">Uniqueness: <span className="fc-score high">92%</span></div>
                </div>
                <div className="floating-card card-4" id="floatingCard4">
                    <div className="fc-icon">🛠️</div>
                    <div className="fc-text">Tech Stack: <span className="fc-score high">Matched</span></div>
                </div>
                <div className="orbit-ring ring-1"></div>
                <div className="orbit-ring ring-2"></div>
                <div className="orbit-ring ring-3"></div>
                <div className="central-orb" id="centralOrb"><span>🧠</span></div>
            </div>
        </section>
    );
}
