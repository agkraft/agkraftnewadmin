import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin, DollarSign, Users, Clock, Briefcase } from 'lucide-react';
import { JobProfile, JobType, JobStatus } from '@/types/jobProfiles';

interface ViewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobProfile | null;
}

const ViewJobModal: React.FC<ViewJobModalProps> = ({ isOpen, onClose, job }) => {
  if (!job) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAcceptingApplications = () => {
    const now = new Date();
    const startDate = new Date(job.startDateApplied);
    const endDate = new Date(job.lastDayApplied);
    return job.status === 'active' && now >= startDate && now <= endDate;
  };

  const JobTypeColors: Record<JobType, string> = {
    'full-time': 'bg-blue-100 text-blue-800',
    'part-time': 'bg-green-100 text-green-800',
    'contract': 'bg-purple-100 text-purple-800',
    'internship': 'bg-orange-100 text-orange-800',
    'freelance': 'bg-pink-100 text-pink-800',
  };

  const StatusColors: Record<JobStatus, string> = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Job Profile Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h2>
                {job.isUrgent && (
                  <Badge variant="destructive" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge className={StatusColors[job.status]}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                <Badge className={JobTypeColors[job.jobType]}>
                  {job.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                {job.department && (
                  <Badge variant="outline">{job.department}</Badge>
                )}
                {isAcceptingApplications() && (
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Accepting Applications
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Job ID: {job.id}</div>
              <div>Applications: {job.applicationCount}</div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Information
              </h3>
              <div className="space-y-3">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{job.salaryRange}</span>
                  </div>
                )}
                {job.experienceRequired && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Experience: {job.experienceRequired}</span>
                  </div>
                )}
                {job.postedBy && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Posted by:</span>
                    <span className="text-sm ml-2">{job.postedBy}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Application Period
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Start Date:</span>
                  <span className="text-sm ml-2">{formatDate(job.startDateApplied)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">End Date:</span>
                  <span className="text-sm ml-2">{formatDate(job.lastDayApplied)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`text-sm ml-2 font-medium ${isAcceptingApplications() ? 'text-green-600' : 'text-red-600'}`}>
                    {isAcceptingApplications() ? 'Open for Applications' : 'Applications Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{job.jobDescription}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {(job.techStack || []).map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <ul className="list-disc list-inside space-y-1">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-800 text-sm">{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Benefits</h3>
              <div className="p-4 bg-green-50 rounded-lg">
                <ul className="list-disc list-inside space-y-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-800 text-sm">{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span>Created:</span>
                <span className="font-medium ml-2">{formatDate(job.createdAt)}</span>
              </div>
              <div>
                <span>Last updated:</span>
                <span className="font-medium ml-2">{formatDate(job.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewJobModal;
