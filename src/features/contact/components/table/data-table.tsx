"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { DataTablePagination } from "@/components/pagination";
import { Loader } from "@/components/globalfiles/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactType } from "../../type/contactType";
import { createColumns } from "./column";
import DeleteContactModal, { ViewContactModal } from "./delete-contact";
import { Search, Trash2, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTACT_STATUS, CONTACT_SERVICES, CONTACT_PRIORITY } from "../../type/contactType";

interface ContactDataTableProps {
  data: ContactType[];
  loading: boolean;
  onRefresh?: () => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSearch?: (search: string) => void;
  onFilterChange?: (filters: {
    status?: string;
    service?: string;
    priority?: string;
  }) => void;
  totalPages?: number;
  currentPage?: number;
  totalContacts?: number;
}

export function ContactDataTable({
  data,
  loading,
  onRefresh,
  onPaginationChange,
  onSearch,
  onFilterChange,
  totalPages = 1,
  currentPage = 1,
  totalContacts = 0,
}: ContactDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: currentPage - 1,
    pageSize: 10,
  });

  // CRUD Handlers
  const handleDelete = (contact: ContactType) => {
    setSelectedContact(contact);
    setIsDeleteOpen(true);
  };

  const handleView = (contact: ContactType) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  };

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Search handler
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Filter handlers
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    if (onFilterChange) {
      onFilterChange({
        status: value === "all" ? undefined : value,
        service: serviceFilter === "all" ? undefined : serviceFilter,
        priority: priorityFilter === "all" ? undefined : priorityFilter,
      });
    }
  };

  const handleServiceFilter = (value: string) => {
    setServiceFilter(value);
    if (onFilterChange) {
      onFilterChange({
        status: statusFilter === "all" ? undefined : statusFilter,
        service: value === "all" ? undefined : value,
        priority: priorityFilter === "all" ? undefined : priorityFilter,
      });
    }
  };

  const handlePriorityFilter = (value: string) => {
    setPriorityFilter(value);
    if (onFilterChange) {
      onFilterChange({
        status: statusFilter === "all" ? undefined : statusFilter,
        service: serviceFilter === "all" ? undefined : serviceFilter,
        priority: value === "all" ? undefined : value,
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setPriorityFilter("all");
    setGlobalFilter("");
    if (onFilterChange) {
      onFilterChange({});
    }
    if (onSearch) {
      onSearch("");
    }
  };

  // Create dynamic columns with CRUD handlers
  const dynamicColumns = useMemo(() => {
    return createColumns({
      onDelete: handleDelete,
      onView: handleView,
    });
  }, []);

  const table = useReactTable({
    data,
    columns: dynamicColumns as ColumnDef<ContactType, any>[],
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  // Handle pagination changes
  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(pagination.pageIndex + 1, pagination.pageSize);
    }
  }, [pagination, onPaginationChange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full space-y-4">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contact Management</h2>
          <p className="text-muted-foreground">
            Manage and view all contact form submissions ({totalContacts} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search contacts..."
            value={globalFilter}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {CONTACT_STATUS.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={handleServiceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {CONTACT_SERVICES.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {CONTACT_PRIORITY.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(statusFilter !== "all" || serviceFilter !== "all" || priorityFilter !== "all" || globalFilter) && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
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
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={dynamicColumns.length}
                  className="h-24 text-center"
                >
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Delete Modal */}
      {selectedContact && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DeleteContactModal
            contact={selectedContact}
            setIsOpen={setIsDeleteOpen}
            onSuccess={handleSuccess}
          />
        </Dialog>
      )}

      {/* View Modal */}
      {selectedContact && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <ViewContactModal
            contact={selectedContact}
            setIsOpen={setIsViewOpen}
          />
        </Dialog>
      )}
    </div>
  );
}
