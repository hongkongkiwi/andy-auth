'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={loading ? "Processing..." : "Are you sure?"}
      description={loading ? "Please wait..." : "This action cannot be undone."}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button 
          disabled={loading} 
          variant="outline" 
          onClick={onClose}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          disabled={loading} 
          variant="destructive" 
          onClick={onConfirm}
          type="button"
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
