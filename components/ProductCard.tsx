import { Product } from '../types';
import { Shirt } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  // Handle missing or empty images array
  const hasImage = product.images && product.images.length > 0;
    
  return (
    <div className="card cursor-pointer" onClick={onClick}>
      <div className="w-full h-40 bg-gradient-to-br from-primary-orange to-orange-300 rounded-[12px] mb-2 overflow-hidden flex items-center justify-center">
        {hasImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <Shirt className="text-white" size={64} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Shirt className="text-white" size={64} />
          </div>
        )}
      </div>
      <h3 className="font-semibold mb-1">{product.title}</h3>
      <p className="text-primary-orange font-bold">${product.price}</p>
    </div>
  );
}