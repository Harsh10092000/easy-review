/**
 * Google Gemini AI Provider
 * Primary AI provider for review generation
 * 
 * Setup: Add GOOGLE_GEMINI_API_KEY to .env
 * Get key: https://aistudio.google.com/apikey
 * Free tier: ~1000 requests/day
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GOOGLE_GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    : null;

// Models to try in order (best free tier options)
// Models to try in order (Prioritizing Speed)
const MODELS = [
    "gemini-2.5-flash-lite-preview-09-2025",
    "gemini-3-flash-preview",
    "gemini-3-pro-preview",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-1.0-pro",

];

/**
 * Generate reviews using Google Gemini
 * @param {string} prompt - The prompt to send
 * @returns {string|null} - Raw response text or null if failed
 */
export async function generateWithGemini(prompt) {
    if (!genAI) {
        console.log("Gemini: No API key configured");
        return null;
    }

    for (const modelName of MODELS) {
        try {
            console.log(`Gemini: Trying ${modelName}...`);

            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (text) {
                console.log(`Gemini: Success with ${modelName}!`);
                return text;
            }
        } catch (err) {
            console.warn(`Gemini: ${modelName} failed -`, err.message);
        }
    }

    console.error("Gemini: All models failed");
    return null;
}

export const providerName = "gemini";
export const requiresApiKey = true;
