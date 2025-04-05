export interface Campaign {
  id?: string;
  title: string;
  description: string;
  image?: string;
  raised: number;
  goal: number;
  category?: string;
  organizer?: string;
  createdAt?: string;
  endDate?: string;
}
