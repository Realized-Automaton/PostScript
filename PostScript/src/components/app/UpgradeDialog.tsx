
'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose(); 
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Daily Limit Reached</AlertDialogTitle>
          <AlertDialogDescription>
            You've used all your free chats for today. Come back tomorrow for more, or upgrade to a Plus plan for more daily conversations and advanced features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
             <Button onClick={handleUpgrade}>Upgrade to Plus</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpgradeDialog;
