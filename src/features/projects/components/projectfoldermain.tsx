import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import ProjectModal from './ProjectModal';
import ProjectDataTable from './ProjectDataTable';
import ProjectViewModal from './ProjectViewModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  ProjectType,
  ProjectFormData,
  GetProjectsRequest
} from '../types/projectTypes';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
} from '../api/projectApi';

const ProjectFolderMain: React.FC = () => {
  // State management
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectType | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Load projects on component mount and when filters change
  useEffect(() => {
    loadProjects();
  }, [currentPage, searchQuery, categoryFilter, statusFilter, featuredFilter]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params: GetProjectsRequest = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        projectCategory: categoryFilter || undefined,
        status: statusFilter as any || undefined,
        featured: featuredFilter ? featuredFilter === 'true' : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await getAllProjects(params);
      
      if (response.status && response.data) {
        setProjects(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalCount(response.data.pagination?.totalProjects || 0);
      } else {
        toast.error(response.message || 'Failed to load projects');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleModalOpen = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewingProject(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingProject(null);
  };

  // CRUD operations
  const handleProjectSubmit = async (formData: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      let response;
      
      if (editingProject) {
        // Update existing project
        response = await updateProject({
          ...formData,
          id: editingProject.id!
        });
      } else {
        // Create new project
        response = await createProject(formData);
      }

      if (response.status) {
        toast.success(
          editingProject 
            ? 'Project updated successfully!' 
            : 'Project created successfully!'
        );
        handleModalClose();
        loadProjects(); // Reload the list
      } else {
        toast.error(response.message || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectEdit = (project: ProjectType) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectDelete = (project: ProjectType) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleProjectView = (project: ProjectType) => {
    setViewingProject(project);
    setIsViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProject?.id) return;

    setIsDeleting(true);
    try {
      const response = await deleteProject(deletingProject.id);
      
      if (response.status) {
        toast.success('Project deleted successfully!');
        handleDeleteModalClose();
        loadProjects(); // Reload the list
      } else {
        toast.error(response.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and search handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleFeaturedFilter = (featured: string) => {
    setFeaturedFilter(featured);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="p-6 bg-[#F0EFF3] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#313131]">Project Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your projects with comprehensive details and media
          </p>
        </div>
        <Button
          onClick={handleModalOpen}
          className="bg-[#F89453] hover:bg-[#e07b39] text-white"
        >
          Add New Project
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-[#F89453]">{totalCount}</div>
          <div className="text-sm text-gray-600">Total Projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {projects.filter(p => p.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {projects.filter(p => p.featured).length}
          </div>
          <div className="text-sm text-gray-600">Featured Projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {projects.reduce((sum, p) => sum + p.views, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
      </div>

      {/* Project Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <ProjectDataTable
          projects={projects}
          loading={loading}
          onEdit={handleProjectEdit}
          onDelete={handleProjectDelete}
          onView={handleProjectView}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onStatusFilter={handleStatusFilter}
          onFeaturedFilter={handleFeaturedFilter}
        />
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleProjectSubmit}
        editingProject={editingProject}
        isLoading={isSubmitting}
      />

      {/* Project View Modal */}
      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        project={viewingProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmDelete}
        title="Delete Project"
        itemName={deletingProject?.title || 'this project'}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjectFolderMain;
