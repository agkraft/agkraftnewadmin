import { DataTable } from "../components/table/data-table";
import { useEffect, useState, useCallback } from "react";
import { usePagination } from "@/components/globalfiles/usePagination";
import { useDebounce } from "@/components/globalfiles/debounce";
import ErrorPage from "@/components/errorpage/error-page";
import { getAllBlogs, useGetBlogList } from "../components/api/api";

const BlogPageRoutes = () => {
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const [keyword] = useState<string>("");
  const queryString = useDebounce(keyword, 500);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Try new API first since you have data showing in network
      let result;
      try {
        console.log("Fetching blogs with params:", { page: page + 1, pageSize: limit, keyword: queryString });

        result = await getAllBlogs({
          page: page + 1,
          pageSize: limit,
          keyword: queryString,
        });

        console.log("New API result:", result);

        if (result.success) {
          console.log("Setting data from new API:", result.data);
          setData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch blogs");
        }
      } catch (newApiError) {
        console.log("New API failed, trying legacy API...", newApiError);
        // Try legacy API as fallback
        try {
          result = await useGetBlogList({
            page: page + 1,
            pageSize: limit,
            keyword: queryString,
          });

          console.log("Legacy API result:", result);

          if (result.error) {
            throw new Error(result.error);
          } else {
            console.log("Setting data from legacy API:", result);
            setData(result);
          }
        } catch (legacyError) {
          console.error("Both APIs failed:", { newApiError, legacyError });
          throw new Error("Failed to fetch blogs from both endpoints");
        }
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      setIsError(true);
      setError(error.message || "Failed to fetch blogs");

      // Set empty data structure to show table with Add button
      setData({
        data: [],
        totalPages: 0,
        currentPage: 1,
        totalItems: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-3 text-[#ee6620] bg-[#F0EFF3] h-full flex flex-col gap-3 font-semibold">
      <div className="text-lg font-bold">Blog Management</div>

      {/* Show error message but don't hide the table */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-center">
            <div className="text-red-600 text-sm">
              <strong>Error:</strong> {error || "Something went wrong while fetching data"}
            </div>
          </div>
        </div>
      )}

      <DataTable
        title="Blogs"
        columns={[]} // Will be handled by DataTable internally
        data={(() => {
          console.log("Data passed to table:", data);
          console.log("data?.data:", data?.data);
          console.log("Is data?.data array?", Array.isArray(data?.data));

          // Handle different data structures
          if (Array.isArray(data?.data)) {
            return data.data;
          } else if (Array.isArray(data)) {
            return data;
          } else {
            return [];
          }
        })()}
        loading={isLoading}
        onPaginationChange={onPaginationChange}
        pagination={pagination}
        pageCount={data?.totalPages || 0}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default BlogPageRoutes;
