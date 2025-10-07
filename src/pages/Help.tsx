import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageSquare, Book, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Chatbot, { ChatbotToggle } from '@/components/chat/Chatbot';
import { toast } from 'sonner';

export default function Help() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill all required fields', {
        description: 'All fields marked with * are required'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('send-support-email', {
        body: form
      });

      if (error) throw error;

      toast.success('Message sent successfully!', {
        description: 'Thank you for contacting us. We\'ll get back to you soon.'
      });
      setIsEmailDialogOpen(false);
      setForm({ name: '', email: '', category: 'general', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending support email:', error);
      toast.error('Failed to send message', {
        description: 'Please try again or email us directly at support@vibemix.app'
      });
    } finally {
      setSubmitting(false);
    }
  };
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
                <CardDescription>VibeMix AI Assistant: Instant help, 24/7.</CardDescription>
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

            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
                    <CardTitle>Email Support</CardTitle>
                    <CardDescription>Send us a detailed message</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      support@vibemix.app
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>Fill in the details below and we’ll get back to you.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSupportSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full name</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="spotify">Spotify</SelectItem>
                          <SelectItem value="playlists">Playlists</SelectItem>
                          <SelectItem value="bug">Bug report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Short summary" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe the issue, steps to reproduce, device/browser..." rows={6} required />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEmailDialogOpen(false)} disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Sending...' : 'Send message'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Book className="h-12 w-12 text-primary mx-auto mb-2" />
                    <CardTitle className="text-center">User Guide</CardTitle>
                    <CardDescription className="text-center">Step-by-step guides for getting started, playlists, Spotify, and fixes.</CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>User Guide</DialogTitle>
                  <DialogDescription>Follow these steps to get the most out of VibeMix.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 text-left">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Getting Started</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Open Discover from the main navigation.</li>
                      <li>Pick your mood to guide recommendations.</li>
                      <li>Select favorite genres and languages.</li>
                      <li>Preview suggested tracks and artists.</li>
                      <li>Save your picks to a playlist.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Connect Spotify</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Go to Profile → Settings.</li>
                      <li>Click Connect Spotify.</li>
                      <li>Authorize VibeMix in the Spotify window.</li>
                      <li>Return to VibeMix and confirm Connected status.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Create Playlists</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Choose mood, genres, and languages.</li>
                      <li>Tap Generate to build a playlist.</li>
                      <li>Rename and save to Spotify.</li>
                      <li>Re‑generate to refine results.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Troubleshooting</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Refresh the page and retry the action.</li>
                      <li>Log out/in, then reconnect Spotify.</li>
                      <li>Clear site data/cache for vibemix.</li>
                      <li>Try a supported, updated browser.</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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