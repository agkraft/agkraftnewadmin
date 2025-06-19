// @ts-ignore
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaTimes } from 'react-icons/fa';

type VenueFormData = {
  photo: FileList;
  name: string;
  location: string;
  category: string;
  totalCapacity: number;
  totalSeats: number;
};

type VenueModalProps = {
  onSubmit: (data: { name: string; location: string; category: string; photo: string; totalCapacity: number; totalSeats: number }) => void;
};

const VenueModal = ({ onSubmit }: VenueModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<VenueFormData>();

  const onFormSubmit = (data: VenueFormData) => {
    const venueData = {
      name: data.name,
      location: data.location,
      category: data.category,
      photo: data.photo[0] ? URL.createObjectURL(data.photo[0]) : 'placeholder.jpg',
      totalCapacity: Number(data.totalCapacity),
      totalSeats: Number(data.totalSeats),
    };
    console.log('Form Submitted Successfully:', venueData);
    onSubmit(venueData);
    reset(); // Reset form after submission
    setPreviewUrl(null); // Clear preview
    setIsOpen(false); // Close the modal after submission
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setValue('photo', null as any); // Clear file input
    setPreviewUrl(null); // Clear preview
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="bg-[#F89453] text-white p-2 rounded-md hover:bg-[#313131] transition duration-200"
        >
          Add Venue
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#F89453] text-lg font-bold">Add New Venue</DialogTitle>
        </DialogHeader>
        <div className="w-full bg-white p-3">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Photo</label>
              <div className="relative mt-1">
                <input
                  type="file"
                  accept="image/*"
                  {...register('photo', { onChange: handleFileChange })}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F89453] file:text-white hover:file:bg-[#e07b39]"
                />
                {previewUrl && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    title="Clear image"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              {previewUrl && (
                <div className="mt-2 flex flex-row">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="h-14 w-14 object-cover rounded-md border border-[#313131]"
                  />
                </div>
              )}
            </div>
            <div className='w-full flex flex-row justify-center items-center gap-5'>
                <div className='w-1/2'>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="mt-1 block w-full p-2 border outline-none  border-[#313131] rounded-md "
                placeholder="Enter venue name"
              />
            </div>
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                {...register('location', { required: true })}
                className="mt-1 block w-full p-2 border border-[#313131] outline-none  rounded-md "
                placeholder="Enter location"
              />
            </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category (Type of Venue)</label>
              <select
                {...register('category', { required: true })}
                className="mt-1 block w-full p-2 border border-[#313131] outline-none rounded-md "
              >
                <option value="">Select a category</option>
                <option value="Conference">Conference</option>
                <option value="Wedding">Wedding</option>
                <option value="Concert">Concert</option>
                <option value="Party">Party</option>
              </select>
            </div>

            <div className='w-full flex flex-row justify-center items-center gap-5'>
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-gray-700">Total Capacity</label>
              <input
                type="number"
                {...register('totalCapacity', { required: true, min: 1 })}
                className="mt-1 block w-full p-2 border border-[#313131] rounded-md outline-none"
                placeholder="Enter total capacity"
                min="1"
              />
            </div>
            <div className='w-1/2'>
              <label className="block text-sm font-medium text-gray-700">Total Seats</label>
              <input
                type="number"
                {...register('totalSeats', { required: true, min: 0 })}
                className="mt-1 block w-full p-2 border border-[#313131] rounded-md outline-none"
                placeholder="Enter total seats"
                min="0"
              />
            </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="submit"
                className="w-[10rem] bg-[#F89453] text-white p-2 rounded-md hover:bg-[#313131] transition duration-200"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-[10rem] bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueModal;