import { useState, useEffect } from 'react';

export default function EmbedWrapper({ url, title, fallbackClass, children }) {
    const [canEmbed, setCanEmbed] = useState(null);

    useEffect(() => {
        // Quick registry check
        const urlLower = url.toLowerCase();
        if (urlLower.includes('youtube.com/results') || urlLower.includes('github.com') || urlLower.includes('linkedin.com')) {
            setCanEmbed(false);
            return;
        }
        
        fetch('/api/check-embed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        })
        .then(res => res.json())
        .then(data => setCanEmbed(data.canEmbed))
        .catch(() => setCanEmbed(false));
    }, [url]);

    if (canEmbed === null) {
        return <div className={fallbackClass} style={{ opacity: 0.5 }}>Checking link...</div>;
    }

    if (canEmbed) {
        return (
            <div className={`${fallbackClass} embedded-frame-container`} style={{ padding: 0, overflow: 'hidden', height: '200px' }}>
                <iframe src={url} title={title} style={{ width: '100%', height: '100%', border: 'none' }} />
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px', textAlign: 'center', background: '#f5f5f5', color: '#0070f3', fontSize: '12px' }}>
                    Open in New Tab ↗
                </a>
            </div>
        );
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={fallbackClass}>
            {children}
        </a>
    );
}
