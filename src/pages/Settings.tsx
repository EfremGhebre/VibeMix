import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Volume2, 
  Monitor, 
  Bell, 
  User,
  Sun,
  Moon,
  Laptop,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [audioQuality, setAudioQuality] = useState('high');
  const [notifications, setNotifications] = useState({
    newPlaylists: true,
    recommendations: false,
    updates: true
  });

  const themeOptions = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Laptop }
  ];

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'sv', label: 'Svenska', flag: '🇸🇪' }
  ];

  const audioQualityOptions = [
    { value: 'low', label: 'Low (96kbps)', description: 'Saves data' },
    { value: 'medium', label: 'Medium (160kbps)', description: 'Balanced' },
    { value: 'high', label: 'High (320kbps)', description: 'Best quality' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface-elevated">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
              {t('nav.settings')}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Customize your VibeMix experience to match your preferences
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how VibeMix looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 hover:border-primary/50 ${
                            theme === option.value 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border bg-surface'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{option.label}</span>
                          {theme === option.value && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-secondary" />
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Select your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-base font-medium mb-3 block">Interface Language</Label>
                  <div className="grid gap-2">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => changeLanguage(option.value as Language)}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between hover:border-secondary/50 ${
                          currentLanguage === option.value 
                            ? 'border-secondary bg-secondary/10' 
                            : 'border-border bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.flag}</span>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {currentLanguage === option.value && (
                          <Check className="h-4 w-4 text-secondary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-accent" />
                  Audio Quality
                </CardTitle>
                <CardDescription>
                  Choose your preferred audio streaming quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {audioQualityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAudioQuality(option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:border-accent/50 ${
                        audioQuality === option.value 
                          ? 'border-accent bg-accent/10' 
                          : 'border-border bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                        {audioQuality === option.value && (
                          <Check className="h-5 w-5 text-accent" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Playlists</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified when new curated playlists are available
                    </div>
                  </div>
                  <Switch
                    checked={notifications.newPlaylists}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, newPlaylists: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Music Recommendations</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive personalized music suggestions
                    </div>
                  </div>
                  <Switch
                    checked={notifications.recommendations}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, recommendations: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">App Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Stay informed about new features and improvements
                    </div>
                  </div>
                  <Switch
                    checked={notifications.updates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, updates: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-secondary" />
                  Display Preferences
                </CardTitle>
                <CardDescription>
                  Customize how content is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Animations</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Compact View</Label>
                    <div className="text-sm text-muted-foreground">
                      Show more content in less space
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-play Previews</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically play song previews on hover
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Account
                </CardTitle>
                <CardDescription>
                  Manage your VibeMix account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/25">
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect your account to access personalized features
                    </p>
                    <Badge variant="secondary" className="mb-3">
                      Authentication Required
                    </Badge>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>• Save your favorite playlists</p>
                      <p>• Sync across devices</p>
                      <p>• Get personalized recommendations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}