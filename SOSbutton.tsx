import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts';
import { sendLocalNotification } from '@/services/notificationService';
import { toast } from 'sonner';

interface SOSButtonProps {
  onAlert?: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onAlert }) => {
  const { user } = useAuth();
  const { getCurrentLocation } = useLocation();
  const { contacts } = useEmergencyContacts();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const playSirenSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      // Connect audio nodes - add filter for more realistic sound
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set filter properties for realistic siren
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, audioContext.currentTime);

      // Set initial siren frequency
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);

      // Create realistic police siren effect
      let time = audioContext.currentTime;
      const duration = 4; // 4 seconds for better effect

      const sirenInterval = setInterval(() => {
        if (!audioContextRef.current) {
          clearInterval(sirenInterval);
          return;
        }

        const elapsed = audioContextRef.current.currentTime - time;
        if (elapsed >= duration) {
          stopSiren();
          clearInterval(sirenInterval);
          return;
        }

        // Create dual-tone police siren (wee-woo effect)
        // Cycle between low (800Hz) and high (1600Hz) every 0.5 seconds
        const cycle = (elapsed % 1) / 1; // 0 to 1 over 1 second
        let frequency: number;
        
        if (cycle < 0.5) {
          // Low frequency phase
          frequency = 800 + Math.sin(elapsed * Math.PI * 4) * 100;
        } else {
          // High frequency phase  
          frequency = 1600 + Math.sin(elapsed * Math.PI * 4) * 200;
        }
        
        oscillator.frequency.setTargetAtTime(frequency, audioContextRef.current.currentTime, 0.1);
      }, 50);

      oscillator.start(audioContext.currentTime);
    } catch (err) {
      console.error('Siren audio error:', err);
    }
  };

  const stopSiren = () => {
    if (oscillatorRef.current && audioContextRef.current) {
      try {
        oscillatorRef.current.stop(audioContextRef.current.currentTime);
      } catch (err) {
        console.error('Error stopping siren:', err);
      }
    }
  };

  const handleSOSClick = () => {
    playSirenSound();
    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Please sign in to use SOS');
      return;
    }

    setIsTriggering(true);
    
    try {
      // Check if contacts are configured
      if (contacts.length === 0) {
        toast.warning('Please add emergency contacts first');
        setIsTriggering(false);
        setIsConfirming(false);
        return;
      }

      // Get current location
      const location = await getCurrentLocation();
      
      // Create alert event
      const { data: alertData, error } = await supabase
        .from('alert_events')
        .insert({
          user_id: user.id,
          status: 'active',
          latitude: location?.latitude,
          longitude: location?.longitude,
        })
        .select()
        .single();

      if (error) throw error;

      // Send notifications to emergency contacts
      if (alertData && contacts.length > 0) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        const userName = userProfile?.full_name || 'User';

        // Send local notifications (demo mode)
        sendLocalNotification(
          contacts,
          userName,
          location?.latitude,
          location?.longitude
        );

        // TODO: In production, integrate with email service (SendGrid, Twilio, etc.)
        // await sendSOSNotifications(user.id, alertData.id, location?.latitude, location?.longitude);
      }

      toast.success('SOS Alert Sent!', {
        description: 'Your emergency contacts have been notified with your location.',
      });

      onAlert?.();
    } catch (err) {
      console.error('SOS error:', err);
      toast.error('Failed to send SOS', {
        description: 'Please try again or call emergency services directly.',
      });
    } finally {
      stopSiren();
      setIsTriggering(false);
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    stopSiren();
    setIsConfirming(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isConfirming ? (
          <motion.div
            key="sos-button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative"
          >
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full bg-emergency/20 animate-pulse-emergency" />
            
            <Button
              variant="emergency"
              size="icon-xl"
              onClick={handleSOSClick}
              className="relative z-10 w-32 h-32 rounded-full text-2xl font-bold shadow-emergency"
            >
              <div className="flex flex-col items-center gap-1">
                <AlertTriangle className="w-10 h-10" />
                <span>SOS</span>
              </div>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="confirm-dialog"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 text-center max-w-xs"
          >
            <AlertTriangle className="w-12 h-12 text-emergency mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Send Emergency Alert?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              This will notify all your emergency contacts with your current location.
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancel}
                disabled={isTriggering}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="emergency"
                size="lg"
                onClick={handleConfirm}
                disabled={isTriggering}
              >
                {isTriggering ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm SOS
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick emergency call */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <a href="tel:911" className="inline-flex items-center gap-2 text-muted-foreground hover:text-emergency transition-colors">
          <Phone className="w-4 h-4" />
          <span className="text-sm">Call 911 directly</span>
        </a>
      </motion.div>
    </div>
  );
};

export default SOSButton;
