import { NextResponse } from 'next/server';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

// Delete match by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'matches', id);
    await deleteDoc(docRef);

    return NextResponse.json({ message: 'Match deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update match by ID with given data in request body
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const docRef = doc(db, 'matches', id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    await updateDoc(docRef, body);

    return NextResponse.json({ message: 'Match updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
