// Post Comment Types and Interfaces

export interface PostComment {
  id: number;
  blogId: number; // Required field to associate comment with blog
  name: string;
  email: string;
  comment: string;
  status: CommentStatus;
  isVisible: boolean;
  moderatedBy?: string;
  moderatedAt?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

// API Request Types
export interface CreateCommentRequest {
  blogId: number; // Required field to associate comment with blog
  name: string;
  email: string;
  comment: string;
}

export interface UpdateCommentRequest {
  id: number;
  status?: CommentStatus;
  isVisible?: boolean;
  moderatedBy?: string;
}

export interface GetCommentsRequest {
  page?: number;
  limit?: number;
  status?: CommentStatus;
  isVisible?: boolean;
  blogId?: number; // Optional filter by specific blog
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface CommentApiResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data?: T;
  error?: string;
}

export interface CommentPaginatedResponse {
  comments: PostComment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CommentStatistics {
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
  rejectedComments: number;
  spamComments: number;
  visibleComments: number;
  statusStats: Array<{
    status: CommentStatus;
    count: number;
  }>;
  recentComments: PostComment[];
}

// Form validation schemas
export const COMMENT_VALIDATION = {
  name: {
    required: 'Name is required',
    maxLength: { value: 100, message: 'Name must be less than 100 characters' }
  },
  email: {
    required: 'Email is required',
    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email' }
  },
  comment: {
    required: 'Comment is required',
    maxLength: { value: 1000, message: 'Comment must be less than 1000 characters' }
  }
} as const;

// Status color mapping for UI
export const COMMENT_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  spam: 'bg-gray-100 text-gray-800'
} as const;

// Status options for moderation
export const COMMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'spam', label: 'Spam' }
] as const;

// Table column definitions
export interface CommentTableColumn {
  id: string;
  blogId: number;
  name: string;
  email: string;
  comment: string;
  status: CommentStatus;
  isVisible: boolean;
  createdAt: string;
  actions: string;
}

// Moderation actions
export interface ModerationAction {
  commentId: number;
  status: CommentStatus;
  isVisible?: boolean;
  moderatedBy: string;
}
