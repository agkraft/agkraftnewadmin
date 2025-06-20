import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";
import { BlogType } from "../../type/blogType";

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Request Types (matching backend MongoDB schema)
interface CreateBlogRequest {
  title: string;
  description: string;
  category: string;
  keywords: string[]; // Array of strings as per schema
  image?: File | null; // Will be uploaded and stored as imageUrl
}

interface UpdateBlogRequest extends CreateBlogRequest {
  id: string | number; // Can be MongoDB _id (string) or auto-increment id (number)
}

interface GetBlogsRequest {
  page: number;
  pageSize: number;
  keyword?: string;
}

// ===== CREATE BLOG =====
export const createBlog = async ({
  title,
  description,
  category,
  keywords,
  image
}: CreateBlogRequest): Promise<ApiResponse<BlogType>> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("keywords", JSON.stringify(keywords)); // Convert array to JSON string

    if (image) {
      formData.append("image", image);
    }

    // Try new endpoint first, fallback to legacy
    let response;
    try {
      response = await axios.post(`${baseUrl}/api/blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      // Fallback to legacy endpoint
      if (error.response?.status === 404) {
        response = await axios.post(`${baseUrl}/api/blog/blogs`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        throw error;
      }
    }

    console.log("Create blog response:", response.data);

    // Handle your backend response structure
    if (response.data.status === true || response.data.success === true) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Blog created successfully"
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to create blog"
      };
    }
  } catch (error: any) {
    console.error("Create blog error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create blog"
    };
  }
};

// ===== GET BLOG BY ID =====
export const getBlogById = async (id: string | number): Promise<ApiResponse<BlogType>> => {
  try {
    // Try new endpoint first, fallback to legacy
    let response;
    try {
      response = await axios.get(`${baseUrl}/api/blogs/${id}`);
    } catch (error: any) {
      // Fallback to legacy endpoint
      if (error.response?.status === 404) {
        response = await axios.get(`${baseUrl}/api/blog/getblog/${id}`);
      } else {
        throw error;
      }
    }

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Blog fetched successfully',
    };
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch blog',
    };
  }
};

// ===== GET ALL BLOGS =====
export const getAllBlogs = async ({
  page,
  pageSize,
  keyword = "",
}: GetBlogsRequest): Promise<ApiResponse<PaginatedResponse<BlogType>>> => {
  try {
    // Try new endpoint first, fallback to legacy
    let response;
    try {
      response = await axios.get(`${baseUrl}/api/blogs`, {
        params: {
          page,
          pageSize,
          keyword,
        },
      });
    } catch (error: any) {
      // Fallback to legacy endpoint
      if (error.response?.status === 404) {
        response = await axios.get(`${baseUrl}/api/blog/getallblogs`, {
          params: {
            page,
            pageSize,
            keyword,
          },
        });
      } else {
        throw error;
      }
    }

    console.log("API Response:", response.data);

    // Handle your backend response structure
    if (response.data.status === true || response.data.success === true) {
      return {
        success: true,
        data: response.data.data, // Your backend has nested data structure
        message: response.data.message || "Blogs fetched successfully"
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to fetch blogs"
      };
    }
  } catch (error: any) {
    console.error("Get blogs error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch blogs"
    };
  }
};



// ===== UPDATE BLOG =====
export const updateBlog = async ({
  id,
  title,
  description,
  category,
  keywords,
  image
}: UpdateBlogRequest): Promise<ApiResponse<BlogType>> => {
  try {
    console.log("Updating blog with ID:", id);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("keywords", JSON.stringify(keywords)); // Convert array to JSON string

    if (image) {
      formData.append("image", image);
    }

    // Try new endpoint first, fallback to legacy
    let response;
    try {
      response = await axios.put(`${baseUrl}/api/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      // Fallback to legacy endpoint
      if (error.response?.status === 404) {
        response = await axios.put(`${baseUrl}/api/blog/blogs/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        throw error;
      }
    }

    console.log("Update blog response:", response.data);

    // Handle your backend response structure
    if (response.data.status === true || response.data.success === true) {
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || "Blog updated successfully"
      };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to update blog"
      };
    }
  } catch (error: any) {
    console.error("Update blog error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update blog"
    };
  }
};

// ===== DELETE BLOG =====
export const deleteBlog = async (id: string | number): Promise<ApiResponse> => {
  try {
    console.log("Deleting blog with ID:", id);

    // Try new endpoint first, fallback to legacy
    let response;
    try {
      response = await axios.delete(`${baseUrl}/api/blogs/${id}`);
    } catch (error: any) {
      // Fallback to legacy endpoint
      if (error.response?.status === 404) {
        response = await axios.delete(`${baseUrl}/api/blog/blogs/${id}`);
      } else {
        throw error;
      }
    }

    console.log("Delete blog response:", response.data);

    // Handle your backend response structure
    if (response.data?.status === true || response.data?.success === true || response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Blog deleted successfully"
      };
    } else {
      return {
        success: false,
        error: response.data?.message || "Failed to delete blog"
      };
    }
  } catch (error: any) {
    console.error("Delete blog error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete blog"
    };
  }
};

// ===== LEGACY FUNCTION (for backward compatibility) =====
export const useGetBlogList = getAllBlogs;
