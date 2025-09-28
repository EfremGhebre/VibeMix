import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Settings, LogOut, Music, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function UserMenu() {
  const {
    user,
    signOut
  } = useAuth();
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
  };
  const getInitials = (email: string) => {
    return email.split('@')[0].split('.').map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
  };
  const getFirstName = () => {
    return user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  };
  const getLastName = () => {
    return user?.user_metadata?.last_name || '';
  };
  const getFullName = () => {
    const firstName = getFirstName();
    const lastName = getLastName();
    return lastName ? `${firstName} ${lastName}` : firstName;
  };
  const getGreeting = () => {
    const fullName = getFullName();
    return `Hi, ${fullName}!`;
  };
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-primary hover:bg-transparent transition-colors">
          <Avatar className="h-9 rounded-none w-auto min-w-fit">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback className="rounded-none bg-transparent px-2 w-auto text-sm">
              Hi {getFirstName()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getGreeting()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>{t('auth.profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/favorites')}>
          <Heart className="mr-2 h-4 w-4" />
          <span>My Favorites</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('nav.settings')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
}