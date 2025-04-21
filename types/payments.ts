/**
 * Interfaces relacionadas con pagos y donaciones
 */

import { DonationStatus } from './enums';

export interface PaymentPreference {
  id: string;
  status: string;
  init_point: string;
}

export interface Donation {
  id: string;
  amount: number;
  status: DonationStatus;
  campaignId: string;
  userId?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
