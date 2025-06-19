import { useState } from "react";

export function usePagination(initialSize = 25) {
    const [pagination, setPagination] = useState<{ pageSize: number, pageIndex: number }>({
        pageSize: initialSize,
        pageIndex: 0,
    });
    const { pageSize, pageIndex } = pagination;

    return {
        // table state
        onPaginationChange: setPagination,
        pagination,
        // API
        limit: pageSize,
        page: pageIndex,
    };
}