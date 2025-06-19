// @ts-ignore
import React, { useState } from 'react';
import HeroImageForm from './heroimageform';
import AllImageHeroSection from './allImageherosection';

interface ImageSet {
  name: string;
  images: File[];
}

const HomeHeroSectionMain = () => {
  const [imageSets, setImageSets] = useState<ImageSet[]>([]);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);

  const addImageSet = (newSet: ImageSet) => {
    setImageSets((prev) => [...prev, newSet]);
  };

  const activateSet = (index: number) => {
    setActiveSetIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto space-y-8">
       <div className='flex flex-row justify-between items-center'>
        <p className='text-xl font-bold'>Hero Section Images</p>
         <HeroImageForm addImageSet={addImageSet} />
       </div>
        <AllImageHeroSection
          imageSets={imageSets}
          activeSetIndex={activeSetIndex}
          activateSet={activateSet}
        />
      </div>
    </div>
  );
};

export default HomeHeroSectionMain;