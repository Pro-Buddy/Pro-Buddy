<div align="center">
  <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="Pro Buddy Logo">
  <h1>🚀 Pro Buddy</h1>
  <h3>From Confusion to Execution</h3>
  <p><i>The AI-powered companion for students to validate project ideas, chart career paths, and curate learning resources.</i></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](#)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)
</div>

---

## ✨ Overview

Students and early-career professionals often face **"The Execution Gap."** They have innovative ideas but lack the structured methodology to validate them. 

**Pro Buddy** is a multidimensional platform that evaluates project ideas, navigates career paths, and curates high-quality study resources. It transforms raw ideas into quantified, actionable technical blueprints, helping students build with certainty.

---

## 🌟 Visual Tour & Features

### 1. 📊 Project Evaluator (AI Validation)
Before writing a single line of code, students submit their project idea, target audience, and tech stack. Our Gemini-powered engine benchmarks the idea across **5 core pillars**.

<p align="center">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" width="600" alt="Dashboard Illustration" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
</p>

*Output:* Concrete metric scorecards, known existing solutions, strengths/weaknesses, and an actionable execution blueprint.

### 2. 🎯 Pro Careers
Students input their current skills and interests. Pro Buddy maps these to real-world industry roles, complete with salary expectations, required skill gaps, and direct links to live opportunities.

### 3. 📚 Learning Guide
A structured curriculum generator. Instead of endless scrolling, users get instantly curated, high-quality study resources (YouTube playlists, documentation, and roadmaps) tailored to specific technical topics.

### 4. 🌐 Pro Buddy Community (Forum)
Exchange verified knowledge, post code architecture solutions, and help peers pass technical hurdles. 

---

## ⚙️ Technology Stack & Security

| Component | Technology | Why we chose this? |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS | Fast rendering, component-based UI, and rapid styling. |
| **Backend** | Node.js, Express.js | Non-blocking I/O, perfect for proxying AI requests. |
| **Database** | Firebase Firestore | NoSQL structure, real-time updates, scalable. |
| **Auth** | Firebase Authentication | Secure, frictionless Google Sign-In. |
| **AI Engine** | Google Gemini (3.1 Pro) | High-speed, highly accurate reasoning and structured JSON outputs. |

### 🔒 Environment & API Security
All API keys are strictly managed via environment variables. The architecture uses a full-stack Node.js proxy so the `GEMINI_API_KEY` is **never exposed** to the client browser.

Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_key_here
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file and populate it with your `GEMINI_API_KEY`. (See `.env.example`).

### 3. Start the Development Server
```bash
npm run dev
```
The app will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

<div align="center">
  <i>Built with ❤️ for students, developers, and lifelong learners.</i>
</div>
