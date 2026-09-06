export function fallbackCareers(skills, branch, interest, location) {
    const searchTopic = interest || branch || "Software Engineer";
    
    return {
        roles: [
            { 
                title: "Remote Developer", 
                company: "Global Tech Inc.", 
                salary: "$60k - $120k", 
                category: "Engineering", 
                skills: skills.length > 0 ? skills.slice(0, 3) : ["JavaScript", "React", "Node.js"], 
                link: `https://remoteok.com/remote-${encodeURIComponent(searchTopic)}-jobs`
            },
            { 
                title: "Frontend Engineer", 
                company: "Creative Web Agency", 
                salary: "$50k - $90k", 
                category: "Engineering", 
                skills: ["HTML", "CSS", "React"], 
                link: `https://remote.co/remote-jobs/search/?q=${encodeURIComponent(searchTopic)}`
            },
            { 
                title: "Backend Engineer", 
                company: "Cloud Systems LLC", 
                salary: "$70k - $110k", 
                category: "Engineering", 
                skills: ["Node.js", "Python", "SQL"], 
                link: `https://wellfound.com/jobs?q=${encodeURIComponent(searchTopic)}`
            },
            { 
                title: "Data Analyst", 
                company: "Insights Data", 
                salary: "$50k - $85k", 
                category: "Data", 
                skills: ["Python", "SQL", "Excel"], 
                link: `https://flexjobs.com/search?search=${encodeURIComponent(searchTopic)}`
            },
            { 
                title: "Product Manager", 
                company: "Innovate Tech", 
                salary: "$80k - $130k", 
                category: "Product", 
                skills: ["Agile", "Scrum", "Communication"], 
                link: `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(searchTopic)}`
            }
        ],
        explore: [
            { label: "Remote.co", desc: "Curated remote job board.", url: "https://remote.co/" },
            { label: "RemoteOK", desc: "Find a remote job and work from anywhere.", url: "https://remoteok.com/" },
            { label: "We Work Remotely", desc: "The largest remote work community in the world.", url: "https://weworkremotely.com/" },
            { label: "FlexJobs", desc: "Premium remote and flexible jobs.", url: "https://flexjobs.com/" },
            { label: "Wellfound", desc: "Startup jobs and startup hiring.", url: "https://wellfound.com/" }
        ]
    };
}
