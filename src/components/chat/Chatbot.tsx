import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X, 
  Minimize2,
  Maximize2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm VibeMix Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      quickActions: [
        { id: '1', text: 'How to create a playlist', action: 'How do I create a playlist?' },
        { id: '2', text: 'Connect Spotify', action: 'How do I connect my Spotify account?' },
        { id: '3', text: 'Account settings', action: 'How do I manage my account settings?' },
        { id: '4', text: 'Troubleshooting', action: 'I need help with a problem' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Common responses based on keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to VibeMix! How can I assist you today?";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! You can ask me about:\n• Creating playlists\n• Connecting Spotify\n• Account settings\n• Troubleshooting\n• Features and how to use them\n\nWhat would you like to know?";
    }
    
    if (message.includes('playlist') || message.includes('music')) {
      return "Great question about playlists! VibeMix helps you create personalized playlists based on your mood. You can:\n• Select your current mood\n• Choose your favorite genres\n• Pick music languages\n• Generate a custom playlist\n\nWould you like me to walk you through creating your first playlist?";
    }
    
    if (message.includes('spotify') || message.includes('connect')) {
      return "To connect Spotify:\n1. Go to Settings in your profile\n2. Click 'Connect Spotify'\n3. Authorize VibeMix to access your Spotify account\n4. Start creating playlists!\n\nNeed help with any of these steps?";
    }
    
    if (message.includes('account') || message.includes('profile')) {
      return "You can manage your account by:\n• Clicking on your profile picture in the top right\n• Updating your personal information\n• Changing your password\n• Managing your connected services\n\nIs there something specific about your account you'd like help with?";
    }
    
    if (message.includes('bug') || message.includes('error') || message.includes('problem')) {
      return "I'm sorry you're experiencing issues! Here are some common solutions:\n• Try refreshing the page\n• Clear your browser cache\n• Check your internet connection\n• Make sure you're using a supported browser\n\nIf the problem persists, please describe what's happening and I'll do my best to help!";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need help. Feel free to ask me anything about VibeMix!";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! Thanks for using VibeMix. Come back anytime if you need help!";
    }
    
    // Default response for unrecognized messages
    return "That's an interesting question! While I'm still learning, I can help you with:\n• How to use VibeMix features\n• Creating and managing playlists\n• Account and settings help\n• General troubleshooting\n\nCould you rephrase your question or ask about one of these topics?";
  };

  const handleQuickAction = (action: string) => {
    setInputText(action);
    handleSendMessage(action);
  };

  const handleCloseConversation = () => {
    setMessages([
      {
        id: '1',
        text: "Hi! I'm VibeMix Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        quickActions: [
          { id: '1', text: 'How to create a playlist', action: 'How do I create a playlist?' },
          { id: '2', text: 'Connect Spotify', action: 'How do I connect my Spotify account?' },
          { id: '3', text: 'Account settings', action: 'How do I manage my account settings?' },
          { id: '4', text: 'Troubleshooting', action: 'I need help with a problem' }
        ]
      }
    ]);
    setInputText('');
    setIsTyping(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
          className="fixed bottom-20 right-4 z-50 sm:bottom-20 sm:right-4"
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
                      onClick={onToggle}
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
            <Card className="w-80 h-96 shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">VibeMix Assistant</CardTitle>
                  <Badge className="text-xs bg-primary text-primary-foreground">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground hidden lg:inline-flex"
                    title="Minimize"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="h-6 w-6 p-0 hover:bg-primary hover:text-primary-foreground"
                    title="Close chat"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-80">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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
              
              <div className="border-t p-3">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
      className="fixed bottom-4 right-4 z-40"
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
