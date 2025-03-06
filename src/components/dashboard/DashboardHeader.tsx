
import React from 'react';
import { CalendarClock } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userRole?: 'admin' | 'employee';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle,
  userRole = 'employee'
}) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </div>
      {subtitle && (
        <p className="text-muted-foreground">{subtitle}</p>
      )}
      <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
    </div>
  );
};

export default DashboardHeader;
