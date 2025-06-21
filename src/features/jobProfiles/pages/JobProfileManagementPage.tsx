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
import { Search, Plus } from 'lucide-react';
import { Loader } from '@/components/globalfiles/loader';
import { DataTablePagination } from '@/components/pagination';
import { createJobColumns } from '../components/table/columns';
import { getAllJobProfiles, deleteJobProfile } from '../api/jobApi';
import { JobProfile, GetJobsRequest } from '@/types/jobProfiles';
import AddJobModal from '../components/modals/AddJobModal';
import ViewJobModal from '../components/modals/ViewJobModal';
import EditJobModal from '../components/modals/EditJobModal';
import DeleteJobModal from '../components/modals/DeleteJobModal';
import { toast } from 'react-toastify';


const JobProfileManagementPage: React.FC = () => {
  // State for data management
  const [data, setData] = useState<JobProfile[]>([]);
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobProfile | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');

  // Fetch data function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: GetJobsRequest = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter || undefined,
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        jobType: jobTypeFilter !== 'all' ? jobTypeFilter as any : undefined,
        sortBy: sorting[0]?.id || undefined,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const response = await getAllJobProfiles(params);

      if (response.status && response.data) {
        setData(response.data.jobs);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching job profiles:', error);
      toast.error('Failed to fetch job profiles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, jobTypeFilter, sorting]);

  // Modal handlers
  const handleView = (job: JobProfile) => {
    setSelectedJob(job);
    setViewModalOpen(true);
  };

  const handleEdit = (job: JobProfile) => {
    setSelectedJob(job);
    setEditModalOpen(true);
  };

  const handleDelete = (job: JobProfile) => {
    setSelectedJob(job);
    setDeleteModalOpen(true);
  };



  const handleSuccess = () => {
    fetchJobs(); // Refresh data
  };

  // Create columns with handlers
  const columns = useMemo(
    () => createJobColumns(handleView, handleEdit, handleDelete),
    []
  );

  const table = useReactTable({
    data,
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
      pagination,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Profile Management</h2>
          <p className="text-gray-600">Manage job postings and profiles</p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Job Profile
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search job profiles..."
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
        <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
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
                  No job profiles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        totalPages={totalPages}
        currentPage={pagination.pageIndex + 1}
        onPageChange={(newPage) => {
          setPagination(prev => ({ ...prev, pageIndex: newPage - 1 }));
        }}
        onPageSizeChange={(newPageSize) => {
          setPagination(prev => ({ ...prev, pageSize: newPageSize, pageIndex: 0 }));
        }}
      />

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* View Job Modal */}
      <ViewJobModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        job={selectedJob}
      />

      {/* Edit Job Modal */}
      <EditJobModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleSuccess}
        job={selectedJob}
      />

      {/* Delete Job Modal */}
      <DeleteJobModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={handleSuccess}
        job={selectedJob}
      />
    </div>
  );
};

export default JobProfileManagementPage;
