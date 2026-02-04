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
                            <a href={profile?.website || '#'} target={profile?.website ? "_blank" : "_self"} rel="noopener noreferrer" className="block">
                                <img className="h-10 w-auto object-contain" src={logo} alt={businessName} />
                            </a>
                        ) : (
                            <a href={profile?.website || '#'} target={profile?.website ? "_blank" : "_self"} rel="noopener noreferrer" className="text-xl font-bold text-gray-900 block">
                                {businessName}
                            </a>
                        )}

                        <p className="text-sm leading-6 text-gray-600">
                            {description}
                        </p>

                        {/* Social Links */}
                        {profile?.footerConfig?.social && (
                            <div className="flex gap-4 pt-2">
                                {profile.footerConfig.social.facebook && (
                                    <a href={profile.footerConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                )}
                                {profile.footerConfig.social.instagram && (
                                    <a href={profile.footerConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                                        <span className="sr-only">Instagram</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.9c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                )}
                                {profile.footerConfig.social.twitter && (
                                    <a href={profile.footerConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                )}
                                {profile.footerConfig.social.linkedin && (
                                    <a href={profile.footerConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                )}
                                {profile.footerConfig.social.youtube && (
                                    <a href={profile.footerConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                                        <span className="sr-only">YouTube</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Quick Links */}
                    {quickLinks.length > 0 &&
                        <>
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
                                            {/* <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Home</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">About Us</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Services</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Contact</a></li> */}
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
                                            {/* <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Help Center</a></li>
                                    <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-gray-900">Privacy Policy</a></li> */}
                                        </>
                                    )}
                                </ul>
                            </div>
                        </>
                    }
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

                {/* Disclaimer */}
                <div className="mt-12 border-t border-gray-200 pt-8 pb-4">
                    <p className="text-xs text-gray-500 text-center leading-relaxed max-w-4xl mx-auto">
                        The reviews or comments shared are only sample ideas for reference. CAL INFO does not promote fake or misleading reviews.
                        Users should post reviews only based on their real experience with a business or service.
                        Compliance with platform policies and applicable laws is the user’s responsibility.
                    </p>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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
