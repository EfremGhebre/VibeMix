import { Moon, Sun, Globe, Radio, UserPlus, Menu, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import UserMenu from '@/components/auth/UserMenu';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { t, currentLanguage, changeLanguage, isRTL } = useLanguage();
  const { user, loading, signOut, signingOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [profileData, setProfileData] = useState<{ first_name?: string; last_name?: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', user.id)
        .single();
      if (data) setProfileData(data);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (searchParams.get('auth') !== 'login') return;
    if (!user) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
    }
    const next = new URLSearchParams(searchParams);
    next.delete('auth');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Radio className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse-glow" />
          <h1 className="text-lg sm:text-xl font-bold gradient-text">{t('app.name')}</h1>
        </Link>

        {/* Desktop Navigation - only show when logged in */}
        {user && (
          <nav className={`hidden lg:flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link to="/" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary inline-flex items-center justify-center">
              {t('nav.home')}
            </Link>
            <Link to="/discover" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary inline-flex items-center justify-center">
              {t('nav.discover')}
            </Link>
            <Link to="/playlists" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary inline-flex items-center justify-center">
              {t('nav.savedVibes')}
            </Link>
            <Link to="/settings" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary inline-flex items-center justify-center">
              {t('nav.settings')}
            </Link>
          </nav>
        )}

        {/* Desktop Controls */}
        <div className={`hidden lg:flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {user ? (
            <UserMenu />
          ) : (
            <Button variant="default" size="sm" className="text-sm" onClick={() => { setAuthModalTab('signup'); setAuthModalOpen(true); }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 hover:text-primary">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="z-50">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={currentLanguage === lang.code ? 'bg-accent text-accent-foreground' : ''}
                >
                  <span className={`mr-2 ${isRTL ? 'mr-0 ml-2' : ''}`}>{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="h-9 w-9 hover:text-primary">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user && (
            <Button variant="ghost" size="sm" onClick={signOut} disabled={signingOut} className="h-9 px-3 text-sm hover:text-primary">
              {signingOut ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />Signing out...</>
              ) : (
                <><LogOut className="mr-2 h-4 w-4" />{t('auth.signOut')}</>
              )}
            </Button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className={`flex lg:hidden items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="h-9 w-9 hover:text-primary">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? 'left' : 'right'} className="w-80 bg-background/95 backdrop-blur">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Language */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Language</h3>
                  <Select value={currentLanguage} onValueChange={changeLanguage}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue>
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{languages.find(l => l.code === currentLanguage)?.flag}</span>
                          {languages.find(l => l.code === currentLanguage)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background">
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center">
                            <span className="mr-3 text-lg">{lang.flag}</span>
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nav - only show when logged in */}
                {user && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Navigation</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/'); setIsOpen(false); }}>{t('nav.home')}</Button>
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/discover'); setIsOpen(false); }}>{t('nav.discover')}</Button>
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/playlists'); setIsOpen(false); }}>{t('nav.savedVibes')}</Button>
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/settings'); setIsOpen(false); }}>{t('nav.settings')}</Button>
                    </div>
                  </div>
                )}

                {/* Auth */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Account</h3>
                  {user ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => { navigate('/profile'); setIsOpen(false); }}
                        className="w-full flex items-center space-x-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{profileData?.first_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{profileData?.first_name && profileData?.last_name ? `${profileData.first_name} ${profileData.last_name}` : user.email?.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </button>
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { signOut(); setIsOpen(false); }} disabled={signingOut}>
                        {signingOut ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive mr-2" />Signing out...</>) : (<><LogOut className="mr-2 h-4 w-4" />{t('auth.signOut')}</>)}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="default" size="lg" className="h-12 w-full" onClick={() => { setAuthModalTab('signup'); setAuthModalOpen(true); setIsOpen(false); }}>
                      <UserPlus className="mr-2 h-4 w-4" />Get Started
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authModalTab} />
    </header>
  );
}
