import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from '@/types/auth';
import { toast } from 'sonner';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const ensureProfile = async (userId: string, userEmail: string) => {
    console.log('Ensuring profile exists for user:', userId);
    
    try {
      // First try to fetch existing profile
      let existingProfile = await fetchProfile(userId);
      if (existingProfile) {
        console.log('Found existing profile:', existingProfile);
        return existingProfile;
      }

      // If no profile exists, create one with default volunteer role
      console.log('No profile found, creating default volunteer profile');
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: userEmail.split('@')[0],
          role: 'volunteer'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        // If profile creation fails, try to fetch again (might have been created by trigger)
        const fallbackProfile = await fetchProfile(userId);
        if (fallbackProfile) {
          console.log('Found profile via fallback:', fallbackProfile);
          return fallbackProfile;
        }
        throw error;
      }

      console.log('Created new profile:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Failed to ensure profile:', error);
      toast.error('Failed to set up user profile. Please try refreshing the page.');
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Add a small delay to prevent race conditions
          timeoutId = setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const userProfile = await ensureProfile(session.user.id, session.user.email || '');
              if (mounted) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Profile setup failed:', error);
              if (mounted) {
                setProfile(null);
              }
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          }, 200);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userProfile = await ensureProfile(session.user.id, session.user.email || '');
            if (mounted) {
              setProfile(userProfile);
            }
          } catch (error) {
            console.error('Initial profile setup failed:', error);
            if (mounted) {
              setProfile(null);
            }
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
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
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Successfully signed out!');
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    console.log('Updating profile for user:', user.id, updates);

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Profile update error:', error);
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
