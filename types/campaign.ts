import { CampaignCategory, CampaignStatus } from './enums';

export interface Campaign {
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: CampaignCategory;
  goalAmount?: number;
  currentAmount?: number;
  images: string[];
  location: {
    city: string;
    province: string;
    country: string;
  };
  recipient: {
    name: string;
    age?: number;
    condition: string;
  };
  creator: {
    relation: string;
    contact: string;
  };
  tags?: string[];
  status?: CampaignStatus;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  publishedAt?: string | null;
  verificationNotes?: string | null;
  rejectionReason?: string | null;
  isFeatured?: boolean;
}

export interface CampaignFormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: CampaignCategory;
  goalAmount?: number;
  images: string[];
  location: {
    city: string;
    province: string;
    country: string;
  };
  recipient: {
    name: string;
    age?: number;
    condition: string;
  };
  creator: {
    relation: string;
    contact: string;
  };
  tags?: string[];
}
