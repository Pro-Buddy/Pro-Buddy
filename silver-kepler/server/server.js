import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---- In-Memory Storage (will be replaced by DB later) ----
const users = {};
const evalHistory = [];

// ---- Helper: Simple Hash ----
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36);
}

// ========================================
// AUTH ROUTES
// ========================================

// Signup
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (users[normalizedEmail]) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: simpleHash(password),
        bio: '',
        college: '',
        joinedAt: new Date().toISOString()
    };

    users[normalizedEmail] = user;
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = users[normalizedEmail];

    if (!user) {
        return res.status(400).json({ success: false, message: 'No account found with this email.' });
    }

    if (user.passwordHash !== simpleHash(password)) {
        return res.status(400).json({ success: false, message: 'Incorrect password. Try again.' });
    }

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', (req, res) => {
    const { email, name, bio, college } = req.body;
    const user = users[email];
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.college = college || user.college;
    users[email] = user;

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// ========================================
// EVALUATION ROUTES
// ========================================

// Save evaluation
app.post('/api/evaluations', (req, res) => {
    const { userEmail, title, domain, overallScore, scores, verdict } = req.body;

    const entry = {
        id: Date.now().toString(36),
        timestamp: new Date().toISOString(),
        userEmail,
        title,
        domain,
        overallScore,
        scores,
        verdict
    };

    evalHistory.unshift(entry);
    if (evalHistory.length > 500) evalHistory.pop();

    res.json({ success: true, entry });
});

// Get user evaluations
app.get('/api/evaluations/:email', (req, res) => {
    const userEvals = evalHistory.filter(e => e.userEmail === req.params.email);
    res.json({ success: true, history: userEvals });
});

// Clear user evaluations
app.delete('/api/evaluations/:email', (req, res) => {
    const before = evalHistory.length;
    const filtered = evalHistory.filter(e => e.userEmail !== req.params.email);
    evalHistory.length = 0;
    evalHistory.push(...filtered);
    res.json({ success: true, removed: before - evalHistory.length });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`⚡ Pro Buddy server running on http://localhost:${PORT}`);
});
