// Static / Fallback Reviews Data
// Usage: Used when AI generation fails or for initial state

// Default generic reviews (Legacy support)
export const reviews = [
    {
        id: 1,
        text: "Excellent service from Landmark Properties! They helped us find our dream home within our budget.",
        rating: 5,
    },
    // ... (rest of simple reviews)
];

// Platform-Specific Static Reviews
export const staticReviewsByPlatform = {
    google: [
        {
            id: "g1",
            text: "Excellent service! Found my dream plot in Sector 7. The team was very helpful throughout the process.",
            author: "Rajesh Kumar",
            rating: 5,
        },
        {
            id: "g2",
            text: "Bought a flat through Landmark Properties. Very professional and transparent dealings. Bahut accha experience raha!",
            author: "Priya Sharma",
            rating: 5,
        },
        {
            id: "g3",
            text: "Was looking for commercial space in Pipli Road. They showed me multiple options and helped with paperwork.",
            author: "Amit Singh",
            rating: 5,
        },
        {
            id: "g4",
            text: "Great team! Got my house registered within 2 weeks. Very efficient and trustworthy.",
            author: "Sunita Devi",
            rating: 5,
        },
        {
            id: "g5",
            text: "NRI here. Invested in a plot near University. Landmark made the whole process smooth from abroad.",
            author: "Vikram Patel",
            rating: 5,
        },
        {
            id: "g6",
            text: "Rented an apartment in Sector 13. Quick service and reasonable rates. Will recommend!",
            author: "Neha Gupta",
            rating: 5,
        },
        {
            id: "g7",
            text: "Sahi deal mili yahan pe. Bahut options dikhaye and price bhi theek tha.",
            author: "Rohit Verma",
            rating: 5,
        },
        {
            id: "g8",
            text: "The owner himself showed us properties. Very personal service. Bought a builder floor.",
            author: "Anita Rani",
            rating: 5,
        },
        {
            id: "g9",
            text: "Tried other dealers but Landmark was the most genuine. Got my shop in Urban Estate.",
            author: "Deepak Malik",
            rating: 5,
        },
    ],
    trustpilot: [
        {
            id: "t1",
            text: "5 stars! Landmark Properties helped us find the perfect family home in Thanesar. Highly satisfied!",
            author: "Mohit Agarwal",
            rating: 5,
        },
        {
            id: "t2",
            text: "Professional service from start to finish. They handled all the legal documentation perfectly.",
            author: "Kavita Singh",
            rating: 5,
        },
        {
            id: "t3",
            text: "Best real estate dealer in Kurukshetra. Got my warehouse in Sector 30 at a great price.",
            author: "Rakesh Bansal",
            rating: 5,
        },
        {
            id: "t4",
            text: "Mast service! Loan bhi approve karwa diya unhone. Very helpful staff.",
            author: "Pankaj Sharma",
            rating: 5,
        },
        {
            id: "t5",
            text: "Bought land for investment. Clear documentation and transparent process. Recommended!",
            author: "Suresh Yadav",
            rating: 5,
        },
        {
            id: "t6",
            text: "Quick response time. They showed properties within 24 hours of my call.",
            author: "Meena Kumari",
            rating: 5,
        },
    ],
    facebook: [
        {
            id: "f1",
            text: "Amazing experience! Got my first home through Landmark. The team is very supportive. 🏠",
            author: "Ravi Shankar",
            rating: 5,
        },
        {
            id: "f2",
            text: "Best property dealer! Bahut accha kaam karte hain. Must visit if looking for property in Kurukshetra!",
            author: "Pooja Devi",
            rating: 5,
        },
        {
            id: "f3",
            text: "Found my dream office space in Sector 4. Thank you Landmark Properties! 👍",
            author: "Arun Kumar",
            rating: 5,
        },
        {
            id: "f4",
            text: "14 years of experience really shows in their work. Very knowledgeable team.",
            author: "Geeta Rani",
            rating: 5,
        },
        {
            id: "f5",
            text: "Retired and wanted a peaceful home. They found exactly what I was looking for in Sector 5.",
            author: "Om Prakash",
            rating: 5,
        },
        {
            id: "f6",
            text: "Super fast deal! From first visit to registration, everything done in 3 weeks only!",
            author: "Vijay Laxmi",
            rating: 5,
        },
    ],
};
