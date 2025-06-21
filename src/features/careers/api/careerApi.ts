import axios from 'axios';
import { baseUrl } from '@/globalurl/baseurl';
import {
  CareerApplication,
  CreateCareerRequest,
  UpdateCareerRequest,
  GetCareersRequest,
  CareerApiResponse,
  CareerPaginatedResponse,
  CareerStatistics
} from '@/types/careers';

// ===== CREATE CAREER APPLICATION =====
export const createCareerApplication = async (careerData: CreateCareerRequest): Promise<CareerApiResponse<CareerApplication>> => {
  try {
    const formData = new FormData();

    // Append all form fields
    formData.append('name', careerData.name);
    formData.append('email', careerData.email);
    formData.append('jobDescription', careerData.jobDescription);
    formData.append('techStack', careerData.techStack);
    formData.append('whyHireYou', careerData.whyHireYou);

    // Append optional fields
    if (careerData.experience) formData.append('experience', careerData.experience);
    if (careerData.expectedSalary) formData.append('expectedSalary', careerData.expectedSalary);
    if (careerData.availableFrom) formData.append('availableFrom', careerData.availableFrom);
    if (careerData.phoneNumber) formData.append('phoneNumber', careerData.phoneNumber);
    if (careerData.linkedinProfile) formData.append('linkedinProfile', careerData.linkedinProfile);
    if (careerData.githubProfile) formData.append('githubProfile', careerData.githubProfile);
    if (careerData.portfolioUrl) formData.append('portfolioUrl', careerData.portfolioUrl);

    // Append CV file
    formData.append('cv', careerData.cv);

    const response = await axios.post(`${baseUrl}/api/careers`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.status) {
      return {
        status: true,
        code: 201,
        message: "Career application submitted successfully",
        data: response.data.data
      };
    } else {
      return {
        status: false,
        code: response.data.code || 400,
        message: response.data.message || "Failed to submit career application"
      };
    }
  } catch (error: any) {
    console.error("Create career application error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to submit career application",
      error: error.message
    };
  }
};

// ===== GET ALL CAREER APPLICATIONS =====
export const getAllCareerApplications = async (params: GetCareersRequest = {}): Promise<CareerApiResponse<CareerPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/careers`, { params });

    // Handle the response structure based on API documentation
    if (response.data.status) {
      return {
        status: true,
        code: 200,
        message: "Career applications retrieved successfully",
        data: {
          careers: response.data.data || [],
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
        message: response.data.message || "Failed to fetch career applications"
      };
    }
  } catch (error: any) {
    console.error("Get all career applications error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch career applications",
      error: error.message
    };
  }
};

// ===== GET CAREER APPLICATION BY ID =====
export const getCareerApplicationById = async (id: number): Promise<CareerApiResponse<CareerApplication>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/careers/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "Career application retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get career application by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch career application",
      error: error.message
    };
  }
};

// ===== UPDATE CAREER APPLICATION =====
export const updateCareerApplication = async (careerData: UpdateCareerRequest): Promise<CareerApiResponse<CareerApplication>> => {
  try {
    const { id, cv, ...updateData } = careerData;
    
    let requestData: FormData | any = updateData;
    let headers: any = {};
    
    // If CV file is provided, use FormData
    if (cv) {
      const formData = new FormData();
      
      // Append all update fields
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Append CV file
      formData.append('cv', cv);
      
      requestData = formData;
      headers['Content-Type'] = 'multipart/form-data';
    }
    
    const response = await axios.put(`${baseUrl}/api/careers/${id}`, requestData, { headers });
    
    return {
      status: true,
      code: 200,
      message: "Career application updated successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Update career application error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update career application",
      error: error.message
    };
  }
};

// ===== DELETE CAREER APPLICATION =====
export const deleteCareerApplication = async (id: number): Promise<CareerApiResponse<void>> => {
  try {
    await axios.delete(`${baseUrl}/api/careers/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "Career application deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete career application error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete career application",
      error: error.message
    };
  }
};

// ===== GET APPLICATIONS BY JOB DESCRIPTION =====
export const getApplicationsByJob = async (jobDescription: string, params: Omit<GetCareersRequest, 'jobDescription'> = {}): Promise<CareerApiResponse<CareerPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/careers/job/${encodeURIComponent(jobDescription)}`, { params });
    
    return {
      status: true,
      code: 200,
      message: "Applications by job retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get applications by job error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch applications by job",
      error: error.message
    };
  }
};

// ===== GET CAREER STATISTICS =====
export const getCareerStatistics = async (): Promise<CareerApiResponse<CareerStatistics>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/careers/statistics`);
    
    return {
      status: true,
      code: 200,
      message: "Career statistics retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get career statistics error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch career statistics",
      error: error.message
    };
  }
};
