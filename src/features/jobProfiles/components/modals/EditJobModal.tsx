import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { updateJobProfile } from '../../api/jobApi';
import { JobProfile, UpdateJobRequest, JobType, JobStatus, COMMON_TECH_STACKS, JOB_TYPE_OPTIONS } from '@/types/jobProfiles';

const jobSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(200, 'Job title must be less than 200 characters'),
  jobDescription: z.string().min(1, 'Job description is required').max(2000, 'Job description must be less than 2000 characters'),
  techStack: z.array(z.string()).min(1, 'At least one tech stack is required'),
  startDateApplied: z.string().min(1, 'Start date is required'),
  lastDayApplied: z.string().min(1, 'Last day to apply is required'),
  status: z.enum(['active', 'inactive']),
  experienceRequired: z.string().optional(),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  department: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  isUrgent: z.boolean(),
  postedBy: z.string().optional(),
}).refine((data) => {
  const startDate = new Date(data.startDateApplied);
  const endDate = new Date(data.lastDayApplied);
  return endDate > startDate;
}, {
  message: "Last day to apply must be after start date",
  path: ["lastDayApplied"],
});

type FormData = z.infer<typeof jobSchema>;

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job: JobProfile | null;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ isOpen, onClose, onSuccess, job }) => {
  const [loading, setLoading] = useState(false);
  const [newTechStack, setNewTechStack] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: '',
      jobDescription: '',
      techStack: [],
      startDateApplied: '',
      lastDayApplied: '',
      status: 'active',
      experienceRequired: '',
      salaryRange: '',
      location: '',
      jobType: 'full-time',
      department: '',
      requirements: [],
      benefits: [],
      isUrgent: false,
      postedBy: '',
    },
  });

  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control,
    name: 'requirements',
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefits',
  });

  const watchedTechStack = watch('techStack');
  const watchedStatus = watch('status');
  const watchedJobType = watch('jobType');
  const watchedIsUrgent = watch('isUrgent');

  // Reset form when job changes
  useEffect(() => {
    if (job) {
      setValue('jobTitle', job.jobTitle);
      setValue('jobDescription', job.jobDescription);
      setValue('techStack', job.techStack);
      setValue('startDateApplied', new Date(job.startDateApplied).toISOString().slice(0, 16));
      setValue('lastDayApplied', new Date(job.lastDayApplied).toISOString().slice(0, 16));
      setValue('status', job.status);
      setValue('experienceRequired', job.experienceRequired || '');
      setValue('salaryRange', job.salaryRange || '');
      setValue('location', job.location || '');
      setValue('jobType', job.jobType);
      setValue('department', job.department || '');
      setValue('requirements', job.requirements || []);
      setValue('benefits', job.benefits || []);
      setValue('isUrgent', job.isUrgent);
      setValue('postedBy', job.postedBy || '');
    }
  }, [job, setValue]);

  const addTechStack = (tech: string) => {
    const currentTechStack = watchedTechStack || [];
    if (tech && !currentTechStack.includes(tech)) {
      setValue('techStack', [...currentTechStack, tech]);
    }
    setNewTechStack('');
  };

  const removeTechStack = (index: number) => {
    const currentTechStack = watchedTechStack || [];
    const newTechStack = currentTechStack.filter((_, i) => i !== index);
    setValue('techStack', newTechStack);
  };

  const onSubmit = async (data: FormData) => {
    if (!job) return;

    setLoading(true);
    try {
      const updateData: UpdateJobRequest = {
        id: job.id,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        techStack: data.techStack || [],
        startDateApplied: data.startDateApplied,
        lastDayApplied: data.lastDayApplied,
        status: data.status as JobStatus,
        experienceRequired: data.experienceRequired || undefined,
        salaryRange: data.salaryRange || undefined,
        location: data.location || undefined,
        jobType: data.jobType as JobType,
        department: data.department || undefined,
        requirements: data.requirements?.filter(req => req.trim()) || undefined,
        benefits: data.benefits?.filter(benefit => benefit.trim()) || undefined,
        isUrgent: data.isUrgent,
        postedBy: data.postedBy || undefined,
      };

      const response = await updateJobProfile(updateData);

      if (response.status) {
        toast.success('Job profile updated successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to update job profile');
      }
    } catch (error) {
      console.error('Error updating job profile:', error);
      toast.error('An error occurred while updating the job profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset({
      jobTitle: '',
      jobDescription: '',
      techStack: [],
      startDateApplied: '',
      lastDayApplied: '',
      status: 'active',
      experienceRequired: '',
      salaryRange: '',
      location: '',
      jobType: 'full-time',
      department: '',
      requirements: [],
      benefits: [],
      isUrgent: false,
      postedBy: '',
    });
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit Job Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior React Developer"
                {...register('jobTitle')}
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-sm font-medium">
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Detailed job description..."
                {...register('jobDescription')}
                className="min-h-[120px]"
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-600">{errors.jobDescription.message}</p>
              )}
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tech Stack <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tech stack..."
                    value={newTechStack}
                    onChange={(e) => setNewTechStack(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechStack(newTechStack);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addTechStack(newTechStack)}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Common Tech Stacks */}
                <div className="flex flex-wrap gap-2">
                  {COMMON_TECH_STACKS.slice(0, 10).map((tech) => (
                    <Button
                      key={tech}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTechStack(tech)}
                      disabled={watchedTechStack?.includes(tech) || false}
                    >
                      {tech}
                    </Button>
                  ))}
                </div>

                {/* Selected Tech Stacks */}
                <div className="flex flex-wrap gap-2">
                  {(watchedTechStack || []).map((tech, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {tech}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTechStack(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              {errors.techStack && (
                <p className="text-sm text-red-600">{errors.techStack.message}</p>
              )}
            </div>
          </div>

          {/* Application Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Application Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDateApplied" className="text-sm font-medium">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDateApplied"
                  type="datetime-local"
                  {...register('startDateApplied')}
                />
                {errors.startDateApplied && (
                  <p className="text-sm text-red-600">{errors.startDateApplied.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDayApplied" className="text-sm font-medium">
                  Last Day to Apply <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastDayApplied"
                  type="datetime-local"
                  {...register('lastDayApplied')}
                />
                {errors.lastDayApplied && (
                  <p className="text-sm text-red-600">{errors.lastDayApplied.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Job Type</Label>
                <Select
                  value={watchedJobType}
                  onValueChange={(value) => setValue('jobType', value as JobType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) => setValue('status', value as JobStatus)}
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

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="e.g., Engineering"
                  {...register('department')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Remote, New York"
                  {...register('location')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceRequired" className="text-sm font-medium">
                  Experience Required
                </Label>
                <Input
                  id="experienceRequired"
                  placeholder="e.g., 3-5 years"
                  {...register('experienceRequired')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryRange" className="text-sm font-medium">
                  Salary Range
                </Label>
                <Input
                  id="salaryRange"
                  placeholder="e.g., $80,000 - $120,000"
                  {...register('salaryRange')}
                />
              </div>
            </div>

            {/* Urgent Job Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isUrgent"
                checked={watchedIsUrgent}
                onCheckedChange={(checked) => setValue('isUrgent', checked)}
              />
              <Label htmlFor="isUrgent" className="text-sm font-medium">
                Mark as Urgent
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postedBy" className="text-sm font-medium">
                Posted By
              </Label>
              <Input
                id="postedBy"
                placeholder="e.g., HR Team"
                {...register('postedBy')}
              />
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
              {loading ? 'Updating...' : 'Update Job Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobModal;
