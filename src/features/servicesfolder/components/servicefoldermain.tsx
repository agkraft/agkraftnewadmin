import React, { useState } from 'react';
import CardModal from './servicecardmodal';
import CardDataTable from './serivedatacolumn';

// Define the Card type to match CardModal and CardDataTable
interface Card {
  name: string;
  description: string;
  svgIcon: File | null;
  title: string;
  firstDescription: string;
  image: File | null;
  points: { subtitle: string; subdescription: string }[];
}

const ServiceFolderMain: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]); // Initialize as empty array of Card objects

  return (
    <div className="container mx-auto py-4">
      <CardModal setCards={setCards} />
      <CardDataTable cards={cards} loading={false} title="Service Cards" />
    </div>
  );
};

export default ServiceFolderMain;