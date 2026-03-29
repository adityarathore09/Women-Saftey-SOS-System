import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLocation } from '@/hooks/useLocation';
import { toast } from 'sonner';

const LocationTracker: React.FC = () => {
  const { location, error, isTracking, startTracking, stopTracking, getCurrentLocation } = useLocation();

  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
      toast.info('Location tracking stopped');
    } else {
      startTracking();
      toast.success('Location tracking started');
    }
  };

  const handleShareLocation = async () => {
    if (!location) {
      const loc = await getCurrentLocation();
      if (!loc) {
        toast.error('Unable to get your location');
        return;
      }
    }

    const shareUrl = `https://www.google.com/maps?q=${location?.latitude},${location?.longitude}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location',
          text: 'Here is my current location',
          url: shareUrl,
        });
        toast.success('Location shared!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share location');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Location link copied to clipboard!');
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Live Location
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isTracking ? 'Tracking' : 'Off'}
          </span>
          <Switch
            checked={isTracking}
            onCheckedChange={handleToggleTracking}
          />
        </div>
      </div>

      {/* Location Display */}
      <div className="bg-muted/50 rounded-xl p-4 mb-4">
        {error ? (
          <div className="text-center text-muted-foreground py-4">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => getCurrentLocation()}>
              Retry
            </Button>
          </div>
        ) : location ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {isTracking && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-safe"></span>
                </span>
              )}
              <span className="text-sm font-medium text-safe">
                {isTracking ? 'Actively Tracking' : 'Location Found'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
            {location.accuracy && (
              <p className="text-xs text-muted-foreground mt-1">
                Accuracy: ±{Math.round(location.accuracy)}m
              </p>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Getting location...</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => getCurrentLocation()}
          className="flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Update
        </Button>
        <Button
          variant="safe"
          size="lg"
          onClick={handleShareLocation}
          disabled={!location}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Privacy Notice */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Your location is only shared when you choose to share it or trigger an SOS alert.
      </p>
    </div>
  );
};

export default LocationTracker;
