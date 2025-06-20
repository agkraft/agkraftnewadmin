"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { updateBlog } from "../api/api";
import { toast } from "react-toastify";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaTable,
  FaImages,
  FaUnderline,
  FaHighlighter,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaCode,
  FaQuoteLeft,
  FaRulerHorizontal,
  FaUndo,
  FaRedo,
  FaSubscript,
  FaSuperscript,
  FaTasks
} from 'react-icons/fa';
import { MdTitle } from 'react-icons/md';
import '../table/tiptap-styles.css';
import { BlogType } from "../../type/blogType";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html
    ?.replace(/<[^>]*>/g, '') // Remove HTML tags
    ?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    ?.replace(/&amp;/g, '&') // Replace &amp; with &
    ?.replace(/&lt;/g, '<') // Replace &lt; with <
    ?.replace(/&gt;/g, '>') // Replace &gt; with >
    ?.replace(/&quot;/g, '"') // Replace &quot; with "
    ?.trim() || '';
};

// Tiptap Editor Component (same as in add-blog)
interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  // Create lowlight instance
  const lowlight = createLowlight();

  // Register languages
  lowlight.register('javascript', javascript);
  lowlight.register('typescript', typescript);
  lowlight.register('css', css);
  lowlight.register('html', html);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-xs h-auto rounded-lg cursor-pointer',
          style: 'max-width: 200px; max-height: 150px; object-fit: cover;',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Write your professional blog content here...',
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      Dropcursor,
      Gapcursor,
      HardBreak,
      HorizontalRule,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] p-4 prose prose-lg max-w-none prose-ul:list-disc prose-ol:list-decimal prose-li:list-item',
      },
    },
  });

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addMultipleImages = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && editor) {
        const fileArray = Array.from(files);
        
        const layout = window.prompt(
          'Choose layout:\n1 - Row (side by side)\n2 - Column (one below another)\n3 - Grid (2x2)',
          '1'
        );
        
        if (layout === '1') {
          fileArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor.chain().focus().setImage({ src }).run();
              if (index < fileArray.length - 1) {
                editor.chain().focus().insertContent(' ').run();
              }
            };
            reader.readAsDataURL(file);
          });
        } else if (layout === '2') {
          fileArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor.chain().focus().setImage({ src }).run();
              if (index < fileArray.length - 1) {
                editor.chain().focus().insertContent('<br>').run();
              }
            };
            reader.readAsDataURL(file);
          });
        } else {
          fileArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor.chain().focus().setImage({ src }).run();
              if (index % 2 === 1) {
                editor.chain().focus().insertContent('<br>').run();
              } else if (index < fileArray.length - 1) {
                editor.chain().focus().insertContent(' ').run();
              }
            };
            reader.readAsDataURL(file);
          });
        }
      }
    };
    input.click();
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg bg-white tiptap-editor-container">
      {/* Sticky Toolbar */}
      <div className="tiptap-toolbar sticky top-0 z-50 border-b p-3 flex flex-wrap gap-2 bg-white shadow-lg rounded-t-lg">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-lg transition-all ${
            editor.isActive('bold') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } border flex items-center justify-center`}
          title="Bold"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('italic') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Italic"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('strike') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('heading', { level: 1 }) ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Heading 1"
        >
          <MdTitle />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Heading 2"
        >
          <MdTitle className="text-sm" />
        </button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('bulletList') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Bullet List"
        >
          <FaListUl />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('orderedList') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Numbered List"
        >
          <FaListOl />
        </button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('link') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Add Link"
        >
          <FaLink />
        </button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg text-lg transition-all border bg-white hover:bg-gray-100 border-gray-200 flex items-center justify-center"
          title="Add Single Image"
        >
          <FaImage />
        </button>
        <button
          type="button"
          onClick={addMultipleImages}
          className="p-2 rounded-lg text-lg transition-all border bg-white hover:bg-gray-100 border-gray-200 flex items-center justify-center"
          title="Add Multiple Images"
        >
          <FaImages />
        </button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={insertTable}
          className="p-2 rounded-lg text-lg transition-all border bg-white hover:bg-gray-100 border-gray-200 flex items-center justify-center"
          title="Insert Table"
        >
          <FaTable />
        </button>
      </div>
      
      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

// Multi-Select Category Component
interface CategoryInputProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryInput = ({ categories, onCategoriesChange }: CategoryInputProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Predefined categories for suggestions
  const predefinedCategories = [
    "Technology", "Business", "Health", "Education", "Lifestyle",
    "Travel", "Food", "Sports", "Entertainment", "News",
    "Agriculture", "Innovation", "Sustainability", "Digital Marketing",
    "Web Development", "Mobile Apps", "AI", "Machine Learning",
    "Data Science", "Cybersecurity", "Cloud Computing", "DevOps"
  ];

  const handleCategorySelect = (category: string) => {
    if (category === "Other") {
      // Only show input if it's not already open
      if (!showOtherInput) {
        setShowOtherInput(true);
      }
      return;
    }

    if (!categories.includes(category)) {
      onCategoriesChange([...categories, category]);
    }
  };

  const handleCustomCategoryAdd = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      onCategoriesChange([...categories, customCategory.trim()]);
      setCustomCategory("");
      // Don't close the input - keep it open for more custom categories
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customCategory.trim()) {
      e.preventDefault();
      handleCustomCategoryAdd();
    }
  };

  const removeCategory = (indexToRemove: number) => {
    onCategoriesChange(categories.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700">Categories</label>

      {/* Multi-select dropdown */}
      <Select onValueChange={handleCategorySelect}>
        <SelectTrigger className={`w-full ${showOtherInput ? 'border-blue-300 bg-blue-50' : ''}`}>
          <SelectValue placeholder={showOtherInput ? "Custom category mode active - Add more categories below" : "Select categories"} />
        </SelectTrigger>
        <SelectContent>
          {predefinedCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
          <SelectItem value="Other">
            <span className={`font-medium ${showOtherInput ? 'text-green-600' : 'text-blue-600'}`}>
              {showOtherInput ? '✓ Custom Category Mode Active' : '+ Other (Type custom category)'}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Custom category input */}
      {showOtherInput && (
        <div className="border-2 border-blue-200 rounded-lg p-3 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-700">Add Custom Categories:</span>
            <span className="text-xs text-blue-600">(Add multiple categories, then click Done when finished)</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type custom category and press Enter or click Add"
              className="flex-1 p-2 border rounded focus:ring focus:ring-blue-300"
              autoFocus
            />
            <Button
              type="button"
              onClick={handleCustomCategoryAdd}
              disabled={!customCategory.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowOtherInput(false);
                setCustomCategory("");
              }}
              variant="outline"
              className="px-4 py-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Selected categories display */}
      <div className="flex flex-wrap gap-2 mt-2 max-w-full overflow-hidden">
        {categories.map((category, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 break-words max-w-full"
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            <span className="truncate max-w-[200px]" title={category}>
              {category}
            </span>
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="ml-2 text-green-600 hover:text-green-800 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {categories.length > 0 && (
        <p className="text-sm text-gray-500">
          Selected: {categories.join(", ")}
        </p>
      )}
    </div>
  );
};

// Keywords Management Component (same as in add-blog)
interface KeywordsInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

const KeywordsInput = ({ keywords, onKeywordsChange }: KeywordsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!keywords.includes(inputValue.trim())) {
        onKeywordsChange([...keywords, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    onKeywordsChange(keywords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700">Keywords</label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type keyword and press Enter"
        className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

interface EditBlogModalProps {
  blog: BlogType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}

function EditBlogModal({ blog, setIsOpen, onSuccess }: EditBlogModalProps) {
  console.log("EditBlogModal received blog data:", blog);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog.title,
    }
  });
  
  const [preview, setPreview] = useState<string | null>(blog.imageUrl || null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize keywords properly - handle both array and string formats
  const [keywords, setKeywords] = useState<string[]>(() => {
    if (Array.isArray(blog.keywords)) {
      return blog.keywords;
    } else if (typeof blog.keywords === 'string') {
      try {
        return JSON.parse(blog.keywords);
      } catch {
        return blog.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k);
      }
    }
    return [];
  });

  const [content, setContent] = useState(blog.description || "");
  const [useRichEditor, setUseRichEditor] = useState(true);

  // Initialize categories from blog data
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (typeof blog.category === 'string') {
      return blog.category.split(',').map((c: string) => c.trim()).filter((c: string) => c);
    }
    return [];
  });

  // Initialize form with blog data
  useEffect(() => {
    console.log("Initializing edit form with blog data:", blog);

    // Set form values
    setValue("title", blog.title);

    // Set content
    setContent(blog.description || "");

    // Set image preview
    setPreview(blog.imageUrl || null);

    // Set categories
    if (typeof blog.category === 'string') {
      const cats = blog.category.split(',').map((c: string) => c.trim()).filter((c: string) => c);
      setSelectedCategories(cats);
    }

    // Set keywords
    if (Array.isArray(blog.keywords)) {
      setKeywords(blog.keywords);
    } else if (typeof blog.keywords === 'string') {
      try {
        const parsedKeywords = JSON.parse(blog.keywords);
        setKeywords(Array.isArray(parsedKeywords) ? parsedKeywords : []);
      } catch {
        const splitKeywords = blog.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k);
        setKeywords(splitKeywords);
      }
    } else {
      setKeywords([]);
    }

    console.log("Form initialized with:", {
      title: blog.title,
      category: blog.category,
      description: blog.description,
      keywords: blog.keywords,
      imageUrl: blog.imageUrl
    });
  }, [blog, setValue]);

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    setMessage("");

    // Validate content length
    if (content.length < 50) {
      setMessage("Content must be at least 50 characters");
      toast.error("Content must be at least 50 characters");
      setFormLoading(false);
      return;
    }

    // Validate keywords
    if (keywords.length === 0) {
      setMessage("Please add at least one keyword");
      toast.error("Please add at least one keyword");
      setFormLoading(false);
      return;
    }

    // Validate categories
    if (selectedCategories.length === 0) {
      setMessage("Please select at least one category");
      toast.error("Please select at least one category");
      setFormLoading(false);
      return;
    }

    try {
      // Preserve HTML content when using rich text editor, strip HTML for plain text
      const finalContent = useRichEditor ? content : stripHtmlTags(content);

      console.log("Updating blog:", blog);
      const blogId = blog._id || blog.id;
      console.log("Using blog ID:", blogId);

      // Check if blogId exists
      if (!blogId) {
        setMessage("Blog ID not found. Cannot update blog.");
        toast.error("Blog ID not found. Cannot update blog.");
        setFormLoading(false);
        return;
      }

      const response = await updateBlog({
        id: blogId,
        title: data.title,
        description: finalContent, // Preserve formatting for rich text, clean for plain text
        category: selectedCategories.join(","), // Join categories with comma
        keywords: keywords,
        image: thumbnailImage,
      });
      
      if (!response.success) {
        setMessage(response.error || "Failed to update blog");
        toast.error(response.error || "Failed to update blog");
      } else {
        toast.success("Blog updated successfully!");
        setPreview(null);
        setThumbnailImage(null);
        setKeywords([]);
        setSelectedCategories([]);
        setContent("");
        reset();
        setIsOpen(false);
        onSuccess(); // Refresh the blog list
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setFormLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <DialogContent className="sm:max-w-4xl bg-[#FFEDE3] max-h-[90vh] overflow-y-auto overflow-x-hidden">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Edit Blog
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              {...register("title")}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              placeholder="Enter blog title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <CategoryInput
              categories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border bg-white rounded"
          />
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">
                {thumbnailImage ? 'New image selected:' : 'Current image:'}
              </p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded border"
              />
            </div>
          )}
          {!preview && (
            <p className="text-sm text-gray-500 mt-1">No image selected</p>
          )}
        </div>

        <div className="overflow-hidden">
          <KeywordsInput keywords={keywords} onKeywordsChange={setKeywords} />
          <p className="text-xs text-gray-400 mt-1">
            Debug: Current keywords: {JSON.stringify(keywords)}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700">Blog Content (Description)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Plain Text</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRichEditor}
                  onChange={(e) => setUseRichEditor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm text-gray-600">Rich Text</span>
            </div>
          </div>

          {useRichEditor ? (
            <TiptapEditor content={content} onChange={setContent} />
          ) : (
            <textarea
              value={stripHtmlTags(content)}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring focus:ring-blue-300 min-h-[200px] break-words resize-none"
              placeholder="Write your blog content here..."
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
          )}

          <p className="text-sm text-gray-500 mt-1">
            This content will be used as the blog description. {useRichEditor ? 'Rich formatting will be preserved with HTML.' : 'Use plain text for clean, simple content.'}
          </p>
        </div>

        {message && <p className="text-center text-red-500">{message}</p>}
        <Button
          type="submit"
          disabled={formLoading}
          className="w-full bg-[#ee6620] text-white p-2 rounded hover:bg-[#e4692b] disabled:opacity-50"
        >
          {formLoading ? "Updating..." : "Update Blog"}
        </Button>
      </form>
    </DialogContent>
  );
}

export default EditBlogModal;
