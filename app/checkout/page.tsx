// ...existing code...
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, Product } from '../../types';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../lib/firebase';
import { MapPin, CreditCard, Wallet } from 'lucide-react';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [address, setAddress] = useState('');
  const [deliveryOption] = useState('Standard');
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [placing, setPlacing] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    async function loadCart() {
      if (!user) return;
      setLoadingLocal(true);
      try {
        // load cart for current user
        const cartRes = await fetch(`/api/cart?uid=${encodeURIComponent(user.uid)}`);
        const items: CartItem[] = cartRes.ok ? await cartRes.json() : [];
        setCart(Array.isArray(items) ? items : []);

        // fetch product details for items
        const productMap: { [key: string]: Product } = {};
        await Promise.all((items || []).map(async (item) => {
          try {
            const pRes = await fetch(`/api/products/${encodeURIComponent(item.productId)}`);
            if (!pRes.ok) return;
            const prod: Product = await pRes.json();
            if (prod && prod.id) productMap[item.productId] = prod;
          } catch (err) {
            // ignore single product failures
            console.error('product fetch error', item.productId, err);
          }
        }));
        setProducts(productMap);
      } catch (err) {
        console.error('failed to load cart', err);
      } finally {
        setLoadingLocal(false);
      }
    }

    loadCart();
  }, [user, loading, router]);

  const total = Array.isArray(cart)
    ? cart.reduce((sum, item) => {
        const price = products[item.productId]?.price ?? 0;
        return sum + price * item.quantity;
      }, 0)
    : 0;

  const deliveryFee = deliveryOption === 'Standard' ? 12.0 : 20.0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user || placing) return;
    setPlacing(true);
    try {
      // round to 2 decimals before sending
      const roundedTotal = parseFloat(grandTotal.toFixed(2));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, items: cart, total: roundedTotal, address }),
      });
      const data = await res.json();
      if (res.ok && data?.id) {
        // optionally clear local cart state here
        router.push(`/orders/${data.id}`);
      } else {
        console.error('order API error', data);
      }
    } catch (err) {
      console.error('failed placing order', err);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-28">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Delivery Address */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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

        {loadingLocal ? (
          <div>Loading cart...</div>
        ) : (
          <>
            {Array.isArray(cart) && cart.length > 0 ? (
              cart.map((item) => {
                const product = products[item.productId];
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex justify-between mb-2">
                    <span>{product.title} x{item.quantity}</span>
                    <span>${(product.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-600">Your cart is empty.</div>
            )}

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
          </>
        )}
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

      {/* Fixed checkout button above navigation */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <Button
          onClick={handlePlaceOrder}
          className="w-full button-primary flex items-center justify-center"
          disabled={placing || cart.length === 0}
        >
          <CreditCard className="mr-2" size={18} />
          {placing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
