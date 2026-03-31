# Pro Buddy — Scoring & Curation Methodology 🇮🇳

This document outlines the logic and algorithms used across the Pro Buddy platform's three core services: **Pro Evaluator**, **Pro Suggest**, and **Pro Study**. The platform follows an India-inspired design theme and objective evaluation standards.

---

## 🧠 Pro Evaluator (Project Analysis) 🧡
*Theme: Saffron (Orange) | Logic: Analytical Scoring*

The Pro Evaluator uses a multi-dimensional scoring engine that analyzes project metadata (Title, Domain, Problem, Solution, Tech Stack, Features) using the following parameters:

### 1. 🎯 Difficulty Level (15% Weight)
Analyzes the technical complexity and implementation burden.
- **Complexity Factors**: Number of features, depth of tech stack, and module count.
- **Integration**: Number of third-party APIs (OAuth, Payments, Maps) increases the score.
- **Hardware**: Presence of IoT/Sensor/Hardware keywords increases difficulty.
- **Scoring Range**: 20–95.

### 2. 📈 Success Probability (25% Weight)
Measures the likelihood of completing the project within the 48h timeline.
- **Scope Analysis**: Word count of the solution and number of features. Excessive scope lowers probability.
- **Team Size**: Larger teams get a small success bonus.
- **Resource Depth**: Mentions of "Data", "Open Source", or existing "Libraries" increase feasibility.
- **Scoring Range**: 10–98.

### 3. ✨ Uniqueness (20% Weight)
Evaluates how the project stands out from common student submissions.
- **Niche Focus**: Keywords like "niche", "specific", or "rare" provide a bonus.
- **Hybrid Domain**: Combination of domains (e.g., AI + Blockchain) increases uniqueness score significantly.
- **Audience Specificity**: Narrow target audiences score higher than "everyone".
- **Scoring Range**: 10–98.

### 4. 🧠 Tech Knowledge & Skills (20% Weight)
Assesses the baseline expertise required for the project.
- **Algorithmic Depth**: Mentions of "Optimization", "System Design", "Search/Sort", or "AI Models" increase this.
- **Architecture**: Presence of "System Architecture", "Database Schema", or "Flow" keywords indicates high skill requirements.

### 5. 🛠️ Tech Stack Readiness (20% Weight)
Checks if the proposed tech stack is complete and modern.
- **Full-stack Balance**: High scores for including Frontendly, Backend, and Database components.
- **Modernity**: Usage of Cloud (AWS/Docker/Firebase) and AI/ML frameworks (TensorFlow/PyTorch) increases stack weight.

---

## 🚀 Pro Careers (Job Navigator) 💙
*Theme: Navy Blue | Logic: Skill-Interest Mapping*

The Careers engine matches your profile with industry roles based on a curated database.

- **Skill Match**: Matches user chips (e.g., React, Python) against required role skills.
- **Branch Context**: Filters roles based on Engineering Branch (CS, IT, ECE, Mechanical, etc.).
- **Interest Alignment**: Uses string proximity to map interests (e.g., "Robotics") to specific career paths.
- **Curation**: Links are provided to verified LinkedIn categories and exploration portals.

---

## 📚 Pro Study (Smart Learning) 💚
*Theme: India Green | Logic: Curated Resource Retrieval*

The Study engine provides verified learning paths to prevent "Tutorial Hell".

- **Topic chips**: Pre-curated high-quality resources for 8 core CS topics.
- **Search Logic**: A keyword-weighted search across the resource database.
- **Quality Check**: Channels are selected based on teaching quality (e.g., Striver, Abdul Bari, Kunal Kushwaha).
- **Format**: Resources are split into YouTube tutorials (Visual) and Web Portals (Documentation/Practice).

---

## 📊 Final Verdict Calculation
The **Overall Score** is a weighted average of the 5dimensions of Pro Evaluator.
- **🌟 Excellent (80+)**: Ready for development.
- **✅ Solid (60-79)**: Promising but needs polish/narrower scope.
- **🛠️ Needs Refinement (<60)**: Core concept needs pivot or significant simplification.

---
*Last Updated: March 2026*
