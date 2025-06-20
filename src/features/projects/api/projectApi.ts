import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";
import {
  ProjectType,
  ApiResponse,
  PaginatedResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  GetProjectsRequest,
  ProjectStatistics,
} from "../types/projectTypes";

// ===== CREATE PROJECT =====
export const createProject = async (
  projectData: CreateProjectRequest
): Promise<ApiResponse<ProjectType>> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("processAndChallengeDescription", projectData.processAndChallengeDescription);
    formData.append("summaryDescription", projectData.summaryDescription);
    formData.append("projectCategory", projectData.projectCategory);

    if (projectData.clientName) {
      formData.append("clientName", projectData.clientName);
    }

    if (projectData.projectDeliveryDate) {
      formData.append("projectDeliveryDate", projectData.projectDeliveryDate);
    }

    if (projectData.processAndChallengeDescription2) {
      formData.append("processAndChallengeDescription2", projectData.processAndChallengeDescription2);
    }

    if (projectData.projectLink) {
      formData.append("projectLink", projectData.projectLink);
    }

    formData.append("status", projectData.status || "active");
    formData.append("featured", String(projectData.featured || false));
    
    // Add arrays as JSON strings
    if (projectData.processAndChallengePoints && projectData.processAndChallengePoints.length > 0) {
      formData.append("processAndChallengePoints", JSON.stringify(projectData.processAndChallengePoints));
    }
    
    if (projectData.tags && projectData.tags.length > 0) {
      formData.append("tags", JSON.stringify(projectData.tags));
    }
    
    // Add files
    if (projectData.bigImage) {
      formData.append("bigImage", projectData.bigImage);
    }
    
    if (projectData.miniImages && projectData.miniImages.length > 0) {
      projectData.miniImages.forEach((image) => {
        formData.append("miniImages", image);
      });
    }

    const response = await axios.post(`${baseUrl}/api/projects`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: true,
      code: 201,
      message: "Project created successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Create project error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to create project",
      error: error.message
    };
  }
};

// ===== GET ALL PROJECTS =====
export const getAllProjects = async (
  params: GetProjectsRequest = {}
): Promise<ApiResponse<PaginatedResponse<ProjectType>>> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.projectCategory) queryParams.append("projectCategory", params.projectCategory);
    if (params.featured !== undefined) queryParams.append("featured", params.featured.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await axios.get(`${baseUrl}/api/projects?${queryParams.toString()}`);

    return {
      status: true,
      code: 200,
      message: "Projects retrieved successfully",
      data: response.data
    };
  } catch (error: any) {
    console.error("Get projects error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch projects",
      error: error.message
    };
  }
};

// ===== GET PROJECT BY ID =====
export const getProjectById = async (id: number): Promise<ApiResponse<ProjectType>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/projects/${id}`);

    return {
      status: true,
      code: 200,
      message: "Project retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get project by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch project",
      error: error.message
    };
  }
};

// ===== UPDATE PROJECT =====
export const updateProject = async (
  projectData: UpdateProjectRequest
): Promise<ApiResponse<ProjectType>> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("processAndChallengeDescription", projectData.processAndChallengeDescription);
    formData.append("summaryDescription", projectData.summaryDescription);
    formData.append("projectCategory", projectData.projectCategory);

    if (projectData.clientName) {
      formData.append("clientName", projectData.clientName);
    }

    if (projectData.projectDeliveryDate) {
      formData.append("projectDeliveryDate", projectData.projectDeliveryDate);
    }

    if (projectData.processAndChallengeDescription2) {
      formData.append("processAndChallengeDescription2", projectData.processAndChallengeDescription2);
    }

    if (projectData.projectLink) {
      formData.append("projectLink", projectData.projectLink);
    }

    formData.append("status", projectData.status || "active");
    formData.append("featured", String(projectData.featured || false));
    
    // Add arrays as JSON strings
    if (projectData.processAndChallengePoints && projectData.processAndChallengePoints.length > 0) {
      formData.append("processAndChallengePoints", JSON.stringify(projectData.processAndChallengePoints));
    }
    
    if (projectData.tags && projectData.tags.length > 0) {
      formData.append("tags", JSON.stringify(projectData.tags));
    }
    
    // Add files (only if new files are provided)
    if (projectData.bigImage) {
      formData.append("bigImage", projectData.bigImage);
    }
    
    if (projectData.miniImages && projectData.miniImages.length > 0) {
      projectData.miniImages.forEach((image) => {
        formData.append("miniImages", image);
      });
    }

    const response = await axios.put(`${baseUrl}/api/projects/${projectData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: true,
      code: 200,
      message: "Project updated successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Update project error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update project",
      error: error.message
    };
  }
};

// ===== DELETE PROJECT =====
export const deleteProject = async (id: number): Promise<ApiResponse<ProjectType>> => {
  try {
    const response = await axios.delete(`${baseUrl}/api/projects/${id}`);

    return {
      status: true,
      code: 200,
      message: "Project deleted successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Delete project error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete project",
      error: error.message
    };
  }
};

// ===== GET FEATURED PROJECTS =====
export const getFeaturedProjects = async (limit: number = 6): Promise<ApiResponse<ProjectType[]>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/projects/featured?limit=${limit}`);

    return {
      status: true,
      code: 200,
      message: "Featured projects retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get featured projects error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch featured projects",
      error: error.message
    };
  }
};

// ===== GET PROJECT STATISTICS =====
export const getProjectStatistics = async (): Promise<ApiResponse<ProjectStatistics>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/projects/statistics`);

    return {
      status: true,
      code: 200,
      message: "Project statistics retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get project statistics error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch project statistics",
      error: error.message
    };
  }
};

// ===== FILE VALIDATION UTILITIES =====
export const validateFile = (file: File, type: 'image' | 'video' = 'image'): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    return `File size must be less than ${formatFileSize(maxSize)}`;
  }
  
  if (type === 'image') {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and WebP images are allowed';
    }
  }
  
  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
