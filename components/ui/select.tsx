import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder?: string;
}

export function Select({ options, placeholder, className = '', ...props }: SelectProps) {
  return (
    <select className={`border rounded px-2 py-1 ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}