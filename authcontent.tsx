import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { name?: string; phone?: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { name?: string; phone?: string }) => {
    try {
      console.log('Attempting sign up with email:', email);
      console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: metadata,
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', (error as any).status);
      } else {
        console.log('Sign up successful');
      }
      return { error };
    } catch (err) {
      console.error('Sign up exception:', err);
      console.error('Exception message:', (err as any).message);
      return { error: err instanceof Error ? err : new Error('An error occurred during sign up') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with email:', email);
      console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', (error as any).status);
      } else {
        console.log('Sign in successful');
      }
      return { error };
    } catch (err) {
      console.error('Sign in exception:', err);
      console.error('Exception message:', (err as any).message);
      return { error: err instanceof Error ? err : new Error('An error occurred during sign in') };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
