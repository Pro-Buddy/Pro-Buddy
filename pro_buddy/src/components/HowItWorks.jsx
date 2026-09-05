export default function HowItWorks() {
    return (
        <section id="how-it-works" className="how-section">
            <div className="section-container">
                <div className="section-header">
                    <h2 className="section-title">How Pro Buddy Works</h2>
                    <p className="section-desc">Explore our AI-powered services designed to accelerate your growth and execution.</p>
                </div>
                <div className="steps-container">
                    <div className="step-card" id="step1">
                        <div className="step-badge">Service 1</div>
                        <div className="step-content">
                            <h3>Project Evaluator</h3>
                            <p>Get AI-powered feedback and validation on your project ideas before you start building.</p>
                        </div>
                        <div className="step-icon-wrap">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                    </div>
                    <div className="step-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                    <div className="step-card" id="step2">
                        <div className="step-badge">Service 2</div>
                        <div className="step-content">
                            <h3>Career Navigator</h3>
                            <p>Discover personalized job roles and career paths matching your specific skills and interests.</p>
                        </div>
                        <div className="step-icon-wrap">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                <circle cx="12" cy="12" r="9" />
                            </svg>
                        </div>
                    </div>
                    <div className="step-connector">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                    <div className="step-card" id="step3">
                        <div className="step-badge">Service 3</div>
                        <div className="step-content">
                            <h3>Learning Guide</h3>
                            <p>Instantly generate curated, high-quality study resources and tutorials for any technical topic.</p>
                        </div>
                        <div className="step-icon-wrap">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
