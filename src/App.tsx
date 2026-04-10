import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PreferencesProvider, usePreferences } from "@/contexts/PreferencesContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot, { ChatbotToggle } from "@/components/chat/Chatbot";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import MyPlaylists from "./pages/MyPlaylists";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const AppContent = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { animationsEnabled } = usePreferences();

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
      <>
        <div className="min-h-screen bg-background flex flex-col animate-fade-in">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index onOpenChat={() => setChatOpen(true)} />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/playlists" element={<MyPlaylists />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<Help />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ChatbotToggle isOpen={chatOpen} onToggle={() => setChatOpen((prev) => !prev)} />
        <Chatbot isOpen={chatOpen} onToggle={() => setChatOpen(false)} />
      </>
    </MotionConfig>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <PreferencesProvider>
          <BrowserRouter>
            <AuthProvider>
              <AuthWrapper>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                  <Analytics />
                </TooltipProvider>
              </AuthWrapper>
            </AuthProvider>
          </BrowserRouter>
        </PreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
