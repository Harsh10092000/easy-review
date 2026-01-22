"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PlatformCard from "../components/PlatformCard";
import { siteConfig } from "../data/siteConfig";
import { staticReviewsByPlatform } from "../data/reviewsData";

export default function ReviewGeneratorPage() {
    // Initialize platforms with config and static reviews
    const initialPlatforms = siteConfig.platforms.map(platform => ({
        ...platform,
        reviews: staticReviewsByPlatform[platform.id] || []
    }));

    const [platforms, setPlatforms] = useState(initialPlatforms);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllPlatforms() {
            try {
                // Fetch reviews for each platform concurrently
                const platformPromises = initialPlatforms.map(async (platform) => {
                    try {
                        const response = await fetch(`/api/generate-reviews?platform=${platform.name}`);
                        const data = await response.json();

                        if (data.success && data.reviews?.length > 0) {
                            return {
                                ...platform,
                                reviews: data.reviews, // Replace static with AI reviews
                            };
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch reviews for ${platform.name}:`, err);
                    }
                    // Fallback to static reviews (already set in initialPlatforms)
                    return platform;
                });

                const updatedPlatforms = await Promise.all(platformPromises);
                setPlatforms(updatedPlatforms);
                setLoading(false);

            } catch (error) {
                console.error("Global fetch error:", error);
                setLoading(false);
            }
        }

        fetchAllPlatforms();
    }, []);

    // Determine if we should show single platform mode (e.g. valid when filter logic is added later)
    const isSinglePlatform = platforms.length === 1;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            {/* Main Content */}
            <main className="flex-1 pt-20 md:pt-24">
                {/* Hero Section - 2 Column Layout */}
                <section className="py-12 md:py-16 px-4 bg-white relative overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9F00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0066FF]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-20 left-10 w-20 h-8 bg-[#0066FF] rounded-full opacity-20 rotate-45" />
                    <div className="absolute bottom-20 right-20 w-16 h-6 bg-[#FF9F00] rounded-full opacity-30 -rotate-12" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Left Side - Content */}
                            <div className="text-center lg:text-left">
                                {/* Heading with colored words */}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                    <span className="text-[#FF9F00]">Customer</span>
                                    <br />
                                    <span className="text-[#0066FF]">REVIEW</span>
                                </h1>

                                <p className="text-lg text-gray-600 mb-4 leading-relaxed max-w-md">
                                    Thank you for scanning! To make it easy, we've generated some reviews for you based on our services.
                                </p>

                                <p className="text-base text-gray-700 mb-8 max-w-md">
                                    <span className="font-semibold">Select your preferred platform</span>, pick a review, copy it, and post!
                                </p>
                            </div>

                            {/* Right Side - Image */}
                            <div className="relative flex items-center justify-center">
                                {/* Main Image Container */}
                                <div className="relative w-full max-w-md mx-auto">
                                    {/* Decorative floating elements */}
                                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF9F00] rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#E02D4C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-1/2 -right-8 w-12 h-12 bg-[#0066FF] rounded-xl flex items-center justify-center shadow-lg" style={{ animation: 'float 4s ease-in-out infinite' }}>
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>

                                    {/* Main Review Card Visual */}
                                    <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-3xl p-8 shadow-2xl">
                                        <div className="flex items-center justify-center gap-2 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-10 h-10 text-[#FF9F00] fill-current drop-shadow-lg" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur">
                                                <p className="text-2xl md:text-3xl font-bold text-white">500+</p>
                                                <p className="text-xs text-white/70">Happy Clients</p>
                                            </div>
                                            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur">
                                                <p className="text-2xl md:text-3xl font-bold text-[#FF9F00]">4.9</p>
                                                <p className="text-xs text-white/70">Rating</p>
                                            </div>
                                            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur">
                                                <p className="text-2xl md:text-3xl font-bold text-white">14+</p>
                                                <p className="text-xs text-white/70">Years</p>
                                            </div>
                                        </div>
                                        <p className="text-center text-white/80 text-sm">
                                            Trusted by hundreds of happy customers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-16 h-16 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-gray-600 text-lg">Generating personalized reviews for all platforms...</p>
                                <p className="text-gray-400 text-sm mt-2">This uses AI to create unique content</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                        Your Personal Feedback Assistant
                                    </h2>
                                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                        Sharing your experience helps us grow! Choose a template below or write your own on your favorite platform.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {platforms.map((platform) => (
                                        <PlatformCard
                                            key={platform.id}
                                            platform={platform}
                                            isSinglePlatform={isSinglePlatform}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
