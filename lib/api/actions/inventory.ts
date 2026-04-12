import { ApiEndpoints } from "@/lib/api/endpoint";
import { Inventory } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function getInventories() {
  try {
    const response = await apiFetch<Inventory[]>(ApiEndpoints.INVENTORY, { method: "GET" });
    if (response.ok) {
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}

export async function createInventory(prevState: any, dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.INVENTORY, {
      method: "POST",
      body: dataToSend,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function editInventory(prevState: any, dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.INVENTORY_ID(dataToSend.id), {
      method: "PUT",
      body: dataToSend,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}
