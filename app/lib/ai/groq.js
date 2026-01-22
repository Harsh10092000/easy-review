/**
 * Groq AI Provider
 * Ultra-fast inference with generous free tier
 * 
 * Setup: Add GROQ_API_KEY to .env
 * Get key: https://console.groq.com (No credit card needed)
 * Free tier: 14,400 requests/day, 30 req/min
 * 
 * Models: Llama 3.3 70B, Mixtral 8x7B
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Models to try (ordered by quality)
const MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768",
    "llama-3.1-8b-instant",
];

/**
 * Generate reviews using Groq API
 * @param {string} prompt - The prompt to send
 * @returns {string|null} - Raw response text or null if failed
 */
export async function generateWithGroq(prompt) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.log("Groq: No API key configured");
        return null;
    }

    for (const model of MODELS) {
        try {
            console.log(`Groq: Trying ${model}...`);

            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 1.1, // Higher creativity to prevent repeats
                    max_tokens: 4096,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;

            if (text) {
                console.log(`Groq: Success with ${model}!`);
                return text;
            }
        } catch (err) {
            console.warn(`Groq: ${model} failed -`, err.message);
        }
    }

    console.error("Groq: All models failed");
    return null;
}

export const providerName = "groq";
export const requiresApiKey = true;
