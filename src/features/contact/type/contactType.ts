// Contact Type Definitions based on backend API schema

export interface ContactType {
  _id?: string; // MongoDB ObjectId
  id?: number; // Auto-increment ID
  name: string;
  email: string;
  countryCode: string; // Country code like "+91"
  phoneNumber: string; // Phone number without country code
  phone?: string; // Legacy field for backward compatibility
  service: string;
  message: string;
  status: "new" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string; // Formatted date string from API
  updatedAt: string; // Formatted date string from API
  __v?: number; // MongoDB version field
}

// Available services enum
export const CONTACT_SERVICES = [
  "Web Development",
  "App Development", 
  "Digital Marketing",
  "Software Development",
  "SEO",
  "UI/UX Design",
  "E-commerce Development",
  "Consulting"
] as const;

export type ContactService = typeof CONTACT_SERVICES[number];

// Status options
export const CONTACT_STATUS = [
  "new",
  "in-progress", 
  "resolved",
  "closed"
] as const;

export type ContactStatus = typeof CONTACT_STATUS[number];

// Priority options
export const CONTACT_PRIORITY = [
  "low",
  "medium",
  "high", 
  "urgent"
] as const;

export type ContactPriority = typeof CONTACT_PRIORITY[number];

// API Response Types
export interface ContactApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
}

export interface ContactPaginatedResponse {
  data: ContactType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Statistics Response
export interface ContactStatistics {
  totalContacts: number;
  statusStats: Array<{
    _id: ContactStatus;
    count: number;
  }>;
  serviceStats: Array<{
    _id: ContactService;
    count: number;
  }>;
  priorityStats: Array<{
    _id: ContactPriority;
    count: number;
  }>;
}

// Request Types
export interface GetContactsRequest {
  page: number;
  limit: number;
  status?: ContactStatus;
  service?: ContactService;
  priority?: ContactPriority;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateContactRequest {
  id: string | number;
  name?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  phone?: string; // Legacy field for backward compatibility
  service?: ContactService;
  message?: string;
  status?: ContactStatus;
  priority?: ContactPriority;
}

// Status badge colors for UI
export const getStatusColor = (status: ContactStatus): string => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Priority badge colors for UI
export const getPriorityColor = (priority: ContactPriority): string => {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "urgent":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
