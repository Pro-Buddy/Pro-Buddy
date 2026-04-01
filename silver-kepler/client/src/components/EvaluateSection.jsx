import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { evaluateIdea, generateReport, DOMAIN_DATA } from '../utils/evaluationEngine';
import { apiSaveEvaluation } from '../utils/api';
import CalcModal from './CalcModal';

const DOMAIN_OPTIONS = [
    { value: '', label: 'Select domain' },
    { value: 'ai-ml', label: 'AI / Machine Learning' },
    { value: 'web-dev', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'iot', label: 'IoT / Hardware' },
    { value: 'blockchain', label: 'Blockchain / Web3' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'healthcare', label: 'HealthTech' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'sustainability', label: 'Sustainability / GreenTech' },
    { value: 'social-impact', label: 'Social Impact' },
    { value: 'gaming', label: 'Gaming / AR / VR' },
    { value: 'data-analytics', label: 'Data Analytics' },
    { value: 'other', label: 'Other' }
];

function DimensionCard({ id, icon, name, score, feedback, delay }) {
    const [barWidth, setBarWidth] = useState('0%');
    useEffect(() => {
        const t = setTimeout(() => setBarWidth(`${score}%`), 400 + delay);
        return () => clearTimeout(t);
    }, [score, delay]);
    const cls = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low';
    return (
        <div className="dimension-card" id={id}>
            <div className="dim-header">
                <span className="dim-icon">{icon}</span>
                <span className="dim-name">{name}</span>
                <span className="dim-score">{score}%</span>
            </div>
            <div className="dim-bar">
                <div className={`dim-fill ${cls}`} style={{ width: barWidth }}></div>
            </div>
            <p className="dim-feedback">{feedback}</p>
        </div>
    );
}

function OverallScoreRing({ score, verdict, verdictTags }) {
    const circRef = useRef(null);
    const [displayScore, setDisplayScore] = useState(0);
    const circumference = 2 * Math.PI * 52;

    useEffect(() => {
        const circ = circRef.current;
        if (!circ) return;
        circ.style.strokeDasharray = circumference;
        circ.style.strokeDashoffset = circumference;
        const t = setTimeout(() => {
            circ.style.strokeDashoffset = circumference - (score / 100) * circumference;
            let current = 0;
            const step = score / 60;
            function anim() {
                current += step;
                if (current >= score) { setDisplayScore(score); return; }
                setDisplayScore(Math.floor(current));
                requestAnimationFrame(anim);
            }
            anim();
        }, 300);
        return () => clearTimeout(t);
    }, [score, circumference]);

    return (
        <div className="overall-score-card" id="overallScoreCard">
            <div className="overall-ring">
                <svg viewBox="0 0 120 120" className="score-ring-svg">
                    <defs>
                        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7c5cfc" />
                            <stop offset="100%" stopColor="#00d4aa" />
                        </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="52" className="ring-bg" />
                    <circle cx="60" cy="60" r="52" className="ring-progress" ref={circRef}
                        style={{ stroke: 'url(#ringGradient)', transition: 'stroke-dashoffset 1.5s ease' }} />
                </svg>
                <div className="ring-value">{displayScore}</div>
            </div>
            <div className="overall-info">
                <h4>Overall Score</h4>
                <p className="verdict">{verdict}</p>
                <div className="verdict-tags">
                    {verdictTags.map((tag, i) => (
                        <span key={i} className={`verdict-tag tag-${tag.type}`}>{tag.text}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function EvaluateSection() {
    const { user } = useAuth();
    const showToast = useToast();
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const resultsRef = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();
        const fd = {
            title: e.target.projectTitle.value.trim(),
            problem: e.target.problemStatement.value.trim(),
            solution: e.target.proposedSolution.value.trim(),
            domain: e.target.domain.value,
            teamSize: e.target.teamSize.value,
            techStack: e.target.techStack.value.trim(),
            timeline: '48h',
            targetAudience: e.target.targetAudience.value.trim(),
            uniqueFeatures: e.target.uniqueFeatures.value.trim()
        };

        setLoading(true);
        setTimeout(() => {
            const res = evaluateIdea(fd);
            setResult(res);
            setFormData(fd);
            setShowForm(false);
            setLoading(false);

            // Save to backend
            if (user) {
                apiSaveEvaluation({
                    userEmail: user.email, title: fd.title, domain: fd.domain,
                    overallScore: res.scores.overall, scores: res.scores, verdict: res.feedback.verdict
                }).catch(() => {});
            }

            setTimeout(() => {
                if (resultsRef.current) {
                    const top = resultsRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }, 100);
        }, 2200);
    }

    function resetEvaluation() {
        setShowForm(true);
        setResult(null);
        setFormData(null);
    }

    function downloadReport() {
        if (!result || !formData) return;
        const report = generateReport(result.scores, result.feedback, formData, result.domainData);
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ProBuddy_Report_${formData.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📄 Report downloaded successfully!');
    }

    function shareResults() {
        if (!result || !formData) return;
        const { scores } = result;
        const text = `🧠 Pro Buddy Analysis — ${formData.title}\n\nOverall Score: ${scores.overall}/100\n🎯 Difficulty: ${scores.difficulty}%\n📈 Success: ${scores.success}%\n✨ Uniqueness: ${scores.uniqueness}%\n🧠 Tech Knowledge: ${scores.techKnowledge}%\n🛠️ Tech Stack: ${scores.techStack}%\n\nAnalyzed with Pro Buddy — Confusion to Execution ⚡`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => showToast('🔗 Results copied to clipboard!'));
        } else { showToast('⚠️ Copy not supported in this browser.'); }
    }

    return (
        <section id="evaluate" className="evaluate-section">
            <div className="section-container">
                <div className="section-header">
                    <span className="section-tag">AI Engine</span>
                    <h2 className="section-title">Evaluate Your <span className="gradient-text">Project Idea</span></h2>
                    <p className="section-desc">Fill in the details below and let Pro Buddy's AI analyze your idea across multiple dimensions.</p>
                </div>
                <div className="eval-container">
                    {showForm && (
                        <div className="eval-form-container" id="evalFormContainer">
                            <form id="evalForm" className="eval-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="projectTitle">Project Title <span className="required">*</span></label>
                                    <input type="text" id="projectTitle" name="projectTitle" placeholder="Give your project a name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="problemStatement">Problem Statement <span className="required">*</span></label>
                                    <textarea id="problemStatement" name="problemStatement" rows="3" placeholder="What problem are you solving? Be specific." required></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="proposedSolution">Proposed Solution <span className="required">*</span></label>
                                    <textarea id="proposedSolution" name="proposedSolution" rows="3" placeholder="How does your solution work? Mention key features." required></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="domain">Domain / Category <span className="required">*</span></label>
                                        <select id="domain" name="domain" required>
                                            {DOMAIN_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="teamSize">Team Size</label>
                                        <select id="teamSize" name="teamSize" defaultValue="3">
                                            <option value="1">Solo (1)</option>
                                            <option value="2">Duo (2)</option>
                                            <option value="3">Small Team (3-4)</option>
                                            <option value="5">Large Team (5+)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="techStack">Tech Stack <span className="required">*</span></label>
                                    <input type="text" id="techStack" name="techStack" placeholder="e.g., React, Node.js, MongoDB" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="targetAudience">Target Audience <span className="required">*</span></label>
                                    <input type="text" id="targetAudience" name="targetAudience" placeholder="e.g., College students, Small businesses" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="uniqueFeatures">Unique Features / USP <span className="required">*</span></label>
                                    <textarea id="uniqueFeatures" name="uniqueFeatures" rows="2" placeholder="What makes your project stand out from existing solutions?" required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg btn-full" id="evaluateBtn" disabled={loading}>
                                    {!loading ? <span className="btn-text">🧠 Analyze with Pro Buddy</span> : <span className="btn-loading"><span className="spinner"></span> Analyzing...</span>}
                                </button>
                            </form>
                        </div>
                    )}

                    {!showForm && result && (
                        <div className="eval-results-container" id="evalResultsContainer" ref={resultsRef}>
                            <div className="results-header">
                                <h3 id="resultsProjectTitle">📊 {formData.title}</h3>
                                <button className="btn btn-ghost btn-sm" onClick={resetEvaluation}>← New Evaluation</button>
                            </div>
                            <OverallScoreRing score={result.scores.overall} verdict={result.feedback.verdict} verdictTags={result.feedback.verdictTags} />
                            <div className="results-header-row">
                                <h3>Dimension Analysis</h3>
                                <button className="btn-text-only" onClick={() => setShowModal(true)}>❓ How is this calculated?</button>
                            </div>
                            <div className="dimension-scores" id="dimensionScores">
                                <DimensionCard id="dimDifficulty" icon="🎯" name="Difficulty Level" score={result.scores.difficulty} feedback={result.feedback.dimFeedback.difficulty} delay={0} />
                                <DimensionCard id="dimSuccess" icon="📈" name="Success Probability" score={result.scores.success} feedback={result.feedback.dimFeedback.success} delay={150} />
                                <DimensionCard id="dimUniqueness" icon="✨" name="Uniqueness" score={result.scores.uniqueness} feedback={result.feedback.dimFeedback.uniqueness} delay={300} />
                                <DimensionCard id="dimTechKnowledge" icon="🧠" name="Tech Knowledge (Skills)" score={result.scores.techKnowledge} feedback={result.feedback.dimFeedback.techKnowledge} delay={450} />
                                <DimensionCard id="dimTechStack" icon="🛠️" name="Tech Stack Required" score={result.scores.techStack} feedback={result.feedback.dimFeedback.techStack} delay={600} />
                            </div>
                            <div className="insights-panel" id="insightsPanel">
                                <div className="insight-section"><h4>🔎 Known Existing Solutions</h4>
                                    <ul>{result.domainData.existingSolutions?.map((s, i) => (
                                        <li key={i}><strong>{s.name}</strong> — {s.desc} <span style={{ color: 'var(--accent-info)', fontSize: '0.78rem' }}>({s.url})</span></li>
                                    ))}</ul>
                                </div>
                                <div className="insight-section"><h4>💪 Strengths</h4><ul>{result.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                <div className="insight-section"><h4>⚠️ Areas for Improvement</h4><ul>{result.feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul></div>
                                <div className="insight-section"><h4>🎯 Differentiation Strategies</h4><ul>{result.feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                                <div className="insight-section"><h4>🏢 Industry Connections</h4>
                                    <div className="industry-cards">{result.domainData.industries.map((ind, i) => (
                                        <div className="industry-card" key={i}>
                                            <div className="industry-card-name">{ind.name}</div>
                                            <div className="industry-card-desc">{ind.desc}</div>
                                            <div className="industry-card-companies">{ind.companies.map((c, j) => <span className="company-tag" key={j}>{c}</span>)}</div>
                                        </div>
                                    ))}</div>
                                </div>
                                <div className="insight-section"><h4>🚀 Recommended Next Steps</h4><ol>{result.feedback.nextSteps.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
                                <div className="insight-section"><h4>🏁 Final Conclusion</h4><p className="conclusion-text">{result.feedback.conclusion}</p></div>
                            </div>
                            <div className="results-actions">
                                <button className="btn btn-primary" onClick={downloadReport}>📄 Download Report</button>
                                <button className="btn btn-secondary" onClick={shareResults}>🔗 Share Results</button>
                                {result.scores.overall > 75 && (
                                    <a 
                                        href={`https://www.linkedin.com/search/results/all/?keywords=investors%20${encodeURIComponent(result.domainData.name)}%20startup`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-linkedin"
                                        title="Connect with potential investors based on your high project score!"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                        Connect with Investors
                                    </a>
                                )}
                            </div>
                            {result.scores.overall > 75 && (
                                <p className="investor-invite-text">
                                    🌟 <strong>Investment Ready!</strong> Your project score is top-tier. Use the button above to start connecting with domain-specific funders and companies on LinkedIn.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <CalcModal show={showModal} onClose={() => setShowModal(false)} />
        </section>
    );
}
