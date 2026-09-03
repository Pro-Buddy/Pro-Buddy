const fs = require('fs');
let content = fs.readFileSync('src/components/ProCareers.jsx', 'utf8');

// Replace analyzeCareers function
const originalAnalyze = `async function analyzeCareers() {
        if (!branch || !interest || skills.length === 0) {
            showToast('⚠️ Please complete your profile selections.');
            return;
        }

        setIsAnalyzing(true);
        try {
            // First try Gemini API
            const response = await fetch('/api/careers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills, branch, interest })
            });`;

const newAnalyze = `async function analyzeCareers() {
        if (!branch || !interest || skills.length === 0) {
            showToast('⚠️ Please complete your profile selections.');
            return;
        }

        setIsAnalyzing(true);
        
        let userLocation = null;
        try {
            // Try to get location
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            // Reverse geocode basic via free API (or just send lat/lng to backend)
            userLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            try {
                const geoRes = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${pos.coords.latitude}&lon=\${pos.coords.longitude}\`);
                const geoData = await geoRes.json();
                if (geoData.address) {
                    userLocation.city = geoData.address.city || geoData.address.town || geoData.address.state;
                }
            } catch (e) {
                // Ignore geocode error
            }
        } catch (err) {
            console.warn("Geolocation denied or failed", err);
            // Fallback: we could prompt for manual location, but for now just proceed without it
            showToast('⚠️ Location access denied, showing general jobs.');
        }

        try {
            // First try Gemini API
            const response = await fetch('/api/careers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills, branch, interest, location: userLocation })
            });`;

content = content.replace(originalAnalyze, newAnalyze);

fs.writeFileSync('src/components/ProCareers.jsx', content);
