<div align="center">
  <img src="https://img.icons8.com/external-flaticons-flat-flat-icons/128/000000/external-robot-technology-flaticons-flat-flat-icons-2.png" alt="Pro Buddy Logo">
  <h1>🚀 Pro Buddy</h1>
  <h3>From Confusion to Execution</h3>
  <p><i>A Smart India Hackathon (SIH) Submission</i></p>
  
  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" width="100%" alt="Hero Banner" style="border-radius:12px; margin: 15px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
  [![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](#)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)
</div>

---

## 📌 Problem Statement & Solution

<table style="width:100%">
<tr>
<td width="50%" valign="top">
<h3>❌ The Execution Gap</h3>
Students and early-career professionals often have innovative ideas but lack the structured methodology to validate them. Navigating career paths and finding the right study resources in an ocean of information leads to confusion, wasted time, and abandoned projects.
</td>
<td width="50%" valign="top">
<h3>✅ Our Solution: Pro Buddy</h3>
An AI-powered multidimensional platform that evaluates project ideas, navigates career paths, and curates high-quality study resources. It transforms raw ideas into quantified, actionable technical blueprints, helping students build with certainty.
</td>
</tr>
</table>

### 📊 The 5-Pillar Evaluation Infographic
```mermaid
pie title AI Project Evaluation Metrics Distribution
    "Architectural Complexity (Difficulty)" : 20
    "Market Need (Success Probability)" : 20
    "Differentiation (Uniqueness)" : 20
    "Skill Readiness (Tech Knowledge)" : 20
    "Tech Stack Alignment" : 20
```

---

## 🏗️ Platform Architecture Flowchart

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

## 🗺️ The Student Journey (Timeline)

```mermaid
journey
    title A Student's Path from Idea to Execution
    section 1. Ideation
      Enter Project Idea: 5: Student
      Input Tech Stack: 4: Student
    section 2. AI Validation
      Process 5 Pillars: 5: Gemini AI
      Generate Scorecard: 5: System
    section 3. Action
      Review Weaknesses: 4: Student
      Follow Study Guide: 5: Student
      Connect to Jobs: 4: Student
```

---

## 🌟 Key Features (Visual Breakdown)

### <img src="https://img.icons8.com/color/48/000000/combo-chart--v1.png" width="32" valign="middle"/> 1. Project Evaluator (AI Validation)
<img align="right" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" width="300" style="border-radius: 8px; margin-left: 15px;">
Before writing a single line of code, students submit their project idea, target audience, and tech stack. Our Gemini-powered engine benchmarks the idea across 5 core pillars.
<br><br>
<i>Output:</i> Concrete metric scorecards, known existing solutions, strengths/weaknesses, and an actionable execution blueprint.

<br clear="all">

### <img src="https://img.icons8.com/color/48/000000/find-matching-job.png" width="32" valign="middle"/> 2. Career Navigator
<img align="left" src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" width="300" style="border-radius: 8px; margin-right: 15px;">
Students input their current skills and interests. Pro Buddy maps these to real-world industry roles (e.g., SDE, Data Engineer, Product Manager), complete with salary expectations, required skill gaps, and direct links to live opportunities on LinkedIn.

<br clear="all">

### <img src="https://img.icons8.com/color/48/000000/books.png" width="32" valign="middle"/> 3. Learning Guide
<img align="right" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" width="300" style="border-radius: 8px; margin-left: 15px;">
A structured curriculum generator. Instead of endless scrolling, users get instantly curated, high-quality study resources (YouTube playlists, documentation, and roadmaps) tailored to specific technical topics (e.g., System Design, DSA, Web3).

<br clear="all">

---

## ⚙️ Technology Stack

| Tier | Component | Technology | Why we chose this? |
| :---: | :--- | :--- | :--- |
| 🎨 | **Frontend** | React.js, Vite, Tailwind | Fast rendering, component-based UI, and rapid styling. |
| 🖥️ | **Backend** | Node.js, Express.js | Non-blocking I/O, perfect for proxying AI requests securely. |
| 🗄️ | **Database** | Firebase Firestore | NoSQL structure, real-time updates, highly scalable. |
| 🔐 | **Auth** | Firebase Authentication | Secure, frictionless Google Sign-In integration. |
| 🧠 | **AI Engine** | Google Gemini (3.1 Pro) | High-speed, highly accurate reasoning and structured JSON outputs. |

---

## 🏆 For SIH Judges: Why This Wins?

> **1. Feasibility:** Built on highly scalable serverless infrastructure (Firebase + Cloud Run). <br>
> **2. Impact:** Directly addresses the employability and skill-gap crisis in Indian engineering education. <br>
> **3. Innovation:** Moves beyond generic chatbots by providing *structured, quantified metric scorecards* for raw ideas. <br>
> **4. Execution:** Clean UI/UX, robust error handling, and offline/online state persistence.

<br>
<div align="center">
  <img src="https://img.icons8.com/fluency/96/000000/code.png" alt="Code Icon">
  <p><i>Built with ❤️ for the Smart India Hackathon</i></p>
</div>
