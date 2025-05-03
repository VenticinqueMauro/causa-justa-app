/**
 * DTOs de respuesta del backend
 */

import { CampaignStatus, DonationStatus, UserRole } from './enums';

export interface UserInfoDto {
  id: string;
  fullName: string;
  email: string;
}

export interface CampaignResponseDto {
  id: string;
  title: string;
  description: string;
  slug: string;
  status: CampaignStatus;
  goalAmount: number;
  raisedAmount: number;
  createdAt: Date;
  publishedAt: Date | null;
  endDate: Date | null;
  images: string[];
  user: UserInfoDto;
}

export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    verified: boolean;
    needsRoleSelection?: boolean;
    authMethod?: 'email' | 'google';
  }
}

export interface PaginatedResponseDto<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
}
