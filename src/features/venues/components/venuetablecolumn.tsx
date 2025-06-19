"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FaTrash, FaEdit } from "react-icons/fa";

export type VenueType = {
  id: number;
  name: string;
  location: string;
  category: string;
  photo: string;
  totalCapacity: number;
  totalSeats: number;
};

export const columns = (openEditModal: (venue: VenueType) => void): ColumnDef<VenueType>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div
        className="flex flex-row"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        S.No.
      </div>
    ),
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "photo",
    header: () => <div className="flex flex-row">Image</div>,
    cell: ({ row }) => (
      <div>
        <img src={row.getValue("photo")} className="w-10 h-10" alt="Venue" />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Location
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue("location")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "totalCapacity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Capacity
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue("totalCapacity")}</div>,
  },
  {
    accessorKey: "totalSeats",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Seats
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue("totalSeats")}</div>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="text-[#313131] hover:text-[#e07b39]"
          onClick={() => openEditModal(row.original)}
        >
          <FaEdit />
        </Button>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={() => console.log("Delete venue:", row.original)}
        >
          <FaTrash />
        </Button>
      </div>
    ),
  },
];