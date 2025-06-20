// Project Status Types
export type ProjectStatus = "active" | "inactive" | "draft";

// Project Category Types (you can extend this based on your needs)
export type ProjectCategory =
  | "Web Development"
  | "Mobile App"
  | "Digital Marketing"
  | "E-commerce"
  | "UI/UX Design"
  | "Software Development"
  | "SAAS Platform"
  | "";

// Main Project interface matching API schema
export interface ProjectType {
  id?: number; // Auto-increment number
  title: string;
  description: string;
  bigImageUrl?: string; // S3 URL for big image
  processAndChallengeDescription: string;
  processAndChallengePoints?: string[];
  processAndChallengeDescription2?: string;
  miniImages?: string[]; // Array of S3 URLs (max 3)
  summaryDescription: string;
  projectCategory: string;
  clientName?: string; // Client name (optional)
  projectDeliveryDate?: string; // Project delivery date in DD/MM/YYYY format (optional)
  status: ProjectStatus;
  featured: boolean;
  views: number;
  tags?: string[];
  projectLink?: string; // Project live URL
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

// Request Types for API calls
export interface CreateProjectRequest {
  title: string;
  description: string;
  processAndChallengeDescription: string;
  summaryDescription: string;
  projectCategory: string;
  clientName?: string;
  projectDeliveryDate?: string;
  processAndChallengeDescription2?: string;
  processAndChallengePoints?: string[];
  tags?: string[];
  projectLink?: string;
  status?: ProjectStatus;
  featured?: boolean;
  bigImage?: File | null;
  miniImages?: File[];
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  id: number;
}

export interface GetProjectsRequest {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  projectCategory?: string;
  featured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Form Data Types for multi-step modal
export interface ProjectFormStep1 {
  title: string;
  description: string;
  projectCategory: ProjectCategory | "";
  clientName?: string;
  projectDeliveryDate?: string;
  status: ProjectStatus;
  featured: boolean;
  tags: string[];
  projectLink?: string;
  bigImage?: File | null;
}

export interface ProjectFormStep2 {
  processAndChallengeDescription: string;
  processAndChallengeDescription2?: string;
  miniImages?: File[];
}

export interface ProjectFormStep3 {
  summaryDescription: string;
  processAndChallengePoints: string[];
}

export interface ProjectFormData extends ProjectFormStep1, ProjectFormStep2, ProjectFormStep3 {}

// Validation error types
export interface ProjectFormErrors {
  title?: string;
  description?: string;
  projectCategory?: string;
  clientName?: string;
  projectDeliveryDate?: string;
  processAndChallengeDescription?: string;
  summaryDescription?: string;
  processAndChallengePoints?: string[];
  bigImage?: string;
  miniImages?: string;
  tags?: string;
  projectLink?: string;
}

// Project Statistics Type
export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  featuredProjects: number;
  draftProjects: number;
  categoryStats: Array<{ _id: string; count: number }>;
  mostViewed: Array<{ id: number; title: string; views: number }>;
}
