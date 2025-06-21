import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';
import { Loader } from '@/components/globalfiles/loader';
import { DataTablePagination } from '@/components/pagination';
import { createFAQColumns } from './columns';
import { getAllFAQs } from '../../api/faqApi';
import { FAQ, GetFAQsRequest } from '@/types/faqs';
import AddFAQModal from '../modals/AddFAQModal';
import EditFAQModal from '../modals/EditFAQModal';
import ViewFAQModal from '../modals/ViewFAQModal';
import DeleteFAQModal from '../modals/DeleteFAQModal';

interface FAQDataTableProps {
  data?: FAQ[];
  loading?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  totalPages?: number;
  currentPage?: number;
}

const FAQDataTable: React.FC<FAQDataTableProps> = ({
  data: propData,
  loading: propLoading,
  onPaginationChange,
  totalPages: propTotalPages,
  currentPage: propCurrentPage,
}) => {
  // State for internal data management
  const [data, setData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Use provided data or fetch internally
  const tableData = propData || data;
  const isLoading = propLoading !== undefined ? propLoading : loading;
  const page = propCurrentPage !== undefined ? propCurrentPage - 1 : pagination.pageIndex;
  const limit = pagination.pageSize;

  // Fetch data function
  const fetchFAQs = async () => {
    if (propData) return; // Don't fetch if data is provided

    setLoading(true);
    try {
      const params: GetFAQsRequest = {
        page: page + 1,
        limit,
        search: globalFilter || undefined,
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy: sorting[0]?.id || undefined,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const response = await getAllFAQs(params);

      if (response.status && response.data) {
        setData(response.data.faqs);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchFAQs();
  }, [page, limit, globalFilter, statusFilter, categoryFilter, sorting]);

  // Handle pagination
  useEffect(() => {
    if (onPaginationChange && !propData) {
      onPaginationChange(pagination.pageIndex + 1, pagination.pageSize);
    }
  }, [pagination, onPaginationChange, propData]);

  // Modal handlers
  const handleView = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setViewModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setEditModalOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    fetchFAQs(); // Refresh data
  };

  // Create columns with handlers
  const columns = useMemo(
    () => createFAQColumns(handleView, handleEdit, handleDelete),
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: page,
        pageSize: limit,
      },
    },
    manualPagination: !propData,
    pageCount: propData ? -1 : totalPages,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search FAQs..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell?.(cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No FAQs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        totalPages={propTotalPages || totalPages}
        currentPage={propCurrentPage || page + 1}
        onPageChange={(newPage) => {
          if (propData && onPaginationChange) {
            onPaginationChange(newPage, limit);
          } else {
            setPagination(prev => ({ ...prev, pageIndex: newPage - 1 }));
          }
        }}
        onPageSizeChange={(newPageSize) => {
          setPagination(prev => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
        }}
      />

      {/* Modals */}
      <AddFAQModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditFAQModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleSuccess}
        faq={selectedFAQ}
      />

      <ViewFAQModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        faq={selectedFAQ}
      />

      <DeleteFAQModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        faq={selectedFAQ}
      />
    </div>
  );
};

export default FAQDataTable;
