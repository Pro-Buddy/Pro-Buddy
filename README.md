<div align="center">
  <img src="https://img.icons8.com/color/96/000000/artificial-intelligence.png" alt="Pro Buddy Logo">
  <h1>🚀 Pro Buddy</h1>
  <h3>From Confusion to Execution</h3>
  <p><i>A Smart India Hackathon (SIH) Submission</i></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](#)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)
</div>

---

## 📌 Problem Statement
Students and early-career professionals often face **"The Execution Gap."** They have innovative ideas but lack the structured methodology to validate them. Furthermore, navigating career paths and finding the right study resources in an ocean of information leads to confusion, wasted time, and abandoned projects.

## 💡 Our Solution: Pro Buddy
**Pro Buddy** is an AI-powered multidimensional platform that evaluates project ideas, navigates career paths, and curates high-quality study resources. It transforms raw ideas into quantified, actionable technical blueprints, helping students build with certainty.

---

## 🏗️ Platform Architecture & Workflow

```mermaid
graph TD
    A[Student / User] -->|Authenticates via Google| B(Pro Buddy Dashboard)
    
    subgraph Core Modules
        B --> C[📊 Project Evaluator]
        B --> D[🎯 Career Navigator]
        B --> E[📚 Learning Guide]
    end

    subgraph AI Engine & Backend
        C -->|Project Specs| F((Gemini AI Engine))
        F -->|Analyzes 5 Pillars| C
        
        D -->|Skills & Interests| F
        F -->|Matches Industry Roles| D
        
        E -->|Topic Request| F
        F -->|Generates Curated Paths| E
    end

    subgraph Data Persistence
        C --> G[(Firebase Firestore)]
        D --> G
        E --> G
    end
    
    style F fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#ffca28,stroke:#333,stroke-width:2px,color:#000
```

---

## 🌟 Key Features

### 1. 📊 Project Evaluator (AI Validation)
Before writing a single line of code, students submit their project idea, target audience, and tech stack. 
Our Gemini-powered engine benchmarks the idea across **5 core pillars**:
- 🎯 **Difficulty Level** (Architectural Complexity)
- 📈 **Success Probability** (Market Need)
- ✨ **Uniqueness** (Differentiation from existing solutions)
- 🧠 **Tech Knowledge** (Skill Readiness)
- 🛠️ **Tech Stack Alignment**
*Output:* Concrete metric scorecards, known existing solutions, strengths/weaknesses, and an actionable execution blueprint.

### 2. 🎯 Career Navigator
Students input their current skills and interests. Pro Buddy maps these to real-world industry roles (e.g., SDE, Data Engineer, Product Manager), complete with salary expectations, required skill gaps, and direct links to live opportunities.

### 3. 📚 Learning Guide
A structured curriculum generator. Instead of endless scrolling, users get instantly curated, high-quality study resources (YouTube playlists, documentation, and roadmaps) tailored to specific technical topics (e.g., System Design, DSA, Web3).

### 4. 📈 Unified Progress Dashboard
A centralized hub that tracks a user's evaluated ideas, average innovation scores, explored careers, and study topics, all persisted securely in the cloud.

---

## ⚙️ Technology Stack

| Component | Technology | Why we chose this? |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS | Fast rendering, component-based UI, and rapid styling. |
| **Backend** | Node.js, Express.js | Non-blocking I/O, perfect for proxying AI requests. |
| **Database** | Firebase Firestore | NoSQL structure, real-time updates, scalable. |
| **Auth** | Firebase Authentication | Secure, frictionless Google Sign-In. |
| **AI Engine** | Google Gemini (2.5/3.7 Flash) | High-speed, highly accurate reasoning and structured JSON outputs. |

---

## 🏆 For SIH Judges: Why This Wins?
1. **Feasibility:** Built on highly scalable serverless infrastructure (Firebase + Cloud Run).
2. **Impact:** Directly addresses the employability and skill-gap crisis in Indian engineering education.
3. **Innovation:** Moves beyond generic chatbots by providing *structured, quantified metric scorecards* for raw ideas.
4. **Execution:** Clean UI/UX, robust error handling, and offline/online state persistence.

---

<div align="center">
  <i>Built with ❤️ for the Smart India Hackathon</i>
</div>
