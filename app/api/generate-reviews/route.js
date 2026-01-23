import { NextResponse } from "next/server";
import { generateAIReviews } from "@/app/lib/generateReviews";
import { siteConfig } from "@/app/data/siteConfig";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const platform = searchParams.get("platform") || "Google";

        // Extract dynamic parameters
        const businessName = searchParams.get("businessName") || siteConfig.business.name;
        const businessType = searchParams.get("businessType") || siteConfig.business.type;
        const language = searchParams.get("language") || "English";
        const location = searchParams.get("location") || "India";
        const description = searchParams.get("description") || "";
        const keywords = searchParams.get("keywords") || "";

        // Build config using dynamic or static data
        const config = {
            businessName,
            businessType: businessType === "real_estate" ? "real estate" : businessType,
            location,
            description,
            keywords,
            reviewCount: 9,
            language
        };

        // Generate AI reviews
        const reviews = await generateAIReviews(config, platform);

        if (reviews && reviews.length > 0) {
            return NextResponse.json({
                success: true,
                source: "ai",
                reviews,
            });
        }

        // Return empty if AI fails (frontend will use static fallback)
        return NextResponse.json({
            success: false,
            source: "none",
            message: "AI generation failed, use static reviews",
            reviews: [],
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
