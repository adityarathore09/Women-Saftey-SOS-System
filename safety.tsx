import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Users, Phone, Eye, Clock } from 'lucide-react';

const tips = [
  {
    icon: Users,
    title: 'Share your journey',
    description: 'Let trusted contacts know your travel plans and expected arrival time.',
  },
  {
    icon: MapPin,
    title: 'Stay in well-lit areas',
    description: 'Avoid isolated or poorly lit streets, especially at night.',
  },
  {
    icon: Phone,
    title: 'Keep phone charged',
    description: 'Always have your phone charged and accessible for emergencies.',
  },
  {
    icon: Eye,
    title: 'Stay alert',
    description: 'Be aware of your surroundings and avoid distractions like headphones.',
  },
  {
    icon: Clock,
    title: 'Use check-in timer',
    description: 'Set a timer that alerts contacts if you don\'t check in on time.',
  },
  {
    icon: Shield,
    title: 'Trust your instincts',
    description: 'If something feels wrong, leave immediately and seek help.',
  },
];

const SafetyTips: React.FC = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Safety Tips
      </h3>
      
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{tip.title}</h4>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyTips;
