import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Bot, 
  User, 
  X, 
  Maximize2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FlowOption = {
  id: string;
  label: string;
  next?: string;
};

type FlowNode = {
  id: string;
  title: string;
  prompt: string;
  options: FlowOption[];
};

const SUPPORT_FLOW: Record<string, FlowNode> = {
  root: {
    id: 'root',
    title: '🎵 Welcome to VibeMix!',
    prompt: "I'm your AI music assistant. How can I help you today?",
    options: [
      { id: 'how_it_works', label: 'How does VibeMix work?', next: 'how_it_works' },
      { id: 'generate', label: 'Help me generate a mix', next: 'generate' },
      { id: 'languages', label: 'Music language options', next: 'languages' },
      { id: 'platforms', label: 'Supported platforms', next: 'platforms' },
      { id: 'account', label: 'Account & Settings', next: 'account' },
      { id: 'troubleshoot', label: 'Troubleshooting', next: 'troubleshoot' },
    ],
  },
  how_it_works: {
    id: 'how_it_works',
    title: 'How VibeMix Works',
    prompt: 'VibeMix generates personalized playlists based on your mood and music language preferences.\n\n1️⃣ Pick your mood (Happy, Chill, Focus, etc.)\n2️⃣ Choose your music language(s)\n3️⃣ Optionally adjust genre filters\n4️⃣ Tap "Generate Mix"\n\nYou\'ll get a curated playlist you can open in Spotify, Apple Music, or YouTube Music. No streaming inside the app — we send you straight to your favorite platform!',
    options: [
      { id: 'try_now', label: 'Take me to Discover' },
      { id: 'more_q', label: 'I have more questions', next: 'root' },
    ],
  },
  generate: {
    id: 'generate',
    title: 'Generate a Mix',
    prompt: 'To create your perfect playlist:\n\n🎭 Go to the Discover page\n🎵 Select a mood that matches how you feel\n🌍 Pick one or more music languages\n🎸 Optionally filter by genre\n⚡ Tap "Generate Mix"\n\nYour playlist will appear with song titles and artists. Tap any platform button to start listening!',
    options: [
      { id: 'open_discover', label: 'Open Discover' },
      { id: 'mood_help', label: 'Which mood should I pick?', next: 'mood_help' },
    ],
  },
  mood_help: {
    id: 'mood_help',
    title: 'Choosing Your Mood',
    prompt: "Here's a quick guide:\n\n😊 Happy — Upbeat, feel-good tracks\n😌 Chill — Relaxed, laid-back vibes\n😢 Sad — Emotional, reflective songs\n🎯 Focus — Concentration-friendly beats\n💪 Workout — High-energy bangers\n🎉 Party — Dance floor hits\n💕 Romantic — Love songs & ballads\n🌙 Night Drive — Smooth cruising tunes\n☀️ Sunday Calm — Peaceful, easy listening\n🔥 Motivational — Pump-up anthems\n\nJust pick the one that feels right!",
    options: [
      { id: 'open_discover2', label: 'Open Discover' },
    ],
  },
  languages: {
    id: 'languages',
    title: 'Music Languages',
    prompt: "VibeMix lets you discover music in the languages you love. Currently supported:\n\n🇺🇸 English\n🇸🇦 Arabic\n🇸🇪 Swedish\n🇪🇷 Tigrinya\n🇪🇸 Spanish\n🇫🇷 French\n🇮🇳 Hindi\n\nYou can select multiple languages to get a blended mix, or pick just one to stay focused. If you skip language selection, you'll get a global mix!",
    options: [
      { id: 'set_lang', label: 'Set my preferences', next: 'lang_settings' },
    ],
  },
  lang_settings: {
    id: 'lang_settings',
    title: 'Language Preferences',
    prompt: 'You can set your preferred languages in two places:\n\n1. On the Discover page — select languages before generating\n2. In Settings — save default language preferences\n\nYour choices will be remembered for future mixes!',
    options: [
      { id: 'open_settings', label: 'Open Settings' },
    ],
  },
  platforms: {
    id: 'platforms',
    title: 'Supported Platforms',
    prompt: "VibeMix works with all major music platforms:\n\n🟢 Spotify — Opens search for each track\n🍎 Apple Music — Opens search for each track\n🔴 YouTube Music — Opens search for each track\n\nNo account linking required! We generate smart search links that take you directly to each song on your chosen platform.",
    options: [
      { id: 'more_q2', label: 'I have more questions', next: 'root' },
    ],
  },
  account: {
    id: 'account',
    title: 'Account & Settings',
    prompt: 'What do you need help with?',
    options: [
      { id: 'profile', label: 'Update my profile', next: 'account_profile' },
      { id: 'saved', label: 'View saved vibes', next: 'saved_vibes' },
      { id: 'theme', label: 'Change theme or language', next: 'theme_lang' },
    ],
  },
  account_profile: {
    id: 'account_profile',
    title: 'Update Profile',
    prompt: 'Go to your Profile page to update your name, bio, and avatar. You can access it from the user menu in the top right corner.',
    options: [
      { id: 'open_profile', label: 'Open Profile' },
    ],
  },
  saved_vibes: {
    id: 'saved_vibes',
    title: 'Saved Vibes',
    prompt: "Your saved vibes are playlists you've generated and saved for later. Find them in the Saved Vibes page. You can:\n\n💾 Re-open any saved mix\n🔄 Regenerate with same settings\n🎵 Open tracks in any platform",
    options: [
      { id: 'open_saved', label: 'Open Saved Vibes' },
    ],
  },
  theme_lang: {
    id: 'theme_lang',
    title: 'Theme & App Language',
    prompt: 'You can customize VibeMix in Settings:\n\n🌓 Toggle dark/light mode\n🌐 Switch app language (English, العربية, Svenska)\n🎵 Set preferred music platform\n🎸 Save favorite genres',
    options: [
      { id: 'open_settings2', label: 'Open Settings' },
    ],
  },
  troubleshoot: {
    id: 'troubleshoot',
    title: 'Troubleshooting',
    prompt: 'What issue are you experiencing?',
    options: [
      { id: 'gen_fail', label: 'Playlist not generating', next: 'gen_fail' },
      { id: 'links_broken', label: 'Platform links not working', next: 'links_broken' },
      { id: 'bug', label: 'Report a bug', next: 'bug_report' },
    ],
  },
  gen_fail: {
    id: 'gen_fail',
    title: 'Playlist Not Generating',
    prompt: "If your playlist isn't generating, try these steps:\n\n1. Make sure you've selected at least one mood\n2. Check your internet connection\n3. Try refreshing the page\n4. Clear your browser cache\n\nIf the problem persists, please report it via the Help page.",
    options: [
      { id: 'open_help', label: 'Open Help Page' },
    ],
  },
  links_broken: {
    id: 'links_broken',
    title: 'Platform Links',
    prompt: "Platform links open in a new tab. If they're not working:\n\n• Make sure pop-ups aren't blocked\n• Try a different browser\n• In the Lovable preview, some links may be blocked — this works fine on the published app\n\nThe links use search URLs, so they'll always find the right track!",
    options: [
      { id: 'more_q3', label: 'I have more questions', next: 'root' },
    ],
  },
  bug_report: {
    id: 'bug_report',
    title: 'Report a Bug',
    prompt: 'We appreciate your help! Please report bugs through:\n\n📧 Email: support@vibemix.app\n📝 Help page: describe the issue in detail\n\nInclude what you were doing, what happened, and any error messages you saw.',
    options: [
      { id: 'open_help2', label: 'Open Help Page' },
    ],
  },
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  text: string;
  action: string;
}

export interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);

  const resetChat = useCallback(() => {
    setCurrentNodeId('root');
    setHistory([]);
    setMessages([]);
    setIsTyping(false);
  }, []);

  const showNode = (nodeId: string, userLabel?: string, pushFrom?: string) => {
    const node = SUPPORT_FLOW[nodeId];
    if (!node) return;

    setIsTyping(true);

    if (userLabel) {
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        text: userLabel,
        sender: 'user',
        timestamp: new Date(),
      }]);
    }

    setTimeout(() => {
      const actions = node.options.map(o => ({ id: o.id, text: o.label, action: o.id }));
      if (nodeId !== 'root') {
        actions.push({ id: 'start', text: '↩ Start over', action: 'start' });
        actions.push({ id: 'close_chat', text: '✕ Close chat', action: 'close_chat' });
      }
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        text: `${node.title}\n\n${node.prompt}`,
        sender: 'bot',
        timestamp: new Date(),
        quickActions: actions,
      }]);
      setIsTyping(false);
    }, 400);

    if (pushFrom) setHistory(prev => [...prev, pushFrom]);
    setCurrentNodeId(nodeId);
  };

  useEffect(() => {
    if (!isOpen) return;
    resetChat();
    const node = SUPPORT_FLOW['root'];
    setMessages([{
      id: 'bot-root',
      text: `${node.title}\n\n${node.prompt}`,
      sender: 'bot',
      timestamp: new Date(),
      quickActions: node.options.map(o => ({ id: o.id, text: o.label, action: o.id })),
    }]);
  }, [isOpen, resetChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCloseWithThankYou = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      resetChat();
      onToggle();
    }, 3000);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'start') {
      showNode('root', '↩ Start over');
      setHistory([]);
      return;
    }

    if (action === 'close_chat' || action === 'close') {
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        text: '✕ Close chat',
        sender: 'user',
        timestamp: new Date(),
      }]);
      handleCloseWithThankYou();
      return;
    }

    // Navigation actions
    const navActions: Record<string, string> = {
      'try_now': '/discover',
      'open_discover': '/discover',
      'open_discover2': '/discover',
      'open_settings': '/settings',
      'open_settings2': '/settings',
      'open_profile': '/profile',
      'open_saved': '/playlists',
      'open_help': '/help',
      'open_help2': '/help',
    };

    if (navActions[action]) {
      window.location.href = navActions[action];
      onToggle();
      return;
    }

    const node = SUPPORT_FLOW[currentNodeId];
    if (!node) return;
    const picked = node.options.find(o => o.id === action);
    if (!picked) return;

    if (picked.next) {
      showNode(picked.next, picked.label, currentNodeId);
    } else {
      // Terminal leaf — offer start over or close
      setMessages(prev => [
        ...prev,
        { id: `user-${Date.now()}`, text: picked.label, sender: 'user', timestamp: new Date() },
        {
          id: `bot-${Date.now() + 1}`,
          text: "Anything else I can help with?",
          sender: 'bot',
          timestamp: new Date(),
          quickActions: [
            { id: 'start', text: '↩ Start over', action: 'start' },
            { id: 'close', text: '✕ No thanks, close chat', action: 'close' },
          ],
        },
      ]);
    }
  };

  const handleHeaderClose = () => {
    handleCloseWithThankYou();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 sm:inset-auto sm:bottom-24 sm:right-4"
        >
          {isMinimized ? (
            <Card className="w-80 h-16 shadow-2xl border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">VibeMix AI</CardTitle>
                    <Badge className="text-xs bg-primary text-primary-foreground">Minimized</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)} className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground hidden lg:inline-flex" title="Restore">
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleHeaderClose} className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground" title="Close">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="w-full h-full sm:w-96 sm:h-[34rem] shadow-2xl border-2 rounded-none sm:rounded-lg flex flex-col min-h-0">
              <CardHeader className="pb-2 sm:pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base sm:text-lg">VibeMix AI</CardTitle>
                    <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1 animate-pulse" />
                      Online
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCloseConversation} className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive" title="Close chat">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[100dvh] min-h-0 sm:h-[30rem]">
                <ScrollArea className="flex-1 min-h-0 px-4 py-4">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[90%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                          </div>
                          <div className={`rounded-lg px-3 py-2 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                            
                            {message.quickActions && message.sender === 'bot' && (
                              <div className="mt-3 space-y-2">
                                {message.quickActions.map((action) => (
                                  <Button
                                    key={action.id}
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => handleQuickAction(action.action)}
                                  >
                                    {action.text}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            <Bot className="h-3 w-3" />
                          </div>
                          <div className="bg-muted rounded-lg px-3 py-2">
                            <div className="flex items-center space-x-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span className="text-sm text-muted-foreground">Typing...</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating toggle button
export function ChatbotToggle({ isOpen, onToggle }: ChatbotProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
          title={isOpen ? 'Close assistant' : 'Chat with VibeMix AI'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-16 right-0 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap border"
        >
          Need help? Chat with AI 💬
        </motion.div>
      )}
    </motion.div>
  );
}
