export default function HowItWorks() {
    return (
        <section id="how-it-works" className="how-section">
            <div className="section-container">
                <div className="section-header">
                    <span className="section-tag">Simple Process</span>
                    <h2 className="section-title">How <span className="gradient-text">Pro Buddy</span> Works</h2>
                    <p className="section-desc">Three simple steps to transform your raw idea into a structured, evaluated, and actionable project plan.</p>
                </div>
                <div className="steps-container">
                    <div className="step-card" id="step1">
                        <div className="step-number">01</div>
                        <div className="step-content">
                            <h3>Describe Your Idea</h3>
                            <p>Tell us about your project — the problem it solves, target audience, tech stack, and your goals. The more detail, the better the analysis.</p>
                        </div>
                        <div className="step-visual">📝</div>
                    </div>
                    <div className="step-connector">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                    </div>
                    <div className="step-card" id="step2">
                        <div className="step-number">02</div>
                        <div className="step-content">
                            <h3>Pro Buddy Analyzes Everything</h3>
                            <p>Our engine evaluates your idea across 5 dimensions — difficulty, success probability, uniqueness, required skills, and tech stack fit.</p>
                        </div>
                        <div className="step-visual">🤖</div>
                    </div>
                    <div className="step-connector">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                    </div>
                    <div className="step-card" id="step3">
                        <div className="step-number">03</div>
                        <div className="step-content">
                            <h3>Get Actionable Insights</h3>
                            <p>Receive detailed scores, gap analysis, improvement tips, differentiation strategies, and industry connections to take your idea forward.</p>
                        </div>
                        <div className="step-visual">🚀</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
