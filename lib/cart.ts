import { CartItem, Product } from '../types';

export function calculateCartTotal(cart: CartItem[], products: { [key: string]: Product }) {
  return cart.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0);
}