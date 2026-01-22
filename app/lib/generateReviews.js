/**
 * AI Review Generator
 * Generates reviews using multiple AI providers with automatic fallback
 * 
 * Provider Order:
 * 1. Gemini (Primary - needs API key)
 * 2. Groq (Fallback 1 - ultra fast, needs API key)
 * 3. OpenRouter (Fallback 2 - FREE models available)
 * 4. Static reviews (Final fallback)
 */

import { generateWithGemini } from "./ai/gemini";
import { generateWithGroq } from "./ai/groq";
import { generateWithOpenRouter } from "./ai/openrouter";

/**
 * Build dynamic prompt based on business configuration and platform
 */
export function buildPrompt(config, platform = "Google") {
    const {
        businessName = "a local business",
        businessType = "service",
        location = "India",
        areas = [],
        propertyTypes = [],
        reviewCount = 5,
        language = "English"
    } = config;

    // RANDOM MICRO-TOPICS to force content variety
    const allTopics = [
        "Customer Service", "Value for Money", "Professionalism", "Timeliness",
        "Staff Behavior", "Cleanliness/Ambiance", "Process Transparency", "After-sales Support",
        "Communication Skills", "Trustworthiness"
    ];
    const shuffled = allTopics.sort(() => 0.5 - Math.random());
    const selectedTopics = shuffled.slice(0, 3).join(", ");

    // RANDOM SEED
    const seed = Math.floor(Math.random() * 999999);

    let platformInstruction = "";
    switch (platform.toLowerCase()) {
        case "facebook":
            platformInstruction = `
            PLATFORM: FACEBOOK
            STYLE: Personal, community-focused, casual, and friendly.
            - USE EMOJIS: Yes (1-2 per review).
            - TONE: "Just wanted to recommend...", "Had a great experience...", "Highly recommended!"
            - KEYWORDS: Service, friendly, helpful, recommended, thanks.
            - AVOID: Formal language, strict corporate tone.
            `;
            break;
        case "trustpilot":
            platformInstruction = `
            PLATFORM: TRUSTPILOT
            STYLE: Formal, verified, objective, and service-oriented.
            - USE EMOJIS: NO. Absolutely none.
            - TONE: "Excellent service provided...", "Transparent process...", "Trustworthy business..."
            - KEYWORDS: Transparency, trust, professional, efficiently, process.
            - AVOID: Slang, emojis, overly casual language.
            `;
            break;
        case "tripadvisor":
            platformInstruction = `
            PLATFORM: TRIPADVISOR
            STYLE: Traveler/Visitor perspective, descriptive.
            - USE EMOJIS: Minimal.
            - TONE: "Visited recently...", "Great atmosphere...", "Must visit place..."
            - KEYWORDS: Experience, atmosphere, visit, location, view, vibes.
            `;
            break;
        case "zomato":
            platformInstruction = `
            PLATFORM: ZOMATO
            STYLE: Foodie, taste-focused, enthusiastic.
            - USE EMOJIS: Yes (food emojis).
            - TONE: "The taste was amazing...", "Service was quick...", "Best place for..."
            - KEYWORDS: Taste, ambiance, service, menu, flavor, delicious.
            `;
            break;
        case "google":
        default:
            platformInstruction = `
            PLATFORM: GOOGLE REVIEWS
            STYLE: Balanced, helpful, local guide style.
            - USE EMOJIS: Optional (0-1).
            - TONE: "I visited...", "Good service...", "Professional team..."
            - KEYWORDS: Professional, quality, responsive, good value.
            `;
            break;
    }

    let languageInstruction = "";
    if (language.toLowerCase() === "hindi") {
        languageInstruction = "LANGUAGE: Write ALL reviews in PURE HINDI (Devanagari script). Example: 'सेवा बहुत अच्छी थी। मैं सलाह दूंगा।'. Do not use English script.";
    } else if (language.toLowerCase() === "hinglish") {
        languageInstruction = "LANGUAGE: Write in HINGLISH (Hindi spoken in English script). Use natural Indian style. Example: 'Bhai service bahot badhiya thi', 'Maza aa gaya visiting here', 'Highly recommend karunga sabko'.";
    } else {
        languageInstruction = "LANGUAGE: Write in Natural, Native English. Varied sentence structure.";
    }

    return `
You are a customer review generator engine.
TASK: Generate ${reviewCount} UNIQUE 5-star reviews for the following business.

BUSINESS DETAILS:
- Name: "${businessName}"
- Type: ${businessType}
- Location: ${location}

${platformInstruction}

${languageInstruction}

IMPORTANT CONSTRAINTS:
1. OUTPUT MUST BE A VALID JSON ARRAY OF STRINGS ONLY. NO TEXT BEFORE OR AFTER.
2. Uniqueness: Each review must be completely different.
3. Authenticity: vary the length (some short, some long).
4. FOCUS TOPICS (Mix these in): ${selectedTopics}.
5. Seed ID: ${seed}.

OUTPUT FORMAT EXAMPLE:
["Review 1 text...", "Review 2 text..."]

YOUR RESPONSE (JSON ONLY):
`;
}

/**
 * Parse AI response to extract JSON array
 * Handles code blocks, raw text, and imperfect JSON
 */
export function parseResponse(responseText) {
    if (!responseText) return null;

    let text = String(responseText).trim();

    // Remove markdown code blocks if present (```json ... ```)
    text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

    // Try direct JSON parse
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
    } catch (e) {
        // Continue to regex extraction
    }

    // Extract Array using Regex [ ... ]
    const arrayMatch = text.match(/\[([\s\S]*?)\]/);
    if (arrayMatch) {
        try {
            const parsed = JSON.parse(arrayMatch[0]);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            console.error("JSON extraction failed:", e.message);
        }
    }

    return null;
}

/**
 * Format reviews into standard structure
 */
function formatReviews(reviews, source) {
    return reviews.map((text, index) => ({
        id: `${source}-${index + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        text: typeof text === "string" ? text : String(text),
        rating: 5,
        isAI: true,
        source: source,
        date: "Just now"
    }));
}

/**
 * Generate reviews using AI providers with automatic fallback
 * 
 * @param {object} config - Business configuration
 * @returns {array|null} - Array of reviews or null if all providers fail
 */
export async function generateAIReviews(config = {}, platform = "Google") {
    const prompt = buildPrompt(config, platform);

    // Provider chain: Groq (Fastest) → Gemini (Best) → OpenRouter (Free)
    const providers = [
        { name: "groq", fn: generateWithGroq },
        { name: "gemini", fn: generateWithGemini },
        { name: "openrouter", fn: generateWithOpenRouter },
    ];

    for (const provider of providers) {
        try {
            console.log(`\n🤖 Trying ${provider.name} for ${platform}...`);

            const response = await provider.fn(prompt);
            const reviews = parseResponse(response);

            if (reviews && reviews.length > 0) {
                console.log(`✅ ${provider.name}: Generated ${reviews.length} reviews!`);
                return formatReviews(reviews, provider.name);
            } else {
                console.warn(`⚠️ ${provider.name}: Returned empty or invalid JSON`);
            }
        } catch (err) {
            console.warn(`❌ ${provider.name}: Failed -`, err.message);
        }
    }

    console.error("❌ All AI providers failed");
    return null;
}
