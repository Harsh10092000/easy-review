"use client";

import { siteConfig } from "../data/siteConfig";

export default function Footer({ profile }) {
    const { footer } = siteConfig;

    // Fallback to static config if profile data missing
    const contact = {
        address: profile?.address || footer.contact.address,
        email: profile?.email || footer.contact.email,
        phone: profile?.phone || footer.contact.phone
    };

    const logo = profile?.logo || footer.logo;
    const businessName = profile?.businessName || footer.logoAlt;
    const links = profile?.footerConfig?.links || footer.links;

    return (
        <footer className="bg-white border-t border-gray-100" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            {logo && logo.startsWith('http') ? (
                                <img className="h-9 w-auto object-contain" src={logo} alt={businessName} />
                            ) : (
                                <span className="text-xl font-bold text-gray-900">{businessName}</span>
                            )}
                        </div>

                        <p className="text-sm leading-6 text-gray-600">
                            {profile?.description || "Empowering businesses to build trust through authentic customer reviews."}
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                                    Quick Links
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {links.map((item) => (
                                        <li key={item.label}>
                                            <a href={item.href || '#'} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                                    Support
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                            Privacy Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-1 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                                    Contact Us
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {contact.address && (
                                        <li className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{contact.address}</span>
                                        </li>
                                    )}
                                    {contact.phone && (
                                        <li className="flex items-center gap-3 text-sm leading-6 text-gray-600">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span>{contact.phone}</span>
                                        </li>
                                    )}
                                    {contact.email && (
                                        <li className="flex items-center gap-3 text-sm leading-6 text-gray-600">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>{contact.email}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-gray-500">
                        &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
