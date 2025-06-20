import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, StarOff, Eye, Calendar, Tag, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { ServiceType } from '../types/serviceTypes';

interface ServiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceType | null;
}

const ServiceViewModal: React.FC<ServiceViewModalProps> = ({ isOpen, onClose, service }) => {
  if (!service) return null;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    draft: 'bg-yellow-100 text-yellow-800',
  };

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

  const displayTags = parseTags(service.tags);

  // Debug logging - remove this after testing
  console.log('Raw tags from service:', service.tags);
  console.log('Parsed displayTags:', displayTags);

  // Test with your specific data format
  const testTags = [
    "[\"saas development\"",
    "\"custom software\"",
    "\"cloud apps\"",
    "\"startup tech\"",
    "\"enterprise tools\"",
    "\"web platforms\"",
    "\"affordable saas\"",
    "\"scalable tech\"",
    "\"full-stack development\"",
    "\"agkraft services\"]"
  ];
  console.log('Test parsing result:', parseTags(testTags));

  // Helper function to strip HTML tags from text
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    // Create a temporary div element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {service.title}
            {service.featured && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-x-hidden">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Category</h3>
                {service.category ? (
                  <Badge variant="outline">{service.category}</Badge>
                ) : (
                  <span className="text-gray-400">Not specified</span>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
                <Badge className={statusColors[service.status]}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Featured</h3>
                <div className="flex items-center gap-2">
                  {service.featured ? (
                    <>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>Yes</span>
                    </>
                  ) : (
                    <>
                      <StarOff className="h-4 w-4 text-gray-400" />
                      <span>No</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Views
                </h3>
                <span className="text-lg font-medium">{service.views}</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created
                </h3>
                <span>{new Date(service.createdAt).toLocaleDateString()}</span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Last Updated
                </h3>
                <span>{new Date(service.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Short Description</h3>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{stripHtmlTags(service.description)}</p>
          </div>

          {/* Service Description */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Detailed Description
            </h3>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg overflow-x-hidden break-words"
              dangerouslySetInnerHTML={{ __html: service.serviceDescription }}
            />
          </div>

          {/* Media Files */}
          {(service.iconImageUrl || service.videoUrl || service.iconBgColor) && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Media Files</h3>
              <div className="space-y-3">
                {service.iconImageUrl && (
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Service Icon</span>
                    </div>
                    {service.iconBgColor && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Background:</span>
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: service.iconBgColor }}
                          title={service.iconBgColor}
                        ></div>
                        <span className="text-xs text-gray-500 font-mono">{service.iconBgColor}</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(service.iconImageUrl, '_blank')}
                    >
                      View
                    </Button>
                  </div>
                )}
                {service.videoUrl && (
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <Video className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Service Video</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(service.videoUrl, '_blank')}
                    >
                      View
                    </Button>
                  </div>
                )}
                {!service.iconImageUrl && !service.videoUrl && service.iconBgColor && (
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Icon Background Color:</span>
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: service.iconBgColor }}
                      title={service.iconBgColor}
                    ></div>
                    <span className="text-xs text-gray-500 font-mono">{service.iconBgColor}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {displayTags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Important Points */}
          {service.importantPoints.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Important Points</h3>
              <ul className="space-y-2">
                {service.importantPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Questions & Answers */}
          {service.questionsAnswers.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {service.questionsAnswers
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((qa, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Q: {qa.question}
                      </h4>
                      <p className="text-gray-600">
                        A: {qa.answer}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceViewModal;
