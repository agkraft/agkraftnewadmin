import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User, Calendar } from 'lucide-react';
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

interface BlogCommentsProps {
  blogId: number;
  showCommentForm?: boolean;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ 
  blogId, 
  showCommentForm = true 
}) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  // Fetch comments for the blog
  const fetchComments = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getCommentsByBlogId(blogId, {
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.status && response.data) {
        // Filter only approved and visible comments for public display
        const approvedComments = response.data.comments.filter(
          comment => comment.status === 'approved' && comment.isVisible
        );
        setComments(approvedComments);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          hasNextPage: response.data.pagination.hasNextPage,
        });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
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
        toast.success('Comment submitted successfully! It will be visible after moderation.');
        reset();
        fetchCommentCount(); // Refresh comment count
        // Optionally refresh comments if you want to show pending comments
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
    fetchComments();
    fetchCommentCount();
  }, [blogId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Comments ({commentCount})
        </h3>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leave a Comment</CardTitle>
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
                  placeholder="Share your thoughts..."
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
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <Card key={comment.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{comment.name}</span>
                      <Badge 
                        variant={comment.status === 'approved' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {comment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {pagination.hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fetchComments(pagination.currentPage + 1)}
                  disabled={loading}
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogComments;
