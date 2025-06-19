// @ts-ignore
import React, { useState } from 'react';
import ReviewModalForm from './reviewmodalfrom';
import ReviewColumnTable from './reviewcolumntable';

interface Review {
  id: string;
  name: string;
  review: string;
  type: string;
  profileImage: File | null;
  rating: number;
}

const RatereviewMain = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = (newReview: Omit<Review, 'id'>) => {
    setReviews((prev) => [
      ...prev,
      { ...newReview, id: Date.now().toString() }, // Simple ID for demo
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className='w-full flex flex-row items-center justify-between'>
          <p className='text-xl font-semibold'>Review Sections</p>
          <ReviewModalForm addReview={addReview} />
        </div>
        <ReviewColumnTable reviews={reviews} />
      </div>
    </div>
  );
};

export default RatereviewMain;