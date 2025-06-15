import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development bypass - set to true to skip authentication
const DEV_BYPASS_AUTH = true;

// Use a consistent UUID for development that matches our seeded data
const CONSISTENT_DEV_USER_ID = '00000000-0000-4000-8000-000000000001';

// Mock user and profile for development
const mockUser = {
  id: CONSISTENT_DEV_USER_ID,
  email: 'dev@example.com',
  created_at: new Date().toISOString(),
} as User;

const mockProfile: UserProfile = {
  id: 'dev-profile-123',
  user_id: CONSISTENT_DEV_USER_ID,
  role: 'coordinator',
  name: 'Development User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const ensureDevProfile = async () => {
    try {
      // Check if dev profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', CONSISTENT_DEV_USER_ID)
        .single();

      if (!existingProfile) {
        console.log('Creating dev profile...');
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: CONSISTENT_DEV_USER_ID,
            name: 'Development User',
            role: 'coordinator'
          });

        if (error) {
          console.error('Error creating dev profile:', error);
        } else {
          console.log('Dev profile created successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring dev profile:', error);
    }
  };

  useEffect(() => {
    // If development bypass is enabled, set mock data and skip Supabase auth
    if (DEV_BYPASS_AUTH) {
      console.log('DEV_BYPASS_AUTH enabled, using mock user:', CONSISTENT_DEV_USER_ID);
      setUser(mockUser);
      setProfile(mockProfile);
      
      // Ensure the dev profile exists in the database
      ensureDevProfile();
      
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const userProfile = await fetchProfile(session.user.id);
            setProfile(userProfile);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(userProfile => {
          setProfile(userProfile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Successfully signed in!');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name || email.split('@')[0]
        }
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to confirm your account!');
    }
    
    return { error };
  };

  const signOut = async () => {
    if (DEV_BYPASS_AUTH) {
      // In dev mode, just clear the mock data
      setUser(null);
      setProfile(null);
      toast.success('Successfully signed out!');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Successfully signed out!');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    if (DEV_BYPASS_AUTH) {
      // In dev mode, just update the mock profile
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully!');
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update profile');
      return { error };
    }

    // Refresh profile
    const updatedProfile = await fetchProfile(user.id);
    setProfile(updatedProfile);
    toast.success('Profile updated successfully!');
    
    return { error: null };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
