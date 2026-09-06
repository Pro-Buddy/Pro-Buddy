import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello",
    });
    console.log("2.5 success:", response.text);
  } catch(e) {
    console.log("2.5 error:", e.message);
  }
}
run();
