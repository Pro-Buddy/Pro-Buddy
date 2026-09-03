const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(
    /import Footer from '.\/components\/Footer';/,
    `import Footer from './components/Footer';\nimport Chatbot from './components/Chatbot';\nimport AdminPanel from './components/AdminPanel';\nimport Forum from './components/Forum';`
);

content = content.replace(
    /<Footer \/>/,
    `<Footer />\n            {isAuthed && <Chatbot currentView={currentView} />}`
);

// Add views routing in renderView
content = content.replace(
    /case 'profile': return <ProfileSection onNavigate={setCurrentView} \/>;/,
    `case 'profile': return <ProfileSection onNavigate={setCurrentView} />;\n            case 'admin': return <AdminPanel onNavigate={setCurrentView} />;\n            case 'forum': return <Forum onNavigate={setCurrentView} />;`
);

fs.writeFileSync('src/App.jsx', content);
