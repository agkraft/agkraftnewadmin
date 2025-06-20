import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";
import {
  ServiceType,
  ApiResponse,
  PaginatedResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  GetServicesRequest,
} from "../types/serviceTypes";

// ===== CREATE SERVICE =====
export const createService = async (
  serviceData: CreateServiceRequest
): Promise<ApiResponse<ServiceType>> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append("title", serviceData.title);
    formData.append("description", serviceData.description);
    formData.append("serviceDescription", serviceData.serviceDescription);

    if (serviceData.category && serviceData.category.length > 0) {
      formData.append("category", serviceData.category);
    }

    formData.append("status", serviceData.status || "active");
    formData.append("featured", String(serviceData.featured || false));

    // Add icon background color if provided
    if (serviceData.iconBgColor) {
      formData.append("iconBgColor", serviceData.iconBgColor);
    }
    
    // Add arrays as JSON strings
    formData.append("importantPoints", JSON.stringify(serviceData.importantPoints));
    formData.append("questionsAnswers", JSON.stringify(serviceData.questionsAnswers));
    formData.append("tags", JSON.stringify(serviceData.tags));
    
    // Add files
    if (serviceData.icon) {
      formData.append("icon", serviceData.icon);
    }
    
    if (serviceData.video) {
      formData.append("video", serviceData.video);
    }

    const response = await axios.post(`${baseUrl}/api/services`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: true,
      code: 201,
      message: "Service created successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Create service error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to create service",
      error: error.message
    };
  }
};

// ===== GET ALL SERVICES =====
export const getAllServices = async (
  params: GetServicesRequest = {}
): Promise<ApiResponse<PaginatedResponse<ServiceType>>> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));
    if (params.category) queryParams.append("category", params.category);
    if (params.status) queryParams.append("status", params.status);
    if (params.featured !== undefined) queryParams.append("featured", String(params.featured));
    if (params.search) queryParams.append("search", params.search);
    if (params.tags) queryParams.append("tags", params.tags);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await axios.get(`${baseUrl}/api/services?${queryParams.toString()}`);

    return {
      status: true,
      code: 200,
      message: "Services retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get services error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch services",
      error: error.message
    };
  }
};

// ===== GET SERVICE BY ID =====
export const getServiceById = async (id: number): Promise<ApiResponse<ServiceType>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/services/${id}`);

    return {
      status: true,
      code: 200,
      message: "Service retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get service by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch service",
      error: error.message
    };
  }
};

// ===== UPDATE SERVICE =====
export const updateService = async (
  serviceData: UpdateServiceRequest
): Promise<ApiResponse<ServiceType>> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append("title", serviceData.title);
    formData.append("description", serviceData.description);
    formData.append("serviceDescription", serviceData.serviceDescription);

    if (serviceData.category && serviceData.category.length > 0) {
      formData.append("category", serviceData.category);
    }

    formData.append("status", serviceData.status || "active");
    formData.append("featured", String(serviceData.featured || false));

    // Add icon background color if provided
    if (serviceData.iconBgColor) {
      formData.append("iconBgColor", serviceData.iconBgColor);
    }
    
    // Add arrays as JSON strings
    formData.append("importantPoints", JSON.stringify(serviceData.importantPoints));
    formData.append("questionsAnswers", JSON.stringify(serviceData.questionsAnswers));
    formData.append("tags", JSON.stringify(serviceData.tags));
    
    // Add files (only if new files are provided)
    if (serviceData.icon) {
      formData.append("icon", serviceData.icon);
    }
    
    if (serviceData.video) {
      formData.append("video", serviceData.video);
    }

    const response = await axios.put(`${baseUrl}/api/services/${serviceData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: true,
      code: 200,
      message: "Service updated successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Update service error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update service",
      error: error.message
    };
  }
};

// ===== DELETE SERVICE =====
export const deleteService = async (id: number): Promise<ApiResponse<void>> => {
  try {
    await axios.delete(`${baseUrl}/api/services/${id}`);

    return {
      status: true,
      code: 200,
      message: "Service deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete service error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete service",
      error: error.message
    };
  }
};

// ===== UTILITY FUNCTIONS =====

// Validate file size and type
export const validateFile = (file: File, type: 'icon' | 'video'): string | null => {
  const specs = {
    icon: {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/svg+xml']
    },
    video: {
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska']
    }
  };

  const spec = specs[type];
  
  if (file.size > spec.maxSize) {
    const maxSizeMB = spec.maxSize / (1024 * 1024);
    return `File size must be less than ${maxSizeMB}MB`;
  }
  
  if (!spec.allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${spec.allowedTypes.join(', ')}`;
  }
  
  return null;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
