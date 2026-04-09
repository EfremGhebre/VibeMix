import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Monitor, 
  Bell, 
  Sun,
  Moon,
  Laptop,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const {
    animationsEnabled,
    compactView,
    notifications,
    setAnimationsEnabled,
    setCompactView,
    setNotificationPreference,
  } = usePreferences();

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
            {t('settings.subtitle')}
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Appearance */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />{t('settings.appearance.title')}</CardTitle>
                <CardDescription>{t('settings.appearance.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="text-base font-medium mb-3 block">{t('settings.appearance.theme')}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 hover:border-primary/50 ${
                          theme === option.value ? 'border-primary bg-primary/10' : 'border-border bg-surface'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {theme === option.value && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-secondary" />{t('settings.language.title')}</CardTitle>
                <CardDescription>{t('settings.language.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="text-base font-medium mb-3 block">{t('settings.language.interface')}</Label>
                <div className="grid gap-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => changeLanguage(option.value as Language)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between hover:border-secondary/50 ${
                        currentLanguage === option.value ? 'border-secondary bg-secondary/10' : 'border-border bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.flag}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {currentLanguage === option.value && <Check className="h-4 w-4 text-secondary" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />{t('settings.notifications.title')}</CardTitle>
                <CardDescription>{t('settings.notifications.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.notifications.newMixes')}</Label>
                    <div className="text-sm text-muted-foreground">{t('settings.notifications.newMixesDesc')}</div>
                  </div>
                  <Switch
                    checked={notifications.newPlaylists}
                    onCheckedChange={(checked) => setNotificationPreference('newPlaylists', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.notifications.recommendations')}</Label>
                    <div className="text-sm text-muted-foreground">{t('settings.notifications.recommendationsDesc')}</div>
                  </div>
                  <Switch
                    checked={notifications.recommendations}
                    onCheckedChange={(checked) => setNotificationPreference('recommendations', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.notifications.updates')}</Label>
                    <div className="text-sm text-muted-foreground">{t('settings.notifications.updatesDesc')}</div>
                  </div>
                  <Switch
                    checked={notifications.updates}
                    onCheckedChange={(checked) => setNotificationPreference('updates', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Display */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5 text-secondary" />{t('settings.display.title')}</CardTitle>
                <CardDescription>{t('settings.display.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.display.animations')}</Label>
                    <div className="text-sm text-muted-foreground">{t('settings.display.animationsDesc')}</div>
                  </div>
                  <Switch
                    checked={animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.display.compactView')}</Label>
                    <div className="text-sm text-muted-foreground">{t('settings.display.compactViewDesc')}</div>
                  </div>
                  <Switch
                    checked={compactView}
                    onCheckedChange={setCompactView}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
