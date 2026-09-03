import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { evaluateIdea } from './src/utils/evaluationEngine.js';
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
        res.json({ success: true, ...resultJson, isGemini: true });
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
        res.status(500).json({ success: false, message: err.message });
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
        res.status(500).json({ success: false, message: err.message });
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
        res.status(500).json({ success: false, message: err.message });
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
        res.status(500).json({ success: false, message: err.message });
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
        if (process.env.NODE_ENV !== 'production') {
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
