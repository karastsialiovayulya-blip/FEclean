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

export async function createOrderAPI(dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.ORDERS, {
      method: "POST",
      body: dataToSend,
    });
    console.log("API response for order creation:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to create order:", response.error);
      return {
        ok: false,
        data: null,
        error: response.error || response.message || "Failed to create order.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: "Something went wrong while creating the order.",
    };
  }
}
