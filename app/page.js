"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlatformCard from "./components/PlatformCard";
import SaveContactButton from "./components/SaveContactButton";
import { siteConfig } from "./data/siteConfig";
import { staticReviewsByPlatform } from "./data/reviewsData";

export default function ReviewGeneratorPage() {
  // Use static config for now (DB connection later)
  const staticProfile = {
    businessName: siteConfig.business.name,
    phone: siteConfig.footer.contact.phone,
    email: siteConfig.footer.contact.email,
    address: siteConfig.footer.contact.address,
    website: siteConfig.googleReviewUrl ? "https://landmarkplots.com" : null,
    logo: siteConfig.header.logo,
    description: siteConfig.business.description,
  };

  // Initialize platforms with static config
  const initialPlatforms = siteConfig.platforms.map(platform => ({
    ...platform,
    reviews: staticReviewsByPlatform[platform.id] || []
  }));

  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        // Fetch AI reviews for each platform
        const platformPromises = initialPlatforms.map(async (platform) => {
          try {
            const response = await fetch(`/api/generate-reviews?platform=${platform.name}`);
            const data = await response.json();

            if (data.success && data.reviews?.length > 0) {
              return { ...platform, reviews: data.reviews };
            }
          } catch (err) {
            console.warn(`Failed to fetch reviews for ${platform.name}:`, err);
          }
          return platform;
        });

        const updatedPlatforms = await Promise.all(platformPromises);
        setPlatforms(updatedPlatforms);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const isSinglePlatform = platforms.length === 1;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="py-8 md:py-10 px-4 bg-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9F00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0066FF]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Floating Animated Icons */}
          <div className="absolute top-10 left-10 md:left-20 w-16 h-16 bg-[#FF9F00] rounded-2xl flex items-center justify-center shadow-lg animate-bounce hidden md:flex" style={{ animationDuration: '3s', opacity: 0.8 }}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <div className="absolute bottom-10 right-10 md:right-20 w-12 h-12 bg-[#0066FF] rounded-xl flex items-center justify-center shadow-lg hidden md:flex" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>

          <div className="max-w-3xl mx-auto relative z-10 text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img src={staticProfile.logo} alt="Logo" className="h-20 md:h-24 object-contain drop-shadow-sm" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold tracking-wider uppercase mb-6 border border-green-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              QR SCANNED SUCCESSFULLY
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="text-gray-900">We Value</span>
              <br className="md:hidden" />
              <span className="ml-2 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FF9F00, #E02D4C)' }}>
                Your Feedback
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Thank you for scanning! We have drafted some personal reviews for you. <br className="hidden md:block" />
              <span className="font-medium text-gray-900">Select, Copy, and Post</span> on your favorite platform.
            </p>

            {/* Save Contact Button - Uses Static Profile Data */}
            <div className="flex justify-center transform transition-transform hover:scale-105 duration-200">
              <SaveContactButton profile={staticProfile} />
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Generating personalized reviews...</p>
                <p className="text-gray-400 text-sm mt-2">AI is creating unique content for you</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Your Personal Feedback Assistant
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Choose a template below or write your own on your favorite platform.
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
