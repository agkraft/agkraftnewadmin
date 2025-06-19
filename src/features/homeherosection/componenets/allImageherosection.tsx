// @ts-ignore
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImageSet {
  name: string;
  images: File[];
}

interface AllImageHeroSectionProps {
  imageSets: ImageSet[];
  activeSetIndex: number | null;
  activateSet: (index: number) => void;
}

const AllImageHeroSection = ({ imageSets, activeSetIndex, activateSet }: AllImageHeroSectionProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleActivate = (index: number) => {
    setSelectedIndex(index);
    setOpenDialog(true);
  };

  const confirmActivate = () => {
    if (selectedIndex !== null) {
      activateSet(selectedIndex);
      setOpenDialog(false);
      setSelectedIndex(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Hero Image Sets</h2>
      {imageSets.length === 0 ? (
        <p className="text-gray-500 text-center">No image sets available. Submit some above!</p>
      ) : (
        <div className="space-y-6">
          {imageSets.map((set, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                activeSetIndex === index ? 'border-[#fd7637] bg-[#f1e0d8]' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{set.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleActivate(index)}
                      className="text-[#fd7637] hover:bg-blue-50"
                    >
                      Activate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {set.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="p-2 border border-gray-200 rounded-md">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`${set.name} - Image ${imgIndex + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <p className="text-sm text-gray-600 mt-2 text-center">{image.name}</p>
                  </div>
                ))}
              </div>
              {activeSetIndex === index && (
                <p className="text-[#3697f1]  text-sm mt-2 text-center">Active Set</p>
              )}
            </div>
          ))}
        </div>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Activation</DialogTitle>
           
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmActivate}
              className="bg-[#fd7637] hover:bg-[#F06D31] text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllImageHeroSection;