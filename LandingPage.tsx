import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, MapPin, Phone, Users, AlertTriangle, Clock, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: AlertTriangle,
    title: 'One-Tap SOS',
    description: 'Send emergency alerts with your location to all trusted contacts instantly.',
  },
  {
    icon: MapPin,
    title: 'Live Location Sharing',
    description: 'Share your real-time location with family and friends when you need them to know.',
  },
  {
    icon: Users,
    title: 'Trusted Contacts',
    description: 'Manage emergency contacts who will be notified during emergencies.',
  },
  {
    icon: Phone,
    title: 'Quick Emergency Dial',
    description: 'One-tap access to emergency services like police, ambulance, and fire department.',
  },
  {
    icon: Clock,
    title: 'Check-in Timer',
    description: 'Set a safety timer. If you don\'t check in, your contacts are automatically alerted.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your location is only shared when you choose to or during emergencies.',
  },
];

const safetyStats = [
  { value: '24/7', label: 'Always Available' },
  { value: '< 1s', label: 'Alert Speed' },
  { value: '100%', label: 'Private & Secure' },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container-wide mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">SafeGuard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container-narrow mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Your Safety, Our Priority
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Stay Safe with{' '}
              <span className="gradient-text">Instant Protection</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              One tap is all it takes. Share your location, alert your loved ones, 
              and get help when you need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center gap-8 sm:gap-16 mt-16"
          >
            {safetyStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Stay Safe
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful safety features designed with your privacy and security in mind.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container-narrow mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            <div className="relative z-10 text-center py-16 px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Your Safety Matters
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of women who trust SafeGuard to keep them and their loved ones connected.
              </p>
              <Link to="/signup">
                <Button variant="hero-outline" size="xl">
                  Start Protecting Yourself
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-primary-foreground/80">
                <span className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" /> Free to use
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" /> No credit card required
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" /> Privacy focused
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container-wide mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium">SafeGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SafeGuard. Your safety, our priority.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
