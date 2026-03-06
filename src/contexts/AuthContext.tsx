import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, AdminUser } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  adminProfile: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, terminalName: string, role: 'master' | 'guardian') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const isBypassed = localStorage.getItem('fate_sealer_accepted') === 'true' ||
                       localStorage.getItem('admin_mode') === 'true';

    if (isBypassed) {
      setLoading(false);
      console.log('Auth bypass active - Technomancer mode enabled');
      return () => {
        mounted = false;
      };
    }

    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth check timed out, setting loading to false');
        setLoading(false);
      }
    }, 3000);

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        clearTimeout(timeout);

        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          await loadAdminProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        if (!mounted) return;
        clearTimeout(timeout);
        console.error('Error getting session:', error);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadAdminProfile(session.user.id);
        } else {
          setAdminProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setAdminProfile(data);
    } catch (error) {
      console.error('Error loading admin profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };

      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', email);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, terminalName: string, role: 'master' | 'guardian') => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) return { error: authError };
      if (!authData.user) return { error: new Error('Failed to create user') };

      const { error: profileError } = await supabase
        .from('admin_users')
        .insert({
          id: authData.user.id,
          email,
          terminal_name: terminalName,
          role,
        });

      if (profileError) return { error: profileError };

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, loading, signIn, signUp, signOut }}>
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
