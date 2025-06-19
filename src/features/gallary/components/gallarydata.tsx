// gallarydata.tsx
export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
}

const galleryData: GalleryPhoto[] = [
  {
    id: "1",
    title: "Sunset Over Mountains",
    category: "Nature",
    url: "https://picsum.photos/seed/1/800/600",
  },
  {
    id: "2",
    title: "City Skyline",
    category: "Urban",
    url: "https://picsum.photos/seed/2/800/600",
  },
  {
    id: "3",
    title: "Blooming Flowers",
    category: "Nature",
    url: "https://picsum.photos/seed/3/800/600",
  },
  {
    id: "4",
    title: "Vintage Car",
    category: "Automobile",
    url: "https://picsum.photos/seed/4/800/600",
  },
  {
    id: "5",
    title: "Beach Waves",
    category: "Nature",
    url: "https://picsum.photos/seed/5/800/600",
  },
  {
    id: "6",
    title: "Downtown Lights",
    category: "Urban",
    url: "https://picsum.photos/seed/6/800/600",
  },
  {
    id: "7",
    title: "Classic Motorcycle",
    category: "Automobile",
    url: "https://picsum.photos/seed/7/800/600",
  },
  {
    id: "8",
    title: "Forest Path",
    category: "Nature",
    url: "https://picsum.photos/seed/8/800/600",
  },
];

export default galleryData;