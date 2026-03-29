import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FakeCallSimulatorProps {
  delay?: number; // Delay in seconds before call starts
}

const FakeCallSimulator: React.FC<FakeCallSimulatorProps> = ({ delay = 5 }) => {
  const [isScheduled, setIsScheduled] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const [countdown, setCountdown] = useState(delay);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isScheduled && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsScheduled(false);
            setIsRinging(true);
            return delay;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isScheduled, countdown, delay]);

  const scheduleCall = () => {
    setIsScheduled(true);
    setCountdown(delay);
  };

  const cancelScheduled = () => {
    setIsScheduled(false);
    setCountdown(delay);
  };

  const answerCall = () => {
    setIsRinging(false);
    setIsOnCall(true);
  };

  const endCall = () => {
    setIsRinging(false);
    setIsOnCall(false);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-primary" />
        Fake Call
      </h3>

      <AnimatePresence mode="wait">
        {isRinging ? (
          <motion.div
            key="ringing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-primary to-primary/90 flex flex-col items-center justify-center text-primary-foreground p-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-6"
            >
              <User className="w-12 h-12" />
            </motion.div>
            
            <h2 className="text-2xl font-semibold mb-1">Mom</h2>
            <p className="text-primary-foreground/70 mb-8">Incoming call...</p>

            <div className="flex gap-8">
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-emergency flex items-center justify-center"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <motion.button
                onClick={answerCall}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-safe flex items-center justify-center"
              >
                <Phone className="w-7 h-7" />
              </motion.button>
            </div>
          </motion.div>
        ) : isOnCall ? (
          <motion.div
            key="oncall"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-primary to-primary/90 flex flex-col items-center justify-center text-primary-foreground p-8"
          >
            <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-6">
              <User className="w-12 h-12" />
            </div>
            
            <h2 className="text-2xl font-semibold mb-1">Mom</h2>
            <p className="text-primary-foreground/70 mb-8">Call in progress</p>

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-emergency flex items-center justify-center"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </motion.div>
        ) : isScheduled ? (
          <motion.div
            key="scheduled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Phone className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Incoming call in
            </p>
            <p className="text-3xl font-bold mb-4">{countdown}s</p>
            <Button variant="outline" onClick={cancelScheduled}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm text-muted-foreground text-center mb-4">
              Schedule a fake incoming call to help you exit uncomfortable situations.
            </p>
            <Button variant="default" size="lg" onClick={scheduleCall} className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Schedule Fake Call ({delay}s)
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FakeCallSimulator;
