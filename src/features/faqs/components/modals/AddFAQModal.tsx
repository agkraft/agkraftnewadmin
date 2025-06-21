import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFAQ } from '../../api/faqApi';
import { CreateFAQRequest, FAQStatus } from '@/types/faqs';

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question must be less than 500 characters'),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer must be less than 2000 characters'),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  order: z.number().min(0, 'Order must be a positive number').default(0),
});

type FormData = z.infer<typeof faqSchema>;

interface AddFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddFAQModal: React.FC<AddFAQModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
      category: '',
      status: 'active',
      order: 0,
    },
  });

  const watchedStatus = watch('status');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const faqData: CreateFAQRequest = {
        question: data.question,
        answer: data.answer,
        category: data.category || undefined,
        status: data.status as FAQStatus,
        order: data.order,
      };

      const response = await createFAQ(faqData);

      if (response.status) {
        toast.success('FAQ created successfully!');
        reset();
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to create FAQ');
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast.error('An error occurred while creating the FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Add New FAQ
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Question <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="question"
              placeholder="Enter the FAQ question..."
              {...register('question')}
              className="min-h-[80px]"
            />
            {errors.question && (
              <p className="text-sm text-red-600">{errors.question.message}</p>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">
              Answer <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="answer"
              placeholder="Enter the FAQ answer..."
              {...register('answer')}
              className="min-h-[120px]"
            />
            {errors.answer && (
              <p className="text-sm text-red-600">{errors.answer.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Input
              id="category"
              placeholder="Enter category (optional)"
              {...register('category')}
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Status and Order Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={watchedStatus}
                onValueChange={(value) => setValue('status', value as FAQStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order" className="text-sm font-medium">
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                min="0"
                placeholder="0"
                {...register('order', { valueAsNumber: true })}
              />
              {errors.order && (
                <p className="text-sm text-red-600">{errors.order.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFAQModal;
