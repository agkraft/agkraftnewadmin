# Project Management System

A comprehensive project management system with multi-step modal dialogs, rich text editing, file uploads, and advanced filtering capabilities.

## Features

### ✅ Multi-Step Project Creation/Editing Modal
- **Step 1**: Basic Information (title, description, category, status, featured flag, tags, big image)
- **Step 2**: Images & Content (process & challenge descriptions with rich text editor, mini images upload)
- **Step 3**: Process & Summary (summary description, process & challenge points with dynamic arrays)

### ✅ Rich Text Editor (Tiptap)
- Bold, italic, headings (H1, H2, H3)
- Bullet lists and numbered lists
- Blockquotes
- Links and images
- Tables with creation functionality
- Undo/redo support
- Responsive toolbar with icons

### ✅ File Upload Support
- **Big Image**: Single main project image (max 10MB)
- **Mini Images**: Up to 3 additional project images (max 10MB each)
- Supported formats: JPEG, PNG, GIF, WebP
- File validation with size and type checking
- Preview functionality with file size display

### ✅ Advanced Data Table
- Sortable columns with custom sorting
- Search functionality across all text fields
- Multiple filter options:
  - Project Category filter
  - Status filter (active, inactive, draft)
  - Featured projects filter
- Pagination with page size control
- Action buttons (View, Edit, Delete) with dropdown menu
- Responsive design with mobile-friendly layout

### ✅ Project Categories
- Web Development
- Mobile App
- Digital Marketing
- E-commerce
- UI/UX Design
- Software Development
- SAAS Platform

### ✅ Project Status Management
- **Active**: Published and visible projects
- **Inactive**: Hidden projects
- **Draft**: Work-in-progress projects

### ✅ Featured Projects
- Toggle featured status for highlighting important projects
- Featured badge display in table and view modal
- Separate filtering for featured projects

### ✅ Comprehensive Project View Modal
- Full project details display
- Image gallery with big image and mini images
- Rich text content rendering
- Process points with numbered list
- Tags and category display
- View count and timestamps
- Status and featured indicators

### ✅ Delete Confirmation
- Safe deletion with confirmation modal
- Project name display in confirmation
- Loading state during deletion

## Project Schema

Based on the API documentation, each project contains:

```typescript
interface ProjectType {
  id?: number; // Auto-increment number
  title: string;
  description: string;
  bigImageUrl?: string; // S3 URL for big image
  processAndChallengeDescription: string;
  processAndChallengePoints?: string[];
  processAndChallengeDescription2?: string;
  miniImages?: string[]; // Array of S3 URLs (max 3)
  summaryDescription: string;
  projectCategory: string;
  status: "active" | "inactive" | "draft";
  featured: boolean;
  views: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## File Structure

```
src/features/projects/
├── api/
│   └── projectApi.ts          # API client functions
├── components/
│   ├── ProjectModal.tsx       # Multi-step create/edit modal
│   ├── ProjectDataTable.tsx   # Data table with filtering
│   ├── ProjectViewModal.tsx   # Project details view modal
│   ├── ProjectTiptapEditor.tsx # Rich text editor component
│   ├── DeleteConfirmModal.tsx # Delete confirmation modal
│   └── projectfoldermain.tsx  # Main container component
├── types/
│   └── projectTypes.ts        # TypeScript interfaces
├── index.tsx                  # Routes configuration
└── README.md                  # This file
```

## API Endpoints

The system integrates with the following API endpoints:

- `POST /api/projects` - Create new project
- `GET /api/projects` - Get all projects with filtering/pagination
- `GET /api/projects/:id` - Get project by ID (increments view count)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/statistics` - Get project statistics

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set `VITE_API_BASE_URL` to your API base URL (default: http://localhost:8001)

## Usage

### Creating a Project

1. Click "Add New Project" button
2. **Step 1**: Fill in basic information
   - Enter title and description
   - Select category and status
   - Toggle featured flag if needed
   - Add tags (press Enter or click Add)
   - Upload big image (optional)
3. **Step 2**: Add content and images
   - Use the rich text editor for process & challenge description
   - Add additional process description (optional)
   - Upload mini images (up to 3, optional)
4. **Step 3**: Add summary and process points
   - Use rich text editor for summary description
   - Add multiple process & challenge points
   - Click "Create Project" to save

### Editing a Project

1. Click the three dots menu on any project row
2. Select "Edit" from the dropdown
3. Modify any fields across the 3 steps
4. Click "Update Project" to save changes

### Viewing Project Details

1. Click the three dots menu on any project row
2. Select "View Details" from the dropdown
3. Browse through all project information including images and rich content

### Filtering and Search

- Use the search bar to find projects by title, description, category, or tags
- Filter by category using the category dropdown
- Filter by status (active, inactive, draft)
- Filter by featured status
- Combine multiple filters for precise results

### File Upload Guidelines

- **Big Image**: Main project showcase image
- **Mini Images**: Additional project screenshots or details
- Maximum file size: 10MB per image
- Supported formats: JPEG, PNG, GIF, WebP
- Images are automatically uploaded to AWS S3

## Technical Implementation

### State Management
- React hooks for local state management
- Centralized API calls with error handling
- Loading states for better UX

### Form Validation
- Step-by-step validation
- Real-time error display
- File type and size validation

### Responsive Design
- Mobile-friendly table layout
- Responsive modal dialogs
- Adaptive grid layouts

### Performance Optimizations
- Pagination for large datasets
- Debounced search functionality
- Optimized re-renders with proper dependencies

## Integration Notes

- Follows the same pattern as the services management system
- Uses shadcn/ui components for consistent design
- Integrates with existing toast notification system
- Compatible with the current routing structure
