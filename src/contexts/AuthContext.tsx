'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  state?: string;
  bio?: string;
  account_type: 'buyer' | 'seller' | 'agent' | 'admin';
  avatar_url?: string;
  is_admin: boolean;
  is_verified: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    // The server route applies validation/rate limits; a database trigger
    // creates the profile without exposing privileged credentials.
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        first_name: metadata?.first_name || '',
        last_name: metadata?.last_name || '',
        phone: metadata?.phone || null,
        state: metadata?.state || null,
        account_type: metadata?.account_type || 'buyer',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    if (data.requires_email_confirmation) {
      return { user: data.user, session: null, requiresEmailConfirmation: true, accountCreated: true };
    }

    // When confirmation is disabled, complete the login immediately. If the
    // second request fails, preserve the fact that registration succeeded so
    // the UI can ask the user to sign in instead of creating a duplicate.
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      console.error('Account created, but automatic sign-in failed:', signInError.message);
      return { user: data.user, session: null, requiresEmailConfirmation: false, accountCreated: true };
    }

    return { ...data, session: signInData.session, requiresEmailConfirmation: false, accountCreated: true };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Login must not fail merely because profile activity metadata is
    // temporarily unavailable. The migration adds these columns.
    if (data.user) {
      const { error: activityError } = await supabase
        .from('profiles')
        .update({
          last_login_at: new Date().toISOString(),
          email_verified_at: data.user.email_confirmed_at || null,
        })
        .eq('id', data.user.id);
      if (activityError) console.warn('Could not update login activity:', activityError.message);
    }

    return data;
  };

  const signOut = async () => {
    try {
      // Local sign-out clears this browser even if the global revocation
      // endpoint is unavailable. Other devices keep their own sessions.
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) console.error('Sign-out cleanup failed:', error.message);
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const resetPassword = async (email: string) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send reset instructions.');
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
