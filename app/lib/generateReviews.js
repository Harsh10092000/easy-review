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
import { generateWithGroq, generateWithGroqStream } from "./ai/groq";
import { generateWithOpenRouter } from "./ai/openrouter";

/**
 * Build dynamic prompt based on business configuration and platform
 */
export function buildPrompt(config, platform = "Google") {
    const {
        businessName = "a local business",
        businessType = "service",
        location = "India",
        keywords = "",
        description = "",
        ownerName = "",
        reviewCount = 5,
        language = "English"
    } = config;

    // ... existing ...

    const ownerInstruction = ownerName
        ? `- Business Owner: "${ownerName}" (Occasionally mention the owner's name for a personal connection)`
        : "";

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
            STYLE: Community-focused, conversational, and personal.
            - TONE: "I just wanted to share...", "Honestly, I had a great time...", "If you're looking for..."
            - PERSPECTIVE: Focus on how you felt. Use "I" and "Me".
            - EMOJI RULE: Use emojis VERY RARELY (only in ~10% of reviews). If used, use EXACTLY ONE emoji (e.g. 😊). NEVER use more than one.
            - FORMAT: Casual sentence structure.
            `;
            break;
        case "instagram":
            platformInstruction = `
            PLATFORM: INSTAGRAM
            STYLE: Vibey, short, and expressive.
            - TONE: "Totally loved this place!", "Such a verified vibe.", "My go-to spot now."
            - FORMAT: Short & punchy. Mention the 'look' or 'feel'.
            - EMOJI RULE: Use emojis VERY RARELY (only in ~10% of reviews). If used, use EXACTLY ONE emoji (e.g. ✨). NEVER use more than one.
            `;
            break;
        case "trustpilot":
            platformInstruction = `
            PLATFORM: TRUSTPILOT
            STYLE: Verified customer, detailed, and specific.
            - TONE: "I decided to try them because...", "The process was smooth...", "I appreciate the transparency."
            - FOCUS: Trust, reliability, and specific outcome.
            - AVOID: Over-excitement. Keep it grounded and real.
            `;
            break;
        case "justdial":
            platformInstruction = `
            PLATFORM: JUSTDIAL
            STYLE: Local consumer, straight to the point.
            - TONE: "Service is good.", "I spoke to the owner...", "Value for money is there."
            - CONTEXT: Helpful for other locals searching for this service.
            `;
            break;
        case "ambitionbox":
            platformInstruction = `
            PLATFORM: AMBITIONBOX
            STYLE: Employee perspective (Current or Former).
            - TONE: "Working here has been...", "The management is...", "I learned a lot..."
            - FOCUS: Career growth, environment, salary, and team.
            `;
            break;
        case "google":
        default:
            platformInstruction = `
            PLATFORM: GOOGLE REVIEWS
            STYLE: Helpful Local Guide. Balanced and descriptive.
            - TONE: "I visited this place for...", "My experience with the team was...", "I would recommend..."
            - DETAIL: Mention a specific interaction or result.
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

    // Custom keywords instruction (if provided)
    const keywordsInstruction = keywords
        ? `6. MUST INCLUDE these keywords naturally in reviews: ${keywords}`
        : "";

    return `
You are a customer review generator engine.
TASK: Generate ${reviewCount} UNIQUE 5-star reviews for the following business.

BUSINESS DETAILS:
- Name: "${businessName}"
- Type: ${businessType}
- Location: ${location}
${description ? `- About: ${description}` : ""}
${ownerInstruction}

${platformInstruction}

${languageInstruction}

IMPORTANT CONSTRAINTS:
1. **OUTPUT FORMAT:** RAW TEXT separated by "|||". DO NOT use JSON or numbering.
2. **TONE:** 100% HUMAN & NATURAL. Do NOT sound like a bot or marketing brochure.
3. **PERSPECTIVE:** Use First Person ("I", "Me", "My", "We"). Share a personal experience.
4. **STORYTELLING:** Briefly mention specific details (e.g., "I went there for...", "When I called them...", "My family loved...").
5. **SEO:** Weave the KEYWORDS naturally into sentences. Do not stuff them.
6. **AVOID:** Generic praise like "top-notch", "world-class", "unparalleled". Speak like a real person.
7. Uniqueness: Each review must be completely different in structure and length.
8. FOCUS TOPICS (Mix these in): ${selectedTopics}.
9. Seed ID: ${seed}.
145: ${keywordsInstruction}
146: 
147: CRITICAL:
148: - DO NOT output anything else.
149: - DO NOT say "Here are the reviews".
150: - DO NOT use markdown formatting like **bold** or *italics*.
151: - START DIRECTLY with the first review text.

OUTPUT EXAMPLE:
My experience was great, I really liked... ||| I visited last week and it was amazing... ||| The staff is very helpful...

YOUR RESPONSE (RAW TEXT with ||| separators):
`;
}

/**
 * Parse AI response to extract reviews (Supports JSON or Delimiter)
 */
export function parseResponse(responseText) {
    if (!responseText) return null;
    let text = String(responseText).trim();

    // 1. Try Delimiter Split (New Standard)
    if (text.includes("|||")) {
        return text.split("|||").map(t => t.trim()).filter(t => t.length > 10);
    }

    // 2. Try JSON Parse (Fallback/Legacy)
    // Remove markdown code blocks if present (```json ... ```)
    text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
    } catch (e) { }

    // 3. Regex Fallback
    const arrayMatch = text.match(/\[([\s\S]*?)\]/);
    if (arrayMatch) {
        try {
            const parsed = JSON.parse(arrayMatch[0]);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) { }
    }

    return null;
}

/**
 * Format reviews into standard structure
 */
export function formatReviews(reviews, source) {
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
 * Generate reviews for a SINGLE platform using provider fallback
 * 
 * @param {object} config - Business configuration
 * @param {string} platform - Target platform (Google, Facebook, etc.)
 * @returns {array|null} - Array of reviews or null if failed
 */
export async function generateSinglePlatformReviews(config, platform) {
    const prompt = buildPrompt(config, platform);

    // Provider chain: Groq (Fastest) → Gemini (Best) → OpenRouter (Free)
    const providers = [
        { name: "groq", fn: generateWithGroq },
        { name: "gemini", fn: generateWithGemini },
        { name: "openrouter", fn: generateWithOpenRouter },
    ];

    for (const provider of providers) {
        try {
            const start = Date.now();
            // console.log(`\n🤖 Trying ${provider.name} for ${platform}...`);

            // Add timeout race to prevent hanging
            const response = await Promise.race([
                provider.fn(prompt),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000))
            ]);

            const reviews = parseResponse(response);

            if (reviews && reviews.length > 0) {
                const duration = Date.now() - start;
                console.log(`✅ ${provider.name} (${platform}): Generated ${reviews.length} reviews in ${duration}ms`);
                return formatReviews(reviews, provider.name);
            }
        } catch (err) {
            // console.warn(`❌ ${provider.name}: Failed for ${platform} -`, err.message);
        }
    }

    // console.error(`❌ All providers failed for ${platform}`);
    return null;
}

/**
 * STREAMING GENERATOR (Ultra-Fast)
 * Streams reviews 1-by-1 as they are generated using ||| delimiter
 */
export async function streamPlatformReviews(config, platform, onReview) {
    const prompt = buildPrompt(config, platform);

    // 1. Try Groq Stream Priority
    try {
        let buffer = "";
        let reviewIndex = 0;

        for await (const chunk of generateWithGroqStream(prompt)) {
            buffer += chunk;

            // Check for delimiter
            if (buffer.includes("|||")) {
                const parts = buffer.split("|||");
                // Process all complete parts (except the last one which might be partial)
                while (parts.length > 1) {
                    const reviewText = parts.shift().trim();
                    if (reviewText.length > 10) {
                        reviewIndex++;
                        onReview(formatReviews([reviewText], "groq")[0]);
                    }
                }
                // Keep the last partial part
                buffer = parts[0];
            }
        }

        // Flush remaining buffer
        if (buffer.trim().length > 10) {
            onReview(formatReviews([buffer.trim()], "groq")[0]);
        }
        return true; // Success

    } catch (err) {
        console.warn(`Streaming failed for ${platform}, falling back to standard:`, err.message);
    }

    // 2. Fallback to Standard (Gemini/OpenRouter) if Streaming failed
    const allReviews = await generateSinglePlatformReviews(config, platform);
    if (allReviews) {
        allReviews.forEach(r => onReview(r));
        return true;
    }

    return false;
}

/**
 * Generate reviews for MULTIPLE platforms in ONE request (Batching)
 * 
 * @param {object} config - Business configuration
 * @param {array} platforms - List of platform names (e.g. ["Facebook", "Instagram"])
 * @returns {object|null} - Object with keys as platform names and values as review arrays
 */
export async function generateMultiPlatformReviews(config, platforms) {
    if (!platforms || platforms.length === 0) return {};

    const {
        businessName,
        businessType,
        location,
        description,
        ownerName,
        reviewCount,
        language
    } = config;

    const ownerInstruction = ownerName
        ? `- Business Owner: "${ownerName}" (Occasionally mention the owner's name)`
        : "";

    // Build Combined Prompt
    const platformList = platforms.join(", ");
    const jsonStructure = {};
    platforms.forEach(p => jsonStructure[p] = ["Review 1...", "Review 2..."]);

    const prompt = `
You are a customer review generator engine.
TASK: Generate ${reviewCount} UNIQUE 5-star reviews for EACH of the following platforms: ${platformList}.

BUSINESS DETAILS:
- Name: "${businessName}"
- Type: ${businessType}
- Location: ${location}
${description ? `- About: ${description}` : ""}
${ownerInstruction}

LANGUAGE: ${language === 'Hindi' ? 'PURE HINDI (Devanagari)' : language === 'Hinglish' ? 'HINGLISH (Hindi in English script)' : 'Natural English'}

PLATFORM STYLES:
PLATFORM STYLES:
- FACEBOOK: Casual, friendly, "I just wanted to share...", "Honestly...". EMOJI RULE: Rarely (10%), Max 1.
- INSTAGRAM: Short, vibey, "Totally loved this place!", "10/10". EMOJI RULE: Rarely (10%), Max 1.
- TRUSTPILOT: Detailed, specific, "The process was smooth...", "I appreciate...", NO emojis.
- TRUSTPILOT: Detailed, specific, "The process was smooth...", "I appreciate...", NO emojis.
- JUSTDIAL: Short, direct, "Service is good", "Value for money".
- OTHERS: Professional and balanced.

IMPORTANT CONSTRAINTS:
1. **TONE:** 100% HUMAN & NATURAL. Use "I", "Me", "My". Tell a mini-story.
2. **NO MARKETING:** Avoid "top-notch", "world-class". Speak like a real person.
3. **SEO:** Naturally weave keywords if provided.

OUTPUT FORMAT (JSON OBJECT ONLY):
${JSON.stringify(jsonStructure, null, 2)}

YOUR RESPONSE (Valid JSON only):
`;

    // Provider Chain
    const providers = [
        { name: "groq", fn: generateWithGroq },
        { name: "gemini", fn: generateWithGemini },
        { name: "openrouter", fn: generateWithOpenRouter },
    ];

    for (const provider of providers) {
        try {
            const start = Date.now();
            // console.log(`\n🤖 Trying ${provider.name} for BATCH [${platformList}]...`);

            // Higher timeout for batch generation (30s)
            const response = await Promise.race([
                provider.fn(prompt),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 30000))
            ]);

            // Custom parser for Object response
            let parsedReviews = null;
            try {
                let text = String(response).trim();
                text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
                parsedReviews = JSON.parse(text);
            } catch (e) {
                // Regex fallback for object
                const match = String(response).match(/\{[\s\S]*\}/);
                if (match) {
                    try { parsedReviews = JSON.parse(match[0]); } catch (e2) { }
                }
            }

            if (parsedReviews && typeof parsedReviews === 'object') {
                // Validate at least one platform has data
                const hasData = platforms.some(p => Array.isArray(parsedReviews[p]) && parsedReviews[p].length > 0);

                if (hasData) {
                    const duration = Date.now() - start;
                    console.log(`✅ ${provider.name} (BATCH): Generated reviews in ${duration}ms`);

                    // Format all
                    const formattedResult = {};
                    platforms.forEach(p => {
                        if (Array.isArray(parsedReviews[p])) {
                            formattedResult[p] = formatReviews(parsedReviews[p], provider.name);
                        }
                    });
                    return formattedResult;
                }
            }
        } catch (err) {
            console.warn(`❌ ${provider.name} Batch Failed:`, err.message);
        }
    }

    return null;
}

/**
 * Legacy wrapper for backward compatibility
 */
export async function generateAIReviews(config = {}, platform = "Google") {
    return generateSinglePlatformReviews(config, platform);
}
