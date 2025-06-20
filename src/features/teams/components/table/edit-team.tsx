"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { updateTeam } from "../api/api";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JOB_CATEGORIES, SocialMedia, TeamType } from "../../type/teamType";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  jobCategory: z.string().min(1, "Job category is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});

type FormData = z.infer<typeof formSchema>;

interface EditTeamModalProps {
  team: TeamType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

function EditTeamModal({ team, setIsOpen, onSuccess }: EditTeamModalProps) {
  console.log("EditTeamModal received team data:", team);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
      jobCategory: team.jobCategory,
      status: team.status,
    }
  });
  
  const [preview, setPreview] = useState<string | null>(team.imageUrl || null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [socialMedia, setSocialMedia] = useState<SocialMedia>(
    team.socialMedia || {
      website: "",
      facebook: "",
      linkedin: "",
      instagram: "",
      github: "",
    }
  );

  const selectedJobCategory = watch("jobCategory");
  const selectedStatus = watch("status");

  // Set initial form values when team data changes
  useEffect(() => {
    if (team) {
      setValue("name", team.name);
      setValue("jobCategory", team.jobCategory);
      setValue("status", team.status);
      setSocialMedia(team.socialMedia || {
        website: "",
        facebook: "",
        linkedin: "",
        instagram: "",
        github: "",
      });
      setPreview(team.imageUrl || null);
    }
  }, [team, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    setMessage("");

    try {
      console.log("Updating team:", team);
      console.log("Team _id:", team._id);
      console.log("Team id:", team.id);

      // Use the numeric id (auto-increment) as it's more likely what the backend expects
      const teamId = team.id;
      console.log("Using team ID (numeric):", teamId);

      if (!teamId) {
        throw new Error("Team ID is missing");
      }

      const response = await updateTeam({
        id: teamId,
        name: data.name,
        jobCategory: data.jobCategory,
        socialMedia: socialMedia,
        status: data.status,
        image: profileImage,
      });
      
      if (!response.success && !response.status) {
        setMessage(response.error || "Failed to update team member");
        toast.error(response.error || "Failed to update team member");
      } else {
        toast.success("Team member updated successfully!");
        setPreview(null);
        setProfileImage(null);
        setSocialMedia({
          website: "",
          facebook: "",
          linkedin: "",
          instagram: "",
          github: "",
        });
        reset();
        setIsOpen(false);
        onSuccess(); // Refresh the team list
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      setMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Team Member</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image</Label>
          <div className="flex items-center space-x-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full border"
              />
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter team member name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Job Category */}
        <div className="space-y-2">
          <Label htmlFor="jobCategory">Job Category *</Label>
          <Select
            value={selectedJobCategory}
            onValueChange={(value) => setValue("jobCategory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select job category" />
            </SelectTrigger>
            <SelectContent>
              {JOB_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.jobCategory && (
            <p className="text-sm text-red-600">{errors.jobCategory.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={selectedStatus}
            onValueChange={(value: "active" | "inactive") => setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Social Media Links</Label>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={socialMedia.website || ""}
                onChange={(e) => handleSocialMediaChange("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                placeholder="https://facebook.com/username"
                value={socialMedia.facebook || ""}
                onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={socialMedia.linkedin || ""}
                onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                placeholder="https://instagram.com/username"
                value={socialMedia.instagram || ""}
                onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                type="url"
                placeholder="https://github.com/username"
                value={socialMedia.github || ""}
                onChange={(e) => handleSocialMediaChange("github", e.target.value)}
              />
            </div>
          </div>
        </div>

        {message && (
          <div className="text-red-600 text-sm">{message}</div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={formLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={formLoading}>
            {formLoading ? "Updating..." : "Update Team Member"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default EditTeamModal;
