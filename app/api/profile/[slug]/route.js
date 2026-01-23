import { NextResponse } from 'next/server';
import { getProfileBySlug } from '../../../lib/profile';

export async function GET(request, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { success: false, message: 'Slug is required' },
                { status: 400 }
            );
        }

        const profile = await getProfileBySlug(slug);

        if (!profile) {
            return NextResponse.json(
                { success: false, message: 'Profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            profile
        });
    } catch (error) {
        console.error('Profile API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
