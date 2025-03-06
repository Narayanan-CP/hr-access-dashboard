
import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  DollarSign, 
  ClipboardList, 
  MessageSquare,
  BarChart3,
  CircleUser
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import GlassCard from '@/components/ui-custom/GlassCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd get this from context/state management
    const role = localStorage.getItem('userRole') as 'admin' | 'employee' || 'employee';
    setUserRole(role);
    
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const adminStats = [
    { 
      title: 'Total Employees', 
      value: '42', 
      icon: <CircleUser className="h-5 w-5 text-primary" />,
      trend: { value: 12, isPositive: true } 
    },
    { 
      title: 'Leave Requests', 
      value: '8', 
      icon: <CalendarDays className="h-5 w-5 text-primary" />,
      trend: { value: 3, isPositive: false } 
    },
    { 
      title: 'Tasks Assigned', 
      value: '24', 
      icon: <ClipboardList className="h-5 w-5 text-primary" />,
      trend: { value: 9, isPositive: true } 
    },
    { 
      title: 'Pending Complaints', 
      value: '2', 
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      trend: { value: 1, isPositive: false } 
    },
  ];

  const employeeStats = [
    { 
      title: 'Available Leave Days', 
      value: '14', 
      icon: <CalendarDays className="h-5 w-5 text-primary" /> 
    },
    { 
      title: 'Current Salary', 
      value: '$3,500', 
      icon: <DollarSign className="h-5 w-5 text-primary" /> 
    },
    { 
      title: 'Pending Tasks', 
      value: '3', 
      icon: <ClipboardList className="h-5 w-5 text-primary" /> 
    },
    { 
      title: 'Open Complaints', 
      value: '0', 
      icon: <MessageSquare className="h-5 w-5 text-primary" /> 
    },
  ];

  const stats = userRole === 'admin' ? adminStats : employeeStats;

  return (
    <MainLayout userRole={userRole}>
      <DashboardHeader 
        title={userRole === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'} 
        subtitle={userRole === 'admin' 
          ? 'Manage your company\'s HR operations' 
          : 'View your HR information and requests'
        }
        userRole={userRole}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </div>

      {userRole === 'admin' ? (
        <AdminDashboardContent isLoading={isLoading} />
      ) : (
        <EmployeeDashboardContent isLoading={isLoading} />
      )}
    </MainLayout>
  );
};

const AdminDashboardContent = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <GlassCard className="h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Activity Overview</h3>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Last 30 days</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse w-full h-full bg-gray-100 rounded-md" />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
              <p className="text-muted-foreground">Chart data will appear here</p>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <GlassCard className="h-full">
          <h3 className="text-lg font-semibold mb-6">Recent Notifications</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <NotificationItem 
                title="New Leave Request" 
                time="10 minutes ago"
                status="new"
              />
              <NotificationItem 
                title="Salary Report Generated" 
                time="2 hours ago"
              />
              <NotificationItem 
                title="Task Status Updated" 
                time="5 hours ago"
              />
              <NotificationItem 
                title="New Complaint Filed" 
                time="Yesterday at 4:30 PM"
                status="new"
              />
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

const EmployeeDashboardContent = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <GlassCard className="h-full">
          <h3 className="text-lg font-semibold mb-6">Current Tasks</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <TaskItem 
                title="Complete quarterly report" 
                status="in_progress"
                dueDate="Tomorrow"
              />
              <TaskItem 
                title="Review team performance" 
                status="pending"
                dueDate="3 days left"
              />
              <TaskItem 
                title="Update personal details" 
                status="completed"
                dueDate="Completed yesterday"
              />
            </div>
          )}
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <GlassCard className="h-full">
          <h3 className="text-lg font-semibold mb-6">Recent Notifications</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <NotificationItem 
                title="Your leave request was approved" 
                time="10 minutes ago"
                status="new"
              />
              <NotificationItem 
                title="May salary slip available" 
                time="2 hours ago"
              />
              <NotificationItem 
                title="New task assigned" 
                time="5 hours ago"
                status="new"
              />
              <NotificationItem 
                title="Team meeting tomorrow" 
                time="Yesterday at 4:30 PM"
              />
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

interface NotificationItemProps {
  title: string;
  time: string;
  status?: 'new' | 'read';
}

const NotificationItem = ({ title, time, status = 'read' }: NotificationItemProps) => {
  return (
    <div className="flex items-start p-3 rounded-md hover:bg-secondary/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center">
          <p className="font-medium">{title}</p>
          {status === 'new' && (
            <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

interface TaskItemProps {
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
}

const TaskItem = ({ title, status, dueDate }: TaskItemProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-start p-3 rounded-md hover:bg-secondary/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{title}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{dueDate}</p>
      </div>
    </div>
  );
};

export default Dashboard;
