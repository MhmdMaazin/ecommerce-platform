'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Chip } from '../../../components/ui/Chip';
import { useAuth } from '../../../lib/firebase';
import { ArrowLeft, Shirt, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Blue');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    fetch(`/api/products/${id}`).then(res => res.json()).then(productData => {
      setProduct(productData);
      // Set initial selected size and color from product variants
      if (productData.variants?.sizes && productData.variants.sizes.length > 0) {
        setSelectedSize(productData.variants.sizes[0]);
      }
      if (productData.variants?.colors && productData.variants.colors.length > 0) {
        setSelectedColor(productData.variants.colors[0]);
      }
    });
  }, [id]);

  const handleAddToCart = async () => {
    if (loading || !user) return router.push('/');
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, productId: id, quantity, selectedSize, selectedColor }),
    });
    router.push('/cart');
  };

  if (!product) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // Use product variants if available, otherwise use defaults
  const sizes = product.variants?.sizes || ['S', 'M', 'L', 'XL'];
  const colors = product.variants?.colors || ['Blue', 'Red', 'Green'];

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-8">
      {/* Back Button */}
      <button onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="text-gray-600" size={24} />
      </button>

      {/* Image */}
      <div className="mb-6">
        <div className="w-full h-64 bg-gradient-to-br from-primary-orange to-orange-300 rounded-[16px] flex items-center justify-center">
          <Shirt className="text-white" size={120} />
        </div>
      </div>

      {/* Details Card */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-xl font-bold flex-1 mr-2">{product.title}</h1>
          <div className="text-2xl font-bold text-primary-orange">${product.price}</div>
        </div>
        <p className="text-sm text-gray-600 mb-6">{product.description}</p>

        {/* Size Selector */}
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Size</p>
          <div className="flex space-x-2">
            {sizes.map(size => (
              <Chip key={size} active={selectedSize === size} onClick={() => setSelectedSize(size)}>
                {size}
              </Chip>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2">Color</p>
          <div className="flex space-x-2">
            {colors.map(color => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-primary-orange' : 'border-gray-300'}`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold">Quantity</p>
          <div className="flex items-center space-x-2">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border rounded-full flex items-center justify-center">
              <Minus size={16} />
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border rounded-full flex items-center justify-center">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <Button onClick={handleAddToCart} className="w-full button-primary flex items-center justify-center">
          <ShoppingCart className="mr-2" size={18} />
          Add to Cart ${(product.price * quantity).toFixed(2)}
        </Button>
      </div>
    </div>
  );
}