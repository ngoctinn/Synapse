
export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
  imageUrl: string;
  isPopular?: boolean;
}
