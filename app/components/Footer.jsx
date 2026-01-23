"use client";

export default function Footer({ profile }) {
    // Get data from profile
    const logo = profile?.logo;
    const businessName = profile?.businessName || "Business";
    const description = profile?.description || "We provide professional services with a focus on quality and customer satisfaction.";

    // Contact info from profile
    const contact = {
        address: profile?.address,
        email: profile?.email,
        phone: profile?.phone
    };

    // Get footer links from profile or use defaults
    const allLinks = profile?.footerConfig?.links || [];
    const quickLinks = allLinks.slice(0, 4); // First 4 links for Quick Links
    const supportLinks = allLinks.slice(4, 6); // Next 2 for Support section (no heading)

    return (
        <footer className="bg-white border-t border-gray-100" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>

            <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Column 1: Logo & Description */}
                    <div className="space-y-4">
                        {/* Logo */}
                        {logo ? (
                            <img className="h-10 w-auto object-contain" src={logo} alt={businessName} />
                        ) : (
                            <span className="text-xl font-bold text-gray-900">{businessName}</span>
                        )}

                        <p className="text-sm leading-6 text-gray-600">
                            {description}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">Quick Links</h3>
                        <ul role="list" className="mt-4 space-y-3">
                            {quickLinks.length > 0 ? quickLinks.map((item, idx) => (
                                <li key={idx}>
                                    <a href={item.href || item.url || '#'} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                        {item.label || item.name}
                                    </a>
                                </li>
                            )) : (
                                <>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Home</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">About Us</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Services</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Contact</a></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Column 3: Support Links (No Heading) */}
                    <div>
                        <ul role="list" className="mt-10 space-y-3">
                            {supportLinks.length > 0 ? supportLinks.map((item, idx) => (
                                <li key={idx}>
                                    <a href={item.href || item.url || '#'} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                        {item.label || item.name}
                                    </a>
                                </li>
                            )) : (
                                <>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Help Center</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-gray-900">Contact Us</h3>
                        <ul role="list" className="mt-4 space-y-3">
                            {contact.address && (
                                <li className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{contact.address}</span>
                                </li>
                            )}
                            {contact.phone && (
                                <li className="flex items-center gap-3 text-sm leading-6 text-gray-600">
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>{contact.phone}</span>
                                </li>
                            )}
                            {contact.email && (
                                <li className="flex items-center gap-3 text-sm leading-6 text-gray-600">
                                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>{contact.email}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} <a href="https://bizease.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">BizEase</a>. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500">
                        Designed & Developed by <a href="https://calinfo.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Calinfo</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
