import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CareerApplication, CareerStatus } from "@/types/careers";

interface ActionsProps {
  application: CareerApplication;
  onView: (application: CareerApplication) => void;
  onDelete: (application: CareerApplication) => void;
  onDownloadCV: (application: CareerApplication) => void;
}

const Actions: React.FC<ActionsProps> = ({ application, onView, onDelete, onDownloadCV }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(application)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownloadCV(application)}>
          <Download className="mr-2 h-4 w-4" />
          Download CV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(application)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Application
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusColors: Record<CareerStatus, string> = {
  'new': 'bg-blue-100 text-blue-800',
  'reviewing': 'bg-yellow-100 text-yellow-800',
  'shortlisted': 'bg-green-100 text-green-800',
  'interviewed': 'bg-purple-100 text-purple-800',
  'hired': 'bg-emerald-100 text-emerald-800',
  'rejected': 'bg-red-100 text-red-800',
};

export const createCareerColumns = (
  onView: (application: CareerApplication) => void,
  onDelete: (application: CareerApplication) => void,
  onDownloadCV: (application: CareerApplication) => void
): ColumnDef<CareerApplication>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="max-w-[200px]">
          <div className="truncate font-medium" title={name}>
            {name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="max-w-[200px]">
          <div className="truncate text-sm" title={email}>
            {email}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "jobDescription",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Job Applied For
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const jobDescription = row.getValue("jobDescription") as string;
      return (
        <div className="max-w-[200px]">
          <div className="truncate" title={jobDescription}>
            {jobDescription}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as CareerStatus;
      return (
        <Badge className={StatusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "techStack",
    header: "Tech Stack",
    cell: ({ row }) => {
      const techStack = row.getValue("techStack") as string;
      return (
        <div className="max-w-[150px]">
          <div className="truncate text-sm" title={techStack}>
            {techStack}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => {
      const experience = row.getValue("experience") as string;
      return (
        <div className="text-sm">
          {experience || 'Not specified'}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Applied Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const application = row.original;
      return <Actions application={application} onView={onView} onDelete={onDelete} onDownloadCV={onDownloadCV} />;
    },
  },
];
