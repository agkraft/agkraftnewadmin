import React, { useState } from 'react';
import { DataTable } from '@/components/datatable/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaEllipsisH,
  FaStar,
  FaImage
} from 'react-icons/fa';
import { ProjectType, ProjectStatus, ProjectCategory } from '../types/projectTypes';

interface ProjectDataTableProps {
  projects: ProjectType[];
  loading: boolean;
  onEdit: (project: ProjectType) => void;
  onDelete: (project: ProjectType) => void;
  onView: (project: ProjectType) => void;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onStatusFilter: (status: string) => void;
  onFeaturedFilter: (featured: string) => void;
}

const PROJECT_CATEGORIES: (ProjectCategory | "All")[] = [
  "All",
  "Web Development",
  "Mobile App",
  "Digital Marketing",
  "E-commerce",
  "UI/UX Design",
  "Software Development",
  "SAAS Platform"
];

const PROJECT_STATUSES: (ProjectStatus | "All")[] = ["All", "active", "inactive", "draft"];

const ProjectDataTable: React.FC<ProjectDataTableProps> = ({
  projects,
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
  onFeaturedFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFeatured, setSelectedFeatured] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryFilter(category === 'All' ? '' : category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter(status === 'All' ? '' : status);
  };

  const handleFeaturedChange = (featured: string) => {
    setSelectedFeatured(featured);
    onFeaturedFilter(featured === 'All' ? '' : featured);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns: ColumnDef<ProjectType>[] = [
    {
      accessorKey: "id",
      header: "S.No.",
      cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
      accessorKey: "bigImageUrl",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("bigImageUrl") as string;
        return (
          <div className="flex items-center justify-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={row.original.title}
                className="w-12 h-12 object-cover rounded-md"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                <FaImage className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        const featured = row.original.featured;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 max-w-[200px] truncate">
              {title}
            </span>
            {featured && (
              <FaStar className="h-4 w-4 text-yellow-500" title="Featured Project" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "projectCategory",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("projectCategory") as string;
        return (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => {
        const clientName = row.getValue("clientName") as string;
        return (
          <div className="text-sm text-gray-600 max-w-[120px] truncate">
            {clientName || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "projectDeliveryDate",
      header: "Delivery Date",
      cell: ({ row }) => {
        const deliveryDate = row.getValue("projectDeliveryDate") as string;
        return (
          <div className="text-sm text-gray-600">
            {deliveryDate ? formatDate(deliveryDate) : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => {
        const views = row.getValue("views") as number;
        return <div className="text-center font-medium">{views}</div>;
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        if (!tags || tags.length === 0) return <div className="text-gray-400">-</div>;
        
        return (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return <div className="text-sm text-gray-600">{formatDate(date)}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <FaEllipsisH className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(project)}>
                <FaEye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <FaEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(project)}
                className="text-red-600 focus:text-red-600"
              >
                <FaTrash className="mr-2 h-4 w-4" />
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
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <FaFilter className="h-4 w-4 text-gray-500 mt-2 sm:mt-0" />
          
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedFeatured} onValueChange={handleFeaturedChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[250px]"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Data Table */}
      <DataTable
        title="Projects"
        columns={columns}
        data={projects}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          totalCount,
          onPageChange,
        }}
      />
    </div>
  );
};

export default ProjectDataTable;
