import { Moon, Sun, Globe, Radio, LogIn, UserPlus, Menu, X } from 'lucide-react';
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
import { useState } from 'react';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { t, currentLanguage, changeLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Radio className="h-7 w-7 sm:h-8 sm:w-8 text-primary animate-pulse-glow" />
          <h1 className="text-lg sm:text-xl font-bold gradient-text">{t('app.name')}</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.home')}
          </a>
          <a href="/discover" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.discover')}
          </a>
          <a href="/settings" className="text-sm font-medium hover:text-primary transition-colors">
            {t('nav.settings')}
          </a>
        </nav>

        {/* Desktop Controls */}
        <div className={`hidden lg:flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Auth Buttons */}
          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button variant="ghost" size="sm" className="text-sm">
              <LogIn className="mr-2 h-4 w-4" />
              {t('auth.login')}
            </Button>
            <Button variant="default" size="sm" className="text-sm">
              <UserPlus className="mr-2 h-4 w-4" />
              {t('auth.signup')}
            </Button>
          </div>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="z-50 bg-background border border-border">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={currentLanguage === lang.code ? 'bg-primary/10' : ''}
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
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className={`flex lg:hidden items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9"
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

                {/* Navigation */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Navigation</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="ghost" className="justify-start h-12" onClick={() => { window.location.href = '/'; setIsOpen(false); }}>
                      {t('nav.home')}
                    </Button>
                    <Button variant="ghost" className="justify-start h-12" onClick={() => { window.location.href = '/discover'; setIsOpen(false); }}>
                      {t('nav.discover')}
                    </Button>
                    <Button variant="ghost" className="justify-start h-12" onClick={() => { window.location.href = '/settings'; setIsOpen(false); }}>
                      {t('nav.settings')}
                    </Button>
                  </div>
                </div>

                {/* Auth Buttons */}
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Account</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" size="lg" className="h-12">
                      <LogIn className="mr-2 h-4 w-4" />
                      {t('auth.login')}
                    </Button>
                    <Button variant="default" size="lg" className="h-12">
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t('auth.signup')}
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}