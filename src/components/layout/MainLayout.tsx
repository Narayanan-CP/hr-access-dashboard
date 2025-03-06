
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  CalendarDays, 
  DollarSign, 
  ClipboardList, 
  MessageSquare, 
  Settings, 
  LogOut,
  Users
} from 'lucide-react';
import { AuthContext } from '@/App';

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'employee';
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  userRole = 'employee' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  if (!isMounted) {
    return null;
  }

  const adminMenuItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      title: 'Employees', 
      path: '/employees', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      title: 'Leave Management', 
      path: '/leaves', 
      icon: <CalendarDays className="h-5 w-5" /> 
    },
    { 
      title: 'Salary Management', 
      path: '/salaries', 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      title: 'Task Management', 
      path: '/tasks', 
      icon: <ClipboardList className="h-5 w-5" /> 
    },
    { 
      title: 'Complaints', 
      path: '/complaints', 
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  const employeeMenuItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      title: 'My Leaves', 
      path: '/leaves', 
      icon: <CalendarDays className="h-5 w-5" /> 
    },
    { 
      title: 'My Salary', 
      path: '/salaries', 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      title: 'My Tasks', 
      path: '/tasks', 
      icon: <ClipboardList className="h-5 w-5" /> 
    },
    { 
      title: 'Submit Complaint', 
      path: '/complaints', 
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      title: 'Profile Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          menuItems={userRole === 'admin' ? adminMenuItems : employeeMenuItems} 
          userRole={userRole} 
          onLogout={handleLogout} 
        />
        <div className="flex-1 flex flex-col">
          <div className="p-4 md:p-6 flex items-center justify-between">
            <SidebarTrigger className="lg:hidden" />
            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm font-medium">
                {userRole === 'admin' ? 'HR Admin' : 'Employee'}
              </div>
              <Button
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  menuItems: {
    title: string;
    path: string;
    icon: React.ReactNode;
  }[];
  userRole: 'admin' | 'employee';
  onLogout: () => void;
}

const AppSidebar = ({ menuItems, userRole, onLogout }: AppSidebarProps) => {
  const location = useLocation();
  
  return (
    <Sidebar>
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight">
          HR Access
        </h1>
        <p className="text-xs text-muted-foreground">
          {userRole === 'admin' ? 'Admin Panel' : 'Employee Portal'}
        </p>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    data-state={location.pathname === item.path ? "active" : "inactive"}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainLayout;
