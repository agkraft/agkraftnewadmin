import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FaPlus, FaTimes, FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa';
import ProjectTiptapEditor from './ProjectTiptapEditor';
import {
  ProjectFormData,
  ProjectFormErrors,
  ProjectType,
  ProjectCategory,
  ProjectStatus
} from '../types/projectTypes';
import { validateFile, formatFileSize } from '../api/projectApi';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  editingProject?: ProjectType | null;
  isLoading?: boolean;
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Web Development",
  "Mobile App",
  "Digital Marketing",
  "E-commerce",
  "UI/UX Design",
  "Software Development",
  "SAAS Platform",
];

const PROJECT_STATUSES: ProjectStatus[] = ["active", "inactive", "draft"];

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingProject,
  isLoading = false 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    projectCategory: '',
    clientName: '',
    projectDeliveryDate: '',
    status: 'active',
    featured: false,
    tags: [],
    projectLink: '',
    processAndChallengeDescription: '',
    processAndChallengeDescription2: '',
    summaryDescription: '',
    processAndChallengePoints: [''],
    bigImage: null,
    miniImages: [],
  });
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [newTag, setNewTag] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        projectCategory: editingProject.projectCategory as ProjectCategory || '',
        clientName: editingProject.clientName || '',
        projectDeliveryDate: editingProject.projectDeliveryDate || '',
        status: editingProject.status || 'active',
        featured: editingProject.featured || false,
        tags: editingProject.tags || [],
        projectLink: editingProject.projectLink || '',
        processAndChallengeDescription: editingProject.processAndChallengeDescription || '',
        processAndChallengeDescription2: editingProject.processAndChallengeDescription2 || '',
        summaryDescription: editingProject.summaryDescription || '',
        processAndChallengePoints: editingProject.processAndChallengePoints || [''],
        bigImage: null,
        miniImages: [],
      });
    } else {
      // Reset form for new project
      setFormData({
        title: '',
        description: '',
        projectCategory: '',
        clientName: '',
        projectDeliveryDate: '',
        status: 'active',
        featured: false,
        tags: [],
        projectLink: '',
        processAndChallengeDescription: '',
        processAndChallengeDescription2: '',
        summaryDescription: '',
        processAndChallengePoints: [''],
        bigImage: null,
        miniImages: [],
      });
    }
    setStep(1);
    setErrors({});
  }, [editingProject, isOpen]);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: ProjectFormErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.projectCategory) newErrors.projectCategory = 'Project category is required';

      // Validate project link URL if provided
      if (formData.projectLink && formData.projectLink.trim()) {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(formData.projectLink.trim())) {
          newErrors.projectLink = 'Project link must be a valid URL starting with http:// or https://';
        }
      }

      if (formData.bigImage) {
        const fileError = validateFile(formData.bigImage, 'image');
        if (fileError) newErrors.bigImage = fileError;
      }
    }

    if (currentStep === 2) {
      if (!formData.processAndChallengeDescription.trim()) {
        newErrors.processAndChallengeDescription = 'Process and challenge description is required';
      }
      
      if (formData.miniImages && formData.miniImages.length > 3) {
        newErrors.miniImages = 'Maximum 3 mini images allowed';
      }
      
      if (formData.miniImages) {
        for (const image of formData.miniImages) {
          const fileError = validateFile(image, 'image');
          if (fileError) {
            newErrors.miniImages = fileError;
            break;
          }
        }
      }
    }

    if (currentStep === 3) {
      if (!formData.summaryDescription.trim()) {
        newErrors.summaryDescription = 'Summary description is required';
      }
      
      const validPoints = formData.processAndChallengePoints.filter(point => point.trim());
      if (validPoints.length === 0) {
        newErrors.processAndChallengePoints = ['At least one process point is required'];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step) && step < 3) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      // Filter out empty process points
      const filteredData = {
        ...formData,
        processAndChallengePoints: formData.processAndChallengePoints.filter(point => point.trim())
      };
      onSubmit(filteredData);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof ProjectFormErrors]) {
      setErrors({ ...errors, [field as keyof ProjectFormErrors]: undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'bigImage' | 'miniImages') => {
    const files = e.target.files;
    if (!files) return;

    if (field === 'bigImage') {
      const file = files[0] || null;
      handleInputChange(field, file);
    } else if (field === 'miniImages') {
      const fileArray = Array.from(files).slice(0, 3); // Limit to 3 files
      handleInputChange(field, fileArray);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addProcessPoint = () => {
    handleInputChange('processAndChallengePoints', [...formData.processAndChallengePoints, '']);
  };

  const updateProcessPoint = (index: number, value: string) => {
    const newPoints = [...formData.processAndChallengePoints];
    newPoints[index] = value;
    handleInputChange('processAndChallengePoints', newPoints);
  };

  const removeProcessPoint = (index: number) => {
    if (formData.processAndChallengePoints.length > 1) {
      const newPoints = formData.processAndChallengePoints.filter((_, i) => i !== index);
      handleInputChange('processAndChallengePoints', newPoints);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter project title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor="description">Project Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter project description"
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Project Category *</Label>
          <Select
            value={formData.projectCategory}
            onValueChange={(value) => handleInputChange('projectCategory', value)}
          >
            <SelectTrigger className={errors.projectCategory ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectCategory && <p className="text-red-500 text-sm mt-1">{errors.projectCategory}</p>}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange('status', value as ProjectStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name (Optional)</Label>
          <Input
            id="clientName"
            value={formData.clientName || ''}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Enter client name"
            className={errors.clientName ? 'border-red-500' : ''}
          />
          {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
        </div>

        <div>
          <Label htmlFor="projectDeliveryDate">Project Delivery Date (Optional)</Label>
          <Input
            id="projectDeliveryDate"
            type="date"
            value={formData.projectDeliveryDate || ''}
            onChange={(e) => handleInputChange('projectDeliveryDate', e.target.value)}
            className={errors.projectDeliveryDate ? 'border-red-500' : ''}
          />
          {errors.projectDeliveryDate && <p className="text-red-500 text-sm mt-1">{errors.projectDeliveryDate}</p>}
          <p className="text-sm text-gray-500 mt-1">Select the project delivery date</p>
        </div>
      </div>

      <div>
        <Label htmlFor="projectLink">Project Link (Optional)</Label>
        <Input
          id="projectLink"
          value={formData.projectLink || ''}
          onChange={(e) => handleInputChange('projectLink', e.target.value)}
          placeholder="https://example.com"
          className={errors.projectLink ? 'border-red-500' : ''}
        />
        {errors.projectLink && <p className="text-red-500 text-sm mt-1">{errors.projectLink}</p>}
        <p className="text-sm text-gray-500 mt-1">Enter the live URL of your project (must start with http:// or https://)</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => handleInputChange('featured', e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="featured">Featured Project</Label>
      </div>

      <div>
        <Label htmlFor="bigImage">Big Image</Label>
        <Input
          id="bigImage"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'bigImage')}
          className={errors.bigImage ? 'border-red-500' : ''}
        />
        {errors.bigImage && <p className="text-red-500 text-sm mt-1">{errors.bigImage}</p>}
        {formData.bigImage && (
          <p className="text-sm text-gray-600 mt-1">
            Selected: {formData.bigImage.name} ({formatFileSize(formData.bigImage.size)})
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm">
            <FaPlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <FaTimes
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="processDescription">Process & Challenge Description *</Label>
        <ProjectTiptapEditor
          content={formData.processAndChallengeDescription}
          onChange={(content) => handleInputChange('processAndChallengeDescription', content)}
          placeholder="Describe the process and challenges faced during the project..."
          className={errors.processAndChallengeDescription ? 'border-red-500' : ''}
        />
        {errors.processAndChallengeDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.processAndChallengeDescription}</p>
        )}
      </div>

      <div>
        <Label htmlFor="processDescription2">Additional Process Description (Optional)</Label>
        <ProjectTiptapEditor
          content={formData.processAndChallengeDescription2 || ''}
          onChange={(content) => handleInputChange('processAndChallengeDescription2', content)}
          placeholder="Additional process details..."
        />
      </div>

      <div>
        <Label htmlFor="miniImages">Mini Images (Max 3)</Label>
        <Input
          id="miniImages"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e, 'miniImages')}
          className={errors.miniImages ? 'border-red-500' : ''}
        />
        {errors.miniImages && <p className="text-red-500 text-sm mt-1">{errors.miniImages}</p>}
        {formData.miniImages && formData.miniImages.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">Selected images:</p>
            {formData.miniImages.map((file, index) => (
              <p key={index} className="text-sm text-gray-600">
                {index + 1}. {file.name} ({formatFileSize(file.size)})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="summaryDescription">Summary Description *</Label>
        <ProjectTiptapEditor
          content={formData.summaryDescription}
          onChange={(content) => handleInputChange('summaryDescription', content)}
          placeholder="Provide a summary of the project..."
          className={errors.summaryDescription ? 'border-red-500' : ''}
        />
        {errors.summaryDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.summaryDescription}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Process & Challenge Points *</Label>
          <Button type="button" onClick={addProcessPoint} size="sm" variant="outline">
            <FaPlus className="h-4 w-4 mr-1" />
            Add Point
          </Button>
        </div>

        <div className="space-y-2">
          {formData.processAndChallengePoints.map((point, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={point}
                onChange={(e) => updateProcessPoint(index, e.target.value)}
                placeholder={`Process point ${index + 1}`}
                className="flex-1"
              />
              {formData.processAndChallengePoints.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeProcessPoint(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {errors.processAndChallengePoints && (
          <p className="text-red-500 text-sm mt-1">{errors.processAndChallengePoints[0]}</p>
        )}
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Images & Content';
      case 3: return 'Process & Summary';
      default: return 'Project Details';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#F89453]">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Step {step} of 3: {getStepTitle()}
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber === step
                      ? 'bg-[#F89453] text-white'
                      : stepNumber < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#F89453] hover:bg-[#e07b39]"
              >
                Next
                <FaArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#F89453] hover:bg-[#e07b39]"
              >
                {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
