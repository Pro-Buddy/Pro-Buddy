import React from 'react';

export default function AdminPanel({ onNavigate }) {
    return (
        <section className="suggest-section" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="view-header-minimal">
                <button className="btn btn-back" onClick={() => onNavigate('dashboard')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </button>
            </div>
            <div className="eval-container">
                <div className="eval-header text-center">
                    <h2 className="gradient-text">Admin Panel (Proposed Scope)</h2>
                    <p className="subtitle">Platform oversight and control features.</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">User Management</div>
                        <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px'}}>Search users, assign roles (Admin/Moderator/User), ban/suspend accounts, view active sessions.</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Content Moderation</div>
                        <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px'}}>Review flagged forum posts, manage chatbot safety triggers, handle user reports.</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Analytics Dashboard</div>
                        <p style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px'}}>Monitor active users, Gemini API usage costs, token counts, and feature adoption rates.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
