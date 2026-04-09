import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import UnifiedAuthForm from './UnifiedAuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'signup' }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {isOpen ? <UnifiedAuthForm onSuccess={onClose} defaultTab={defaultTab} /> : null}
      </DialogContent>
    </Dialog>
  );
}
