import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { deleteFAQ } from '../../api/faqApi';
import { FAQ } from '@/types/faqs';

interface DeleteFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  faq: FAQ | null;
}

const DeleteFAQModal: React.FC<DeleteFAQModalProps> = ({ isOpen, onClose, onSuccess, faq }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!faq) return;

    setLoading(true);
    try {
      const response = await deleteFAQ(faq.id);

      if (response.status) {
        toast.success('FAQ deleted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('An error occurred while deleting the FAQ');
    } finally {
      setLoading(false);
    }
  };

  if (!faq) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete FAQ
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This action cannot be undone. This will permanently delete the FAQ.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">FAQ to be deleted:</h4>
            <p className="text-sm text-red-800 font-medium">
              {faq.question}
            </p>
            {faq.category && (
              <p className="text-xs text-red-600 mt-1">
                Category: {faq.category}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete FAQ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFAQModal;
