import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateIdea } from './src/utils/evaluationEngine.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Initialize GoogleGenAI client
let ai = null;
if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
            headers: {
                'User-Agent': 'aistudio-build',
            }
        }
    });
} else {
    console.warn("⚠️ GEMINI_API_KEY is not defined. Falling back to offline evaluations.");
}

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
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
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
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = users[normalizedEmail];

    if (!user) {
        return res.status(400).json({ success: false, message: 'No account found with this email.' });
    }

    if (user.passwordHash !== simpleHash(password)) {
        return res.status(400).json({ success: false, message: 'Incorrect password. Try again.' });
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', (req, res) => {
    const { email, name, bio, college } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const user = users[normalizedEmail] || users[email];
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.college = college || user.college;
    users[normalizedEmail] = user;

    const { passwordHash: _passwordHash, ...safeUser } = user;
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
    const email = req.params.email;
    const userEvals = evalHistory.filter(e => e.userEmail === email || e.userEmail?.toLowerCase() === email?.toLowerCase());
    res.json({ success: true, history: userEvals });
});

// Clear user evaluations
app.delete('/api/evaluations/:email', (req, res) => {
    const email = req.params.email;
    const before = evalHistory.length;
    const filtered = evalHistory.filter(e => e.userEmail !== email && e.userEmail?.toLowerCase() !== email?.toLowerCase());
    evalHistory.length = 0;
    evalHistory.push(...filtered);
    res.json({ success: true, removed: before - evalHistory.length });
});

// Analyze project idea with Gemini or fallback to offline engine
app.post('/api/evaluations/analyze', async (req, res) => {
    const formData = req.body;
    if (!formData.title || !formData.problem || !formData.solution) {
        return res.status(400).json({ success: false, message: 'Missing required evaluation fields.' });
    }

    if (!ai) {
        console.log("No Gemini API client initialized. Falling back to offline evaluation.");
        const localResult = evaluateIdea(formData);
        return res.json({ success: true, ...localResult, isGemini: false });
    }

    try {
        const prompt = `
Evaluate the following project proposal details thoroughly and provide an expert startup & engineering analysis:
Project Title: ${formData.title}
Domain: ${formData.domain}
Problem Statement: ${formData.problem}
Proposed Solution: ${formData.solution}
Team Size: ${formData.teamSize}
Tech Stack: ${formData.techStack}
Target Audience: ${formData.targetAudience}
Unique Features / USP: ${formData.uniqueFeatures}

You are an expert tech startup analyst and senior software architect. Analyze this project strictly across 5 dimensions, rating each from 0 to 100:
1. Technical Difficulty (difficulty): How complex is it to build this within a 48h-72h hackathon or short timeline? High difficulty means complex algorithms, advanced integrations, hardware, blockchain, or complex ML models.
2. Success Probability (success): How likely is the team to successfully deploy a working, valuable MVP? Solo teams face higher execution risks.
3. Uniqueness (uniqueness): How original is this idea compared to standard market templates (like simple chat apps, typical e-commerce, basic portfolios)? Highly original ideas or narrow niches score higher.
4. Tech Knowledge (techKnowledge): What is the technical learning curve and domain barrier for these tools?
5. Tech Stack Readiness (techStack): How appropriate is the selected stack for the proposed solution? Does it have databases, API layers, or mobile/web support as required?

Also calculate the weighted Overall Score (overall) based on these parameters.

Return your analysis as a structured JSON object matching the requested schema. Provide deep, highly customized, and expert level feedback, real competitors in 'existingSolutions' (provide 3 to 4 actual, real-world existing products with their correct website domains), and real industry connections. Be constructive, rigorous, and highly specific to the user's input.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scores: {
                            type: Type.OBJECT,
                            properties: {
                                difficulty: { type: Type.INTEGER },
                                success: { type: Type.INTEGER },
                                uniqueness: { type: Type.INTEGER },
                                techKnowledge: { type: Type.INTEGER },
                                techStack: { type: Type.INTEGER },
                                overall: { type: Type.INTEGER }
                            },
                            required: ["difficulty", "success", "uniqueness", "techKnowledge", "techStack", "overall"]
                        },
                        feedback: {
                            type: Type.OBJECT,
                            properties: {
                                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                                nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                                verdict: { type: Type.STRING },
                                verdictTags: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            text: { type: Type.STRING },
                                            type: { type: Type.STRING }
                                        },
                                        required: ["text", "type"]
                                    }
                                },
                                dimFeedback: {
                                    type: Type.OBJECT,
                                    properties: {
                                        difficulty: { type: Type.STRING },
                                        success: { type: Type.STRING },
                                        uniqueness: { type: Type.STRING },
                                        techKnowledge: { type: Type.STRING },
                                        techStack: { type: Type.STRING }
                                    },
                                    required: ["difficulty", "success", "uniqueness", "techKnowledge", "techStack"]
                                },
                                conclusion: { type: Type.STRING }
                            },
                            required: ["strengths", "weaknesses", "suggestions", "nextSteps", "verdict", "verdictTags", "dimFeedback", "conclusion"]
                        },
                        domainData: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                existingSolutions: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            desc: { type: Type.STRING },
                                            url: { type: Type.STRING }
                                        },
                                        required: ["name", "desc", "url"]
                                    }
                                },
                                industries: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            desc: { type: Type.STRING },
                                            companies: { type: Type.ARRAY, items: { type: Type.STRING } }
                                        },
                                        required: ["name", "desc", "companies"]
                                    }
                                }
                            },
                            required: ["name", "existingSolutions", "industries"]
                        }
                    },
                    required: ["scores", "feedback", "domainData"]
                }
            }
        });

        const resultJson = JSON.parse(response.text);
        res.json({ success: true, ...resultJson, isGemini: true });
    } catch (err) {
        console.error("Gemini API error, falling back to offline evaluator:", err);
        const localResult = evaluateIdea(formData);
        res.json({ success: true, ...localResult, isGemini: false, error: err.message });
    }
});

// Generate AI Insight for Dashboard
app.post('/api/dashboard/insight', async (req, res) => {
    const { evaluations } = req.body;
    
    if (!ai) {
        return res.status(503).json({ success: false, message: 'Gemini API not initialized.' });
    }

    try {
        const prompt = `
The user has evaluated the following ideas recently:
${evaluations.map(e => `- ${e.title} (Domain: ${e.domain}, Score: ${e.overallScore})`).join('\n')}

Based on this history, provide a single, short, personalized, highly insightful piece of advice (max 2 sentences) for this user to improve their next project or career focus. Make it sound professional and actionable.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({ success: true, insight: response.text });
    } catch (err) {
        console.error("Gemini API error in insight:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Analyze career path with Gemini
app.post('/api/careers', async (req, res) => {
    const { skills, branch, interest } = req.body;
    
    if (!ai) {
        return res.status(503).json({ success: false, message: 'Gemini API not initialized.' });
    }

    try {
        const prompt = `
Find relevant job roles and career pathways for a candidate with the following profile:
Skills: ${skills.join(', ')}
Branch/Specialization: ${branch}
Interest: ${interest}

Act as an expert career counselor. Based on current tech industry trends, suggest up to 6 highly relevant, specific job roles. For each role, provide a realistic company that hires for this role (like Google, Microsoft, specific startups, etc.), a realistic salary range, and a link to search for this job on LinkedIn or Glassdoor. Also suggest 3 platforms or websites where they can explore more about these careers.
Return a structured JSON object.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        roles: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    salary: { type: Type.STRING },
                                    category: { type: Type.STRING },
                                    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    link: { type: Type.STRING }
                                },
                                required: ["title", "company", "salary", "category", "skills", "link"]
                            }
                        },
                        explore: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING },
                                    desc: { type: Type.STRING },
                                    url: { type: Type.STRING }
                                },
                                required: ["label", "desc", "url"]
                            }
                        }
                    },
                    required: ["roles", "explore"]
                }
            }
        });

        const resultJson = JSON.parse(response.text);
        res.json({ success: true, ...resultJson });
    } catch (err) {
        console.error("Gemini API error in careers:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Curate study resources with Gemini
app.post('/api/study', async (req, res) => {
    const { topic } = req.body;
    
    if (!ai) {
        return res.status(503).json({ success: false, message: 'Gemini API not initialized.' });
    }

    try {
        const prompt = `
You are an expert tutor. Create a structured study guide for the topic: "${topic}".
Provide a clear label and a brief description of the core concepts in this topic.
Then, curate a list of up to 4 high-quality YouTube channels or specific playlists that are widely recognized as the best resources to learn this (provide real, realistic URLs even if they are search URLs). Also specify the language of the tutorial (e.g. English, Hindi).
Then, curate a list of up to 4 high-quality websites, documentations, or platforms (like official docs, GeeksforGeeks, MDN, etc.) to learn this topic, with a short description of what they offer.
Return a structured JSON object.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        description: { type: Type.STRING },
                        youtube: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    channel: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    url: { type: Type.STRING },
                                    lang: { type: Type.STRING }
                                },
                                required: ["channel", "title", "url", "lang"]
                            }
                        },
                        websites: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    url: { type: Type.STRING },
                                    desc: { type: Type.STRING }
                                },
                                required: ["name", "url", "desc"]
                            }
                        }
                    },
                    required: ["label", "description", "youtube", "websites"]
                }
            }
        });

        const resultJson = JSON.parse(response.text);
        res.json({ success: true, result: resultJson });
    } catch (err) {
        console.error("Gemini API error in study:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ========================================
// START SERVER & VITE INTEGRATION
// ========================================
async function initServer() {
    console.log(`[Express] initServer started, NODE_ENV=${process.env.NODE_ENV}`);
    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Express] Creating Vite server...`);
            const vite = await createViteServer({
                server: { middlewareMode: true },
                appType: 'spa'
            });
            app.use(vite.middlewares);
            console.log(`[Express] Vite middlewares mounted.`);
        } else {
            console.log(`[Express] Production mode, serving dist...`);
            const distPath = path.join(process.cwd(), 'dist');
            app.use(express.static(distPath));
            app.get('*', (req, res) => {
                res.sendFile(path.join(distPath, 'index.html'));
            });
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`⚡ Pro Buddy server running on http://0.0.0.0:${PORT}`);
        });
    } catch (err) {
        console.error(`[Express] Error starting server:`, err);
    }
}

initServer();
