import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { apiGetEvaluations, apiClearEvaluations } from '../utils/api';

export default function ProfileSection({ onNavigate, onScrollTo }) {
    const { user, updateProfile, getInitials } = useAuth();
    const showToast = useToast();
    const [history, setHistory] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editCollege, setEditCollege] = useState('');

    useEffect(() => {
        if (user) {
            apiGetEvaluations(user.email).then(r => { if (r.success) setHistory(r.history); }).catch(() => {});
        }
    }, [user]);

    const initials = user ? getInitials(user.name) : '?';
    const totalEvals = history.length;
    const bestScore = totalEvals > 0 ? Math.max(...history.map(e => e.overallScore)) + '/100' : '—';
    const avgScore = totalEvals > 0 ? Math.round(history.reduce((a, e) => a + e.overallScore, 0) / totalEvals) + '/100' : '—';
    const joinedDate = user?.joinedAt ? (() => { const d = new Date(user.joinedAt); const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${m[d.getMonth()]} ${d.getFullYear()}`; })() : '—';

    function openEdit() {
        setEditName(user?.name || '');
        setEditBio(user?.bio || '');
        setEditCollege(user?.college || '');
        setShowEdit(true);
    }

    async function handleEditSubmit(e) {
        e.preventDefault();
        const res = await updateProfile(editName.trim(), editBio.trim(), editCollege.trim());
        if (res.success) { setShowEdit(false); showToast('✅ Profile updated successfully!'); }
    }

    async function clearHistory() {
        if (!user) return;
        await apiClearEvaluations(user.email);
        setHistory([]);
        showToast('🗑️ Evaluation history cleared.');
    }

    return (
        <section id="profile" className="profile-section">
            <div className="section-container">
                <div className="profile-layout">
                    <div className="profile-header-card">
                        <div className="profile-cover"></div>
                        <div className="profile-info-row">
                            <div className="profile-big-avatar">{initials}</div>
                            <div className="profile-info">
                                <h2 className="profile-name">{user?.name || 'User'}</h2>
                                <p className="profile-email">{user?.email || 'user@mail.com'}</p>
                                <div className="profile-badges">
                                    <span className="profile-badge badge-member">🎓 Member</span>
                                    <span className="profile-badge badge-eval">{totalEvals} Evaluation{totalEvals !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={openEdit}>✏️ Edit Profile</button>
                        </div>
                    </div>

                    {showEdit && (
                        <div className="profile-edit-card">
                            <h3>Edit Profile</h3>
                            <form className="auth-form" onSubmit={handleEditSubmit}>
                                <div className="auth-field"><label>Display Name</label><div className="auth-input-wrap"><input type="text" value={editName} onChange={e => setEditName(e.target.value)} required /></div></div>
                                <div className="auth-field"><label>Bio</label><div className="auth-input-wrap"><input type="text" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Short bio (optional)" maxLength={120} /></div></div>
                                <div className="auth-field"><label>College / Organization</label><div className="auth-input-wrap"><input type="text" value={editCollege} onChange={e => setEditCollege(e.target.value)} placeholder="e.g., IIT Delhi" /></div></div>
                                <div className="profile-edit-actions">
                                    <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
                                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowEdit(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="profile-stats-grid">
                        <div className="profile-stat-card"><div className="pstat-icon">📊</div><div className="pstat-value">{totalEvals}</div><div className="pstat-label">Total Evaluations</div></div>
                        <div className="profile-stat-card"><div className="pstat-icon">🏆</div><div className="pstat-value">{bestScore}</div><div className="pstat-label">Best Score</div></div>
                        <div className="profile-stat-card"><div className="pstat-icon">📈</div><div className="pstat-value">{avgScore}</div><div className="pstat-label">Average Score</div></div>
                        <div className="profile-stat-card"><div className="pstat-icon">📅</div><div className="pstat-value">{joinedDate}</div><div className="pstat-label">Member Since</div></div>
                    </div>

                    <div className="profile-history">
                        <div className="history-header">
                            <h3>📜 Evaluation History</h3>
                            <button className="btn btn-ghost btn-sm" onClick={clearHistory}>Clear All</button>
                        </div>
                        <div className="history-list">
                            {history.length === 0 ? (
                                <div className="history-empty">
                                    <span className="history-empty-icon">📋</span>
                                    <p>No evaluations yet. Start by evaluating your first project idea!</p>
                                    <button className="btn btn-primary btn-sm" onClick={() => { onNavigate('main'); setTimeout(() => onScrollTo('evaluate'), 50); }}>Evaluate Now</button>
                                </div>
                            ) : history.map(entry => {
                                const d = new Date(entry.timestamp);
                                const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                                const scoreClass = entry.overallScore >= 75 ? 'high' : entry.overallScore >= 55 ? 'medium' : 'low';
                                const domainLabel = entry.domain ? (entry.domain.charAt(0).toUpperCase() + entry.domain.slice(1)).replace(/-/g, ' ') : '';
                                return (
                                    <div className="history-card" key={entry.id}>
                                        <div className={`history-score-ring ${scoreClass}`}>{entry.overallScore}</div>
                                        <div className="history-card-body">
                                            <div className="history-card-title">{entry.title}</div>
                                            <div className="history-card-meta"><span className="history-domain">{domainLabel}</span><span>{dateStr}</span></div>
                                        </div>
                                        <div className="history-card-right"><span className="history-verdict">{entry.verdict || ''}</span></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button className="btn btn-ghost btn-lg btn-full" style={{ marginTop: '24px' }} onClick={() => onNavigate('main')}>← Back to Home</button>
                </div>
            </div>
        </section>
    );
}
