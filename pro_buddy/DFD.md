# Pro Buddy - Data Flow Diagram (DFD)

This document contains the Level 1 Data Flow Diagram (DFD) for the **Pro Buddy** platform. It illustrates how data moves through the system between external entities, core processes, and databases.

## Methodology & Process for Implementation

You can use the diagram below in your presentations or documentation to explain the system architecture.

```mermaid
flowchart LR
    %% Styling for DFD elements
    classDef entity fill:#2c3e50,color:#fff,stroke:#34495e,stroke-width:2px;
    classDef process fill:#3498db,color:#fff,stroke:#2980b9,stroke-width:2px,shape:circle;
    classDef datastore fill:#f1c40f,color:#333,stroke:#f39c12,stroke-width:2px;
    
    %% External Entities (Squares)
    User["Student / User"]:::entity
    Gemini["Google Gemini API"]:::entity
    
    %% Processes (Circles)
    P1(("1.0\nAuth & Profile\nManager")):::process
    P2(("2.0\nProject\nEvaluator")):::process
    P3(("3.0\nCareer\nNavigator")):::process
    P4(("4.0\nStudy\nCurator")):::process
    P5(("5.0\nCommunity\nForum")):::process
    
    %% Data Stores (Open-ended / Cylinders)
    D1[("D1: Users (Firestore)")]:::datastore
    D2[("D2: Evaluations (Firestore)")]:::datastore
    D3[("D3: Forum Posts (Firestore)")]:::datastore

    %% Flows for 1.0 Auth
    User -- "Login Credentials (Google)" --> P1
    P1 -- "Store/Update Profile" --> D1
    D1 -- "Auth Status & Data" --> P1
    P1 -- "Session Validation" --> User

    %% Flows for 2.0 Project Evaluator
    User -- "Idea, Audience, Tech Stack" --> P2
    P2 -- "Prompt + JSON Schema" --> Gemini
    Gemini -- "Scored Blueprint (JSON)" --> P2
    P2 -- "Save Evaluation" --> D2
    P2 -- "Display Dashboard Insights" --> User

    %% Flows for 3.0 Career Navigator
    User -- "Skills & Interests" --> P3
    P3 -- "Career Query" --> Gemini
    Gemini -- "Roles, Skills Gap, Salaries" --> P3
    P3 -- "Career Recommendations" --> User

    %% Flows for 4.0 Study Curator
    User -- "Technical Topic Request" --> P4
    P4 -- "Generation Prompt" --> Gemini
    Gemini -- "Curated Links & Roadmap" --> P4
    P4 -- "Study Guide Display" --> User

    %% Flows for 5.0 Community Forum
    User -- "New Post / Bookmark Action" --> P5
    P5 -- "Write Post / Save Bookmark" --> D3
    D3 -- "Fetch Latest Feed" --> P5
    P5 -- "Display Community Feed" --> User
```

## Components Breakdown

### 1. External Entities (Dark Rectangles)
* **Student / User:** The primary actor providing inputs (ideas, skills) and receiving outputs (evaluations, roadmaps).
* **Google Gemini API:** The external intelligence engine that processes text prompts and returns structured JSON analysis.

### 2. Core Processes (Blue Circles)
* **1.0 Auth & Profile Manager:** Handles Google Sign-In and session state tracking.
* **2.0 Project Evaluator:** The core AI loop that scores project viability.
* **3.0 Career Navigator:** Matches skills to industry roles.
* **4.0 Study Curator:** Generates focused technical learning roadmaps.
* **5.0 Community Forum:** Manages peer-to-peer knowledge sharing and bookmarks.

### 3. Data Stores (Yellow Cylinders)
* **D1: Users:** Stores basic profile info and authentication UID.
* **D2: Evaluations:** Persists the historical AI evaluations so they show up on the user's dashboard.
* **D3: Forum Posts:** Stores the community feed, tags, and bookmark references.
