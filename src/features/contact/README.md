# Contact Management System

A comprehensive contact management system for handling contact form submissions with advanced filtering, search, and CRUD operations.

## Features

✅ **Complete Contact Management**
- View all contact form submissions in a data table
- Advanced filtering by status, service, and priority
- Search functionality across name, email, and message
- Pagination support
- Sorting capabilities

✅ **CRUD Operations**
- Delete individual contacts
- Delete all contacts (bulk operation)
- View contact details with tooltips
- Status and priority management

✅ **Professional UI**
- Responsive data table with shadcn/ui components
- Status and priority badges with color coding
- Confirmation modals for delete operations
- Loading states and error handling

✅ **API Integration**
- Full integration with backend Contact API
- Support for all API endpoints from documentation
- Error handling and toast notifications
- Optimized API calls with proper request/response handling

## File Structure

```
src/features/contact/
├── components/
│   ├── api/
│   │   └── api.tsx              # API integration functions
│   └── table/
│       ├── column.tsx           # Table column definitions
│       ├── data-table.tsx       # Main data table component
│       └── delete-contact.tsx   # Delete confirmation modals
├── routes/
│   ├── index.tsx               # Route configuration
│   └── contact.tsx             # Main contact page
├── type/
│   └── contactType.ts          # TypeScript interfaces
└── README.md                   # This file
```

## API Endpoints Used

The system integrates with the following backend endpoints:

- `GET /api/contacts` - Get all contacts with pagination and filtering
- `GET /api/contacts/:id` - Get contact by ID
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `GET /api/contacts/statistics` - Get contact statistics
- `GET /api/contacts/status/:status` - Get contacts by status
- `GET /api/contacts/service/:service` - Get contacts by service

## Contact Schema

```typescript
interface ContactType {
  _id?: string;           // MongoDB ObjectId
  id?: number;            // Auto-increment ID
  name: string;           // Contact name
  email: string;          // Contact email
  phone: string;          // Contact phone
  service: string;        // Requested service
  message: string;        // Contact message
  status: "new" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}
```

## Available Services

- Web Development
- App Development
- Digital Marketing
- Software Development
- SEO
- UI/UX Design
- E-commerce Development
- Consulting

## Status Management

- **New**: Newly submitted contacts
- **In Progress**: Contacts being processed
- **Resolved**: Contacts that have been resolved
- **Closed**: Contacts that are closed

## Priority Levels

- **Low**: Low priority contacts
- **Medium**: Medium priority contacts (default)
- **High**: High priority contacts
- **Urgent**: Urgent contacts requiring immediate attention

## Usage

1. Navigate to "Contact Us" in the sidebar
2. View all contact submissions in the data table
3. Use filters to find specific contacts by status, service, or priority
4. Search across contact details using the search bar
5. Click the three dots menu to view, edit, or delete contacts
6. Use "Delete All" button to remove all contacts (with confirmation)

## Navigation

The contact management system is accessible through:
- Sidebar menu: "Contact Us"
- URL: `/contact`

## Components Used

- **shadcn/ui**: Dialog, Button, Input, Select, Table, Badge, Tooltip
- **React Table**: For advanced table functionality
- **React Router**: For navigation
- **React Toastify**: For notifications
- **Lucide React**: For icons

## Error Handling

- API error responses are handled gracefully
- Toast notifications for success/error states
- Loading states during API calls
- Fallback UI for empty states

## Future Enhancements

- Edit contact functionality
- Detailed contact view modal
- Export contacts to CSV/Excel
- Contact statistics dashboard
- Email integration for responses
- Contact assignment to team members
