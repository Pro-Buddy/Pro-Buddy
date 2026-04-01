import { useState } from 'react';
import { useToast } from './Toast';

// ---- Curated Study Resources ----
const STUDY_DATABASE = {
    'data-structures': {
        label: 'Data Structures',
        description: 'Arrays, Linked Lists, Trees, Graphs, Stacks, Queues, and more.',
        youtube: [
            { channel: 'Abdul Bari', title: 'Data Structures Full Course', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM', lang: 'English' },
            { channel: 'Striver (take U forward)', title: 'Strivers A2Z DSA Sheet', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz', lang: 'English/Hindi' },
            { channel: 'Kunal Kushwaha', title: 'DSA Bootcamp (Java)', url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ', lang: 'English/Hindi' },
            { channel: 'mycodeschool', title: 'Data Structures', url: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P', lang: 'English' },
            { channel: 'Jenny\'s Lectures', title: 'DSA Playlist', url: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU', lang: 'English/Hindi' },
        ],
        websites: [
            { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/data-structures/', desc: 'Comprehensive DSA tutorials' },
            { name: 'LeetCode', url: 'https://leetcode.com/', desc: 'Practice problems by topic' },
            { name: 'Visualgo', url: 'https://visualgo.net/', desc: 'Visualize data structures' },
            { name: 'NeetCode', url: 'https://neetcode.io/', desc: 'Curated problem roadmap' },
        ]
    },
    'algorithms': {
        label: 'Algorithms',
        description: 'Sorting, Searching, DP, Greedy, Backtracking, Graph algorithms.',
        youtube: [
            { channel: 'Abdul Bari', title: 'Algorithms Course', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O', lang: 'English' },
            { channel: 'Striver (take U forward)', title: 'Dynamic Programming', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY', lang: 'English/Hindi' },
            { channel: 'Errichto', title: 'Competitive Programming', url: 'https://www.youtube.com/c/Errichto', lang: 'English' },
        ],
        websites: [
            { name: 'CP-Algorithms', url: 'https://cp-algorithms.com/', desc: 'Algorithm encyclopedia' },
            { name: 'Codeforces', url: 'https://codeforces.com/', desc: 'Competitive programming' },
            { name: 'HackerRank', url: 'https://www.hackerrank.com/', desc: 'Practice & certify' },
        ]
    },
    'operating-systems': {
        label: 'Operating Systems',
        description: 'Process management, Memory, Scheduling, Deadlocks, File Systems.',
        youtube: [
            { channel: 'Gate Smashers', title: 'OS Complete Course', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Operating Systems', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O', lang: 'English' },
            { channel: 'Knowledge Gate', title: 'OS Tutorials', url: 'https://www.youtube.com/c/ABOREDSTUDENT', lang: 'Hindi' },
        ],
        websites: [
            { name: 'GeeksforGeeks OS', url: 'https://www.geeksforgeeks.org/operating-systems/', desc: 'OS concepts & GATE prep' },
            { name: 'OS-Dev Wiki', url: 'https://wiki.osdev.org/', desc: 'OS development resources' },
        ]
    },
    'dbms': {
        label: 'Database Management (DBMS)',
        description: 'SQL, Normalization, Transactions, Indexing, NoSQL concepts.',
        youtube: [
            { channel: 'Gate Smashers', title: 'DBMS Full Course', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y', lang: 'Hindi' },
            { channel: 'Jenny\'s Lectures', title: 'DBMS', url: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31b33kF46f9aFjoJPOkdlsRc', lang: 'English/Hindi' },
            { channel: 'freeCodeCamp', title: 'SQL Full Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', lang: 'English' },
        ],
        websites: [
            { name: 'SQLZoo', url: 'https://sqlzoo.net/', desc: 'Interactive SQL tutorials' },
            { name: 'W3Schools SQL', url: 'https://www.w3schools.com/sql/', desc: 'SQL reference' },
            { name: 'MongoDB University', url: 'https://university.mongodb.com/', desc: 'Free MongoDB courses' },
        ]
    },
    'computer-networks': {
        label: 'Computer Networks',
        description: 'OSI, TCP/IP, Routing, DNS, HTTP, Network Security.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Computer Networks', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Computer Networks', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx', lang: 'English' },
            { channel: 'Kurose and Ross', title: 'CN Textbook Lectures', url: 'https://www.youtube.com/c/JimKurose', lang: 'English' },
        ],
        websites: [
            { name: 'GeeksforGeeks CN', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/', desc: 'Network concepts' },
            { name: 'Computerphile', url: 'https://www.youtube.com/user/Computerphile', desc: 'Deep dives into networking' },
        ]
    },
    'web-development': {
        label: 'Web Development',
        description: 'HTML, CSS, JavaScript, React, Node.js, Full Stack.',
        youtube: [
            { channel: 'Traversy Media', title: 'Web Dev Crash Courses', url: 'https://www.youtube.com/c/TraversyMedia', lang: 'English' },
            { channel: 'The Net Ninja', title: 'Full Stack Tutorials', url: 'https://www.youtube.com/c/TheNetNinja', lang: 'English' },
            { channel: 'Chai aur Code', title: 'JavaScript & React (Hindi)', url: 'https://www.youtube.com/c/HiteshChoudharydotcom', lang: 'Hindi' },
            { channel: 'freeCodeCamp', title: 'Full Web Dev Course', url: 'https://www.youtube.com/c/Freecodecamp', lang: 'English' },
        ],
        websites: [
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', desc: 'Official web reference' },
            { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', desc: 'Free certifications' },
            { name: 'The Odin Project', url: 'https://www.theodinproject.com/', desc: 'Full stack curriculum' },
            { name: 'JavaScript.info', url: 'https://javascript.info/', desc: 'Modern JS tutorial' },
        ]
    },
    'machine-learning': {
        label: 'Machine Learning & AI',
        description: 'Supervised/Unsupervised learning, Neural Networks, NLP, CV.',
        youtube: [
            { channel: 'Andrew Ng (Stanford)', title: 'Machine Learning Course', url: 'https://www.youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI', lang: 'English' },
            { channel: 'Krish Naik', title: 'ML Full Course (Hindi)', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe', lang: 'Hindi' },
            { channel: '3Blue1Brown', title: 'Neural Networks', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', lang: 'English' },
            { channel: 'Sentdex', title: 'ML with Python', url: 'https://www.youtube.com/c/sentdex', lang: 'English' },
        ],
        websites: [
            { name: 'Coursera ML (Andrew Ng)', url: 'https://www.coursera.org/learn/machine-learning', desc: 'Gold standard ML course' },
            { name: 'Fast.ai', url: 'https://www.fast.ai/', desc: 'Practical deep learning' },
            { name: 'Kaggle', url: 'https://www.kaggle.com/', desc: 'Datasets & competitions' },
            { name: 'Papers With Code', url: 'https://paperswithcode.com/', desc: 'Latest ML research' },
        ]
    },
    'system-design': {
        label: 'System Design',
        description: 'Scalability, Load Balancing, Caching, Microservices, CAP theorem.',
        youtube: [
            { channel: 'Gaurav Sen', title: 'System Design', url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', lang: 'English' },
            { channel: 'Tech Dummies (Narendra)', title: 'System Design', url: 'https://www.youtube.com/c/TechDummiesNarendraL', lang: 'English' },
            { channel: 'ByteByteGo', title: 'System Design Concepts', url: 'https://www.youtube.com/c/ByteByteGo', lang: 'English' },
        ],
        websites: [
            { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', desc: 'GitHub study guide' },
            { name: 'HighScalability', url: 'http://highscalability.com/', desc: 'Real-world architecture' },
        ]
    },
    'theory-of-computation': {
        label: 'Theory of Computation',
        description: 'Automata, Context-Free Grammars, Turing Machines, P vs NP.',
        youtube: [
            { channel: 'Gate Smashers', title: 'TOC Full Course', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Theory of Computation', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev', lang: 'English' },
            { channel: 'Knowledge Gate', title: 'TOC Tutorials', url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesSfvj6OtG66_vO9AonO8809', lang: 'Hindi' },
        ],
        websites: [
            { name: 'GeeksforGeeks TOC', url: 'https://www.geeksforgeeks.org/theory-of-computation-automata-tutorials/', desc: 'Automata theory notes' },
            { name: 'JFLAP', url: 'http://www.jflap.org/', desc: 'Tool for experimenting with automata' },
        ]
    },
    'compiler-design': {
        label: 'Compiler Design',
        description: 'Lexical Analysis, Parsing, Code Generation, Optimization.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Compiler Design', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFzGuS0-mH7C62Ene-XNoxH', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Compiler Design', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRj6btKskZ7oTsu_8_E9fW4j', lang: 'English' },
        ],
        websites: [
            { name: 'GeeksforGeeks CD', url: 'https://www.geeksforgeeks.org/compiler-design-tutorials/', desc: 'Compiler construction notes' },
        ]
    },
    'computer-architecture': {
        label: 'Computer Organization & Architecture (COA)',
        description: 'CPU Design, Pipelining, Memory Hierarchy, I/O Interfacing.',
        youtube: [
            { channel: 'Gate Smashers', title: 'COA Full Course', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Computer Organization', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgLLlzdgiTUKULKJpriejZ4', lang: 'English' },
            { channel: 'Education 4u', title: 'COA Tutorials', url: 'https://www.youtube.com/playlist?list=PLV8vIYTIdSnaY6S6MstH5V6_M-R06B1-r', lang: 'English' },
        ],
        websites: [
            { name: 'GeeksforGeeks COA', url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/', desc: 'Hardware architecture notes' },
        ]
    },
    'software-engineering': {
        label: 'Software Engineering',
        description: 'SDLC, Agile, Design Patterns, Testing, Project Management.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Software Engineering', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKADgn96Lb9nyA9zRY', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Software Engineering', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgg33kPfvMeUf4Zz_l2Xkuy', lang: 'English' },
        ],
        websites: [
            { name: 'GeeksforGeeks SE', url: 'https://www.geeksforgeeks.org/software-engineering-tutorial/', desc: 'SDLC & methodologies' },
            { name: 'Agile Alliance', url: 'https://www.agilealliance.org/', desc: 'Agile resources' },
        ]
    },
    'discrete-mathematics': {
        label: 'Discrete Mathematics',
        description: 'Set Theory, Graph Theory, Combinatorics, Logic, Relations.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Discrete Mathematics', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGanHUW9Dr0pGf36pPlEtuq', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Discrete Math', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhqJPDXcvYlLf5uu7L-7p8f', lang: 'English' },
            { channel: 'TrevTutor', title: 'Discrete Math 1', url: 'https://www.youtube.com/playlist?list=PLDmqN0oZfImo_vLhX5wWj5Ube0S8Oq_u7', lang: 'English' },
        ],
        websites: [
            { name: 'GeeksforGeeks Discrete', url: 'https://www.geeksforgeeks.org/discrete-mathematics-tutorials/', desc: 'Math for CS' },
        ]
    },
    'cyber-security': {
        label: 'Cybersecurity',
        description: 'Cryptography, Network Security, Ethical Hacking, Forensics.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Information Security', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGWp6STpSIdhXAnR_v2r6t3', lang: 'Hindi' },
            { channel: 'freeCodeCamp', title: 'Cybersecurity Course', url: 'https://www.youtube.com/watch?v=nzj7Wg4DAbs', lang: 'English' },
            { channel: 'NetworkChuck', title: 'Ethical Hacking', url: 'https://www.youtube.com/c/NetworkChuck', lang: 'English' },
        ],
        websites: [
            { name: 'Cybrary', url: 'https://www.cybrary.it/', desc: 'Free cybersecurity training' },
            { name: 'TryHackMe', url: 'https://tryhackme.com/', desc: 'Hands-on security practice' },
        ]
    },
    'cloud-computing': {
        label: 'Cloud Computing',
        description: 'AWS, Azure, virtualization, SaaS/PaaS/IaaS, Distributed Systems.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Cloud Computing', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGZ_FasS8VstT8TsiisY8uV', lang: 'Hindi' },
            { channel: 'Neso Academy', title: 'Cloud Computing', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgPnd1K56u7Z6uHeZ-5f784', lang: 'English' },
            { channel: 'AWS Training', title: 'AWS Cloud Practitioner', url: 'https://www.youtube.com/playlist?list=PLvS9_u5f-Z7WzIAnrW4Zz3-C8nJ-X2lW4', lang: 'English' },
        ],
        websites: [
            { name: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/', desc: 'Official AWS learning' },
            { name: 'IBM Cloud Learn', url: 'https://www.ibm.com/cloud/learn', desc: 'Cloud fundamentals' },
        ]
    },
    'artificial-intelligence': {
        label: 'Artificial Intelligence',
        description: 'State Space Search, Heuristics, Logic, Expert Systems, Robotics.',
        youtube: [
            { channel: 'Gate Smashers', title: 'Artificial Intelligence', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGh6_h7baBy7p_W_13iOnJ', lang: 'Hindi' },
            { channel: 'Education 4u', title: 'AI Tutorials', url: 'https://www.youtube.com/playlist?list=PLV8vIYTIdSnZp7ZlS_523uD07mO6r8_o3', lang: 'English' },
        ],
        websites: [
            { name: 'GeeksforGeeks AI', url: 'https://www.geeksforgeeks.org/artificial-intelligence-tutorials/', desc: 'AI concepts' },
        ]
    },
    'digital-logic-design': {
        label: 'Digital Logic Design (DLD)',
        description: 'Logic Gates, K-Maps, Sequential Circuits, Combinational Logic.',
        youtube: [
            { channel: 'Neso Academy', title: 'Digital Electronics', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRis89uzZESM5NquWkL7G3K7', lang: 'English' },
            { channel: 'Gate Smashers', title: 'Digital Electronics', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGmXg4NoX_uy1PWnLntS0S2', lang: 'Hindi' },
        ],
        websites: [
            { name: 'Digital Logic Simulator', url: 'https://circuitverse.org/', desc: 'Online logic simulator' },
        ]
    },
};

const TOPIC_LIST = Object.entries(STUDY_DATABASE).map(([key, val]) => ({ value: key, label: val.label }));

export default function ProStudy({ onNavigate }) {
    const showToast = useToast();
    const [selectedTopic, setSelectedTopic] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [result, setResult] = useState(null);
    const [showForm, setShowForm] = useState(true);

    function search() {
        let topic = selectedTopic;
        if (!topic && customTopic.trim()) {
            const lower = customTopic.toLowerCase();
            const found = Object.entries(STUDY_DATABASE).find(([key, val]) =>
                val.label.toLowerCase().includes(lower) || key.includes(lower.replace(/\s+/g, '-')) || val.description.toLowerCase().includes(lower)
            );
            if (found) {
                topic = found[0];
            } else {
                // Return a "custom search" result if no internal match is found
                setResult({
                    label: customTopic,
                    description: `Custom search results for "${customTopic}". Use the links below to explore high-quality resources.`,
                    youtube: [
                        { channel: 'YouTube Search', title: `Top results for ${customTopic}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(customTopic)}+tutorial`, lang: 'Global' }
                    ],
                    websites: [
                        { name: 'Google Search', url: `https://www.google.com/search?q=${encodeURIComponent(customTopic)}+documentation`, desc: 'Search for official documentation and tutorials.' },
                        { name: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search?q=${encodeURIComponent(customTopic)}`, desc: 'Search GeeksforGeeks for specific topics.' }
                    ]
                });
                setShowForm(false);
                return;
            }
        }
        if (!topic) { showToast('⚠️ Please select or enter a topic.'); return; }
        setResult(STUDY_DATABASE[topic]);
        setShowForm(false);
    }

    function reset() { setResult(null); setShowForm(true); setSelectedTopic(''); setCustomTopic(''); }

    return (
        <section className="study-section" id="proStudy" style={{ paddingTop: '20px' }}>
            <div className="view-header-minimal">
                <button className="btn btn-back" onClick={() => onNavigate('dashboard')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </button>
            </div>
            <div className="section-container">
                <div className="section-header">
                    <span className="section-tag" style={{ background: 'rgba(255,107,157,0.1)', color: '#ff6b9d' }}>📚 Learning Guide</span>
                    <h2 className="section-title">Pro <span style={{ color: '#ff6b9d' }}>Study</span></h2>
                    <p className="section-desc">Confused about a topic? Select it below and get the best curated YouTube tutorials and web resources.</p>
                </div>

                {showForm ? (
                    <div className="study-form-container eval-form-container">
                        <div className="form-group">
                            <label>Select a Topic <span className="required">*</span></label>
                            <div className="topic-grid">
                                {TOPIC_LIST.map(t => (
                                    <button type="button" key={t.value} className={`topic-chip${selectedTopic === t.value ? ' active' : ''}`} onClick={() => setSelectedTopic(t.value)}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Or type a topic</label>
                            <input type="text" placeholder="e.g., Operating Systems, React, DBMS..." value={customTopic} onChange={e => setCustomTopic(e.target.value)} />
                        </div>
                        <button type="button" className="btn btn-lg btn-full" style={{ background: 'linear-gradient(135deg, #ff6b9d, #ff4757)' }} onClick={search}>
                            📚 Find Best Resources
                        </button>
                    </div>
                ) : result && (
                    <div className="study-results eval-results-container" style={{ display: 'block' }}>
                        <div className="results-header">
                            <h3>📚 {result.label}</h3>
                            <button className="btn btn-ghost btn-sm" onClick={reset}>← Search Another Topic</button>
                        </div>
                        <p className="study-desc">{result.description}</p>

                        <div className="study-section-block">
                            <h4 className="study-block-title">🎬 Best YouTube Resources</h4>
                            <div className="study-yt-grid">
                                {result.youtube.map((yt, i) => (
                                    <a href={yt.url} target="_blank" rel="noopener noreferrer" className="study-yt-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="study-yt-icon">▶️</div>
                                        <div>
                                            <h5 className="study-yt-channel">{yt.channel}</h5>
                                            <p className="study-yt-title">{yt.title}</p>
                                            <span className="study-yt-lang">{yt.lang}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="study-section-block">
                            <h4 className="study-block-title">🌐 Best Web Resources</h4>
                            <div className="study-web-grid">
                                {result.websites.map((w, i) => (
                                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="study-web-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                        <h5 className="study-web-name">{w.name}</h5>
                                        <p className="study-web-desc">{w.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
