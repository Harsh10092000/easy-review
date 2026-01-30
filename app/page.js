"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlatformCard, { PlatformIcon } from "./components/PlatformCard";
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

  const [notFound, setNotFound] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profile, setProfile] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

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
        if (!data.profile.isActive) {
          setIsBlocked(true);
          setLoading(false);
          return;
        }
        setProfile(data.profile);
        initializePlatforms(data.profile);
      } else {
        // Profile explicitly not found
        setNotFound(true);
        setLoading(false);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setNotFound(true);
      setLoading(false);
    }
  };

  const loadStaticConfig = () => {
    setProfile(staticProfile);
    const defaultPlatforms = siteConfig.platforms.map(p => ({
      ...p,
      reviews: staticReviewsByPlatform[p.id] || []
    }));
    setPlatforms(defaultPlatforms);
    if (defaultPlatforms.length > 0) {
      setActiveTab(defaultPlatforms[0].id || defaultPlatforms[0].name?.toLowerCase());
    }
    setLoading(false);
  };

  const initializePlatforms = (profileData) => {
    // Strictly use DB platforms. If null/undefined, assume empty (do NOT fallback to demo config)
    const profilePlatforms = profileData.platforms || [];

    const initialPlatforms = profilePlatforms.map(p => ({
      id: p.name?.toLowerCase() || p.id,
      name: p.name,
      icon: p.name?.toLowerCase() || p.icon,
      reviewUrl: p.url || p.reviewUrl,
      buttonText: `Review on ${p.name}`,
      colors: getPlatformColors(p.name),
      reviews: [],
      isLoading: true // Start in loading state for optimistic UI
    }));

    setPlatforms(initialPlatforms);
    if (initialPlatforms.length > 0) setActiveTab(initialPlatforms[0].id);

    // Stop page loading immediately so skeletons show up
    setLoading(false);

    // Start streaming generation
    generateReviewsForProfile(profileData, initialPlatforms);
  };

  const generateReviewsForProfile = async (profileData, currentPlatforms) => {
    try {
      // Get selected languages
      let languages = profileData.languagePref;
      if (typeof languages === 'string') {
        try { languages = JSON.parse(languages); } catch { languages = [languages]; }
      }
      if (!Array.isArray(languages) || languages.length === 0) {
        languages = ['English'];
      }

      // We only support streaming for the primary language for now to simpler UI updates
      const lang = languages[0];

      const query = new URLSearchParams({
        businessName: profileData.businessName || profileData.business_name,
        businessType: profileData.businessType || profileData.business_type || 'business',
        ownerName: profileData.promptConfig?.ownerName || '',
        language: lang,
        location: [profileData.city, profileData.state].filter(Boolean).join(', ') || 'India',
        description: profileData.description || '',
        keywords: profileData.keywords || '',
        reviewCount: 9, // Request more reviews per platform
        platforms: currentPlatforms.map(p => p.name).join(',') // Send active platforms
      });

      // Start Stream
      const response = await fetch(`/api/generate-reviews?${query.toString()}`);

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.success && data.platform && data.reviews) {
                // Update specific platform with new reviews
                setPlatforms(prev => prev.map(p => {
                  if (p.name.toLowerCase() === data.platform.toLowerCase()) {
                    return {
                      ...p,
                      reviews: [...p.reviews, ...data.reviews],
                      isLoading: false // Stop skeleton
                    };
                  }
                  return p;
                }));
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }

      // Ensure all loading states are cleared at end (cleanup)
      setPlatforms(prev => prev.map(p => ({ ...p, isLoading: false })));

    } catch (error) {
      console.error("Streaming error:", error);
      setPlatforms(prev => prev.map(p => ({ ...p, isLoading: false })));
    }
  };

  const getPlatformColors = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('google')) return { primary: "#EA4335", secondary: "#FEE8E7", stars: "#FBBC05", gradient: "linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853)" };
    if (lower.includes('facebook')) return { primary: "#1877F2", secondary: "#F0F2F5", stars: "#FF9F00", gradient: "linear-gradient(135deg, #1877F2, #42a5f5)" };
    if (lower.includes('instagram')) return { primary: "#E1306C", secondary: "#FCE4EC", stars: "#F56040", gradient: "linear-gradient(135deg, #FFDC80, #F56040, #C13584, #833AB4)" };
    if (lower.includes('trustpilot')) return { primary: "#00B67A", secondary: "#F0FFF9", stars: "#00B67A", gradient: "linear-gradient(135deg, #00B67A, #00d68f)" };
    if (lower.includes('justdial')) return { primary: "#2196f3", secondary: "#e3f2fd", stars: "#ffc107", gradient: "linear-gradient(135deg, #2196f3, #1976d2)" };
    if (lower.includes('ambitionbox')) return { primary: "#6366F1", secondary: "#EEF2FF", stars: "#6366F1", gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)" };
    if (lower.includes('youtube')) return { primary: "#FF0000", secondary: "#FFEBEE", stars: "#FF0000", gradient: "linear-gradient(135deg, #FF0000, #C4302B)" };
    return { primary: "#333", secondary: "#f5f5f5", stars: "#daa520", gradient: "linear-gradient(135deg, #333, #666)" };
  };

  const currentProfile = profile || staticProfile;
  const isSinglePlatform = platforms.length === 1;

  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Deactivated</h1>
          <p className="text-gray-600 mb-6">
            This account is currently inactive. If you are the owner, please contact support or renew your subscription.
          </p>
          <div className="text-sm text-gray-500 font-medium bg-gray-50 py-3 rounded-lg border border-gray-100">
            Contact Support for assistance
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            The requested business profile could not be found. Please check the URL.
          </p>
          <div className="text-sm text-gray-500 font-medium bg-gray-50 py-3 rounded-lg border border-gray-100">
            Contact Admin for support
          </div>
        </div>
      </div>
    );
  }

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

            {/* <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="text-gray-900">We Value</span>
              <br className="md:hidden" />
              <span className="ml-2 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FF9F00, #E02D4C)' }}>
                Your Feedback
              </span>
            </h1> */}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="text-gray-900">SCAN TO REVIEW</span>
              <br className="md:hidden" />
              <span className="ml-2 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FF9F00, #E02D4C)' }}>
                IN LESS THAN <span>5</span> SEC
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
              <div className="space-y-8 min-h-[50vh]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                      <div className="h-6 w-32 bg-gray-200 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-40 bg-gray-100 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>


                {/* Mobile Tabs */}
                <div className="md:hidden sticky top-[50px] z-40 bg-white/95 backdrop-blur-sm mb-6 border-b border-gray-100 -mx-4 px-4 pt-4 pb-2">
                  <div className="overflow-x-auto pb-2 scrollbar-hide pt-2 pl-1">
                    <div className="flex gap-3">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => {
                            setActiveTab(platform.id);
                            // Scroll to top of reviews section with offset for sticky header + tabs
                            const reviewsElement = document.getElementById('reviews-section');
                            if (reviewsElement) {
                              const y = reviewsElement.getBoundingClientRect().top + window.scrollY - 160; // 140px offset
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 border ${activeTab === platform.id
                            ? "bg-white border-blue-600 shadow-md ring-1 ring-blue-100 transform scale-105"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          <div className={`w-5 h-5 flex items-center justify-center rounded-full ${activeTab === platform.id ? "" : "opacity-70"}`}>
                            <PlatformIcon platform={platform.icon} />
                          </div>
                          <span className={`text-sm font-semibold ${activeTab === platform.id ? "text-gray-900" : ""}`}>
                            {platform.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div id="reviews-section" className="space-y-8 min-h-[50vh]">
                  {/* Desktop View: Show All Stacked */}
                  <div className="hidden md:block space-y-8">
                    {platforms.map((platform) => (
                      <PlatformCard
                        key={platform.id || platform.name}
                        platform={platform}
                        isSinglePlatform={isSinglePlatform}
                        isLoading={platform.isLoading}
                      />
                    ))}
                  </div>

                  {/* Mobile View: Show Active Tab Only */}
                  <div className="md:hidden">
                    {platforms.map((platform) => (
                      <div key={platform.id} className={activeTab === platform.id ? "block animate-fadeIn" : "hidden"}>
                        <PlatformCard
                          platform={platform}
                          isSinglePlatform={true}
                          isLoading={platform.isLoading}
                        />
                      </div>
                    ))}
                  </div>
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
