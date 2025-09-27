import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Calendar, Music, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: '',
    username: '',
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Remove console logs for production
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        // Set default values even if there's an error
        setProfileData({
          display_name: user.email?.split('@')[0] || '',
          username: user.email?.split('@')[0] || '',
          bio: '',
        });
        return;
      }

      if (data) {
        setProfileData({
          display_name: data.display_name || user.email?.split('@')[0] || '',
          username: data.username || user.email?.split('@')[0] || '',
          bio: data.bio || '',
        });
      } else {
        // No profile found, set default values
        setProfileData({
          display_name: user.email?.split('@')[0] || '',
          username: user.email?.split('@')[0] || '',
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
        display_name: user.email?.split('@')[0] || '',
        username: user.email?.split('@')[0] || '',
        bio: '',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateProfile(profileData);
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
    setIsLoading(false);
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
              <Button onClick={() => window.location.href = '/'}>
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                  <AvatarFallback className="text-2xl">
                    {profileData.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">
                {profileData.display_name || user.email?.split('@')[0]}
              </CardTitle>
              <CardDescription className="text-lg">
                @{profileData.username || user.email?.split('@')[0]}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={profileData.display_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Music Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Playlists</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/settings'}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={signOut}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
