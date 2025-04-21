/**
 * DTOs de solicitud para el backend
 */

import { CampaignStatus, DonationStatus } from './enums';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface CreateCampaignDto {
  title: string;
  description: string;
  goalAmount: number;
  endDate?: Date;
  images?: string[];
}

export interface FindCampaignsDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
}

export interface FindDonationsDto {
  page?: number;
  limit?: number;
  status?: DonationStatus;
  campaignId?: string;
  startDate?: string;
  endDate?: string;
}
