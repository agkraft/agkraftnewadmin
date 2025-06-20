import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../components/api/api';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import TiptapEditor from '../components/TiptapEditor';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
});

type FormData = z.infer<typeof formSchema>;

const blogCategories = [
  'Technology',
  'Web Development',
  'Mobile Development',
  'AI & Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'UI/UX Design',
  'Digital Marketing',
  'Business',
  'Startup',
  'Innovation',
  'Programming',
  'Software Engineering',
  'Other'
];

const AddBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
    }
  });

  const selectedCategory = watch('category');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'other') {
      setValue('category', '');
      return;
    }
    
    if (!selectedCategories.includes(category)) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      setValue('category', newCategories.join(','));
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const newCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
    setSelectedCategories(newCategories);
    setValue('category', newCategories.join(','));
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !selectedCategories.includes(customCategory.trim())) {
      const newCategories = [...selectedCategories, customCategory.trim()];
      setSelectedCategories(newCategories);
      setValue('category', newCategories.join(','));
      setCustomCategory('');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!content.trim()) {
      toast.error('Blog content is required');
      return;
    }

    if (keywords.length === 0) {
      toast.error('At least one keyword is required');
      return;
    }

    setFormLoading(true);

    try {
      const response = await createBlog({
        title: data.title,
        description: content, // Preserve HTML content from Tiptap editor
        category: data.category,
        keywords: keywords,
        image: thumbnailImage,
      });

      if (response.success === false || response.error) {
        toast.error(response.error || 'Failed to create blog');
      } else if (response.success === true || response.data || !response.error) {
        toast.success('Blog created successfully!');
        navigate('/blog');
      } else {
        toast.error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Error creating blog:', error);
      toast.error(error.response?.data?.message || 'Failed to create blog');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={formLoading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
            >
              <Save className="w-4 h-4" />
              {formLoading ? 'Creating...' : 'Create Blog'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  {...register('title')}
                  placeholder="Enter blog title..."
                  className="text-lg"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
              </CardHeader>
              <CardContent>
                <TiptapEditor content={content} onChange={setContent} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPreview(null);
                          setThumbnailImage(null);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select onValueChange={handleCategorySelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Custom Category Input */}
                  <div className="flex gap-2">
                    <Input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Add custom category"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                    />
                    <Button type="button" onClick={addCustomCategory} size="sm">
                      Add
                    </Button>
                  </div>

                  {/* Selected Categories */}
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm">{errors.category.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} size="sm">
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogPage;
