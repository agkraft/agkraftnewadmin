// @ts-ignore
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/datatable/data-table';

interface Review {
  id: string;
  name: string;
  review: string;
  type: string;
  profileImage: File | null;
  rating: number;
}

interface ReviewColumnTableProps {
  reviews: Review[];
}

const columns: ColumnDef<Review>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: 'review',
    header: 'Review',
    cell: ({ row }) => <span className='max-w-[200px]'>{row.original.review}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <span>{row.original.type}</span>,
  },
  {
    accessorKey: 'profile',
    header: 'Profile',
    cell: ({ row }) => (
      <div>
        {row.original.profileImage ? (
          <img
            src={URL.createObjectURL(row.original.profileImage)}
            alt={`${row.original.name}'s profile`}
            className="w-12 h-12 object-cover rounded-full"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${row.original.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    ),
  },
];

const ReviewColumnTable = ({ reviews }: ReviewColumnTableProps) => {
  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review List</h2>
      <DataTable
        columns={columns}
        data={reviews}
        loading={false} // No API, so no loading state for now
        title="Reviews"
      />
    </div>
  );
};

export default ReviewColumnTable;