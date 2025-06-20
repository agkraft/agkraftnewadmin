"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
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
import { DataTablePagination } from "../../../blog/components/table/pagination";
import { Loader } from "@/components/globalfiles/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTeamModal from "./add-team";
import EditTeamModal from "./edit-team";
import DeleteTeamModal from "./delete-team";
import { TeamType } from "../../type/teamType";
import { createColumns } from "./column";
import { getAllTeams } from "../api/api";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";



interface TeamDataTableProps {
  data?: TeamType[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function TeamDataTable({ data: propData, loading: propLoading, onRefresh }: TeamDataTableProps) {
  const [data, setData] = useState<TeamType[]>(propData || []);
  const [loading, setLoading] = useState(propLoading || false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [, setTotalItems] = useState(0);
  const [queryString, setQueryString] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null);

  // Fetch teams data
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const result = await getAllTeams({
        page: page + 1,
        pageSize: limit,
        keyword: queryString,
      });



      if ((result.status || result.success) && result.data) {
        // Ensure we always set an array - API returns nested structure
        let teamData: TeamType[] = [];

        // Check for nested structure: result.data.data.teamMembers
        if (result.data.data && Array.isArray((result.data.data as any).teamMembers)) {
          teamData = (result.data.data as any).teamMembers;
        } else if (Array.isArray((result.data as any).teamMembers)) {
          teamData = (result.data as any).teamMembers;
        } else if (Array.isArray(result.data.data)) {
          teamData = result.data.data;
        } else if (Array.isArray(result.data)) {
          teamData = result.data;
        } else {
          teamData = [];
        }

        setData(teamData);
        // Handle pagination from the API response (nested structure)
        const pagination = (result.data.data as any)?.pagination || (result.data as any).pagination || {};
        setTotalPages(pagination.totalPages || (result.data as any).totalPages || 1);
        setTotalItems(pagination.totalCount || (result.data as any).totalItems || teamData.length);
      } else {
        console.error("API error:", result.error);
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page, limit, or query changes
  useEffect(() => {
    if (!propData) {
      fetchTeams();
    }
  }, [page, limit, queryString, propData]);

  // Use prop data if provided, otherwise use local state
  // Ensure tableData is always an array
  const tableData = Array.isArray(propData) ? propData : Array.isArray(data) ? data : [];

  // Handle search
  const handleSearch = (value: string) => {
    setQueryString(value);
    setPage(0); // Reset to first page when searching
  };

  // Modal handlers
  const handleEdit = (team: TeamType) => {
    setSelectedTeam(team);
    setIsEditModalOpen(true);
  };

  const handleDelete = (team: TeamType) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      fetchTeams();
    }
  };

  // Create columns with handlers
  const columns = useMemo(
    () => createColumns({ onEdit: handleEdit, onDelete: handleDelete }),
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
    manualPagination: !propData, // Use manual pagination when fetching data ourselves
    pageCount: propData ? -1 : totalPages,
  });

  // Handle pagination
  useEffect(() => {
    if (!propData) {
      table.setPageIndex(page);
    }
  }, [page, table, propData]);



  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={queryString}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <AddTeamModal setIsOpen={setIsAddModalOpen} onSuccess={handleSuccess} />
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No team members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Edit Modal */}
      {selectedTeam && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <EditTeamModal
            team={selectedTeam}
            setIsOpen={setIsEditModalOpen}
            onSuccess={handleSuccess}
          />
        </Dialog>
      )}

      {/* Delete Modal */}
      {selectedTeam && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DeleteTeamModal
            team={selectedTeam}
            setIsOpen={setIsDeleteModalOpen}
            onSuccess={handleSuccess}
          />
        </Dialog>
      )}
    </div>
  );
}
