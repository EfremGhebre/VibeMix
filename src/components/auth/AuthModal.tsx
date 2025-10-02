import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import UnifiedAuthForm from './UnifiedAuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <UnifiedAuthForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
