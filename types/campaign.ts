export enum CampaignCategory {
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  FOOD = 'FOOD',
  PEOPLE = 'PEOPLE',
  OTHERS = 'OTHERS'
}

export enum CampaignStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface Campaign {
  id?: string;
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
  status?: CampaignStatus;
  createdAt?: string;
  updatedAt?: string;
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
