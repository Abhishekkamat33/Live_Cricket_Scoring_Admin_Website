import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '../../../app/firebaseadmin';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;



  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized: No session token' }, { status: 401 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(sessionToken);
    
    return NextResponse.json({ message: 'Access granted', uid: decodedToken.uid });
  } catch (error) {

    const response = NextResponse.json(
      { error: 'Unauthorized: Invalid or expired token' },
      { status: 401 }
    );

    // Clear the 'session' cookie in the response
    response.cookies.set('session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'lax',
    });

    return response;
  }
}

