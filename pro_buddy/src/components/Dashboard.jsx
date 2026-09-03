import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetEvaluations, apiGetActivities } from '../utils/api';

export default function Dashboard({ onNavigate }) {
    const { user, getInitials } = useAuth();
    const initials = user ? getInitials(user.name) : '?';
    const firstName = user?.name?.split(' ')[0] || 'User';

    const [evaluations, setEvaluations] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [insight, setInsight] = useState(null);

    useEffect(() => {
        if (user) {
            Promise.all([apiGetEvaluations(), apiGetActivities()]).then(([evalRes, actRes]) => {
                if (evalRes.success) {
                    const evals = evalRes.evaluations || [];
                    setEvaluations(evals);
                    if (evals.length > 0) {
                        fetch('/api/dashboard/insight', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ evaluations: evals.slice(0, 5) })
                        })
                        .then(r => r.json())
                        .then(data => { if (data.success) setInsight(data.insight); })
                        .catch(err => console.error(err));
                    }
                }
                if (actRes.success) {
                    setActivities(actRes.activities || []);
                }
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [user]);

    const totalIdeas = evaluations.length;
    const careersExplored = activities.filter(a => a.type === 'career').length;
    const studyTopics = activities.filter(a => a.type === 'study').length;
    const avgScore = totalIdeas > 0 ? Math.round(evaluations.reduce((acc, e) => acc + (e.overallScore || 0), 0) / totalIdeas) : 0;

    const formatDomain = (d) => d === 'N/A' ? d : d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const recent = evaluations.slice(0, 3);

    return (
        <section className="dashboard-section" id="dashboard">
            <div className="section-container">
                <div className="dashboard-header">
                    <div className="dashboard-greeting">
                        <div className="dashboard-avatar">{initials}</div>
                        <div>
                            <div className="dashboard-welcome-pill" style={{ color: '#000000', backgroundColor: '#FFB199', border: '1px solid rgba(255, 127, 80, 0.4)', fontWeight: '700' }}>Workspace Active</div>
                            <h1 className="dashboard-title">Welcome back, {firstName}</h1>
                            <p className="dashboard-subtitle">Here is your personalized progress and recent activity.</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading progress...</div>
                ) : (
                    <>
                        <div className="progress-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div className="stat-card" style={{ background: 'rgba(18, 18, 26, 0.75)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Ideas Evaluated</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>{totalIdeas}</div>
                            </div>
                            <div className="stat-card" style={{ background: 'rgba(18, 18, 26, 0.75)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Average Score</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: '#FFB199' }}>{avgScore}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/100</span></div>
                            </div>
                            <div className="stat-card" style={{ background: 'rgba(18, 18, 26, 0.75)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Careers Explored</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: '#a0a0ff' }}>{careersExplored}</div>
                            </div>
                            <div className="stat-card" style={{ background: 'rgba(18, 18, 26, 0.75)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Study Topics</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: '#a0ffa0' }}>{studyTopics}</div>
                            </div>
                        </div>

                        {insight && (
                            <div className="ai-insight-section" style={{ background: 'linear-gradient(135deg, rgba(255, 177, 153, 0.1) 0%, rgba(230, 74, 25, 0.1) 100%)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 127, 80, 0.3)', backdropFilter: 'blur(20px)', marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ fontSize: '24px' }}>✨</div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: '#FFB199' }}>AI Personal Insight</h3>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{insight}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="recent-activity-section" style={{ background: 'rgba(18, 18, 26, 0.75)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Recent Evaluations</h2>
                                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('profile')}>View All</button>
                            </div>
                            
                            {recent.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                    <p style={{ marginBottom: '16px' }}>You haven't evaluated any ideas yet.</p>
                                    <button className="btn btn-primary" onClick={() => onNavigate('evaluator')}>Start Evaluating</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {recent.map((item, idx) => {
                                        const d = item.createdAt && item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.timestamp || item.createdAt || Date.now());
                                        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        return (
                                            <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div>
                                                    <h4 style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>{item.title}</h4>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDomain(item.domain)} • {dateStr}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: item.overallScore >= 75 ? '#34A853' : item.overallScore >= 55 ? '#FBBC05' : '#EA4335' }}>
                                                        {item.overallScore}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        
                        <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => onNavigate('evaluator')}>New Evaluation</button>
                            <button className="btn btn-secondary" onClick={() => onNavigate('careers')}>Explore Careers</button>
                            <button className="btn btn-secondary" onClick={() => onNavigate('study')}>Study Resources</button>
                            <button className="btn btn-secondary" onClick={() => onNavigate('forum')}>Community Forum</button>
                            {user?.email === 'vishwarojushiva273@gmail.com' && (
                                <button className="btn btn-secondary" onClick={() => onNavigate('admin')} style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>⚙️ Admin Panel</button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

