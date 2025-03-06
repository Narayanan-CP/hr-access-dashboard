
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui-custom/GlassCard';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background to-secondary/30">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              HR Access Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A modern platform for managing your company's human resources
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/login')} 
              className="mr-4"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
            >
              <a href="#features">Learn More</a>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-5xl mx-auto relative"
          >
            <GlassCard className="p-0 overflow-hidden border border-primary/10">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="HR Dashboard Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">Powerful HR Management</h3>
                  <p className="text-muted-foreground max-w-md">
                    Streamline your HR processes with our intuitive dashboard
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div 
            id="features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            <FeatureCard 
              title="Leave Management" 
              description="Easily manage employee leave requests and approvals" 
              index={0}
            />
            <FeatureCard 
              title="Salary Management" 
              description="Efficiently handle payroll and salary information" 
              index={1}
            />
            <FeatureCard 
              title="Task Management" 
              description="Assign and track employee tasks and progress" 
              index={2}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-20"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
            >
              Sign In Now
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, index }: { title: string, description: string, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
    >
      <GlassCard hover>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </GlassCard>
    </motion.div>
  );
};

export default Index;
