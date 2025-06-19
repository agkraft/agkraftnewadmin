// @ts-ignore
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Review {
  name: string;
  review: string;
  type: string;
  profileImage: File | null;
  rating: number;
}

interface ReviewModalFormProps {
  addReview: (newReview: Review) => void;
}

const ReviewModalForm = ({ addReview }: ReviewModalFormProps) => {
  const [name, setName] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [warning, setWarning] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfileImage(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setWarning('Please enter a name.');
      return;
    }
    if (!review.trim()) {
      setWarning('Please enter a review.');
      return;
    }
    if (!type) {
      setWarning('Please select a type.');
      return;
    }
    if (rating === 0) {
      setWarning('Please select a rating.');
      return;
    }
    addReview({ name, review, type, profileImage, rating });
    setName('');
    setReview('');
    setType('');
    setProfileImage(null);
    setRating(0);
    setWarning('');
    setOpen(false);
    alert('Review submitted successfully!');
  };

  return (
    <div className="max-w-xl ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-[#fd7637] hover:bg-[#F06D31] text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-md"
          >
            Create Review
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl bg-[#FFEDE3] p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Create Review
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-md border-gray-300  focus:border-[#fd7637]"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                Review
              </label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review"
                className="w-full rounded-md border-gray-300  focus:ring-[#fd7637] focus:border-[#fd7637] min-h-[60px]"
                required
              />
            </div>
           {/* type and image */}
          <div className='w-full gap-4 flex flex-row items-center justify-center'>
             <div className="space-y-2 w-1/2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full rounded-md  s">
                  <SelectValue placeholder="Select review type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-1/2">
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <Input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border-gray-300 file:mr-4  file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#fd7637] cursor-pointer hover:file:bg-[#ffeee6]"
              />
            </div>
          </div>



            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="flex  justify-center gap-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-500'
                    } hover:scale-110`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            {warning && <p className="text-red-500 text-sm font-medium">{warning}</p>}
            <Button
              type="submit"
              className="w-full bg-[#fd7637] hover:bg-[#F06D31] text-white font-semibold py-2 rounded-md transition duration-200 shadow-md"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewModalForm;