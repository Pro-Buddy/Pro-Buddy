const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

// Add links to Navbar
const oldLinks = `<button onClick={() => onNavigate('dashboard')} className={\`nav-link \${currentView === 'dashboard' ? 'active' : ''}\`}>Dashboard</button>
                    <button onClick={() => onNavigate('evaluator')} className={\`nav-link \${currentView === 'evaluator' ? 'active' : ''}\`}>Evaluate Idea</button>
                    <button onClick={() => onNavigate('careers')} className={\`nav-link \${currentView === 'careers' ? 'active' : ''}\`}>Careers</button>
                    <button onClick={() => onNavigate('study')} className={\`nav-link \${currentView === 'study' ? 'active' : ''}\`}>Study</button>`;

const newLinks = `<button onClick={() => onNavigate('dashboard')} className={\`nav-link \${currentView === 'dashboard' ? 'active' : ''}\`}>Dashboard</button>
                    <button onClick={() => onNavigate('evaluator')} className={\`nav-link \${currentView === 'evaluator' ? 'active' : ''}\`}>Evaluate</button>
                    <button onClick={() => onNavigate('careers')} className={\`nav-link \${currentView === 'careers' ? 'active' : ''}\`}>Careers</button>
                    <button onClick={() => onNavigate('study')} className={\`nav-link \${currentView === 'study' ? 'active' : ''}\`}>Study</button>
                    <button onClick={() => onNavigate('forum')} className={\`nav-link \${currentView === 'forum' ? 'active' : ''}\`}>Community</button>`;

content = content.replace(oldLinks, newLinks);

const profileMenuOld = `<button className="dropdown-item" onClick={() => onNavigate('profile')}>Profile</button>`;
const profileMenuNew = `<button className="dropdown-item" onClick={() => onNavigate('profile')}>Profile</button>
                                        <button className="dropdown-item" onClick={() => onNavigate('admin')}>Admin</button>`;

content = content.replace(profileMenuOld, profileMenuNew);

fs.writeFileSync('src/components/Navbar.jsx', content);
