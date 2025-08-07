// app/api/matches/route.ts
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const uid = url.searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('matchCreatedBy', '==', uid));
    const querySnapshot = await getDocs(q);
   

    if (querySnapshot.empty) {
      return NextResponse.json([], { status: 200 }); // no matches found for uid
    }

    // Map Firestore docs to an array of match objects
    const matches = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


