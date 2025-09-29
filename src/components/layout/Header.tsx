import { Moon, Sun, Globe, Radio, LogIn, UserPlus, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import UserMenu from '@/components/auth/UserMenu';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Radio className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse-glow" />
          <h1 className="text-lg sm:text-xl font-bold gradient-text">{t('app.name')}</h1>
        </Link>

        {/* Desktop Navigation - Only show when user is logged in */}
        {user && (
          <nav className={`hidden lg:flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link to="/" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-0 inline-flex items-center justify-center">
              {t('nav.home')}
            </Link>
            <Link to="/discover" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-0 inline-flex items-center justify-center">
              {t('nav.discover')}
            </Link>
            <Link to="/profile" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-0 inline-flex items-center justify-center">
              {t('nav.myPlaylists')}
            </Link>
            <Link to="/settings" className="h-9 px-3 rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-0 inline-flex items-center justify-center">
              {t('nav.settings')}
            </Link>
          </nav>
        )}

        {/* Desktop Controls */}
        <div className={`hidden lg:flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Auth Section */}
          {user ? (
            <UserMenu />
          ) : (
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm hover:text-primary transition-colors"
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {t('auth.login')}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="text-sm hover:text-primary transition-colors"
                onClick={() => {
                  setAuthModalTab('signup');
                  setAuthModalOpen(true);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('auth.signup')}
              </Button>
            </div>
          )}

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-primary transition-colors">
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

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-primary transition-colors"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Sign Out Button - Only show when logged in */}
          {user && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={signOut}
          disabled={signingOut}
          className="h-9 px-3 text-sm font-medium hover:text-primary hover:bg-transparent transition-colors inline-flex items-center justify-center disabled:opacity-50"
        >
          {signingOut ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.signOut')}
            </>
          )}
        </Button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className={`flex lg:hidden items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-primary transition-colors"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? 'left' : 'right'} className="w-80 bg-background/95 backdrop-blur">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Language Selector */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Language</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={currentLanguage === lang.code ? 'default' : 'ghost'}
                        className="justify-start h-12"
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsOpen(false);
                        }}
                      >
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Navigation - Only show when user is logged in */}
                {user && (
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Navigation</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/'); setIsOpen(false); }}>
                        {t('nav.home')}
                      </Button>
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/discover'); setIsOpen(false); }}>
                        {t('nav.discover')}
                      </Button>
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/profile'); setIsOpen(false); }}>
                        {t('nav.myPlaylists')}
                      </Button>
                      <Button variant="ghost" className="justify-start h-12" onClick={() => { navigate('/settings'); setIsOpen(false); }}>
                        {t('nav.settings')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Auth Section */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Account</h3>
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.user_metadata?.display_name || user.email?.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-12"
                        onClick={() => {
                          setAuthModalTab('login');
                          setAuthModalOpen(true);
                          setIsOpen(false);
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        {t('auth.login')}
                      </Button>
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="h-12"
                        onClick={() => {
                          setAuthModalTab('signup');
                          setAuthModalOpen(true);
                          setIsOpen(false);
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t('auth.signup')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />
    </header>
  );
}