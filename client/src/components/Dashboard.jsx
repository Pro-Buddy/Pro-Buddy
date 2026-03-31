import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onNavigate }) {
    const { user, getInitials } = useAuth();
    const initials = user ? getInitials(user.name) : '?';
    const firstName = user?.name?.split(' ')[0] || 'User';

    const services = [
        {
            id: 'evaluator',
            icon: '🧠',
            title: 'Pro Evaluator',
            subtitle: 'Project Idea Analysis',
            desc: 'Evaluate your project ideas with AI-powered analysis across 5 dimensions — difficulty, success probability, uniqueness, tech knowledge, and stack readiness.',
            tags: ['AI Analysis', '5 Dimensions', 'Report Download'],
            gradient: 'linear-gradient(135deg, #FF9933 0%, #E67E22 100%)',
            glow: 'rgba(255, 153, 51, 0.3)',
            accent: '#FF9933'
        },
        {
            id: 'careers',
            icon: '🚀',
            title: 'Pro Careers',
            subtitle: 'Career & Job Navigator',
            desc: 'Input your skills, academics, and interests — get curated job openings, career paths, and exploration links tailored for 4th year engineering students.',
            tags: ['Job Matching', 'Career Paths', 'Skill Analysis'],
            gradient: 'linear-gradient(135deg, #0050A4 0%, #002A5E 100%)',
            glow: 'rgba(0, 80, 164, 0.3)',
            accent: '#0050A4'
        },
        {
            id: 'study',
            icon: '📚',
            title: 'Pro Study',
            subtitle: 'Smart Learning Guide',
            desc: 'Confused about a topic? Enter any subject and get curated YouTube tutorials, web resources, and structured learning paths from the best creators.',
            tags: ['YouTube Curated', 'Topic Guide', 'Best Resources'],
            gradient: 'linear-gradient(135deg, #138808 0%, #0B6B04 100%)',
            glow: 'rgba(19, 136, 8, 0.3)',
            accent: '#138808'
        }
    ];

    return (
        <section className="dashboard-section" id="dashboard">
            <div className="section-container">
                {/* Dashboard Header */}
                <div className="dashboard-header">
                    <div className="dashboard-greeting">
                        <div className="dashboard-avatar" style={{ background: 'var(--gradient-primary)' }}>{initials}</div>
                        <div>
                            <h1 className="dashboard-title">Welcome back, <span className="gradient-text">{firstName}</span></h1>
                            <p className="dashboard-subtitle">Choose a service to get started. From confusion to execution — we've got you covered.</p>
                        </div>
                    </div>
                </div>

                {/* Service Cards */}
                <div className="dashboard-grid">
                    {services.map((service, i) => (
                        <div
                            className="dashboard-card"
                            key={service.id}
                            style={{ '--card-glow': service.glow, '--card-accent': service.accent, animationDelay: `${i * 0.15}s` }}
                            onClick={() => onNavigate(service.id)}
                        >
                            <div className="dcard-top-bar" style={{ background: service.gradient }}></div>
                            <div className="dcard-body">
                                <div className="dcard-icon-wrap">
                                    <span className="dcard-icon">{service.icon}</span>
                                </div>
                                <h3 className="dcard-title">{service.title}</h3>
                                <p className="dcard-subtitle">{service.subtitle}</p>
                                <p className="dcard-desc">{service.desc}</p>
                                <div className="dcard-tags">
                                    {service.tags.map((tag, j) => (
                                        <span className="dcard-tag" key={j} style={{ borderColor: service.accent + '40', color: service.accent }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button className="btn dcard-btn" style={{ background: service.gradient }}>
                                    Open {service.title}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
