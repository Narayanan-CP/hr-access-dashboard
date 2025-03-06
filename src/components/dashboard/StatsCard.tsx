
import React from 'react';
import GlassCard from '../ui-custom/GlassCard';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  isLoading = false
}) => {
  return (
    <GlassCard 
      className={cn(
        "flex flex-col h-full",
        className
      )}
      hover
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-md bg-primary/10">
          {icon}
        </div>
        {trend && (
          <div 
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {isLoading ? (
          <div className="flex items-center mt-1">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <p className="text-2xl font-bold mt-1">{value}</p>
        )}
      </div>
    </GlassCard>
  );
};

export default StatsCard;
