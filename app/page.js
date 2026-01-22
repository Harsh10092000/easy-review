"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlatformCard from "./components/PlatformCard";
import SaveContactButton from "./components/SaveContactButton";
import { siteConfig } from "./data/siteConfig";
import { staticReviewsByPlatform } from "./data/reviewsData";

const BACKEND_URL = "http://localhost:8010"; // Update for production

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("id"); // ?id=slug

  const [profile, setProfile] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Profile on Load
  useEffect(() => {
    if (!slug) {
      loadDefaultConfig();
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profile/public/${slug}`);
        const data = await res.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
          initializePlatforms(data.profile);
        } else {
          loadDefaultConfig();
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        loadDefaultConfig();
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [slug]);

  // 2. Initialize Platforms
  const initializePlatforms = (profileData) => {
    const profilePlatforms = profileData.platforms && profileData.platforms.length > 0
      ? profileData.platforms
      : siteConfig.platforms;

    const initialPlatforms = profilePlatforms.map(p => ({
      id: p.name.toLowerCase(),
      name: p.name,
      icon: p.name.toLowerCase(),
      reviewUrl: p.url,
      buttonText: `Review on ${p.name}`,
      colors: getPlatformColors(p.name),
      reviews: []
    }));

    setPlatforms(initialPlatforms);
    generateReviewsForProfile(profileData, initialPlatforms);
  };

  const loadDefaultConfig = () => {
    const defaultPlatforms = siteConfig.platforms.map(p => ({
      ...p,
      reviews: staticReviewsByPlatform[p.id] || []
    }));
    setPlatforms(defaultPlatforms);
    setLoading(false);
  };

  // 3. Generate AI Reviews
  const generateReviewsForProfile = async (profileData, currentPlatforms) => {
    try {
      const platformPromises = currentPlatforms.map(async (platform) => {
        try {
          const query = new URLSearchParams({
            platform: platform.name,
            businessName: profileData.businessName,
            businessType: profileData.businessType,
            language: profileData.languagePref || 'English',
            ts: Date.now()
          });

          const response = await fetch(`/api/generate-reviews?${query.toString()}`, {
            cache: 'no-store',
            headers: { 'Pragma': 'no-cache' }
          });
          const data = await response.json();

          if (data.success && data.reviews?.length > 0) {
            return { ...platform, reviews: data.reviews };
          }
        } catch (err) {
          console.warn(`Failed to generate reviews for ${platform.name}:`, err);
        }
        return platform;
      });

      const updatedPlatforms = await Promise.all(platformPromises);
      setPlatforms(updatedPlatforms);
      setLoading(false);
    } catch (error) {
      console.error("AI Generation error:", error);
      setLoading(false);
    }
  };

  const getPlatformColors = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('google')) return { primary: "#4285F4", secondary: "#E8F0FE", stars: "#FBBC05" };
    if (lower.includes('facebook')) return { primary: "#1877F2", secondary: "#F0F2F5", stars: "#FF9F00" };
    if (lower.includes('trustpilot')) return { primary: "#00B67A", secondary: "#F0FFF9", stars: "#00B67A" };
    if (lower.includes('zomato')) return { primary: "#cb202d", secondary: "#fce9ea", stars: "#cb202d" };
    if (lower.includes('tripadvisor')) return { primary: "#34E0A1", secondary: "#F0FFF9", stars: "#34E0A1" };
    return { primary: "#333", secondary: "#f5f5f5", stars: "#daa520" };
  };

  // Dynamic Theme Styles
  const themeStyles = profile ? {
    "--primary": profile.theme?.primaryColor || "#2563eb",
    "--secondary": profile.theme?.secondaryColor || "#1e40af",
  } : {};

  // Check if we should render single platform view
  const isSinglePlatform = platforms.length === 1;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={themeStyles}>
      <Header profile={profile} />

      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4 bg-white relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#FF9F00' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: '#0066FF' }} />
          <div className="absolute top-20 left-10 w-20 h-8 bg-[#0066FF] rounded-full opacity-20 rotate-45" />
          <div className="absolute bottom-20 right-20 w-16 h-6 bg-[#FF9F00] rounded-full opacity-30 -rotate-12" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Side */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span style={{ color: 'var(--primary, #FF9F00)' }}>Customer</span>
                  <br />
                  <span style={{ color: 'var(--secondary, #0066FF)' }}>REVIEW</span>
                </h1>

                <p className="text-lg text-gray-600 mb-4 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Thank you for visiting <strong>{profile?.businessName || "Landmark Properties"}</strong>!
                  We've drafted some reviews for you based on our services.
                </p>

                {/* Save Contact Button */}
                <div className="flex justify-center lg:justify-start mb-8">
                  <SaveContactButton profile={profile} />
                </div>
              </div>

              {/* Right Side - Image/Visuals */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Floating Icons */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#FF9F00] rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#E02D4C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  </div>

                  {/* Main Card */}
                  <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-3xl p-8 shadow-2xl" style={{ background: 'linear-gradient(135deg, var(--primary, #0066FF), var(--secondary, #0052CC))' }}>
                    {/* Using Profile Logo here if available, otherwise stars */}
                    {profile?.logo ? (
                      <div className="flex items-center justify-center mb-6 h-32 bg-white/10 rounded-2xl backdrop-blur-sm p-4">
                        <img src={profile.logo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-md" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-10 h-10 text-[#FF9F00] fill-current drop-shadow-lg" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur">
                        <p className="text-2xl md:text-3xl font-bold text-white">500+</p>
                        <p className="text-xs text-white/70">Clients</p>
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
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: 'var(--primary, #0066FF)', borderTopColor: 'transparent' }} />
                <p className="text-gray-600 text-lg">Generating personalized {profile?.languagePref || ''} reviews...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {platforms.map((platform) => (
                  <PlatformCard
                    key={platform.id || platform.name}
                    platform={platform}
                    isSinglePlatform={isSinglePlatform}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewPageContent />
    </Suspense>
  );
}
