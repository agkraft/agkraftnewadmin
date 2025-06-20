import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, FileVideo, FileImage } from 'lucide-react';
import ServiceTiptapEditor from './ServiceTiptapEditor';
import { 
  ServiceFormData, 
  ServiceFormErrors, 
  SERVICE_CATEGORIES, 
  SERVICE_STATUSES,
  ServiceType,
  QuestionAnswer
} from '../types/serviceTypes';
import { validateFile, formatFileSize } from '../api/serviceApi';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  editingService?: ServiceType | null;
  isLoading?: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingService,
  isLoading = false 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: '',
    status: 'active',
    featured: false,
    tags: [],
    iconBgColor: '#ffffff',
    serviceDescription: '',
    importantPoints: [''],
    questionsAnswers: [{ question: '', answer: '', order: 1 }],
    icon: null,
    video: null,
  });
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [tagInput, setTagInput] = useState('');

  // Validate hex color code
  const isValidHexColor = (color: string): boolean => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  };

  // Helper function to parse malformed tags from backend
  const parseTags = (tags: string[]): string[] => {
    if (!tags || !Array.isArray(tags)) return [];

    try {
      // Check if tags are malformed (double stringified)
      if (tags.length > 0 && typeof tags[0] === 'string' &&
          (tags[0].startsWith('[') || tags[0].startsWith('["'))) {
        // Join all tag elements and parse as JSON
        const joinedTags = tags.join('');
        const parsedTags = JSON.parse(joinedTags);
        return Array.isArray(parsedTags) ? parsedTags : [];
      }

      // If tags are already properly formatted, return as is
      return tags;
    } catch (error) {
      console.error('Error parsing tags:', error);
      // If parsing fails, try to extract individual tags manually
      try {
        const cleanedTags: string[] = [];
        for (const tag of tags) {
          if (typeof tag === 'string') {
            // Remove quotes and brackets
            const cleaned = tag.replace(/^\[?"?|"?\]?$/g, '').replace(/^"|"$/g, '');
            if (cleaned.trim()) {
              cleanedTags.push(cleaned.trim());
            }
          }
        }
        return cleanedTags;
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError);
        return [];
      }
    }
  };

  // Initialize form data when editing
  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title,
        description: editingService.description,
        category: editingService.category || '',
        status: editingService.status,
        featured: editingService.featured,
        tags: parseTags(editingService.tags),
        iconBgColor: editingService.iconBgColor || '#ffffff',
        serviceDescription: editingService.serviceDescription,
        importantPoints: editingService.importantPoints.length > 0 ? editingService.importantPoints : [''],
        questionsAnswers: editingService.questionsAnswers.length > 0 ? editingService.questionsAnswers : [{ question: '', answer: '', order: 1 }],
        icon: null,
        video: null,
      });
    } else {
      // Reset form for new service
      setFormData({
        title: '',
        description: '',
        category: '',
        status: 'active',
        featured: false,
        tags: [],
        iconBgColor: '#ffffff',
        serviceDescription: '',
        importantPoints: [''],
        questionsAnswers: [{ question: '', answer: '', order: 1 }],
        icon: null,
        video: null,
      });
    }
    setStep(1);
    setErrors({});
    setTagInput('');
  }, [editingService, isOpen]);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: ServiceFormErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category || formData.category.length === 0) newErrors.category = 'Category is required';

      if (formData.iconBgColor && !isValidHexColor(formData.iconBgColor)) {
        newErrors.iconBgColor = 'Please enter a valid hex color code (e.g., #ffffff)';
      }

      if (formData.icon) {
        const iconError = validateFile(formData.icon, 'icon');
        if (iconError) newErrors.icon = iconError;
      }
    }

    if (currentStep === 2) {
      if (!formData.serviceDescription.trim()) newErrors.serviceDescription = 'Service description is required';
      
      if (formData.video) {
        const videoError = validateFile(formData.video, 'video');
        if (videoError) newErrors.video = videoError;
      }
    }

    if (currentStep === 3) {
      const pointErrors: string[] = [];
      formData.importantPoints.forEach((point, index) => {
        if (!point.trim()) pointErrors[index] = 'Point is required';
      });
      if (pointErrors.length > 0) newErrors.importantPoints = pointErrors;

      const qaErrors: { question?: string; answer?: string }[] = [];
      formData.questionsAnswers.forEach((qa, index) => {
        const qaError: { question?: string; answer?: string } = {};
        if (!qa.question.trim()) qaError.question = 'Question is required';
        if (!qa.answer.trim()) qaError.answer = 'Answer is required';
        if (qaError.question || qaError.answer) qaErrors[index] = qaError;
      });
      if (qaErrors.length > 0) newErrors.questionsAnswers = qaErrors;
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
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'icon' | 'video') => {
    const file = e.target.files?.[0] || null;
    handleInputChange(field, file);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addImportantPoint = () => {
    handleInputChange('importantPoints', [...formData.importantPoints, '']);
  };

  const updateImportantPoint = (index: number, value: string) => {
    const newPoints = [...formData.importantPoints];
    newPoints[index] = value;
    handleInputChange('importantPoints', newPoints);
  };

  const removeImportantPoint = (index: number) => {
    if (formData.importantPoints.length > 1) {
      const newPoints = formData.importantPoints.filter((_, i) => i !== index);
      handleInputChange('importantPoints', newPoints);
    }
  };

  const addQuestionAnswer = () => {
    const newQA: QuestionAnswer = {
      question: '',
      answer: '',
      order: formData.questionsAnswers.length + 1
    };
    handleInputChange('questionsAnswers', [...formData.questionsAnswers, newQA]);
  };

  const updateQuestionAnswer = (index: number, field: 'question' | 'answer', value: string) => {
    const newQAs = [...formData.questionsAnswers];
    newQAs[index] = { ...newQAs[index], [field]: value };
    handleInputChange('questionsAnswers', newQAs);
  };

  const removeQuestionAnswer = (index: number) => {
    if (formData.questionsAnswers.length > 1) {
      const newQAs = formData.questionsAnswers.filter((_, i) => i !== index);
      handleInputChange('questionsAnswers', newQAs);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrors({});
    setTagInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingService ? 'Edit Service' : 'Add New Service'} - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter service title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter a brief description of the service"
                className={errors.description ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured">Featured Service</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm">
                    Mark as featured
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Service Icon (SVG)</Label>
                <Input
                  id="icon"
                  type="file"
                  accept=".svg"
                  onChange={(e) => handleFileChange(e, 'icon')}
                  className={errors.icon ? 'border-red-500' : ''}
                />
                {formData.icon && (
                  <p className="text-sm text-gray-600">
                    Selected: {formData.icon.name} ({formatFileSize(formData.icon.size)})
                  </p>
                )}
                {errors.icon && <p className="text-red-500 text-sm">{errors.icon}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconBgColor">Icon Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="iconBgColor"
                    type="color"
                    value={formData.iconBgColor}
                    onChange={(e) => handleInputChange('iconBgColor', e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.iconBgColor}
                    onChange={(e) => handleInputChange('iconBgColor', e.target.value)}
                    placeholder="#000000"
                    className={`flex-1 ${errors.iconBgColor ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.iconBgColor && <p className="text-red-500 text-sm">{errors.iconBgColor}</p>}
               
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Enter tag and press Add"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} className="bg-[#FE8147] hover:bg-[#f06d31]">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Detailed Description */}
        {step === 2 && (
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Detailed Service Description *</Label>
              <ServiceTiptapEditor
                content={formData.serviceDescription}
                onChange={(content) => handleInputChange('serviceDescription', content)}
                placeholder="Write a detailed description of your service..."
                minHeight="300px"
              />
              {errors.serviceDescription && <p className="text-red-500 text-sm">{errors.serviceDescription}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Service Video (Optional)</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className={errors.video ? 'border-red-500' : ''}
              />
              {formData.video && (
                <p className="text-sm text-gray-600">
                  Selected: {formData.video.name} ({formatFileSize(formData.video.size)})
                </p>
              )}
              {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
              <p className="text-sm text-gray-500">
                Maximum file size: 100MB. Recommended duration: 5 minutes or less.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} className="bg-[#FE8147] hover:bg-[#f06d31]">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Important Points & Q&A */}
        {step === 3 && (
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Important Points</Label>
                <Button type="button" onClick={addImportantPoint} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Point
                </Button>
              </div>
              {formData.importantPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => updateImportantPoint(index, e.target.value)}
                    placeholder={`Important point ${index + 1}`}
                    className={errors.importantPoints?.[index] ? 'border-red-500' : ''}
                  />
                  {formData.importantPoints.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeImportantPoint(index)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questions & Answers</Label>
                <Button type="button" onClick={addQuestionAnswer} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Q&A
                </Button>
              </div>
              {formData.questionsAnswers.map((qa, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Q&A {index + 1}</Label>
                    {formData.questionsAnswers.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQuestionAnswer(index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={qa.question}
                    onChange={(e) => updateQuestionAnswer(index, 'question', e.target.value)}
                    placeholder="Enter question"
                    className={errors.questionsAnswers?.[index]?.question ? 'border-red-500' : ''}
                  />
                  {errors.questionsAnswers?.[index]?.question && (
                    <p className="text-red-500 text-sm">{errors.questionsAnswers[index].question}</p>
                  )}
                  <Textarea
                    value={qa.answer}
                    onChange={(e) => updateQuestionAnswer(index, 'answer', e.target.value)}
                    placeholder="Enter answer"
                    className={errors.questionsAnswers?.[index]?.answer ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {errors.questionsAnswers?.[index]?.answer && (
                    <p className="text-red-500 text-sm">{errors.questionsAnswers[index].answer}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-[#FE8147] hover:bg-[#f06d31]"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
