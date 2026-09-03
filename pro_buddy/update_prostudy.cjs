const fs = require('fs');
let content = fs.readFileSync('src/components/ProStudy.jsx', 'utf8');

// Replace YouTube a tags
content = content.replace(
    /<a href={yt\.url} target="_blank" rel="noopener noreferrer" className="study-yt-card" key={i} style={{ animationDelay: `\${i \* 0\.1}s` }}>/g,
    `<EmbedWrapper url={yt.url} title={yt.title} fallbackClass="study-yt-card" key={i}>`
);
content = content.replace(
    /<\/div>\s*<\/a>/g,
    `</div></EmbedWrapper>`
);

// Replace website a tags
content = content.replace(
    /<a href={w\.url} target="_blank" rel="noopener noreferrer" className="study-web-card" key={i} style={{ animationDelay: `\${i \* 0\.1}s` }}>/g,
    `<EmbedWrapper url={w.url} title={w.name} fallbackClass="study-web-card" key={i}>`
);
content = content.replace(
    /<\/p>\s*<\/a>/g,
    `</p></EmbedWrapper>`
);

fs.writeFileSync('src/components/ProStudy.jsx', content);
