import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Forum({ onNavigate }) {
    const { user } = useAuth();
    const [posts, setPosts] = useState([
        { id: 1, author: 'Jane Doe', title: 'Tips for learning Web3?', content: 'Anyone has good resources for learning Solidity?', likes: 12, comments: 4, tags: ['Web3', 'Learning'] },
        { id: 2, author: 'John Smith', title: 'SIH Hackathon Ideas', content: 'What domains are people focusing on for SIH this year?', likes: 24, comments: 8, tags: ['Hackathon', 'Ideas'] }
    ]);

    return (
        <section className="suggest-section" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="view-header-minimal">
                <button className="btn btn-back" onClick={() => onNavigate('dashboard')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Dashboard
                </button>
            </div>
            <div className="eval-container" style={{ maxWidth: '800px' }}>
                <div className="eval-header text-center">
                    <h2 className="gradient-text">Pro Buddy Community</h2>
                    <p className="subtitle">Connect, share, and collaborate with peers.</p>
                </div>
                
                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                    <textarea 
                        className="eval-input" 
                        placeholder="Share an idea, ask a question, or post a project..." 
                        style={{ minHeight: '80px', marginBottom: '10px' }}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary">Post to Community</button>
                    </div>
                </div>

                <div className="forum-feed">
                    {posts.map(post => (
                        <div key={post.id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{post.author}</div>
                                <button style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '20px', padding: '2px 12px', fontSize: '12px', cursor: 'pointer' }}>+ Follow</button>
                            </div>
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{post.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>{post.content}</p>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                {post.tags.map(tag => (
                                    <span key={tag} style={{ background: 'var(--bg-card-hover)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>#{tag}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>👍 {post.likes} Likes</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>💬 {post.comments} Comments</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
