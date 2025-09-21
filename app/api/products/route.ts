import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase-server';
import { Product } from '../../../types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let q = query(collection(db, 'products'));
  if (category && category !== 'All') q = query(q, where('category', '==', category));
  const snapshot = await getDocs(q);
  const products: Product[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return NextResponse.json(products);
}