import { baseUrl } from "@/globalurl/baseurl";
import axios from "axios";
import { 
  ContactType, 
  ContactApiResponse, 
  ContactPaginatedResponse, 
  ContactStatistics,
  GetContactsRequest,
  UpdateContactRequest 
} from "../../type/contactType";

// ===== GET ALL CONTACTS =====
export const getAllContacts = async ({
  page,
  limit,
  status,
  service,
  priority,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc"
}: GetContactsRequest): Promise<ContactApiResponse<ContactPaginatedResponse>> => {
  try {
    const params: any = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    // Add optional filters
    if (status) params.status = status;
    if (service) params.service = service;
    if (priority) params.priority = priority;
    if (search) params.search = search;

    const response = await axios.get(`${baseUrl}/api/contacts`, {
      params
    });

    // The API now returns the full response structure directly
    return response.data;
  } catch (error: any) {
    console.error("Get contacts error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to fetch contacts"
    };
  }
};

// ===== GET CONTACT BY ID =====
export const getContactById = async (id: string | number): Promise<ContactApiResponse<ContactType>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/contacts/${id}`);

    // Return the API response directly as it now includes the full structure
    return response.data;
  } catch (error: any) {
    console.error("Get contact by ID error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to fetch contact"
    };
  }
};

// ===== UPDATE CONTACT =====
export const updateContact = async ({
  id,
  ...updateData
}: UpdateContactRequest): Promise<ContactApiResponse<ContactType>> => {
  try {
    const response = await axios.put(`${baseUrl}/api/contacts/${id}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the API response directly as it now includes the full structure
    return response.data;
  } catch (error: any) {
    console.error("Update contact error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to update contact"
    };
  }
};

// ===== DELETE CONTACT =====
export const deleteContact = async (id: string | number): Promise<ContactApiResponse> => {
  try {
    const response = await axios.delete(`${baseUrl}/api/contacts/${id}`);

    // Return the API response directly as it now includes the full structure
    return response.data;
  } catch (error: any) {
    console.error("Delete contact error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to delete contact"
    };
  }
};

// ===== DELETE ALL CONTACTS =====
export const deleteAllContacts = async (): Promise<ContactApiResponse> => {
  try {
    // Since the API doesn't have a specific delete all endpoint,
    // we'll first get all contacts and then delete them one by one
    const allContactsResponse = await getAllContacts({
      page: 1,
      limit: 1000, // Get a large number to ensure we get all
    });

    if (!allContactsResponse.status || !allContactsResponse.data) {
      throw new Error("Failed to fetch contacts for deletion");
    }

    // Handle the new response structure where data is directly in the response
    const contacts = Array.isArray(allContactsResponse.data)
      ? allContactsResponse.data
      : allContactsResponse.data.data;
    const deletePromises = contacts.map(contact => 
      deleteContact(contact._id || contact.id!)
    );

    const results = await Promise.allSettled(deletePromises);
    
    // Check if all deletions were successful
    const failedDeletions = results.filter(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && !result.value.status)
    );

    if (failedDeletions.length > 0) {
      return {
        status: false,
        code: 500,
        message: `Failed to delete ${failedDeletions.length} out of ${contacts.length} contacts`
      };
    }

    return {
      status: true,
      code: 200,
      message: `Successfully deleted ${contacts.length} contacts`
    };
  } catch (error: any) {
    console.error("Delete all contacts error:", error);
    return {
      status: false,
      code: 500,
      message: error.message || "Failed to delete all contacts"
    };
  }
};

// ===== GET CONTACT STATISTICS =====
export const getContactStatistics = async (): Promise<ContactApiResponse<ContactStatistics>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/contacts/statistics`);

    // Return the API response directly as it now includes the full structure
    return response.data;
  } catch (error: any) {
    console.error("Get contact statistics error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to fetch contact statistics"
    };
  }
};

// ===== GET CONTACTS BY STATUS =====
export const getContactsByStatus = async (
  status: string,
  params: Omit<GetContactsRequest, 'status'>
): Promise<ContactApiResponse<ContactPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/contacts/status/${status}`, {
      params
    });

    // Return the API response directly as it now includes the full structure
    return response.data;
  } catch (error: any) {
    console.error("Get contacts by status error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to fetch contacts by status"
    };
  }
};

// ===== GET CONTACTS BY SERVICE =====
export const getContactsByService = async (
  service: string,
  params: Omit<GetContactsRequest, 'service'>
): Promise<ContactApiResponse<ContactPaginatedResponse>> => {
  try {
    const response = await axios.get(`${baseUrl}/api/contacts/service/${encodeURIComponent(service)}`, {
      params
    });

    // Return the API response directly as it now includes the full structure
    return response.data;
  } catch (error: any) {
    console.error("Get contacts by service error:", error);
    return {
      status: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Failed to fetch contacts by service"
    };
  }
};
