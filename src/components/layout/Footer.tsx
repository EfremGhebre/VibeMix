import { Heart, Music } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface/30 border-t border-border/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Music className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-lg font-bold gradient-text">VibeMix</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting perfect playlists for every mood and moment. 
              Discover your soundtrack to life.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="/discover" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Discover
              </a>
              <a href="/settings" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Settings
              </a>
            </div>
          </div>

          {/* Contact/Support */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-6 border-t border-border/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>© {currentYear} VibeMix Technologies Inc. All rights reserved.</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1 animate-pulse" />
              <span>for music lovers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}