import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaTimes } from 'react-icons/fa';
import { VenueType } from './venuetablecolumn';

type VenueFormData = {
  photo: FileList | undefined;
  name: string;
  location: string;
  category: string;
  totalCapacity: number;
  totalSeats: number;
};

type VenueEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: { name: string; location: string; category: string; photo: string; totalCapacity: number; totalSeats: number }) => void;
  venue: VenueType | null;
};

const VenueEditModal = ({ isOpen, onClose, onSubmit, venue }: VenueEditModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<VenueFormData>({
    defaultValues: {
      name: '',
      location: '',
      category: '',
      photo: undefined,
      totalCapacity: 1,
      totalSeats: 0,
    },
  });

  useEffect(() => {
    if (venue) {
      setValue('name', venue.name);
      setValue('location', venue.location);
      setValue('category', venue.category);
      setValue('totalCapacity', venue.totalCapacity);
      setValue('totalSeats', venue.totalSeats);
      setPreviewUrl(venue.photo);
    }
  }, [venue, setValue]);

  const onFormSubmit = (data: VenueFormData) => {
    if (!venue) return;
    const venueData = {
      name: data.name,
      location: data.location,
      category: data.category,
      photo: data.photo && data.photo[0] ? URL.createObjectURL(data.photo[0]) : venue.photo,
      totalCapacity: Number(data.totalCapacity),
      totalSeats: Number(data.totalSeats),
    };
    console.log('Form Updated Successfully:', venueData);
    onSubmit(venue.id, venueData);
    reset();
    setPreviewUrl(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFile = () => {
    setValue('photo', undefined);
    setPreviewUrl(venue?.photo || null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#F89453] text-lg font-bold">Edit Venue</DialogTitle>
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
            <div className="w-full flex flex-row justify-center items-center gap-5">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="mt-1 block w-full p-2 border outline-none border-[#313131] rounded-md"
                  placeholder="Enter venue name"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  {...register('location', { required: true })}
                  className="mt-1 block w-full p-2 border border-[#313131] outline-none rounded-md"
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category (Type of Venue)</label>
              <select
                {...register('category', { required: true })}
                className="mt-1 block w-full p-2 border border-[#313131] outline-none rounded-md"
              >
                <option value="">Select a category</option>
                <option value="Conference">Conference</option>
                <option value="Wedding">Wedding</option>
                <option value="Concert">Concert</option>
                <option value="Party">Party</option>
              </select>
            </div>
            <div className="w-full flex flex-row justify-center items-center gap-5">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Total Capacity</label>
                <input
                  type="number"
                  {...register('totalCapacity', { required: true, min: 1 })}
                  className="mt-1 block w-full p-2 border border-[#313131] rounded-md outline-none"
                  placeholder="Enter total capacity"
                  min="1"
                />
              </div>
              <div className="w-1/2">
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
                Update
              </button>
              <button
                type="button"
                onClick={onClose}
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

export default VenueEditModal;