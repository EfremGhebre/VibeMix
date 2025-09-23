import { Moon, Sun, Globe, Radio, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { t, currentLanguage, changeLanguage, isRTL } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Radio className="h-8 w-8 text-primary animate-pulse-glow" />
          <h1 className="text-xl font-bold gradient-text">{t('app.name')}</h1>
        </div>

        <nav className={`hidden md:flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
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

        <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Auth Buttons */}
          <div className={`hidden md:flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
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
            <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
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
      </div>
    </header>
  );
}