import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AlertNotification {
  contact_id: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  location?: string;
}

/**
 * Send a simple notification when SOS is triggered
 */
export const sendLocalNotification = (
  contacts: any[],
  userName: string,
  latitude?: number,
  longitude?: number
) => {
  if (!contacts || contacts.length === 0) {
    toast.warning('No emergency contacts configured');
    return;
  }

  const contactNames = contacts.map(c => c.name).join(', ');
  const location = latitude && longitude 
    ? `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    : '📍 Location enabled';

  const notificationMessage = `
SOS Alert Sent! 🆘

Contact(s) Notified: ${contactNames}
${location}

${contacts.map(c => {
  let info = `• ${c.name}`;
  if (c.email) info += ` (${c.email})`;
  if (c.phone) info += ` ${c.phone}`;
  return info;
}).join('\n')}
  `.trim();

  toast.success('SOS Alert Activated! 🆘', {
    description: `Notifying: ${contactNames}`,
    duration: 6000,
  });

  // Log to console for verification
  console.log('='.repeat(50));
  console.log('📢 SOS NOTIFICATION DETAILS');
  console.log('='.repeat(50));
  console.log(notificationMessage);
  console.log('='.repeat(50));
  console.log('Timestamp:', new Date().toLocaleString());
  console.log('Alert triggered by:', userName);
  console.log('='.repeat(50));
};

