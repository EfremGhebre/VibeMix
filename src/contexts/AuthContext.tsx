import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signingOut: boolean;
  signUp: (email: string, password: string, userData?: { display_name?: string; username?: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: { display_name?: string; username?: string; bio?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (event === 'SIGNED_OUT' || !session) {
          // Force clear everything on sign out
          setSession(null);
          setUser(null);
          setLoading(false);
          console.log('User signed out, cleared state');
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Create user profile on sign up
          if (event === 'SIGNED_IN' && session?.user) {
            await createUserProfile(session.user);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
          username: user.user_metadata?.username || user.email?.split('@')[0],
        });

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: { display_name?: string; username?: string }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('=== SIGN OUT STARTED ===');
    
    try {
      console.log('Calling Supabase signOut...');
      
      // Call Supabase signOut and wait for it
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('Supabase signOut successful');
      
      // Clear local state immediately after successful signOut
      setUser(null);
      setSession(null);
      
      // Show success message
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      
      console.log('Redirecting to home...');
      
      // Redirect after a brief moment to show the toast
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Show error message
      toast({
        title: "Error", 
        description: "Error signing out",
        variant: "destructive",
      });
      
      // Force sign out anyway
      setUser(null);
      setSession(null);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Success",
        description: "Password reset email sent!",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { display_name?: string; username?: string; bio?: string; avatar_url?: string }) => {
    try {
      if (!user) {
        console.error('No user logged in for profile update');
        return { success: false, error: 'No user logged in' };
      }

      console.log('Updating profile for user:', user.id, 'with data:', updates);

      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Existing profile check:', { existingProfile, fetchError });

      let result;
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile');
        result = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id);
      } else {
        // Insert new profile
        console.log('Creating new profile');
        result = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            ...updates
          });
      }

      console.log('Profile operation result:', result);

      if (result.error) {
        console.error('Profile update/insert error:', result.error);
        return { success: false, error: result.error.message };
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Profile update catch error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signingOut,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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
