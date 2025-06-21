import axios from 'axios';
import { baseUrl } from '@/globalurl/baseurl';
import {
  JobProfile,
  CreateJobRequest,
  UpdateJobRequest,
  GetJobsRequest,
  JobApiResponse,
  JobPaginatedResponse,
  JobStatistics
} from '@/types/jobProfiles';

// ===== CREATE JOB PROFILE =====
export const createJobProfile = async (jobData: CreateJobRequest): Promise<JobApiResponse<JobProfile>> => {
  try {
    const response = await axios.post(`${baseUrl}/api/jobs`, jobData);

    if (response.data.status) {
      return {
        status: true,
        code: 201,
        message: "Job profile created successfully",
        data: response.data.data
      };
    } else {
      return {
        status: false,
        code: response.data.code || 400,
        message: response.data.message || "Failed to create job profile"
      };
    }
  } catch (error: any) {
    console.error("Create job profile error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to create job profile",
      error: error.message
    };
  }
};

// ===== GET ACTIVE JOBS (Public) =====
export const getActiveJobs = async (params: Omit<GetJobsRequest, 'status'> = {}): Promise<JobApiResponse<JobPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/jobs/active`, { params });
    
    return {
      status: true,
      code: 200,
      message: "Active jobs retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get active jobs error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch active jobs",
      error: error.message
    };
  }
};

// ===== GET ALL JOB PROFILES (Admin) =====
export const getAllJobProfiles = async (params: GetJobsRequest = {}): Promise<JobApiResponse<JobPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/jobs`, { params });

    // Handle the response structure based on API documentation
    if (response.data.status) {
      return {
        status: true,
        code: 200,
        message: "Job profiles retrieved successfully",
        data: {
          jobs: response.data.data || [],
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
        message: response.data.message || "Failed to fetch job profiles"
      };
    }
  } catch (error: any) {
    console.error("Get all job profiles error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch job profiles",
      error: error.message
    };
  }
};

// ===== GET JOB PROFILE BY ID =====
export const getJobProfileById = async (id: number): Promise<JobApiResponse<JobProfile>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/jobs/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "Job profile retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get job profile by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch job profile",
      error: error.message
    };
  }
};

// ===== UPDATE JOB PROFILE =====
export const updateJobProfile = async (jobData: UpdateJobRequest): Promise<JobApiResponse<JobProfile>> => {
  try {
    const { id, ...updateData } = jobData;
    const response = await axios.put(`${baseUrl}/api/jobs/${id}`, updateData);
    
    return {
      status: true,
      code: 200,
      message: "Job profile updated successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Update job profile error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update job profile",
      error: error.message
    };
  }
};

// ===== DELETE JOB PROFILE =====
export const deleteJobProfile = async (id: number): Promise<JobApiResponse<void>> => {
  try {
    await axios.delete(`${baseUrl}/api/jobs/${id}`);
    
    return {
      status: true,
      code: 200,
      message: "Job profile deleted successfully"
    };
  } catch (error: any) {
    console.error("Delete job profile error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete job profile",
      error: error.message
    };
  }
};

// ===== GET JOBS BY TECH STACK =====
export const getJobsByTechStack = async (techStack: string, params: Omit<GetJobsRequest, 'techStack'> = {}): Promise<JobApiResponse<JobPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/jobs/techstack/${encodeURIComponent(techStack)}`, { params });
    
    return {
      status: true,
      code: 200,
      message: "Jobs by tech stack retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get jobs by tech stack error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch jobs by tech stack",
      error: error.message
    };
  }
};

// ===== GET JOB STATISTICS =====
export const getJobStatistics = async (): Promise<JobApiResponse<JobStatistics>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/jobs/statistics`);
    
    return {
      status: true,
      code: 200,
      message: "Job statistics retrieved successfully",
      data: response.data.data
    };
  } catch (error: any) {
    console.error("Get job statistics error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch job statistics",
      error: error.message
    };
  }
};

// ===== HELPER FUNCTION: CHECK IF JOB IS ACCEPTING APPLICATIONS =====
export const isJobAcceptingApplications = (job: JobProfile): boolean => {
  const now = new Date();
  const startDate = new Date(job.startDateApplied);
  const endDate = new Date(job.lastDayApplied);
  
  return job.status === 'active' && now >= startDate && now <= endDate;
};

// ===== HELPER FUNCTION: GET JOBS ACCEPTING APPLICATIONS =====
export const getJobsAcceptingApplications = async (params: GetJobsRequest = {}): Promise<JobApiResponse<JobPaginatedResponse>> => {
  try {
    const response = await getAllJobProfiles({
      ...params,
      status: 'active',
      isAcceptingApplications: true
    });
    
    if (response.status && response.data) {
      // Filter jobs that are currently accepting applications
      const filteredJobs = response.data.jobs.filter(isJobAcceptingApplications);
      
      return {
        ...response,
        data: {
          ...response.data,
          jobs: filteredJobs
        }
      };
    }
    
    return response;
  } catch (error: any) {
    console.error("Get jobs accepting applications error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch jobs accepting applications",
      error: error.message
    };
  }
};
