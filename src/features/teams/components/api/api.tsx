import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";
import { TeamType, SocialMedia } from "../../type/teamType";

// API Response Types
interface ApiResponse<T = any> {
  success?: boolean;
  status?: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

interface PaginatedResponse<T> {
  teamMembers?: T[];
  data?: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}

// Request Types (matching backend MongoDB schema)
interface CreateTeamRequest {
  name: string;
  jobCategory: string;
  socialMedia: SocialMedia;
  status?: "active" | "inactive";
  image?: File | null; // Will be uploaded and stored as imageUrl
}

interface UpdateTeamRequest extends CreateTeamRequest {
  id: string | number; // Can be MongoDB _id (string) or auto-increment id (number)
}

interface GetTeamsRequest {
  page: number;
  pageSize: number;
  keyword?: string;
}

// ===== CREATE TEAM =====
export const createTeam = async ({
  name,
  jobCategory,
  socialMedia,
  status = "active",
  image
}: CreateTeamRequest): Promise<ApiResponse<TeamType>> => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("jobCategory", jobCategory);
    formData.append("socialMedia", JSON.stringify(socialMedia));
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    const response = await axios.post(`${baseUrl}/api/team`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: true,
      success: true,
      data: response.data,
      message: "Team member created successfully"
    };
  } catch (error: any) {
    console.error("Create team error:", error);
    return {
      status: false,
      success: false,
      error: error.response?.data?.message || error.message || "Failed to create team member"
    };
  }
};

// ===== GET ALL TEAMS =====
export const getAllTeams = async ({
  page,
  pageSize,
  keyword = "",
}: GetTeamsRequest): Promise<ApiResponse<PaginatedResponse<TeamType>>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/team`, {
      params: {
        page,
        pageSize,
        keyword,
      },
    });

    return {
      status: true,
      success: true,
      data: response.data,
      message: "Teams fetched successfully"
    };
  } catch (error: any) {
    console.error("Get teams error:", error);
    return {
      status: false,
      success: false,
      error: error.response?.data?.message || error.message || "Failed to fetch teams"
    };
  }
};

// ===== GET TEAM BY ID =====
export const getTeamById = async (id: string | number): Promise<ApiResponse<TeamType>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/team/${id}`);

    return {
      status: true,
      success: true,
      data: response.data,
      message: "Team member fetched successfully"
    };
  } catch (error: any) {
    console.error("Get team by ID error:", error);
    return {
      status: false,
      success: false,
      error: error.response?.data?.message || error.message || "Failed to fetch team member"
    };
  }
};

// ===== UPDATE TEAM =====
export const updateTeam = async ({
  id,
  name,
  jobCategory,
  socialMedia,
  status = "active",
  image
}: UpdateTeamRequest): Promise<ApiResponse<TeamType>> => {
  try {
    console.log("updateTeam API call with ID:", id);
    console.log("updateTeam API URL:", `${baseUrl}/api/team/${id}`);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("jobCategory", jobCategory);
    formData.append("socialMedia", JSON.stringify(socialMedia));
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    // Try the API call
    let response;
    try {
      response = await axios.put(`${baseUrl}/api/team/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (firstError: any) {
      // If it fails with 404 and we have a string ID, it might be MongoDB _id
      // Let's check if the backend expects numeric ID instead
      if (firstError.response?.status === 404 && typeof id === 'string') {
        console.log("First attempt failed with 404, this might be a MongoDB _id issue");
        throw firstError; // Re-throw the original error for now
      }
      throw firstError;
    }

    return {
      status: true,
      success: true,
      data: response.data,
      message: "Team member updated successfully"
    };
  } catch (error: any) {
    console.error("Update team error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return {
      status: false,
      success: false,
      error: error.response?.data?.message || error.message || "Failed to update team member"
    };
  }
};

// ===== DELETE TEAM =====
export const deleteTeam = async (id: string | number): Promise<ApiResponse> => {
  try {
    console.log("deleteTeam API call with ID:", id);
    console.log("deleteTeam API URL:", `${baseUrl}/api/team/${id}`);

    const response = await axios.delete(`${baseUrl}/api/team/${id}`);

    return {
      status: true,
      success: true,
      data: response.data,
      message: "Team member deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete team error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return {
      status: false,
      success: false,
      error: error.response?.data?.message || error.message || "Failed to delete team member"
    };
  }
};

// ===== LEGACY SUPPORT FUNCTIONS =====
// These functions provide backward compatibility if needed
export const useGetTeamList = getAllTeams;
export const useCreateTeam = createTeam;
export const useUpdateTeam = updateTeam;
export const useDeleteTeam = deleteTeam;
