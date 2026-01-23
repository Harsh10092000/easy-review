"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlatformCard from "./components/PlatformCard";
import SaveContactButton from "./components/SaveContactButton";
import { siteConfig } from "./data/siteConfig";
import { staticReviewsByPlatform } from "./data/reviewsData";

// Backend URL - Update for production
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8010";

function ReviewPageContent() {
  const searchParams = useSearchParams();

  // Get slug from subdomain (middleware) OR from ?id= param (QR code)
  const subdomain = searchParams.get('subdomain');
  const idParam = searchParams.get('id');
  const slug = subdomain || idParam; // Subdomain takes priority, fallback to ?id=

  const [profile, setProfile] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static fallback profile
  const staticProfile = {
    businessName: siteConfig.business.name,
    phone: siteConfig.footer.contact.phone,
    email: siteConfig.footer.contact.email,
    address: siteConfig.footer.contact.address,
    website: "https://landmarkplots.com",
    logo: siteConfig.header.logo,
    description: siteConfig.business.description,
  };

  useEffect(() => {
    if (slug) {
      fetchProfile(slug);
    } else {
      // No subdomain or id, use static config
      loadStaticConfig();
    }
  }, [slug]);

  const fetchProfile = async (profileSlug) => {
    try {
      // Use internal Next.js API route (connects directly to DB)
      const res = await fetch(`/api/profile/${profileSlug}`);
      const data = await res.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
        initializePlatforms(data.profile);
      } else {
        // Profile not found, use static
        loadStaticConfig();
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      loadStaticConfig();
    }
  };

  const loadStaticConfig = () => {
    setProfile(staticProfile);
    const defaultPlatforms = siteConfig.platforms.map(p => ({
      ...p,
      reviews: staticReviewsByPlatform[p.id] || []
    }));
    setPlatforms(defaultPlatforms);
    setLoading(false);
  };

  const initializePlatforms = (profileData) => {
    const profilePlatforms = profileData.platforms && profileData.platforms.length > 0
      ? profileData.platforms
      : siteConfig.platforms;

    const initialPlatforms = profilePlatforms.map(p => ({
      id: p.name?.toLowerCase() || p.id,
      name: p.name,
      icon: p.name?.toLowerCase() || p.icon,
      reviewUrl: p.url || p.reviewUrl,
      buttonText: `Review on ${p.name}`,
      colors: getPlatformColors(p.name),
      reviews: []
    }));

    setPlatforms(initialPlatforms);
    generateReviewsForProfile(profileData, initialPlatforms);
  };

  const generateReviewsForProfile = async (profileData, currentPlatforms) => {
    try {
      // Get selected languages (array or string)
      let languages = profileData.languagePref || profileData.language_pref || ['English'];
      if (typeof languages === 'string') {
        try { languages = JSON.parse(languages); } catch { languages = [languages]; }
      }
      if (!Array.isArray(languages) || languages.length === 0) {
        languages = ['English'];
      }

      const platformPromises = currentPlatforms.map(async (platform) => {
        try {
          // Generate reviews for all selected languages
          const allReviews = [];
          const reviewsPerLanguage = Math.ceil(9 / languages.length);

          for (const lang of languages) {
            const query = new URLSearchParams({
              platform: platform.name,
              businessName: profileData.businessName || profileData.business_name,
              businessType: profileData.businessType || profileData.business_type || 'business',
              language: lang,
              location: [profileData.city, profileData.state].filter(Boolean).join(', ') || 'India',
              description: profileData.description || '',
              keywords: profileData.keywords || '',
              reviewCount: reviewsPerLanguage,
              ts: Date.now()
            });

            const response = await fetch(`/api/generate-reviews?${query.toString()}`, {
              cache: 'no-store',
              headers: { 'Pragma': 'no-cache' }
            });
            const data = await response.json();

            if (data.success && data.reviews?.length > 0) {
              // Add language tag to each review
              const taggedReviews = data.reviews.map(r => ({
                ...r,
                language: lang
              }));
              allReviews.push(...taggedReviews);
            }
          }

          if (allReviews.length > 0) {
            return { ...platform, reviews: allReviews };
          }
        } catch (err) {
          console.warn(`Failed to generate reviews for ${platform.name}:`, err);
        }
        return platform;
      });

      const updatedPlatforms = await Promise.all(platformPromises);
      setPlatforms(updatedPlatforms);
    } catch (error) {
      console.error("AI Generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColors = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('google')) return { primary: "#4285F4", secondary: "#E8F0FE", stars: "#FBBC05" };
    if (lower.includes('facebook')) return { primary: "#1877F2", secondary: "#F0F2F5", stars: "#FF9F00" };
    if (lower.includes('trustpilot')) return { primary: "#00B67A", secondary: "#F0FFF9", stars: "#00B67A" };
    if (lower.includes('zomato')) return { primary: "#cb202d", secondary: "#fce9ea", stars: "#cb202d" };
    if (lower.includes('tripadvisor')) return { primary: "#34E0A1", secondary: "#F0FFF9", stars: "#34E0A1" };
    if (lower.includes('justdial')) return { primary: "#2196f3", secondary: "#e3f2fd", stars: "#ffc107" };
    return { primary: "#333", secondary: "#f5f5f5", stars: "#daa520" };
  };

  const currentProfile = profile || staticProfile;
  const isSinglePlatform = platforms.length === 1;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header profile={currentProfile} />

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
            {/* Logo - Smaller Size */}
            {currentProfile?.logo && (
              <div className="mb-4 flex justify-center">
                <img src={currentProfile.logo} alt="Logo" className="h-12 md:h-16 object-contain drop-shadow-sm" />
              </div>
            )}

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
              Thank you for visiting <strong>{currentProfile?.businessName}</strong>! <br className="hidden md:block" />
              <span className="font-medium text-gray-900">Select, Copy, and Post</span> on your favorite platform.
            </p>

            {/* Save Contact Button - Hidden for now
            <div className="flex justify-center transform transition-transform hover:scale-105 duration-200">
              <SaveContactButton profile={currentProfile} />
            </div>
            */}
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
                      key={platform.id || platform.name}
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

      <Footer profile={currentProfile} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReviewPageContent />
    </Suspense>
  );
}
