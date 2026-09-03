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

const MODEL_NAME = "gemini-3.5-flash";

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
        try {
            const config = {
                responseMimeType: schema ? "application/json" : "text/plain",
            };
            if (schema) {
                config.responseSchema = schema;
            }
            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
                config,
            });
            return schema ? JSON.parse(response.text) : response.text;
        } catch (err) {
            console.warn("[LLM Service] Gemini failed, attempting Ollama fallback:", err.message);
            geminiError = err;
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
You are a helpful in-app support assistant for "Pro Buddy", a platform for students with features: Dashboard, Evaluator (project idea analysis), Careers (job matching), and Study (resource curation).
The user is currently in the "${section}" section.
User Query: "${query}"

SCOPE: You are strictly scoped to helping users navigate the website and resolve doubts related to site usage. 
If the user asks a general knowledge question (e.g. "What is python?"), politely decline and remind them you are the site navigation assistant, but they can use the "Study" section to learn about it.
Keep answers concise, friendly, and helpful.`;
    return safeGenerateContent(prompt, null);
}
