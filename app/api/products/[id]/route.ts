import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase-server';
import { Product } from '../../../../types';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return NextResponse.json({ id: docSnap.id, ...docSnap.data() } as Product);
  }
  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}