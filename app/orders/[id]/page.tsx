'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '../../../types';
import { useAuth } from '../../../lib/firebase';

export default function OrderConfirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) return router.push('/');
    if (user) {
      fetch(`/api/orders/${id}`)
        .then(res => res.json())
        .then(setOrder)
        .catch(err => console.error(err));
    }
  }, [id, user, loading, router]);

  if (!order) return <div className="px-4 py-6">Loading...</div>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p>Order #{order.id}</p>
      <p>Status: {order.status}</p>
      <p>Total: {order.total} USD</p>
      <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Items</h2>
        {order.items && order.items.map(item => (
          <div key={item.productId} className="flex justify-between">
            <span>{item.productId} (x{item.quantity})</span>
            <span>{item.selectedSize} | {item.selectedColor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}