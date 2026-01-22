/**
 * OpenRouter AI Provider
 * Access to 25+ FREE AI models without credit card
 * 
 * Setup: Add OPENROUTER_API_KEY to .env
 * Get key: https://openrouter.ai/keys (No credit card needed)
 * Free tier: 50 requests/day, rate limited
 * 
 * FREE Models: DeepSeek R1, Qwen, Mistral, Llama
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// FREE models on OpenRouter (no cost)
const FREE_MODELS = [
    "deepseek/deepseek-r1:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "google/gemma-2-9b-it:free",
];

/**
 * Generate reviews using OpenRouter API
 * @param {string} prompt - The prompt to send
 * @returns {string|null} - Raw response text or null if failed
 */
export async function generateWithOpenRouter(prompt) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.log("OpenRouter: No API key configured");
        return null;
    }

    for (const model of FREE_MODELS) {
        try {
            console.log(`OpenRouter: Trying ${model}...`);

            const response = await fetch(OPENROUTER_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Review Generator",
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.8,
                    max_tokens: 4096,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${error.error?.message || "Unknown"}`);
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content;

            if (text) {
                console.log(`OpenRouter: Success with ${model}!`);
                return text;
            }
        } catch (err) {
            console.warn(`OpenRouter: ${model} failed -`, err.message);
        }
    }

    console.error("OpenRouter: All models failed");
    return null;
}

export const providerName = "openrouter";
export const requiresApiKey = true;
