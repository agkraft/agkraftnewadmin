import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import galleryData from './gallarydata'; // Adjust path as needed
import { GalleryPhoto } from './gallarydata';

const GallaryMain = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(galleryData);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // Dummy categories for the dropdown
  const dummyCategories = [
    'Nature',
    'Urban',
    'Automobile',
    'Portrait',
    'Architecture',
    'Travel',
  ];

  // Handle file selection with typed event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !category || selectedFiles.length === 0) {
      alert('Please fill all fields and select at least one photo');
      return;
    }

    const newPhotos: GalleryPhoto[] = selectedFiles.map((file) => ({
      id: (Date.now() + Math.random()).toString(),
      title,
      category,
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setTitle('');
    setCategory('');
    setSelectedFiles([]);
    setOpen(false);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6 bg-[#f98943]">Upload Photos</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#FFEDE3]">
          <DialogHeader >
            <DialogTitle >Upload Photos</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter photo title"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {dummyCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="photos">Select Photos</Label>
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <Button variant={"outline"} type="submit" className="w-full text-white hover:text-white bg-[#f98943] hover:bg-[#ff7b2a]">
              Upload
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <p className="text-center col-span-full">No photos uploaded yet</p>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.id}
              className="border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">{photo.title}</h3>
              <p className="text-sm text-gray-600">{photo.category}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GallaryMain;