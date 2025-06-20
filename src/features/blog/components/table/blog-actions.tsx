"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BlogType } from "../../type/blogType";

interface BlogActionsProps {
  blog: BlogType;
  onDelete: (blog: BlogType) => void;
}

export const BlogActions = ({ blog, onDelete }: BlogActionsProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleView = () => {
    setIsOpen(false);
    // Use MongoDB ObjectId (_id) if available, fallback to numeric id
    const blogId = blog._id || blog.id;
    navigate(`/blog/view/${blogId}`);
  };

  const handleEdit = () => {
    setIsOpen(false);
    // Use MongoDB ObjectId (_id) if available, fallback to numeric id
    const blogId = blog._id || blog.id;
    navigate(`/blog/edit/${blogId}`);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(blog);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={handleView}
          className="cursor-pointer flex items-center gap-2 text-green-600 hover:text-green-800 hover:bg-green-50"
        >
          <Eye className="h-4 w-4" />
          View Blog
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleEdit}
          className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4" />
          Edit Blog
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete Blog
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
