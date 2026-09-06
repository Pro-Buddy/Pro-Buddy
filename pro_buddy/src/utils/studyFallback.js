export function fallbackStudy(topic) {
    const searchTopic = topic || "Web Development";
    const encodedTopic = encodeURIComponent(searchTopic);
    
    return {
        label: searchTopic,
        description: `Learn the core concepts and fundamental building blocks of ${searchTopic}.`,
        youtube: [
            { channel: "freeCodeCamp.org", title: `${searchTopic} Full Course`, url: `https://www.youtube.com/results?search_query=${encodedTopic}+full+course+playlist`, lang: "English" },
            { channel: "Programming with Mosh", title: `${searchTopic} Tutorial for Beginners`, url: `https://www.youtube.com/results?search_query=${encodedTopic}+playlist+mosh`, lang: "English" },
            { channel: "CodeWithHarry", title: `${searchTopic} Tutorials`, url: `https://www.youtube.com/results?search_query=${encodedTopic}+playlist+codewithharry`, lang: "Hindi" },
            { channel: "Traversy Media", title: `${searchTopic} Crash Course Series`, url: `https://www.youtube.com/results?search_query=${encodedTopic}+playlist+traversy`, lang: "English" },
            { channel: "Apna College", title: `${searchTopic} Placements Series`, url: `https://www.youtube.com/results?search_query=${encodedTopic}+playlist+apna+college`, lang: "Hindi" }
        ],
        websites: [
            { name: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "Official web documentation and tutorials." },
            { name: "GeeksforGeeks", url: `https://www.geeksforgeeks.org/search/?q=${encodedTopic}`, desc: "Computer science portal with tutorials and articles." },
            { name: "freeCodeCamp", url: `https://www.freecodecamp.org/news/search/?query=${encodedTopic}`, desc: "Open source community with programming tutorials." },
            { name: "W3Schools", url: "https://www.w3schools.com/", desc: "Web development tutorials and references." },
            { name: "Coursera", url: `https://www.coursera.org/search?query=${encodedTopic}`, desc: "Online courses from top universities and companies." }
        ]
    };
}
