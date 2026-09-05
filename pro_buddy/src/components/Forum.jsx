import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const SEED_POSTS = [
    {
        id: 'seed-1',
        author: {
            name: 'Devansh Rao',
            initials: 'DR',
            headline: 'Backend Engineer @ Razorpay · B.Tech CSE',
            college: 'Central Administration Alum'
        },
        category: 'knowledge',
        title: 'System Design: Mitigating Cache Stampede using Probabilistic Early Expiration (XFetch)',
        content: `When a high-traffic key in Redis expires, hundreds of concurrent requests query the database at the exact same millisecond. This "thundering herd" or Cache Stampede can bring down your primary DB.\n\nWhile mutex locks (distributed locking) work, they introduce latency bottlenecks. A far more elegant algorithm is XFetch (Probabilistic Early Expiration):\n\nInstead of checking if the key is strictly expired, a worker calculates:\nΔ - β * ln(rand()) * computation_time > TTL\nIf true, it preemptively recalculates the cache before actual expiry in the background!`,
        takeaways: [
            'Avoids mutex lock contention under 20k+ QPS',
            'Optimal β value is typically 1.0 (empirically tested)',
            'Zero read downtime for critical dashboard and feed caches'
        ],
        codeSnippet: `// Example XFetch logic in Node.js
function shouldPrecompute(ttlRemaining, deltaSec, beta = 1.0) {
    const random = Math.random();
    return (deltaSec * beta * Math.log(random) * -1) >= ttlRemaining;
}`,
        tags: ['SystemDesign', 'Redis', 'HighConcurrency', 'BackendArchitecture'],
        likes: 54,
        reactions: { insightful: 32, helpful: 14, brilliant: 8 },
        commentsCount: 9,
        comments: [
            {
                id: 'c-1',
                authorName: 'Aman Joshi',
                authorInitials: 'AJ',
                headline: '3rd Year CSE @ IIIT Hyderabad',
                time: '2h ago',
                text: 'We faced this exact issue during our college fest registration portal when 4000 students refreshed simultaneously. Implemented Redis mutex initially, but XFetch looks much cleaner!',
                likes: 4
            },
            {
                id: 'c-2',
                authorName: 'Pooja Reddy',
                authorInitials: 'PR',
                headline: 'SDE Intern @ Swiggy',
                time: '1h ago',
                text: 'Great explanation Devansh! Does this assume delta computation time is relatively constant across runs?',
                likes: 2
            }
        ],
        createdAt: '4h ago',
        rawTimestamp: Date.now() - 14400000
    },
    {
        id: 'seed-2',
        author: {
            name: 'Ananya Deshmukh',
            initials: 'AD',
            headline: 'Final Year CSE · AI/ML Researcher',
            college: 'VNR VJIET'
        },
        category: 'projects',
        title: 'Showcase: Built an Offline-First In-Browser RAG Engine with Transformers.js & IndexedDB',
        content: `Excited to open-source our final year project: "LocalRag.js" — a full Retrieval-Augmented Generation pipeline running 100% on the client browser without sending private documents to any cloud server.\n\nWe quantized all-MiniLM-L6-v2 embeddings using ONNX WebRuntime (Wasm SIMD), chunk markdown/PDFs in a web worker, and query nearest cosine neighbors in IndexedDB vectors in under 18ms.`,
        takeaways: [
            'Zero cloud API billing or token limits',
            'Full data privacy for sensitive academic notes & thesis work',
            'Runs smoothly on modern laptops with standard Chrome/Edge'
        ],
        link: {
            title: 'GitHub - localrag-browser-engine',
            url: 'https://github.com/example/localrag-browser-engine'
        },
        tags: ['ProjectShowcase', 'AI', 'Transformers', 'WebAssembly', 'OpenSource'],
        likes: 82,
        reactions: { insightful: 45, helpful: 20, brilliant: 17 },
        commentsCount: 14,
        comments: [
            {
                id: 'c-3',
                authorName: 'Vikram Mehta',
                authorInitials: 'VM',
                headline: 'Full Stack Developer',
                time: '3h ago',
                text: 'Tested the demo — loading the ONNX model from cache was super fast. How are you handling PDF text extraction without canvas bloat?',
                likes: 6
            }
        ],
        createdAt: '7h ago',
        rawTimestamp: Date.now() - 25200000
    },
    {
        id: 'seed-3',
        author: {
            name: 'Kavya Nair',
            initials: 'KN',
            headline: 'Incoming SDE @ Microsoft · 4x Hackathon Winner',
            college: 'NIT Trichy'
        },
        category: 'career',
        title: 'Interview Insights: The 8 DSA Patterns that actually got me an SDE offer over 600+ Random LeetCode',
        content: `A big mistake I made early on was randomly grinding 500+ LeetCode problems without grouping patterns. In real interviews, company problem variations always map back to core archetypes.\n\nHere are the top 4 that appeared in all 5 rounds:\n1. Fast & Slow Pointers (Cycle Detection & Middle of Linked List)\n2. Sliding Window with Variable Length (Substring constraints)\n3. Monotonic Stack (Next Greater Element & Stock Span)\n4. Topological Sort (Course Schedule & Build Dependency Graphs)`,
        takeaways: [
            'Master pattern identification before writing code',
            'Always explain Big-O space trade-offs out loud first',
            'Write test cases with empty array, duplicate elements, and max values'
        ],
        tags: ['CareerPrep', 'DSA', 'InterviewExperience', 'SDE1', 'Microsoft'],
        likes: 124,
        reactions: { insightful: 78, helpful: 32, brilliant: 14 },
        commentsCount: 22,
        comments: [
            {
                id: 'c-4',
                authorName: 'Rohan Gupta',
                authorInitials: 'RG',
                headline: '2nd Year Student',
                time: '5h ago',
                text: 'Bookmarked! Monotonic stack was always tricky for me until I visualized the elements waiting for their smaller/larger neighbor.',
                likes: 8
            }
        ],
        createdAt: 'Yesterday',
        rawTimestamp: Date.now() - 86400000
    },
    {
        id: 'seed-4',
        author: {
            name: 'Arjun Patel',
            initials: 'AP',
            headline: 'Systems & Cloud Enthusiast · 3rd Year ECE',
            college: 'Central University'
        },
        category: 'questions',
        title: 'Tech Architecture Doubt: PostgreSQL JSONB vs MongoDB for deeply nested dynamic e-commerce specs?',
        content: `We are building a multi-vendor hardware marketplace where each category (e.g. Microcontrollers, Oscilloscopes, Resistors) has 30+ distinct technical parameters.\n\nTeam is debating:\nOption A: Postgres relational tables with a JSONB column for custom attributes + GIN indexing.\nOption B: Dedicated MongoDB collection with flexible schema.\n\nGiven that orders and payments must maintain strict ACID transactions, does Postgres JSONB have any latency bottlenecks when filtering multiple nested JSON keys?`,
        takeaways: [
            'Needs strict ACID on inventory & checkouts',
            'Filters need to query specs across 50,000+ hardware SKUs',
            'Curious about GIN index maintenance overhead on write operations'
        ],
        tags: ['Databases', 'PostgreSQL', 'MongoDB', 'SystemArchitecture', 'AskCommunity'],
        likes: 39,
        reactions: { insightful: 18, helpful: 14, brilliant: 7 },
        commentsCount: 16,
        comments: [
            {
                id: 'c-5',
                authorName: 'Karan Sen',
                authorInitials: 'KS',
                headline: 'DBA & Senior Dev',
                time: '8h ago',
                text: 'Go with Postgres JSONB without hesitation. You get full relational integrity for transactions, and jsonb_path_ops GIN indexing makes filtering nested attributes blazing fast.',
                likes: 11
            }
        ],
        createdAt: '2 days ago',
        rawTimestamp: Date.now() - 172800000
    }
];

const KNOWLEDGE_CHANNELS = [
    { tag: 'SystemDesign', label: '#SystemDesign', count: '1.4k peers' },
    { tag: 'ProjectShowcase', label: '#ProjectShowcase', count: '920 peers' },
    { tag: 'AI', label: '#AI_Engineering', count: '2.1k peers' },
    { tag: 'DSA', label: '#DSA_ProblemSolving', count: '3.5k peers' },
    { tag: 'BackendArchitecture', label: '#BackendArchitecture', count: '870 peers' },
    { tag: 'CareerPrep', label: '#CareerPrep', count: '2.8k peers' }
];

const TRENDING_TOPICS = [
    { rank: '01', title: 'Why Postgres JSONB is replacing standalone Document DBs', subtitle: '38 peers discussing' },
    { rank: '02', title: 'Gemini 2.5 Flash vs Local Small Models on edge devices', subtitle: '64 peers discussing' },
    { rank: '03', title: 'Smart India Hackathon (SIH) 2026 Problem Statements', subtitle: '89 peers discussing' },
    { rank: '04', title: 'Event Sourcing with Kafka vs Polling Architectures', subtitle: '27 peers discussing' },
    { rank: '05', title: 'Top 10 Monotonic Stack Interview Questions', subtitle: '45 peers discussing' }
];

const PEER_MENTORS = [
    { id: 'm-1', name: 'Tanvi Saxena', initials: 'TS', role: 'Full Stack & DevOps · 4th Year', college: 'BITS Pilani' },
    { id: 'm-2', name: 'Dr. Nikhil Rao', initials: 'NR', role: 'Distributed Systems Mentor', college: 'Ex-Amazon / IIT-M' },
    { id: 'm-3', name: 'Siddharth Varma', initials: 'SV', role: 'Core AI & Vision Researcher', college: 'IIT Bombay' }
];

export default function Forum({ onNavigate }) {
    const { user, getInitials } = useAuth();
    const showToast = useToast();

    // Storage persistence
    const [posts, setPosts] = useState(() => {
        try {
            const saved = localStorage.getItem('probuddy_community_feed');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // fallback
        }
        return SEED_POSTS;
    });

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState(null);
    const [sortBy, setSortBy] = useState('trending');

    // Reactions & Bookmarks
    const [userReactions, setUserReactions] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('probuddy_user_reactions') || '{}');
        } catch {
            return {};
        }
    });

    const [savedPostIds, setSavedPostIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('probuddy_saved_posts') || '[]');
        } catch {
            return [];
        }
    });

    const [connectedMentors, setConnectedMentors] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('probuddy_connected_mentors') || '[]');
        } catch {
            return [];
        }
    });

    // Interactive comments & inputs
    const [expandedComments, setExpandedComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});

    // Composer Modal
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [composerCategory, setComposerCategory] = useState('knowledge');
    const [composerTitle, setComposerTitle] = useState('');
    const [composerContent, setComposerContent] = useState('');
    const [composerTakeaways, setComposerTakeaways] = useState('');
    const [composerCode, setComposerCode] = useState('');
    const [composerLinkUrl, setComposerLinkUrl] = useState('');
    const [composerLinkTitle, setComposerLinkTitle] = useState('');
    const [composerTags, setComposerTags] = useState('');

    // Sync to local storage
    useEffect(() => {
        try {
            localStorage.setItem('probuddy_community_feed', JSON.stringify(posts));
        } catch (e) {
            console.warn('Failed saving community feed:', e);
        }
    }, [posts]);

    useEffect(() => {
        try {
            localStorage.setItem('probuddy_user_reactions', JSON.stringify(userReactions));
        } catch {
            // ignore
        }
    }, [userReactions]);

    useEffect(() => {
        try {
            localStorage.setItem('probuddy_saved_posts', JSON.stringify(savedPostIds));
        } catch {
            // ignore
        }
    }, [savedPostIds]);

    useEffect(() => {
        try {
            localStorage.setItem('probuddy_connected_mentors', JSON.stringify(connectedMentors));
        } catch {
            // ignore
        }
    }, [connectedMentors]);

    // Current user representation
    const currentUserInitials = getInitials ? getInitials(user?.name) : (user?.name?.slice(0, 2).toUpperCase() || 'PB');
    const currentUserName = user?.name || 'Fellow Engineer';
    const currentUserHeadline = user?.bio || user?.college || 'B.Tech Student & Technologist';

    // Handle Reaction Toggle
    const handleToggleReaction = (postId, reactionType = 'insightful') => {
        const currentReaction = userReactions[postId];
        const isRemoving = currentReaction === reactionType;

        setUserReactions(prev => {
            const next = { ...prev };
            if (isRemoving) {
                delete next[postId];
            } else {
                next[postId] = reactionType;
            }
            return next;
        });

        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id !== postId) return p;
            const updatedLikes = isRemoving ? Math.max(0, p.likes - 1) : p.likes + 1;
            const currentReactions = { ...(p.reactions || { insightful: p.likes, helpful: 0, brilliant: 0 }) };
            
            if (isRemoving) {
                currentReactions[reactionType] = Math.max(0, (currentReactions[reactionType] || 1) - 1);
            } else {
                if (currentReaction && currentReactions[currentReaction]) {
                    currentReactions[currentReaction] = Math.max(0, currentReactions[currentReaction] - 1);
                }
                currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
            }

            return {
                ...p,
                likes: updatedLikes,
                reactions: currentReactions
            };
        }));

        if (!isRemoving) {
            showToast(` Reacted to "${posts.find(p => p.id === postId)?.title?.slice(0, 30)}..."`);
        }
    };

    // Handle Comment Submit
    const handleAddComment = (postId) => {
        const text = (commentInputs[postId] || '').trim();
        if (!text) return;

        const newComment = {
            id: 'c-' + Date.now(),
            authorName: currentUserName,
            authorInitials: currentUserInitials,
            headline: currentUserHeadline,
            time: 'Just now',
            text: text,
            likes: 0
        };

        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id !== postId) return p;
            const commentsList = p.comments || [];
            return {
                ...p,
                commentsCount: (p.commentsCount || 0) + 1,
                comments: [newComment, ...commentsList]
            };
        }));

        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        setExpandedComments(prev => ({ ...prev, [postId]: true }));
        showToast(' Knowledge comment published!');
    };

    // Handle Save / Bookmark
    const handleToggleBookmark = (postId) => {
        setSavedPostIds(prev => {
            const exists = prev.includes(postId);
            const next = exists ? prev.filter(id => id !== postId) : [...prev, postId];
            showToast(exists ? ' Removed from Saved Insights' : ' Saved to your Knowledge Hub');
            return next;
        });
    };

    // Handle Share Post
    const handleSharePost = (post) => {
        const shareText = `Check out this knowledge post on Pro Buddy Community:\n"${post.title}"\nBy ${post.author.name}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            showToast(' Post knowledge summary copied to clipboard!');
        } else {
            showToast(' Link shared!');
        }
    };

    // Handle Mentor Connect Toggle
    const handleToggleMentor = (mentorId, mentorName) => {
        setConnectedMentors(prev => {
            const isConnected = prev.includes(mentorId);
            const next = isConnected ? prev.filter(id => id !== mentorId) : [...prev, mentorId];
            showToast(isConnected ? `Unfollowed ${mentorName}` : ` Connected with ${mentorName}`);
            return next;
        });
    };

    // Handle New Knowledge Post Creation
    const handlePublishPost = (e) => {
        e.preventDefault();
        if (!composerTitle.trim()) {
            showToast(' Please provide a clear headline or title.');
            return;
        }
        if (!composerContent.trim()) {
            showToast(' Please write your insights or knowledge breakdown.');
            return;
        }

        const parsedTakeaways = composerTakeaways
            .split('\n')
            .map(t => t.trim())
            .filter(Boolean);

        const parsedTags = composerTags
            .split(',')
            .map(t => t.replace(/#/g, '').trim())
            .filter(Boolean);

        if (parsedTags.length === 0) {
            parsedTags.push(composerCategory === 'knowledge' ? 'TechInsight' : 'Discussion');
        }

        const createdPost = {
            id: 'post-' + Date.now(),
            author: {
                name: currentUserName,
                initials: currentUserInitials,
                headline: currentUserHeadline,
                college: user?.college || 'Pro Buddy Technologist'
            },
            category: composerCategory,
            title: composerTitle.trim(),
            content: composerContent.trim(),
            takeaways: parsedTakeaways.length > 0 ? parsedTakeaways : null,
            codeSnippet: composerCode.trim() ? composerCode.trim() : null,
            link: composerLinkUrl.trim() ? {
                title: composerLinkTitle.trim() || composerLinkUrl.trim(),
                url: composerLinkUrl.trim()
            } : null,
            tags: parsedTags,
            likes: 1,
            reactions: { insightful: 1, helpful: 0, brilliant: 0 },
            commentsCount: 0,
            comments: [],
            createdAt: 'Just now',
            rawTimestamp: Date.now()
        };

        setPosts(prev => [createdPost, ...prev]);
        setUserReactions(prev => ({ ...prev, [createdPost.id]: 'insightful' }));
        setIsComposerOpen(false);

        // Reset form
        setComposerTitle('');
        setComposerContent('');
        setComposerTakeaways('');
        setComposerCode('');
        setComposerLinkUrl('');
        setComposerLinkTitle('');
        setComposerTags('');

        showToast(' Knowledge post successfully shared with the community!');
    };

    // Filter & Sort computation
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Category filter
        if (activeFilter === 'saved') {
            result = result.filter(p => savedPostIds.includes(p.id));
        } else if (activeFilter !== 'all') {
            result = result.filter(p => p.category === activeFilter);
        }

        // Hashtag filter
        if (activeTag) {
            result = result.filter(p => (p.tags || []).some(t => t.toLowerCase() === activeTag.toLowerCase()));
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.content.toLowerCase().includes(q) ||
                p.author.name.toLowerCase().includes(q) ||
                (p.tags || []).some(t => t.toLowerCase().includes(q))
            );
        }

        // Sorting
        if (sortBy === 'recent') {
            result.sort((a, b) => (b.rawTimestamp || 0) - (a.rawTimestamp || 0));
        } else if (sortBy === 'discussed') {
            result.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
        } else {
            // Trending
            result.sort((a, b) => (b.likes * 2 + (b.commentsCount || 0) * 3) - (a.likes * 2 + (a.commentsCount || 0) * 3));
        }

        return result;
    }, [posts, activeFilter, activeTag, searchQuery, sortBy, savedPostIds]);

    return (
        <div className="community-wrapper" style={{ paddingTop: '20px' }}>
            {/* Top Navigation & Minimal Back */}
            <div style={{ marginBottom: '16px', display: 'flex' }}>
                <button className="btn btn-back" onClick={() => onNavigate('dashboard')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </button>
            </div>

            {/* LinkedIn-Style Community Banner */}
            <div className="community-hero-bar">
                <div className="community-hero-left">
                    <h2 className="gradient-text">Pro Buddy Community</h2>
                    <p>Share insights, projects, and career advice.</p>
                </div>
                <div className="community-hero-actions">
                    <div className="community-search-box">
                        <svg className="community-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input
                            type="text"
                            placeholder="Search topics, tags, peers..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsComposerOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Start a Post
                    </button>
                </div>
            </div>

            {/* 3-Column LinkedIn Layout */}
            <div className="community-layout-grid">
                
                {/* 1. LEFT COLUMN: User Profile Card & Knowledge Channels */}
                <aside className="community-left-col">
                    {/* User Profile Card */}
                    <div className="linkedin-card">
                        <div className="profile-card-cover"></div>
                        <div className="profile-card-body">
                            <div className="profile-avatar-large">{currentUserInitials}</div>
                            <h3 className="profile-card-name">{currentUserName}</h3>
                            <p className="profile-card-headline">{currentUserHeadline}</p>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ width: '100%', marginBottom: '10px' }}
                                onClick={() => onNavigate('profile')}
                            >
                                Edit Profile
                            </button>

                            <div className="profile-stat-divider"></div>
                            
                            <div className="profile-stat-item" onClick={() => { setActiveFilter('all'); setActiveTag(null); }}>
                                <span>Total Knowledge Posts</span>
                                <span className="profile-stat-value">{posts.length}</span>
                            </div>
                            <div className="profile-stat-item" onClick={() => setActiveFilter('saved')}>
                                <span>Saved Knowledge Hub</span>
                                <span className="profile-stat-value">{savedPostIds.length}</span>
                            </div>
                            <div className="profile-stat-item">
                                <span>Network Connections</span>
                                <span className="profile-stat-value">{connectedMentors.length + 18}</span>
                            </div>
                        </div>
                    </div>

                    {/* Knowledge Channels Card */}
                    <div className="linkedin-card">
                        <div className="channels-header">
                            <span>Knowledge Channels</span>
                            {activeTag && (
                                <button
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.76rem', cursor: 'pointer' }}
                                    onClick={() => setActiveTag(null)}
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <div>
                            {KNOWLEDGE_CHANNELS.map(ch => (
                                <div
                                    key={ch.tag}
                                    className={`channel-tag-item${activeTag === ch.tag ? ' active' : ''}`}
                                    onClick={() => setActiveTag(activeTag === ch.tag ? null : ch.tag)}
                                >
                                    <span>{ch.label}</span>
                                    <span className="channel-tag-count">{ch.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* 2. CENTER COLUMN: Composer, Filter Bar, Knowledge Posts */}
                <main className="community-center-col">
                    {/* LinkedIn-Style Post Trigger Card */}
                    <div className="linkedin-card composer-trigger-card">
                        <div className="composer-top-row">
                            <div className="composer-user-avatar">{currentUserInitials}</div>
                            <button
                                className="composer-fake-input"
                                onClick={() => setIsComposerOpen(true)}
                            >
                                Share an insight, project, or question...
                            </button>
                        </div>
                        <div className="composer-action-buttons">
                            <button className="composer-action-btn" onClick={() => { setComposerCategory('knowledge'); setIsComposerOpen(true); }}>
                                <span style={{ color: '#FFB199' }}></span> Knowledge Tip
                            </button>
                            <button className="composer-action-btn" onClick={() => { setComposerCategory('projects'); setIsComposerOpen(true); }}>
                                <span style={{ color: '#81C784' }}></span> Project Showcase
                            </button>
                            <button className="composer-action-btn" onClick={() => { setComposerCategory('questions'); setIsComposerOpen(true); }}>
                                <span style={{ color: '#90CAF9' }}></span> Tech Question
                            </button>
                            <button className="composer-action-btn" onClick={() => { setComposerCategory('career'); setIsComposerOpen(true); }}>
                                <span style={{ color: '#CE93D8' }}></span> Career Prep
                            </button>
                        </div>
                    </div>

                    {/* Feed Filter Tabs */}
                    <div className="feed-filter-tabs">
                        <button className={`feed-filter-btn${activeFilter === 'all' && !activeTag ? ' active' : ''}`} onClick={() => { setActiveFilter('all'); setActiveTag(null); }}>
                             All Feed
                        </button>
                        <button className={`feed-filter-btn${activeFilter === 'knowledge' ? ' active' : ''}`} onClick={() => { setActiveFilter('knowledge'); setActiveTag(null); }}>
                             Knowledge Insights
                        </button>
                        <button className={`feed-filter-btn${activeFilter === 'projects' ? ' active' : ''}`} onClick={() => { setActiveFilter('projects'); setActiveTag(null); }}>
                             Project Showcases
                        </button>
                        <button className={`feed-filter-btn${activeFilter === 'questions' ? ' active' : ''}`} onClick={() => { setActiveFilter('questions'); setActiveTag(null); }}>
                             Technical Q&A
                        </button>
                        <button className={`feed-filter-btn${activeFilter === 'career' ? ' active' : ''}`} onClick={() => { setActiveFilter('career'); setActiveTag(null); }}>
                             Interview & Career
                        </button>
                        <button className={`feed-filter-btn${activeFilter === 'saved' ? ' active' : ''}`} onClick={() => { setActiveFilter('saved'); setActiveTag(null); }}>
                             Saved ({savedPostIds.length})
                        </button>
                    </div>

                    {/* Feed Meta Row */}
                    <div className="feed-meta-bar">
                        <span>
                            {activeTag ? (
                                <>Tag: <strong>#{activeTag}</strong> ({filteredPosts.length})</>
                            ) : (
                                <><strong>{filteredPosts.length}</strong> discussions</>
                            )}
                        </span>
                        <div className="feed-meta-sort">
                            <span style={{ marginRight: '6px' }}>Sort by:</span>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="trending"> Trending & Top</option>
                                <option value="recent">⏱️ Latest First</option>
                                <option value="discussed"> Most Discussed</option>
                            </select>
                        </div>
                    </div>

                    {/* Post List */}
                    {filteredPosts.length === 0 ? (
                        <div className="linkedin-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}></p>
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>No discussions found</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 18px auto' }}>
                                We couldn't find any posts matching your current filters. Be the first to share an insight!
                            </p>
                            <button className="btn btn-primary btn-sm" onClick={() => setIsComposerOpen(true)}>
                                Create Knowledge Post
                            </button>
                        </div>
                    ) : (
                        filteredPosts.map(post => {
                            const isSaved = savedPostIds.includes(post.id);
                            const userReaction = userReactions[post.id];
                            const isCommentsExpanded = !!expandedComments[post.id];

                            return (
                                <article key={post.id} className="linkedin-card community-post-card">
                                    {/* Author & Header */}
                                    <div className="post-author-row">
                                        <div className="post-author-left">
                                            <div className="post-author-avatar">{post.author.initials || 'PB'}</div>
                                            <div>
                                                <h4 className="post-author-name">
                                                    {post.author.name}
                                                    <span style={{ color: '#FFB199', fontSize: '0.85rem' }}></span>
                                                </h4>
                                                <p className="post-author-headline">{post.author.headline}</p>
                                                <span className="post-timestamp">
                                                    {post.createdAt} · 
                                                    <span className={`post-badge post-badge-${post.category}`}>
                                                        {post.category === 'knowledge' && ' Insight'}
                                                        {post.category === 'projects' && ' Project'}
                                                        {post.category === 'questions' && ' Question'}
                                                        {post.category === 'career' && ' Career'}
                                                        {post.category === 'study' && ' Study'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                title={isSaved ? 'Remove Bookmark' : 'Save Insight'}
                                                style={{ background: 'none', border: 'none', color: isSaved ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
                                                onClick={() => handleToggleBookmark(post.id)}
                                            >
                                                {isSaved ? '' : ''}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Post Title & Content */}
                                    <h3 className="post-title-text">{post.title}</h3>
                                    <p className="post-body-text">{post.content}</p>

                                    {/* Takeaways Box (if present) */}
                                    {post.takeaways && post.takeaways.length > 0 && (
                                        <div className="post-takeaways-box">
                                            <div className="post-takeaways-title">Key Engineering Takeaways</div>
                                            <ul>
                                                {post.takeaways.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Code Box (if present) */}
                                    {post.codeSnippet && (
                                        <div className="post-code-box">
                                            <code>{post.codeSnippet}</code>
                                        </div>
                                    )}

                                    {/* Link Preview (if present) */}
                                    {post.link && (
                                        <a href={post.link.url} target="_blank" rel="noopener noreferrer" className="post-link-card">
                                            <div className="post-link-info">
                                                <h5>{post.link.title}</h5>
                                                <span>{post.link.url}</span>
                                            </div>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                                        </a>
                                    )}

                                    {/* Hashtag Chips */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="post-tags-row">
                                            {post.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="post-hashtag-pill"
                                                    onClick={() => setActiveTag(tag)}
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Metrics Bar */}
                                    <div className="post-metrics-bar">
                                        <span>
                                             {post.likes} reactions
                                        </span>
                                        <span>
                                            {post.commentsCount || 0} comments
                                        </span>
                                    </div>

                                    {/* Interaction Action Row (LinkedIn Style) */}
                                    <div className="post-actions-row">
                                        <button
                                            className={`post-action-btn${userReaction ? ' active' : ''}`}
                                            onClick={() => handleToggleReaction(post.id, 'insightful')}
                                        >
                                            {userReaction ? 'Insightful' : 'Insightful'}
                                        </button>
                                        <button
                                            className="post-action-btn"
                                            onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                                        >
                                            Comment
                                        </button>
                                        <button
                                            className="post-action-btn"
                                            onClick={() => handleSharePost(post)}
                                        >
                                            Share
                                        </button>
                                        <button
                                            className={`post-action-btn${isSaved ? ' active' : ''}`}
                                            onClick={() => handleToggleBookmark(post.id)}
                                        >
                                            {isSaved ? 'Saved' : 'Save'}
                                        </button>
                                    </div>

                                    {/* Interactive Threaded Comments Section */}
                                    {isCommentsExpanded && (
                                        <div className="post-comments-container">
                                            {/* Add Comment Field */}
                                            <div className="comment-input-row">
                                                <div className="comment-avatar">{currentUserInitials}</div>
                                                <div className="comment-input-wrapper">
                                                    <input
                                                        type="text"
                                                        placeholder="Add a comment..."
                                                        value={commentInputs[post.id] || ''}
                                                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddComment(post.id);
                                                            }
                                                        }}
                                                    />
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            style={{ padding: '4px 14px', fontSize: '0.8rem' }}
                                                            onClick={() => handleAddComment(post.id)}
                                                        >
                                                            Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* List of Comments */}
                                            {(post.comments || []).map(comment => (
                                                <div key={comment.id} className="comment-item">
                                                    <div className="comment-avatar" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent-secondary)' }}>
                                                        {comment.authorInitials || 'PB'}
                                                    </div>
                                                    <div className="comment-bubble">
                                                        <div className="comment-meta">
                                                            <span className="comment-author-name">{comment.authorName}</span>
                                                            <span className="comment-time">{comment.time}</span>
                                                        </div>
                                                        <p className="comment-text">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            );
                        })
                    )}
                </main>

                {/* 3. RIGHT COLUMN: Trending Topics & Mentors Hub */}
                <aside className="community-right-col">
                    {/* Trending Discussions */}
                    <div className="linkedin-card">
                        <div className="channels-header">
                            <span> Trending</span>
                        </div>
                        <div>
                            {TRENDING_TOPICS.map(item => (
                                <div
                                    key={item.rank}
                                    className="trend-item"
                                    onClick={() => setSearchQuery(item.title.split(' ')[0])}
                                >
                                    <span className="trend-item-num">{item.rank}</span>
                                    <div style={{ flex: 1 }}>
                                        <p className="trend-item-title">{item.title}</p>
                                        <p className="trend-item-subtitle">{item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Mentors & Peers */}
                    <div className="linkedin-card">
                        <div className="channels-header">
                            <span> Peers</span>
                        </div>
                        <div>
                            {PEER_MENTORS.map(m => {
                                const isConnected = connectedMentors.includes(m.id);
                                return (
                                    <div key={m.id} className="mentor-card-row">
                                        <div className="mentor-avatar">{m.initials}</div>
                                        <div className="mentor-info">
                                            <p className="mentor-name">{m.name}</p>
                                            <p className="mentor-role">{m.role}</p>
                                        </div>
                                        <button
                                            className={`btn btn-sm ${isConnected ? 'btn-ghost' : 'btn-secondary'}`}
                                            style={{
                                                fontSize: '0.76rem',
                                                padding: '4px 10px',
                                                borderColor: isConnected ? 'var(--border-color)' : 'var(--accent-primary)',
                                                color: isConnected ? 'var(--text-muted)' : 'var(--accent-primary-light)'
                                            }}
                                            onClick={() => handleToggleMentor(m.id, m.name)}
                                        >
                                            {isConnected ? ' Connected' : '+ Connect'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Community Charter */}
                    <div className="linkedin-card" style={{ padding: '16px' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: 'var(--text-primary)' }}> Pro Buddy Community Code</h4>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            We exchange verified knowledge, post code architecture solutions, and help peers pass technical hurdles.
                        </p>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span>About</span> · <span>Guidelines</span> · <span>Privacy</span> · <span>Pro Buddy © 2026</span>
                        </div>
                    </div>
                </aside>

            </div>

            {/* Composer Modal */}
            {isComposerOpen && (
                <div className="composer-modal-overlay" onClick={() => setIsComposerOpen(false)}>
                    <div className="composer-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="composer-modal-header">
                            <h3>Share with Pro Buddy Community</h3>
                            <button onClick={() => setIsComposerOpen(false)}>X</button>
                        </div>

                        <form onSubmit={handlePublishPost}>
                            <div className="composer-modal-body">
                                {/* Post Category */}
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Select Knowledge Category
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {[
                                            { id: 'knowledge', label: ' Knowledge Tip' },
                                            { id: 'projects', label: ' Project Showcase' },
                                            { id: 'questions', label: ' Tech Question' },
                                            { id: 'career', label: ' Career Prep' },
                                            { id: 'study', label: ' Study Resource' }
                                        ].map(cat => (
                                            <button
                                                type="button"
                                                key={cat.id}
                                                className={`btn btn-sm ${composerCategory === cat.id ? 'btn-primary' : 'btn-ghost'}`}
                                                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                                                onClick={() => setComposerCategory(cat.id)}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Post Title */}
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Headline / Post Title <span style={{ color: 'var(--accent-primary)' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="eval-input"
                                        placeholder="e.g. How we solved memory leaks in our Node.js microservice..."
                                        value={composerTitle}
                                        onChange={e => setComposerTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Main Content */}
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Detailed Insights & Explanation <span style={{ color: 'var(--accent-primary)' }}>*</span>
                                    </label>
                                    <textarea
                                        className="eval-input"
                                        rows={5}
                                        placeholder="Share the problem statement, engineering approach, trade-offs, and lessons learned..."
                                        value={composerContent}
                                        onChange={e => setComposerContent(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Key Takeaways */}
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Key Takeaways (One per line, optional)
                                    </label>
                                    <textarea
                                        className="eval-input"
                                        rows={3}
                                        placeholder="Bullet point 1&#10;Bullet point 2&#10;Bullet point 3"
                                        value={composerTakeaways}
                                        onChange={e => setComposerTakeaways(e.target.value)}
                                    />
                                </div>

                                {/* Code Snippet */}
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Code or Architecture Snippet (Optional)
                                    </label>
                                    <textarea
                                        className="eval-input"
                                        rows={3}
                                        style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
                                        placeholder="// Paste relevant code snippet or configuration here"
                                        value={composerCode}
                                        onChange={e => setComposerCode(e.target.value)}
                                    />
                                </div>

                                {/* External Link */}
                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                            Resource or GitHub URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            className="eval-input"
                                            placeholder="https://github.com/..."
                                            value={composerLinkUrl}
                                            onChange={e => setComposerLinkUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                            Link Display Title
                                        </label>
                                        <input
                                            type="text"
                                            className="eval-input"
                                            placeholder="e.g. Repository Demo"
                                            value={composerLinkTitle}
                                            onChange={e => setComposerLinkTitle(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                                        Knowledge Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        className="eval-input"
                                        placeholder="SystemDesign, Redis, Postgres, AI"
                                        value={composerTags}
                                        onChange={e => setComposerTags(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="composer-modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsComposerOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Publish Knowledge Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

