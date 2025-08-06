// app/api/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
  }

  try {
  

    // Await getting the cookie store first
    const cookieStore = await cookies();

    // Set cookie securely
    cookieStore.set({
      name: 'session',
      value: idToken,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
