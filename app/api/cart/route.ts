import { NextResponse } from 'next/server';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase-server';
import { CartItem } from '../../../types';

export async function GET(req: Request) {
  try {
    // Get the user ID from the query parameters
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docRef = doc(db, 'carts', uid);
    const docSnap = await getDoc(docRef);
    const items = docSnap.exists() ? (docSnap.data().items as CartItem[]) : [];
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Get the user ID from the request body
    const { uid, productId, quantity, selectedSize, selectedColor } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docRef = doc(db, 'carts', uid);
    const docSnap = await getDoc(docRef);
  const items: CartItem[] = docSnap.exists() ? docSnap.data().items : [];
    const index = items.findIndex(item => item.productId === productId);
    if (index !== -1) {
      if (quantity === 0) items.splice(index, 1);
      else {
        items[index].quantity = quantity;
        items[index].selectedSize = selectedSize;
        items[index].selectedColor = selectedColor;
      }
    } else if (quantity > 0) {
      items.push({ productId, quantity, selectedSize, selectedColor });
    }
    await setDoc(docRef, { items });
    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}