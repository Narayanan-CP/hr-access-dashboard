
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "rounded-lg glass-card p-6 transition-all duration-300",
        hover && "hover:shadow-md hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
