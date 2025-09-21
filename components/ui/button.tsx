import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold';
  const variantStyles = variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-transparent border border-gray-300 text-gray-700';
  return <button className={`${baseStyles} ${variantStyles} ${className}`} {...props} />;
}