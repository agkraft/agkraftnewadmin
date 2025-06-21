import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, User, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { Loader } from '@/components/globalfiles/loader';
import {
  createComment,
  getCommentsByBlogId,
  getCommentCountByBlogId
} from '@/features/postComments/api/commentApi';
import { PostComment } from '@/types/postComments';

// Form validation schema
const commentSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  comment: z.string()
    .min(1, 'Comment is required')
    .max(1000, 'Comment must be less than 1000 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface PublicBlogCommentsProps {
  blogId: number;
  showCommentForm?: boolean;
  maxCommentsToShow?: number;
}

const PublicBlogComments: React.FC<PublicBlogCommentsProps> = ({ 
  blogId, 
  showCommentForm = true,
  maxCommentsToShow = 10
}) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // Fetch approved comments only
  const fetchApprovedComments = async () => {
    try {
      setLoading(true);

      const response = await getCommentsByBlogId(blogId, {
        page: 1,
        limit: showAllComments ? 100 : maxCommentsToShow,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.status && response.data) {
        // Filter only approved and visible comments for public display
        const allComments = response.data.comments || [];
        const approvedComments = allComments.filter(
          comment => comment.status === 'approved' && comment.isVisible
        );
        setComments(approvedComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch comment count
  const fetchCommentCount = async () => {
    try {
      const response = await getCommentCountByBlogId(blogId);
      if (response.status && response.data) {
        setCommentCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  // Submit new comment
  const onSubmit = async (data: CommentFormData) => {
    try {
      setSubmitting(true);
      const response = await createComment({
        blogId,
        name: data.name,
        email: data.email,
        comment: data.comment,
      });

      if (response.status) {
        toast.success('Thank you for your comment! It will be visible after moderation.');
        reset();
        fetchCommentCount(); // Refresh comment count
      } else {
        toast.error(response.message || 'Failed to submit comment');
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Load comments and count on component mount
  useEffect(() => {
    fetchApprovedComments();
    fetchCommentCount();
  }, [blogId, showAllComments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const displayedComments = showAllComments ? comments : (comments || []).slice(0, maxCommentsToShow);

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Comments ({commentCount})
          </h3>
        </div>
        {(comments?.length || 0) > maxCommentsToShow && !showAllComments && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllComments(true)}
          >
            View All Comments
          </Button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              Leave a Comment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Your name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your.email@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Comment *</Label>
                <Textarea
                  id="comment"
                  {...register('comment')}
                  placeholder="Share your thoughts about this blog post..."
                  rows={4}
                  className={errors.comment ? 'border-red-500' : ''}
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                )}
              </div>
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? (
                  <>
                    <Loader />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Comment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : displayedComments.length > 0 ? (
          <>
            {displayedComments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{comment.name}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed ml-10">{comment.comment}</p>
                </CardContent>
              </Card>
            ))}

            {/* Show More Button */}
            {!showAllComments && (comments?.length || 0) > maxCommentsToShow && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllComments(true)}
                >
                  Show {(comments?.length || 0) - maxCommentsToShow} More Comments
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No comments yet.</p>
              <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicBlogComments;
