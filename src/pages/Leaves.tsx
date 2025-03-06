
import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { PlusCircle, Check, X, Calendar, CalendarPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { AuthContext } from '@/App';

interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface LeaveBalance {
  id: string;
  user_id: string;
  leave_type: string;
  total_days: number;
  used_days: number;
  year: number;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Leaves = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, userRole } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch leave requests
  const { data: leaveRequests, isLoading: isLoadingLeaves } = useQuery({
    queryKey: ['leaveRequests', userRole, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (userRole === 'employee') {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leave requests:', error);
        throw new Error('Failed to fetch leave requests');
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch leave balances for employee
  const { data: leaveBalances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['leaveBalances', user?.id],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', user?.id)
        .eq('year', currentYear);
      
      if (error) {
        console.error('Error fetching leave balances:', error);
        throw new Error('Failed to fetch leave balances');
      }
      
      return data || [];
    },
    enabled: !!user && userRole === 'employee',
  });

  // Update leave request status mutation
  const updateLeaveStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating leave request:', error);
        throw new Error('Failed to update leave request');
      }
      
      // If approved, update leave balance
      if (status === 'approved') {
        const leaveRequest = leaveRequests?.find(req => req.id === id);
        if (leaveRequest) {
          const startDate = new Date(leaveRequest.start_date);
          const endDate = new Date(leaveRequest.end_date);
          const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          // Update the used_days in leave_balances
          const { error: balanceError } = await supabase.rpc('increment_leave_used_days', {
            p_user_id: leaveRequest.user_id,
            p_leave_type: leaveRequest.leave_type,
            p_days: diffDays,
            p_year: new Date().getFullYear()
          });
          
          if (balanceError) {
            console.error('Error updating leave balance:', balanceError);
            // Continue anyway as the leave is already approved
          }
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      toast.success('Leave request updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update leave request');
      console.error('Mutation error:', error);
    }
  });

  const handleLeaveRequestSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
    setIsDialogOpen(false);
    toast.success('Leave request submitted successfully');
  };

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    updateLeaveStatus.mutate({ id, status });
  };

  // Function to format date from ISO to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800';
    }
  };

  return (
    <MainLayout userRole={userRole || 'employee'}>
      <DashboardHeader 
        title={userRole === 'admin' ? 'Leave Management' : 'My Leaves'} 
        subtitle={userRole === 'admin' 
          ? 'Manage employee leave requests' 
          : 'Request and manage your leaves'
        }
        userRole={userRole || 'employee'}
      />

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {userRole === 'admin' ? 'Leave Requests' : 'My Leave Requests'}
          </h2>
        </div>
        {userRole !== 'admin' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Request Leave</span>
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
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard>
          {isLoadingLeaves ? (
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
                    <th className="text-left py-3 px-4 font-medium">Reason</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    {userRole === 'admin' && (
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests && leaveRequests.length > 0 ? (
                    leaveRequests.map((leave: any) => (
                      <tr key={leave.id} className="border-b hover:bg-secondary/50 transition-colors">
                        {userRole === 'admin' && (
                          <td className="py-3 px-4">
                            {leave.profiles ? `${leave.profiles.first_name} ${leave.profiles.last_name}` : 'Unknown'}
                          </td>
                        )}
                        <td className="py-3 px-4 capitalize">{leave.leave_type.replace('_', ' ')}</td>
                        <td className="py-3 px-4">
                          {formatDate(leave.start_date)} to {formatDate(leave.end_date)}
                        </td>
                        <td className="py-3 px-4">{formatDate(leave.created_at)}</td>
                        <td className="py-3 px-4 max-w-[200px] truncate" title={leave.reason}>
                          {leave.reason}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline"
                            className={getStatusBadgeClass(leave.status)}
                          >
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </Badge>
                        </td>
                        {userRole === 'admin' && leave.status === 'pending' && (
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(leave.id, 'approved')}
                              disabled={updateLeaveStatus.isPending}
                            >
                              {updateLeaveStatus.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(leave.id, 'rejected')}
                              disabled={updateLeaveStatus.isPending}
                            >
                              {updateLeaveStatus.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              <span className="sr-only">Reject</span>
                            </Button>
                          </td>
                        )}
                        {userRole === 'admin' && leave.status !== 'pending' && (
                          <td className="py-3 px-4"></td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan={userRole === 'admin' ? 7 : 6} 
                        className="py-6 text-center text-muted-foreground"
                      >
                        No leave requests found
                      </td>
                    </tr>
                  )}
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
            {isLoadingBalances ? (
              Array(4).fill(0).map((_, index) => (
                <GlassCard key={index}>
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                  </div>
                </GlassCard>
              ))
            ) : leaveBalances && leaveBalances.length > 0 ? (
              leaveBalances.map((balance: LeaveBalance) => (
                <LeaveBalanceCard 
                  key={balance.id}
                  title={balance.leave_type.replace('_', ' ')} 
                  used={balance.used_days} 
                  total={balance.total_days} 
                  unlimited={balance.leave_type === 'unpaid'}
                  isLoading={false} 
                />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-6">
                No leave balance data available
              </div>
            )}
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
          <h3 className="text-sm font-medium text-muted-foreground mb-2 capitalize">{title}</h3>
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
