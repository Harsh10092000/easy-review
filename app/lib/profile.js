import pool from './db';

/**
 * Fetch business profile by slug from database
 * @param {string} slug - The business slug (e.g., 'calinfo', 'iwin')
 * @returns {Promise<object|null>} Profile object or null if not found
 */
export async function getProfileBySlug(slug) {
    if (!slug) return null;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM business_profiles WHERE slug = ? OR subdomain = ? OR qr_token = ?",
            [slug, slug, slug]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Parse JSON fields and return formatted profile
        return {
            id: row.id,
            userId: row.user_id,
            businessName: row.business_name,
            businessType: row.business_type,
            slug: row.slug,
            logo: row.logo,
            theme: safeJsonParse(row.theme),
            headerConfig: safeJsonParse(row.header_config),
            footerConfig: safeJsonParse(row.footer_config),
            platforms: safeJsonParse(row.platforms),
            languagePref: safeJsonParse(row.language_pref) || ['English'],
            promptConfig: safeJsonParse(row.prompt_config),
            address: row.address,
            city: row.city,
            state: row.state,
            pincode: row.pincode,
            phone: row.phone,
            email: row.email,
            website: row.website,
            googleMapsLink: row.google_maps_link,
            description: row.description,
            description: row.description,
            keywords: row.keywords,
            subdomain: row.subdomain,
            qr_token: row.qr_token
        };
    } catch (error) {
        console.error("Database query error:", error);
        return null;
    }
}

/**
 * Safe JSON parse helper
 */
function safeJsonParse(value) {
    if (!value) return null;
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}
