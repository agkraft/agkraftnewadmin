export interface SocialMedia {
  website?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
}

export interface TeamType {
  id?: number; // Auto-increment number in your schema (optional)
  _id?: string; // MongoDB ObjectId (primary identifier)
  name: string;
  jobCategory: string;
  imageUrl?: string; // Your schema uses 'imageUrl'
  socialMedia: SocialMedia;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Job categories enum matching backend schema
export const JOB_CATEGORIES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Project Manager",
  "DevOps Engineer",
  "Data Scientist",
  "Mobile App Developer",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "Content Writer",
  "Business Analyst",
  "Quality Assurance",
  "Team Lead",
  "CTO",
  "CEO",
  "Founder",
  "Co-Founder",
  "Technical Architect",
  "Product Manager"
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];
