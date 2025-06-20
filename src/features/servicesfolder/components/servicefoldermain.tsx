import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import ServiceModal from './ServiceModal';
import ServiceDataTable from './ServiceDataTable';
import ServiceViewModal from './ServiceViewModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  ServiceType,
  ServiceFormData,
  GetServicesRequest
} from '../types/serviceTypes';
import {
  getAllServices,
  createService,
  updateService,
  deleteService
} from '../api/serviceApi';

const ServiceFolderMain: React.FC = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [viewingService, setViewingService] = useState<ServiceType | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: GetServicesRequest = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        featured: featuredFilter ? featuredFilter === 'true' : undefined,
      };

      const response = await getAllServices(params);

      if (response.status && response.data) {
        setServices(response.data.services);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.totalCount);
      } else {
        toast.error(response.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  // Load services on component mount and when filters change
  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm, categoryFilter, statusFilter, featuredFilter]);

  // Handle service creation/update
  const handleServiceSubmit = async (formData: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      let response;

      if (editingService) {
        // Update existing service
        response = await updateService({
          ...formData,
          id: editingService.id!,
        });
      } else {
        // Create new service
        response = await createService(formData);
      }

      if (response.status) {
        toast.success(response.message);
        setIsModalOpen(false);
        setEditingService(null);
        fetchServices(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle service deletion
  const handleServiceDelete = (id: number) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setDeletingService(service);
      setIsDeleteModalOpen(true);
    }
  };

  // Confirm service deletion
  const confirmServiceDelete = async () => {
    if (!deletingService) return;

    setIsDeleting(true);
    try {
      const response = await deleteService(deletingService.id!);

      if (response.status) {
        toast.success(response.message);
        setIsDeleteModalOpen(false);
        setDeletingService(null);
        fetchServices(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle service editing
  const handleServiceEdit = (service: ServiceType) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  // Handle service viewing
  const handleServiceView = (service: ServiceType) => {
    setViewingService(service);
    setIsViewModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewingService(null);
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingService(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle featured filter
  const handleFeaturedFilter = (featured: string) => {
    setFeaturedFilter(featured);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-4 px-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="text-2xl font-semibold text-gray-800">
          Service Management
        </div>
        <Button
          className="bg-[#FE8147] hover:bg-[#f06d31]"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Service
        </Button>
      </div>

      {/* Service Data Table */}
      <ServiceDataTable
        services={services}
        loading={loading}
        onEdit={handleServiceEdit}
        onDelete={handleServiceDelete}
        onView={handleServiceView}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onStatusFilter={handleStatusFilter}
        onFeaturedFilter={handleFeaturedFilter}
      />

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleServiceSubmit}
        editingService={editingService}
        isLoading={isSubmitting}
      />

      {/* Service View Modal */}
      <ServiceViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        service={viewingService}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmServiceDelete}
        service={deletingService}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ServiceFolderMain;