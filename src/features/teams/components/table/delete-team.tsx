"use client";

import { useState } from "react";
import { deleteTeam } from "../api/api";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TeamType } from "../../type/teamType";
import { AlertTriangle } from "lucide-react";

interface DeleteTeamModalProps {
  team: TeamType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

function DeleteTeamModal({ team, setIsOpen, onSuccess }: DeleteTeamModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage("");

    try {
      console.log("Deleting team member:", team);
      console.log("Team _id:", team._id);
      console.log("Team id:", team.id);

      // Use the numeric id (auto-increment) as it's more likely what the backend expects
      const teamId = team.id;
      console.log("Using team ID (numeric):", teamId);

      if (!teamId) {
        throw new Error("Team ID is missing");
      }

      const response = await deleteTeam(teamId);
      
      if (!response.success && !response.status) {
        setMessage(response.error || "Failed to delete team member");
        toast.error(response.error || "Failed to delete team member");
      } else {
        toast.success("Team member deleted successfully!");
        setIsOpen(false);
        onSuccess(); // Refresh the team list
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      setMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Delete Team Member
        </DialogTitle>
       
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Team Member Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            {team.imageUrl && (
              <img
                src={team.imageUrl}
                alt={team.name}
                className="w-12 h-12 object-cover rounded-full"
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">{team.name}</h3>
              <p className="text-sm text-gray-600">{team.jobCategory}</p>
              <p className="text-xs text-gray-500">
                Status: <span className={`font-medium ${team.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {team.status}
                </span>
              </p>
            </div>
          </div>
        </div>

       

        {message && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {message}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Team Member"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default DeleteTeamModal;
