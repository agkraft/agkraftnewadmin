"use client";

import { useState } from "react";
import { deleteContact } from "../api/api";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContactType, getStatusColor, getPriorityColor } from "../../type/contactType";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, User, Mail, Phone, MessageSquare, Calendar, Tag, Star } from "lucide-react";

interface DeleteContactModalProps {
  contact: ContactType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

function DeleteContactModal({ contact, setIsOpen, onSuccess }: DeleteContactModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage("");

    try {
      console.log("Deleting contact:", contact);
      console.log("Contact _id:", contact._id);
      console.log("Contact id:", contact.id);

      // Use the _id (MongoDB ObjectId) or fallback to numeric id
      const contactId = contact._id || contact.id;
      console.log("Using contact ID:", contactId);

      if (!contactId) {
        throw new Error("Contact ID is missing");
      }

      const response = await deleteContact(contactId);
      
      if (!response.status) {
        setMessage(response.message || "Failed to delete contact");
        toast.error(response.message || "Failed to delete contact");
      } else {
        toast.success("Contact deleted successfully!");
        setIsOpen(false);
        onSuccess(); // Refresh the contact list
      }
    } catch (error: any) {
      console.error("Delete contact error:", error);
      setMessage(error.message || "Something went wrong!");
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Delete Contact
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this contact? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{contact.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span className="text-sm">{contact.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Service:</span>
            <span className="text-sm">{contact.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="text-sm capitalize">{contact.status}</span>
          </div>
        </div>
        
        {message && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{message}</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
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
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete Contact"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default DeleteContactModal;

// Delete All Contacts Modal Component
interface DeleteAllContactsModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
  totalContacts: number;
}

export function DeleteAllContactsModal({ setIsOpen, onSuccess, totalContacts }: DeleteAllContactsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    setMessage("");

    try {
      const { deleteAllContacts } = await import("../api/api");
      const response = await deleteAllContacts();

      if (!response.status) {
        setMessage(response.message || "Failed to delete all contacts");
        toast.error(response.message || "Failed to delete all contacts");
      } else {
        toast.success(response.message || "All contacts deleted successfully!");
        setIsOpen(false);
        onSuccess(); // Refresh the contact list
      }
    } catch (error: any) {
      console.error("Delete all contacts error:", error);
      setMessage(error.message || "Something went wrong!");
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Delete All Contacts
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to delete all {totalContacts} contacts? This action cannot be undone and will permanently remove all contact data.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">Warning</span>
          </div>
          <p className="text-sm text-red-700 mt-2">
            This will permanently delete all {totalContacts} contacts from the database.
            This action is irreversible.
          </p>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{message}</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteAll}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting All...
            </>
          ) : (
            `Delete All ${totalContacts} Contacts`
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// View Contact Modal Component
interface ViewContactModalProps {
  contact: ContactType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ViewContactModal({ contact, setIsOpen }: ViewContactModalProps) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Contact Details
        </DialogTitle>
        <DialogDescription>
          View complete contact information and message details.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base">{contact.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base break-all">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-base">
                  {contact.countryCode && contact.phoneNumber
                    ? `${contact.countryCode} ${contact.phoneNumber}`
                    : contact.phone || 'N/A'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <Badge variant="outline" className="mt-1">
                  {contact.service}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Status & Priority</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className={`mt-1 ${getStatusColor(contact.status)}`}>
                  {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <Badge className={`mt-1 ${getPriorityColor(contact.priority)}`}>
                  {contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Message</h3>

          <div className="flex items-start gap-3">
            <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-2">Contact Message</p>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-base whitespace-pre-wrap leading-relaxed">
                  {contact.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Timeline</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-base">{formatDate(contact.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-base">{formatDate(contact.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
