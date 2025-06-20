import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
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
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';

// React Icons
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHighlighter,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaListUl, FaListOl, FaTasks, FaQuoteLeft, FaCode,
  FaSubscript, FaSuperscript, FaRulerHorizontal,
  FaUndo, FaRedo, FaLink, FaImage, FaImages, FaTable
} from 'react-icons/fa';
import { MdTitle } from 'react-icons/md';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
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
        class: 'focus:outline-none min-h-[300px] p-4 prose prose-lg max-w-none prose-ul:list-disc prose-ol:list-decimal prose-li:list-item prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:mb-4 prose-strong:font-bold prose-em:italic prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded',
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

      {/* Character Count */}
      <div className="border-t p-3 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {editor.storage.characterCount.characters()}/10000 characters
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            onChange={(e) => setTextColor(e.target.value)}
            className="w-8 h-8 rounded border cursor-pointer"
            title="Text Color"
          />
          <input
            type="color"
            onChange={(e) => setHighlight(e.target.value)}
            className="w-8 h-8 rounded border cursor-pointer"
            title="Highlight Color"
          />
        </div>
      </div>

      {/* Custom CSS for better styling */}
      <style jsx>{`
        .tiptap-editor-container .ProseMirror {
          outline: none;
        }
        
        .tiptap-editor-container .tiptap-bullet-list {
          list-style-type: disc;
          margin-left: 1.5rem;
        }
        
        .tiptap-editor-container .tiptap-ordered-list {
          list-style-type: decimal;
          margin-left: 1.5rem;
        }
        
        .tiptap-editor-container .tiptap-list-item {
          margin: 0.25rem 0;
        }
        
        .tiptap-editor-container blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .tiptap-editor-container pre {
          background: #f3f4f6;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        
        .tiptap-editor-container table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        
        .tiptap-editor-container table td,
        .tiptap-editor-container table th {
          border: 1px solid #e5e7eb;
          padding: 0.5rem;
          text-align: left;
        }
        
        .tiptap-editor-container table th {
          background-color: #f9fafb;
          font-weight: bold;
        }
        
        .tiptap-editor-container .has-focus {
          border-radius: 3px;
          box-shadow: 0 0 0 3px #68d391;
        }
        
        .tiptap-editor-container ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        
        .tiptap-editor-container ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
        }
        
        .tiptap-editor-container ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
        }
        
        .tiptap-editor-container ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
