// Career Application Types and Interfaces

export interface CareerApplication {
  id: number;
  name: string;
  email: string;
  jobDescription: string;
  cvUrl: string;
  techStack: string;
  whyHireYou: string;
  status: CareerStatus;
  experience?: string;
  expectedSalary?: string;
  availableFrom?: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CareerStatus = 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';

// API Request Types
export interface CreateCareerRequest {
  name: string;
  email: string;
  jobDescription: string;
  techStack: string;
  whyHireYou: string;
  experience?: string;
  expectedSalary?: string;
  availableFrom?: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  cv: File; // CV file upload
}

export interface UpdateCareerRequest {
  id: number;
  name?: string;
  email?: string;
  jobDescription?: string;
  techStack?: string;
  whyHireYou?: string;
  status?: CareerStatus;
  experience?: string;
  expectedSalary?: string;
  availableFrom?: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  notes?: string;
  reviewedBy?: string;
  cv?: File; // Optional CV file upload for updates
}

export interface GetCareersRequest {
  page?: number;
  limit?: number;
  status?: CareerStatus;
  jobDescription?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface CareerApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface CareerPaginatedResponse {
  careers: CareerApplication[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CareerStatistics {
  totalApplications: number;
  newApplications: number;
  reviewingApplications: number;
  shortlistedApplications: number;
  interviewedApplications: number;
  hiredApplications: number;
  rejectedApplications: number;
  statusStats: Array<{
    status: CareerStatus;
    count: number;
  }>;
  jobStats: Array<{
    jobDescription: string;
    count: number;
  }>;
}

// Form validation schemas
export const CAREER_VALIDATION = {
  name: {
    required: 'Name is required',
    maxLength: { value: 100, message: 'Name must be less than 100 characters' }
  },
  email: {
    required: 'Email is required',
    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email' }
  },
  jobDescription: {
    required: 'Job description is required',
    maxLength: { value: 500, message: 'Job description must be less than 500 characters' }
  },
  techStack: {
    required: 'Tech stack is required',
    maxLength: { value: 300, message: 'Tech stack must be less than 300 characters' }
  },
  whyHireYou: {
    required: 'Why hire you is required',
    maxLength: { value: 1000, message: 'Why hire you must be less than 1000 characters' }
  },
  cv: {
    required: 'CV file is required'
  }
} as const;

// File upload specifications
export const CV_UPLOAD_SPECS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['.pdf', '.doc', '.docx'],
  mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
} as const;

// Table column definitions
export interface CareerTableColumn {
  id: string;
  name: string;
  email: string;
  jobDescription: string;
  status: CareerStatus;
  techStack: string;
  createdAt: string;
  actions: string;
}
