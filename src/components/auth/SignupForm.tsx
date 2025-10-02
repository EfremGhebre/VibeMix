import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, type SignupFormData } from '@/lib/validations';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin?: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signUp, loading } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data with Zod
      const validatedData = signupSchema.parse(formData);

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
        // Zod validation error
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('auth.firstName')}</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">{t('auth.lastName')}</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
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
            value={formData.password}
            onChange={handleInputChange}
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
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            required
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting}
          >
            {showConfirmPassword ? (
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
          t('auth.signup')
        )}
      </Button>

      {/* Sign In option for registered users */}
      {onSwitchToLogin && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Already have an account?
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onSwitchToLogin}
            disabled={isSubmitting}
          >
            {t('auth.login')}
          </Button>
        </div>
      )}
    </form>
  );
}
