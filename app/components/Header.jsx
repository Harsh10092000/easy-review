"use client";

import { useState } from "react";
import { siteConfig } from "../data/siteConfig";

export default function Header({ profile }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Use profile branding if available
    const logo = profile?.logo || siteConfig.header.logo;
    const businessName = profile?.businessName || siteConfig.header.logoAlt;

    // Default links if none provided
    const links = profile?.headerConfig?.links || siteConfig.header.navigation;

    return (
        <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">

                {/* Logo Section */}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                        {logo && logo.startsWith('http') ? (
                            <img className="h-10 w-auto object-contain" src={logo} alt={businessName} />
                        ) : (
                            <span className="text-xl font-bold text-gray-900">{businessName}</span>
                        )}
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Links */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {links && links.map((item) => (
                        <a
                            key={item.label || item.name}
                            href={item.url || item.href || '#'}
                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-[var(--primary)] transition-colors"
                            style={{ '--primary': profile?.theme?.primaryColor || '#2563eb' }}
                        >
                            {item.label || item.name}
                        </a>
                    ))}
                </div>

                {/* CTA Button (Optional) */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {/* Placeholder for future CTA */}
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 shadow-lg">
                    <div className="space-y-4">
                        {links && links.map((item) => (
                            <a
                                key={item.label || item.name}
                                href={item.url || item.href || '#'}
                                className="block text-base font-semibold text-gray-900"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label || item.name}
                            </a>
                        ))}
                    </div>
                    <button
                        className="mt-4 w-full py-2 bg-gray-100 rounded-lg font-medium text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </header>
    );
}
