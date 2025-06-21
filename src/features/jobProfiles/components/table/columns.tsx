import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { JobProfile, JobType, JobStatus } from "@/types/jobProfiles";

interface ActionsProps {
  job: JobProfile;
  onView: (job: JobProfile) => void;
  onEdit: (job: JobProfile) => void;
  onDelete: (job: JobProfile) => void;
}

const Actions: React.FC<ActionsProps> = ({ job, onView, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(job)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(job)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Job
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(job)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const JobTypeColors: Record<JobType, string> = {
  'full-time': 'bg-blue-100 text-blue-800',
  'part-time': 'bg-green-100 text-green-800',
  'contract': 'bg-purple-100 text-purple-800',
  'internship': 'bg-orange-100 text-orange-800',
  'freelance': 'bg-pink-100 text-pink-800',
};

export const createJobColumns = (
  onView: (job: JobProfile) => void,
  onEdit: (job: JobProfile) => void,
  onDelete: (job: JobProfile) => void
): ColumnDef<JobProfile>[] => [
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
    accessorKey: "jobTitle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const jobTitle = row.getValue("jobTitle") as string;
      const isUrgent = row.original.isUrgent;
      return (
        <div className="max-w-[250px]">
          <div className="flex items-center gap-2">
            <div className="truncate font-medium" title={jobTitle}>
              {jobTitle}
            </div>
            {isUrgent && (
              <Badge variant="destructive" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return department ? (
        <Badge variant="outline">{department}</Badge>
      ) : (
        <span className="text-gray-400">No department</span>
      );
    },
  },
  {
    accessorKey: "jobType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Job Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const jobType = row.getValue("jobType") as JobType;
      return (
        <Badge className={JobTypeColors[jobType]}>
          {jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
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
      const status = row.getValue("status") as JobStatus;
      return (
        <Badge 
          variant={status === "active" ? "default" : "secondary"}
          className={status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "applicationCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Applications
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("applicationCount")}
      </div>
    ),
  },
  {
    accessorKey: "lastDayApplied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const deadline = new Date(row.getValue("lastDayApplied"));
      const now = new Date();
      const isExpired = deadline < now;
      
      return (
        <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
          {deadline.toLocaleDateString()}
          {isExpired && (
            <div className="text-xs text-red-500">Expired</div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original;
      return <Actions job={job} onView={onView} onEdit={onEdit} onDelete={onDelete} />;
    },
  },
];
