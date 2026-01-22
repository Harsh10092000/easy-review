// Site Configuration - Easily connectable to Admin Panel / APIs later
export const siteConfig = {
    // Header Configuration
    header: {
        logo: "/logo.png", // Update with actual logo path
        logoAlt: "Landmark Properties",
        navigation: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Reviews", href: "/review-generator" },
            { label: "Contact", href: "/contact" },
        ],
    },

    // Footer Configuration
    footer: {
        logo: "/logo.png",
        logoAlt: "Landmark Properties",
        links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "FAQ", href: "/faq" },
            { label: "Support", href: "/support" },
        ],
        contact: {
            address: "123 Main Street, Kurukshetra, Haryana 136118",
            phone: "+91 98765 43210",
            email: "info@landmarkproperties.com",
        },
    },

    // Google Review Settings
    googleReviewUrl:
        "https://www.google.com/search?q=Landmark+Properties+-+Real+Estate+Broker+%26+Builders+Reviews&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOeYvDubAqwXKwXZrOwuYzyuk73q3OWZq5V5gp3uIzl5-MjCycsMtPpGtjn1VuVvdj4txgVO-qfCAGMl4FoDm1LBj2lAJZI3OGdZegucHajhm9yUvWpp-9AaS7O7djWo0Ol6xlORBgrnUxC6KyM3LvAXCJpVt&sa=X&ved=2ahUKEwj1ocnsrZmSAxVvWnADHTa-Ei8Q0bkNegQIHxAH#lrd=0x390e470336eef35d:0xd98da635dd8ae2b4,3,,,,",

    // Business Configuration (for AI review generation)
    business: {
        name: "Landmark Properties",
        type: "real_estate", // Options: real_estate, restaurant, hotel, salon, etc.
        description: "Real Estate Broker & Builders",
        // Areas for AI-generated reviews (customize these)
        areas: [
            "Sector 7", "Sector 13", "Sector 3", "Sector 30",
            "Sector 4", "Sector 5", "Pipli Road", "Thanesar",
            "Urban Estate", "Near University"
        ],
        // Property types for AI-generated reviews
        propertyTypes: [
            "Plot", "Flat", "Apartment", "House", "Builder Floor",
            "Shop", "Office", "Warehouse", "Land", "Commercial Space"
        ],
    },
    // Platform Configuration (Links & Metadata)
    platforms: [
        {
            id: "google",
            name: "Google",
            icon: "google",
            reviewUrl: "https://www.google.com/search?q=Landmark+Properties+Reviews",
            buttonText: "Can't find a match? Write your own Review on Google",
            colors: {
                primary: "#4285F4",
                secondary: "#E8F0FE",
                stars: "#FBBC05",
                gradient: "from-[#4285F4] via-[#EA4335] to-[#FBBC05]"
            }
        },
        {
            id: "trustpilot",
            name: "Trustpilot",
            icon: "trustpilot",
            reviewUrl: "https://www.trustpilot.com/review/landmarkproperties.in",
            buttonText: "Can't find a match? Write your own Review on Trustpilot",
            colors: {
                primary: "#00B67A",
                secondary: "#F0FFF9",
                stars: "#00B67A",
                gradient: "from-[#00B67A] to-[#005128]"
            }
        },
        {
            id: "facebook",
            name: "Facebook",
            icon: "facebook",
            reviewUrl: "https://www.facebook.com/landmarkproperties/reviews",
            buttonText: "Can't find a match? Write your own Review on Facebook",
            colors: {
                primary: "#1877F2",
                secondary: "#F0F2F5",
                stars: "#FF9F00", // Gold looks better on generic UI
                gradient: "from-[#1877F2] to-[#0C5DC7]"
            }
        },
    ],
};
