# Service Management System

A comprehensive service management system with multi-step modal dialogs, rich text editing, file uploads, and advanced filtering capabilities.

## Features

### ✅ Multi-Step Service Creation/Editing Modal
- **Step 1**: Basic Information (title, description, category, status, featured flag, tags, SVG icon)
- **Step 2**: Detailed Description (rich text editor with Tiptap, video upload)
- **Step 3**: Important Points & Q&A (dynamic arrays with add/remove functionality)

### ✅ Rich Text Editor (Tiptap)
- Bold, italic, headings (H1, H2, H3)
- Bullet lists and numbered lists
- Blockquotes
- Links and images
- Tables with creation functionality
- Undo/redo support
- Responsive toolbar with icons

### ✅ File Upload Support
- **SVG Icons**: Max 2MB, SVG format only
- **Videos**: Max 100MB, multiple formats (MP4, WebM, MOV, AVI, WMV, MKV)
- File validation with proper error messages
- File size display

### ✅ Advanced Data Table
- Search functionality across all text fields
- Category filtering
- Status filtering (active, inactive, draft)
- Featured services filtering
- Pagination support
- Sortable columns
- Action dropdown with view/edit/delete options

### ✅ Service Categories
- Web Development
- Mobile App Development
- Digital Marketing
- SEO Services
- UI/UX Design
- E-commerce Solutions
- Cloud Services
- Data Analytics
- Consulting
- Maintenance & Support
- Custom Software
- API Development
- DevOps
- Quality Assurance
- Other

### ✅ API Integration
- Full CRUD operations (Create, Read, Update, Delete)
- Proper error handling and loading states
- Toast notifications for user feedback
- File upload with FormData
- Pagination and filtering support

## Components Structure

```
src/features/servicesfolder/
├── api/
│   └── serviceApi.ts          # API client functions
├── components/
│   ├── ServiceModal.tsx       # Multi-step create/edit modal
│   ├── ServiceDataTable.tsx   # Data table with filtering
│   ├── ServiceViewModal.tsx   # Service details view modal
│   ├── ServiceTiptapEditor.tsx # Rich text editor component
│   └── servicefoldermain.tsx  # Main container component
├── types/
│   └── serviceTypes.ts        # TypeScript interfaces
└── README.md                  # This file
```

## API Endpoints

The system integrates with the following API endpoints:

- `POST /api/services` - Create new service
- `GET /api/services` - Get all services with filtering/pagination
- `GET /api/services/:id` - Get service by ID (increments view count)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set `VITE_API_BASE_URL` to your API base URL (default: http://localhost:8001)

## Usage

### Creating a Service

1. Click "Add New Service" button
2. **Step 1**: Fill in basic information
   - Enter title and description
   - Select category and status
   - Toggle featured flag if needed
   - Add tags (press Enter or click Add)
   - Upload SVG icon (optional)
3. **Step 2**: Add detailed content
   - Use the rich text editor for detailed description
   - Upload service video (optional)
4. **Step 3**: Add important points and Q&A
   - Add multiple important points
   - Create questions and answers
   - Click "Create Service" to save

### Editing a Service

1. Click the three dots menu on any service row
2. Select "Edit"
3. Follow the same 3-step process
4. Existing data will be pre-filled
5. Click "Update Service" to save changes

### Viewing Service Details

1. Click the three dots menu on any service row
2. Select "View Details"
3. See all service information in a formatted view
4. View media files (icon/video) by clicking "View" buttons

### Filtering and Search

- Use the search box to find services by title, description, or tags
- Filter by category using the category dropdown
- Filter by status (active, inactive, draft)
- Filter by featured status
- Use pagination controls to navigate through results

## File Upload Specifications

### SVG Icons
- **Max Size**: 2MB
- **Format**: SVG only
- **Storage**: AWS S3 under `services/icons/` folder

### Videos
- **Max Size**: 100MB (≈5 minutes)
- **Formats**: MP4, WebM, MOV, AVI, WMV, MKV
- **Storage**: AWS S3 under `services/videos/` folder

## Dependencies

- React 18+
- TypeScript
- Tiptap (rich text editor)
- Shadcn/ui components
- Tailwind CSS
- React Hook Form
- Axios (API calls)
- React Toastify (notifications)
- Lucide React (icons)

## Notes

- All form validation is handled client-side with proper error messages
- File uploads are validated for size and type before submission
- The system supports both create and update operations with the same modal
- Rich text content is stored as HTML and properly sanitized for display
- The data table is fully responsive and works on mobile devices
- Toast notifications provide feedback for all user actions
