"use client";

import { useState, useEffect, useCallback } from "react";
import { ContactDataTable } from "../components/table/data-table";
import { ContactType, GetContactsRequest } from "../type/contactType";
import { getAllContacts } from "../components/api/api";
import { Loader } from "@/components/globalfiles/loader";
import { toast } from "react-toastify";
import { MessageSquare } from "lucide-react";

const ContactPage = () => {
  const [data, setData] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    status?: string;
    service?: string;
    priority?: string;
  }>({});

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching contacts...");

      const requestParams: GetContactsRequest = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...filters,
      };

      const result = await getAllContacts(requestParams);

      if (result.status && result.data) {
        console.log("Contacts fetched successfully:", result.data);
        
        // Handle different response structures
        if (Array.isArray(result.data)) {
          // Direct array response
          setData(result.data);
          setTotalContacts(result.data.length);
          setTotalPages(1);
        } else if (result.data.data && Array.isArray(result.data.data)) {
          // Paginated response
          setData(result.data.data);
          setTotalContacts(result.data.pagination?.totalContacts || result.data.data.length);
          setTotalPages(result.data.pagination?.totalPages || 1);
        } else {
          console.warn("Unexpected data structure:", result.data);
          setData([]);
          setTotalContacts(0);
          setTotalPages(1);
        }
      } else {
        console.error("Failed to fetch contacts:", result.message);
        toast.error(result.message || "Failed to fetch contacts");
        setData([]);
        setTotalContacts(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      toast.error("An error occurred while fetching contacts");
      setData([]);
      setTotalContacts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Handle pagination changes
  const handlePaginationChange = (page: number, newPageSize: number) => {
    console.log("Pagination change:", { page, newPageSize });
    setCurrentPage(page);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when page size changes
    }
  };

  // Handle search
  const handleSearch = (search: string) => {
    console.log("Search change:", search);
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: {
    status?: string;
    service?: string;
    priority?: string;
  }) => {
    console.log("Filter change:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("Refreshing contacts...");
    fetchContacts();
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <Loader />
          <p className="text-gray-500 mt-2">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <ContactDataTable
        data={data}
        loading={loading}
        onRefresh={handleRefresh}
        onPaginationChange={handlePaginationChange}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        totalPages={totalPages}
        currentPage={currentPage}
        totalContacts={totalContacts}
      />
    </div>
  );
};

export default ContactPage;
