'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '../../types';
import { useAuth } from '../../lib/firebase';
import { Home, Compass, ShoppingCart, Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/');
    if (user) {
      fetch(`/api/orders?uid=${user.uid}`)
        .then(res => res.json())
        .then(setOrders)
        .catch(err => console.error(err));
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-gray-600">Order History</p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <Package className="text-gray-400 mb-4" size={120} />
          <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-gray-600 text-center mb-4">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-20">
          {orders.map(order => (
            <div 
              key={order.id} 
              className="card p-4 cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Order #{order.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{order.items.length} items</span>
                <span>${order.total}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-200 py-3 px-4 z-10">
        <button onClick={() => router.push('/')} className="flex flex-col items-center text-gray-500">
          <Home className="mb-1" size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => router.push('/explore')} className="flex flex-col items-center text-gray-500">
          <Compass className="mb-1" size={24} />
          <span className="text-xs">Explore</span>
        </button>
        <button onClick={() => router.push('/cart')} className="flex flex-col items-center text-gray-500">
          <ShoppingCart className="mb-1" size={24} />
          <span className="text-xs">Cart</span>
        </button>
        <button className="flex flex-col items-center text-primary-orange">
          <Package className="mb-1" size={24} />
          <span className="text-xs">Orders</span>
        </button>
      </div>
    </div>
  );
}