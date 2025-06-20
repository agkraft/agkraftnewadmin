import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaTrash, FaTimes } from 'react-icons/fa';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Project",
  description,
  itemName = "this project",
  isLoading = false
}) => {
  const defaultDescription = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <FaTrash className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FaTimes className="h-4 w-4" />
            Cancel
          </Button>
          
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FaTrash className="h-4 w-4" />
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
