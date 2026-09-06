import { useState } from 'react';
import { useToast } from './Toast';
import { apiSaveActivity } from '../utils/api';

// ---- Curated Job Database ----
const JOB_DATABASE = {
    'web-development': {
        label: 'Web Development',
        roles: [
            { title: 'Frontend Developer', company: 'Flipkart, Razorpay, Swiggy', salary: '₹6-15 LPA', skills: ['React', 'JavaScript', 'CSS', 'TypeScript'], link: 'https://remoteok.com/remote-frontend+developer+india-jobs' },
            { title: 'Full Stack Developer', company: 'Google, Microsoft, Amazon', salary: '₹8-25 LPA', skills: ['React', 'Node.js', 'MongoDB', 'AWS'], link: 'https://remoteok.com/remote-full+stack+developer+india-jobs' },
            { title: 'Backend Developer', company: 'Paytm, Zomato, CRED', salary: '₹7-18 LPA', skills: ['Node.js', 'Python', 'SQL', 'REST APIs'], link: 'https://remoteok.com/remote-backend+developer+india-jobs' },
        ]
    },
    'ai-ml': {
        label: 'AI / Machine Learning',
        roles: [
            { title: 'ML Engineer', company: 'Google, Meta, NVIDIA', salary: '₹12-35 LPA', skills: ['Python', 'TensorFlow', 'PyTorch', 'Statistics'], link: 'https://remoteok.com/remote-ml+engineer+india-jobs' },
            { title: 'Data Scientist', company: 'Amazon, Flipkart, Mu Sigma', salary: '₹8-25 LPA', skills: ['Python', 'SQL', 'Statistics', 'Scikit-learn'], link: 'https://remoteok.com/remote-data+scientist+india-jobs' },
            { title: 'AI Research Intern', company: 'Microsoft Research, IISc, OpenAI', salary: '₹50K-1.5L/month', skills: ['Deep Learning', 'Research Papers', 'Python', 'Math'], link: 'https://remoteok.com/remote-ai+research+intern-jobs' },
        ]
    },
    'mobile-development': {
        label: 'Mobile Development',
        roles: [
            { title: 'Android Developer', company: 'PhonePe, Ola, Dream11', salary: '₹6-18 LPA', skills: ['Kotlin', 'Android SDK', 'Firebase', 'Jetpack'], link: 'https://remoteok.com/remote-android+developer+india-jobs' },
            { title: 'Flutter Developer', company: 'Paytm, Meesho, Dunzo', salary: '₹5-15 LPA', skills: ['Dart', 'Flutter', 'Firebase', 'REST APIs'], link: 'https://remoteok.com/remote-flutter+developer+india-jobs' },
            { title: 'iOS Developer', company: 'Apple, Zomato, Groww', salary: '₹8-22 LPA', skills: ['Swift', 'SwiftUI', 'Xcode', 'Core Data'], link: 'https://remoteok.com/remote-ios+developer+india-jobs' },
        ]
    },
    'cybersecurity': {
        label: 'Cybersecurity',
        roles: [
            { title: 'Security Analyst', company: 'Deloitte, EY, PwC', salary: '₹5-14 LPA', skills: ['Network Security', 'SIEM', 'Linux', 'Firewalls'], link: 'https://remoteok.com/remote-security+analyst+india-jobs' },
            { title: 'Penetration Tester', company: 'CrowdStrike, Wipro, TCS', salary: '₹6-18 LPA', skills: ['Ethical Hacking', 'Burp Suite', 'Kali Linux', 'OWASP'], link: 'https://remoteok.com/remote-penetration+tester+india-jobs' },
            { title: 'SOC Analyst', company: 'IBM, Infosys, HCLTech', salary: '₹4-10 LPA', skills: ['Threat Detection', 'SIEM Tools', 'Incident Response', 'Networking'], link: 'https://remoteok.com/remote-soc+analyst+india-jobs' },
        ]
    },
    'data-analytics': {
        label: 'Data Analytics',
        roles: [
            { title: 'Data Analyst', company: 'Accenture, TCS, Infosys', salary: '₹4-12 LPA', skills: ['SQL', 'Python', 'Tableau', 'Excel'], link: 'https://remoteok.com/remote-data+analyst+india-jobs' },
            { title: 'Business Analyst', company: 'Deloitte, McKinsey, ZS Associates', salary: '₹6-16 LPA', skills: ['SQL', 'Power BI', 'Excel', 'Communication'], link: 'https://remoteok.com/remote-business+analyst+india-jobs' },
            { title: 'Analytics Engineer', company: 'Razorpay, Myntra, Swiggy', salary: '₹8-20 LPA', skills: ['SQL', 'Python', 'dbt', 'Snowflake'], link: 'https://remoteok.com/remote-analytics+engineer+india-jobs' },
        ]
    },
    'cloud-devops': {
        label: 'Cloud / DevOps',
        roles: [
            { title: 'DevOps Engineer', company: 'Amazon, Freshworks, Zoho', salary: '₹6-20 LPA', skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], link: 'https://remoteok.com/remote-devops+engineer+india-jobs' },
            { title: 'Cloud Engineer', company: 'Google Cloud, Azure, AWS', salary: '₹8-25 LPA', skills: ['AWS', 'GCP', 'Terraform', 'Linux'], link: 'https://remoteok.com/remote-cloud+engineer+india-jobs' },
            { title: 'SRE (Site Reliability Engineer)', company: 'Google, Meta, Uber', salary: '₹12-35 LPA', skills: ['Linux', 'Monitoring', 'Scripting', 'Kubernetes'], link: 'https://remoteok.com/remote-sre+engineer+india-jobs' },
        ]
    },
    'blockchain': {
        label: 'Blockchain / Web3',
        roles: [
            { title: 'Blockchain Developer', company: 'Polygon, CoinDCX, WazirX', salary: '₹8-30 LPA', skills: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'], link: 'https://remoteok.com/remote-blockchain+developer+india-jobs' },
            { title: 'Smart Contract Auditor', company: 'ConsenSys, Trail of Bits', salary: '₹15-45 LPA', skills: ['Solidity', 'Security Auditing', 'DeFi', 'Formal Verification'], link: 'https://remoteok.com/remote-smart+contract+auditor-jobs' },
        ]
    },
    'iot-embedded': {
        label: 'IoT / Embedded Systems',
        roles: [
            { title: 'Embedded Software Engineer', company: 'Qualcomm, Samsung, Bosch', salary: '₹6-18 LPA', skills: ['C/C++', 'RTOS', 'Microcontrollers', 'Linux'], link: 'https://remoteok.com/remote-embedded+engineer+india-jobs' },
            { title: 'IoT Developer', company: 'Siemens, GE, Honeywell', salary: '₹5-15 LPA', skills: ['Arduino', 'MQTT', 'Python', 'Sensors'], link: 'https://remoteok.com/remote-iot+developer+india-jobs' },
        ]
    }
};

const SKILL_OPTIONS = ['JavaScript', 'Python', 'Java', 'C/C++', 'React', 'Node.js', 'Flutter', 'Kotlin', 'Swift', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Solidity', 'Cybersecurity', 'Data Analysis', 'Tableau', 'Power BI', 'Linux', 'Git', 'HTML/CSS', 'TypeScript', 'Go', 'Rust', 'Arduino', 'Raspberry Pi'];

const EXPLORE_LINKS = [
    { label: ' Remote.co', url: 'https://remote.co/', desc: 'Curated remote job board' },
    { label: ' AngelList Startup Jobs', url: 'https://angel.co/jobs', desc: 'Startup-focused job board' },
    { label: ' Naukri.com', url: 'https://www.naukri.com/', desc: "India's #1 job site" },
    { label: ' Internshala', url: 'https://internshala.com/', desc: 'Internships & fresher jobs' },
    { label: ' Unstop (formerly D2C)', url: 'https://unstop.com/', desc: 'Competitions, hackathons & jobs' },
    { label: ' Indeed', url: 'https://www.indeed.co.in/', desc: 'Global job search engine' },
];

export default function ProCareers({ onNavigate }) {
    const showToast = useToast();
    const [skills, setSkills] = useState([]);
    const [customSkill, setCustomSkill] = useState('');
    const [branch, setBranch] = useState('');
    const [interest, setInterest] = useState('');
    const [manualLocation, setManualLocation] = useState('');
    const [results, setResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showForm, setShowForm] = useState(true);

    function toggleSkill(skill) {
        setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    }

    function addCustomSkill() {
        if (customSkill.trim() && !skills.includes(customSkill.trim())) {
            setSkills(prev => [...prev, customSkill.trim()]);
            setCustomSkill('');
        }
    }

    async function analyze() {
        if (skills.length === 0) { showToast(' Please select at least one skill.'); return; }
        
        setIsAnalyzing(true);
        try {
            apiSaveActivity('career', `Searched roles for ${branch || 'general'}`);
            const response = await fetch('/api/careers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills, branch, interest })
            });
            const data = await response.json();
            if (data.success) {
                setResults({ roles: data.roles, explore: data.explore });
                setShowForm(false);
            } else {
                showToast(' Failed to fetch careers: ' + data.message);
            }
        } catch (err) {
            showToast(' Network error: ' + err.message);
        } finally {
            setIsAnalyzing(false);
        }
    }

    function reset() { setResults(null); setShowForm(true); }

    return (
        <section className="suggest-section" id="proCareers" style={{ paddingTop: '20px' }}>
            <div className="view-header-minimal">
                <button className="btn btn-back" onClick={() => onNavigate('dashboard')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </button>
            </div>
            <div className="section-container">
                <div className="section-header">
                    <h2 className="section-title">Pro <span style={{ color: '#E64A19' }}>Careers</span></h2>
                    <p className="section-desc">Input your skills, branch, and interests — get curated job matches and exploration links.</p>
                </div>

                {showForm ? (
                    <div className="suggest-form-container eval-form-container">
                        <div className="form-group">
                            <label>Your Skills <span className="required">*</span></label>
                            <div className="skill-chips">
                                {SKILL_OPTIONS.map(s => (
                                    <button type="button" key={s} className={`skill-chip${skills.includes(s) ? ' active' : ''}`} onClick={() => toggleSkill(s)}>{s}</button>
                                ))}
                            </div>
                            <div className="skill-custom-row">
                                <input type="text" placeholder="Add custom skill..." value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }} />
                                <button type="button" className="btn btn-ghost btn-sm" onClick={addCustomSkill}>+ Add</button>
                            </div>
                            {skills.length > 0 && <p className="selected-count"> {skills.length} skills selected</p>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Branch / Specialization</label>
                                <select value={branch} onChange={e => setBranch(e.target.value)}>
                                    <option value="">Select branch</option>
                                    <option value="cse">Computer Science (CSE)</option>
                                    <option value="it">Information Technology (IT)</option>
                                    <option value="ece">Electronics & Communication</option>
                                    <option value="eee">Electrical Engineering</option>
                                    <option value="mech">Mechanical Engineering</option>
                                    <option value="civil">Civil Engineering</option>
                                    <option value="aiml">AI & Machine Learning</option>
                                    <option value="ds">Data Science</option>
                                    <option value="cyber">Cybersecurity</option>
                                </select>
                    </div>
                    <div className="form-group">
                        <label>4. Preferred Location (Optional)</label>
                        <input type="text" className="eval-input" placeholder="e.g. Bangalore, Remote" value={manualLocation} onChange={e => setManualLocation(e.target.value)} />
                    </div>
                            <div className="form-group">
                                <label>Area of Interest</label>
                                <input type="text" placeholder="e.g., Backend, AI, Mobile Apps" value={interest} onChange={e => setInterest(e.target.value)} />
                            </div>
                        </div>
                        <button type="button" className="btn btn-lg btn-full" style={{ background: 'linear-gradient(135deg, #FF9F76 0%, #E64A19 100%)', marginTop: '24px' }} onClick={analyze} disabled={isAnalyzing}>
                            {isAnalyzing ? 'Analyzing with AI...' : 'Find Matching Roles'}
                        </button>
                    </div>
                ) : (
                    <div className="suggest-results eval-results-container" style={{ display: 'block' }}>
                        <div className="results-header">
                            <h3> Matching Roles for You</h3>
                            <button className="btn btn-ghost btn-sm" onClick={reset}>← Search Again</button>
                        </div>
                        <div className="suggest-cards">
                            {results.roles.map((role, i) => (
                                <div className="suggest-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="suggest-card-top">
                                        <div><h4 className="suggest-role">{role.title}</h4><p className="suggest-company">{role.company}</p></div>
                                        <span className="suggest-salary">{role.salary}</span>
                                    </div>
                                    <p className="suggest-category">{role.category}</p>
                                    <div className="suggest-skills">{role.skills.map((s, j) => <span key={j} className="suggest-skill-tag">{s}</span>)}</div>
                                    <a href={role.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm suggest-link"> View Job Listings</a>
                                </div>
                            ))}
                        </div>
                        <div className="suggest-explore">
                            <h4> Explore More Platforms</h4>
                            <div className="explore-grid">
                                {results.explore.map((l, i) => (
                                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="explore-card" key={i}>
                                        <span className="explore-label">{l.label}</span>
                                        <span className="explore-desc">{l.desc}</span>
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
