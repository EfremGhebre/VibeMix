import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'ar' | 'sv';

export interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// VibeMix Translations
const translations = {
  en: {
    'app.name': 'VibeMix',
    'app.tagline': 'Generate playlists that match your mood',
    'app.description': 'Discover music that perfectly captures how you feel. Select your mood, choose genres, and let VibeMix create the perfect soundtrack for your moment.',
  'nav.home': 'Home',
  'nav.discover': 'Discover',
  'nav.settings': 'Settings',
  'auth.login': 'Login',
  'auth.signup': 'Sign Up',
  'auth.welcome': 'Welcome to VibeMix',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.displayName': 'Display Name',
  'auth.username': 'Username',
  'auth.confirmPassword': 'Confirm Password',
  'auth.emailPlaceholder': 'Enter your email',
  'auth.passwordPlaceholder': 'Enter your password',
  'auth.displayNamePlaceholder': 'Your display name',
  'auth.usernamePlaceholder': 'Your username',
  'auth.confirmPasswordPlaceholder': 'Confirm your password',
  'auth.signingIn': 'Signing in...',
  'auth.creatingAccount': 'Creating account...',
  'auth.passwordMismatch': 'Passwords do not match',
  'auth.passwordTooShort': 'Password must be at least 6 characters',
  'auth.profile': 'Profile',
  'auth.myPlaylists': 'My Playlists',
  'auth.settings': 'Settings',
  'auth.signOut': 'Sign Out',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'mood.happy': 'Happy',
    'mood.chill': 'Chill', 
    'mood.focus': 'Focus',
    'mood.sad': 'Sad',
    'mood.energetic': 'Energetic',
    'mood.romantic': 'Romantic',
    'mood.confident': 'Confident',
    'mood.mellow': 'Mellow',
    'mood.party': 'Party',
    'mood.rainy': 'Rainy Day',
    'mood.select': 'How are you feeling?',
    'genre.select': 'Choose your genres',
    'language.select': 'Select music languages',
    'button.getStarted': 'Get Started',
    'button.generatePlaylist': 'Generate Playlist',
    'button.connectSpotify': 'Connect Spotify',
  },
  ar: {
    'app.name': 'VibeMix',
    'app.tagline': 'أنشئ قوائم تشغيل تناسب مزاجك',
    'app.description': 'اكتشف الموسيقى التي تعكس مشاعرك بشكل مثالي. اختر مزاجك، حدد الأنواع الموسيقية، ودع VibeMix ينشئ الموسيقى التصويرية المثالية للحظتك.',
  'nav.home': 'الرئيسية',
  'nav.discover': 'اكتشف',
  'nav.settings': 'الإعدادات',
  'auth.login': 'تسجيل الدخول',
  'auth.signup': 'إنشاء حساب',
  'auth.welcome': 'مرحباً بك في VibeMix',
  'auth.email': 'البريد الإلكتروني',
  'auth.password': 'كلمة المرور',
  'auth.displayName': 'الاسم المعروض',
  'auth.username': 'اسم المستخدم',
  'auth.confirmPassword': 'تأكيد كلمة المرور',
  'auth.emailPlaceholder': 'أدخل بريدك الإلكتروني',
  'auth.passwordPlaceholder': 'أدخل كلمة المرور',
  'auth.displayNamePlaceholder': 'اسمك المعروض',
  'auth.usernamePlaceholder': 'اسم المستخدم',
  'auth.confirmPasswordPlaceholder': 'أكد كلمة المرور',
  'auth.signingIn': 'جاري تسجيل الدخول...',
  'auth.creatingAccount': 'جاري إنشاء الحساب...',
  'auth.passwordMismatch': 'كلمات المرور غير متطابقة',
  'auth.passwordTooShort': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
  'auth.profile': 'الملف الشخصي',
  'auth.myPlaylists': 'قوائم التشغيل الخاصة بي',
  'auth.settings': 'الإعدادات',
  'auth.signOut': 'تسجيل الخروج',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
    'mood.happy': 'سعيد',
    'mood.chill': 'مسترخي',
    'mood.focus': 'تركيز',
    'mood.sad': 'حزين',
    'mood.energetic': 'نشيط',
    'mood.romantic': 'رومانسي',
    'mood.confident': 'واثق',
    'mood.mellow': 'هادئ',
    'mood.party': 'حفلة',
    'mood.rainy': 'يوم ممطر',
    'mood.select': 'كيف تشعر؟',
    'genre.select': 'اختر الأنواع الموسيقية',
    'language.select': 'اختر لغات الموسيقى',
    'button.getStarted': 'ابدأ الآن',
    'button.generatePlaylist': 'إنشاء قائمة التشغيل',
    'button.connectSpotify': 'ربط Spotify',
  },
  sv: {
    'app.name': 'VibeMix',
    'app.tagline': 'Generera spellistor som matchar ditt humör',
    'app.description': 'Upptäck musik som perfekt fångar hur du känner dig. Välj ditt humör, välj genrer och låt VibeMix skapa det perfekta soundtracket för ditt ögonblick.',
  'nav.home': 'Hem',
  'nav.discover': 'Upptäck',
  'nav.settings': 'Inställningar',
  'auth.login': 'Logga in',
  'auth.signup': 'Registrera',
  'auth.welcome': 'Välkommen till VibeMix',
  'auth.email': 'E-post',
  'auth.password': 'Lösenord',
  'auth.displayName': 'Visningsnamn',
  'auth.username': 'Användarnamn',
  'auth.confirmPassword': 'Bekräfta lösenord',
  'auth.emailPlaceholder': 'Ange din e-post',
  'auth.passwordPlaceholder': 'Ange ditt lösenord',
  'auth.displayNamePlaceholder': 'Ditt visningsnamn',
  'auth.usernamePlaceholder': 'Ditt användarnamn',
  'auth.confirmPasswordPlaceholder': 'Bekräfta ditt lösenord',
  'auth.signingIn': 'Loggar in...',
  'auth.creatingAccount': 'Skapar konto...',
  'auth.passwordMismatch': 'Lösenorden matchar inte',
  'auth.passwordTooShort': 'Lösenordet måste vara minst 6 tecken',
  'auth.profile': 'Profil',
  'auth.myPlaylists': 'Mina spellistor',
  'auth.settings': 'Inställningar',
  'auth.signOut': 'Logga ut',
    'theme.light': 'Ljus',
    'theme.dark': 'Mörk',
    'theme.system': 'System',
    'mood.happy': 'Glad',
    'mood.chill': 'Chill',
    'mood.focus': 'Fokus',
    'mood.sad': 'Ledsen',
    'mood.energetic': 'Energisk',
    'mood.romantic': 'Romantisk',
    'mood.confident': 'Självsäker',
    'mood.mellow': 'Lugn',
    'mood.party': 'Fest',
    'mood.rainy': 'Regnig dag',
    'mood.select': 'Hur mår du?',
    'genre.select': 'Välj dina genrer',
    'language.select': 'Välj musikspråk',
    'button.getStarted': 'Kom igång',
    'button.generatePlaylist': 'Skapa spellista',
    'button.connectSpotify': 'Anslut Spotify',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: string) => {
    return translations[currentLanguage]?.[key as keyof typeof translations['en']] || key;
  }, [currentLanguage]);

  const isRTL = currentLanguage === 'ar';

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    isRTL,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}