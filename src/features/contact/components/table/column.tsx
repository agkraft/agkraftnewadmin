import { ColumnDef } from "@tanstack/react-table";
import { ContactType, getStatusColor, getPriorityColor } from "../../type/contactType";
import { MoreHorizontal, Trash2, Eye, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColumnActions {
  onDelete: (contact: ContactType) => void;
  onView: (contact: ContactType) => void;
}

interface ContactActionsProps {
  contact: ContactType;
  onDelete: (contact: ContactType) => void;
  onView: (contact: ContactType) => void;
}

const ContactActions = ({ contact, onDelete, onView }: ContactActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(contact)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(contact)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = ({ onDelete, onView }: ColumnActions): ColumnDef<ContactType>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          S.No.
        </div>
      );
    },
    cell: ({ row }) => <div className="">{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm truncate max-w-[200px]">{email}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const contact = row.original;
      const countryCode = contact.countryCode || "";
      const phoneNumber = contact.phoneNumber || contact.phone || "";
      const fullPhone = countryCode && phoneNumber ? `${countryCode} ${phoneNumber}` : phoneNumber;

      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{fullPhone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
        </div>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("service")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={`text-xs ${getStatusColor(status as any)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
        </div>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge className={`text-xs ${getPriorityColor(priority as any)}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm truncate max-w-[200px] cursor-pointer">
                {message}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="whitespace-pre-wrap">{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ContactActions
        contact={row.original}
        onDelete={onDelete}
        onView={onView}
      />
    ),
  },
];

// Legacy export for backward compatibility
export const columns = createColumns({
  onDelete: () => {},
  onView: () => {},
});
