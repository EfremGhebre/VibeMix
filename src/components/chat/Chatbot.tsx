import React, { useState, useRef, useEffect } from 'react';
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

// Support decision-tree types and config
type FlowOption = {
  id: string;
  label: string;
  next?: string; // next node id; if omitted, this is a terminal leaf
  note?: string; // optional helper text
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
    title: 'How can we help?',
    prompt: 'Choose a topic to get started:',
    options: [
      { id: 'account', label: 'Account & Profile', next: 'account' },
      { id: 'spotify', label: 'Spotify Connect', next: 'spotify' },
      { id: 'playlists', label: 'Playlists & Discovery', next: 'playlists' },
      { id: 'troubleshoot', label: 'Troubleshooting', next: 'troubleshoot' },
    ],
  },
  account: {
    id: 'account',
    title: 'Account & Profile',
    prompt: 'What do you need help with?',
    options: [
      { id: 'update-info', label: 'Update personal info', next: 'account_update' },
      { id: 'password', label: 'Change password', next: 'account_password' },
      { id: 'delete', label: 'Delete my account', next: 'account_delete' },
    ],
  },
  account_update: {
    id: 'account_update',
    title: 'Update personal info',
    prompt: 'Go to Profile > Settings to update your name and details.',
    options: [
      { id: 'open-settings', label: 'Open Settings' },
    ],
  },
  account_password: {
    id: 'account_password',
    title: 'Change password',
    prompt: 'Use Profile > Security > Change Password. You will receive a confirmation email.',
    options: [
      { id: 'open-security', label: 'Open Security' },
    ],
  },
  account_delete: {
    id: 'account_delete',
    title: 'Delete account',
    prompt: 'We are sorry to see you go. You can request deletion from Profile > Settings > Danger Zone.',
    options: [
      { id: 'open-danger', label: 'Open Danger Zone' },
    ],
  },
  spotify: {
    id: 'spotify',
    title: 'Spotify Connect',
    prompt: 'Select an option:',
    options: [
      { id: 'connect', label: 'Connect my Spotify', next: 'spotify_connect' },
      { id: 'issues', label: 'Fix connection issues', next: 'spotify_fix' },
    ],
  },
  spotify_connect: {
    id: 'spotify_connect',
    title: 'Connect Spotify',
    prompt: 'Go to Settings > Connect Spotify and authorize VibeMix.',
    options: [
      { id: 'open-connect', label: 'Open Connect Spotify' },
    ],
  },
  spotify_fix: {
    id: 'spotify_fix',
    title: 'Fix connection',
    prompt: 'Try logging out/in, clear cookies for vibemix, and reconnect.',
    options: [
      { id: 'retry', label: 'Retry connect' },
    ],
  },
  playlists: {
    id: 'playlists',
    title: 'Playlists & Discovery',
    prompt: 'What would you like to do?',
    options: [
      { id: 'create', label: 'Create a new playlist', next: 'playlist_create' },
      { id: 'mood', label: 'Use mood discovery', next: 'playlist_mood' },
    ],
  },
  playlist_create: {
    id: 'playlist_create',
    title: 'Create playlist',
    prompt: 'Select your mood, genres, and languages, then tap Generate.',
    options: [
      { id: 'open-discover', label: 'Open Discover' },
    ],
  },
  playlist_mood: {
    id: 'playlist_mood',
    title: 'Mood discovery',
    prompt: 'Explore moods from the Discover page and preview tracks.',
    options: [
      { id: 'open-discover2', label: 'Open Discover' },
    ],
  },
  troubleshoot: {
    id: 'troubleshoot',
    title: 'Troubleshooting',
    prompt: 'What is going wrong?',
    options: [
      { id: 'bug', label: 'I found a bug', next: 'bug_report' },
      { id: 'load', label: 'App loads slowly', next: 'perf' },
    ],
  },
  bug_report: {
    id: 'bug_report',
    title: 'Report a bug',
    prompt: 'Please describe the issue via Help > Report, or email support@vibemix.app.',
    options: [
      { id: 'open-help', label: 'Open Help Page' },
    ],
  },
  perf: {
    id: 'perf',
    title: 'Performance',
    prompt: 'Try updating the app, clearing cache, and ensuring a stable connection.',
    options: [
      { id: 'learn-more', label: 'Performance tips' },
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

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);

  const appendResolutionPrompt = (options: { includeBack?: boolean } = {}) => {
    const actions = [
      { id: 'yes_helpful', text: 'Yes, resolved', action: 'yes_helpful' },
      { id: 'no_helpful', text: 'No, need more help', action: 'no_helpful' },
    ];
    if (options.includeBack) {
      actions.push({ id: 'back', text: 'Back', action: 'back' });
    }
    setMessages(prev => [
      ...prev,
      {
        id: `bot-followup-${Date.now()}`,
        text: 'Was this helpful?',
        sender: 'bot',
        timestamp: new Date(),
        quickActions: actions,
      },
    ]);
  };

  const showNode = (
    nodeId: string,
    userLabel?: string,
    pushHistoryFrom?: string,
    includeOptions: boolean = true
  ) => {
    const node = SUPPORT_FLOW[nodeId];
    if (!node) return;

    setIsTyping(true);

    setMessages(prev => {
      if (userLabel) {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          text: userLabel,
          sender: 'user',
          timestamp: new Date(),
        };
        return [...prev, userMessage];
      }
      return prev;
    });

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: `${node.title}\n\n${node.prompt}`,
          sender: 'bot',
          timestamp: new Date(),
          quickActions: includeOptions ? node.options.map(o => ({ id: o.id, text: o.label, action: o.id })) : undefined
        }
      ]);
      setIsTyping(false);
      const depthAfter = pushHistoryFrom ? history.length + 1 : history.length;
      if (depthAfter >= 2) {
        appendResolutionPrompt({ includeBack: history.length > 0 });
      }
    }, 300);

    if (pushHistoryFrom) {
      setHistory(prev => [...prev, pushHistoryFrom]);
    }
    setCurrentNodeId(nodeId);
  };

  // Initialize flow when opened
  useEffect(() => {
    if (!isOpen) return;
    const node = SUPPORT_FLOW['root'];
    setCurrentNodeId('root');
    setHistory([]);
    setMessages([
      {
        id: 'bot-root',
        text: `${node.title}\n\n${node.prompt}`,
        sender: 'bot',
        timestamp: new Date(),
        quickActions: node.options.map(o => ({ id: o.id, text: o.label, action: o.id }))
      }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  

  const goToNode = (nextId: string, userLabel?: string) => {
    const nextDepth = history.length + 1; // after pushing current
    const includeOptions = nextDepth < 2; // hide options starting at depth 2 (after second selection)
    showNode(nextId, userLabel, currentNodeId, includeOptions);
  };

  const goBack = () => {
    setHistory(prev => {
      const prevId = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      if (prevId) {
        setHistory(rest);
        // show previous without pushing history or user message
        const node = SUPPORT_FLOW[prevId];
        if (!node) return rest;
        setIsTyping(true);
        setCurrentNodeId(prevId);
        setTimeout(() => {
          setMessages(curr => [
            ...curr,
            {
              id: `bot-${Date.now()}`,
              text: `${node.title}\n\n${node.prompt}`,
              sender: 'bot',
              timestamp: new Date(),
              quickActions: node.options.map(o => ({ id: o.id, text: o.label, action: o.id }))
            }
          ]);
          setIsTyping(false);
          appendResolutionPrompt({ includeBack: rest.length > 0 });
        }, 200);
      }
      return rest;
    });
  };

  const startOver = () => {
    const node = SUPPORT_FLOW['root'];
    setHistory([]);
    setCurrentNodeId('root');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(curr => [
        ...curr,
        {
          id: `bot-${Date.now()}`,
          text: `${node.title}\n\n${node.prompt}`,
          sender: 'bot',
          timestamp: new Date(),
          quickActions: node.options.map(o => ({ id: o.id, text: o.label, action: o.id }))
        }
      ]);
      setIsTyping(false);
      appendResolutionPrompt();
    }, 200);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'back') { goBack(); return; }
    if (action === 'start') { startOver(); return; }
    if (action === 'yes_helpful') {
      setMessages(prev => [
        ...prev,
        { id: `user-${Date.now()}`, text: 'Yes, resolved', sender: 'user', timestamp: new Date() },
        { id: `bot-${Date.now() + 1}`, text: 'Glad we could help! You can reopen VibeMix AI Assistant anytime.', sender: 'bot', timestamp: new Date() }
      ]);
      setTimeout(() => handleCloseConversation(), 3800);
      return;
    }
    if (action === 'no_helpful') {
      setMessages(prev => [
        ...prev,
        { id: `user-${Date.now()}`, text: 'No, need more help', sender: 'user', timestamp: new Date() },
        {
          id: `bot-${Date.now() + 1}`,
          text: 'No worries—try going back or start over for more options.',
          sender: 'bot',
          timestamp: new Date(),
          quickActions: [
            { id: 'back', text: 'Back', action: 'back' },
            { id: 'start', text: 'Start over', action: 'start' },
          ]
        }
      ]);
      return;
    }

    const node = SUPPORT_FLOW[currentNodeId];
    if (!node) return;
    const picked = node.options.find(o => o.id === action);
    if (!picked) return;
    if (picked.next) {
      goToNode(picked.next, picked.label);
    } else {
      // Terminal leaf: show follow-up "Start over" or "Back"
      setMessages(prev => [
        ...prev,
        { id: `user-${Date.now()}`, text: picked.label, sender: 'user', timestamp: new Date() },
        {
          id: `bot-${Date.now() + 1}`,
          text: 'What would you like to do next?',
          sender: 'bot',
          timestamp: new Date(),
          quickActions: [
            { id: 'back', text: 'Back', action: 'back' },
            { id: 'start', text: 'Start over', action: 'start' },
          ]
        }
      ]);
      setIsTyping(false);
      const depthAfter = history.length + 1; // considering current selection
      if (depthAfter >= 2) {
        appendResolutionPrompt({ includeBack: history.length > 0 });
      }
    }
  };

  // Handle helpfulness answers
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    // noop: actions handled via handleQuickAction
  }, [messages]);

  const handleCloseConversation = () => {
    // reset flow
    setCurrentNodeId('root');
    setHistory([]);
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    onToggle();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  // special actions now handled explicitly in handleQuickAction

  

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
          className="fixed inset-0 z-50 sm:inset-auto sm:bottom-40 sm:right-4"
        >
          {isMinimized ? (
            <Card className="w-80 h-16 shadow-2xl border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">VibeMix Assistant</CardTitle>
                    <Badge className="text-xs bg-primary text-primary-foreground">
                      Minimized
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMaximize}
                      className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground hidden lg:inline-flex"
                      title="Restore"
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseConversation}
                      className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground"
                      title="Close chat"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="w-full h-full sm:w-80 sm:h-[32rem] shadow-2xl border-2 rounded-none sm:rounded-lg flex flex-col min-h-0">
            <CardHeader className="pb-2 sm:pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">VibeMix Assistant</CardTitle>
                  <Badge className="text-xs bg-primary text-primary-foreground">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goBack}
                      className="h-6 px-2 text-xs hover:bg-primary hover:text-primary-foreground"
                      title="Back"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseConversation}
                    className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground"
                    title="Close chat"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[100dvh] min-h-0 sm:h-[28rem]">
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
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3" />
                          )}
                        </div>
                        <div className={`rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                          
                          {/* Quick Action Buttons */}
                          {message.quickActions && message.sender === 'bot' && (
                            <div className="mt-3 space-y-2">
                              {message.quickActions.map((action) => (
                                <Button
                                  key={action.id}
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs h-8 bg-background hover:bg-primary hover:text-primary-foreground"
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
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

// Chatbot Toggle Button Component
export function ChatbotToggle({ isOpen, onToggle }: ChatbotProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="hidden sm:fixed sm:bottom-40 sm:right-4 sm:z-40"
    >
      <Button
        onClick={onToggle}
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
        title={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </motion.div>
  );
}
