import { GoogleGenAI, Type } from "@google/genai";

let ai = null;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("[LLM Service] Gemini AI initialized.");
    } else {
        console.warn("[LLM Service] GEMINI_API_KEY is not set. AI features will fail or fallback.");
    }
} catch (err) {
    console.error("[LLM Service] Failed to initialize Gemini:", err);
}

async function callOllama(prompt, schema) {
    const OLLAMA_URL = "http://localhost:11434/api/generate";
    
    let finalPrompt = prompt;
    if (schema) {
        finalPrompt += "\n\nIMPORTANT: You must respond ONLY with valid JSON that strictly matches the following schema. Do not include markdown formatting, backticks, or any extra text outside the JSON object.\n" + JSON.stringify(schema);
    }

    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "qwen2.5:1.5b",
            prompt: finalPrompt,
            stream: false,
            format: schema ? "json" : undefined
        }),
        signal: AbortSignal.timeout(15000) // 15s timeout
    });

    if (!response.ok) {
        throw new Error(`Ollama HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.response.trim();
    
    if (schema) {
        let jsonText = text;
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```/, '').replace(/```$/, '').trim();
        }
        return JSON.parse(jsonText);
    }
    
    return text;
}

async function safeGenerateContent(prompt, schema) {
    let geminiError = null;

    if (ai) {
        const MAX_RETRIES = 3;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const config = {
                    responseMimeType: schema ? "application/json" : "text/plain",
                };
                if (schema) {
                    config.responseSchema = schema;
                }
                const response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: prompt,
                    config,
                });
                return schema ? JSON.parse(response.text) : response.text;
            } catch (err) {
                console.warn(`[LLM Service] Gemini failed (Attempt ${attempt}/${MAX_RETRIES}):`, err.message);
                geminiError = err;
                if (attempt < MAX_RETRIES && (err.status === 503 || err.status === 429 || err.message.includes("503") || err.message.includes("429"))) {
                    const delayMs = Math.pow(2, attempt) * 1000;
                    console.log(`Waiting ${delayMs}ms before retrying...`);
                    await new Promise(res => setTimeout(res, delayMs));
                } else if (attempt === MAX_RETRIES) {
                    break;
                } else {
                    // Not a retryable error, break early
                    break;
                }
            }
        }
    } else {
        console.warn("[LLM Service] Gemini API not initialized. Attempting Ollama fallback.");
    }

    // Fallback to Ollama (qwen2.5:1.5b)
    try {
        return await callOllama(prompt, schema);
    } catch (ollamaErr) {
        console.error("[LLM Service] Ollama fallback failed:", ollamaErr.message);
        throw geminiError || ollamaErr;
    }
}

export async function analyzeEvaluation(evalData) {
    const prompt = `
Analyze the following project idea across 5 dimensions: Difficulty Level, Success Probability, Uniqueness, Tech Knowledge, and Tech Stack Alignment.
Project: ${evalData.title}
Target Audience: ${evalData.target}
Tech Stack: ${evalData.techStack}
Description: ${evalData.description}

Provide a realistic score (0-100) for each dimension. Provide a brief (1-2 sentences) feedback for each.
Calculate an overall score. Provide 3 strengths, 3 weaknesses, and 3 concrete next steps. Provide a verdict tag.
Also specify if there are any known existing solutions similar to this.
Return a structured JSON object exactly matching the schema.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            scores: {
                type: Type.OBJECT,
                properties: {
                    difficulty: { type: Type.NUMBER },
                    success: { type: Type.NUMBER },
                    uniqueness: { type: Type.NUMBER },
                    techKnowledge: { type: Type.NUMBER },
                    techStack: { type: Type.NUMBER }
                },
                required: ["difficulty", "success", "uniqueness", "techKnowledge", "techStack"]
            },
            overallScore: { type: Type.NUMBER },
            feedback: {
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
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING },
            domainData: {
                type: Type.OBJECT,
                properties: {
                    domain: { type: Type.STRING },
                    existingSolutions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["domain", "existingSolutions"]
            }
        },
        required: ["scores", "overallScore", "feedback", "strengths", "weaknesses", "nextSteps", "verdict", "domainData"]
    };
    return safeGenerateContent(prompt, schema);
}

export async function generateDashboardInsight(evaluations) {
    const prompt = `Based on the following evaluated projects, provide a brief, personalized 2-sentence career or skill-building insight for the user. Do not use markdown. Projects: ${JSON.stringify(evaluations.map(e => e.title))}`;
    return safeGenerateContent(prompt, null);
}

export async function matchCareers(skills, branch, interest, location) {
    const locationContext = location ? `The user is located near ${location.city || location.region || 'their current location'}. Factor in geographic hubs for these roles if possible, or remote roles.` : 'Location unknown; suggest general roles.';
    const prompt = `
Find relevant job roles and career pathways for a candidate with the following profile:
Skills: ${skills.join(', ')}
Branch/Specialization: ${branch}
Interest: ${interest}
Location Context: ${locationContext}

Act as an expert career counselor. Suggest up to 6 highly relevant, specific job roles. For each role, provide a realistic company that hires for this role, a realistic salary range, and a link to search for this job on LinkedIn or Glassdoor (use a search URL based on the role and location). Also suggest 3 platforms or websites where they can explore more about these careers.
Return a structured JSON object.`;
    const schema = {
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
    };
    return safeGenerateContent(prompt, schema);
}

export async function curateStudyResources(topic) {
    const prompt = `
You are an expert tutor. Create a structured study guide for the topic: "${topic}".
Provide a clear label and a brief description of the core concepts in this topic.
Then, curate a list of up to 4 high-quality YouTube channels or topics that are widely recognized as the best resources to learn this.
CRITICAL: Instead of hallucinating specific video or playlist IDs (which often break or show as unavailable), you MUST generate standard YouTube search URLs (e.g. https://www.youtube.com/results?search_query=topic+tutorial) or direct channel URLs to ensure the links always work! Also specify the language of the tutorial (e.g. English, Hindi).
Then, curate a list of up to 4 high-quality websites, documentations, or platforms (like official docs, GeeksforGeeks, MDN, etc.) to learn this topic, with a short description of what they offer. Ensure the URLs are valid generic paths.
Return a structured JSON object.`;
    const schema = {
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
    };
    return safeGenerateContent(prompt, schema);
}

export async function answerChatbot(query, section) {
    const prompt = `
You are the official in-app support assistant for "Pro Buddy". Your job is to answer ANY questions the user has about the platform, its features, and how to use it.
The user is currently in the "${section}" section.
User Query: "${query}"

KNOWLEDGE BASE ABOUT PRO BUDDY:
1. General: Pro Buddy is a student platform built to take students "From Confusion to Execution". Features include Dashboard, Project Evaluator, Pro Careers, Pro Study, and Profile. It's powered by Google's Gemini AI. It's built with React, Node.js, Express, Vite, Tailwind CSS, and Firebase. It is mobile-responsive. Yes, it can be considered a Smart India Hackathon (SIH) project.
2. Auth: Uses Firebase Auth (Google Sign-In & Email/Password). It is secure. Signing in allows saving data (evaluations) across devices to the cloud (Firestore). You can't save history without an account.
3. Dashboard: Shows stats like "Ideas Evaluated", "Average Score", "Careers Explored", and "Study Topics". Features an "AI Personal Insight" based on your activity and lists "Recent Evaluations".
4. Project Evaluator: Enter Project Title, Problem, Solution, Domain, Team Size, Tech Stack, Audience, USP. It evaluates on 5 dimensions (out of 20 each): Difficulty, Success Probability, Uniqueness, Tech Knowledge, Tech Stack Alignment. Overall score is out of 100. >75 is excellent (shows "Connect with Investors" LinkedIn button), <55 means needs major work. Returns strengths, weaknesses, differentiation, and next steps. You can download the report.
5. Pro Careers: Input skills, branch, interest, location. AI matches you with roles (shows title, company, est. salary, skills) and gives LinkedIn/Glassdoor links. You can search for internships or remote jobs by typing that in "interest".
6. Pro Study: Input ANY topic (Web Dev, ML, System Design, etc.). AI curates working YouTube search links (in Hindi or English) and official website docs (like MDN). 
7. Profile/History: View and delete past evaluations. Stored in cloud.
8. Chatbot Identity: You are this AI assistant. You help navigate and explain features. You DO NOT evaluate projects directly or write code—you must tell the user to use the respective website section (Evaluator, Study, etc.) for those tasks.
9. Troubleshooting: If stuck, refresh page. Evaluation takes a few seconds. If a button is missing (like Investors), it means the score was too low.
10. Navigation: Use the top navigation menu to switch between Dashboard, Evaluator, Careers, and Study.

SCOPE: Answer the user's question accurately based ONLY on the knowledge base above. Be friendly, concise, and helpful. If they ask a general coding question (e.g. "What is python?"), politely decline and tell them to use the "Study" section.`;
    return safeGenerateContent(prompt, null);
}
