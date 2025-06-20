export interface BlogType {
    id?: number; // Auto-increment number in your schema (optional)
    _id?: string; // MongoDB ObjectId (primary identifier)
    title: string;
    description: string;
    imageUrl?: string; // Your schema uses 'imageUrl'
    category: string;
    keywords: string[]; // Array of strings in your schema
    views: number;
    createdAt: string;
    updatedAt: string;
}