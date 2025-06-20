import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaTimes, FaEye, FaStar, FaCalendar, FaTag, FaImage, FaExternalLinkAlt, FaUser } from 'react-icons/fa';
import { ProjectType } from '../types/projectTypes';

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectType | null;
}

const ProjectViewModal: React.FC<ProjectViewModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  if (!project) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#F89453] flex items-center gap-2">
              <FaEye className="h-5 w-5" />
              Project Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4 w-full">
          {/* Header Section */}
          <div className="border-b pb-3">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 break-words">{project.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaEye className="h-3 w-3" />
                    {project.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar className="h-3 w-3" />
                    Created: {formatDate(project.createdAt)}
                  </span>
                  {project.clientName && (
                    <span className="flex items-center gap-1">
                      <FaUser className="h-3 w-3" />
                      Client: {project.clientName}
                    </span>
                  )}
                  {project.projectDeliveryDate && (
                    <span className="flex items-center gap-1">
                      <FaCalendar className="h-3 w-3" />
                      Delivered: {formatDate(project.projectDeliveryDate)}
                    </span>
                  )}
                  {project.updatedAt !== project.createdAt && (
                    <span className="flex items-center gap-1">
                      <FaCalendar className="h-3 w-3" />
                      Updated: {formatDate(project.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
                {project.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <FaStar className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Badge variant="outline" className="text-sm w-fit">
                {project.projectCategory}
              </Badge>
              {project.tags && project.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaTag className="h-3 w-3 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Link */}
            {project.projectLink && (
              <div className="flex items-center gap-2 mt-2">
                <FaExternalLinkAlt className="h-3 w-3 text-gray-500" />
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F89453] hover:text-[#e07b39] text-sm font-medium underline break-all"
                >
                  View Live Project
                </a>
              </div>
            )}
          </div>

          {/* Big Image */}
          {project.bigImageUrl && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <FaImage className="h-4 w-4" />
                Project Image
              </h3>
              <div className="border rounded-lg overflow-hidden w-full max-w-md mx-auto lg:mx-0">
                <img
                  src={project.bigImageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Description</h3>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg overflow-hidden break-words"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>

          {/* Process & Challenge Description */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Process & Challenges</h3>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg overflow-hidden break-words"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: project.processAndChallengeDescription }}
            />
          </div>

          {/* Additional Process Description */}
          {project.processAndChallengeDescription2 && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900">Additional Process Details</h3>
              <div
                className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg overflow-hidden break-words"
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: project.processAndChallengeDescription2 }}
              />
            </div>
          )}

          {/* Process Points */}
          {project.processAndChallengePoints && project.processAndChallengePoints.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900">Key Process Points</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-2">
                  {project.processAndChallengePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-[#F89453] text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm break-words">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Mini Images */}
          {project.miniImages && project.miniImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <FaImage className="h-4 w-4" />
                Project Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
                {project.miniImages.map((imageUrl, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Description */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">Project Summary</h3>
            <div
              className="prose prose-sm max-w-none bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400 overflow-hidden break-words"
              style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: project.summaryDescription }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-3 border-t">
          <Button onClick={onClose} className="bg-[#F89453] hover:bg-[#e07b39]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewModal;
