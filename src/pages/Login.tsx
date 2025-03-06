
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import GlassCard from '@/components/ui-custom/GlassCard';

const Login = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'admin' | 'employee'>('employee');

  const handleLoginSuccess = (role: 'admin' | 'employee') => {
    setUserRole(role);
    // In a real app, you would store user info in context/state/localStorage
    localStorage.setItem('userRole', role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-4 py-8 relative z-10">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your dashboard
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <GlassCard>
              <LoginForm onSuccess={handleLoginSuccess} />
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
