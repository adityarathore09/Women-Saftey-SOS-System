import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, Ambulance, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyService {
  name: string;
  number: string;
  icon: React.ElementType;
  color: string;
}

const emergencyServices: EmergencyService[] = [
  { name: 'Police', number: '911', icon: Shield, color: 'bg-blue-500' },
  { name: 'Ambulance', number: '911', icon: Ambulance, color: 'bg-emergency' },
  { name: 'Fire', number: '911', icon: Flame, color: 'bg-orange-500' },
];

const EmergencyQuickDial: React.FC = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-primary" />
        Emergency Services
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {emergencyServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.a
              key={service.name}
              href={`tel:${service.number}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className={`p-3 rounded-full ${service.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{service.name}</span>
                <span className="text-xs text-muted-foreground">{service.number}</span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyQuickDial;
