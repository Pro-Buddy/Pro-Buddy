import { useState } from 'react';

export default function CalcModal({ show, onClose }) {
    if (!show) return null;

    return (
        <div className={`modal-backdrop${show ? ' show' : ''}`} id="calcModal" style={{ display: 'flex' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>📊 How We Calculate Scores</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="param-group" style={{ borderLeftColor: '#FF9933' }}>
                        <h4 style={{ color: '#FF9933' }}>🧠 Pro Evaluator: Project Analysis (Orange)</h4>
                        <p className="param-desc">Algorithms analyze project scope, uniqueness, and tech-stack readiness based on industry-standard parameters.</p>
                        <ul>
                            <li><strong>Difficulty:</strong> Feature count, tech complexity, and integration depth (APIs, IoT).</li>
                            <li><strong>Success Pr.:</strong> Scope vs. timeline (48h) and team size vs. complexity.</li>
                            <li><strong>Uniqueness:</strong> Problem originality and niche specific features.</li>
                            <li><strong>Stack Readiness:</strong> Balanced Full-stack, modern Cloud, and AI layers.</li>
                        </ul>
                    </div>
                    <div className="param-group" style={{ borderLeftColor: '#0050A4' }}>
                        <h4 style={{ color: '#0050A4' }}>🚀 Pro Careers: Job Matching (Navy Blue)</h4>
                        <p className="param-desc">Matches your skills and interests with curated LinkedIn role categories and career exploration portals.</p>
                        <ul>
                            <li><strong>Skill Mapping:</strong> User chips (React, Python) matched with role requirements.</li>
                            <li><strong>Branch Logic:</strong> Branch-specific (CS, IT, ECE) career paths filtering.</li>
                            <li><strong>Exploration:</strong> Direct links to verified industry resources.</li>
                        </ul>
                    </div>
                    <div className="param-group" style={{ borderLeftColor: '#138808' }}>
                        <h4 style={{ color: '#138808' }}>📚 Pro Study: Learning Paths (Green)</h4>
                        <p className="param-desc">A curated knowledge base of top-tier YouTube channels and documentation websites curated by topic.</p>
                        <ul>
                            <li><strong>Quality Check:</strong> Channels selected based on verified teaching standards (Striver, Abdul Bari, etc.).</li>
                            <li><strong>Structured Paths:</strong> Multi-format resources for documentation (text) and tutorials (video).</li>
                            <li><strong>Search:</strong> Weighted keyword matching for custom subjects.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
