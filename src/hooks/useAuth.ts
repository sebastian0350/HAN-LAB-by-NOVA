import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2500);

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.warn('Supabase session check failed, continuing in local mode:', err);
      } finally {
        window.clearTimeout(timeoutId);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!supabase) throw new Error('Облачная синхронизация не настроена. Используйте локальный режим.');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Облачная синхронизация не настроена. Используйте локальный режим.');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signInWithMagicLink = async (email: string) => {
    if (!supabase) throw new Error('Облачная синхронизация не настроена. Используйте локальный режим.');
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    if (!supabase) throw new Error('Облачная синхронизация не настроена.');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  return {
    user,
    loading,
    isGuest: !user && !loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    resetPassword,
  };
}

