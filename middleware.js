import { NextResponse } from 'next/server';

export function middleware(request) {
    const host = request.headers.get('host') || '';

    // Extract subdomain
    // calinfo.bizease.com → calinfo
    // www.bizease.com → www (will be skipped)
    // localhost:3000 → localhost (will be skipped)

    const parts = host.split('.');
    let subdomain = null;

    // Check if it's a proper subdomain (not www, not main domain)
    if (parts.length >= 3) {
        // Format: subdomain.domain.tld (e.g., calinfo.bizease.com)
        subdomain = parts[0];
    } else if (parts.length === 2 && !host.includes('localhost')) {
        // Format: domain.tld (no subdomain, main site)
        subdomain = null;
    }

    // Skip for these cases
    const skipSubdomains = ['www', 'admin', 'api', 'mail', 'ftp'];
    if (!subdomain || skipSubdomains.includes(subdomain) || host.includes('localhost')) {
        return NextResponse.next();
    }

    // Clone the URL and add subdomain as a search param
    const url = request.nextUrl.clone();
    url.searchParams.set('subdomain', subdomain);

    // Rewrite (internal redirect) to pass subdomain to the page
    return NextResponse.rewrite(url);
}

export const config = {
    // Match all paths except static files and API routes
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)'],
};
