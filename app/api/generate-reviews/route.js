import { generateSinglePlatformReviews, generateMultiPlatformReviews, streamPlatformReviews } from "@/app/lib/generateReviews";
import { siteConfig } from "@/app/data/siteConfig";

export const dynamic = 'force-dynamic'; // Prevent caching
export const maxDuration = 60; // Allow long running for streaming

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Extract parameters
    const businessName = searchParams.get("businessName") || siteConfig.business.name;
    const businessType = searchParams.get("businessType") || siteConfig.business.type;
    const language = searchParams.get("language") || "English";
    const location = searchParams.get("location") || "India";
    const description = searchParams.get("description") || "";
    const keywords = searchParams.get("keywords") || "";
    const ownerName = searchParams.get("ownerName") || "";
    const reviewCount = parseInt(searchParams.get("reviewCount")) || 5;

    const config = {
        businessName,
        businessType: businessType === "real_estate" ? "real estate" : businessType,
        ownerName,
        location,
        description,
        keywords,
        reviewCount,
        language
    };

    // Encoder for streaming text
    const encoder = new TextEncoder();

    // Create a streaming response
    const customStream = new ReadableStream({
        async start(controller) {
            const sendEvent = (data) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                // 1. GOOGLE FIRST (Priority)
                // ---------------------------------------------------------
                // console.log("🔍 Starting Google generation...");
                const googleSuccess = await streamPlatformReviews(config, "Google", (review) => {
                    sendEvent({
                        success: true,
                        platform: "Google",
                        reviews: [review]
                    });
                });

                if (!googleSuccess) {
                    sendEvent({
                        success: false,
                        platform: "Google",
                        error: "Failed to generate Google reviews"
                    });
                }

                // 2. PARALLEL GENERATION (Others)
                // ---------------------------------------------------------
                // console.log("🚀 Starting other platforms...");
                const requestedPlatforms = (searchParams.get("platforms") || "").split(",").filter(p => p.trim());

                // Filter out Google (already done) and ensure unique
                const otherPlatforms = requestedPlatforms
                    .map(p => p.trim())
                    .filter(p => p.toLowerCase() !== "google");

                if (otherPlatforms.length > 0) {
                    // Fire individual requests for each platform (Parallel)
                    const promises = otherPlatforms.map(async (platform) => {
                        try {
                            const success = await streamPlatformReviews(config, platform, (review) => {
                                sendEvent({
                                    success: true,
                                    platform: platform,
                                    reviews: [review]
                                });
                            });

                            if (!success) {
                                sendEvent({
                                    success: false,
                                    platform: platform,
                                    error: "Failed to generate reviews for " + platform
                                });
                            }
                        } catch (err) {
                            sendEvent({
                                success: false,
                                platform: platform,
                                error: `Error: ${err.message}`
                            });
                        }
                    });

                    // Wait for all to finish
                    await Promise.all(promises);
                }

                // Signal completion
                sendEvent({ type: "DONE" });
                controller.close();

            } catch (error) {
                console.error("Stream Error:", error);
                sendEvent({ error: error.message });
                controller.close();
            }
        }
    });

    return new Response(customStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
