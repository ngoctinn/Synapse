import { Equipment } from "@/features/equipment/model/types";

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
}

export type Resource = RoomType | Equipment;
