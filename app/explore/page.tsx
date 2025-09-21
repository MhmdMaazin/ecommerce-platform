'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { Chip } from '../../components/ui/Chip';
import { useAuth, signOutUser } from '../../lib/firebase';
import { LogOut, Home, Compass, ShoppingCart, Settings, Package } from 'lucide-react';

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
      return;
    }
    
    // Fetch products based on category
    if (user) {
      fetch(`/api/products?category=${selectedCategory}`)
        .then(res => res.json())
        .then(setProducts);
    }
  }, [selectedCategory, user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home
  }

  const categories = ['All', 'Men', 'Women', 'Kids', 'Other'];

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Explore</h1>
          <p className="text-sm text-gray-600">Best Collections</p>
        </div>
        <button 
          onClick={async () => {
            try {
              await signOutUser();
              router.replace('/');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }}
          className="text-gray-600 hover:text-primary-orange transition-colors"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 justify-center">
        {categories.map(cat => (
          <Chip
            key={cat}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 mb-24">
        {products.slice(0, 5).map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => router.push(`/products/${product.id}`)}
          />
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-200 py-3 px-4 z-10">
        <button onClick={() => router.push('/')} className="flex flex-col items-center text-gray-500">
          <Home className="mb-1" size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-primary-orange">
          <Compass className="mb-1" size={24} />
          <span className="text-xs">Explore</span>
        </button>
        <button onClick={() => router.push('/cart')} className="flex flex-col items-center text-gray-500">
          <ShoppingCart className="mb-1" size={24} />
          <span className="text-xs">Cart</span>
        </button>
        <button onClick={() => router.push('/orders')} className="flex flex-col items-center text-gray-500">
          <Package className="mb-1" size={24} />
          <span className="text-xs">Orders</span>
        </button>
      </div>
    </div>
  );
}