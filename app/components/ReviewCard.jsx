"use client";

import { useState } from "react";

export default function ReviewCard({ review, colors, reviewUrl }) {
    const [copied, setCopied] = useState(false);

    // Default colors if not provided
    const theme = colors || {
        primary: "#0066FF",
        secondary: "#E6F0FF",
        stars: "#FF9F00",
        gradient: "from-[#0066FF] to-[#FF9F00]"
    };

    const handleCopyAndRedirect = async () => {
        try {
            await navigator.clipboard.writeText(review.text);
            setCopied(true);

            // Reset copied state after animation
            setTimeout(() => {
                setCopied(false);
                // Redirect to platform review URL (dynamic from DB)
                if (reviewUrl) {
                    window.open(reviewUrl, "_blank");
                }
            }, 800);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    // Render star icons
    const renderStars = () => {
        return Array(5)
            .fill(0)
            .map((_, i) => (
                <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    style={{ color: theme.stars }}
                    viewBox="0 0 20 20"
                >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            ));
    };

    return (
        <div
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border border-gray-100 hover:-translate-y-1 flex flex-col h-full"
            style={{
                borderLeftColor: theme.primary,
                borderColor: copied ? theme.primary : undefined
            }}
        >

            {/* Top accent bar with gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                style={{ background: theme.gradient || theme.primary }}
            />

            {/* Quote icon */}
            <div
                className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: theme.primary }}
            >
                <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4 mt-2">{renderStars()}</div>

            {/* Review Text - Full text visible */}
            <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base flex-grow">
                {review.text}
            </p>

            {/* Copy Button - Pushed to bottom */}
            <button
                onClick={handleCopyAndRedirect}
                disabled={copied}
                style={{
                    backgroundColor: copied ? '#22c55e' : theme.primary,
                    boxShadow: copied ? 'none' : ''
                }}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto text-white hover:shadow-lg hover:opacity-90`}
            >
                {copied ? (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied! Redirecting...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Review
                    </>
                )}
            </button>
        </div>
    );
}
