import axios from 'axios';
import { baseUrl } from '@/globalurl/baseurl';
import {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  GetFAQsRequest,
  FAQApiResponse,
  FAQPaginatedResponse,
  FAQStatistics
} from '@/types/faqs';

// ===== CREATE FAQ =====
export const createFAQ = async (faqData: CreateFAQRequest): Promise<FAQApiResponse<FAQ>> => {
  try {
    const response = await axios.post(`${baseUrl}/api/faqs`, faqData);

    if (response.data.status) {
      return {
        status: true,
        code: 201,
        message: "FAQ created successfully",
        data: response.data.data
      };
    } else {
      return {
        status: false,
        code: response.data.code || 400,
        message: response.data.message || "Failed to create FAQ"
      };
    }
  } catch (error: any) {
    console.error("Create FAQ error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to create FAQ",
      error: error.message
    };
  }
};

// ===== GET ALL FAQS =====
export const getAllFAQs = async (params: GetFAQsRequest = {}): Promise<FAQApiResponse<FAQPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/faqs`, { params });

    // Handle the response structure based on API documentation
    if (response.data.status) {
      return {
        status: true,
        code: 200,
        message: "FAQs retrieved successfully",
        data: {
          faqs: response.data.data || [],
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
        message: response.data.message || "Failed to fetch FAQs"
      };
    }
  } catch (error: any) {
    console.error("Get all FAQs error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch FAQs",
      error: error.message
    };
  }
};

// ===== GET FAQ BY ID =====
export const getFAQById = async (id: number): Promise<FAQApiResponse<FAQ>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/faqs/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "FAQ retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get FAQ by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch FAQ",
      error: error.message
    };
  }
};

// ===== UPDATE FAQ =====
export const updateFAQ = async (faqData: UpdateFAQRequest): Promise<FAQApiResponse<FAQ>> => {
  try {
    const { id, ...updateData } = faqData;
    const response = await axios.put(`${baseUrl}/api/faqs/${id}`, updateData);
    
    return {
      status: true,
      code: 200,
      message: "FAQ updated successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Update FAQ error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update FAQ",
      error: error.message
    };
  }
};

// ===== DELETE FAQ =====
export const deleteFAQ = async (id: number): Promise<FAQApiResponse<void>> => {
  try {
    await axios.delete(`${baseUrl}/api/faqs/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "FAQ deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete FAQ error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete FAQ",
      error: error.message
    };
  }
};

// ===== GET FAQS BY CATEGORY =====
export const getFAQsByCategory = async (category: string, params: Omit<GetFAQsRequest, 'category'> = {}): Promise<FAQApiResponse<FAQPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/faqs/category/${encodeURIComponent(category)}`, { params });
    
    return {
      status: true,
      code: 200,
      message: "FAQs by category retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get FAQs by category error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch FAQs by category",
      error: error.message
    };
  }
};

// ===== GET FAQ STATISTICS =====
export const getFAQStatistics = async (): Promise<FAQApiResponse<FAQStatistics>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/faqs/statistics`);
    
    return {
      status: true,
      code: 200,
      message: "FAQ statistics retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get FAQ statistics error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch FAQ statistics",
      error: error.message
    };
  }
};
