// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {

    
    try{
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'session',
            value: '',
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0, // expire immediately
            sameSite: 'lax',
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}