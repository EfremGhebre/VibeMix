import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Book, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import Chatbot, { ChatbotToggle } from '@/components/chat/Chatbot';

export default function Help() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const faqItems = [
    {
      question: "How do I connect my Spotify account?",
      answer: "Go to Settings and click 'Connect Spotify'. You'll be redirected to Spotify to authorize the connection."
    },
    {
      question: "Can I use VibeMix without Spotify?",
      answer: "Yes! You can discover music and create playlists manually, but connecting Spotify provides a better experience."
    },
    {
      question: "How are mood-based recommendations generated?",
      answer: "Our AI analyzes your music preferences, listening history, and selected mood to create personalized recommendations."
    },
    {
      question: "Can I change the language of the app?",
      answer: "Yes, VibeMix supports multiple languages. Go to Settings > Language to change your preferred language."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Help & Support</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions and get the help you need.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Get instant help from our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => setIsChatbotOpen(true)}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us a detailed message</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  support@vibemix.com
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Book className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>User Guide</CardTitle>
                <CardDescription>Learn how to use all features</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Guide</Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-card rounded-lg p-8 border border-border text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get the most out of VibeMix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Chatbot Components */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
      {!isChatbotOpen && (
        <ChatbotToggle 
          isOpen={isChatbotOpen} 
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
        />
      )}
    </div>
  );
}