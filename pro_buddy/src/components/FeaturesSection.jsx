export default function FeaturesSection() {
    const features = [
        { id: 'featureDifficulty', icon: '🎯', title: 'Difficulty Level', desc: 'Assesses the overall complexity of your project — from beginner-friendly to expert-level — so you know what you\'re getting into.', tag: 'Complexity Check' },
        { id: 'featureSuccess', icon: '📈', title: 'Success Probability', desc: 'Estimates the likelihood of successfully completing and delivering the project based on scope, team, and resources.', tag: 'Confidence Score' },
        { id: 'featureUniqueness', icon: '✨', title: 'Uniqueness', desc: 'Evaluates how original and creative your idea is compared to existing solutions — standing out matters.', tag: 'Innovation Score' },
        { id: 'featureTechKnowledge', icon: '🧠', title: 'Tech Knowledge (Skills)', desc: 'Identifies the skill sets needed to build your project and evaluates required expertise level across technologies.', tag: 'Skill Assessment' },
        { id: 'featureTechStack', icon: '🛠️', title: 'Tech Stack Required', desc: 'Recommends the ideal technology stack for your project and evaluates how well your current choices match the requirements.', tag: 'Stack Readiness' },
    ];

    return (
        <section id="features" className="features-section">
            <div className="section-container">
                <div className="section-header">
                    <span className="section-tag">Why Pro Buddy?</span>
                    <h2 className="section-title">Five Dimensions of<br /><span className="gradient-text">Intelligent Analysis</span></h2>
                    <p className="section-desc">Our AI evaluates your idea across five critical dimensions, giving you a 360° view of your project's potential.</p>
                </div>
                <div className="features-grid">
                    {features.map(f => (
                        <div className="feature-card" id={f.id} key={f.id}>
                            <div className="feature-icon-wrap"><div className="feature-icon">{f.icon}</div></div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <div className="feature-tag">{f.tag}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
