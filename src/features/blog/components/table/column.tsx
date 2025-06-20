"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import imageUrl from "@/assets/logo.png";
import { BlogType } from "../../type/blogType";
import { BlogActions } from "./blog-actions";

interface ColumnActions {
  onDelete: (blog: BlogType) => void;
}

export const createColumns = ({ onDelete }: ColumnActions): ColumnDef<BlogType>[] => [
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
    accessorKey: "imageUrl",
    header: () => {
      return <div className="flex flex-row">Image</div>;
    },
    cell: ({ row }) => (
      <div className="">
        <img
          src={row.getValue("imageUrl") || imageUrl}
          className="w-10 h-10 object-cover rounded"
          alt="Blog image"
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
    cell: ({ row }) => <div className=" pl-4 w-[13rem] overflow-hidden">{row.getValue("title")}</div>
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
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      // Remove HTML tags and decode HTML entities
      const cleanDescription = description
        ?.replace(/<[^>]*>/g, '') // Remove HTML tags
        ?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        ?.replace(/&amp;/g, '&') // Replace &amp; with &
        ?.replace(/&lt;/g, '<') // Replace &lt; with <
        ?.replace(/&gt;/g, '>') // Replace &gt; with >
        ?.replace(/&quot;/g, '"') // Replace &quot; with "
        ?.trim();

      return (
        <div className="pl-4 max-w-xs truncate w-[13rem] overflow-hidden" title={cleanDescription}>
          {cleanDescription}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=" pl-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.getValue("category")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "keywords",
    header: "Keywords",
    cell: ({ row }) => {
      let keywords = row.getValue("keywords") as string[] | string;

      console.log("Raw keywords from row:", keywords, typeof keywords);

      // Handle different keyword formats
      if (typeof keywords === 'string') {
        // Remove any brackets and quotes that might be in the string
        let cleanString = keywords
          .replace(/^\[|\]$/g, '') // Remove leading [ and trailing ]
          .replace(/^"(.*)"$/, '$1') // Remove surrounding quotes
          .replace(/'/g, '') // Remove single quotes
          .replace(/"/g, ''); // Remove double quotes

        console.log("Cleaned string:", cleanString);

        try {
          // Try to parse if it's a JSON string
          keywords = JSON.parse(keywords);
          console.log("Parsed as JSON:", keywords);
        } catch {
          // If not JSON, split by comma
          if (cleanString.includes(',')) {
            keywords = cleanString.split(',').map((k: string) => k.trim()).filter((k: string) => k);
          } else if (cleanString.trim()) {
            keywords = [cleanString.trim()];
          } else {
            keywords = [];
          }
          console.log("Split by comma:", keywords);
        }
      }

      // Ensure it's an array and clean each keyword
      if (!Array.isArray(keywords)) {
        keywords = [];
      }

      // Clean each keyword to remove any remaining quotes or brackets
      keywords = keywords.map((k: any) => {
        if (typeof k === 'string') {
          return k.replace(/^["']|["']$/g, '').trim(); // Remove quotes from start/end
        }
        return String(k).trim();
      }).filter((k: string) => k && k !== '');

      console.log("Final processed keywords:", keywords);

      // If no valid keywords, show placeholder
      if (!keywords || keywords.length === 0) {
        return (
          <div className="pl-4 max-w-xs">
            <span className="text-xs text-gray-400 italic">No keywords</span>
          </div>
        );
      }

      return (
        <div className="pl-4 max-w-xs">
          <div className="flex flex-wrap gap-1">
            {keywords.slice(0, 2).map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
              >
                {keyword}
              </span>
            ))}
            {keywords.length > 2 && (
              <span className="text-xs text-gray-500">
                +{keywords.length - 2} more
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "views",
    header: "Views",
    cell: ({ row }) => (
      <div className="pl-4 text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {row.getValue("views")} views
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <BlogActions
        blog={row.original}
        onDelete={onDelete}
      />
    ),
  },
];

// Legacy export for backward compatibility
export const columns = createColumns({
  onDelete: () => {},
});
