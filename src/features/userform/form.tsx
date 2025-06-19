import { DataTable } from "./components/data-table";
import { columns } from "./components/column";
import { useEffect, useState } from "react";
import { usePagination } from "@/components/globalfiles/usePagination";
import { useDebounce } from "@/components/globalfiles/debounce";
import ErrorPage from "@/components/errorpage/error-page";
import { useGetFormList } from "./api/api";

const FormPage = () => {
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const [keyword] = useState<string>("");
  const queryString = useDebounce(keyword, 500);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await useGetFormList({
          page: page + 1,
          pageSize: limit,
          keyword: queryString,
        });
        setData(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setError(error);
      }
    };
    fetchData();
  }, [page, limit, queryString]);

  if (isError) {
    return <ErrorPage error={error} />;
  }
  return (
    <div className="p-3 text-[#ee6620] bg-[#F0EFF3] h-full flex flex-col gap-3 font-semibold">
      <div className="text-lg font-bold">User Forms</div>
      <DataTable
        title="Forms"
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        onPaginationChange={onPaginationChange}
        pagination={pagination}
        pageCount={data?.totalPages}
      />
    </div>
  );
};

export default FormPage;
