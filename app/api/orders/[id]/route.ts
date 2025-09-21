import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../lib/firebase-server';
import { Order } from '../../../../types';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const user = auth.currentUser;

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const docRef = doc(db, 'orders', params.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() && docSnap.data().userId === user.uid) {
    return NextResponse.json({ id: docSnap.id, ...docSnap.data() } as Order);
  }
  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}