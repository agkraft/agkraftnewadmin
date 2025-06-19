// @ts-ignore
import React, { useState } from 'react';
import VenueTable from './venuetable';
import VenueModal from './venuemodal';
import VenueEditModal from './venueeditmodal';
import { VenueType } from './venuetablecolumn';
import { toast } from 'react-toastify';

const initialData: VenueType[] = [
  { id: 1, name: 'Grand Hall', location: 'Mumbai', category: 'Conference', photo: 'grand_hall.jpg', totalCapacity: 500, totalSeats: 400 },
  { id: 2, name: 'Bliss Venue', location: 'Delhi', category: 'Wedding', photo: 'bliss_venue.jpg', totalCapacity: 300, totalSeats: 250 },
  { id: 3, name: 'Star Arena', location: 'Bangalore', category: 'Concert', photo: 'star_arena.jpg', totalCapacity: 1000, totalSeats: 800 },
  { id: 4, name: 'Party Plaza', location: 'Chennai', category: 'Party', photo: 'party_plaza.jpg', totalCapacity: 200, totalSeats: 150 },
];

const VenueFile = () => {
  const [venues, setVenues] = useState<VenueType[]>(initialData);
  const [editVenue, setEditVenue] = useState<VenueType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddSubmit = (data: { name: string; location: string; category: string; photo: string; totalCapacity: number; totalSeats: number }) => {
    const newVenue: VenueType = {
      id: venues.length + 1, // Simple ID generation for demo
      ...data,
    };
    setVenues([...venues, newVenue]);
    toast.success('Venue added successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleEditSubmit = (id: number, data: { name: string; location: string; category: string; photo: string; totalCapacity: number; totalSeats: number }) => {
    setVenues(venues.map((venue) => (venue.id === id ? { ...venue, ...data } : venue)));
    toast.success('Venue updated successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const openEditModal = (venue: VenueType) => {
    setEditVenue(venue);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditVenue(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-3 bg-[#F0EFF3] min-h-screen flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#313131]">Venues Data</span>
        <VenueModal onSubmit={handleAddSubmit} />
      </div>
      <VenueTable data={venues} openEditModal={openEditModal} />
      <VenueEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        venue={editVenue}
      />
    </div>
  );
};

export default VenueFile;