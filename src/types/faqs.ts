// FAQ Types and Interfaces

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  status: FAQStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type FAQStatus = 'active' | 'inactive';

// API Request Types
export interface CreateFAQRequest {
  question: string;
  answer: string;
  category?: string;
  status?: FAQStatus;
  order?: number;
}

export interface UpdateFAQRequest extends CreateFAQRequest {
  id: number;
}

export interface GetFAQsRequest {
  page?: number;
  limit?: number;
  category?: string;
  status?: FAQStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface FAQApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface FAQPaginatedResponse {
  faqs: FAQ[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FAQStatistics {
  totalFAQs: number;
  activeFAQs: number;
  inactiveFAQs: number;
  categoryStats: Array<{
    category: string;
    count: number;
  }>;
}

// Form validation schemas
export const FAQ_VALIDATION = {
  question: {
    required: 'Question is required',
    maxLength: { value: 500, message: 'Question must be less than 500 characters' }
  },
  answer: {
    required: 'Answer is required',
    maxLength: { value: 2000, message: 'Answer must be less than 2000 characters' }
  },
  category: {
    maxLength: { value: 100, message: 'Category must be less than 100 characters' }
  }
} as const;

// Table column definitions
export interface FAQTableColumn {
  id: string;
  question: string;
  category: string;
  status: FAQStatus;
  order: number;
  createdAt: string;
  actions: string;
}
