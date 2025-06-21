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
import { Search, Download } from 'lucide-react';
import { Loader } from '@/components/globalfiles/loader';
import { DataTablePagination } from '@/components/pagination';
import { createCareerColumns } from '../components/table/columns';
import { getAllCareerApplications, deleteCareerApplication } from '../api/careerApi';
import { CareerApplication, GetCareersRequest } from '@/types/careers';
import ViewCareerModal from '../components/modals/ViewCareerModal';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

const CareerManagementPage: React.FC = () => {
  // State for data management
  const [data, setData] = useState<CareerApplication[]>([]);
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');

  // Fetch data function
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params: GetCareersRequest = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter || undefined,
        status: statusFilter !== 'all' ? statusFilter as any : undefined,
        jobDescription: jobFilter !== 'all' ? jobFilter : undefined,
        sortBy: sorting[0]?.id || undefined,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const response = await getAllCareerApplications(params);

      if (response.status && response.data) {
        setData(response.data.careers);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching career applications:', error);
      toast.error('Failed to fetch career applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchApplications();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, jobFilter, sorting]);

  // Modal handlers
  const handleView = (application: CareerApplication) => {
    setSelectedApplication(application);
    setViewModalOpen(true);
  };

  const handleDelete = (application: CareerApplication) => {
    setSelectedApplication(application);
    setDeleteModalOpen(true);
  };

  const handleDownloadCV = (application: CareerApplication) => {
    if (application.cvUrl) {
      // Create a temporary link to download the CV
      const link = document.createElement('a');
      link.href = application.cvUrl;
      link.download = `${application.name}_CV.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CV download started');
    } else {
      toast.error('CV not available for download');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedApplication) return;

    try {
      const response = await deleteCareerApplication(selectedApplication.id);

      if (response.status) {
        toast.success('Career application deleted successfully!');
        fetchApplications(); // Refresh data
        setDeleteModalOpen(false);
        setSelectedApplication(null);
      } else {
        toast.error(response.message || 'Failed to delete career application');
      }
    } catch (error) {
      console.error('Error deleting career application:', error);
      toast.error('An error occurred while deleting the career application');
    }
  };

  // Create columns with handlers
  const columns = useMemo(
    () => createCareerColumns(handleView, handleDelete, handleDownloadCV),
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
          <h2 className="text-2xl font-bold text-gray-900">Career Applications</h2>
          <p className="text-gray-600">Manage job applications and candidate profiles</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Applications: {data.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search applications..."
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Job Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
            <SelectItem value="Backend Developer">Backend Developer</SelectItem>
            <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
            <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
            <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
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
                  No career applications found.
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

      {/* View Application Modal */}
      <ViewCareerModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        application={selectedApplication}
        onDownloadCV={handleDownloadCV}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Career Application
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the career application.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="py-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Application to be deleted:</h4>
                <p className="text-sm text-red-800 font-medium">
                  {selectedApplication.name} - {selectedApplication.jobDescription}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Email: {selectedApplication.email}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerManagementPage;
