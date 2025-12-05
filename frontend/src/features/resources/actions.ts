"use server";

import { mockEquipment } from "@/features/equipment/model/mocks";
import { Equipment } from "@/features/equipment/model/types";
import { mockRoomTypes } from "./model/mocks";
import { RoomType } from "./model/types";

export async function getRoomTypes(): Promise<RoomType[]> {
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 500));
  return mockRoomTypes;
}

export async function getEquipmentList(): Promise<Equipment[]> {
  // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 500));
  return mockEquipment;
}
