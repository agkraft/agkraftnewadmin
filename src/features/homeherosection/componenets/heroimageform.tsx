// @ts-ignore
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImageSet {
  name: string;
  images: File[];
}

interface HeroImageFormProps {
  addImageSet: (newSet: ImageSet) => void;
}

const HeroImageForm = ({ addImageSet }: HeroImageFormProps) => {
  const [name, setName] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [warning, setWarning] = useState<string>('');
  const [open, setOpen] = useState(false); // State to control modal open/close

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length !== 3) {
      setWarning('Please select exactly 3 images.');
      setImages([]);
    } else {
      setWarning('');
      setImages(files);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length !== 3) {
      setWarning('Please select exactly 3 images.');
      return;
    }
    if (!name.trim()) {
      setWarning('Please enter a name.');
      return;
    }
    addImageSet({ name, images });
    setName('');
    setImages([]);
    setWarning('');
    setOpen(false); // Close the modal on successful submission
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-lg">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-[#fd7637] hover:bg-[#F06D31] text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Upload Images
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#FFEDE3] p-6 rounded-lg shadow-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Upload Hero Images
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Upload Images (exactly 3)
              </label>
              <Input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full rounded-md border-gray-300 file:mr-4  file:px-4 file:rounded-md file:border-0  file:text-blue-700 "
              />
            </div>
            {warning && (
              <p className="text-red-500 text-sm">{warning}</p>
            )}
            {images.length === 3 && (
              <div className="space-y-2">
                <p className="text-green-500 text-sm">Selected images:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {images.map((image, index) => (
                    <li key={index}>{image.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#fd7637] hover:bg-[#F06D31] text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroImageForm;