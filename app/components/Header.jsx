"use client";

import { useState } from "react";

export default function Header({ profile }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Use profile branding if available
    const logo = profile?.logo;
    const businessName = profile?.businessName || "Business";

    // Default links if none provided
    const links = profile?.headerConfig?.links || [];

    return (
        <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8" aria-label="Global">

                {/* Logo Section */}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5 flex items-center gap-3">
                        {logo ? (
                            <img className="h-10 w-auto object-contain" src={logo} alt={businessName} />
                        ) : (
                            <span className="text-xl font-bold text-gray-900">{businessName}</span>
                        )}
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex lg:hidden">
                    {links && links.length > 0 &&
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Toggle menu</span>
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    }
                </div>

                {/* Desktop Links */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-8">
                    {links && links.length > 0 ? links.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.url || item.href || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold leading-6 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {item.label || item.name}
                        </a>
                    )) : (
                        <>
                            {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                            <a href="#" className="text-sm font-semibold leading-6 text-gray-700 hover:text-blue-600 transition-colors">About Us</a>
                            <a href="#" className="text-sm font-semibold leading-6 text-gray-700 hover:text-blue-600 transition-colors">Services</a>
                            <a href="#" className="text-sm font-semibold leading-6 text-gray-700 hover:text-blue-600 transition-colors">Contact Us</a> */}
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        {links && links.length > 0 ? links.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url || item.href || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-base font-medium text-gray-700 hover:text-blue-600 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label || item.name}
                            </a>
                        )) : (
                            <>
                                {/* <a href="#" className="block text-base font-medium text-gray-700 py-2">Home</a>
                                <a href="#" className="block text-base font-medium text-gray-700 py-2">About Us</a>
                                <a href="#" className="block text-base font-medium text-gray-700 py-2">Services</a>
                                <a href="#" className="block text-base font-medium text-gray-700 py-2">Contact Us</a> */}
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
