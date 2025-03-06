
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LeaveRequestForm from '@/components/leaves/LeaveRequestForm';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle, Check, X, Calendar, CalendarPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaves = () => {
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, you'd get this from context/state management
    const role = localStorage.getItem('userRole') as 'admin' | 'employee' || 'employee';
    setUserRole(role);
    
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLeaveRequestSuccess = () => {
    setIsDialogOpen(false);
  };

  const mockLeaveRequests = [
    {
      id: 1,
      employeeName: 'John Doe',
      leaveType: 'Annual Leave',
      startDate: '2023-06-15',
      endDate: '2023-06-20',
      status: 'approved',
      requestDate: '2023-06-01',
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2023-06-22',
      endDate: '2023-06-23',
      status: 'pending',
      requestDate: '2023-06-20',
    },
    {
      id: 3,
      employeeName: 'Robert Johnson',
      leaveType: 'Personal Leave',
      startDate: '2023-07-10',
      endDate: '2023-07-15',
      status: 'rejected',
      requestDate: '2023-06-25',
    },
  ];

  const myLeaveRequests = [
    {
      id: 1,
      leaveType: 'Annual Leave',
      startDate: '2023-06-15',
      endDate: '2023-06-20',
      status: 'approved',
      requestDate: '2023-06-01',
    },
    {
      id: 2,
      leaveType: 'Sick Leave',
      startDate: '2023-07-05',
      endDate: '2023-07-06',
      status: 'pending',
      requestDate: '2023-06-28',
    },
  ];

  return (
    <MainLayout userRole={userRole}>
      <DashboardHeader 
        title={userRole === 'admin' ? 'Leave Management' : 'My Leaves'} 
        subtitle={userRole === 'admin' 
          ? 'Manage employee leave requests' 
          : 'Request and manage your leaves'
        }
        userRole={userRole}
      />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {userRole === 'admin' ? 'Leave Requests' : 'My Leave Requests'}
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>{userRole === 'admin' ? 'Add Leave' : 'Request Leave'}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Leave Request</DialogTitle>
              <DialogDescription>
                Fill in the details to submit a new leave request.
              </DialogDescription>
            </DialogHeader>
            <LeaveRequestForm onSuccess={handleLeaveRequestSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-100 rounded w-full mb-4"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded w-full"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {userRole === 'admin' && (
                      <th className="text-left py-3 px-4 font-medium">Employee</th>
                    )}
                    <th className="text-left py-3 px-4 font-medium">Leave Type</th>
                    <th className="text-left py-3 px-4 font-medium">Period</th>
                    <th className="text-left py-3 px-4 font-medium">Request Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    {userRole === 'admin' && (
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(userRole === 'admin' ? mockLeaveRequests : myLeaveRequests).map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-secondary/50 transition-colors">
                      {userRole === 'admin' && (
                        <td className="py-3 px-4">{leave.employeeName}</td>
                      )}
                      <td className="py-3 px-4">{leave.leaveType}</td>
                      <td className="py-3 px-4">
                        {leave.startDate} to {leave.endDate}
                      </td>
                      <td className="py-3 px-4">{leave.requestDate}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline"
                          className={
                            leave.status === 'approved' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800'
                          }
                        >
                          {leave.status === 'approved' 
                            ? 'Approved'
                            : leave.status === 'rejected'
                            ? 'Rejected'
                            : 'Pending'
                          }
                        </Badge>
                      </td>
                      {userRole === 'admin' && leave.status === 'pending' && (
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </td>
                      )}
                      {userRole === 'admin' && leave.status !== 'pending' && (
                        <td className="py-3 px-4"></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {userRole === 'employee' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <CalendarPlus className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Leave Balance</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <LeaveBalanceCard 
              title="Annual Leave" 
              used={5} 
              total={20} 
              isLoading={isLoading} 
            />
            <LeaveBalanceCard 
              title="Sick Leave" 
              used={2} 
              total={10} 
              isLoading={isLoading} 
            />
            <LeaveBalanceCard 
              title="Personal Leave" 
              used={1} 
              total={5} 
              isLoading={isLoading} 
            />
            <LeaveBalanceCard 
              title="Unpaid Leave" 
              used={0} 
              total={0} 
              unlimited
              isLoading={isLoading} 
            />
          </div>
        </motion.div>
      )}
    </MainLayout>
  );
};

interface LeaveBalanceCardProps {
  title: string;
  used: number;
  total: number;
  unlimited?: boolean;
  isLoading?: boolean;
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  title,
  used,
  total,
  unlimited = false,
  isLoading = false,
}) => {
  const percentage = unlimited ? 0 : (used / total) * 100;

  return (
    <GlassCard>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          <div className="h-8 bg-gray-100 rounded w-1/2"></div>
          <div className="h-2 bg-gray-100 rounded w-full"></div>
        </div>
      ) : (
        <>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
          <p className="text-2xl font-bold mb-4">
            {used} / {unlimited ? '∞' : total}
          </p>
          {!unlimited && (
            <>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {total - used} days remaining
              </p>
            </>
          )}
          {unlimited && (
            <p className="text-xs text-muted-foreground mt-2">
              Unlimited
            </p>
          )}
        </>
      )}
    </GlassCard>
  );
};

export default Leaves;
