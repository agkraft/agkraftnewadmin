import React, { useState } from 'react';
import { DataTable } from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Star, StarOff } from 'lucide-react';
import { ServiceType, SERVICE_CATEGORIES, SERVICE_STATUSES } from '../types/serviceTypes';

interface ServiceDataTableProps {
  services: ServiceType[];
  loading: boolean;
  onEdit: (service: ServiceType) => void;
  onDelete: (id: number) => void;
  onView: (service: ServiceType) => void;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onCategoryFilter: (category: string) => void;
  onStatusFilter: (status: string) => void;
  onFeaturedFilter: (featured: string) => void;
}

const ServiceDataTable: React.FC<ServiceDataTableProps> = ({
  services,
  loading,
  onEdit,
  onDelete,
  onView,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onCategoryFilter,
  onStatusFilter,
  onFeaturedFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Helper function to parse malformed tags from backend
  const parseTags = (tags: string[]): string[] => {
    if (!tags || !Array.isArray(tags)) return [];

    try {
      // Check if tags are malformed (double stringified)
      if (tags.length > 0 && typeof tags[0] === 'string' &&
          (tags[0].startsWith('[') || tags[0].startsWith('["'))) {
        // Join all tag elements and parse as JSON
        const joinedTags = tags.join('');
        const parsedTags = JSON.parse(joinedTags);
        return Array.isArray(parsedTags) ? parsedTags : [];
      }

      // If tags are already properly formatted, return as is
      return tags;
    } catch (error) {
      console.error('Error parsing tags:', error);
      // If parsing fails, try to extract individual tags manually
      try {
        const cleanedTags: string[] = [];
        for (const tag of tags) {
          if (typeof tag === 'string') {
            // Remove quotes and brackets
            const cleaned = tag.replace(/^\[?"?|"?\]?$/g, '').replace(/^"|"$/g, '');
            if (cleaned.trim()) {
              cleanedTags.push(cleaned.trim());
            }
          }
        }
        return cleanedTags;
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError);
        return [];
      }
    }
  };

  // Helper function to strip HTML tags from text
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    // Create a temporary div element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    onCategoryFilter(value === 'all' ? '' : value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onStatusFilter(value === 'all' ? '' : value);
  };

  const handleFeaturedChange = (value: string) => {
    setFeaturedFilter(value);
    onFeaturedFilter(value === 'all' ? '' : value);
  };

  const columns: ColumnDef<ServiceType>[] = [
    {
      accessorKey: 'title',
      header: 'Service Title',
      cell: ({ row }) => (
        <div className="min-w-0 max-w-[200px]">
          <div className="font-medium text-gray-900 truncate text-sm">
            {row.getValue('title')}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {stripHtmlTags(row.original.description)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        return (
          <div className="min-w-0 max-w-[120px]">
            {category ? (
              <Badge variant="outline" className="text-xs truncate">
                {category}
              </Badge>
            ) : (
              <span className="text-gray-400 text-xs">-</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          draft: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <div className="min-w-0">
            <Badge className={`text-xs ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => {
        const featured = row.getValue('featured') as boolean;
        return (
          <div className="flex justify-center">
            {featured ? (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            ) : (
              <StarOff className="h-4 w-4 text-gray-400" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const rawTags = row.getValue('tags') as string[];
        const tags = parseTags(rawTags);
        return (
          <div className="min-w-0 max-w-[150px]">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 1).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs truncate max-w-[80px]">
                  {tag}
                </Badge>
              ))}
              {tags.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  +{tags.length - 1}
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }) => (
        <div className="text-center text-sm">
          {row.getValue('views')}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="text-xs text-gray-600 min-w-0">
            {date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: '2-digit'
            })}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(service)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(service)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(service.id!)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full max-w-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 min-w-0">
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {SERVICE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {SERVICE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={handleFeaturedChange}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="true">Featured Only</SelectItem>
              <SelectItem value="false">Non-Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={services}
            loading={loading}
            title={`Services (${totalCount})`}
          />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalCount} total services)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDataTable;
