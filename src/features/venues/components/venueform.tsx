// @ts-ignore
import React from 'react';
import { useForm } from 'react-hook-form';

type VenueFormData = {
  photo: FileList;
  name: string;
  location: string;
  category: string;
};

type VenueFormProps = {
  onSubmit: (data: { name: string; location: string; category: string; photo: string }) => void;
  onClose: () => void;
};

const VenueForm = ({ onSubmit, onClose }: VenueFormProps) => {
  const { register, handleSubmit, reset } = useForm<VenueFormData>();

  const onFormSubmit = (data: VenueFormData) => {
    const venueData = {
      name: data.name,
      location: data.location,
      category: data.category,
      photo: data.photo[0] ? URL.createObjectURL(data.photo[0]) : 'placeholder.jpg', // Temporary URL for image
    };
    console.log('Form Submitted Successfully:', venueData);
    onSubmit(venueData);
    reset(); // Reset form after submission
    onClose(); // Close the modal after submission
  };

  return (
    <div className="w-full bg-white p-3">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            accept="image/*"
            {...register('photo')}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F89453] file:text-white hover:file:bg-[#e07b39]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="mt-1 block w-full p-2 border border-[#313131] rounded-md focus:ring-2 focus:ring-[#313131]"
            placeholder="Enter venue name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            {...register('location', { required: true })}
            className="mt-1 block w-full p-2 border border-[#313131] rounded-md focus:ring-2 focus:ring-[#313131]"
            placeholder="Enter location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category (Type of Venue)</label>
          <select
            {...register('category', { required: true })}
            className="mt-1 block w-full p-2 border border-[#313131] outline-none rounded-md focus:ring-2 focus:ring-[#313131]"
          >
            <option value="">Select a category</option>
            <option value="Conference">Conference</option>
            <option value="Wedding">Wedding</option>
            <option value="Concert">Concert</option>
            <option value="Party">Party</option>
          </select>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            type="submit"
            className="w-[10rem] bg-[#F89453] text-white p-2 rounded-md hover:bg-[#313131] transition duration-200"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-[10rem] bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VenueForm;