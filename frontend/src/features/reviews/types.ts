export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  rating: ReviewRating;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCreateInput {
  bookingId: string;
  rating: ReviewRating;
  comment?: string;
}

export interface ReviewUpdateInput {
  comment?: string;
}

export interface ReviewFilters {
  rating?: ReviewRating[];
  serviceId?: string;
  search?: string; // customer name, service name
  fromDate?: Date;
  toDate?: Date;
}
