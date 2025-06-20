import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById } from '../components/api/api';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, Eye, Tag } from 'lucide-react';
import { Loader } from '@/components/globalfiles/loader';
import { BlogType } from '../type/blogType';
import '../components/blog-content.css';

const ViewBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogData = async () => {
      if (!id) {
        toast.error('Blog ID not found');
        navigate('/blog');
        return;
      }

      try {
        setLoading(true);
        const response = await getBlogById(id);
        
        if (response.success && response.data) {
          setBlog(response.data);
        } else {
          toast.error('Failed to load blog data');
          navigate('/blog');
        }
      } catch (error: any) {
        console.error('Error loading blog:', error);
        toast.error('Failed to load blog data');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, [id, navigate]);

  const handleEdit = () => {
    if (blog) {
      const blogId = blog._id || blog.id;
      navigate(`/blog/edit/${blogId}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>
          <Button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <Edit className="w-4 h-4" />
            Edit Blog
          </Button>
        </div>

        {/* Blog Content */}
        <Card>
          <CardHeader>
            {/* Featured Image */}
            {blog.imageUrl && (
              <div className="mb-6">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Title */}
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {blog.title}
            </CardTitle>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Published on {formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views} views</span>
              </div>
              {blog.category && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(blog.category) ? blog.category : [blog.category]).map((cat, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keywords */}
            {blog.keywords && blog.keywords.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.keywords.map((keyword, index) => {
                    // Clean up malformed JSON strings
                    const cleanKeyword = typeof keyword === 'string'
                      ? keyword
                          .replace(/^\[?"?/, '') // Remove leading [" or "
                          .replace(/"?\]?$/, '') // Remove trailing "] or "
                          .replace(/\\"/g, '"') // Replace escaped quotes
                          .trim()
                      : keyword;

                    return cleanKeyword ? (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {cleanKeyword}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Blog Content with HTML Rendering */}
            <div
              className="blog-content prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:list-item prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2 prose-td:border prose-td:border-gray-300 prose-td:p-2"
              style={{
                lineHeight: '1.6',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewBlogPage;
