import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Mail, Phone, Calendar, User, Briefcase } from 'lucide-react';
import { CareerApplication } from '@/types/careers';

interface ViewCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CareerApplication | null;
  onDownloadCV: (application: CareerApplication) => void;
}

const ViewCareerModal: React.FC<ViewCareerModalProps> = ({ 
  isOpen, 
  onClose, 
  application, 
  onDownloadCV 
}) => {
  if (!application) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusColors: Record<string, string> = {
    'new': 'bg-blue-100 text-blue-800',
    'reviewing': 'bg-yellow-100 text-yellow-800',
    'shortlisted': 'bg-green-100 text-green-800',
    'interviewed': 'bg-purple-100 text-purple-800',
    'hired': 'bg-emerald-100 text-emerald-800',
    'rejected': 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Career Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{application.name}</h2>
              <div className="flex items-center gap-3">
                <Badge className={StatusColors[application.status]}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">Applied for: {application.jobDescription}</span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Application ID: {application.id}</div>
              <div>Applied: {formatDate(application.createdAt)}</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{application.email}</span>
                </div>
                {application.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{application.phoneNumber}</span>
                  </div>
                )}
                {application.availableFrom && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Available from: {new Date(application.availableFrom).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Details
              </h3>
              <div className="space-y-3">
                {application.experience && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Experience:</span>
                    <span className="text-sm ml-2">{application.experience}</span>
                  </div>
                )}
                {application.expectedSalary && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Expected Salary:</span>
                    <span className="text-sm ml-2">{application.expectedSalary}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Tech Stack</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800">{application.techStack}</p>
            </div>
          </div>

          {/* Why Hire You */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Why Should We Hire You?</h3>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{application.whyHireYou}</p>
            </div>
          </div>

          {/* Social Links */}
          {(application.linkedinProfile || application.githubProfile || application.portfolioUrl) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Links & Profiles</h3>
              <div className="flex flex-wrap gap-3">
                {application.linkedinProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.linkedinProfile, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {application.githubProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.githubProfile, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                )}
                {application.portfolioUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.portfolioUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Portfolio
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* CV Download */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Resume/CV</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Button
                onClick={() => onDownloadCV(application)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Button>
            </div>
          </div>

          {/* Notes (if any) */}
          {application.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{application.notes}</p>
              </div>
            </div>
          )}

          {/* Review Information */}
          {application.reviewedBy && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Reviewed by:</span>
                  <span className="font-medium ml-2">{application.reviewedBy}</span>
                </div>
                {application.reviewedAt && (
                  <div>
                    <span className="text-gray-600">Reviewed at:</span>
                    <span className="font-medium ml-2">{formatDate(application.reviewedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span>Applied:</span>
                <span className="font-medium ml-2">{formatDate(application.createdAt)}</span>
              </div>
              <div>
                <span>Last updated:</span>
                <span className="font-medium ml-2">{formatDate(application.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCareerModal;
