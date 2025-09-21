'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '../../../types';
import { useAuth } from '../../../lib/firebase';

export default function OrderConfirmation() {
  const params = useParams();
  const { id } = params as { id: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (!user) return;

    const controller = new AbortController();
    async function loadOrder() {
      setLoadingOrder(true);
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          console.error('Failed to fetch order', res.status);
          setOrder(null);
          return;
        }
        const data: Order = await res.json();
        setOrder(data);
      } catch (err: unknown) { // Use unknown instead of any
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Error loading order', err);
        setOrder(null);
      } finally {
        setLoadingOrder(false);
      }
    }

    loadOrder();
    return () => controller.abort();
  }, [id, user, loading, router]);

  if (loadingOrder) return <div className="px-4 py-6">Loading order...</div>;
  if (!order) return <div className="px-4 py-6">Order not found.</div>;

  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : '—';
  const totalDisplay =
    typeof order.total === 'number' ? order.total.toFixed(2) : (Number(order.total || 0)).toFixed(2);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p>Order #{order.id}</p>
      <p>Status: {order.status ?? '—'}</p>
      <p>Total: ${totalDisplay} USD</p>
      <p>Placed on: {createdAt}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Items</h2>
        {order.items && order.items.length > 0 ? (
          order.items.map((item) => (
            <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor || ''}`} className="flex justify-between py-2 border-b">
              <div>
                <div className="font-medium">{item.productId}</div>
                <div className="text-sm text-gray-600">
                  Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''}
                </div>
              </div>
              <div className="text-right">
                {typeof item.price === 'number' ? `$${(item.price * item.quantity).toFixed(2)}` : '—'}
                <div className="text-xs text-gray-500">{typeof item.price === 'number' ? `$${item.price.toFixed(2)} each` : ''}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-600">No items found for this order.</div>
        )}
      </div>
    </div>
  );
}