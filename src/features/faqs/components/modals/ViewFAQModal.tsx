import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FAQ } from '@/types/faqs';

interface ViewFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
}

const ViewFAQModal: React.FC<ViewFAQModalProps> = ({ isOpen, onClose, faq }) => {
  if (!faq) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            FAQ Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={faq.status === "active" ? "default" : "secondary"}
                  className={faq.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {faq.status}
                </Badge>
                {faq.category && (
                  <Badge variant="outline">{faq.category}</Badge>
                )}
                <span className="text-sm text-gray-500">Order: {faq.order}</span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>ID: {faq.id}</div>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Question</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed">{faq.question}</p>
            </div>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Answer</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge 
                    variant={faq.status === "active" ? "default" : "secondary"}
                    className={faq.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {faq.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {faq.category || 'No category'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Display Order:</span>
                  <span className="font-medium">{faq.order}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Timestamps</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{formatDate(faq.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">{formatDate(faq.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFAQModal;
