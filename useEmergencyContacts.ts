import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  relationship: string | null;
}

interface UseEmergencyContactsReturn {
  contacts: EmergencyContact[];
  loading: boolean;
  error: string | null;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<boolean>;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useEmergencyContacts = (): UseEmergencyContactsReturn => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setContacts(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addContact = async (contact: Omit<EmergencyContact, 'id'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: insertError } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          relationship: contact.relationship,
        });

      if (insertError) throw insertError;
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contact');
      return false;
    }
  };

  const updateContact = async (id: string, contact: Partial<EmergencyContact>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: updateError } = await supabase
        .from('emergency_contacts')
        .update(contact)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      return false;
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      return false;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts,
  };
};
