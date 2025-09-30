import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PlaylistList from '@/components/playlist/PlaylistList';
import { useNavigate } from 'react-router-dom';
import { profileSchema, type ProfileFormData } from '@/lib/validations';

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch profile data from database
  const fetchProfile = async () => {
    if (!user) {
      console.log('No user found, skipping profile fetch');
      return;
    }
    
    try {
      console.log('Fetching profile for user:', user.id);
      setProfileLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        // Set default values even if there's an error
        setProfileData({
          first_name: user.email?.split('@')[0] || '',
          last_name: '',
          bio: '',
        });
        return;
      }

      if (data) {
        console.log('Profile data found:', data);
        setProfileData({
          first_name: data.first_name || user.email?.split('@')[0] || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
        });
      } else {
        console.log('No profile found, using defaults');
        setProfileData({
          first_name: user.email?.split('@')[0] || '',
          last_name: '',
          bio: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
      // Set default values on error
      setProfileData({
        first_name: user.email?.split('@')[0] || '',
        last_name: '',
        bio: '',
      });
    } finally {
      console.log('Profile fetch complete, setting loading false');
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    console.log('Profile useEffect triggered, user:', user);
    if (user) {
      fetchProfile();
    } else {
      console.log('No user, resetting profile loading');
      setProfileLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    console.log('Attempting to save profile data:', profileData);
    setIsLoading(true);
    
    try {
      // Validate profile data with Zod
      const validatedData = profileSchema.parse(profileData);
      
      const result = await updateProfile(validatedData);
      console.log('Update result:', result);
      
      if (result.success) {
        setIsEditing(false);
        // Refresh profile data to show the updated information
        await fetchProfile();
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to update profile',
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        // Zod validation error
        const zodError = error as any;
        const firstError = zodError.issues[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        console.error('Error in handleSave:', error);
        toast({
          title: "Error",
          description: 'Failed to update profile',
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Please log in</h2>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to view your profile.
              </p>
              <Button onClick={() => navigate('/')}>
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Playlists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Playlists</CardTitle>
              <CardDescription>
                Discover and manage your personalized music collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlaylistList limit={6} showCreateButton={true} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
