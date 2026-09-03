const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

const additionalButtons = `
            <div className="grid grid-3" style={{ marginTop: '30px' }}>
                <div className="action-card" onClick={() => onNavigate('evaluator')}>
                    <div className="action-icon">💡</div>
                    <h3>Evaluate Idea</h3>
                    <p>Get AI feedback on your next project.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate('careers')}>
                    <div className="action-icon">🎯</div>
                    <h3>Career Match</h3>
                    <p>Find roles based on your skills.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate('study')}>
                    <div className="action-icon">📚</div>
                    <h3>Study Guide</h3>
                    <p>Curated learning resources.</p>
                </div>
            </div>
            
            <div className="grid grid-2" style={{ marginTop: '20px' }}>
                <div className="action-card" onClick={() => onNavigate('forum')} style={{ border: '1px solid var(--primary)' }}>
                    <div className="action-icon">🤝</div>
                    <h3>Community Forum</h3>
                    <p>Connect and collaborate with peers.</p>
                </div>
                <div className="action-card" onClick={() => onNavigate('admin')} style={{ border: '1px solid var(--accent)' }}>
                    <div className="action-icon">⚙️</div>
                    <h3>Admin Panel</h3>
                    <p>Platform oversight & moderation.</p>
                </div>
            </div>
`;

content = content.replace(/<div className="grid grid-3"[^>]*>[\s\S]*?<\/div>\s*<\/div>/, additionalButtons);
fs.writeFileSync('src/components/Dashboard.jsx', content);
