"use client";

import { useState } from "react";
import { deleteBlog } from "../api/api";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { BlogType } from "../../type/blogType";

interface DeleteBlogModalProps {
  blog: BlogType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

function DeleteBlogModal({ blog, setIsOpen, onSuccess }: DeleteBlogModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage("");

    try {
      console.log("Deleting blog:", blog);
      const blogId = blog._id || blog.id;
      console.log("Using blog ID:", blogId);

      // Check if blogId exists
      if (!blogId) {
        setMessage("Blog ID not found. Cannot delete blog.");
        toast.error("Blog ID not found. Cannot delete blog.");
        setIsDeleting(false);
        return;
      }

      const response = await deleteBlog(blogId);

      if (!response.success) {
        setMessage(response.error || "Failed to delete blog");
        toast.error(response.error || "Failed to delete blog");
      } else {
        toast.success("Blog deleted successfully!");
        setIsOpen(false);
        onSuccess(); // Refresh the blog list
      }
    } catch (error) {
      setMessage("Something went wrong!");
      toast.error("Something went wrong!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <DialogContent className="sm:max-w-md bg-white">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Delete Blog
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="mt-4">
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete the blog{" "}
        
          This will permanently remove the blog and all its content.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{message}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete Blog"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default DeleteBlogModal;