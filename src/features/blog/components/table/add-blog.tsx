"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { createBlog } from "../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface AddBlogModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddBlogModal({ setIsOpen }: AddBlogModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await createBlog({
        title: data.title,
        description: data.description,
      });
      if (response.error) {
        setMessage(response.error);
        toast.error(response.error);
      } else {
        toast.success("Blog created successfully!");
        setPreview(null);
        setImage(null);
        reset(); // Reset form fields
        setIsOpen(false); // Close modal on success
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <DialogContent className="sm:max-w-lg bg-[#FFEDE3]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Add New Blog
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            {...register("title")}
            className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border max-h-[5rem] rounded focus:ring focus:ring-blue-300"
            placeholder="Enter blog description"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Blog Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border bg-white rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-full h-40 object-cover rounded"
            />
          )}
        </div>
        {message && <p className="text-center text-red-500">{message}</p>}
        <Button
          type="submit"
          disabled={formLoading}
          className="w-full bg-[#ee6620] text-white p-2 rounded hover:bg-[#e4692b] disabled:opacity-50"
        >
          {formLoading ? "Submitting..." : "Submit Blog"}
        </Button>
      </form>
    </DialogContent>
  );
}

export default AddBlogModal;