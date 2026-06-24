import React from 'react';

interface CardProps extends React.AreaHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl shadow-md border outset border-gray-300 ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-2 py-1 ${className}`}>
      {children}
    </div>
  );
}