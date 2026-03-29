import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PanicAudioButton: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.success('Panic audio recording started');

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = async () => {
    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve();
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        toast.success('Recording stopped');
        resolve();
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    });
  };

  const cancelRecording = async () => {
    await stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const sendPanicAudio = async () => {
    if (!user || !audioBlob) {
      toast.error('No audio recording found');
      return;
    }

    try {
      toast.loading('Sending panic audio alert...');

      const fileName = `panic_audio_${user.id}_${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('sos-recordings')
        .upload(`${user.id}/${fileName}`, audioBlob, {
          contentType: 'audio/webm',
        });

      if (uploadError) throw uploadError;

      // Create panic alert event
      const { error: insertError } = await supabase.from('alert_events').insert({
        user_id: user.id,
        status: 'active',
        alert_type: 'panic_audio',
        audio_recording_url: fileName,
      });

      if (insertError) throw insertError;

      toast.dismiss();
      toast.success('Panic audio alert sent!', {
        description: 'Your emergency contacts have been notified.',
      });

      setAudioBlob(null);
      setRecordingTime(0);
    } catch (err) {
      toast.error('Failed to send panic audio');
      console.error('Error:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 shadow-lg">
        {!isRecording && !audioBlob && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-white text-lg font-bold mb-4">Panic Audio Alert</h3>
            <p className="text-red-100 text-sm mb-6">
              Hold and record audio panic alert to send to emergency contacts
            </p>
            <Button
              onClick={startRecording}
              size="lg"
              className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          </motion.div>
        )}

        {isRecording && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mic className="w-8 h-8 text-red-600" />
            </motion.div>
            <p className="text-white text-sm font-semibold mb-2">Recording Audio</p>
            <p className="text-red-100 text-2xl font-mono mb-6">
              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
            </p>
            <Button
              onClick={stopRecording}
              size="lg"
              className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </Button>
          </motion.div>
        )}

        {audioBlob && !isRecording && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="bg-red-800 rounded-lg p-4 mb-4">
              <p className="text-white text-sm font-semibold">
                ✓ Recording Saved
              </p>
              <p className="text-red-100 text-sm">
                Duration: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={cancelRecording}
                variant="outline"
                size="lg"
                className="flex-1 border-white text-white hover:bg-white/10"
              >
                Delete
              </Button>
              <Button
                onClick={sendPanicAudio}
                size="lg"
                className="flex-1 bg-white text-red-600 hover:bg-gray-100 font-bold"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Alert
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PanicAudioButton;
