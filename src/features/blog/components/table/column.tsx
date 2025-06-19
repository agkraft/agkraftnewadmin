"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import imageUrl from "@/assets/logo.png";
import { BlogType } from "../../type/blogType";
import { UpdateBlog } from "../../routes/update-blog";

export const columns: ColumnDef<BlogType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          S.No.
        </div>
      );
    },
    cell: ({ row }) => <div className="">{row.index + 1}</div>,
  },
  {
    accessorKey: "image",
    header: () => {
      return <div className="flex flex-row">Image</div>;
    },
    // "Image"
    cell: () => (
      <div className="">
        <img
          src={imageUrl}
          className="w-10 h-10"
          alt=""
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("title")}</div>
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=" pl-4">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    accessorKey: "detail",
    header: "Details",
    cell: () => <UpdateBlog />
  },
];
