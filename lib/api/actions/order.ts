"use server";
import { ApiEndpoints } from "@/lib/api/endpoint";
import { CleanerAvailabilitySlot } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function getSlotsAPI(dataToSend: any) {
  try {
    const response = await apiFetch<CleanerAvailabilitySlot[]>(ApiEndpoints.ORDERS_SLOTS, {
      method: "POST",
      body: dataToSend,
    });
    console.log("API response for slots:");
    if (response.ok) {
      return response.data;
    } else {
      console.error("Failed to fetch slots:", response.error);
      return [];
    }
  } catch (e) {
    return [];
  }
}
