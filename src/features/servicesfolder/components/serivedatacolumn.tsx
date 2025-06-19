import React from 'react';
import { DataTable } from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

// Define the Card type matching CardModal
interface Card {
  name: string;
  description: string;
  svgIcon: File | null;
  title: string;
  firstDescription: string;
  image: File | null;
  points: { subtitle: string; subdescription: string }[];
}

// Define columns for the DataTable
const columns: ColumnDef<Card>[] = [
  {
    accessorKey: 'name',
    header: 'Card Name',
    cell: ({ row }) => <div className="font-medium text-gray-900">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-gray-600 max-w-xs truncate">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="text-gray-900">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'firstDescription',
    header: 'First Description',
    cell: ({ row }) => (
      <div className="text-gray-600 max-w-xs truncate">{row.getValue('firstDescription')}</div>
    ),
  },
  {
    accessorKey: 'points',
    header: 'Points',
    cell: ({ row }) => {
      const points = row.getValue('points') as Card['points'];
      return (
        <div className="text-gray-600">
          {points.map((point, index) => (
            <div key={index} className="truncate">
              {point.subtitle}: {point.subdescription}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => console.log(`Edit card ${row.getValue('name')}`)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-800"
          onClick={() => console.log(`Delete card ${row.getValue('name')}`)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

interface CardDataTableProps {
  cards: Card[];
  loading: boolean | undefined; // Add loading prop
}

const CardDataTable: React.FC<CardDataTableProps> = ({ cards, loading }) => {
  return (
    <div className="container mx-auto py-6 px-2">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Card List</h2>
        <DataTable
          columns={columns}
          data={cards}
          loading={loading} // Pass loading prop
          title="Card List" // Pass title prop
        />
      </div>
    </div>
  );
};

export default CardDataTable;