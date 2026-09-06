import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateIdea } from './src/utils/evaluationEngine.js';
import { fallbackCareers } from './src/utils/careerFallback.js';
import { fallbackStudy } from './src/utils/studyFallback.js';
import * as llmService from './server/llmService.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Analyze project idea with Gemini or fallback to offline engine
app.post('/api/evaluations/analyze', async (req, res) => {
    const formData = req.body;
    if (!formData.title || !formData.problem || !formData.solution) {
        return res.status(400).json({ success: false, message: 'Missing required evaluation fields.' });
    }
    
    try {
        const resultJson = await llmService.analyzeEvaluation(formData);
        
        const overallScore = resultJson.overallScore || 0;
        let verdict = resultJson.verdict || "AI Analysis Complete";
        let verdictTags = [{ text: "AI Evaluated", type: "blue" }];
        
        if (overallScore >= 75) {
            verdictTags.push({ text: 'High Potential', type: 'green' });
        } else if (overallScore >= 55) {
            verdictTags.push({ text: 'Viable Project', type: 'yellow' });
        } else {
            verdictTags.push({ text: 'Needs Refinement', type: 'red' });
        }

        const normalizedResponse = {
            success: true,
            isGemini: true,
            scores: {
                ...resultJson.scores,
                overall: overallScore
            },
            feedback: {
                verdict,
                verdictTags,
                dimFeedback: resultJson.feedback || {},
                strengths: resultJson.strengths || [],
                weaknesses: resultJson.weaknesses || [],
                suggestions: resultJson.nextSteps || [], 
                nextSteps: resultJson.nextSteps || [],
                conclusion: `AI evaluation complete. ${overallScore > 75 ? 'This is a highly promising idea.' : 'Review the feedback above to improve your concept.'}`
            },
            domainData: {
                domain: resultJson.domainData?.domain || formData.domain || "Technology",
                existingSolutions: (resultJson.domainData?.existingSolutions || []).map(sol => ({
                    name: sol,
                    desc: "Identified by AI Analysis",
                    url: "Search online for details"
                })),
                industries: []
            }
        };
        
        res.json(normalizedResponse);
    } catch (err) {
        console.warn("Gemini API failed or not configured, falling back to offline engine.", err.message);
        const localResult = evaluateIdea(formData);
        res.json({ success: true, ...localResult, isGemini: false });
    }
});

// Download README route
app.get('/download-readme', (req, res) => {
    res.download(path.join(process.cwd(), 'README.md'));
});

// Download Workflow Flowchart route
app.get('/download-flowchart', (req, res) => {
    res.download(path.join(process.cwd(), 'workflow-flowchart.html'));
});

// Generate AI Insight for Dashboard
app.post('/api/dashboard/insight', async (req, res) => {
    const { evaluations } = req.body;
    try {
        const insight = await llmService.generateDashboardInsight(evaluations);
        res.json({ success: true, insight });
    } catch (err) {
        console.error("Gemini API error in insight:", err);
        // Fallback mock data
        res.json({ success: true, insight: "Keep learning and building! Each project gets you closer to your career goals." });
    }
});

// Analyze career path with Gemini
app.post('/api/careers', async (req, res) => {
    const { skills, branch, interest, location } = req.body;
    try {
        const resultJson = await llmService.matchCareers(skills, branch, interest, location);
        res.json({ success: true, ...resultJson });
    } catch (err) {
        console.error("Gemini API error in careers:", err);
        // Fallback mock data
        const fallbackData = fallbackCareers(skills, branch, interest, location);
        res.json({ success: true, ...fallbackData });
    }
});

// Curate study resources with Gemini
app.post('/api/study', async (req, res) => {
    const { topic } = req.body;
    try {
        const resultJson = await llmService.curateStudyResources(topic);
        res.json({ success: true, result: resultJson });
    } catch (err) {
        console.error("Gemini API error in study:", err);
        // Fallback mock data
        const fallbackData = fallbackStudy(topic);
        res.json({ success: true, result: fallbackData });
    }
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    const { query, section } = req.body;
    try {
        const answer = await llmService.answerChatbot(query, section);
        res.json({ success: true, answer });
    } catch (err) {
        console.error("Gemini API error in chatbot:", err);
        
        // Smart fallback rule-based responses
        const lowerQuery = query.toLowerCase();
        let fallbackAnswer = "I'm having trouble connecting to my AI brain right now, but I'm still here! You can navigate using the top menu.";
        
        if (lowerQuery.includes('how to use') || lowerQuery.includes('what is this')) {
            fallbackAnswer = "Pro Buddy helps you evaluate your project ideas, find career paths, and study. Simply navigate to the 'Evaluate', 'Careers', or 'Study' sections from the menu to get started!";
        } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
            fallbackAnswer = "Hello! How can I help you navigate the platform today?";
        } else if (lowerQuery.includes('evaluate') || lowerQuery.includes('project')) {
            fallbackAnswer = "In the Evaluate section, you can enter your project idea, target audience, and tech stack to get a comprehensive analysis of its viability.";
        } else if (lowerQuery.includes('career') || lowerQuery.includes('job')) {
            fallbackAnswer = "The Careers section helps you match your skills and interests with potential job roles and provides links to explore them.";
        } else if (lowerQuery.includes('study') || lowerQuery.includes('learn')) {
            fallbackAnswer = "The Study section curates YouTube channels and websites based on the topic you want to learn.";
        }
        
        res.json({ success: true, answer: fallbackAnswer });
    }
});

// Check embeddability
app.post('/api/check-embed', async (req, res) => {
    const { url } = req.body;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);
        const xfo = response.headers.get('x-frame-options');
        const csp = response.headers.get('content-security-policy');
        
        let canEmbed = true;
        if (xfo && (xfo.toLowerCase() === 'deny' || xfo.toLowerCase() === 'sameorigin')) {
            canEmbed = false;
        }
        if (csp && csp.toLowerCase().includes('frame-ancestors')) {
            canEmbed = false; // Simplified check
        }
        res.json({ success: true, canEmbed });
    } catch (err) {
        console.error("Embed check error:", err);
        // If we can't fetch headers, assume we can't embed for safety
        res.json({ success: true, canEmbed: false });
    }
});

// ========================================
// START SERVER & VITE INTEGRATION
// ========================================
async function initServer() {
    console.log(`[Express] initServer started, NODE_ENV=${process.env.NODE_ENV}`);
    try {
        if (process.env.NODE_ENV === 'development') {
            const { createServer: createViteServer } = await import('vite');
            const vite = await createViteServer({
                server: { middlewareMode: true },
                appType: 'spa'
            });
            app.use(vite.middlewares);
        } else {
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
