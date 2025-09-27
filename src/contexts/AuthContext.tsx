import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
      (event, session) => {
        console.log('Auth state change:', event, !!session);
        
        // Handle all auth events properly
        if (event === 'SIGNED_OUT' || !session) {
          console.log('User signed out - clearing all state');
          setSession(null);
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session) {
          console.log('User signed in - setting session');
          setSession(session);
          setUser(session.user);
          setLoading(false);
          
          // Create user profile on sign in
          setTimeout(() => {
            createUserProfile(session.user);
          }, 0);
        } else {
          // Handle other events like TOKEN_REFRESHED
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
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
    
    // Prevent multiple calls
    if (signingOut) {
      console.log('Sign out already in progress, ignoring...');
      return;
    }
    
    setSigningOut(true);
    
    try {
      console.log('Calling Supabase signOut...');
      
      // Call Supabase signOut and wait for it
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('Supabase signOut successful - clearing state');
      
      // Clear local state immediately 
      setUser(null);
      setSession(null);
      
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      
      console.log('State cleared - sign out complete');
      
      // Don't redirect here - let the auth state change handle it
      
    } catch (error) {
      console.error('Sign out error:', error);
      
      toast({
        title: "Error", 
        description: "Error signing out",
        variant: "destructive",
      });
      
      // Force sign out anyway - clear everything
      setUser(null);
      setSession(null);
      
    } finally {
      setSigningOut(false);
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

      // Also update the user metadata to keep UI in sync
      if (updates.display_name || updates.avatar_url) {
        const metadataUpdates: { [key: string]: any } = {};
        if (updates.display_name) metadataUpdates.display_name = updates.display_name;
        if (updates.avatar_url) metadataUpdates.avatar_url = updates.avatar_url;

        const { error: metadataError } = await supabase.auth.updateUser({
          data: metadataUpdates
        });

        if (metadataError) {
          console.error('User metadata update error:', metadataError);
          // Don't fail the whole operation for metadata update errors
        }
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
      {signingOut ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center space-y-4 p-8 bg-background/95 rounded-lg border shadow-lg animate-scale-in">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm font-medium text-muted-foreground">
              Signing you out...
            </p>
          </div>
        </div>
      ) : null}
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
