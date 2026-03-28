import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast as sonnerToast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, loginSchema, type SignupFormData, type LoginFormData } from '@/lib/validations';

interface UnifiedAuthFormProps {
  onSuccess: () => void;
}

export default function UnifiedAuthForm({ onSuccess }: UnifiedAuthFormProps) {
  const { signUp, signIn, loading } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Signup form data
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = loginSchema.parse(loginData);
      const result = await signIn(validatedData.email, validatedData.password);
      
      if (result.success) {
        onSuccess();
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Invalid form data');
      }
    }
    
    setIsSubmitting(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = signupSchema.parse(signupData);
      const result = await signUp(
        validatedData.email,
        validatedData.password,
        {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
        }
      );
      
      if (result.success) {
        onSuccess();
      } else {
        toast.error(result.error || 'Sign up failed');
      }
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as any;
        const firstError = zodError.issues[0];
        toast.error(firstError.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Invalid form data');
      }
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'login' | 'signup') => {
    const { name, value } = e.target;
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {isLogin ? 'Welcome Back' : 'Get Started'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
        </p>
      </CardHeader>
      
      <CardContent>
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={(e) => handleInputChange(e, 'login')}
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => handleInputChange(e, 'login')}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.signingIn')}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('auth.login')}
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={signupData.firstName}
                  onChange={(e) => handleInputChange(e, 'signup')}
                  placeholder="First Name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={signupData.lastName}
                  onChange={(e) => handleInputChange(e, 'signup')}
                  placeholder="Last Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">{t('auth.email')}</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                value={signupData.email}
                onChange={(e) => handleInputChange(e, 'signup')}
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.password}
                  onChange={(e) => handleInputChange(e, 'signup')}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.confirmPassword}
                  onChange={(e) => handleInputChange(e, 'signup')}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.creatingAccount')}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Get Started
                </>
              )}
            </Button>
          </form>
        )}

        {/* Toggle between login and signup */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setShowPassword(false);
            }}
            disabled={isSubmitting}
          >
            {isLogin ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Get Started
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t('auth.login')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
