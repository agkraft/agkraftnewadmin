// Job Profile Types and Interfaces

export interface JobProfile {
  id: number;
  jobTitle: string;
  jobDescription: string;
  techStack: string[];
  startDateApplied: string;
  lastDayApplied: string;
  status: JobStatus;
  experienceRequired?: string;
  salaryRange?: string;
  location?: string;
  jobType: JobType;
  department?: string;
  requirements?: string[];
  benefits?: string[];
  applicationCount: number;
  isUrgent: boolean;
  postedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 'active' | 'inactive';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';

// API Request Types
export interface CreateJobRequest {
  jobTitle: string;
  jobDescription: string;
  techStack: string[];
  startDateApplied: string;
  lastDayApplied: string;
  status?: JobStatus;
  experienceRequired?: string;
  salaryRange?: string;
  location?: string;
  jobType?: JobType;
  department?: string;
  requirements?: string[];
  benefits?: string[];
  isUrgent?: boolean;
  postedBy?: string;
}

export interface UpdateJobRequest extends CreateJobRequest {
  id: number;
}

export interface GetJobsRequest {
  page?: number;
  limit?: number;
  status?: JobStatus;
  techStack?: string;
  jobType?: JobType;
  department?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isAcceptingApplications?: boolean;
}

// API Response Types
export interface JobApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface JobPaginatedResponse {
  jobs: JobProfile[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface JobStatistics {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  urgentJobs: number;
  totalApplications: number;
  jobTypeStats: Array<{
    jobType: JobType;
    count: number;
  }>;
  departmentStats: Array<{
    department: string;
    count: number;
  }>;
  techStackStats: Array<{
    techStack: string;
    count: number;
  }>;
}

// Form validation schemas
export const JOB_VALIDATION = {
  jobTitle: {
    required: 'Job title is required',
    maxLength: { value: 200, message: 'Job title must be less than 200 characters' }
  },
  jobDescription: {
    required: 'Job description is required',
    maxLength: { value: 2000, message: 'Job description must be less than 2000 characters' }
  },
  techStack: {
    required: 'At least one tech stack is required'
  },
  startDateApplied: {
    required: 'Start date is required'
  },
  lastDayApplied: {
    required: 'Last day to apply is required'
  }
} as const;

// Job type options
export const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' }
] as const;

// Status color mapping for UI
export const JOB_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800'
} as const;

// Common tech stacks for suggestions
export const COMMON_TECH_STACKS = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP',
  'Angular', 'Vue.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'AWS', 'Docker',
  'Kubernetes', 'Git', 'HTML', 'CSS', 'SASS', 'Redux', 'Express.js',
  'Spring Boot', 'Django', 'Flask', 'Laravel', 'Next.js', 'Nuxt.js'
] as const;

// Table column definitions
export interface JobTableColumn {
  id: string;
  jobTitle: string;
  department: string;
  jobType: JobType;
  status: JobStatus;
  applicationCount: number;
  lastDayApplied: string;
  isUrgent: boolean;
  actions: string;
}
