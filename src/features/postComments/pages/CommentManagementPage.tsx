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
import { Search, Eye, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Loader } from '@/components/globalfiles/loader';
import { DataTablePagination } from '@/components/pagination';
import { getAllComments, deleteComment, moderateComment } from '../api/commentApi';
import { PostComment, GetCommentsRequest, CommentStatus } from '@/types/postComments';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

const CommentManagementPage: React.FC = () => {
  // State for data management
  const [data, setData] = useState<PostComment[]>([]);
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
  const [selectedComment, setSelectedComment] = useState<PostComment | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [blogIdFilter, setBlogIdFilter] = useState<string>('');

  const StatusColors: Record<CommentStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'spam': 'bg-gray-100 text-gray-800',
  };

  // Actions component for table
  const Actions: React.FC<{ comment: PostComment }> = ({ comment }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleView(comment)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {comment.status !== 'approved' && (
            <DropdownMenuItem onClick={() => handleModerate(comment, 'approved')}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Approve
            </DropdownMenuItem>
          )}
          {comment.status !== 'rejected' && (
            <DropdownMenuItem onClick={() => handleModerate(comment, 'rejected')}>
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Reject
            </DropdownMenuItem>
          )}
          {comment.status !== 'spam' && (
            <DropdownMenuItem onClick={() => handleModerate(comment, 'spam')}>
              <AlertTriangle className="mr-2 h-4 w-4 text-orange-600" />
              Mark as Spam
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={() => handleDelete(comment)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Create columns
  const columns: ColumnDef<PostComment>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "blogId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Blog ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium text-blue-600">{row.getValue("blogId")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="max-w-[150px]">
            <div className="truncate font-medium" title={name}>
              {name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return (
          <div className="max-w-[200px]">
            <div className="truncate text-sm" title={email}>
              {email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const comment = row.getValue("comment") as string;
        return (
          <div className="max-w-[300px]">
            <div className="truncate" title={comment}>
              {comment}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as CommentStatus;
        return (
          <Badge className={StatusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isVisible",
      header: "Visibility",
      cell: ({ row }) => {
        const isVisible = row.getValue("isVisible") as boolean;
        return (
          <Badge variant={isVisible ? "default" : "secondary"}>
            {isVisible ? "Visible" : "Hidden"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Posted Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const comment = row.original;
        return <Actions comment={comment} />;
      },
    },
  ], []);

  // Fetch data function
  const fetchComments = async () => {
    setLoading(true);
    try {
      const params: GetCommentsRequest = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter || undefined,
        status: statusFilter !== 'all' ? statusFilter as CommentStatus : undefined,
        isVisible: visibilityFilter !== 'all' ? visibilityFilter === 'visible' : undefined,
        blogId: blogIdFilter ? parseInt(blogIdFilter) : undefined,
        sortBy: sorting[0]?.id || undefined,
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const response = await getAllComments(params);

      if (response.status && response.data) {
        setData(response.data.comments);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchComments();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, visibilityFilter, blogIdFilter, sorting]);

  // Modal handlers
  const handleView = (comment: PostComment) => {
    setSelectedComment(comment);
    setViewModalOpen(true);
  };

  const handleDelete = (comment: PostComment) => {
    setSelectedComment(comment);
    setDeleteModalOpen(true);
  };

  const handleModerate = async (comment: PostComment, status: 'approved' | 'rejected' | 'spam') => {
    try {
      const response = await moderateComment(comment.id, status, 'Admin', status === 'approved');

      if (response.status) {
        toast.success(`Comment ${status} successfully!`);
        fetchComments(); // Refresh data
      } else {
        toast.error(response.message || `Failed to ${status} comment`);
      }
    } catch (error) {
      console.error(`Error moderating comment:`, error);
      toast.error(`An error occurred while moderating the comment`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedComment) return;

    try {
      const response = await deleteComment(selectedComment.id);

      if (response.status) {
        toast.success('Comment deleted successfully!');
        fetchComments(); // Refresh data
        setDeleteModalOpen(false);
        setSelectedComment(null);
      } else {
        toast.error(response.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('An error occurred while deleting the comment');
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Post Comments Management</h2>
          <p className="text-gray-600">Moderate and manage user comments</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Comments: {data.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search comments..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
        <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by Blog ID"
          value={blogIdFilter}
          onChange={(e) => setBlogIdFilter(e.target.value)}
          className="w-[150px]"
          type="number"
        />
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
                  No comments found.
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

      {/* View Comment Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Comment Details
            </DialogTitle>
          </DialogHeader>

          {selectedComment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedComment.name}</h3>
                  <p className="text-sm text-gray-600">{selectedComment.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={StatusColors[selectedComment.status]}>
                    {selectedComment.status}
                  </Badge>
                  <Badge variant={selectedComment.isVisible ? "default" : "secondary"}>
                    {selectedComment.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800 leading-relaxed">{selectedComment.comment}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Blog ID:</span> {selectedComment.blogId}
                </div>
                <div>
                  <span className="font-medium">IP Address:</span> {selectedComment.ipAddress}
                </div>
                <div>
                  <span className="font-medium">Posted:</span> {new Date(selectedComment.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {new Date(selectedComment.updatedAt).toLocaleString()}
                </div>
                {selectedComment.moderatedBy && (
                  <>
                    <div>
                      <span className="font-medium">Moderated by:</span> {selectedComment.moderatedBy}
                    </div>
                    <div>
                      <span className="font-medium">Moderated at:</span> {selectedComment.moderatedAt ? new Date(selectedComment.moderatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Comment
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the comment.
            </DialogDescription>
          </DialogHeader>

          {selectedComment && (
            <div className="py-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Comment to be deleted:</h4>
                <p className="text-sm text-red-800 font-medium">
                  From: {selectedComment.name} ({selectedComment.email})
                </p>
                <p className="text-xs text-red-600 mt-1 truncate">
                  "{selectedComment.comment}"
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
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentManagementPage;
