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
import { deleteJobProfile } from '../../api/jobApi';
import { JobProfile } from '@/types/jobProfiles';

interface DeleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job: JobProfile | null;
}

const DeleteJobModal: React.FC<DeleteJobModalProps> = ({ isOpen, onClose, onSuccess, job }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!job) return;

    setLoading(true);
    try {
      const response = await deleteJobProfile(job.id);

      if (response.status) {
        toast.success('Job profile deleted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to delete job profile');
      }
    } catch (error) {
      console.error('Error deleting job profile:', error);
      toast.error('An error occurred while deleting the job profile');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Job Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This action cannot be undone. This will permanently delete the job profile and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Job profile to be deleted:</h4>
            <p className="text-sm text-red-800 font-medium">
              {job.jobTitle}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Department: {job.department || 'N/A'} | Type: {job.jobType}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Applications: {job.applicationCount}
            </p>
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
            {loading ? 'Deleting...' : 'Delete Job Profile'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteJobModal;
