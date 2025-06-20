// Service Categories as per API documentation
export const SERVICE_CATEGORIES = [
  "Web Development",
  "Mobile App Development", 
  "Digital Marketing",
  "SEO Services",
  "UI/UX Design",
  "E-commerce Solutions",
  "Cloud Services",
  "Data Analytics",
  "Consulting",
  "Maintenance & Support",
  "Custom Software",
  "API Development",
  "DevOps",
  "Quality Assurance",
  "Other"
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

// Service Status
export const SERVICE_STATUSES = ["active", "inactive", "draft"] as const;
export type ServiceStatus = typeof SERVICE_STATUSES[number];

// Question & Answer interface
export interface QuestionAnswer {
  question: string;
  answer: string;
  order?: number;
}

// Main Service interface matching API schema
export interface ServiceType {
  id?: number; // Auto-increment number
  title: string;
  description: string;
  iconImageUrl?: string; // S3 URL for SVG icon
  iconBgColor?: string; // Hex color code for icon background (e.g., #ffffff)
  videoUrl?: string; // S3 URL for video
  serviceDescription: string;
  importantPoints: string[];
  questionsAnswers: QuestionAnswer[];
  status: ServiceStatus;
  category?: ServiceCategory;
  tags: string[];
  views: number;
  featured: boolean;
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
  services: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Request Types for API calls
export interface CreateServiceRequest {
  title: string;
  description: string;
  serviceDescription: string;
  category?: ServiceCategory;
  status?: ServiceStatus;
  featured?: boolean;
  importantPoints: string[];
  questionsAnswers: QuestionAnswer[];
  tags: string[];
  iconBgColor?: string; // Hex color code for icon background (e.g., #ffffff)
  icon?: File | null; // SVG file
  video?: File | null; // Video file
}

export interface UpdateServiceRequest extends CreateServiceRequest {
  id: number;
}

export interface GetServicesRequest {
  page?: number;
  limit?: number;
  category?: ServiceCategory;
  status?: ServiceStatus;
  featured?: boolean;
  search?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Form Data Types for multi-step modal
export interface ServiceFormStep1 {
  title: string;
  description: string;
  category: ServiceCategory | "";
  status: ServiceStatus;
  featured: boolean;
  tags: string[];
  iconBgColor: string; // Hex color code for icon background
  icon?: File | null;
}

export interface ServiceFormStep2 {
  serviceDescription: string;
  video?: File | null;
}

export interface ServiceFormStep3 {
  importantPoints: string[];
  questionsAnswers: QuestionAnswer[];
}

export interface ServiceFormData extends ServiceFormStep1, ServiceFormStep2, ServiceFormStep3 {}

// Validation error types
export interface ServiceFormErrors {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  featured?: string;
  tags?: string;
  iconBgColor?: string;
  icon?: string;
  serviceDescription?: string;
  video?: string;
  importantPoints?: string[];
  questionsAnswers?: { question?: string; answer?: string }[];
}

// File upload specifications
export const FILE_UPLOAD_SPECS = {
  icon: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['.svg'],
    mimeTypes: ['image/svg+xml']
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.mkv'],
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska']
  }
} as const;
