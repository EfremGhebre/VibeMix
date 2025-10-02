import { Heart, Radio, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-surface/20 border-t border-border/30 backdrop-blur-md" dir="ltr">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <Radio className="h-5 w-5 text-primary animate-pulse-glow mr-2" />
              <span className="text-lg font-bold gradient-text">VibeMix</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border/40"></div>
            <p className="hidden sm:block text-sm text-muted-foreground">Live Loud, Feel Rich </p>
          </div>


          {/* Right Section */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 animate-pulse" />
              <span>for music lovers</span>
              
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-4 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            © {currentYear} VibeMix Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>;
}