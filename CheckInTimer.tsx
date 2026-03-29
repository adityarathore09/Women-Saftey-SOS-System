import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const TIMER_OPTIONS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
];

const CheckInTimer: React.FC = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckIn = useCallback(() => {
    setShowWarning(false);
    setTimeRemaining(selectedMinutes * 60);
    toast.success('Checked in! Timer reset.');
  }, [selectedMinutes]);

  const startTimer = async () => {
    if (!user) {
      toast.error('Please sign in to use check-in timer');
      return;
    }

    setIsActive(true);
    setTimeRemaining(selectedMinutes * 60);
    
    // Save timer to database
    const expiresAt = new Date(Date.now() + selectedMinutes * 60 * 1000);
    await supabase.from('check_in_timers').insert({
      user_id: user.id,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    });

    toast.success(`Timer set for ${selectedMinutes} minutes`);
  };

  const stopTimer = async () => {
    setIsActive(false);
    setTimeRemaining(0);
    setShowWarning(false);

    if (user) {
      await supabase
        .from('check_in_timers')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);
    }

    toast.info('Timer cancelled');
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowWarning(true);
            return 0;
          }
          // Show warning at 1 minute remaining
          if (prev === 60) {
            toast.warning('1 minute remaining! Check in soon.');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const progress = isActive ? (timeRemaining / (selectedMinutes * 60)) * 100 : 100;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Check-in Timer
      </h3>

      <AnimatePresence mode="wait">
        {showWarning ? (
          <motion.div
            key="warning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-6"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emergency/10 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-10 h-10 text-emergency" />
            </div>
            <h4 className="text-lg font-semibold text-emergency mb-2">Time's Up!</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Please check in to confirm you're safe
            </p>
            <Button variant="safe" size="lg" onClick={handleCheckIn} className="w-full">
              <Check className="w-4 h-4 mr-2" />
              I'm Safe
            </Button>
          </motion.div>
        ) : isActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Timer display */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * progress) / 100}
                  className="text-safe transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="safe" size="lg" onClick={handleCheckIn}>
                <Check className="w-4 h-4 mr-2" />
                Check In
              </Button>
              <Button variant="outline" size="lg" onClick={stopTimer}>
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm text-muted-foreground text-center mb-4">
              Set a timer. If you don't check in, your contacts will be alerted.
            </p>

            {/* Duration options */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {TIMER_OPTIONS.map((option) => (
                <button
                  key={option.minutes}
                  onClick={() => setSelectedMinutes(option.minutes)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedMinutes === option.minutes
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button variant="default" size="lg" onClick={startTimer} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckInTimer;
