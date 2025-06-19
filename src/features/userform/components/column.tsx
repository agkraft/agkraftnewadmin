"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FormType } from "../type/form.type";

export const columns: ColumnDef<FormType>[] = [
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
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First name
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=" pl-4">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last name
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("last_name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          email
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          phone no.
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          country
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("country")}</div>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          city
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("city")}</div>,
  },
  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          message
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("message")}</div>,
  },
  {
    accessorKey: "services",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          services
        </Button>
      );
    },
    cell: ({ row }) => <div className=" pl-4">{row.getValue("services")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
];
