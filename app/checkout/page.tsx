'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '../../types';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../lib/firebase';
import { MapPin, CreditCard, Wallet } from 'lucide-react';

export default function CheckoutPage() {
  const [cart] = useState<CartItem[]>([]);
  const [products] = useState<{ [key: string]: Product }>({});
  const [address, setAddress] = useState('');
  const [deliveryOption] = useState('Standard');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/');
    // Similar fetch logic as cart
  }, [user, loading, router]);

  const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0) : 0;
  const deliveryFee = deliveryOption === 'Standard' ? 12.00 : 20.00;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) return;
    const order = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, items: cart, total: grandTotal, address }),
    }).then(res => res.json());
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Delivery Address */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full h-20 border border-gray-300 rounded-[12px] p-3 mb-4"
          placeholder="Enter your address"
        />
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="text-primary-orange" size={20} />
          <span className="text-sm text-gray-600">Deliver to 123 Main St, City</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {Array.isArray(cart) && cart.map(item => {
          const product = products[item.productId];
          if (!product) return null;
          return (
            <div key={item.productId} className="flex justify-between mb-2">
              <span>{product.title} x{item.quantity}</span>
              <span>${(product.price * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Payment</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <div className="flex space-x-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mb-1">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <span className="text-xs">Visa</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center mb-1">
              <span className="text-white text-xs font-bold">MC</span>
            </div>
            <span className="text-xs">Mastercard</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center mb-1">
              <Wallet className="text-white" size={16} />
            </div>
            <span className="text-xs">PayPal</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          * Save 10% on your order if you apply the coupon code SAVE10
        </p>
      </div>

      <Button onClick={handlePlaceOrder} className="w-full button-primary mb-20 flex items-center justify-center">
        <CreditCard className="mr-2" size={18} />
        Pay ${grandTotal.toFixed(2)}
      </Button>
    </div>
  );
}