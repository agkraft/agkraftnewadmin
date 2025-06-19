import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface Card {
  name: string;
  description: string;
  svgIcon: File | null;
  title: string;
  firstDescription: string;
  image: File | null;
  points: { subtitle: string; subdescription: string }[];
}

interface CardModalProps {
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

const CardModal: React.FC<CardModalProps> = ({ setCards }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Card>({
    name: '',
    description: '',
    svgIcon: null,
    title: '',
    firstDescription: '',
    image: null,
    points: [{ subtitle: '', subdescription: '' }, { subtitle: '', subdescription: '' }, { subtitle: '', subdescription: '' }],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Card | string, string>>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof Card | string, string>> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Card Name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.svgIcon) newErrors.svgIcon = 'SVG Icon is required';
    } else if (currentStep === 2) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.firstDescription.trim()) newErrors.firstDescription = 'First Description is required';
      if (!formData.image) newErrors.image = 'Image is required';
    } else if (currentStep === 3) {
      formData.points.forEach((point, index) => {
        if (!point.subtitle.trim()) newErrors[`subtitle-${index}`] = `Subtitle ${index + 1} is required`;
        if (!point.subdescription.trim()) newErrors[`subdescription-${index}`] = `Subdescription ${index + 1} is required`;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
        setErrors({});
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Card) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'svgIcon' | 'image') => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [field]: file });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handlePointChange = (index: number, field: 'subtitle' | 'subdescription', value: string) => {
    const updatedPoints = formData.points.map((point, i) =>
      i === index ? { ...point, [field]: value } : point
    );
    setFormData({ ...formData, points: updatedPoints });
    if (errors[`${field}-${index}`]) {
      setErrors({ ...errors, [`${field}-${index}`]: undefined });
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      setCards((prevCards) => [...prevCards, formData]);
      console.log('Submitted Card:', formData);
      setFormData({
        name: '',
        description: '',
        svgIcon: null,
        title: '',
        firstDescription: '',
        image: null,
        points: [{ subtitle: '', subdescription: '' }, { subtitle: '', subdescription: '' }, { subtitle: '', subdescription: '' }],
      });
      setStep(1);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      svgIcon: null,
      title: '',
      firstDescription: '',
      image: null,
      points: [{ subtitle: '', subdescription: '' }, { subtitle: '', subdescription: '' }, { subtitle: '', subdescription: '' }],
    });
    setStep(1);
    setErrors({});
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
      <div className='flex flex-row justify-between mx-4'>
          <div className='text-[20px] font-semibold'>
          Service Pages
        </div>
        <Button className='bg-[#FE8147] hover:bg-[#f06d31]'>Add New Card</Button>
      </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Add Card - Step 1' : step === 2 ? 'Add Card - Step 2' : 'Add Card - Step 3'}
          </DialogTitle>
        </DialogHeader>
        {step === 1 ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Card Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange(e, 'name')}
                placeholder="Enter card name"
                className={`w-full outline-none ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange(e, 'description')}
                placeholder="Enter card description"
                className={`w-full outline-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className

="grid gap-2">
              <Label htmlFor="svgIcon">SVG Icon</Label>
              <Input
                id="svgIcon"
                type="file"
                accept=".svg"
                onChange={(e) => handleFileChange(e, 'svgIcon')}
                className={`w-full ${errors.svgIcon ? 'border-red-500' : ''}`}
              />
              {errors.svgIcon && <p className="text-red-500 text-sm">{errors.svgIcon}</p>}
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={handleNext} className='bg-[#FE8147] hover:bg-[#f06d31]'>Next</Button>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                placeholder="Enter card title"
                className={`w-full ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstDescription">First Description</Label>
              <Textarea
                id="firstDescription"
                value={formData.firstDescription}
                onChange={(e) => handleInputChange(e, 'firstDescription')}
                placeholder="Enter first description"
                className={`w-full ${errors.firstDescription ? 'border-red-500' : ''}`}
              />
              {errors.firstDescription && <p className="text-red-500 text-sm">{errors.firstDescription}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
                className={`w-full ${errors.image ? 'border-red-500' : ''}`}
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} className='bg-[#FE8147] hover:bg-[#f06d31]'>Next</Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>How We Work</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.points.map((point, index) => (
                  <div key={index} className="grid gap-2">
                    <Input
                      id={`subtitle-${index}`}
                      placeholder={`Subtitle ${index + 1}`}
                      value={point.subtitle}
                      onChange={(e) => handlePointChange(index, 'subtitle', e.target.value)}
                      className={`w-full ${errors[`subtitle-${index}`] ? 'border-red-500' : ''}`}
                    />
                    {errors[`subtitle-${index}`] && <p className="text-red-500 text-sm">{errors[`subtitle-${index}`]}</p>}
                    <Textarea
                      id={`subdescription-${index}`}
                      placeholder={`Subdescription ${index + 1}`}
                      value={point.subdescription}
                      onChange={(e) => handlePointChange(index, 'subdescription', e.target.value)}
                      className={`w-full ${errors[`subdescription-${index}`] ? 'border-red-500' : ''}`}
                    />
                    {errors[`subdescription-${index}`] && <p className="text-red-500 text-sm">{errors[`subdescription-${index}`]}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleSubmit} className='bg-[#FE8147] hover:bg-[#f06d31]'>Submit</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;