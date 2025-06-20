"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { createBlog } from "../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import './tiptap-styles.css';

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

// Tiptap Editor Component
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
      }).extend({
        addKeyboardShortcuts() {
          return {
            'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
          }
        },
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

        // Ask user for layout preference
        const layout = window.prompt(
          'Choose layout:\n1 - Row (side by side)\n2 - Column (one below another)\n3 - Grid (2x2)',
          '1'
        );

        if (layout === '1') {
          // Row layout - images side by side
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
          // Column layout - images one below another
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
          // Grid layout - default behavior
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

  // Helper functions for advanced features
  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="border rounded-lg bg-white overflow-hidden tiptap-editor-container">
      {/* Sticky Toolbar */}
      <div className="tiptap-toolbar sticky top-0 z-50 border-b p-3 flex flex-wrap gap-2 bg-white shadow-lg rounded-t-lg overflow-x-auto">
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
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('underline') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Underline"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => setHighlight('#ffff00')}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('highlight') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Highlight"
        >
          <FaHighlighter />
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

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive({ textAlign: 'left' }) ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive({ textAlign: 'center' }) ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive({ textAlign: 'right' }) ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Align Right"
        >
          <FaAlignRight />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive({ textAlign: 'justify' }) ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Justify"
        >
          <FaAlignJustify />
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
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('taskList') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Task List"
        >
          <FaTasks />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Quote and Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('blockquote') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Quote"
        >
          <FaQuoteLeft />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('codeBlock') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Code Block"
        >
          <FaCode />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Subscript and Superscript */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('subscript') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Subscript"
        >
          <FaSubscript />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded-lg text-lg transition-all border ${
            editor.isActive('superscript') ? 'is-active bg-blue-100 text-blue-800 border-blue-300' : 'bg-white hover:bg-gray-100 border-gray-200'
          } flex items-center justify-center`}
          title="Superscript"
        >
          <FaSuperscript />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg text-lg transition-all border bg-white hover:bg-gray-100 border-gray-200 flex items-center justify-center"
          title="Horizontal Rule"
        >
          <FaRulerHorizontal />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-lg transition-all border bg-white hover:bg-gray-100 border-gray-200 flex items-center justify-center disabled:opacity-50"
          title="Undo"
        >
          <FaUndo />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-lg transition-all border bg-white hover:bg-gray-100 border-gray-200 flex items-center justify-center disabled:opacity-50"
          title="Redo"
        >
          <FaRedo />
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

      {/* Character Count and Color Picker */}
      <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-600">
            Characters: {editor.storage.characterCount.characters()} / 10,000
          </div>
          <div className="text-sm text-gray-600">
            Words: {editor.storage.characterCount.words()}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">Text Color:</label>
          <input
            type="color"
            onChange={(e) => setTextColor(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
            title="Text Color"
          />
          <label className="text-sm text-gray-600">Highlight:</label>
          <input
            type="color"
            onChange={(e) => setHighlight(e.target.value)}
            className="w-8 h-8 border rounded cursor-pointer"
            title="Highlight Color"
          />
        </div>
      </div>
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
            <span className="text-sm font-medium text-blue-700">Add Custom:</span>
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

// Keywords Management Component
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
        className="w-full p-2 border rounded focus:ring focus:ring-blue-300 break-words"
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
      />
      <div className="flex flex-wrap gap-2 mt-2 max-w-full overflow-hidden">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 break-words max-w-full"
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            <span className="truncate max-w-[200px]" title={keyword}>
              {keyword}
            </span>
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="ml-2 text-blue-600 hover:text-blue-800 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

interface AddBlogModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

function AddBlogModal({ setIsOpen, onSuccess }: AddBlogModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [useRichEditor, setUseRichEditor] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

      const response = await createBlog({
        title: data.title,
        description: finalContent, // Preserve formatting for rich text, clean for plain text
        category: selectedCategories.join(","), // Join categories with comma
        keywords: keywords,
        image: thumbnailImage,
      });

      console.log("Create blog response:", response);

      // Handle both new API format and legacy format
      if (response.success === false || response.error) {
        setMessage(response.error || "Failed to create blog");
        toast.error(response.error || "Failed to create blog");
      } else if (response.success === true || response.data || !response.error) {
        toast.success("Blog created successfully!");
        setPreview(null);
        setThumbnailImage(null);
        setKeywords([]);
        setSelectedCategories([]);
        setContent("");
        reset(); // Reset form fields
        setIsOpen(false); // Close modal on success
        if (onSuccess) {
          onSuccess(); // Refresh the blog list
        }
      } else {
        setMessage("Unexpected response format");
        toast.error("Unexpected response format");
      }
    } catch (error: any) {
      console.error("Create blog error:", error);
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
          Add New Blog
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              {...register("title")}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300 break-words"
              placeholder="Enter blog title"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
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
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-full h-40 object-cover rounded"
            />
          )}
        </div>

        <div className="overflow-hidden">
          <KeywordsInput keywords={keywords} onKeywordsChange={setKeywords} />
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
          {formLoading ? "Submitting..." : "Submit Blog"}
        </Button>
      </form>
    </DialogContent>
  );
}

export default AddBlogModal;