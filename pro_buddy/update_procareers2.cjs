const fs = require('fs');
let content = fs.readFileSync('src/components/ProCareers.jsx', 'utf8');

// Add state
content = content.replace(
    /const \[interest, setInterest\] = useState\(''\);/,
    `const [interest, setInterest] = useState('');\n    const [manualLocation, setManualLocation] = useState('');`
);

// Modify analyzeCareers again
const oldBlock = `        let userLocation = null;
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
        }`;

const newBlock = `        let userLocation = manualLocation ? { city: manualLocation } : null;
        if (!userLocation) {
            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                try {
                    const geoRes = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${pos.coords.latitude}&lon=\${pos.coords.longitude}\`);
                    const geoData = await geoRes.json();
                    if (geoData.address) {
                        userLocation.city = geoData.address.city || geoData.address.town || geoData.address.state;
                    }
                } catch (e) {}
            } catch (err) {
                console.warn("Geolocation denied");
                if (!manualLocation) {
                    showToast('⚠️ Location access denied. Using general job market.');
                }
            }
        }`;

content = content.replace(oldBlock, newBlock);

// Add input field
const selectInterestBlock = `<div className="form-group">
                        <label>3. Tech Interest</label>
                        <select className="eval-input" value={interest} onChange={e => setInterest(e.target.value)}>`;
const newSelectInterestBlock = `<div className="form-group">
                        <label>3. Tech Interest</label>
                        <select className="eval-input" value={interest} onChange={e => setInterest(e.target.value)}>`;

const addLocationInput = `<div className="form-group">
                        <label>4. Preferred Location (Optional)</label>
                        <input type="text" className="eval-input" placeholder="e.g. Bangalore, Remote" value={manualLocation} onChange={e => setManualLocation(e.target.value)} />
                    </div>`;

content = content.replace(
    /<\/select>\s*<\/div>/,
    `</select>\n                    </div>\n                    ${addLocationInput}`
);

fs.writeFileSync('src/components/ProCareers.jsx', content);
