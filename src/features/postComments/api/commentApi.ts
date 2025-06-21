import axios from 'axios';
import { baseUrl } from '@/globalurl/baseurl';
import {
  PostComment,
  CreateCommentRequest,
  UpdateCommentRequest,
  GetCommentsRequest,
  CommentApiResponse,
  CommentPaginatedResponse,
  CommentStatistics
} from '@/types/postComments';

// ===== CREATE COMMENT (Public) =====
export const createComment = async (commentData: CreateCommentRequest): Promise<CommentApiResponse<PostComment>> => {
  try {
    const response = await axios.post(`${baseUrl}/api/comments`, commentData);

    if (response.data.status) {
      return {
        status: true,
        code: 201,
        message: "Comment submitted successfully",
        data: response.data.data
      };
    } else {
      return {
        status: false,
        code: response.data.code || 400,
        message: response.data.message || "Failed to submit comment"
      };
    }
  } catch (error: any) {
    console.error("Create comment error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to submit comment",
      error: error.message
    };
  }
};

// ===== GET APPROVED COMMENTS (Public) =====
export const getApprovedComments = async (params: Omit<GetCommentsRequest, 'status'> = {}): Promise<CommentApiResponse<CommentPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/comments/approved`, { params });

    return {
      status: true,
      code: 200,
      message: "Approved comments retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get approved comments error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch approved comments",
      error: error.message
    };
  }
};

// ===== GET COMMENTS FOR SPECIFIC BLOG (Public) =====
export const getCommentsByBlogId = async (
  blogId: number,
  params: Omit<GetCommentsRequest, 'blogId'> = {}
): Promise<CommentApiResponse<CommentPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/comments/blog/${blogId}`, { params });

    if (response.data.status) {
      return {
        status: true,
        code: 200,
        message: "Blog comments retrieved successfully",
        data: {
          comments: response.data.data || [],
          pagination: response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    } else {
      return {
        status: false,
        code: response.data.code || 400,
        message: response.data.message || "Failed to fetch blog comments"
      };
    }
  } catch (error: any) {
    console.error("Get comments by blog ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch blog comments",
      error: error.message
    };
  }
};

// ===== GET COMMENT COUNT FOR SPECIFIC BLOG (Public) =====
export const getCommentCountByBlogId = async (blogId: number): Promise<CommentApiResponse<{ count: number }>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/comments/blog/${blogId}/count`);

    return {
      status: true,
      code: 200,
      message: "Comment count retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get comment count error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch comment count",
      error: error.message
    };
  }
};

// ===== GET ALL COMMENTS (Admin) =====
export const getAllComments = async (params: GetCommentsRequest = {}): Promise<CommentApiResponse<CommentPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/comments`, { params });

    // Handle the response structure based on API documentation
    if (response.data.status) {
      return {
        status: true,
        code: 200,
        message: "Comments retrieved successfully",
        data: {
          comments: response.data.data || [],
          pagination: response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    } else {
      return {
        status: false,
        code: response.data.code || 400,
        message: response.data.message || "Failed to fetch comments"
      };
    }
  } catch (error: any) {
    console.error("Get all comments error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch comments",
      error: error.message
    };
  }
};

// ===== GET COMMENT BY ID (Admin) =====
export const getCommentById = async (id: number): Promise<CommentApiResponse<PostComment>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/comments/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "Comment retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get comment by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch comment",
      error: error.message
    };
  }
};

// ===== UPDATE COMMENT (Admin - For Moderation) =====
export const updateComment = async (commentData: UpdateCommentRequest): Promise<CommentApiResponse<PostComment>> => {
  try {
    const { id, ...updateData } = commentData;
    
    // Add moderation timestamp
    const moderationData = {
      ...updateData,
      moderatedAt: new Date().toISOString()
    };
    
    const response = await axios.put(`${baseUrl}/api/comments/${id}`, moderationData);
    
    return {
      status: true,
      code: 200,
      message: "Comment updated successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Update comment error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update comment",
      error: error.message
    };
  }
};

// ===== DELETE COMMENT (Admin) =====
export const deleteComment = async (id: number): Promise<CommentApiResponse<void>> => {
  try {
    await axios.delete(`${baseUrl}/api/comments/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "Comment deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete comment error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete comment",
      error: error.message
    };
  }
};

// ===== GET COMMENT STATISTICS (Admin) =====
export const getCommentStatistics = async (): Promise<CommentApiResponse<CommentStatistics>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/comments/statistics`);
    
    return {
      status: true,
      code: 200,
      message: "Comment statistics retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get comment statistics error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch comment statistics",
      error: error.message
    };
  }
};

// ===== MODERATE COMMENT (Admin Helper Function) =====
export const moderateComment = async (
  id: number, 
  status: 'approved' | 'rejected' | 'spam', 
  moderatedBy: string,
  isVisible?: boolean
): Promise<CommentApiResponse<PostComment>> => {
  return updateComment({
    id,
    status,
    moderatedBy,
    isVisible: isVisible !== undefined ? isVisible : status === 'approved'
  });
};

// ===== BULK MODERATE COMMENTS (Admin) =====
export const bulkModerateComments = async (
  commentIds: number[], 
  status: 'approved' | 'rejected' | 'spam',
  moderatedBy: string
): Promise<CommentApiResponse<void>> => {
  try {
    const promises = commentIds.map(id => 
      moderateComment(id, status, moderatedBy)
    );
    
    await Promise.all(promises);
    
    return {
      status: true,
      code: 200,
      message: `${commentIds.length} comments moderated successfully`
    };
  } catch (error: any) {
    console.error("Bulk moderate comments error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to moderate comments",
      error: error.message
    };
  }
};
