'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '../../types';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../lib/firebase';
import { ShoppingCart, Trash2, Minus, Plus, Home, Compass, Package } from 'lucide-react';

import ProtectedRoute from '../../components/ProtectedRoute';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetch(`/api/cart?uid=${user.uid}`).then(res => res.json()).then(async (items: CartItem[]) => {
        setCart(items);
        // Fetch product details
        const productMap: { [key: string]: Product } = {};
        for (const item of items) {
          const prod = await fetch(`/api/products/${item.productId}`).then(res => res.json());
          productMap[item.productId] = prod;
        }
        setProducts(productMap);
      });
    }
  }, [user]);

  const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0) : 0;

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, productId, quantity }),
    });
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const handleRemove = async (productId: string) => {
    await handleUpdateQuantity(productId, 0);
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 pt-11">
          <ShoppingCart className="text-gray-400 mb-4" size={120} />
          <h2 className="text-xl font-bold mt-4">Your Cart is Empty</h2>
          <Button onClick={() => router.push('/explore')} className="mt-4 w-full button-primary">
            Continue Shopping
          </Button>

          <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-200 py-3 px-4 z-10">
            <button onClick={() => router.push('/')} className="flex flex-col items-center text-gray-500">
              <Home className="mb-1" size={24} />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => router.push('/explore')} className="flex flex-col items-center text-gray-500">
              <Compass className="mb-1" size={24} />
              <span className="text-xs">Explore</span>
            </button>
            <button className="flex flex-col items-center text-primary-orange">
              <ShoppingCart className="mb-1" size={24} />
              <span className="text-xs">Cart</span>
            </button>
            <button onClick={() => router.push('/orders')} className="flex flex-col items-center text-gray-500">
              <Package className="mb-1" size={24} />
              <span className="text-xs">Orders</span>
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Cart</h1>
          <Trash2 className="text-gray-600" size={24} />
        </div>

        {Array.isArray(cart) && cart.map(item => {
          const product = products[item.productId];
          if (!product) return null;
          return (
            <div key={item.productId} className="card flex mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-[12px] mr-4 flex items-center justify-center">
                <ShoppingCart className="text-gray-500" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.selectedSize} | {item.selectedColor}</p>
                <p className="text-primary-orange font-bold mb-2">${product.price.toFixed(2)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 border rounded-full flex items-center justify-center">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 border rounded-full flex items-center justify-center">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => handleRemove(item.productId)}>
                    <Trash2 className="text-gray-600" size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

  <div className="fixed bottom-20 left-4 right-4 z-20">
          <div className="card p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
          <Button onClick={() => router.push('/checkout')} className="w-full button-primary mb-4">
            Checkout
          </Button>
          
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
            <button className="flex flex-col items-center text-primary-orange">
              <ShoppingCart className="mb-1" size={24} />
              <span className="text-xs">Cart</span>
            </button>
            <button onClick={() => router.push('/orders')} className="flex flex-col items-center text-gray-500">
              <Package className="mb-1" size={24} />
              <span className="text-xs">Orders</span>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}