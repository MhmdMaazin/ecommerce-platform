import { NextResponse } from 'next/server';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase-server';
import { Order } from '../../../types';

export async function GET(req: Request) {
  try {
    // Get the user ID from the query parameters
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const q = query(collection(db, 'orders'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Get the user ID from the request body
    const { uid, items, total } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = doc(collection(db, 'orders')).id;
    const order: Order = {
      id: orderId,
      userId: uid,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'orders', orderId), order);
    await setDoc(doc(db, 'carts', uid), { items: [] });
    return NextResponse.json({ id: orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}