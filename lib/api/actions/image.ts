"use server";
import { ApiEndpoints } from "@/lib/api/endpoint";
import { CleanImage } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function uploadImageAction(prevState: any, formData: FormData) {
  if (formData.get("actionType") === "reset") {
    return null;
  }

  try {
    const response = await apiFetch(ApiEndpoints.IMAGES, {
      method: "POST",
      body: formData,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (e) {
    return { success: false, message: "Something went wrong", error: (e as Error).message };
  }
}

export async function deleteImagesAction(prevState: any, selectedImages: number[]) {
  try {
    const response = await apiFetch(ApiEndpoints.IMAGES, {
      method: "DELETE",
      body: selectedImages,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (e) {
    return { success: false, message: "Something went wrong", error: (e as Error).message };
  }
}

export async function getImagesAPI() {
  try {
    const response = await apiFetch<CleanImage[]>(ApiEndpoints.IMAGES, { method: "GET" });
    if (response.ok) {
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}
