import { ColumnDef } from "@tanstack/react-table";
import { TeamType } from "../../type/teamType";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaGlobe, FaFacebook, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

const imageUrl = "/default-avatar.png"; // Default avatar image

interface ColumnActions {
  onEdit: (team: TeamType) => void;
  onDelete: (team: TeamType) => void;
}

interface TeamActionsProps {
  team: TeamType;
  onEdit: (team: TeamType) => void;
  onDelete: (team: TeamType) => void;
}

const TeamActions = ({ team, onEdit, onDelete }: TeamActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(team)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(team)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SocialMediaLinks = ({ socialMedia }: { socialMedia: TeamType['socialMedia'] }) => {
  const links = [
    { url: socialMedia.website, icon: FaGlobe, label: "Website" },
    { url: socialMedia.facebook, icon: FaFacebook, label: "Facebook" },
    { url: socialMedia.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    { url: socialMedia.instagram, icon: FaInstagram, label: "Instagram" },
    { url: socialMedia.github, icon: FaGithub, label: "GitHub" },
  ];

  const validLinks = links.filter(link => link.url && link.url.trim() !== "");

  if (validLinks.length === 0) {
    return <span className="text-gray-400 text-sm">No links</span>;
  }

  return (
    <div className="flex gap-2">
      {validLinks.map((link, index) => {
        const IconComponent = link.icon;
        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title={link.label}
          >
            <IconComponent className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
};

export const createColumns = ({ onEdit, onDelete }: ColumnActions): ColumnDef<TeamType>[] => [
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
    accessorKey: "imageUrl",
    header: () => {
      return <div className="flex flex-row">Photo</div>;
    },
    cell: ({ row }) => (
      <div className="">
        <img
          src={row.getValue("imageUrl") || imageUrl}
          className="w-10 h-10 object-cover rounded-full"
          alt="Team member photo"
        />
      </div>
    ),
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
      <div className="font-medium">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "jobCategory",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Category
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-xs">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.getValue("jobCategory")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "socialMedia",
    header: () => {
      return <div className="flex flex-row">Social Media</div>;
    },
    cell: ({ row }) => (
      <div className="">
        <SocialMediaLinks socialMedia={row.getValue("socialMedia")} />
      </div>
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
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
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
      <TeamActions
        team={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];

// Legacy export for backward compatibility
export const columns = createColumns({
  onEdit: () => {},
  onDelete: () => {},
});
