import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Language = "en" | "ar" | "sv";

export interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  en: {
    "app.name": "VibeMix",
    "app.tagline": "Turn your mood into a ready-to-play mix",
    "app.description":
      "VibeMix creates smart playlist recommendations based on how you feel and the languages you love, then lets you open them in your favorite music platform.",
    "hero.headline": "Turn your mood into a ready-to-play mix",
    "hero.description":
      "VibeMix creates smart playlist recommendations based on how you feel and the languages you love, then lets you open them in your favorite music platform.",
    "hero.cta": "Start your mix",
    "hero.learnMore": "Learn how it works",
    "nav.home": "Home",
    "nav.discover": "Discover",
    "nav.savedVibes": "Saved Vibes",
    "nav.settings": "Settings",
    "nav.myPlaylists": "Saved Vibes",
    "auth.login": "Login",
    "auth.signup": "Sign Up",
    "auth.welcome": "Welcome to VibeMix",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.displayName": "Display Name",
    "auth.username": "Username",
    "auth.confirmPassword": "Confirm Password",
    "auth.emailPlaceholder": "Enter your email",
    "auth.passwordPlaceholder": "Enter your password",
    "auth.displayNamePlaceholder": "Your display name",
    "auth.usernamePlaceholder": "Your username",
    "auth.confirmPasswordPlaceholder": "Confirm your password",
    "auth.signingIn": "Signing in...",
    "auth.creatingAccount": "Creating account...",
    "auth.passwordMismatch": "Passwords do not match",
    "auth.passwordTooShort": "Password must be at least 6 characters",
    "auth.profile": "Profile",
    "auth.myPlaylists": "Saved Vibes",
    "auth.settings": "Settings",
    "auth.signOut": "Sign Out",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "mood.happy": "Happy",
    "mood.chill": "Chill",
    "mood.focus": "Focus",
    "mood.sad": "Sad",
    "mood.energetic": "Energetic",
    "mood.romantic": "Romantic",
    "mood.confident": "Confident",
    "mood.mellow": "Mellow",
    "mood.party": "Party",
    "mood.rainy": "Rainy Day",
    "mood.select": "How are you feeling?",
    "genre.select": "Pick your genres",
    "language.select": "Choose your music language",
    "language.subtitle": "Mix languages or focus on one — discover music you love",
    "button.getStarted": "Get Started",
    "button.generateMix": "Generate My Mix",
    "button.generatePlaylist": "Generate My Mix",
    "discover.title": "Create Your Perfect Mix",
    "discover.subtitle":
      "Select your mood, choose your music languages, and let VibeMix craft a personalized playlist you can open in any platform.",
    "discover.creatingVibe": "Creating your mix...",
    "discover.creating": "Creating...",
    "discover.generate": "Generate",
    "discover.readyGenerate": "Ready to generate a",
    "discover.mixIn": "mix in",
    "discover.selectMoodTitle": "Please select a mood",
    "discover.selectMoodDesc": "Choose how you're feeling to generate your mix",
    "features.moodBased": "Mood-Based",
    "features.moodBasedDesc": "Select your current mood and get perfectly matched music recommendations instantly.",
    "features.multiGenre": "Multi-Genre",
    "features.multiGenreDesc": "Mix and match genres to create unique playlists that reflect your diverse taste.",
    "features.multiLanguage": "Multi-Language",
    "features.multiLanguageDesc":
      "Discover music in the languages you love — from English to Arabic, Swedish, Tigrinya, and more.",
    "features.platformFree": "Any Platform",
    "features.platformFreeDesc":
      "Open your mix in Spotify, Apple Music, or YouTube Music — no account connection needed.",
    "features.joinThousands": "Discover music for your mood and language.",
    "features.startToday": "Start your mix today!",
    "features.instantPlaylist": "Instant Mix Creation",
    "features.instantPlaylistDesc":
      "Generate perfectly curated playlists in seconds based on your mood and preferred languages.",
    "features.globalMusic": "Global Music Discovery",
    "features.globalMusicDesc":
      "Explore music from around the world in multiple languages. Discover your next favorite artist from any culture.",
    "howItWorks.title": "How It Works",
    "howItWorks.subtitle": "From mood to music in seconds",
    "howItWorks.step1": "Select Your Mood",
    "howItWorks.step1Desc": "Choose how you're feeling — happy, chill, focused, or any other mood.",
    "howItWorks.step2": "Choose Languages",
    "howItWorks.step2Desc": "Pick the music languages you want. English, Arabic, Swedish, Tigrinya, and more.",
    "howItWorks.step3": "Generate Your Mix",
    "howItWorks.step3Desc":
      "VibeMix creates a curated playlist of 10-20 songs that match your mood and language preferences.",
    "howItWorks.step4": "Listen Anywhere",
    "howItWorks.step4Desc":
      "Open your mix in Spotify, Apple Music, or YouTube Music with one tap. No connection required.",
  },
  ar: {
    "app.name": "VibeMix",
    "app.tagline": "حوّل مزاجك إلى مزيج جاهز للاستماع",
    "app.description":
      "VibeMix ينشئ توصيات ذكية لقوائم التشغيل بناءً على مشاعرك واللغات التي تحبها، ثم يتيح لك فتحها في منصة الموسيقى المفضلة لديك.",
    "hero.headline": "حوّل مزاجك إلى مزيج جاهز للاستماع",
    "hero.description":
      "VibeMix ينشئ توصيات ذكية لقوائم التشغيل بناءً على مشاعرك واللغات التي تحبها، ثم يتيح لك فتحها في منصة الموسيقى المفضلة لديك.",
    "hero.cta": "ابدأ مزيجك",
    "hero.learnMore": "تعرّف كيف يعمل",
    "nav.home": "الرئيسية",
    "nav.discover": "اكتشف",
    "nav.savedVibes": "المزيجات المحفوظة",
    "nav.settings": "الإعدادات",
    "nav.myPlaylists": "المزيجات المحفوظة",
    "auth.login": "تسجيل الدخول",
    "auth.signup": "إنشاء حساب",
    "auth.welcome": "مرحباً بك في VibeMix",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.displayName": "الاسم المعروض",
    "auth.username": "اسم المستخدم",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.emailPlaceholder": "أدخل بريدك الإلكتروني",
    "auth.passwordPlaceholder": "أدخل كلمة المرور",
    "auth.displayNamePlaceholder": "اسمك المعروض",
    "auth.usernamePlaceholder": "اسم المستخدم",
    "auth.confirmPasswordPlaceholder": "أكد كلمة المرور",
    "auth.signingIn": "جاري تسجيل الدخول...",
    "auth.creatingAccount": "جاري إنشاء الحساب...",
    "auth.passwordMismatch": "كلمات المرور غير متطابقة",
    "auth.passwordTooShort": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    "auth.profile": "الملف الشخصي",
    "auth.myPlaylists": "المزيجات المحفوظة",
    "auth.settings": "الإعدادات",
    "auth.signOut": "تسجيل الخروج",
    "theme.light": "فاتح",
    "theme.dark": "داكن",
    "theme.system": "النظام",
    "mood.happy": "سعيد",
    "mood.chill": "مسترخي",
    "mood.focus": "تركيز",
    "mood.sad": "حزين",
    "mood.energetic": "نشيط",
    "mood.romantic": "رومانسي",
    "mood.confident": "واثق",
    "mood.mellow": "هادئ",
    "mood.party": "حفلة",
    "mood.rainy": "يوم ممطر",
    "mood.select": "كيف تشعر؟",
    "genre.select": "اختر الأنواع الموسيقية",
    "language.select": "اختر لغة الموسيقى",
    "language.subtitle": "امزج اللغات أو ركز على واحدة — اكتشف الموسيقى التي تحبها",
    "button.getStarted": "ابدأ الآن",
    "button.generateMix": "أنشئ مزيجي",
    "button.generatePlaylist": "أنشئ مزيجي",
    "discover.title": "أنشئ مزيجك المثالي",
    "discover.subtitle": "اختر مزاجك، حدد لغات الموسيقى، ودع VibeMix ينشئ قائمة تشغيل مخصصة يمكنك فتحها في أي منصة.",
    "discover.creatingVibe": "إنشاء مزيجك...",
    "discover.creating": "إنشاء...",
    "discover.generate": "إنشاء",
    "discover.readyGenerate": "جاهز لإنشاء مزيج",
    "discover.mixIn": "بـ",
    "discover.selectMoodTitle": "اختر مزاجاً",
    "discover.selectMoodDesc": "اختر كيف تشعر لإنشاء مزيجك",
    "features.moodBased": "مبني على المزاج",
    "features.moodBasedDesc": "اختر مزاجك الحالي واحصل على توصيات موسيقية مناسبة فوراً.",
    "features.multiGenre": "متعدد الأنواع",
    "features.multiGenreDesc": "امزج وطابق من أنواع متعددة لإنشاء قوائم تشغيل فريدة.",
    "features.multiLanguage": "متعدد اللغات",
    "features.multiLanguageDesc":
      "اكتشف الموسيقى باللغات التي تحبها — من العربية إلى الإنجليزية والسويدية والتيغرينية والمزيد.",
    "features.platformFree": "أي منصة",
    "features.platformFreeDesc": "افتح مزيجك في Spotify أو Apple Music أو YouTube Music — بدون الحاجة لربط حساب.",
    "features.joinThousands": "اكتشف الموسيقى لمزاجك ولغتك.",
    "features.startToday": "ابدأ مزيجك اليوم!",
    "features.instantPlaylist": "إنشاء مزيج فوري",
    "features.instantPlaylistDesc": "أنشئ قوائم تشغيل منسقة في ثوانٍ بناءً على مزاجك ولغاتك المفضلة.",
    "features.globalMusic": "اكتشاف الموسيقى العالمية",
    "features.globalMusicDesc": "استكشف الموسيقى من جميع أنحاء العالم بلغات متعددة.",
    "howItWorks.title": "كيف يعمل",
    "howItWorks.subtitle": "من المزاج إلى الموسيقى في ثوانٍ",
    "howItWorks.step1": "اختر مزاجك",
    "howItWorks.step1Desc": "اختر كيف تشعر — سعيد، مسترخي، مركز، أو أي مزاج آخر.",
    "howItWorks.step2": "اختر اللغات",
    "howItWorks.step2Desc": "حدد لغات الموسيقى التي تريدها. عربي، إنجليزي، سويدي، تيغرينية والمزيد.",
    "howItWorks.step3": "أنشئ مزيجك",
    "howItWorks.step3Desc": "VibeMix ينشئ قائمة تشغيل منسقة من 10-20 أغنية تناسب مزاجك وتفضيلاتك اللغوية.",
    "howItWorks.step4": "استمع في أي مكان",
    "howItWorks.step4Desc": "افتح مزيجك في Spotify أو Apple Music أو YouTube Music بنقرة واحدة.",
  },
  sv: {
    "app.name": "VibeMix",
    "app.tagline": "Förvandla ditt humör till en spelklar mix",
    "app.description":
      "VibeMix skapar smarta spellisterekommendationer baserade på hur du mår och språken du älskar, och låter dig öppna dem i din favoritmusikplattform.",
    "hero.headline": "Förvandla ditt humör till en spelklar mix",
    "hero.description":
      "VibeMix skapar smarta spellisterekommendationer baserade på hur du mår och språken du älskar, och låter dig öppna dem i din favoritmusikplattform.",
    "hero.cta": "Starta din mix",
    "hero.learnMore": "Se hur det fungerar",
    "nav.home": "Hem",
    "nav.discover": "Upptäck",
    "nav.savedVibes": "Sparade mixar",
    "nav.settings": "Inställningar",
    "nav.myPlaylists": "Sparade mixar",
    "auth.login": "Logga in",
    "auth.signup": "Registrera",
    "auth.welcome": "Välkommen till VibeMix",
    "auth.email": "E-post",
    "auth.password": "Lösenord",
    "auth.displayName": "Visningsnamn",
    "auth.username": "Användarnamn",
    "auth.confirmPassword": "Bekräfta lösenord",
    "auth.emailPlaceholder": "Ange din e-post",
    "auth.passwordPlaceholder": "Ange ditt lösenord",
    "auth.displayNamePlaceholder": "Ditt visningsnamn",
    "auth.usernamePlaceholder": "Ditt användarnamn",
    "auth.confirmPasswordPlaceholder": "Bekräfta ditt lösenord",
    "auth.signingIn": "Loggar in...",
    "auth.creatingAccount": "Skapar konto...",
    "auth.passwordMismatch": "Lösenorden matchar inte",
    "auth.passwordTooShort": "Lösenordet måste vara minst 6 tecken",
    "auth.profile": "Profil",
    "auth.myPlaylists": "Sparade mixar",
    "auth.settings": "Inställningar",
    "auth.signOut": "Logga ut",
    "theme.light": "Ljus",
    "theme.dark": "Mörk",
    "theme.system": "System",
    "mood.happy": "Glad",
    "mood.chill": "Chill",
    "mood.focus": "Fokus",
    "mood.sad": "Ledsen",
    "mood.energetic": "Energisk",
    "mood.romantic": "Romantisk",
    "mood.confident": "Självsäker",
    "mood.mellow": "Lugn",
    "mood.party": "Fest",
    "mood.rainy": "Regnig dag",
    "mood.select": "Hur mår du?",
    "genre.select": "Välj genrer",
    "language.select": "Välj ditt musikspråk",
    "language.subtitle": "Blanda språk eller fokusera på ett — upptäck musik du älskar",
    "button.getStarted": "Kom igång",
    "button.generateMix": "Skapa min mix",
    "button.generatePlaylist": "Skapa min mix",
    "discover.title": "Skapa din perfekta mix",
    "discover.subtitle":
      "Välj ditt humör, välj musikspråk, och låt VibeMix skapa en personlig spellista du kan öppna i valfri plattform.",
    "discover.creatingVibe": "Skapar din mix...",
    "discover.creating": "Skapar...",
    "discover.generate": "Generera",
    "discover.readyGenerate": "Redo att skapa en",
    "discover.mixIn": "mix på",
    "discover.selectMoodTitle": "Välj ett humör",
    "discover.selectMoodDesc": "Välj hur du mår för att skapa din mix",
    "features.moodBased": "Humörbaserad",
    "features.moodBasedDesc": "Välj ditt humör och få perfekt matchade musikrekommendationer direkt.",
    "features.multiGenre": "Flera genrer",
    "features.multiGenreDesc": "Mixa genrer för att skapa unika spellistor som speglar din smak.",
    "features.multiLanguage": "Flerspråkig",
    "features.multiLanguageDesc": "Upptäck musik på språken du älskar — engelska, arabiska, svenska, tigrinja och mer.",
    "features.platformFree": "Valfri plattform",
    "features.platformFreeDesc":
      "Öppna din mix i Spotify, Apple Music eller YouTube Music — ingen kontokoppling behövs.",
    "features.joinThousands": "Upptäck musik för ditt humör och språk.",
    "features.startToday": "Starta din mix idag!",
    "features.instantPlaylist": "Omedelbar mixskapande",
    "features.instantPlaylistDesc":
      "Generera kuraterade spellistor på sekunder baserat på ditt humör och föredragna språk.",
    "features.globalMusic": "Global musikupptäckt",
    "features.globalMusicDesc": "Utforska musik från hela världen på flera språk.",
    "howItWorks.title": "Hur det fungerar",
    "howItWorks.subtitle": "Från humör till musik på sekunder",
    "howItWorks.step1": "Välj ditt humör",
    "howItWorks.step1Desc": "Välj hur du mår — glad, chill, fokuserad eller något annat.",
    "howItWorks.step2": "Välj språk",
    "howItWorks.step2Desc": "Välj vilka musikspråk du vill ha. Engelska, arabiska, svenska, tigrinja och mer.",
    "howItWorks.step3": "Generera din mix",
    "howItWorks.step3Desc":
      "VibeMix skapar en kuraterad spellista med 10-20 låtar som matchar ditt humör och språkpreferenser.",
    "howItWorks.step4": "Lyssna var som helst",
    "howItWorks.step4Desc": "Öppna din mix i Spotify, Apple Music eller YouTube Music med ett tryck.",
  },
};

const getInitialLanguage = (): Language => {
  const savedLanguage = localStorage.getItem("vibemix-language") as Language;
  if (savedLanguage && ["en", "ar", "sv"].includes(savedLanguage)) return savedLanguage;
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ar")) return "ar";
  if (browserLanguage.startsWith("sv")) return "sv";
  return "en";
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  }, [currentLanguage]);

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem("vibemix-language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[currentLanguage]?.[key] || translations["en"]?.[key] || key;
    },
    [currentLanguage],
  );

  const isRTL = currentLanguage === "ar";

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
