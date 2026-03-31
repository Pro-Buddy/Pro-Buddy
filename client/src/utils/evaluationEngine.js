// ========================================
// PRO BUDDY — Evaluation Engine
// Pure logic — no DOM dependencies
// ========================================

export const DOMAIN_DATA = {
    'ai-ml': {
        name: 'AI / Machine Learning',
        industries: [
            { name: 'Healthcare AI', desc: 'Diagnostics, drug discovery, patient care', companies: ['Google Health', 'IBM Watson', 'PathAI'] },
            { name: 'Autonomous Systems', desc: 'Self-driving, robotics, drones', companies: ['Tesla', 'Waymo', 'Boston Dynamics'] },
            { name: 'NLP Services', desc: 'Language processing, chatbots, translation', companies: ['OpenAI', 'Google', 'Cohere'] }
        ],
        existingSolutions: [
            { name: 'ChatGPT / OpenAI API', desc: 'General-purpose LLM for text generation, code, and Q&A', url: 'openai.com' },
            { name: 'Google Vertex AI', desc: 'ML platform for building, deploying, and scaling AI models', url: 'cloud.google.com/vertex-ai' },
            { name: 'Hugging Face', desc: 'Open-source hub for pre-trained ML models and datasets', url: 'huggingface.co' },
            { name: 'TensorFlow / PyTorch', desc: 'Leading deep learning frameworks for model development', url: 'tensorflow.org / pytorch.org' },
            { name: 'AWS SageMaker', desc: 'Fully managed ML service for training and deployment', url: 'aws.amazon.com/sagemaker' }
        ],
        keywords: ['neural network', 'deep learning', 'model', 'training', 'dataset', 'prediction', 'classification', 'nlp', 'computer vision', 'reinforcement learning', 'transformer', 'gpt', 'bert', 'cnn', 'rnn', 'tensorflow', 'pytorch'],
        techFeasibilityBase: 65, innovationBase: 70
    },
    'web-dev': {
        name: 'Web Development',
        industries: [
            { name: 'SaaS Platforms', desc: 'Business tools, dashboards, analytics', companies: ['Salesforce', 'Notion', 'Figma'] },
            { name: 'E-Commerce', desc: 'Online retail, marketplace solutions', companies: ['Shopify', 'Amazon', 'Stripe'] },
            { name: 'Social Platforms', desc: 'Community, collaboration, communication', companies: ['Meta', 'Discord', 'Slack'] }
        ],
        existingSolutions: [
            { name: 'Wix / Squarespace', desc: 'No-code website builders for quick deployment', url: 'wix.com / squarespace.com' },
            { name: 'Shopify', desc: 'E-commerce platform for online stores', url: 'shopify.com' },
            { name: 'Notion / Coda', desc: 'All-in-one workspace and productivity tools', url: 'notion.so' },
            { name: 'Firebase / Supabase', desc: 'Backend-as-a-service for web apps', url: 'firebase.google.com / supabase.com' },
            { name: 'Vercel / Netlify', desc: 'Deployment and hosting platforms for modern web apps', url: 'vercel.com / netlify.com' }
        ],
        keywords: ['react', 'angular', 'vue', 'node', 'express', 'api', 'rest', 'graphql', 'database', 'responsive', 'pwa', 'spa', 'full-stack', 'frontend', 'backend', 'next.js', 'tailwind'],
        techFeasibilityBase: 80, innovationBase: 50
    },
    'mobile': {
        name: 'Mobile App',
        industries: [
            { name: 'Mobile Commerce', desc: 'Shopping, payments, rewards', companies: ['Google Pay', 'PhonePe', 'Paytm'] },
            { name: 'Health & Wellness', desc: 'Fitness tracking, mental health', companies: ['Headspace', 'Fitbit', 'MyFitnessPal'] },
            { name: 'Social / Communication', desc: 'Messaging, community, sharing', companies: ['WhatsApp', 'Telegram', 'Instagram'] }
        ],
        existingSolutions: [
            { name: 'Flutter / React Native', desc: 'Cross-platform mobile frameworks for rapid development', url: 'flutter.dev / reactnative.dev' },
            { name: 'Firebase', desc: 'Mobile backend with auth, database, push notifications', url: 'firebase.google.com' },
            { name: 'Expo', desc: 'Framework for universal React Native apps', url: 'expo.dev' },
            { name: 'SwiftUI / Jetpack Compose', desc: 'Native UI toolkits for iOS and Android', url: 'developer.apple.com / developer.android.com' },
            { name: 'AppGyver / Adalo', desc: 'No-code mobile app builders', url: 'appgyver.com / adalo.com' }
        ],
        keywords: ['flutter', 'react native', 'swift', 'kotlin', 'android', 'ios', 'push notification', 'offline', 'geolocation', 'camera', 'sensor'],
        techFeasibilityBase: 75, innovationBase: 55
    },
    'iot': {
        name: 'IoT / Hardware',
        industries: [
            { name: 'Smart Home', desc: 'Home automation, sensors, energy', companies: ['Nest', 'Philips Hue', 'Ring'] },
            { name: 'Industrial IoT', desc: 'Manufacturing, monitoring, maintenance', companies: ['Siemens', 'GE Digital', 'Bosch'] },
            { name: 'Smart Agriculture', desc: 'Precision farming, crop monitoring', companies: ['John Deere', 'CropX', 'Agrible'] }
        ],
        existingSolutions: [
            { name: 'Arduino / ESP32', desc: 'Popular microcontroller platforms for IoT prototyping', url: 'arduino.cc' },
            { name: 'Raspberry Pi', desc: 'Single-board computer for IoT and embedded projects', url: 'raspberrypi.com' },
            { name: 'AWS IoT Core', desc: 'Cloud platform for managing IoT devices at scale', url: 'aws.amazon.com/iot-core' },
            { name: 'Blynk', desc: 'IoT platform for mobile control of hardware projects', url: 'blynk.io' },
            { name: 'Home Assistant', desc: 'Open-source home automation platform', url: 'home-assistant.io' }
        ],
        keywords: ['arduino', 'raspberry pi', 'sensor', 'actuator', 'mqtt', 'embedded', 'microcontroller', 'esp32', 'wifi', 'bluetooth', 'lora'],
        techFeasibilityBase: 60, innovationBase: 72
    },
    'blockchain': {
        name: 'Blockchain / Web3',
        industries: [
            { name: 'DeFi', desc: 'Decentralized finance, lending, trading', companies: ['Coinbase', 'Uniswap', 'Aave'] },
            { name: 'Supply Chain', desc: 'Traceability, transparency, verification', companies: ['VeChain', 'IBM Blockchain', 'Maersk'] },
            { name: 'Digital Identity', desc: 'Self-sovereign identity, credentialing', companies: ['Polygon ID', 'Civic', 'Microsoft ION'] }
        ],
        existingSolutions: [
            { name: 'Ethereum / Solidity', desc: 'Leading smart contract platform and language', url: 'ethereum.org' },
            { name: 'Polygon', desc: 'Layer-2 scaling solution for Ethereum', url: 'polygon.technology' },
            { name: 'Metamask', desc: 'Popular crypto wallet for Web3 dApps', url: 'metamask.io' },
            { name: 'OpenSea', desc: 'NFT marketplace for digital assets', url: 'opensea.io' },
            { name: 'Hardhat / Truffle', desc: 'Development frameworks for smart contracts', url: 'hardhat.org' }
        ],
        keywords: ['smart contract', 'solidity', 'ethereum', 'token', 'nft', 'dao', 'defi', 'web3', 'wallet', 'consensus', 'decentralized'],
        techFeasibilityBase: 55, innovationBase: 75
    },
    'cybersecurity': {
        name: 'Cybersecurity',
        industries: [
            { name: 'Threat Detection', desc: 'Malware analysis, intrusion detection', companies: ['CrowdStrike', 'Palo Alto', 'Fortinet'] },
            { name: 'Identity Security', desc: 'Authentication, access control', companies: ['Okta', 'Auth0', 'CyberArk'] },
            { name: 'Data Privacy', desc: 'Compliance, encryption, data protection', companies: ['OneTrust', 'BigID', 'Varonis'] }
        ],
        existingSolutions: [
            { name: 'Burp Suite', desc: 'Web vulnerability scanner and penetration testing tool', url: 'portswigger.net' },
            { name: 'Wireshark', desc: 'Network protocol analyzer for traffic inspection', url: 'wireshark.org' },
            { name: 'Nmap', desc: 'Network scanner for security auditing', url: 'nmap.org' },
            { name: 'CrowdStrike Falcon', desc: 'Endpoint detection and response platform', url: 'crowdstrike.com' },
            { name: 'Auth0', desc: 'Identity and authentication platform', url: 'auth0.com' }
        ],
        keywords: ['encryption', 'firewall', 'penetration testing', 'vulnerability', 'malware', 'phishing', 'authentication', 'zero trust', 'siem', 'threat'],
        techFeasibilityBase: 58, innovationBase: 68
    },
    'healthcare': {
        name: 'HealthTech',
        industries: [
            { name: 'Telemedicine', desc: 'Remote consultations, monitoring', companies: ['Teladoc', 'Amwell', 'Practo'] },
            { name: 'Medical Devices', desc: 'Wearables, diagnostics, implants', companies: ['Medtronic', 'Abbott', 'Dexcom'] },
            { name: 'Health Analytics', desc: 'Population health, EHR, genomics', companies: ['Epic', 'Flatiron Health', 'Tempus'] }
        ],
        existingSolutions: [
            { name: 'Practo', desc: 'Doctor consultation and health records platform', url: 'practo.com' },
            { name: 'Fitbit / Apple Health', desc: 'Wearable health monitoring and fitness tracking', url: 'fitbit.com' },
            { name: '1mg / PharmEasy', desc: 'Online pharmacy and health products delivery', url: '1mg.com' },
            { name: 'Cure.fit (Cultfit)', desc: 'Health and fitness platform with workout & nutrition', url: 'cult.fit' },
            { name: 'mFine / Apollo 24|7', desc: 'AI-powered telemedicine and diagnosis platforms', url: 'mfine.co' }
        ],
        keywords: ['patient', 'diagnosis', 'medical', 'clinical', 'health record', 'telemedicine', 'wearable', 'genomics', 'drug', 'hospital'],
        techFeasibilityBase: 62, innovationBase: 74
    },
    'fintech': {
        name: 'FinTech',
        industries: [
            { name: 'Digital Banking', desc: 'Neobanking, savings, transfers', companies: ['Razorpay', 'Stripe', 'Revolut'] },
            { name: 'InsurTech', desc: 'Digital insurance, claims processing', companies: ['Lemonade', 'PolicyBazaar', 'Root'] },
            { name: 'WealthTech', desc: 'Robo-advisory, portfolio management', companies: ['Zerodha', 'Robinhood', 'Wealthfront'] }
        ],
        existingSolutions: [
            { name: 'Razorpay / Stripe', desc: 'Payment gateway and financial APIs', url: 'razorpay.com / stripe.com' },
            { name: 'Zerodha / Groww', desc: 'Discount broking and investment platforms', url: 'zerodha.com / groww.in' },
            { name: 'PhonePe / Google Pay', desc: 'UPI-based digital payment apps', url: 'phonepe.com' },
            { name: 'Cred', desc: 'Credit card management and rewards platform', url: 'cred.club' },
            { name: 'PolicyBazaar', desc: 'Insurance comparison and purchase platform', url: 'policybazaar.com' }
        ],
        keywords: ['payment', 'transaction', 'banking', 'loan', 'credit', 'insurance', 'investment', 'wallet', 'upi', 'kyc'],
        techFeasibilityBase: 64, innovationBase: 65
    },
    'edtech': {
        name: 'EdTech',
        industries: [
            { name: 'E-Learning', desc: 'Online courses, MOOCs, tutoring', companies: ['Coursera', 'Unacademy', "Byju's"] },
            { name: 'Assessment Tech', desc: 'Testing, proctoring, evaluation', companies: ['Mercer Mettl', 'ExamSoft', 'Proctorio'] },
            { name: 'Skill Development', desc: 'Coding bootcamps, upskilling', companies: ['Scaler', 'Udemy', 'Pluralsight'] }
        ],
        existingSolutions: [
            { name: 'Coursera / Udemy', desc: 'Online learning platforms with thousands of courses', url: 'coursera.org / udemy.com' },
            { name: 'Khan Academy', desc: 'Free educational content for K-12 and beyond', url: 'khanacademy.org' },
            { name: 'Duolingo', desc: 'Gamified language learning app', url: 'duolingo.com' },
            { name: "Unacademy / BYJU'S", desc: 'Indian ed-tech platforms for competitive exams', url: 'unacademy.com' },
            { name: 'Google Classroom', desc: 'Learning management system for schools', url: 'classroom.google.com' }
        ],
        keywords: ['learning', 'student', 'course', 'quiz', 'assessment', 'teaching', 'classroom', 'curriculum', 'gamification', 'adaptive'],
        techFeasibilityBase: 78, innovationBase: 58
    },
    'sustainability': {
        name: 'Sustainability / GreenTech',
        industries: [
            { name: 'Clean Energy', desc: 'Solar, wind, energy storage', companies: ['Tesla Energy', 'Enphase', 'SunRun'] },
            { name: 'Waste Management', desc: 'Recycling tech, circular economy', companies: ['Rubicon', 'AMP Robotics', 'TerraCycle'] },
            { name: 'Carbon Tech', desc: 'Carbon tracking, offsetting, credits', companies: ['Pachama', 'Climeworks', 'Watershed'] }
        ],
        existingSolutions: [
            { name: 'Ecosia', desc: 'Eco-friendly search engine that plants trees', url: 'ecosia.org' },
            { name: 'Pachama', desc: 'Carbon credit marketplace using satellite data', url: 'pachama.com' },
            { name: 'Olio', desc: 'Food sharing app to reduce waste', url: 'olioex.com' },
            { name: 'JouleBug', desc: 'Sustainability habit tracking app', url: 'joulebug.com' },
            { name: 'Wren', desc: 'Personal carbon footprint calculator and offset tool', url: 'wren.co' }
        ],
        keywords: ['carbon', 'renewable', 'solar', 'recycle', 'emission', 'sustainable', 'green', 'energy', 'climate', 'eco-friendly'],
        techFeasibilityBase: 62, innovationBase: 76
    },
    'social-impact': {
        name: 'Social Impact',
        industries: [
            { name: 'Civic Tech', desc: 'Governance, transparency, voting', companies: ['Change.org', 'Civicly', 'OpenGov'] },
            { name: 'Accessibility', desc: 'Inclusive tech, assistive tools', companies: ['Microsoft Accessibility', 'Be My Eyes', 'Aira'] },
            { name: 'Non-Profit Tech', desc: 'Donation platforms, volunteer mgmt', companies: ['GoFundMe', 'GlobalGiving', 'Kiva'] }
        ],
        existingSolutions: [
            { name: 'Change.org', desc: 'Online petition platform for social causes', url: 'change.org' },
            { name: 'Be My Eyes', desc: 'App connecting blind users with sighted volunteers', url: 'bemyeyes.com' },
            { name: 'GoFundMe', desc: 'Crowdfunding platform for causes and individuals', url: 'gofundme.com' },
            { name: 'Kiva', desc: 'Micro-lending platform for underserved communities', url: 'kiva.org' },
            { name: 'GiveDirectly', desc: 'Direct cash transfers to people in extreme poverty', url: 'givedirectly.org' }
        ],
        keywords: ['community', 'volunteer', 'donation', 'inclusive', 'accessibility', 'social', 'impact', 'ngo', 'empowerment', 'underserved'],
        techFeasibilityBase: 75, innovationBase: 68
    },
    'gaming': {
        name: 'Gaming / AR / VR',
        industries: [
            { name: 'Game Development', desc: 'Indie games, mobile games, esports', companies: ['Unity', 'Epic Games', 'Valve'] },
            { name: 'AR Applications', desc: 'Augmented reality, spatial computing', companies: ['Apple Vision', 'Snap', 'Niantic'] },
            { name: 'VR Training', desc: 'Simulation, virtual training environments', companies: ['Meta Quest', 'Strivr', 'Mursion'] }
        ],
        existingSolutions: [
            { name: 'Unity', desc: 'Cross-platform game engine for 2D/3D games', url: 'unity.com' },
            { name: 'Unreal Engine', desc: 'High-fidelity game engine by Epic Games', url: 'unrealengine.com' },
            { name: 'Roblox Studio', desc: 'Game creation platform with built-in community', url: 'roblox.com' },
            { name: 'Spark AR / Lens Studio', desc: 'AR filter creation tools for social media', url: 'sparkar.facebook.com' },
            { name: 'Godot', desc: 'Open-source game engine for indie developers', url: 'godotengine.org' }
        ],
        keywords: ['game', 'unity', 'unreal', 'ar', 'vr', 'augmented', 'virtual', 'immersive', '3d', 'simulation', 'metaverse'],
        techFeasibilityBase: 60, innovationBase: 73
    },
    'data-analytics': {
        name: 'Data Analytics',
        industries: [
            { name: 'Business Intelligence', desc: 'Dashboards, reporting, KPIs', companies: ['Tableau', 'Power BI', 'Looker'] },
            { name: 'Big Data', desc: 'Data pipelines, warehousing, processing', companies: ['Snowflake', 'Databricks', 'Cloudera'] },
            { name: 'Predictive Analytics', desc: 'Forecasting, trend analysis, ML ops', companies: ['DataRobot', 'H2O.ai', 'Palantir'] }
        ],
        existingSolutions: [
            { name: 'Tableau / Power BI', desc: 'Data visualization and business intelligence tools', url: 'tableau.com / powerbi.microsoft.com' },
            { name: 'Google Analytics', desc: 'Web and app analytics platform', url: 'analytics.google.com' },
            { name: 'Apache Spark', desc: 'Large-scale data processing engine', url: 'spark.apache.org' },
            { name: 'Snowflake', desc: 'Cloud data warehouse for analytics', url: 'snowflake.com' },
            { name: 'Metabase', desc: 'Open-source BI tool for querying databases', url: 'metabase.com' }
        ],
        keywords: ['data', 'analytics', 'visualization', 'dashboard', 'pipeline', 'etl', 'warehouse', 'sql', 'insight', 'metric'],
        techFeasibilityBase: 72, innovationBase: 60
    },
    'other': {
        name: 'Other',
        industries: [
            { name: 'General Technology', desc: 'Broad tech applications', companies: ['Google', 'Microsoft', 'Amazon'] },
            { name: 'Startup Ecosystem', desc: 'Innovation, entrepreneurship', companies: ['Y Combinator', 'Techstars', 'AngelList'] },
            { name: 'Open Source', desc: 'Community-driven development', companies: ['GitHub', 'GitLab', 'Mozilla'] }
        ],
        existingSolutions: [
            { name: 'GitHub', desc: 'Code hosting and collaboration platform', url: 'github.com' },
            { name: 'Stack Overflow', desc: 'Q&A platform for developers', url: 'stackoverflow.com' },
            { name: 'Product Hunt', desc: 'Platform for discovering new tech products', url: 'producthunt.com' },
            { name: 'Replit', desc: 'Online IDE and collaborative coding platform', url: 'replit.com' },
            { name: 'Figma', desc: 'Collaborative UI/UX design tool', url: 'figma.com' }
        ],
        keywords: [],
        techFeasibilityBase: 70, innovationBase: 60
    }
};

export const TECH_STACK_DB = {
    'react': { difficulty: 'medium', skills: ['JavaScript', 'JSX', 'State Management', 'Component Architecture'] },
    'angular': { difficulty: 'hard', skills: ['TypeScript', 'RxJS', 'Dependency Injection', 'Modules'] },
    'vue': { difficulty: 'easy', skills: ['JavaScript', 'Vue CLI', 'Vuex', 'Components'] },
    'next.js': { difficulty: 'medium', skills: ['React', 'SSR/SSG', 'API Routes', 'Vercel Deployment'] },
    'node': { difficulty: 'medium', skills: ['JavaScript', 'Express', 'REST APIs', 'npm'] },
    'express': { difficulty: 'easy', skills: ['Node.js', 'Routing', 'Middleware', 'REST'] },
    'python': { difficulty: 'easy', skills: ['Python Basics', 'pip', 'Virtual Environments'] },
    'django': { difficulty: 'medium', skills: ['Python', 'ORM', 'MVT Architecture', 'Admin Panel'] },
    'flask': { difficulty: 'easy', skills: ['Python', 'Routing', 'Jinja2', 'REST APIs'] },
    'flutter': { difficulty: 'medium', skills: ['Dart', 'Widget Tree', 'State Management', 'Material Design'] },
    'react native': { difficulty: 'medium', skills: ['React', 'Mobile Development', 'Native Modules', 'Expo'] },
    'swift': { difficulty: 'hard', skills: ['iOS Development', 'SwiftUI', 'Xcode', 'Core Data'] },
    'kotlin': { difficulty: 'medium', skills: ['Android Development', 'Jetpack Compose', 'Android Studio'] },
    'tensorflow': { difficulty: 'hard', skills: ['Python', 'Linear Algebra', 'Neural Networks', 'Data Processing'] },
    'pytorch': { difficulty: 'hard', skills: ['Python', 'Deep Learning', 'Tensor Operations', 'GPU Computing'] },
    'mongodb': { difficulty: 'easy', skills: ['NoSQL', 'Document Databases', 'Mongoose', 'CRUD'] },
    'postgresql': { difficulty: 'medium', skills: ['SQL', 'Relational Databases', 'Queries', 'Migrations'] },
    'mysql': { difficulty: 'medium', skills: ['SQL', 'Relational Databases', 'Joins', 'Indexing'] },
    'firebase': { difficulty: 'easy', skills: ['NoSQL', 'Authentication', 'Cloud Functions', 'Hosting'] },
    'aws': { difficulty: 'hard', skills: ['Cloud Computing', 'IAM', 'EC2/S3', 'Lambda'] },
    'docker': { difficulty: 'medium', skills: ['Containerization', 'Docker Compose', 'Images', 'Networking'] },
    'blockchain': { difficulty: 'hard', skills: ['Solidity', 'Smart Contracts', 'Web3.js', 'Cryptography'] },
    'solidity': { difficulty: 'hard', skills: ['Ethereum', 'Smart Contracts', 'Gas Optimization', 'Hardhat'] },
    'arduino': { difficulty: 'medium', skills: ['C/C++', 'Electronics', 'Serial Communication', 'Sensors'] },
    'raspberry pi': { difficulty: 'medium', skills: ['Linux', 'Python', 'GPIO', 'Networking'] },
    'machine learning': { difficulty: 'hard', skills: ['Statistics', 'Python', 'Scikit-learn', 'Feature Engineering'] },
    'deep learning': { difficulty: 'hard', skills: ['Neural Networks', 'Python', 'GPU Computing', 'Math'] },
    'tailwind': { difficulty: 'easy', skills: ['CSS', 'Utility Classes', 'Responsive Design'] },
    'graphql': { difficulty: 'medium', skills: ['API Design', 'Resolvers', 'Schema Definition', 'Apollo'] },
    'java': { difficulty: 'medium', skills: ['OOP', 'JVM', 'Spring Boot', 'Maven/Gradle'] },
    'spring boot': { difficulty: 'hard', skills: ['Java', 'Dependency Injection', 'REST APIs', 'JPA'] },
    'rust': { difficulty: 'hard', skills: ['Systems Programming', 'Ownership Model', 'Cargo', 'Concurrency'] },
    'go': { difficulty: 'medium', skills: ['Concurrency', 'Goroutines', 'Networking', 'CLI Tools'] },
};

// ---- Helpers ----
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function randomVariance(range) {
    return (Math.random() - 0.5) * range * 2;
}

function countKeywords(text, keywords) {
    let count = 0;
    const lowerText = text.toLowerCase();
    keywords.forEach(kw => { if (lowerText.includes(kw)) count++; });
    return count;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---- Sub-parameter Scoring ----
function calculateDifficulty(formData, allText, stackDifficultyAvg, stackCount) {
    let score = 50;
    const featureCount = formData.solution.split(/,|\n|•|- /).length;
    score += (featureCount > 5 ? 10 : featureCount * 2);
    score += (stackDifficultyAvg - 1.5) * 20;
    score += countKeywords(allText, ['api', 'integrate', 'connect', 'third-party', 'service', 'oauth', 'payment']) * 5;
    score += countKeywords(allText, ['learn', 'study', 'research', 'new to', 'unfamiliar', 'custom']) * 4;
    score += countKeywords(allText, ['hardware', 'sensor', 'gps', 'camera', 'bluetooth', 'external', 'device']) * 6;
    return clamp(score, 20, 95);
}

function calculateSuccess(formData, allText, teamSize, stackCount) {
    let score = 65;
    const wordCount = allText.split(/\s+/).length;
    if (wordCount > 300) score -= 10;
    if (formData.solution.length > 500) score -= 15;
    const teamBonus = { '1': -5, '2': 0, '3': 5, '5': 10 };
    score += (teamBonus[teamSize] || 0);
    score += countKeywords(allText, ['dataset', 'data', 'open source', 'api', 'library', 'framework', 'available']) * 4;
    score += countKeywords(allText, ['demo', 'ui', 'frontend', 'visual', 'prototype', 'mockup', 'screen']) * 5;
    score -= countKeywords(allText, ['security', 'privacy', 'payment', 'real-time', 'hardware', 'complex']) * 4;
    return clamp(score, 10, 98);
}

function calculateUniqueness(formData, allText) {
    let score = 50;
    if (allText.includes('daily') || allText.includes('common') || allText.includes('student')) score -= 5;
    if (allText.includes('niche') || allText.includes('specific') || allText.includes('rare')) score += 10;
    if (formData.uniqueFeatures.length > 50) score += 10;
    score += countKeywords(allText, ['novel', 'new', 'first', 'patent', 'invention', 'innovative', 'unique']) * 5;
    if (allText.includes('ai') && allText.includes('blockchain')) score += 15;
    if (allText.includes('ar') && allText.includes('iot')) score += 15;
    if (formData.targetAudience.length > 30) score += 5;
    if (formData.targetAudience.includes('everyone') || formData.targetAudience.includes('all')) score -= 10;
    if (allText.includes('similar to') || allText.includes('like')) score -= 5;
    if (allText.includes('unlike') || allText.includes('different from')) score += 5;
    return clamp(score + randomVariance(5), 10, 98);
}

function calculateTechKnowledge(formData, allText, stackCount, requiredSkills) {
    let score = 40;
    if (stackCount > 3) score += 10;
    if (allText.includes('advanced') || allText.includes('senior')) score += 10;
    score += countKeywords(allText, ['industry', 'market', 'regulations', 'compliance', 'process', 'workflow']) * 4;
    score += countKeywords(allText, ['algorithm', 'optimize', 'search', 'sort', 'graph', 'tree', 'ai model']) * 6;
    score += stackCount * 3;
    score += countKeywords(allText, ['architecture', 'database schema', 'flow', 'component', 'system', 'structure']) * 5;
    return clamp(score, 20, 98);
}

function calculateTechStackReq(formData, allText, stackCount) {
    let score = 30;
    score += countKeywords(formData.techStack.toLowerCase(), ['react', 'vue', 'angular', 'html', 'css', 'ui', 'flutter', 'swift']) * 5;
    score += countKeywords(formData.techStack.toLowerCase(), ['node', 'express', 'python', 'java', 'go', 'php', 'server']) * 5;
    score += countKeywords(formData.techStack.toLowerCase(), ['mongo', 'sql', 'firebase', 'data', 'storage']) * 5;
    score += countKeywords(allText, ['ai', 'ml', 'blockchain', 'iot', 'ar', 'vr', 'cloud']) * 8;
    score += countKeywords(allText, ['aws', 'cloud', 'hosting', 'deploy', 'docker', 'ci/cd']) * 6;
    return clamp(score, 20, 98);
}

function generateFeedback(scores, formData, domainData, detectedTechs, requiredSkills) {
    const strengths = [];
    const weaknesses = [];
    const suggestions = [];
    const nextSteps = [];

    if (scores.difficulty <= 60 && scores.difficulty >= 40) strengths.push('Balanced difficulty level — ambitious yet achievable.');
    if (scores.success >= 70) strengths.push('Strong success probability based on your team and scope.');
    if (scores.uniqueness >= 70) strengths.push('High uniqueness — this idea stands out in the crowd.');
    if (scores.techStack >= 65) strengths.push('Robust tech stack — you have covered the necessary layers well.');
    if (formData.uniqueFeatures.length > 30) strengths.push('Well-defined unique selling points.');
    if (strengths.length === 0) strengths.push('The core concept addresses a valid user need.');

    if (scores.difficulty > 85) weaknesses.push('Risk of over-complexity. Ensure you don\'t get stuck in "integration hell".');
    if (scores.success < 50) weaknesses.push('Success prob. is low — likely due to scope creep or undefined risks.');
    if (scores.uniqueness < 50) weaknesses.push('Differentiation is weak. Look for a more specific niche.');
    if (scores.techKnowledge < 40) weaknesses.push('Skill requirements may be understated. Ensure team is ready to learn.');
    if (weaknesses.length === 0) weaknesses.push('No major weaknesses detected. Focus on polish.');

    suggestions.push(`Consider adding ${getRandomItem(['real-time features', 'AI personalization', 'social sharing', 'gamification'])} to boost engagement.`);
    if (scores.uniqueness < 60) suggestions.push('Research direct competitors to find a specific feature gap to exploit.');
    suggestions.push('Create a "Day 1" MVP plan that cuts all non-essential features.');

    nextSteps.push('Validate your problem statement with 3 real users.');
    nextSteps.push('Sketch the 3 key screens of your solution.');
    nextSteps.push('Set up your git repository and project board.');
    if (requiredSkills.size > 0) {
        nextSteps.push(`Review documentation for: ${Array.from(requiredSkills).slice(0, 3).join(', ')}.`);
    }

    let verdict = '';
    let verdictTags = [];
    if (scores.overall >= 80) {
        verdict = '🌟 Excellent Project Candidate';
        verdictTags = [{ text: 'High Potential', type: 'green' }];
    } else if (scores.overall >= 60) {
        verdict = '✅ Solid Contender';
        verdictTags = [{ text: 'Promising', type: 'yellow' }];
    } else {
        verdict = '🛠️ Needs Refinement';
        verdictTags = [{ text: 'Work in Progress', type: 'red' }];
    }

    const dimFeedback = {
        difficulty: scores.difficulty > 70 ? 'High complexity.' : 'Manageable complexity.',
        success: scores.success > 70 ? 'High probability.' : 'Risks detected.',
        uniqueness: scores.uniqueness > 70 ? 'Very unique.' : 'Standard approach.',
        techKnowledge: scores.techKnowledge > 70 ? 'High skill req.' : 'Moderate entry barrier.',
        techStack: scores.techStack > 70 ? 'Complex stack.' : 'Simple stack.'
    };

    return { strengths, weaknesses, suggestions, nextSteps, verdict, verdictTags, dimFeedback, conclusion: '' };
}

// ---- Main Evaluation Function ----
export function evaluateIdea(formData) {
    const domainData = DOMAIN_DATA[formData.domain] || DOMAIN_DATA['other'];
    const allText = `${formData.title} ${formData.problem} ${formData.solution} ${formData.techStack} ${formData.targetAudience} ${formData.uniqueFeatures}`.toLowerCase();

    const techStackInput = formData.techStack.toLowerCase();
    const detectedTechs = [];
    const requiredSkills = new Set();
    let stackDifficultySum = 0;
    let stackCount = 0;

    Object.keys(TECH_STACK_DB).forEach(tech => {
        if (techStackInput.includes(tech)) {
            const t = TECH_STACK_DB[tech];
            detectedTechs.push({ name: tech, ...t });
            t.skills.forEach(s => requiredSkills.add(s));
            stackDifficultySum += (t.difficulty === 'hard' ? 3 : t.difficulty === 'medium' ? 2 : 1);
            stackCount++;
        }
    });

    const avgStackDifficulty = stackCount > 0 ? stackDifficultySum / stackCount : 1.5;

    const difficulty = calculateDifficulty(formData, allText, avgStackDifficulty, stackCount);
    const success = calculateSuccess(formData, allText, formData.teamSize, stackCount);
    const uniqueness = calculateUniqueness(formData, allText);
    const techKnowledge = calculateTechKnowledge(formData, allText, stackCount, requiredSkills);
    const techStackScore = calculateTechStackReq(formData, allText, stackCount);

    const overallScore = Math.round(
        (difficulty * 0.15) + (success * 0.25) + (uniqueness * 0.2) + (techKnowledge * 0.2) + (techStackScore * 0.2)
    );

    let conclusion = '';
    if (overallScore >= 80) {
        conclusion = `This project shows exceptional promise. The ${difficulty > 70 ? 'high difficulty' : 'balanced difficulty'} is matched by a strong team and stack configuration. Uniqueness is a key highlight, making this a competitive entry. Focus on executing the advanced features.`;
    } else if (overallScore >= 60) {
        conclusion = `A solid project with good potential. While the success probability is stable, paying attention to the ${techKnowledge > 60 ? 'technical knowledge requirements' : 'uniqueness'} will be crucial. Consider refining the scope to ensure a polished delivery.`;
    } else {
        conclusion = `This idea has merit but faces challenges in ${difficulty > 70 ? 'implementation complexity' : 'differentiation'}. The scope may need adjustment to match the available time and resources. Prioritize the core functionality to build a working MVP first.`;
    }

    const scores = {
        difficulty: Math.round(difficulty),
        success: Math.round(success),
        uniqueness: Math.round(uniqueness),
        techKnowledge: Math.round(techKnowledge),
        techStack: Math.round(techStackScore),
        overall: overallScore
    };

    const feedback = generateFeedback(scores, formData, domainData, detectedTechs, requiredSkills);
    feedback.conclusion = conclusion;

    return { scores, feedback, domainData };
}

export function getBar(score) {
    const filled = Math.round(score / 5);
    return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

export function generateReport(scores, feedback, formData, domainData) {
    return `
╔══════════════════════════════════════════════════════════╗
║                PRO BUDDY — ANALYSIS REPORT               ║
║           Project Evaluation & Strategic Roadmap         ║
║          ----------------------------------------        ║
║                 Confusion to Execution                   ║
╚══════════════════════════════════════════════════════════╝

📋 PROJECT: ${formData.title}
📅 Date: ${new Date().toLocaleDateString()}
🏷️ Domain: ${domainData.name}
⏱️ Timeline: ${formData.timeline || '48h'}
👥 Team Size: ${formData.teamSize}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 OVERALL SCORE: ${scores.overall}/100
${feedback.verdict}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 DIMENSION SCORES:
  🎯 Difficulty Level:       ${scores.difficulty}%  ${getBar(scores.difficulty)}
  📈 Success Probability:    ${scores.success}%  ${getBar(scores.success)}
  ✨ Uniqueness:             ${scores.uniqueness}%  ${getBar(scores.uniqueness)}
  🧠 Tech Knowledge:         ${scores.techKnowledge}%  ${getBar(scores.techKnowledge)}
  🛠️ Tech Stack Readiness:   ${scores.techStack}%  ${getBar(scores.techStack)}

🔎 KNOWN EXISTING SOLUTIONS:
${domainData.existingSolutions ? domainData.existingSolutions.map(s => '  • ' + s.name + ' — ' + s.desc + ' (' + s.url + ')').join('\n') : '  No data available'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💪 STRENGTHS:
${feedback.strengths.map(s => '  ✓ ' + s).join('\n')}

⚠️ AREAS FOR IMPROVEMENT:
${feedback.weaknesses.map(w => '  ✗ ' + w).join('\n')}

🎯 DIFFERENTIATION STRATEGIES:
${feedback.suggestions.map((s, i) => '  ' + (i + 1) + '. ' + s).join('\n')}

🏢 INDUSTRY CONNECTIONS:
${domainData.industries.map(ind => '  • ' + ind.name + ' — ' + ind.desc + '\n    Companies: ' + ind.companies.join(', ')).join('\n')}

🚀 RECOMMENDED NEXT STEPS:
${feedback.nextSteps.map((s, i) => '  ' + (i + 1) + '. ' + s).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by Pro Buddy — probuddy.ai
`;
}
