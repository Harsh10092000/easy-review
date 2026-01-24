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

// Models to try (ordered by quality vs speed)
const MODELS = [
    "llama-3.1-8b-instant",      // Fastest (Sub-second)
    "llama-3.3-70b-versatile",   // High Quality Fallback
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768",
    "llama-3.1-8b-instant"
];

// Helper to parse SSE stream from Groq
async function* parseGroqStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop(); // Keep partial line

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("data: ")) {
                    const dataStr = trimmed.slice(6);
                    if (dataStr === "[DONE]") return; // End of stream
                    try {
                        const json = JSON.parse(dataStr);
                        const content = json.choices?.[0]?.delta?.content || "";
                        if (content) yield content;
                    } catch (e) {
                        // ignore parse errors for partial chunks
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

/**
 * Generate reviews using Groq API (Streaming Mode)
 * Returns an Async Generator that yields text chunks
 */
export async function* generateWithGroqStream(prompt) {
    // 1. Get all keys
    const allKeys = (process.env.GROQ_API_KEY || "").split(",").map(k => k.trim()).filter(k => k);

    if (allKeys.length === 0) {
        console.log("Groq: No API key configured");
        return null;
    }

    // 2. Shuffle keys
    const shuffledKeys = allKeys.sort(() => 0.5 - Math.random());

    // 3. Iterate keys
    for (const [keyIndex, apiKey] of shuffledKeys.entries()) {
        const keyLabel = `Key ${keyIndex + 1} (...${apiKey.slice(-4)})`;

        for (const model of MODELS) {
            try {
                // console.log(`Groq [Stream]: Trying ${model} with ${keyLabel}...`);

                const response = await fetch(GROQ_API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: prompt }],
                        temperature: 1.0,
                        max_tokens: 4096,
                        stream: true // ENABLE STREAMING
                    }),
                });

                if (response.ok) {
                    // console.log(`Groq [Stream]: Connection established with ${model} on ${keyLabel}`);
                    yield* parseGroqStream(response);
                    return; // Success, done.
                }

                if (response.status === 429) {
                    console.warn(`Groq: ${keyLabel} 429 (Rate Limit). Switching key...`);
                    break; // Try next key
                }

            } catch (err) {
                console.warn(`Groq Stream Error: ${model} on ${keyLabel} -`, err.message);
            }
        }
    }
    throw new Error("Groq: All keys/models failed to stream");
}

/**
 * Generate reviews using Groq API (Standard)
 * @param {string} prompt - The prompt to send
 * @returns {string|null} - Raw response text or null if failed
 */
export async function generateWithGroq(prompt) {
    // Reuse the stream logic to behave like a standard promise for backward compatibility
    try {
        let fullText = "";
        for await (const chunk of generateWithGroqStream(prompt)) {
            fullText += chunk;
        }
        return fullText;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const providerName = "groq";
export const requiresApiKey = true;
