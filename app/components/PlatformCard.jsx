"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";

// Platform icons
const PlatformIcon = ({ platform }) => {
    const icons = {
        google: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
        ),
        trustpilot: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#00B67A">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        ),
        facebook: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    };

    return icons[platform] || (
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );
};

/**
 * Platform Card Component
 * Displays reviews for a single platform with View More functionality
 */
export default function PlatformCard({ platform, isSinglePlatform = false }) {
    const [expanded, setExpanded] = useState(false);

    const initialCount = isSinglePlatform ? 9 : 3;
    const expandedCount = 9;

    const visibleReviews = expanded
        ? platform.reviews.slice(0, expandedCount)
        : platform.reviews.slice(0, initialCount);

    const hasMoreReviews = platform.reviews.length > (expanded ? expandedCount : initialCount);
    const showViewMore = !isSinglePlatform || platform.reviews.length > initialCount;

    return (
        <div className="mb-12 border-b border-gray-100 pb-12 last:border-0 last:pb-0">
            {/* Platform Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-sm">
                        <PlatformIcon platform={platform.icon} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{platform.name}</h3>
                    </div>
                </div>

                {/* Write Review Button */}
                <a
                    href={platform.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:opacity-90"
                    style={{ backgroundColor: platform.colors?.primary || "#0066FF" }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {platform.buttonText || `Write a Review on ${platform.name}`}
                </a>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        colors={platform.colors}
                    />
                ))}
            </div>

            {/* View More / Show Less Button */}
            {showViewMore && hasMoreReviews && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all duration-300"
                    >
                        {expanded ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Show Less
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                View More Reviews
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
